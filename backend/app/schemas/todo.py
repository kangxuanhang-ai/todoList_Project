from pydantic import BaseModel, Field
from typing import Optional
from datetime import date, datetime

TITLE_MIN = 1
TITLE_MAX = 255
CATEGORY_MAX = 50


class TodoCreate(BaseModel):
    title: str = Field(..., min_length=TITLE_MIN, max_length=TITLE_MAX)
    description: Optional[str] = None
    priority: int = Field(default=0, ge=0, le=3)
    category: str = Field(default="", max_length=CATEGORY_MAX)
    due_date: Optional[date] = None


class TodoUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=TITLE_MIN, max_length=TITLE_MAX)
    description: Optional[str] = None
    completed: Optional[bool] = None
    priority: Optional[int] = Field(None, ge=0, le=3)
    category: Optional[str] = Field(None, max_length=CATEGORY_MAX)
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
