import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { getDenunciasPaginated, deleteDenuncia } from '../graphql/denuncia';

export default function Denuncias() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [alta, setAlta] = useState(0);
  const [media, setMedia] = useState(0);
  const [baja, setBaja] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const r = await getDenunciasPaginated(page, 20);
        if (mounted) setList(r || []);
      } catch (e) {
        console.error('load denuncias', e);
        if (mounted) setList([]);
      } finally { if (mounted) setLoading(false); }
    })();
    return () => { mounted = false; };
  }, [page]);

  // load overall stats for the list
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const items = await getDenunciasPaginated(1, 10000);
        if (!mounted) return;
        const listAll = items || [];
        setTotal(listAll.length);
        let a = 0, m = 0, b = 0;
        listAll.forEach((d: any) => {
          const p = (d.prioridad || '').toString().toLowerCase();
          if (p.includes('alta') || p.includes('high')) a++;
          else if (p.includes('media') || p.includes('medium')) m++;
          else b++;
        });
        setAlta(a); setMedia(m); setBaja(b);
      } catch (err) {
        console.error('load stats', err);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Eliminar denuncia #' + id + '?')) return;
    try {
      await deleteDenuncia(Number(id));
      setList((cur) => cur.filter((x) => Number(x.id_denuncia) !== Number(id)));
    } catch (err) {
      alert('Error al eliminar: ' + (err as any)?.message || String(err));
    }
  };

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
        <h1 className="page-title">Denuncias</h1>
        <div>
          <button className="btn" onClick={() => navigate('/denuncia/new')}>Crear</button>
        </div>
      </div>
      {loading ? <p className="muted">Cargando...</p> : (
        <div className="card">
          <div style={{marginBottom:12}}>
            <div className="stats-grid" style={{gridTemplateColumns: 'repeat(4, 1fr)'}}>
              <div className="stat-card"><div><div className="label">Total</div><div className="value">{total}</div></div></div>
              <div className="stat-card"><div><div className="label">Alta</div><div className="value">{alta}</div></div></div>
              <div className="stat-card"><div><div className="label">Media</div><div className="value">{media}</div></div></div>
              <div className="stat-card"><div><div className="label">Baja</div><div className="value">{baja}</div></div></div>
            </div>
          </div>
          <table className="table-dashboard">
            <thead>
              <tr>
                <th>ID</th>
                <th>Título</th>
                  <th>Fecha</th>
                  <th>Categoría</th>
                  <th>Prioridad</th>
                  <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {list.map((d) => (
                <tr key={d.id_denuncia} className="hoverable">
                  <td><div className="td-inner"><div className="label">ID</div><div>{d.id_denuncia}</div></div></td>
                  <td><div className="td-inner"><div className="label">Título</div><div>{d.titulo}</div></div></td>
                  <td><div className="td-inner"><div className="label">Fecha</div><div>{d.fecha_denuncia}</div></div></td>
                  <td><div className="td-inner"><div className="label">Categoría</div><div>{d.categoria}</div></div></td>
                  <td><div className="td-inner"><div className="label">Prioridad</div><div>
                      {d.prioridad ? (() => {
                        const p = String(d.prioridad).toLowerCase();
                        let lvl = 'low';
                        if (p.includes('alta') || p.includes('high')) lvl = 'high';
                        else if (p.includes('media') || p.includes('medium')) lvl = 'medium';
                        return <span className={`badge badge-${lvl}`}>{d.prioridad}</span>;
                      })() : <span className="badge">-</span>}
                  </div></div></td>
                  <td className="actions"><div className="td-inner"><div className="label">Acciones</div><div style={{display:'flex',gap:8}}>
                      <button className="btn" onClick={() => navigate(`/denuncia?id=${d.id_denuncia}`)}>Editar</button>
                      <button className="btn danger" onClick={() => handleDelete(d.id_denuncia)}>Eliminar</button>
                    </div></div></td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination" style={{marginTop: 12}}>
            <button className="btn ghost" onClick={() => setPage((p) => Math.max(1, p-1))} disabled={page===1}>Anterior</button>
            <span className="muted">Página {page}</span>
            <button className="btn" onClick={() => setPage((p) => p+1)}>Siguiente</button>
          </div>
        </div>
      )}
    </div>
  );
}
