from sqlalchemy import Column, Integer, String, Boolean, Date, Text, DateTime, ForeignKey, func, Index
from sqlalchemy.orm import relationship

from app.models.user import Base


class Todo(Base):
    __tablename__ = "todos"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    completed = Column(Boolean, default=False, nullable=False)
    priority = Column(Integer, default=0, nullable=False)
    category = Column(String(50), default="", nullable=False)
    due_date = Column(Date, nullable=True)
    sort_order = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="todos")

    __table_args__ = (
        Index("ix_todos_user_sort", "user_id", "sort_order"),
        Index("ix_todos_user_category", "user_id", "category"),
    )
