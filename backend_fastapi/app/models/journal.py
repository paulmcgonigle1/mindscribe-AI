from sqlalchemy import Boolean, Column, Integer, String, DateTime, ForeignKey, Text, Date
from sqlalchemy.sql import func, text
from sqlalchemy.orm import relationship
from app.db.session import Base

class JournalEntry(Base):
    __tablename__ = "journal_entries"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    content = Column(Text)
    mood_rating = Column(Integer, default=0)
    created_at = Column(DateTime, server_default=text('CURRENT_TIMESTAMP'))
    updated_at = Column(DateTime, onupdate=text('CURRENT_TIMESTAMP'))

    user = relationship("User", back_populates="journals")
    insights = relationship("Insight", back_populates="entry", cascade="all, delete-orphan")

class Insight(Base):
    __tablename__ = "insights"

    id = Column(Integer, primary_key=True, index=True)
    entry_id = Column(Integer, ForeignKey("journal_entries.id"))
    keywords = Column(Text, nullable=True)
    moods = Column(Text, nullable=True)
    sentiment = Column(Text, nullable=True)
    key_themes = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=text('CURRENT_TIMESTAMP'))

    entry = relationship("JournalEntry", back_populates="insights")

class UserImprovement(Base):
    __tablename__ = "user_improvements"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    date = Column(Date, server_default=text('(CURDATE())'))
    message_of_the_day = Column(Text, nullable=True)
    additional_info = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=text('CURRENT_TIMESTAMP'))

    user = relationship("User", back_populates="improvements")
    tasks = relationship("ActionableTask", back_populates="improvement", cascade="all, delete-orphan")

class ActionableTask(Base):
    __tablename__ = "actionable_tasks"

    id = Column(Integer, primary_key=True, index=True)
    improvement_id = Column(Integer, ForeignKey("user_improvements.id"))
    content = Column(Text)
    explanation = Column(Text, nullable=True)
    is_completed = Column(Boolean, default=False)
    in_progress = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=text('CURRENT_TIMESTAMP'))

    improvement = relationship("UserImprovement", back_populates="tasks")

class UserPreferences(Base):
    __tablename__ = "user_preferences"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    is_personalised = Column(Boolean, default=False)
    preferred_type = Column(String(50), default="motivation")
    preferred_style = Column(String(50), default="insightful")
    response_type = Column(Text, nullable=True)
    companion_type = Column(String(50), default="Terry")
    created_at = Column(DateTime, server_default=text('CURRENT_TIMESTAMP'))
    updated_at = Column(DateTime, onupdate=text('CURRENT_TIMESTAMP'))

    user = relationship("User", back_populates="preferences") 