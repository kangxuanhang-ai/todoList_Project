from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, case, bindparam
from app.db import get_db
from app.models.user import User
from app.models.todo import Todo
from app.schemas.todo import TodoCreate, TodoUpdate, TodoResponse, ReorderRequest
from app.core.security import get_current_user

router = APIRouter(prefix="/api/todos", tags=["todos"])


@router.get("", response_model=list[TodoResponse])
async def get_todos(
    category: str = Query(None),
    priority: int = Query(None),
    search: str = Query(None),
    page: int = Query(1, ge=1),
    per_page: int = Query(50, ge=1, le=200),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = select(Todo).where(Todo.user_id == current_user.id).order_by(Todo.sort_order, Todo.id)
    if category:
        query = query.where(Todo.category == category)
    if priority is not None:
        query = query.where(Todo.priority == priority)
    if search:
        query = query.where(Todo.title.ilike(f"%{search}%"))
    offset = (page - 1) * per_page
    query = query.offset(offset).limit(per_page)
    result = await db.execute(query)
    return result.scalars().all()


@router.post("", response_model=TodoResponse, status_code=status.HTTP_201_CREATED)
async def create_todo(
    todo_data: TodoCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Todo.sort_order).where(Todo.user_id == current_user.id).order_by(Todo.sort_order.desc()).limit(1)
    )
    max_order = result.scalar() or 0
    todo = Todo(
        **todo_data.model_dump(),
        user_id=current_user.id,
        sort_order=max_order + 1,
    )
    db.add(todo)
    await db.commit()
    await db.refresh(todo)
    return todo


@router.put("/{todo_id}", response_model=TodoResponse)
async def update_todo(
    todo_id: int,
    todo_data: TodoUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Todo).where(Todo.id == todo_id, Todo.user_id == current_user.id)
    )
    todo = result.scalar_one_or_none()
    if not todo:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Todo not found")
    update_data = todo_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(todo, key, value)
    await db.commit()
    await db.refresh(todo)
    return todo


@router.delete("/{todo_id}")
async def delete_todo(
    todo_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Todo).where(Todo.id == todo_id, Todo.user_id == current_user.id)
    )
    todo = result.scalar_one_or_none()
    if not todo:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Todo not found")
    await db.delete(todo)
    await db.commit()
    return {"message": "Todo deleted"}


@router.put("/reorder")
async def reorder_todos(
    reorder_data: ReorderRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    stmt = update(Todo).where(
        Todo.id == bindparam("_id"),
        Todo.user_id == current_user.id,
    ).values(sort_order=bindparam("_sort_order"))
    params = [{"_id": item.id, "_sort_order": item.sort_order} for item in reorder_data.items]
    await db.execute(stmt, params)
    await db.commit()
    return {"message": "Reorder successful"}
