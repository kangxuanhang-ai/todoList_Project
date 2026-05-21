import { create } from 'zustand';
import type { User, Todo, CreateTodoRequest, UpdateTodoRequest } from '../types';
import * as authApi from '../api/authApi';
import * as todoApi from '../api/todoApi';

interface Filters {
  search: string;
  category: string;
  priority: number | null;
}

interface AppState {
  user: User | null;
  todos: Todo[];
  filters: Filters;
  loading: boolean;
  error: string | null;

  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;

  fetchTodos: () => Promise<void>;
  createTodo: (data: CreateTodoRequest) => Promise<void>;
  updateTodo: (id: number, data: UpdateTodoRequest) => Promise<void>;
  deleteTodo: (id: number) => Promise<void>;
  reorderTodos: (items: { id: number; sort_order: number }[]) => Promise<void>;

  setSearch: (search: string) => void;
  setCategory: (category: string) => void;
  setPriority: (priority: number | null) => void;
}

export const useStore = create<AppState>()((set, get) => ({
  user: null,
  todos: [],
  filters: { search: '', category: '', priority: null },
  loading: false,
  error: null,

  login: async (username, password) => {
    set({ loading: true, error: null });
    try {
      const user = await authApi.login(username, password);
      set({ user, loading: false });
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
      throw e;
    }
  },

  register: async (username, password) => {
    set({ loading: true, error: null });
    try {
      const user = await authApi.register(username, password);
      set({ user, loading: false });
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
      throw e;
    }
  },

  logout: async () => {
    await authApi.logout();
    set({ user: null, todos: [] });
  },

  checkAuth: async () => {
    try {
      const user = await authApi.getMe();
      set({ user });
    } catch {
      set({ user: null });
    }
  },

  fetchTodos: async () => {
    const { filters } = get();
    set({ loading: true, error: null });
    try {
      const todos = await todoApi.fetchTodos({
        category: filters.category || undefined,
        priority: filters.priority ?? undefined,
        search: filters.search || undefined,
      });
      set({ todos, loading: false });
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
    }
  },

  createTodo: async (data) => {
    try {
      await todoApi.createTodo(data);
      await get().fetchTodos();
    } catch (e) {
      set({ error: (e as Error).message });
    }
  },

  updateTodo: async (id, data) => {
    const prevTodos = get().todos;
    try {
      const updated = await todoApi.updateTodo(id, data);
      set({ todos: get().todos.map((t) => (t.id === id ? updated : t)) });
    } catch (e) {
      set({ todos: prevTodos, error: (e as Error).message });
    }
  },

  deleteTodo: async (id) => {
    try {
      await todoApi.deleteTodo(id);
      set({ todos: get().todos.filter((t) => t.id !== id) });
    } catch (e) {
      set({ error: (e as Error).message });
    }
  },

  reorderTodos: async (items) => {
    const prevTodos = get().todos;
    try {
      await todoApi.reorderTodos(items);
      const updatedTodos = get().todos.map((t) => {
        const item = items.find((i) => i.id === t.id);
        return item ? { ...t, sort_order: item.sort_order } : t;
      });
      updatedTodos.sort((a, b) => a.sort_order - b.sort_order);
      set({ todos: updatedTodos });
    } catch (e) {
      set({ todos: prevTodos, error: (e as Error).message });
    }
  },

  setSearch: (search) => set({ filters: { ...get().filters, search } }),
  setCategory: (category) => set({ filters: { ...get().filters, category } }),
  setPriority: (priority) => set({ filters: { ...get().filters, priority } }),
}));
