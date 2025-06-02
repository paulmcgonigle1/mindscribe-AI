from sqlalchemy import Boolean, Column, Integer, String, DateTime
from sqlalchemy.sql import func, text
from sqlalchemy.orm import relationship
from app.db.session import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True)
    username = Column(String(255), unique=True, index=True)
    hashed_password = Column(String(255))
    first_name = Column(String(100))
    last_name = Column(String(100))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=text('CURRENT_TIMESTAMP'))
    updated_at = Column(DateTime, onupdate=text('CURRENT_TIMESTAMP'))

    # Relationships
    journals = relationship("JournalEntry", back_populates="user")
    improvements = relationship("UserImprovement", back_populates="user")
    preferences = relationship("UserPreferences", back_populates="user", uselist=False) 