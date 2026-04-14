import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { getRoles, deleteRol } from '../graphql/rol';

export default function RolesList() {
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
        const r = await getRoles(page, 50);
        if (mounted) setList(r || []);
      } catch (e) { console.error(e); if (mounted) setList([]); }
      finally { if (mounted) setLoading(false); }
    })();
    return () => { mounted = false; };
  }, [page]);

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
        <h1 className="page-title">Roles</h1>
        <div>
          <button className="btn" onClick={() => navigate('/roles/new')}>Crear</button>
        </div>
      </div>
      {loading ? <p className="muted">Cargando...</p> : (
        <div className="card">
          {list.length === 0 ? (
            <div className="empty-state">No hay roles</div>
          ) : (
            <ul className="list">
              {list.map(r => (
                <li key={r.id_rol} className="list-item hoverable">
                  <div className="meta">
                    <div className="title"><strong>{r.nombre}</strong></div>
                    <div className="subtitle">{r.descripcion}</div>
                  </div>
                  <div className="actions">
                    <button className="btn ghost" onClick={() => navigate(`/roles/new?id=${r.id_rol}`)}>Editar</button>
                    <button className="btn ghost" onClick={async () => { if (!confirm('Eliminar rol?')) return; try { setDeleting(r.id_rol); await deleteRol(r.id_rol); setList(l => l.filter(x => x.id_rol !== r.id_rol)); } catch(err){ alert('Error: '+(err as any)?.message || String(err)); } finally { setDeleting(null); } }}>Eliminar</button>
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
