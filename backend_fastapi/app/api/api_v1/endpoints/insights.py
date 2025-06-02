from typing import List, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime

from app.api.deps import get_current_active_user, get_db
from app.models.user import User
from app.models.journal import Insight, JournalEntry
from app.schemas.journal import Insight as InsightSchema
from app.schemas.journal import InsightCreate

router = APIRouter()

@router.post("/", response_model=InsightSchema)
def create_insight(
    *,
    db: Session = Depends(get_db),
    insight_in: InsightCreate,
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Create new insight.
    """
    # Verify that the journal entry exists and belongs to the user
    journal_entry = db.query(JournalEntry).filter(
        JournalEntry.id == insight_in.entry_id,
        JournalEntry.user_id == current_user.id
    ).first()
    if not journal_entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Journal entry not found"
        )
    
    insight = Insight(**insight_in.model_dump())
    db.add(insight)
    db.commit()
    db.refresh(insight)
    return insight

@router.get("/entry/{entry_id}", response_model=List[InsightSchema])
def read_insights_for_entry(
    *,
    db: Session = Depends(get_db),
    entry_id: int,
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Get insights for a specific journal entry.
    """
    # Verify that the journal entry exists and belongs to the user
    journal_entry = db.query(JournalEntry).filter(
        JournalEntry.id == entry_id,
        JournalEntry.user_id == current_user.id
    ).first()
    if not journal_entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Journal entry not found"
        )
    
    insights = db.query(Insight).filter(Insight.entry_id == entry_id).all()
    return insights

@router.get("/daily/{date}", response_model=List[InsightSchema])
def read_daily_insights(
    *,
    db: Session = Depends(get_db),
    date: datetime,
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Get insights for a specific date.
    """
    insights = db.query(Insight).join(JournalEntry).filter(
        JournalEntry.user_id == current_user.id,
        JournalEntry.created_at >= date,
        JournalEntry.created_at < date.replace(hour=23, minute=59, second=59)
    ).all()
    return insights 