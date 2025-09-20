import grpc
import sys, os
sys.path.append(os.path.join(os.path.dirname(__file__), "grpc_files"))
from concurrent import futures
from grpc_files import schema_pb2, schema_pb2_grpc
from google.protobuf import empty_pb2


import os
import smtplib
import requests
import base64
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from groq import Groq
from typing import Optional
import logging
# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
from dotenv import load_dotenv
import os
load_dotenv()
# Load environmen
class PullRequestService(schema_pb2_grpc.PullRequestServiceServicer):
    def __init__(self):
        # Initialize Groq client
        self.groq_client = Groq(api_key=os.getenv('GROQ_API_KEY'))
        
        # SMTP configuration
        self.smtp_server = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
        self.smtp_port = int(os.getenv('SMTP_PORT', '587'))
        self.smtp_username = os.getenv('SMTP_USERNAME')
        self.smtp_password = os.getenv('SMTP_PASSWORD')
        self.from_email = os.getenv('FROM_EMAIL', self.smtp_username)

    def ProcessPullRequest(self, request, context):
        """Process pull request and generate release notes"""
        try:
            print(f"Processing PR #{request.pr_number} from {request.author}")
            print(f"Repo: {request.repo_url}")
            print(f"Branch: {request.branch}")
            print(f"Commit: {request.commit_hash}")
            print(f"Title: {request.title}")
            print(f"Email: {request.email}")
            
            # Fetch PR diff
            diff_content = self._fetch_pr_diff(
                request.repo_url, 
                request.commit_hash, 
                request.access_token
            )
            
            if not diff_content:
                logger.error("Failed to fetch PR diff")
                context.set_code(grpc.StatusCode.INTERNAL)
                context.set_details("Failed to fetch PR diff")
                return empty_pb2.Empty()
            
            # Generate release notes using Groq
            release_notes = self._generate_release_notes(
                request.title,
                request.description,
                diff_content,
                request.author
            )
            
            if not release_notes:
                logger.error("Failed to generate release notes")
                context.set_code(grpc.StatusCode.INTERNAL)
                context.set_details("Failed to generate release notes")
                return empty_pb2.Empty()
            
            # Send email
            email_sent = self._send_email(
                request.email,
                f"Release Notes for PR #{request.pr_number}: {request.title}",
                release_notes,
                request.repo_url,
                request.pr_number
            )
            
            if email_sent:
                print(f"Release notes successfully sent to {request.email}")
            else:
                logger.error("Failed to send email")
                context.set_code(grpc.StatusCode.INTERNAL)
                context.set_details("Failed to send email")
            
            return empty_pb2.Empty()
            
        except Exception as e:
            logger.error(f"Error processing PR: {str(e)}")
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details(f"Internal error: {str(e)}")
            return empty_pb2.Empty()

    def _fetch_pr_diff(self, repo_url: str, commit_hash: str, access_token: str) -> Optional[str]:
        """Fetch the diff for the pull request from GitHub"""
        try:
            # Extract owner and repo from URL
            # Assuming repo_url format: https://github.com/owner/repo
            parts = repo_url.rstrip('/').split('/')
            if len(parts) < 2:
                logger.error("Invalid repository URL format")
                return None
                
            owner = parts[-2]
            repo = parts[-1]
            
            # GitHub API endpoint for commit diff
            api_url = f"https://api.github.com/repos/{owner}/{repo}/commits/{commit_hash}"
            
            headers = {
                'Authorization': f'token {access_token}',
                'Accept': 'application/vnd.github.v3.diff'
            }
            
            response = requests.get(api_url, headers=headers, timeout=30)
            
            if response.status_code == 200:
                return response.text
            else:
                logger.error(f"GitHub API error: {response.status_code} - {response.text}")
                return None
                
        except Exception as e:
            logger.error(f"Error fetching PR diff: {str(e)}")
            return None

    def _generate_release_notes(self, title: str, description: str, diff_content: str, author: str) -> Optional[str]:
        """Generate release notes using Groq AI"""
        try:
            # Truncate diff if too long (Groq has token limits)
            max_diff_length = 8000
            if len(diff_content) > max_diff_length:
                diff_content = diff_content[:max_diff_length] + "\n... (diff truncated)"
            
            prompt = f"""
            Generate professional release notes for the following pull request:

            **PR Title:** {title}
            **Author:** {author}
            **Description:** {description or "No description provided"}

            **Code Changes:**
            ```diff
            {diff_content}
            ```

            Please create comprehensive release notes that include:
            1. A brief summary of the changes
            2. Key features or improvements added
            3. Bug fixes (if any)
            4. Breaking changes (if any)
            5. Technical details that might be relevant to developers

            Format the release notes in markdown with clear sections and bullet points.
            Keep it professional but accessible to both technical and non-technical stakeholders.
            """
            
            # Generate release notes using Groq
            chat_completion = self.groq_client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are a technical writer specializing in creating clear, comprehensive release notes for software projects. Focus on being accurate, concise, and helpful."
                    },
                    {
                        "role": "user", 
                        "content": prompt
                    }
                ],
                model="llama-3.3-70b-versatile",  # You can change this to other Groq models
                max_tokens=2000,
                temperature=0.3
            )
            
            return chat_completion.choices[0].message.content
            
        except Exception as e:
            logger.error(f"Error generating release notes with Groq: {str(e)}")
            return None

    def _send_email(self, to_email: str, subject: str, release_notes: str, repo_url: str, pr_number: int) -> bool:
        """Send release notes via email"""
        try:
            # Create message
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = self.from_email
            msg['To'] = to_email
            
            # Create HTML version of the email
            html_content = f"""
            <html>
            <head></head>
            <body>
                <h2>Release Notes Generated</h2>
                <p><strong>Repository:</strong> <a href="{repo_url}">{repo_url}</a></p>
                <p><strong>Pull Request:</strong> #{pr_number}</p>
                <hr>
                <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                    {self._markdown_to_html(release_notes)}
                </div>
                <hr>
                <p style="color: #666; font-size: 12px;">
                    This email was automatically generated by the PR Release Notes Service.
                </p>
            </body>
            </html>
            """
            
            # Create plain text version
            text_content = f"""
Release Notes Generated

Repository: {repo_url}
Pull Request: #{pr_number}

{release_notes}

---
This email was automatically generated by the PR Release Notes Service.
            """
            
            # Attach parts
            text_part = MIMEText(text_content, 'plain')
            html_part = MIMEText(html_content, 'html')
            
            msg.attach(text_part)
            msg.attach(html_part)
            
            # Send email
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.smtp_username, self.smtp_password)
                server.send_message(msg)
            
            return True
            
        except Exception as e:
            logger.error(f"Error sending email: {str(e)}")
            return False

    def _markdown_to_html(self, markdown_text: str) -> str:
        """Basic markdown to HTML conversion"""
        html = markdown_text
        
        # Convert headers
        html = html.replace('### ', '<h3>').replace('\n# ', '</h3>\n<h1>').replace('\n## ', '</h1>\n<h2>').replace('\n### ', '</h2>\n<h3>')
        
        # Convert bold
        html = html.replace('**', '<strong>').replace('**', '</strong>')
        
        # Convert bullet points
        lines = html.split('\n')
        in_list = False
        result_lines = []
        
        for line in lines:
            if line.strip().startswith('- ') or line.strip().startswith('* '):
                if not in_list:
                    result_lines.append('<ul>')
                    in_list = True
                result_lines.append(f'<li>{line.strip()[2:]}</li>')
            else:
                if in_list:
                    result_lines.append('</ul>')
                    in_list = False
                result_lines.append(line)
        
        if in_list:
            result_lines.append('</ul>')
        
        html = '\n'.join(result_lines)
        
        # Convert line breaks
        html = html.replace('\n', '<br>\n')
        
        return html # Because your RPC returns google.protobuf.Empty


def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    schema_pb2_grpc.add_PullRequestServiceServicer_to_server(PullRequestService(), server)
    server.add_insecure_port('[::]:50051')
    print("Server started at port 50051")
    server.start()
    server.wait_for_termination()


if __name__ == "__main__":
    serve()
