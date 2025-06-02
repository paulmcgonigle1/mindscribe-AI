from typing import List, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import date

from app.api.deps import get_current_active_user, get_db
from app.models.user import User
from app.models.journal import UserImprovement, ActionableTask
from app.schemas.journal import (
    UserImprovement as UserImprovementSchema,
    UserImprovementCreate,
    ActionableTask as ActionableTaskSchema,
    ActionableTaskCreate
)

router = APIRouter()

@router.post("/", response_model=UserImprovementSchema)
def create_improvement(
    *,
    db: Session = Depends(get_db),
    improvement_in: UserImprovementCreate,
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Create new improvement plan.
    """
    # Check if user already has an improvement plan for today
    today = date.today()
    existing_improvement = db.query(UserImprovement).filter(
        UserImprovement.user_id == current_user.id,
        UserImprovement.date == today
    ).first()
    
    if existing_improvement:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You already have an improvement plan for today"
        )
    
    improvement = UserImprovement(
        **improvement_in.model_dump(),
        user_id=current_user.id
    )
    db.add(improvement)
    db.commit()
    db.refresh(improvement)
    return improvement

@router.get("/", response_model=List[UserImprovementSchema])
def read_improvements(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Retrieve improvement plans.
    """
    improvements = db.query(UserImprovement).filter(
        UserImprovement.user_id == current_user.id
    ).offset(skip).limit(limit).all()
    return improvements

@router.post("/tasks", response_model=ActionableTaskSchema)
def create_task(
    *,
    db: Session = Depends(get_db),
    task_in: ActionableTaskCreate,
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Create new actionable task.
    """
    # Verify that the improvement plan exists and belongs to the user
    improvement = db.query(UserImprovement).filter(
        UserImprovement.id == task_in.improvement_id,
        UserImprovement.user_id == current_user.id
    ).first()
    if not improvement:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Improvement plan not found"
        )
    
    task = ActionableTask(**task_in.model_dump())
    db.add(task)
    db.commit()
    db.refresh(task)
    return task

@router.put("/tasks/{task_id}", response_model=ActionableTaskSchema)
def update_task(
    *,
    db: Session = Depends(get_db),
    task_id: int,
    task_in: ActionableTaskCreate,
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Update actionable task.
    """
    task = db.query(ActionableTask).join(UserImprovement).filter(
        ActionableTask.id == task_id,
        UserImprovement.user_id == current_user.id
    ).first()
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    for field, value in task_in.model_dump().items():
        setattr(task, field, value)
    
    db.add(task)
    db.commit()
    db.refresh(task)
    return task 