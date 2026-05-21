import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../store/useStore';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate('/');
    } catch {}
  };

  return (
    <div style={{ maxWidth: 400, margin: '100px auto', padding: 40, background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <h1 style={{ margin: 0, fontSize: 28, color: '#1F2937' }}>Login</h1>
      <p style={{ margin: '8px 0 24px', color: '#6B7280' }}>Welcome back!</p>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 4, fontSize: 14, color: '#374151' }}>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: '100%', height: 44, padding: '0 12px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 14, background: '#F9FAFB', boxSizing: 'border-box' }}
            required
            autoComplete="username"
          />
        </div>
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', marginBottom: 4, fontSize: 14, color: '#374151' }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', height: 44, padding: '0 12px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 14, background: '#F9FAFB', boxSizing: 'border-box' }}
            required
            autoComplete="current-password"
          />
        </div>
        {error && <p role="alert" style={{ color: '#EF4444', fontSize: 14 }}>{error}</p>}
        <button type="submit" disabled={loading} style={{ width: '100%', height: 48, background: '#3B82F6', color: '#fff', border: 'none', borderRadius: 8, fontSize: 16, fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p style={{ marginTop: 24, textAlign: 'center', fontSize: 14 }}>
        <Link to="/register" style={{ color: '#3B82F6' }}>Don't have an account? Register</Link>
      </p>
    </div>
  );
}
