import type { Todo, CreateTodoRequest, UpdateTodoRequest, ReorderItem } from '../types';

const BASE = '/api/todos';

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 10000): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  const res = await fetch(url, { ...options, signal: controller.signal });
  clearTimeout(timer);
  return res;
}

export async function fetchTodos(
  params?: { category?: string; priority?: number; search?: string },
  signal?: AbortSignal,
): Promise<Todo[]> {
  const searchParams = new URLSearchParams();
  if (params?.category) searchParams.set('category', params.category);
  if (params?.priority !== undefined) searchParams.set('priority', String(params.priority));
  if (params?.search) searchParams.set('search', params.search);
  const query = searchParams.toString();
  const url = query ? `${BASE}?${query}` : BASE;
  const res = await fetchWithTimeout(url, { credentials: 'include', signal });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Failed to fetch todos' }));
    throw new Error(err.detail || 'Failed to fetch todos');
  }
  return res.json();
}

export async function createTodo(data: CreateTodoRequest): Promise<Todo> {
  const res = await fetchWithTimeout(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include',
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Failed to create todo' }));
    throw new Error(err.detail || 'Failed to create todo');
  }
  return res.json();
}

export async function updateTodo(id: number, data: UpdateTodoRequest): Promise<Todo> {
  const res = await fetchWithTimeout(`${BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include',
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Failed to update todo' }));
    throw new Error(err.detail || 'Failed to update todo');
  }
  return res.json();
}

export async function deleteTodo(id: number): Promise<void> {
  const res = await fetchWithTimeout(`${BASE}/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Failed to delete todo' }));
    throw new Error(err.detail || 'Failed to delete todo');
  }
}

export async function reorderTodos(items: ReorderItem[]): Promise<void> {
  const res = await fetchWithTimeout(`${BASE}/reorder`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items }),
    credentials: 'include',
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Failed to reorder' }));
    throw new Error(err.detail || 'Failed to reorder');
  }
}
