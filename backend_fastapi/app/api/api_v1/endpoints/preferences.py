from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_active_user, get_db
from app.models.user import User
from app.models.journal import UserPreferences
from app.schemas.journal import (
    UserPreferences as UserPreferencesSchema,
    UserPreferencesCreate,
    UserPreferencesUpdate
)

router = APIRouter()

@router.get("/", response_model=UserPreferencesSchema)
def read_preferences(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Get current user preferences.
    """
    preferences = db.query(UserPreferences).filter(
        UserPreferences.user_id == current_user.id
    ).first()
    if not preferences:
        # Create default preferences if they don't exist
        preferences = UserPreferences(user_id=current_user.id)
        db.add(preferences)
        db.commit()
        db.refresh(preferences)
    return preferences

@router.put("/", response_model=UserPreferencesSchema)
def update_preferences(
    *,
    db: Session = Depends(get_db),
    preferences_in: UserPreferencesUpdate,
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Update user preferences.
    """
    preferences = db.query(UserPreferences).filter(
        UserPreferences.user_id == current_user.id
    ).first()
    if not preferences:
        preferences = UserPreferences(user_id=current_user.id)
    
    for field, value in preferences_in.model_dump(exclude_unset=True).items():
        setattr(preferences, field, value)
    
    db.add(preferences)
    db.commit()
    db.refresh(preferences)
    return preferences 