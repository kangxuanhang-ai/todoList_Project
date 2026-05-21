import { useEffect } from 'react';
import MainLayout from '../components/MainLayout';
import Sidebar from '../components/Sidebar';
import AddTodo from '../components/AddTodo';
import TodoList from '../components/TodoList';
import { useStore } from '../store/useStore';

export default function HomePage() {
  const { fetchTodos, loading } = useStore();

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  return (
    <MainLayout>
      <Sidebar />
      <div style={{ flex: 1, padding: 24, overflowY: 'auto' }}>
        <AddTodo />
        {loading ? (
          <p style={{ textAlign: 'center', color: '#6B7280' }}>Loading...</p>
        ) : (
          <TodoList />
        )}
      </div>
    </MainLayout>
  );
}
