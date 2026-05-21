import { useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';

const categories = ['', 'Work', 'Personal', 'Shopping'];
const priorities = [
  { value: null, label: 'All' },
  { value: 1, label: 'Low' },
  { value: 2, label: 'Medium' },
  { value: 3, label: 'High' },
];

export default function Sidebar() {
  const filters = useStore((s) => s.filters);
  const setSearch = useStore((s) => s.setSearch);
  const setCategory = useStore((s) => s.setCategory);
  const setPriority = useStore((s) => s.setPriority);
  const fetchTodos = useStore((s) => s.fetchTodos);
  const prevFiltersRef = useRef(filters);

  useEffect(() => {
    if (JSON.stringify(prevFiltersRef.current) === JSON.stringify(filters)) return;
    prevFiltersRef.current = filters;
    const timer = setTimeout(fetchTodos, 300);
    return () => clearTimeout(timer);
  }, [filters, fetchTodos]);

  return (
    <div style={{ width: 220, padding: 20, background: '#fff', borderRight: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h2 style={{ fontSize: 16, fontWeight: 'bold', color: '#1F2937', margin: 0 }}>Filters</h2>
      <input
        type="text"
        placeholder="Search todos..."
        value={filters.search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ height: 40, padding: '0 12px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 14, background: '#F9FAFB' }}
      />
      <div>
        <h3 style={{ fontSize: 14, fontWeight: 'bold', color: '#374151', margin: '0 0 8px' }}>Category</h3>
        {categories.map((cat) => (
          <div
            key={cat || 'all'}
            role="button"
            tabIndex={0}
            onClick={() => setCategory(cat)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setCategory(cat); }}
            style={{
              padding: '4px 8px', cursor: 'pointer', borderRadius: 4, fontSize: 14,
              color: filters.category === cat ? '#3B82F6' : '#6B7280',
              background: filters.category === cat ? '#DBEAFE' : 'transparent',
            }}
          >
            {cat || 'All'}
          </div>
        ))}
      </div>
      <div>
        <h3 style={{ fontSize: 14, fontWeight: 'bold', color: '#374151', margin: '0 0 8px' }}>Priority</h3>
        {priorities.map((p) => (
          <div
            key={String(p.value)}
            role="button"
            tabIndex={0}
            onClick={() => setPriority(p.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setPriority(p.value); }}
            style={{
              padding: '4px 8px', cursor: 'pointer', borderRadius: 4, fontSize: 14,
              color: filters.priority === p.value ? '#3B82F6' : '#6B7280',
              background: filters.priority === p.value ? '#DBEAFE' : 'transparent',
            }}
          >
            {p.label}
          </div>
        ))}
      </div>
    </div>
  );
}
