import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { loginWithCredentials, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return alert('Introduce usuario y contraseña');
    try {
      await loginWithCredentials?.(username, password);
      navigate('/dashboard');
    } catch (err: any) {
      alert('Error en login: ' + (err?.message ?? String(err)));
    }
  };

  return (
    <div className="auth-page">
      <img className="auth-floating-logo" src="/Fallalogo.png" alt="FallaCero" />
      <div className="auth-card">
        <div className="auth-brand">
          <img src="/Fallalogo.png" alt="FallaCero" />
          <h2>FallaCero</h2>
        </div>
        {isAuthenticated ? (
          <p className="muted">Ya estás autenticado</p>
        ) : (
          <form onSubmit={submit} className="auth-form">
            <label className="auth-label">Usuario</label>
            <input className="auth-input" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="usuario@ejemplo" />

            <label className="auth-label">Contraseña</label>
            <input className="auth-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />

            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:8}}>
              <button type="submit" className="auth-btn" disabled={loading}>{loading ? 'Cargando...' : 'Iniciar sesión'}</button>
              <a className="auth-link" href="/forgot">¿Olvidaste tu contraseña?</a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
