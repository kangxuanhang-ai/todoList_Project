import type { Todo, CreateTodoRequest, UpdateTodoRequest, ReorderItem } from '../types';

const BASE = '/api/todos';

export async function fetchTodos(params?: { category?: string; priority?: number; search?: string }): Promise<Todo[]> {
  const searchParams = new URLSearchParams();
  if (params?.category) searchParams.set('category', params.category);
  if (params?.priority !== undefined) searchParams.set('priority', String(params.priority));
  if (params?.search) searchParams.set('search', params.search);
  const query = searchParams.toString();
  const url = query ? `${BASE}?${query}` : BASE;
  const res = await fetch(url, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch todos');
  return res.json();
}

export async function createTodo(data: CreateTodoRequest): Promise<Todo> {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to create todo');
  return res.json();
}

export async function updateTodo(id: number, data: UpdateTodoRequest): Promise<Todo> {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to update todo');
  return res.json();
}

export async function deleteTodo(id: number): Promise<void> {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to delete todo');
}

export async function reorderTodos(items: ReorderItem[]): Promise<void> {
  const res = await fetch(`${BASE}/reorder`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items }),
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to reorder');
}
