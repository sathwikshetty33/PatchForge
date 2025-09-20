from datetime import datetime
import requests
import logging
import smtplib
import requests
from typing import Dict, Union
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
# Configure logging
from .models import *
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
from typing import Optional

def fetch_pr_diff(repo_url: str, commit_hash: str, access_token: str) -> Dict[str, Union[str, None]]:
    """
    Fetch the diff for the pull request from GitHub
    Returns a dictionary with either 'content' or 'error' key
    """
    try:
        # Extract owner and repo from URL
        # Assuming repo_url format: https://github.com/owner/repo
        parts = repo_url.rstrip('/').split('/')
        if len(parts) < 2:
            error_msg = "Invalid repository URL format"
            logger.error(error_msg)
            return {"error": error_msg}
            
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
            if response.text.strip():
                return {"content": response.text}
            else:
                return {"error": "Empty diff content received from GitHub API"}
        else:
            error_msg = f"GitHub API error: {response.status_code} - {response.text}"
            logger.error(error_msg)
            return {"error": error_msg}
            
    except requests.exceptions.Timeout:
        error_msg = "GitHub API request timed out"
        logger.error(error_msg)
        return {"error": error_msg}
    except requests.exceptions.RequestException as e:
        error_msg = f"GitHub API request failed: {str(e)}"
        logger.error(error_msg)
        return {"error": error_msg}
    except Exception as e:
        error_msg = f"Error fetching PR diff: {str(e)}"
        logger.error(error_msg)
        return {"error": error_msg}

# def generate_release_notes(self, title: str, description: str, diff_content: str, author: str) -> Optional[str]:
#         """Generate release notes using Groq AI"""
#         try:
#             # Truncate diff if too long (Groq has token limits)
#             max_diff_length = 8000
#             if len(diff_content) > max_diff_length:
#                 diff_content = diff_content[:max_diff_length] + "\n... (diff truncated)"
            
#             prompt = f"""
#             Generate professional release notes for the following pull request:

#             **PR Title:** {title}
#             **Author:** {author}
#             **Description:** {description or "No description provided"}

#             **Code Changes:**
#             ```diff
#             {diff_content}
#             ```

#             Please create comprehensive release notes that include:
#             1. A brief summary of the changes
#             2. Key features or improvements added
#             3. Bug fixes (if any)
#             4. Breaking changes (if any)
#             5. Technical details that might be relevant to developers

#             Format the release notes in markdown with clear sections and bullet points.
#             Keep it professional but accessible to both technical and non-technical stakeholders.
#             """
            
#             # Generate release notes using Groq
#             chat_completion = self.groq_client.chat.completions.create(
#                 messages=[
#                     {
#                         "role": "system",
#                         "content": "You are a technical writer specializing in creating clear, comprehensive release notes for software projects. Focus on being accurate, concise, and helpful."
#                     },
#                     {
#                         "role": "user", 
#                         "content": prompt
#                     }
#                 ],
#                 model="llama-3.1-70b-versatile",  # You can change this to other Groq models
#                 max_tokens=2000,
#                 temperature=0.3
#             )
            
#             return chat_completion.choices[0].message.content
            
#         except Exception as e:
#             logger.error(f"Error generating release notes with Groq: {str(e)}")
#            return None
import smtplib
import logging
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import re

logger = logging.getLogger(__name__)

def send_email(to_email: str, subject: str, release_notes: str, repo_url: str, pr_number: int,config: Config) -> bool:
    """Send release notes via email"""
    try:
        # Create message
        msg = MIMEMultipart('alternative')
        msg['Subject'] = subject
        msg['From'] = config.FROM_EMAIL
        msg['To'] = to_email
        
        # Create HTML version of the email
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Release Notes</title>
            <style>
                body {{
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #f8f9fa;
                }}
                .container {{
                    background-color: white;
                    border-radius: 8px;
                    padding: 30px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }}
                .header {{
                    border-bottom: 3px solid #007bff;
                    padding-bottom: 20px;
                    margin-bottom: 30px;
                }}
                .header h1 {{
                    color: #007bff;
                    margin: 0;
                    font-size: 28px;
                }}
                .meta-info {{
                    background-color: #f8f9fa;
                    padding: 15px;
                    border-radius: 6px;
                    margin-bottom: 25px;
                }}
                .meta-info p {{
                    margin: 5px 0;
                }}
                .meta-info a {{
                    color: #007bff;
                    text-decoration: none;
                }}
                .meta-info a:hover {{
                    text-decoration: underline;
                }}
                .content h2 {{
                    color: #2c3e50;
                    border-bottom: 2px solid #ecf0f1;
                    padding-bottom: 8px;
                    margin-top: 30px;
                    margin-bottom: 15px;
                }}
                .content h3 {{
                    color: #34495e;
                    margin-top: 25px;
                    margin-bottom: 12px;
                }}
                .content ul {{
                    padding-left: 20px;
                }}
                .content li {{
                    margin-bottom: 8px;
                }}
                .breaking-changes {{
                    background-color: #fff3cd;
                    border: 1px solid #ffeaa7;
                    border-radius: 6px;
                    padding: 15px;
                    margin: 20px 0;
                }}
                .security-updates {{
                    background-color: #d1ecf1;
                    border: 1px solid #bee5eb;
                    border-radius: 6px;
                    padding: 15px;
                    margin: 20px 0;
                }}
                .footer {{
                    margin-top: 40px;
                    padding-top: 20px;
                    border-top: 1px solid #ecf0f1;
                    color: #6c757d;
                    font-size: 14px;
                    text-align: center;
                }}
                .emoji {{
                    font-size: 18px;
                    margin-right: 8px;
                }}
                code {{
                    background-color: #f1f3f4;
                    padding: 2px 6px;
                    border-radius: 3px;
                    font-family: 'Courier New', monospace;
                    font-size: 14px;
                }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🚀 Release Notes Generated</h1>
                </div>
                
                <div class="meta-info">
                    <p><strong>Repository:</strong> <a href="{repo_url}" target="_blank">{repo_url}</a></p>
                    <p><strong>Pull Request:</strong> <a href="{repo_url}/pull/{pr_number}" target="_blank">#{pr_number}</a></p>
                    <p><strong>Generated:</strong> {_get_current_timestamp()}</p>
                </div>
                
                <div class="content">
                    {_markdown_to_html(release_notes)}
                </div>
                
                <div class="footer">
                    <p>This email was automatically generated by the PR Release Notes Service.</p>
                    <p>Generated with ❤️ for better release management</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        # Create plain text version
        text_content = f"""
🚀 RELEASE NOTES GENERATED
{'=' * 50}

Repository: {repo_url}
Pull Request: #{pr_number}
Generated: {_get_current_timestamp()}

{_clean_markdown_for_text(release_notes)}

{'=' * 50}
This email was automatically generated by the PR Release Notes Service.
        """
        
        # Attach parts
        text_part = MIMEText(text_content, 'plain', 'utf-8')
        html_part = MIMEText(html_content, 'html', 'utf-8')
        
        msg.attach(text_part)
        msg.attach(html_part)
        
        # Send email
        with smtplib.SMTP(config.SMTP_SERVER, config.SMTP_PORT) as server:
            server.starttls()
            server.login(config.SMTP_USERNAME, config.SMTP_PASSWORD)
            server.send_message(msg)
        
        logger.info(f"Release notes email sent successfully to {to_email}")
        return True
        
    except Exception as e:
        logger.error(f"Error sending email to {to_email}: {str(e)}")
        return False

def _markdown_to_html(markdown_text: str) -> str:
    """Enhanced markdown to HTML conversion optimized for release notes structure"""
    if not markdown_text:
        return "<p>No content available.</p>"
    
    html = markdown_text
    
    # Convert headers with proper hierarchy and styling
    html = re.sub(r'^### (.*?)$', r'<h3>\1</h3>', html, flags=re.MULTILINE)
    html = re.sub(r'^## (.*?)$', r'<h2>\1</h2>', html, flags=re.MULTILINE)
    html = re.sub(r'^# (.*?)$', r'<h1>\1</h1>', html, flags=re.MULTILINE)
    
    # Handle special sections with custom styling
    html = re.sub(r'<h2>⚠️ Breaking Changes</h2>', r'<div class="breaking-changes"><h2>⚠️ Breaking Changes</h2>', html)
    html = re.sub(r'<h2>🔒 Security Updates</h2>', r'<div class="security-updates"><h2>🔒 Security Updates</h2>', html)
    
    # Convert bold and italic text
    html = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', html)
    html = re.sub(r'\*(.*?)\*', r'<em>\1</em>', html)
    
    # Convert inline code
    html = re.sub(r'`([^`]+)`', r'<code>\1</code>', html)
    
    # Convert links
    html = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', r'<a href="\2" target="_blank">\1</a>', html)
    
    # Process lists more carefully
    lines = html.split('\n')
    result_lines = []
    in_list = False
    list_items = []
    
    for line in lines:
        stripped = line.strip()
        if stripped.startswith('- ') or stripped.startswith('* '):
            if not in_list:
                in_list = True
                list_items = []
            # Extract the content after the bullet point
            content = stripped[2:].strip()
            list_items.append(f'<li>{content}</li>')
        else:
            if in_list:
                # End the current list
                result_lines.append('<ul>')
                result_lines.extend(list_items)
                result_lines.append('</ul>')
                in_list = False
                list_items = []
            
            if stripped:  # Only add non-empty lines
                result_lines.append(line)
    
    # Handle case where list is at the end
    if in_list:
        result_lines.append('<ul>')
        result_lines.extend(list_items)
        result_lines.append('</ul>')
    
    html = '\n'.join(result_lines)
    
    # Close special divs
    html = re.sub(r'(<div class="breaking-changes">.*?)</div>', r'\1</div></div>', html, flags=re.DOTALL)
    html = re.sub(r'(<div class="security-updates">.*?)</div>', r'\1</div></div>', html, flags=re.DOTALL)
    
    # Convert remaining line breaks to paragraphs
    paragraphs = html.split('\n\n')
    formatted_paragraphs = []
    
    for paragraph in paragraphs:
        paragraph = paragraph.strip()
        if paragraph and not paragraph.startswith('<'):
            # Only wrap in <p> if it's not already an HTML element
            formatted_paragraphs.append(f'<p>{paragraph}</p>')
        elif paragraph:
            formatted_paragraphs.append(paragraph)
    
    return '\n'.join(formatted_paragraphs)

def _clean_markdown_for_text(markdown_text: str) -> str:
    """Clean markdown for plain text email version"""
    if not markdown_text:
        return "No content available."
    
    text = markdown_text
    
    # Remove markdown formatting but keep structure
    text = re.sub(r'^#{1,3} ', '', text, flags=re.MULTILINE)  # Remove header markers
    text = re.sub(r'\*\*(.*?)\*\*', r'\1', text)  # Remove bold
    text = re.sub(r'\*(.*?)\*', r'\1', text)  # Remove italic
    text = re.sub(r'`([^`]+)`', r'\1', text)  # Remove inline code
    text = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', text)  # Convert links to text
    
    # Add proper spacing for sections
    text = re.sub(r'\n(🚀|🐛|⚠️|⚡|🔒|🔧|🚨|📋)', r'\n\n\1', text)
    
    return text

def _get_current_timestamp() -> str:
    """Get current timestamp in a readable format"""
    from datetime import datetime
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S UTC")

def _send_error_email(to_email: str, subject: str, error_message: str, repo_url: str, pr_number: int, error_type: str,config: Config) -> bool:
    """Send error notification email"""
    try:
        msg = MIMEMultipart('alternative')
        msg['Subject'] = f"❌ {subject}"
        msg['From'] = config.from_email
        msg['To'] = to_email
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .error-container {{ background-color: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }}
                .error-header {{ background-color: #dc3545; color: white; padding: 20px; border-radius: 6px; margin-bottom: 20px; }}
                .error-details {{ background-color: #f8f9fa; padding: 15px; border-radius: 6px; margin: 20px 0; }}
                .footer {{ margin-top: 30px; padding-top: 20px; border-top: 1px solid #ecf0f1; color: #6c757d; font-size: 14px; }}
            </style>
        </head>
        <body>
            <div class="error-container">
                <div class="error-header">
                    <h1>❌ Release Notes Generation Failed</h1>
                </div>
                
                <div class="error-details">
                    <p><strong>Repository:</strong> <a href="{repo_url}">{repo_url}</a></p>
                    <p><strong>Pull Request:</strong> <a href="{repo_url}/pull/{pr_number}">#{pr_number}</a></p>
                    <p><strong>Error Type:</strong> {error_type}</p>
                    <p><strong>Error Message:</strong> {error_message}</p>
                    <p><strong>Timestamp:</strong> {_get_current_timestamp()}</p>
                </div>
                
                <p>We apologize for the inconvenience. Please try again later or contact support if the issue persists.</p>
                
                <div class="footer">
                    <p>This error notification was automatically generated by the PR Release Notes Service.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        text_content = f"""
❌ RELEASE NOTES GENERATION FAILED
{'=' * 50}

Repository: {repo_url}
Pull Request: #{pr_number}
Error Type: {error_type}
Error Message: {error_message}
Timestamp: {_get_current_timestamp()}

We apologize for the inconvenience. Please try again later or contact support if the issue persists.

{'=' * 50}
This error notification was automatically generated by the PR Release Notes Service.
        """
        
        text_part = MIMEText(text_content, 'plain', 'utf-8')
        html_part = MIMEText(html_content, 'html', 'utf-8')
        
        msg.attach(text_part)
        msg.attach(html_part)
        
        with smtplib.SMTP(config.SMTP_SERVER, config.SMTP_PORT) as server:
            server.starttls()
            server.login(config.SMTP_USERNAME, config.SMTP_PASSWORD)
            server.send_message(msg)
        
        logger.info(f"Error notification email sent to {to_email}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send error email to {to_email}: {str(e)}")
        return False

def send_error_email(to_email: str, subject: str, error_message: str, repo_url: str, pr_number: int, error_type: str,config: Config) -> bool:
        """Send error notification email"""
        try:
            # Validate email configuration
            if not all([config.SMTP_USERNAME, config.SMTP_PASSWORD, config.FROM_EMAIL]):
                logger.error("Email configuration is incomplete - cannot send error email")
                return False
            
            msg = MIMEMultipart('alternative')
            msg['Subject'] = f"❌ {subject}"
            msg['From'] = config.FROM_EMAIL
            msg['To'] = to_email
            
            html_content = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                    .error-container {{ background-color: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }}
                    .error-header {{ background-color: #dc3545; color: white; padding: 20px; border-radius: 6px; margin-bottom: 20px; }}
                    .error-details {{ background-color: #f8f9fa; padding: 15px; border-radius: 6px; margin: 20px 0; }}
                    .footer {{ margin-top: 30px; padding-top: 20px; border-top: 1px solid #ecf0f1; color: #6c757d; font-size: 14px; }}
                </style>
            </head>
            <body>
                <div class="error-container">
                    <div class="error-header">
                        <h1>❌ Release Notes Generation Failed</h1>
                    </div>
                    
                    <div class="error-details">
                        <p><strong>Repository:</strong> <a href="{repo_url}">{repo_url}</a></p>
                        <p><strong>Pull Request:</strong> <a href="{repo_url}/pull/{pr_number}">#{pr_number}</a></p>
                        <p><strong>Error Type:</strong> {error_type}</p>
                        <p><strong>Error Message:</strong> {error_message}</p>
                        <p><strong>Timestamp:</strong> {_get_current_timestamp()}</p>
                    </div>
                    
                    <p>We apologize for the inconvenience. Please try again later or contact support if the issue persists.</p>
                    
                    <div class="footer">
                        <p>This error notification was automatically generated by the PR Release Notes Service.</p>
                    </div>
                </div>
            </body>
            </html>
            """
            
            text_content = f"""
❌ RELEASE NOTES GENERATION FAILED
{'=' * 50}

Repository: {repo_url}
Pull Request: #{pr_number}
Error Type: {error_type}
Error Message: {error_message}
Timestamp: {_get_current_timestamp()}

We apologize for the inconvenience. Please try again later or contact support if the issue persists.

{'=' * 50}
This error notification was automatically generated by the PR Release Notes Service.
            """
            
            text_part = MIMEText(text_content, 'plain', 'utf-8')
            html_part = MIMEText(html_content, 'html', 'utf-8')
            
            msg.attach(text_part)
            msg.attach(html_part)
            
            with smtplib.SMTP(config.SMTP_SERVER, config.SMTP_PORT) as server:
                server.starttls()
                server.login(config.SMTP_USERNAME, config.SMTP_PASSWORD)
                server.send_message(msg)
            
            logger.info(f"Error notification email sent to {to_email}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send error email to {to_email}: {str(e)}")
            return False
def _get_current_timestamp() -> str:
    """Get current timestamp in a readable format"""
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S UTC")