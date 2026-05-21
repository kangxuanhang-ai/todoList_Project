import { useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

export default function MainLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useStore();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F3F4F6' }}>
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 56, padding: '0 16px', background: '#fff', borderBottom: '1px solid #E5E7EB',
      }}>
        <h1 style={{ fontSize: 20, fontWeight: 'bold', color: '#1F2937', margin: 0 }}>TodoList</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%', background: '#3B82F6',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 14, fontWeight: 'bold',
          }} role="img" aria-label={user?.username || 'User avatar'}>
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <span style={{ fontSize: 14, color: '#374151' }}>{user?.username}</span>
          <button onClick={handleLogout} disabled={loggingOut} style={{
            height: 32, padding: '0 12px', background: '#EF4444', color: '#fff',
            border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 'bold',
            cursor: loggingOut ? 'not-allowed' : 'pointer', opacity: loggingOut ? 0.7 : 1,
          }}>{loggingOut ? 'Logging out...' : 'Logout'}</button>
        </div>
      </header>
      <div style={{ display: 'flex', height: 'calc(100vh - 56px)' }}>
        {children}
      </div>
    </div>
  );
}
