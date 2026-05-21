import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Todo } from '../types';
import { useStore } from '../store/useStore';
import PriorityBadge from './PriorityBadge';

interface Props {
  todo: Todo;
  onEdit: (todo: Todo) => void;
}

export default function TodoItem({ todo, onEdit }: Props) {
  const { deleteTodo, updateTodo } = useStore();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={{
      ...style,
      display: 'flex', alignItems: 'center', gap: 12, padding: '0 12px', height: 52,
      background: '#fff', borderRadius: 8, border: '1px solid #F3F4F6',
    }}>
      <span {...attributes} {...listeners} style={{ cursor: 'grab', fontSize: 18, color: '#9CA3AF' }}>☰</span>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => updateTodo(todo.id, { completed: !todo.completed })}
        style={{ width: 20, height: 20, cursor: 'pointer' }}
      />
      <span
        onClick={() => onEdit(todo)}
        style={{
          flex: 1, fontSize: 14, cursor: 'pointer',
          color: todo.completed ? '#9CA3AF' : '#1F2937',
          textDecoration: todo.completed ? 'line-through' : 'none',
        }}
      >
        {todo.title}
      </span>
      <PriorityBadge priority={todo.priority} />
      {todo.category && (
        <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 12, background: '#DBEAFE', color: '#3B82F6' }}>
          {todo.category}
        </span>
      )}
      {todo.due_date && (
        <span style={{ fontSize: 12, color: '#6B7280' }}>{todo.due_date}</span>
      )}
      <button onClick={() => deleteTodo(todo.id)} style={{
        background: 'none', border: 'none', fontSize: 16, color: '#9CA3AF', cursor: 'pointer',
      }}>✕</button>
    </div>
  );
}
