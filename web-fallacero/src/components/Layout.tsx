import React, { useEffect, useState } from 'react';
import Particles from './Particles';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Layout: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [dark, setDark] = useState<boolean>(() => {
    try {
      if (typeof window === 'undefined') return false;
      const stored = localStorage.getItem('theme');
      if (stored) return stored === 'dark';
      return document.documentElement.classList.contains('dark');
    } catch (e) { return false; }
  });
  const isHome = location.pathname === '/';
  // Mostrar sidebar solo si el usuario está autenticado (oculto en Home)
  const showSidebar = !!isAuthenticated && !isHome;

  useEffect(() => {
    // notify all components to close ephemeral UI (menus, drawers, modals)
    try {
      window.dispatchEvent(new CustomEvent('close-ui'));
    } catch (e) {
      // older browsers may not support CustomEvent constructor
      const ev = document.createEvent('Event');
      ev.initEvent('close-ui', true, true);
      window.dispatchEvent(ev);
    }
  }, [location.pathname]);

  useEffect(() => {
    try {
      if (dark) document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', dark ? 'dark' : 'light');
    } catch (e) { /* ignore */ }
  }, [dark]);

  return (
    <div className={"app-layout" + (isHome ? ' home' : '') + (!showSidebar ? ' no-sidebar' : '')}>
      <Particles fullScreen density={25} hueBase={30} hueVariance={20} />
      <header className="topbar">
        <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
          <img src="/Fallalogo.png" alt="logo" style={{width:36,height:36,borderRadius:8}} />
          <div style={{fontWeight:700}}>FallaCero</div>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <button className="btn ghost" onClick={() => setDark(d => !d)}>{dark ? 'Modo claro' : 'Modo oscuro'}</button>
          {isAuthenticated ? (
            <>
              <div style={{opacity:0.85}}>{user?.username ?? user?.email ?? 'Usuario'}</div>
              <button className="btn ghost" onClick={logout}>Cerrar sesión</button>
            </>
          ) : (
            <Link to="/login" className="btn">Entrar</Link>
          )}
        </div>
      </header>

      {showSidebar && (
      <aside className="sidebar">
        <div className="brand">FallaCero</div>
        <nav>
          <Link to="/denuncias">Denuncias</Link>
          <Link to="/evidencias">Evidencias</Link>
          <Link to="/det-evidencias">Det. Evidencias</Link>
          <Link to="/historiales">Historiales</Link>
          <Link to="/usuarios">Usuarios</Link>
          <Link to="/servidores">Servidores</Link>
          <Link to="/ciudadanos">Ciudadanos</Link>
          <Link to="/roles">Roles</Link>
        </nav>
      </aside>
      )}

      <main className={"main-content" + (isHome ? ' home' : '')}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
