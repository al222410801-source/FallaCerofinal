import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsuarios, deleteUsuario } from '../graphql/usuario-crud';

export default function UsuariosList() {
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
        const r = await getUsuarios(page, 20);
        if (mounted) setList(r || []);
      } catch (e) { console.error(e); if (mounted) setList([]); }
      finally { if (mounted) setLoading(false); }
    })();
    return () => { mounted = false; };
  }, [page]);

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
        <h1 className="page-title">Usuarios</h1>
        <div>
          <button className="btn" onClick={() => navigate('/usuarios/new')}>Crear</button>
        </div>
      </div>
      {loading ? <p className="muted">Cargando...</p> : (
        <div className="card">
          {list.length === 0 ? (
            <div className="empty-state">No hay usuarios</div>
          ) : (
            <ul className="list">
              {list.map(u => (
                <li key={u.id_usuario} className="list-item hoverable">
                  <div className="meta">
                    <div className="title"><strong>{u.username}</strong></div>
                    <div className="subtitle">rol: {u.rol_id}</div>
                  </div>
                  <div className="actions">
                    <button className="btn ghost" onClick={() => navigate(`/usuarios/new?id=${u.id_usuario}`)}>Editar</button>
                    <button className="btn ghost" onClick={async () => { if (!confirm('Eliminar usuario?')) return; try { setDeleting(u.id_usuario); await deleteUsuario(u.id_usuario); setList(l => l.filter(x => x.id_usuario !== u.id_usuario)); } catch(err){ alert('Error: '+(err as any)?.message || String(err)); } finally { setDeleting(null); } }}>Eliminar</button>
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
