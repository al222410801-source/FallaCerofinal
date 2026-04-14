import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getDenunciasPaginated } from '../graphql/denuncia';

function LoaderEffect({ setLoading, setTotal, setAlta, setMedia, setBaja }: any) {
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        // fetch a large page to compute simple stats (backend doesn't expose totals)
        const items = await getDenunciasPaginated(1, 10000);
        if (!mounted) return;
        const list = items || [];
        setTotal(list.length);
        let a = 0, m = 0, b = 0;
        list.forEach((d: any) => {
          const p = (d.prioridad || '').toString().toLowerCase();
          if (p.includes('alta') || p.includes('high')) a++;
          else if (p.includes('media') || p.includes('medium')) m++;
          else b++;
        });
        setAlta(a); setMedia(m); setBaja(b);
      } catch (err) {
        console.error('load stats', err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [setLoading, setTotal, setAlta, setMedia, setBaja]);
  return null;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [alta, setAlta] = useState(0);
  const [media, setMedia] = useState(0);
  const [baja, setBaja] = useState(0);

  return (
    <div className="container">
      <h1 className="page-title">Dashboard</h1>
      <section style={{marginTop:12}}>
        <div className="stats-grid">
          <div className="stat-card">
            <div>
              <div className="label">Total</div>
              <div className="value">{loading ? '...' : total}</div>
            </div>
          </div>
          <div className="stat-card">
            <div>
              <div className="label">Alta</div>
              <div className="value">{loading ? '...' : alta}</div>
            </div>
          </div>
          <div className="stat-card">
            <div>
              <div className="label">Media</div>
              <div className="value">{loading ? '...' : media}</div>
            </div>
          </div>
          <div className="stat-card">
            <div>
              <div className="label">Baja</div>
              <div className="value">{loading ? '...' : baja}</div>
            </div>
          </div>
        </div>
      </section>

      {/* load counts via effect */}
      <LoaderEffect setLoading={setLoading} setTotal={setTotal} setAlta={setAlta} setMedia={setMedia} setBaja={setBaja} />
      <section className="card-grid">
        <article className="card card-large">
          <h3>Resumen</h3>
          <p className="muted">Bienvenido{user ? `, ${user.username ?? user.email}` : ''}. Aquí tienes un resumen rápido.</p>
        </article>

        <article className="card">
          <h3>Denuncias</h3>
          <p className="muted">Accede al listado para ver y gestionar denuncias.</p>
          <div style={{marginTop:12, display:'flex', gap:8}}>
            <Link to="/denuncias" className="btn">Ver</Link>
            <Link to="/denuncia/new" className="btn btn-primary">Crear denuncia</Link>
          </div>
        </article>

        <article className="card">
          <h3>Evidencias</h3>
          <p className="muted">Gestiona evidencias relacionadas a denuncias.</p>
          <div style={{marginTop:12, display:'flex', gap:8}}>
            <Link to="/evidencias" className="btn">Ver</Link>
            <Link to="/evidencias/new" className="btn btn-primary">Crear evidencia</Link>
          </div>
        </article>

        <article className="card">
          <h3>Usuarios</h3>
          <p className="muted">Gestiona usuarios y permisos.</p>
          <div style={{marginTop:12, display:'flex', gap:8}}>
            <Link to="/usuarios" className="btn">Ver</Link>
            <Link to="/usuarios/new" className="btn btn-primary">Crear usuario</Link>
          </div>
        </article>

        <article className="card">
          <h3>Servidores</h3>
          <p className="muted">Servidores públicos y responsables.</p>
          <div style={{marginTop:12, display:'flex', gap:8}}>
            <Link to="/servidores" className="btn">Ver</Link>
            <Link to="/servidores/new" className="btn btn-primary">Crear servidor</Link>
          </div>
        </article>

        <article className="card">
          <h3>Ciudadanos</h3>
          <p className="muted">Registros ciudadanos.</p>
          <div style={{marginTop:12, display:'flex', gap:8}}>
            <Link to="/ciudadanos" className="btn">Ver</Link>
            <Link to="/ciudadanos/new" className="btn btn-primary">Crear ciudadano</Link>
          </div>
        </article>

        <article className="card">
          <h3>Roles</h3>
          <p className="muted">Configura permisos y roles.</p>
          <div style={{marginTop:12, display:'flex', gap:8}}>
            <Link to="/roles" className="btn">Ver</Link>
            <Link to="/roles/new" className="btn btn-primary">Crear rol</Link>
          </div>
        </article>
      </section>
    </div>
  );
}
