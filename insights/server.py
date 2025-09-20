import datetime
import grpc
import sys, os
sys.path.append(os.path.join(os.path.dirname(__file__), "grpc_files"))
sys.path.append(os.path.join(os.path.dirname(__file__), "utils"))
from utils.utils import *
from utils.agent import *
from concurrent import futures
from grpc_files import schema_pb2, schema_pb2_grpc
from google.protobuf import empty_pb2
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
import os
import smtplib
import requests
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from groq import Groq
from typing import Optional
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class PullRequestService(schema_pb2_grpc.PullRequestServiceServicer):

    def ProcessPullRequest(self, request, context):
        """Process pull request and generate release notes"""
        try:
            logger.info(f"Processing PR #{request.pr_number} from {request.author}")
            logger.info(f"Repo: {request.repo_url}")
            logger.info(f"Branch: {request.branch}")
            logger.info(f"Commit: {request.commit_hash}")
            logger.info(f"Title: {request.title}")
            logger.info(f"Email: {request.email}")
            
            # Fetch PR diff
            diff_result = fetch_pr_diff(
                request.repo_url, 
                request.commit_hash, 
                request.access_token
            )
            
            # Check if we got diff content or an error
            if "error" in diff_result:
                # Send error email to user
                error_message = diff_result["error"]
                logger.error(f"GitHub API error: {error_message}")
                
                send_error_email(
                    request.email,
                    f"Error Processing PR #{request.pr_number}: {request.title}",
                    error_message,
                    request.repo_url,
                    request.pr_number,
                    "GitHub API Access",
                    config=Config()
                )
                
                context.set_code(grpc.StatusCode.INTERNAL)
                context.set_details(f"GitHub API error: {error_message}")
                return empty_pb2.Empty()
            
            diff_content = diff_result.get("content")
            if not diff_content:
                error_message = "No diff content received from GitHub API"
                logger.error(error_message)
                
                send_error_email(
                    request.email,
                    f"Error Processing PR #{request.pr_number}: {request.title}",
                    error_message,
                    request.repo_url,
                    request.pr_number,
                    "Empty Diff Content",
                    config=Config()
                )
                
                context.set_code(grpc.StatusCode.INTERNAL)
                context.set_details("Failed to fetch PR diff")
                return empty_pb2.Empty()
            
            # Generate release notes using Groq
            try:
                agent = ReleaseNotesGenerator(config=Config())
                agentRequest = RequestModel(
                    repo_url=request.repo_url,
                    title=request.title,
                    author=request.author,
                    description=request.description if hasattr(request, 'description') else None,
                    diff_content=diff_content
                )
                response = agent.evaluate(agentRequest)
                release_notes = agent.generate_markdown_output(response)
                
                if not release_notes or release_notes.strip() == "":
                    raise Exception("Generated release notes are empty")
                    
            except Exception as ai_error:
                error_message = f"Failed to generate release notes using AI: {str(ai_error)}"
                logger.error(error_message)
                
                send_error_email(
                    request.email,
                    f"Error Processing PR #{request.pr_number}: {request.title}",
                    error_message,
                    request.repo_url,
                    request.pr_number,
                    "AI Generation",
                    config=Config()
                )
                
                context.set_code(grpc.StatusCode.INTERNAL)
                context.set_details("Failed to generate release notes")
                return empty_pb2.Empty()
            
            # Send email with release notes
            email_sent = send_email(
                request.email,
                f"Release Notes for PR #{request.pr_number}: {request.title}",
                release_notes,
                request.repo_url,
                request.pr_number,
                config=Config(),

            )
            
            if email_sent:
                logger.info(f"Release notes successfully sent to {request.email}")
            else:
                error_message = "Failed to send release notes email"
                logger.error(error_message)
                context.set_code(grpc.StatusCode.INTERNAL)
                context.set_details("Failed to send email")
            
            return empty_pb2.Empty()
            
        except Exception as e:
            error_message = f"Unexpected error: {str(e)}"
            logger.error(f"Error processing PR: {error_message}")
            
            # Try to send error email
            try:
                send_error_email(
                    request.email,
                    f"Error Processing PR #{request.pr_number}: {request.title}",
                    error_message,
                    request.repo_url,
                    request.pr_number,
                    "System Error",
                    config=Config()
                )
            except Exception as email_error:
                logger.error(f"Failed to send error email: {str(email_error)}")
            
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details(f"Internal error: {str(e)}")
            return empty_pb2.Empty()

#     def _send_email(self, to_email: str, subject: str, release_notes: str, repo_url: str, pr_number: int) -> bool:
#         """Send release notes via email"""
#         try:
#             # Validate email configuration
#             if not all([self.smtp_username, self.smtp_password]):
#                 logger.error("Email configuration is incomplete")
#                 return False
            
#             # Create message
#             msg = MIMEMultipart('alternative')
#             msg['Subject'] = subject
#             msg['From'] = self.from_email
#             msg['To'] = to_email
            
#             # Create HTML version of the email
#             html_content = f"""
#             <!DOCTYPE html>
#             <html>
#             <head>
#                 <meta charset="UTF-8">
#                 <meta name="viewport" content="width=device-width, initial-scale=1.0">
#                 <title>Release Notes</title>
#                 <style>
#                     body {{
#                         font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
#                         line-height: 1.6;
#                         color: #333;
#                         max-width: 800px;
#                         margin: 0 auto;
#                         padding: 20px;
#                         background-color: #f8f9fa;
#                     }}
#                     .container {{
#                         background-color: white;
#                         border-radius: 8px;
#                         padding: 30px;
#                         box-shadow: 0 2px 10px rgba(0,0,0,0.1);
#                     }}
#                     .header {{
#                         border-bottom: 3px solid #007bff;
#                         padding-bottom: 20px;
#                         margin-bottom: 30px;
#                     }}
#                     .header h1 {{
#                         color: #007bff;
#                         margin: 0;
#                         font-size: 28px;
#                     }}
#                     .meta-info {{
#                         background-color: #f8f9fa;
#                         padding: 15px;
#                         border-radius: 6px;
#                         margin-bottom: 25px;
#                     }}
#                     .meta-info p {{
#                         margin: 5px 0;
#                     }}
#                     .meta-info a {{
#                         color: #007bff;
#                         text-decoration: none;
#                     }}
#                     .content h2 {{
#                         color: #2c3e50;
#                         border-bottom: 2px solid #ecf0f1;
#                         padding-bottom: 8px;
#                         margin-top: 30px;
#                         margin-bottom: 15px;
#                     }}
#                     .content ul {{
#                         padding-left: 20px;
#                     }}
#                     .content li {{
#                         margin-bottom: 8px;
#                     }}
#                     .footer {{
#                         margin-top: 40px;
#                         padding-top: 20px;
#                         border-top: 1px solid #ecf0f1;
#                         color: #6c757d;
#                         font-size: 14px;
#                         text-align: center;
#                     }}
#                 </style>
#             </head>
#             <body>
#                 <div class="container">
#                     <div class="header">
#                         <h1>🚀 Release Notes Generated</h1>
#                     </div>
                    
#                     <div class="meta-info">
#                         <p><strong>Repository:</strong> <a href="{repo_url}" target="_blank">{repo_url}</a></p>
#                         <p><strong>Pull Request:</strong> <a href="{repo_url}/pull/{pr_number}" target="_blank">#{pr_number}</a></p>
#                         <p><strong>Generated:</strong> {self._get_current_timestamp()}</p>
#                     </div>
                    
#                     <div class="content">
#                         {self._markdown_to_html(release_notes)}
#                     </div>
                    
#                     <div class="footer">
#                         <p>This email was automatically generated by the PR Release Notes Service.</p>
#                         <p>Generated with ❤️ for better release management</p>
#                     </div>
#                 </div>
#             </body>
#             </html>
#             """
            
#             # Create plain text version
#             text_content = f"""
# 🚀 RELEASE NOTES GENERATED
# {'=' * 50}

# Repository: {repo_url}
# Pull Request: #{pr_number}
# Generated: {self._get_current_timestamp()}

# {self._clean_markdown_for_text(release_notes)}

# {'=' * 50}
# This email was automatically generated by the PR Release Notes Service.
#             """
            
#             # Attach parts
#             text_part = MIMEText(text_content, 'plain', 'utf-8')
#             html_part = MIMEText(html_content, 'html', 'utf-8')
            
#             msg.attach(text_part)
#             msg.attach(html_part)
            
#             # Send email
#             with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
#                 server.starttls()
#                 server.login(self.smtp_username, self.smtp_password)
#                 server.send_message(msg)
            
#             logger.info(f"Release notes email sent successfully to {to_email}")
#             return True
            
#         except Exception as e:
#             logger.error(f"Error sending email to {to_email}: {str(e)}")
#             return False

    
#     def _markdown_to_html(self, markdown_text: str) -> str:
#         """Enhanced markdown to HTML conversion"""
#         if not markdown_text:
#             return "<p>No content available.</p>"
        
#         html = markdown_text
        
#         # Convert headers
#         html = re.sub(r'^### (.*?)$', r'<h3>\1</h3>', html, flags=re.MULTILINE)
#         html = re.sub(r'^## (.*?)$', r'<h2>\1</h2>', html, flags=re.MULTILINE)
#         html = re.sub(r'^# (.*?)$', r'<h1>\1</h1>', html, flags=re.MULTILINE)
        
#         # Convert bold and italic text
#         html = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', html)
#         html = re.sub(r'\*(.*?)\*', r'<em>\1</em>', html)
        
#         # Convert inline code
#         html = re.sub(r'`([^`]+)`', r'<code>\1</code>', html)
        
#         # Convert links
#         html = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', r'<a href="\2" target="_blank">\1</a>', html)
        
#         # Process lists
#         lines = html.split('\n')
#         result_lines = []
#         in_list = False
        
#         for line in lines:
#             stripped = line.strip()
#             if stripped.startswith('- ') or stripped.startswith('* '):
#                 if not in_list:
#                     result_lines.append('<ul>')
#                     in_list = True
#                 content = stripped[2:].strip()
#                 result_lines.append(f'<li>{content}</li>')
#             else:
#                 if in_list:
#                     result_lines.append('</ul>')
#                     in_list = False
#                 if stripped:
#                     result_lines.append(f'<p>{line}</p>')
        
#         if in_list:
#             result_lines.append('</ul>')
        
#         return '\n'.join(result_lines)

#     def _clean_markdown_for_text(self, markdown_text: str) -> str:
#         """Clean markdown for plain text email version"""
#         if not markdown_text:
#             return "No content available."
        
#         text = markdown_text
#         text = re.sub(r'^#{1,3} ', '', text, flags=re.MULTILINE)
#         text = re.sub(r'\*\*(.*?)\*\*', r'\1', text)
#         text = re.sub(r'\*(.*?)\*', r'\1', text)
#         text = re.sub(r'`([^`]+)`', r'\1', text)
#         text = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', text)
        
#         return text



def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    schema_pb2_grpc.add_PullRequestServiceServicer_to_server(PullRequestService(), server)
    server.add_insecure_port('[::]:50051')
    logger.info("Server started at port 50051")
    server.start()
    server.wait_for_termination()

if __name__ == "__main__":
    serve()