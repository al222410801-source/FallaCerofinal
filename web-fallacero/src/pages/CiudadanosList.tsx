import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { getCiudadanosPaginated, deleteCiudadano } from '../graphql/ciudadano';

export default function CiudadanosList() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const r = await getCiudadanosPaginated(page, 20);
        if (mounted) setList(r || []);
      } catch (e) { console.error(e); if (mounted) setList([]); }
      finally { if (mounted) setLoading(false); }
    })();
    return () => { mounted = false; };
  }, [page]);

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
        <h1 className="page-title">Ciudadanos</h1>
        <div>
          <button className="btn" onClick={() => navigate('/ciudadanos/new')}>Crear</button>
        </div>
      </div>
      {loading ? <p className="muted">Cargando...</p> : (
        <div className="card">
          {list.length === 0 ? (
            <div className="empty-state">No hay ciudadanos</div>
          ) : (
            <ul className="list">
              {list.map(c => (
                <li key={c.id_ciudadano} className="list-item hoverable">
                  <div className="meta">
                    <div className="title"><strong>{c.nombre} {c.apellido_p}</strong></div>
                    <div className="subtitle">CI: {c.ci || '—'}</div>
                  </div>
                  <div className="actions">
                    <button className="btn ghost" onClick={() => navigate(`/ciudadanos/new?id=${c.id_ciudadano}`)}>Editar</button>
                    <button className="btn ghost" onClick={async () => { if (!confirm('Eliminar ciudadano?')) return; try { setDeleting(c.id_ciudadano); await deleteCiudadano(c.id_ciudadano); setList(l => l.filter(x => x.id_ciudadano !== c.id_ciudadano)); } catch(err){ alert('Error: '+(err as any)?.message || String(err)); } finally { setDeleting(null); } }}>Eliminar</button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="pagination" style={{marginTop:8}}>
            <button className="btn ghost" onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1}>Anterior</button>
            <span className="muted">Página {page}</span>
            <button className="btn" onClick={() => setPage(p => p+1)}>Siguiente</button>
          </div>
        </div>
      )}
    </div>
  );
}
