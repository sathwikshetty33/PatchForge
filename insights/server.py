# import datetime
# import grpc
# import sys, os
# sys.path.append(os.path.join(os.path.dirname(__file__), "grpc_files"))
# sys.path.append(os.path.join(os.path.dirname(__file__), "utils"))
# from utils.utils import *
# from utils.agent import *
# from concurrent import futures
# from grpc_files import schema_pb2, schema_pb2_grpc
# from google.protobuf import empty_pb2
# from groq import Groq
# from typing import Optional
# import logging
# # Configure logging
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)
# from dotenv import load_dotenv
# import os
# load_dotenv()
# # Load environmen
# import os
# import smtplib
# import requests
# from email.mime.text import MIMEText
# from email.mime.multipart import MIMEMultipart
# from groq import Groq
# from typing import Optional
# import logging

# # Configure logging
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# class PullRequestService(schema_pb2_grpc.PullRequestServiceServicer):

#     def ProcessPullRequest(self, request, context):
#         """Process pull request and generate release notes"""
#         try:
#             logger.info(f"Processing PR #{request.pr_number} from {request.author}")
#             logger.info(f"Repo: {request.repo_url}")
#             logger.info(f"Branch: {request.branch}")
#             logger.info(f"Commit: {request.commit_hash}")
#             logger.info(f"Title: {request.title}")
#             logger.info(f"Email: {request.email}")
            
#             # Fetch PR diff
#             diff_result = fetch_pr_diff(
#                 request.repo_url, 
#                 request.commit_hash, 
#                 request.access_token
#             )
            
#             # Check if we got diff content or an error
#             if "error" in diff_result:
#                 # Send error email to user
#                 error_message = diff_result["error"]
#                 logger.error(f"GitHub API error: {error_message}")
                
#                 send_error_email(
#                     request.email,
#                     f"Error Processing PR #{request.pr_number}: {request.title}",
#                     error_message,
#                     request.repo_url,
#                     request.pr_number,
#                     "GitHub API Access",
#                     config=Config()
#                 )
                
#                 context.set_code(grpc.StatusCode.INTERNAL)
#                 context.set_details(f"GitHub API error: {error_message}")
#                 return empty_pb2.Empty()
            
#             diff_content = diff_result.get("content")
#             if not diff_content:
#                 error_message = "No diff content received from GitHub API"
#                 logger.error(error_message)
                
#                 send_error_email(
#                     request.email,
#                     f"Error Processing PR #{request.pr_number}: {request.title}",
#                     error_message,
#                     request.repo_url,
#                     request.pr_number,
#                     "Empty Diff Content",
#                     config=Config()
#                 )
                
#                 context.set_code(grpc.StatusCode.INTERNAL)
#                 context.set_details("Failed to fetch PR diff")
#                 return empty_pb2.Empty()
            
#             # Generate release notes using Groq
#             try:
#                 agent = ReleaseNotesGenerator(config=Config())
#                 agentRequest = RequestModel(
#                     repo_url=request.repo_url,
#                     title=request.title,
#                     author=request.author,
#                     description=request.description if hasattr(request, 'description') else None,
#                     diff_content=diff_content
#                 )
#                 response = agent.evaluate(agentRequest)
#                 release_notes = agent.generate_markdown_output(response)
                
#                 if not release_notes or release_notes.strip() == "":
#                     raise Exception("Generated release notes are empty")
                    
#             except Exception as ai_error:
#                 error_message = f"Failed to generate release notes using AI: {str(ai_error)}"
#                 logger.error(error_message)
                
#                 send_error_email(
#                     request.email,
#                     f"Error Processing PR #{request.pr_number}: {request.title}",
#                     error_message,
#                     request.repo_url,
#                     request.pr_number,
#                     "AI Generation",
#                     config=Config()
#                 )
                
#                 context.set_code(grpc.StatusCode.INTERNAL)
#                 context.set_details("Failed to generate release notes")
#                 return empty_pb2.Empty()
            
#             # Send email with release notes
#             email_sent = send_email(
#                 request.email,
#                 f"Release Notes for PR #{request.pr_number}: {request.title}",
#                 release_notes,
#                 request.repo_url,
#                 request.pr_number,
#                 config=Config(),

#             )
            
#             if email_sent:
#                 logger.info(f"Release notes successfully sent to {request.email}")
#             else:
#                 error_message = "Failed to send release notes email"
#                 logger.error(error_message)
#                 context.set_code(grpc.StatusCode.INTERNAL)
#                 context.set_details("Failed to send email")
            
#             return empty_pb2.Empty()
            
#         except Exception as e:
#             error_message = f"Unexpected error: {str(e)}"
#             logger.error(f"Error processing PR: {error_message}")
            
#             # Try to send error email
#             try:
#                 send_error_email(
#                     request.email,
#                     f"Error Processing PR #{request.pr_number}: {request.title}",
#                     error_message,
#                     request.repo_url,
#                     request.pr_number,
#                     "System Error",
#                     config=Config()
#                 )
#             except Exception as email_error:
#                 logger.error(f"Failed to send error email: {str(email_error)}")
            
#             context.set_code(grpc.StatusCode.INTERNAL)
#             context.set_details(f"Internal error: {str(e)}")
#             return empty_pb2.Empty()

# def serve():
#     server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
#     schema_pb2_grpc.add_PullRequestServiceServicer_to_server(PullRequestService(), server)
#     server.add_insecure_port('[::]:50051')
#     logger.info("Server started at port 50051")
#     server.start()
#     server.wait_for_termination()

# if __name__ == "__main__":
#     serve()

from datetime import datetime, timezone
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
from dotenv import load_dotenv
import os
import smtplib
import requests
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from sqlalchemy.exc import SQLAlchemyError

# Import database models
from models import get_db_session, Repository, ReleaseNotes

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

class PullRequestService(schema_pb2_grpc.PullRequestServiceServicer):

    def save_release_notes_to_db(self, repo_url: str, version: str, notes: str) -> bool:
        """Save release notes to database"""
        session = None
        try:
            session = get_db_session()
            
            # Extract repository name from URL
            # Handle formats like: "owner/repo", "https://github.com/owner/repo", etc.
            repo_name = repo_url.rstrip('/').split('/')[-1]
            repo_url = "https://github.com/" + repo_url
            # Find repository by name only
            repository = session.query(Repository).filter_by(repository_url=repo_url).first()
            
            if not repository:
                logger.warning(f"Repository not found in database: {repo_name} (extracted from {repo_url})")
                # You might want to create the repository here or handle this differently
                return False
            
            # Create new release notes entry
            release_note = ReleaseNotes(
                repository_id=repository.id,
                version=version,
                notes=notes,
                created_at=datetime.now(timezone.utc)  # Fixed deprecated utcnow()

            )
            
            session.add(release_note)
            session.commit()
            
            logger.info(f"Successfully saved release notes to database for repo: {repo_name}, version: {version}")
            return True
            
        except SQLAlchemyError as e:
            if session:
                session.rollback()
            logger.error(f"Database error while saving release notes: {str(e)}")
            return False
        except Exception as e:
            if session:
                session.rollback()
            logger.error(f"Unexpected error while saving release notes: {str(e)}")
            return False
        finally:
            if session:
                session.close()
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
                    diff_content=diff_content[10000:]
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
            
            # Generate version string (you can customize this logic)
            version = f"PR-{request.pr_number}-{datetime.now(timezone.utc).strftime('%Y%m%d')}"

            
            # Save release notes to database
            db_saved = self.save_release_notes_to_db(
                repo_url=request.repo_url,
                version=version,
                notes=release_notes
            )
            
            if not db_saved:
                logger.warning("Failed to save release notes to database, but continuing with email...")
            
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
                if db_saved:
                    logger.info(f"Release notes successfully saved to database")
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

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    schema_pb2_grpc.add_PullRequestServiceServicer_to_server(PullRequestService(), server)
    server.add_insecure_port('[::]:50051')
    logger.info("Server started at port 50051")
    server.start()
    server.wait_for_termination()

if __name__ == "__main__":
    serve()