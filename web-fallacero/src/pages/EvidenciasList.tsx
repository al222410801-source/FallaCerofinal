import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { getEvidencias, deleteEvidencia } from '../graphql/evidencia';

export default function EvidenciasList() {
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
        const r = await getEvidencias(page, 20);
        if (mounted) setList(r || []);
      } catch (e) { console.error(e); if (mounted) setList([]); }
      finally { if (mounted) setLoading(false); }
    })();
    return () => { mounted = false; };
  }, [page]);

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
        <h1 className="page-title">Evidencias</h1>
        <div>
          <button className="btn" onClick={() => navigate('/evidencias/new')}>Crear</button>
        </div>
      </div>
      {loading ? <p className="muted">Cargando...</p> : (
        <div className="card">
          {list.length === 0 ? (
            <div className="empty-state">No hay evidencias.</div>
          ) : (
            <ul className="list">
              {list.map((e) => (
                <li key={e.id_evidencia} className="list-item hoverable">
                  <div className="meta" style={{display:'flex',gap:12,alignItems:'center'}}>
                    {e.imagen ? <img className="thumb" src={e.imagen} alt={`e${e.id_evidencia}`} /> : <div className="thumb" />}
                    <div>
                      <div className="title"><strong>{e.id_evidencia}</strong> — {e.observaciones}</div>
                      <div className="subtitle">Tipo: {e.tipo || '—'}</div>
                    </div>
                  </div>
                  <div className="actions">
                    <button className="btn ghost" onClick={() => navigate(`/evidencias/new?id=${e.id_evidencia}`)}>Editar</button>
                    <button className="btn ghost" onClick={async () => { if (!confirm('Eliminar evidencia?')) return; try { setDeleting(e.id_evidencia); await deleteEvidencia(e.id_evidencia); setList(l => l.filter(x => x.id_evidencia !== e.id_evidencia)); } catch(err){ alert('Error: '+(err as any)?.message || String(err)); } finally { setDeleting(null); } }}>Eliminar</button>
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
