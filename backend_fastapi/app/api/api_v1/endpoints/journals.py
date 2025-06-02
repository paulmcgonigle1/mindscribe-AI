from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

from app.api.deps import get_current_active_user, get_db
from app.models.user import User
from app.models.journal import JournalEntry
from app.schemas.journal import JournalEntry as JournalEntrySchema
from app.schemas.journal import JournalEntryCreate, JournalEntryUpdate

router = APIRouter()

@router.post("/", response_model=JournalEntrySchema)
def create_journal_entry(
    *,
    db: Session = Depends(get_db),
    journal_in: JournalEntryCreate,
    current_user: User = Depends(get_current_active_user)
) -> JournalEntry:
    """
    Create new journal entry.
    """
    # Check if user already has an entry for today
    today = datetime.utcnow().date()
    existing_entry = db.query(JournalEntry).filter(
        JournalEntry.user_id == current_user.id,
        JournalEntry.created_at >= today,
        JournalEntry.created_at < today + timedelta(days=1)
    ).first()
    
    if existing_entry:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You already have a journal entry for today"
        )
    
    journal_entry = JournalEntry(
        **journal_in.model_dump(),
        user_id=current_user.id
    )
    db.add(journal_entry)
    db.commit()
    db.refresh(journal_entry)
    return journal_entry

@router.get("/", response_model=List[JournalEntrySchema])
def read_journal_entries(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_user)
) -> List[JournalEntry]:
    """
    Retrieve journal entries.
    """
    journal_entries = db.query(JournalEntry).filter(
        JournalEntry.user_id == current_user.id
    ).offset(skip).limit(limit).all()
    return journal_entries

@router.get("/{journal_id}", response_model=JournalEntrySchema)
def read_journal_entry(
    *,
    db: Session = Depends(get_db),
    journal_id: int,
    current_user: User = Depends(get_current_active_user)
) -> JournalEntry:
    """
    Get journal entry by ID.
    """
    journal_entry = db.query(JournalEntry).filter(
        JournalEntry.id == journal_id,
        JournalEntry.user_id == current_user.id
    ).first()
    if not journal_entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Journal entry not found"
        )
    return journal_entry

@router.put("/{journal_id}", response_model=JournalEntrySchema)
def update_journal_entry(
    *,
    db: Session = Depends(get_db),
    journal_id: int,
    journal_in: JournalEntryUpdate,
    current_user: User = Depends(get_current_active_user)
) -> JournalEntry:
    """
    Update journal entry.
    """
    journal_entry = db.query(JournalEntry).filter(
        JournalEntry.id == journal_id,
        JournalEntry.user_id == current_user.id
    ).first()
    if not journal_entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Journal entry not found"
        )
    
    for field, value in journal_in.model_dump(exclude_unset=True).items():
        setattr(journal_entry, field, value)
    
    db.add(journal_entry)
    db.commit()
    db.refresh(journal_entry)
    return journal_entry

@router.delete("/{journal_id}", response_model=JournalEntrySchema)
def delete_journal_entry(
    *,
    db: Session = Depends(get_db),
    journal_id: int,
    current_user: User = Depends(get_current_active_user)
) -> JournalEntry:
    """
    Delete journal entry.
    """
    journal_entry = db.query(JournalEntry).filter(
        JournalEntry.id == journal_id,
        JournalEntry.user_id == current_user.id
    ).first()
    if not journal_entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Journal entry not found"
        )
    
    db.delete(journal_entry)
    db.commit()
    return journal_entry

@router.get("/check/today", response_model=bool)
def check_journal_for_today(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> bool:
    """
    Check if user has a journal entry for today.
    """
    today = datetime.utcnow().date()
    journal_exists = db.query(JournalEntry).filter(
        JournalEntry.user_id == current_user.id,
        JournalEntry.created_at >= today,
        JournalEntry.created_at < today + timedelta(days=1)
    ).first() is not None
    return journal_exists 