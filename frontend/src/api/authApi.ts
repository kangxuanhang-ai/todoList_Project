import type { User } from '../types';

const BASE = '/api/auth';

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 10000): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  const res = await fetch(url, { ...options, signal: controller.signal });
  clearTimeout(timer);
  return res;
}

export async function register(username: string, password: string): Promise<User> {
  const res = await fetchWithTimeout(`${BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
    credentials: 'include',
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Registration failed' }));
    throw new Error(err.detail || 'Registration failed');
  }
  return res.json();
}

export async function login(username: string, password: string): Promise<User> {
  const res = await fetchWithTimeout(`${BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
    credentials: 'include',
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Login failed' }));
    throw new Error(err.detail || 'Login failed');
  }
  return res.json();
}

export async function logout(): Promise<void> {
  await fetchWithTimeout(`${BASE}/logout`, { method: 'POST', credentials: 'include' });
}

export async function getMe(): Promise<User> {
  const res = await fetchWithTimeout(`${BASE}/me`, { credentials: 'include' });
  if (!res.ok) throw new Error('Not authenticated');
  return res.json();
}
