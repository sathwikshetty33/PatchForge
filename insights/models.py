from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker
import os

Base = declarative_base()

from datetime import datetime, timezone

class User(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True)
    username = Column(String)
    email = Column(String, unique=True, nullable=False)
    password = Column(String)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), 
                        onupdate=lambda: datetime.now(timezone.utc))
    
    profile = relationship("Profile", back_populates="user", uselist=False, cascade="all, delete-orphan")

class Profile(Base):
    __tablename__ = 'profiles'
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id', onupdate='CASCADE', ondelete='CASCADE'), 
                     unique=True, nullable=False)
    github_url = Column(String, nullable=False)
    access_token = Column(String, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), 
                        onupdate=lambda: datetime.now(timezone.utc))
    
    user = relationship("User", back_populates="profile")
    repositories = relationship("Repository", back_populates="profile", cascade="all, delete-orphan")

class Repository(Base):
    __tablename__ = 'repositories'
    
    id = Column(Integer, primary_key=True)
    profile_id = Column(Integer, ForeignKey('profiles.id', onupdate='CASCADE', ondelete='CASCADE'), 
                        nullable=False, index=True)
    name = Column(String, nullable=False)
    repository_url = Column(String, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), 
                        onupdate=lambda: datetime.now(timezone.utc))
    
    profile = relationship("Profile", back_populates="repositories")
    release_notes = relationship("ReleaseNotes", back_populates="repository", cascade="all, delete-orphan")

class ReleaseNotes(Base):
    __tablename__ = 'release_notes'
    
    id = Column(Integer, primary_key=True)
    repository_id = Column(Integer, ForeignKey('repositories.id', onupdate='CASCADE', ondelete='CASCADE'), 
                           nullable=False, index=True)
    version = Column(String, nullable=False)
    notes = Column(Text, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    repository = relationship("Repository", back_populates="release_notes")

# Database connection helper
def get_db_engine():
    """Create and return database engine from DATABASE_URL env variable"""
    database_url = os.getenv('DATABASE_URL')
    if not database_url:
        raise ValueError("DATABASE_URL environment variable is not set")
    
    # Handle postgres:// vs postgresql:// (some libraries use different prefixes)
    if database_url.startswith('postgres://'):
        database_url = database_url.replace('postgres://', 'postgresql://', 1)
    
    return create_engine(database_url)

def get_db_session():
    """Create and return a new database session"""
    engine = get_db_engine()
    Session = sessionmaker(bind=engine)
    return Session()

def init_db():
    """Initialize database tables"""
    engine = get_db_engine()
    Base.metadata.create_all(engine)