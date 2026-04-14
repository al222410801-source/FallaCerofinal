import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { getDetEvidencias, deleteDetEvidencia } from '../graphql/detEvidencia';

export default function DetEvidenciasList() {
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
        const r = await getDetEvidencias(page, 20);
        if (mounted) setList(r || []);
      } catch (e) { console.error(e); if (mounted) setList([]); }
      finally { if (mounted) setLoading(false); }
    })();
    return () => { mounted = false; };
  }, [page]);

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
        <h1 className="page-title">Det. Evidencias</h1>
        <div>
          <button className="btn" onClick={() => navigate('/det-evidencias/new')}>Crear</button>
        </div>
      </div>
      {loading ? <p className="muted">Cargando...</p> : (
        <div className="card">
          {list.length === 0 ? (
            <div className="empty-state">No hay detalles de evidencias</div>
          ) : (
            <ul className="list">
              {list.map((d) => (
                <li key={d.id_det_evidencia} className="list-item hoverable">
                  <div className="meta">
                    <div className="title"><strong>#{d.id_det_evidencia}</strong> — Denuncia {d.denuncia_id}</div>
                    <div className="subtitle">Evidencia {d.evidencia_id}</div>
                  </div>
                  <div className="actions">
                    <button className="btn ghost" onClick={() => navigate(`/det-evidencias/new?id=${d.id_det_evidencia}`)}>Editar</button>
                    <button className="btn ghost" onClick={async () => { if (!confirm('Eliminar detalle de evidencia?')) return; try { setDeleting(d.id_det_evidencia); await deleteDetEvidencia(d.id_det_evidencia); setList(l => l.filter(x => x.id_det_evidencia !== d.id_det_evidencia)); } catch(err){ alert('Error: '+(err as any)?.message || String(err)); } finally { setDeleting(null); } }}>Eliminar</button>
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
