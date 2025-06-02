from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, date

class JournalEntryBase(BaseModel):
    content: str
    mood_rating: Optional[int] = 0

class JournalEntryCreate(JournalEntryBase):
    pass

class JournalEntryUpdate(BaseModel):
    content: Optional[str] = None
    mood_rating: Optional[int] = None

class InsightBase(BaseModel):
    keywords: Optional[str] = None
    moods: Optional[str] = None
    sentiment: Optional[str] = None
    key_themes: Optional[str] = None

class InsightCreate(InsightBase):
    entry_id: int

class Insight(InsightBase):
    id: int
    entry_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class JournalEntry(JournalEntryBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    insights: List[Insight] = []

    class Config:
        from_attributes = True

class UserImprovementBase(BaseModel):
    message_of_the_day: Optional[str] = None
    additional_info: Optional[str] = None

class UserImprovementCreate(UserImprovementBase):
    pass

class ActionableTaskBase(BaseModel):
    content: str
    explanation: Optional[str] = None
    is_completed: bool = False
    in_progress: bool = False

class ActionableTaskCreate(ActionableTaskBase):
    improvement_id: int

class ActionableTask(ActionableTaskBase):
    id: int
    improvement_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class UserImprovement(UserImprovementBase):
    id: int
    user_id: int
    date: date
    created_at: datetime
    tasks: List[ActionableTask] = []

    class Config:
        from_attributes = True

class UserPreferencesBase(BaseModel):
    is_personalised: bool = False
    preferred_type: str = "motivation"
    preferred_style: str = "insightful"
    response_type: Optional[str] = None
    companion_type: str = "Terry"

class UserPreferencesCreate(UserPreferencesBase):
    pass

class UserPreferencesUpdate(BaseModel):
    is_personalised: Optional[bool] = None
    preferred_type: Optional[str] = None
    preferred_style: Optional[str] = None
    response_type: Optional[str] = None
    companion_type: Optional[str] = None

class UserPreferences(UserPreferencesBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True 