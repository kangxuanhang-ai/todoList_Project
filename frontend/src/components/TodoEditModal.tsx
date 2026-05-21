import { useState } from 'react';
import type { Todo } from '../types';
import { useStore } from '../store/useStore';

interface Props {
  todo: Todo;
  onClose: () => void;
}

export default function TodoEditModal({ todo, onClose }: Props) {
  const { updateTodo } = useStore();
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description || '');
  const [priority, setPriority] = useState(todo.priority);
  const [category, setCategory] = useState(todo.category);
  const [dueDate, setDueDate] = useState(todo.due_date || '');

  const handleSave = async () => {
    await updateTodo(todo.id, {
      title: title || undefined,
      description: description || null,
      priority,
      category: category || undefined,
      due_date: dueDate || null,
    });
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
    }} onClick={onClose}>
      <div style={{
        background: '#fff', borderRadius: 12, padding: 32, width: 400,
        display: 'flex', flexDirection: 'column', gap: 16,
      }} onClick={(e) => e.stopPropagation()}>
        <h2 style={{ margin: 0, fontSize: 20, color: '#1F2937' }}>Edit Todo</h2>
        <input value={title} onChange={(e) => setTitle(e.target.value)}
          style={{ height: 44, padding: '0 12px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 14 }} />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description"
          style={{ padding: 12, border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 14, minHeight: 80, resize: 'vertical' }} />
        <select value={priority} onChange={(e) => setPriority(Number(e.target.value))}
          style={{ height: 44, padding: '0 12px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 14, background: '#fff' }}>
          <option value={0}>No priority</option>
          <option value={1}>Low</option>
          <option value={2}>Medium</option>
          <option value={3}>High</option>
        </select>
        <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category"
          style={{ height: 44, padding: '0 12px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 14 }} />
        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
          style={{ height: 44, padding: '0 12px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 14 }} />
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ height: 40, padding: '0 20px', border: '1px solid #E5E7EB', borderRadius: 8, background: '#fff', cursor: 'pointer' }}>Cancel</button>
          <button onClick={handleSave} style={{ height: 40, padding: '0 20px', background: '#3B82F6', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold' }}>Save</button>
        </div>
      </div>
    </div>
  );
}
