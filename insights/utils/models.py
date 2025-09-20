import logging
from typing import Optional, List
from dataclasses import dataclass
from pydantic import BaseModel, Field
import os
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from dotenv import load_dotenv
load_dotenv()
# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Models
class RequestModel(BaseModel):
    """Request model for release notes generation"""
    repo_url: str = Field(description="Repository URL")
    title: str = Field(description="Pull request title")
    author: str = Field(description="Author of the pull request")
    description: Optional[str] = Field(default=None, description="Pull request description")
    diff_content: str = Field(description="Git diff content")

@dataclass
class Config:
    """Configuration class for environment variables"""
    GROQ_API_KEY: str = os.getenv('GROQ_API_KEY')
    SMTP_SERVER: str = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
    SMTP_PORT: int = int(os.getenv('SMTP_PORT', '587'))
    SMTP_USERNAME: str = os.getenv('SMTP_USERNAME')
    SMTP_PASSWORD: str = os.getenv('SMTP_PASSWORD')
    FROM_EMAIL: str = os.getenv('FROM_EMAIL', os.getenv('SMTP_USERNAME', ''))
    LLM_MODEL: str = os.getenv('LLM_MODEL', 'llama-3.3-70b-versatile')
    TEMPERATURE: float = float(os.getenv('TEMPERATURE', '0.2'))
    MAX_TOKENS: int = int(os.getenv('MAX_TOKENS', '1500'))

class ResponseModel(BaseModel):
    """Response model for structured release notes"""
    summary: str = Field(description="Executive summary of the release")
    key_features: Optional[List[str]] = Field(default=None, description="List of new features added")
    bug_fixes: Optional[List[str]] = Field(default=None, description="List of bugs fixed")
    breaking_changes: Optional[List[str]] = Field(default=None, description="List of breaking changes")
    technical_details: Optional[List[str]] = Field(default=None, description="Technical implementation details")
    performance_improvements: Optional[List[str]] = Field(default=None, description="Performance enhancements")
    security_updates: Optional[List[str]] = Field(default=None, description="Security-related changes")
    deprecations: Optional[List[str]] = Field(default=None, description="Deprecated features or APIs")
    migration_notes: Optional[str] = Field(default=None, description="Migration guidance for breaking changes")
    conclusion: Optional[str] = Field(default=None, description="Closing remarks and next steps")