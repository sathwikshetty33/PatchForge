import logging
from langchain_groq import ChatGroq

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
from .models import *
from .prompt import *
from langchain_core.output_parsers import JsonOutputParser

class ReleaseNotesGenerator:
    """Class for generating release notes from pull request data using LLMs"""
    
    def __init__(self, config: Config = None):
        self.config = config or Config()
        self.prompt = ReleaseNotesPrompt
        self.output_parser = JsonOutputParser(pydantic_object=ResponseModel)
        self.llm = ChatGroq(
            model=self.config.LLM_MODEL,
            temperature=self.config.TEMPERATURE,
            max_tokens=self.config.MAX_TOKENS,
            groq_api_key=self.config.GROQ_API_KEY
        )
        # Initialize your LLM here based on your setup
        # self.llm = your_llm_initialization
    
    def evaluate(self, req: RequestModel) -> ResponseModel:
        """
        Generate release notes from pull request data
        
        Args:
            req (RequestModel): Pull request data
            
        Returns:
            ResponseModel: Structured release notes
        """
        try:
            # Create the chain
            chain = self.prompt | self.llm | self.output_parser
            
            # Invoke the chain with request data
            result = chain.invoke({
                "title": req.title,
                "author": req.author,
                "repo_url": req.repo_url,
                "description": req.description or "No description provided",
                "diff_content": req.diff_content,
                "format_instructions": self.output_parser.get_format_instructions()
            })
            
            # Ensure we return a ResponseModel instance
            if isinstance(result, dict):
                return ResponseModel(**result)
            return result
            
        except Exception as e:
            logger.error(f"Error generating release notes: {str(e)}")
            raise

    def generate_markdown_output(self, response: ResponseModel) -> str:
        """
        Convert structured response to markdown format
        
        Args:
            response (ResponseModel): Structured release notes
            
        Returns:
            str: Markdown formatted release notes
        """
        markdown_parts = []
        
        # Summary
        if response.summary:
            markdown_parts.append(f"## Summary\n\n{response.summary}\n")
        
        # Key Features
        if response.key_features:
            markdown_parts.append("## 🚀 New Features\n")
            for feature in response.key_features:
                markdown_parts.append(f"- {feature}")
            markdown_parts.append("")
        
        # Bug Fixes
        if response.bug_fixes:
            markdown_parts.append("## 🐛 Bug Fixes\n")
            for fix in response.bug_fixes:
                markdown_parts.append(f"- {fix}")
            markdown_parts.append("")
        
        # Breaking Changes
        if response.breaking_changes:
            markdown_parts.append("## ⚠️ Breaking Changes\n")
            for change in response.breaking_changes:
                markdown_parts.append(f"- {change}")
            markdown_parts.append("")
        
        # Performance Improvements
        if response.performance_improvements:
            markdown_parts.append("## ⚡ Performance Improvements\n")
            for improvement in response.performance_improvements:
                markdown_parts.append(f"- {improvement}")
            markdown_parts.append("")
        
        # Security Updates
        if response.security_updates:
            markdown_parts.append("## 🔒 Security Updates\n")
            for update in response.security_updates:
                markdown_parts.append(f"- {update}")
            markdown_parts.append("")
        
        # Technical Details
        if response.technical_details:
            markdown_parts.append("## 🔧 Technical Details\n")
            for detail in response.technical_details:
                markdown_parts.append(f"- {detail}")
            markdown_parts.append("")
        
        # Deprecations
        if response.deprecations:
            markdown_parts.append("## 🚨 Deprecations\n")
            for deprecation in response.deprecations:
                markdown_parts.append(f"- {deprecation}")
            markdown_parts.append("")
        
        # Migration Notes
        if response.migration_notes:
            markdown_parts.append(f"## 📋 Migration Notes\n\n{response.migration_notes}\n")
        
        # Conclusion
        if response.conclusion:
            markdown_parts.append(f"## Conclusion\n\n{response.conclusion}\n")
        
        return "\n".join(markdown_parts)
