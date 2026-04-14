import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { getServidoresPaginated, deleteServidor } from '../graphql/servidorPublico';

export default function ServidoresList() {
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
        const r = await getServidoresPaginated(page, 20);
        if (mounted) setList(r || []);
      } catch (e) { console.error(e); if (mounted) setList([]); }
      finally { if (mounted) setLoading(false); }
    })();
    return () => { mounted = false; };
  }, [page]);

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
        <h1 className="page-title">Servidores</h1>
        <div>
          <button className="btn" onClick={() => navigate('/servidores/new')}>Crear</button>
        </div>
      </div>
      {loading ? <p className="muted">Cargando...</p> : (
        <div className="card">
          {list.length === 0 ? (
            <div className="empty-state">No hay servidores públicos</div>
          ) : (
            <ul className="list">
              {list.map(s => (
                <li key={s.id_servidor} className="list-item hoverable">
                  <div className="meta">
                    <div className="title"><strong>{s.nombre} {s.apellido_p}</strong></div>
                    <div className="subtitle">{s.cargo}</div>
                  </div>
                  <div className="actions">
                    <button className="btn ghost" onClick={() => navigate(`/servidores/new?id=${s.id_servidor}`)}>Editar</button>
                    <button className="btn ghost" onClick={async () => { if (!confirm('Eliminar servidor?')) return; try { setDeleting(s.id_servidor); await deleteServidor(s.id_servidor); setList(l => l.filter(x => x.id_servidor !== s.id_servidor)); } catch(err){ alert('Error: '+(err as any)?.message || String(err)); } finally { setDeleting(null); } }}>Eliminar</button>
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
