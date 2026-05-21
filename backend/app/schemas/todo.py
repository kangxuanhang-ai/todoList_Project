from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime

class TodoCreate(BaseModel):
    title: str
    description: Optional[str] = None
    priority: int = 0
    category: str = ""
    due_date: Optional[date] = None

class TodoUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None
    priority: Optional[int] = None
    category: Optional[str] = None
    due_date: Optional[date] = None

class TodoResponse(BaseModel):
    id: int
    user_id: int
    title: str
    description: Optional[str] = None
    completed: bool
    priority: int
    category: str
    due_date: Optional[date] = None
    sort_order: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}

class ReorderItem(BaseModel):
    id: int
    sort_order: int

class ReorderRequest(BaseModel):
    items: list[ReorderItem]
