export interface User {
  id: number;
  username: string;
}

export interface Todo {
  id: number;
  user_id: number;
  title: string;
  description: string | null;
  completed: boolean;
  priority: number;
  category: string;
  due_date: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface CreateTodoRequest {
  title: string;
  description?: string | null;
  priority?: number;
  category?: string;
  due_date?: string | null;
}

export interface UpdateTodoRequest {
  title?: string;
  description?: string | null;
  completed?: boolean;
  priority?: number;
  category?: string;
  due_date?: string | null;
}

export interface ReorderItem {
  id: number;
  sort_order: number;
}
