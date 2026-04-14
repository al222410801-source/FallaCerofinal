import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { getHistoriales, deleteHistorial } from '../graphql/historialEstado';

export default function Historiales() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getHistoriales(1, 50);
      setItems(data || []);
    } catch (e) {
      console.error('getHistoriales', e);
      setItems([]);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);
  const navigate = useNavigate();

  return (
    <div>
      <h1 className="page-title">Historiales</h1>
      <div style={{marginBottom: 8, display: 'flex', gap: 8}}>
        <button className="btn" onClick={load}>Refrescar</button>
        <button className="btn" onClick={() => navigate('/historiales/new')}>Nuevo</button>
      </div>
      {loading ? <p className="muted">Cargando...</p> : (
        <div className="card">
          {items.length === 0 ? <div className="empty-state">No hay historiales</div> : (
            <ul className="list">
              {items.map((h) => (
                <li key={h.id_historial} className="list-item hoverable">
                  <div className="meta">
                    <div><strong>#{h.id_historial}</strong> — {h.denuncia?.titulo ?? '—'}</div>
                    <div className="small muted">{h.fecha} — {h.estado}</div>
                  </div>
                  <div className="actions">
                    <button className="btn ghost" onClick={async () => { if (!confirm('Eliminar?')) return; await deleteHistorial(h.id_historial); load(); }}>Eliminar</button>
                    <button className="btn ghost" onClick={() => navigate(`/historiales/new?id=${h.id_historial}`)}>Editar</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
