import { useState } from 'react';
import { useStore } from '../store/useStore';

export default function AddTodo() {
  const [title, setTitle] = useState('');
  const { createTodo } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    await createTodo({ title: title.trim() });
    setTitle('');
  };

  return (
    <form onSubmit={handleSubmit} style={{
      display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16,
      height: 48, padding: '0 12px', background: '#F9FAFB', borderRadius: 8,
      border: '1px solid #E5E7EB',
    }}>
      <span style={{ fontSize: 20, fontWeight: 'bold', color: '#9CA3AF' }}>+</span>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a new todo..."
        style={{ flex: 1, border: 'none', background: 'transparent', fontSize: 14, outline: 'none' }}
      />
      <button type="submit" style={{
        height: 32, padding: '0 16px', background: '#3B82F6', color: '#fff',
        border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 'bold', cursor: 'pointer',
      }}>Add</button>
    </form>
  );
}
