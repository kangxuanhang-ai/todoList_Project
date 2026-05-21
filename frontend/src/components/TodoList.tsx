import { useState } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useStore } from '../store/useStore';
import type { Todo } from '../types';
import TodoItem from './TodoItem';
import TodoEditModal from './TodoEditModal';

export default function TodoList() {
  const { todos, reorderTodos } = useStore();
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = todos.findIndex((t) => t.id === active.id);
    const newIndex = todos.findIndex((t) => t.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const updated = [...todos];
    const [moved] = updated.splice(oldIndex, 1);
    updated.splice(newIndex, 0, moved);

    const items = updated.map((t, i) => ({ id: t.id, sort_order: i }));
    reorderTodos(items);
  };

  if (todos.length === 0) return <p style={{ textAlign: 'center', color: '#6B7280', marginTop: 40 }}>No todos yet. Add one above!</p>;

  return (
    <>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={todos.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {todos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} onEdit={setEditingTodo} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      {editingTodo && (
        <TodoEditModal todo={editingTodo} onClose={() => setEditingTodo(null)} />
      )}
    </>
  );
}
