import React, {useState, useEffect} from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createDenuncia, getDenuncia, updateDenuncia } from '../graphql/denuncia';
import ModalPicker from '../components/ModalPicker';
import { getCiudadanosPaginated } from '../graphql/ciudadano';
// categories used by app-fallacero
const DEFAULT_CATEGORIES = [
  'Infraestructura',
  'Delincuencia',
  'Servicios',
  'Ambiental',
  'Salud',
  'Tránsito',
  'Educación',
  'Vandalismo',
  'Otro',
];

export default function DenunciaForm() {
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('');
  const [ciudadanoId, setCiudadanoId] = useState('');
  const [ciudadanoLabel, setCiudadanoLabel] = useState('');
  const [fechaDenuncia, setFechaDenuncia] = useState('');
  const [prioridad, setPrioridad] = useState('Media');
  const [showPicker, setShowPicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [searchParams] = useSearchParams();
  const editingId = searchParams.get('id');

  useEffect(() => {
    if (!editingId) return;
    (async () => {
      try {
        const d = await getDenuncia(Number(editingId));
        if (d) {
          setTitulo(d.titulo || '');
          setCategoria(d.categoria || '');
          setCiudadanoId(d.ciudadano_id ? String(d.ciudadano_id) : '');
          setCiudadanoLabel(d.ciudadano_id ? String(d.ciudadano_id) : '');
          setFechaDenuncia(d.fecha_denuncia || '');
          setPrioridad(d.prioridad || 'media');
        }
      } catch (err) { console.error(err); }
    })();
  }, [editingId]);
  const navigate = useNavigate();

  // categories are a fixed list for now; keep a simple fetch adapter for ModalPicker
  const fetchCategories = async (_page = 1, _limit = 50, q?: string) => {
    const list = DEFAULT_CATEGORIES.map((c) => ({ nombre: c }));
    if (q && q.trim() !== '') return list.filter((it) => String(it.nombre).toLowerCase().includes(String(q).toLowerCase()));
    return list;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // ensure fecha_denuncia is provided (backend requires Date!) — default to today when empty
      const fecha = fechaDenuncia && String(fechaDenuncia).trim() !== '' ? fechaDenuncia : new Date().toISOString().slice(0,10);
      if (editingId) {
        await updateDenuncia(Number(editingId), { titulo, categoria, ciudadano_id: ciudadanoId ? Number(ciudadanoId) : undefined, fecha_denuncia: fecha, prioridad });
      } else {
        await createDenuncia({ titulo, categoria, ciudadano_id: ciudadanoId ? Number(ciudadanoId) : undefined, fecha_denuncia: fecha, prioridad });
      }
      navigate('/denuncias');
    } catch (err) { alert('Error: ' + (err as any)?.message || String(err)); }
  };

  return (
    <div>
      <h1 className="page-title">Denuncia — Form</h1>
      <div className="card">
        <form onSubmit={submit}>
          <div className="form-field">
            <label>Título</label>
            <input value={titulo} onChange={(e) => setTitulo(e.target.value)} />
          </div>

          <div className="form-field">
            <label>Ciudadano</label>
            <div style={{display:'flex',gap:8,alignItems:'center'}}>
              <input value={ciudadanoLabel || ciudadanoId} onChange={(e) => { setCiudadanoId(e.target.value); setCiudadanoLabel(''); }} placeholder="ID o nombre" />
              <button className="btn" type="button" onClick={() => setShowPicker(true)}>Buscar</button>
            </div>
          </div>

          <div className="form-field">
            <label>Fecha</label>
            <input type="date" value={fechaDenuncia} onChange={(e) => setFechaDenuncia(e.target.value)} />
          </div>

          <div className="form-field">
            <label>Categoría</label>
            <div style={{display:'flex',gap:8,alignItems:'center'}}>
              <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                <option value="">-- Seleccionar categoría --</option>
                {DEFAULT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <button className="btn" type="button" onClick={() => setShowCategoryPicker(true)}>Buscar</button>
            </div>
          </div>

          <div className="form-field">
            <label>Prioridad</label>
            <div style={{display:'flex',gap:8}}>
              {['Alta','Media','Baja'].map((p) => (
                <button key={p} type="button" className={`btn chip ${prioridad === p ? 'selected' : ''}`} onClick={() => setPrioridad(p)}>{p}</button>
              ))}
            </div>
          </div>

          <div style={{display:'flex',gap:8,marginTop:8}}>
            <button className="btn primary" type="submit">Guardar</button>
            <button className="btn ghost" type="button" onClick={() => navigate('/denuncias')}>Cancelar</button>
          </div>
        </form>
      </div>
      {showPicker && (
        <ModalPicker
          title="Seleccionar ciudadano"
          fetchItems={getCiudadanosPaginated}
          renderItem={(it: any) => `${it.id_ciudadano} — ${it.nombre} ${it.apellido_p || ''}`}
          onClose={() => setShowPicker(false)}
          onSelect={(it: any) => { setCiudadanoId(String(it.id_ciudadano)); setCiudadanoLabel(`${it.nombre} ${it.apellido_p || ''}`); setShowPicker(false); }}
        />
      )}
      {showCategoryPicker && (
        <ModalPicker
          title="Seleccionar categoría"
          fetchItems={fetchCategories}
          renderItem={(it: any) => `${it.nombre}`}
          onClose={() => setShowCategoryPicker(false)}
          onSelect={(it: any) => { setCategoria(it.nombre); setShowCategoryPicker(false); }}
        />
      )}
    </div>
  );
}
