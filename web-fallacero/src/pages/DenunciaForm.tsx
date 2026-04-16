import React, {useState, useEffect} from 'react';
import './denuncia-form.css';
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
  const [descripcion, setDescripcion] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [prioridad, setPrioridad] = useState('Media');
  const [showPicker, setShowPicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [searchParams] = useSearchParams();
  const editingId = searchParams.get('id');
  const [step, setStep] = useState<number>(1);

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

  const submitForm = async () => {
    try {
      const fecha = fechaDenuncia && String(fechaDenuncia).trim() !== '' ? fechaDenuncia : new Date().toISOString().slice(0,10);
      if (editingId) {
        await updateDenuncia(Number(editingId), { titulo, categoria, descripcion, ubicacion, ciudadano_id: ciudadanoId ? Number(ciudadanoId) : undefined, fecha_denuncia: fecha, prioridad });
      } else {
        await createDenuncia({ titulo, categoria, descripcion, ubicacion, ciudadano_id: ciudadanoId ? Number(ciudadanoId) : undefined, fecha_denuncia: fecha, prioridad });
      }
      navigate('/denuncias');
    } catch (err) { alert('Error: ' + (err as any)?.message || String(err)); }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) { setStep((s) => s + 1); return; }
    void submitForm();
  };

  const handlePrev = () => {
    if (step > 1) setStep((s) => s - 1);
    else navigate('/denuncias');
  };

  return (
    <div className="denuncia-page">
      {/* ambient orbs */}
      <div style={{pointerEvents:'none',position:'fixed',inset:0,overflow:'hidden'}}>
        <div style={{position:'absolute',right:-120,top:-120,width:320,height:320,borderRadius:'50%',background:'rgba(255,120,30,0.06)',filter:'blur(80px)'}} />
        <div style={{position:'absolute',left:-140,bottom:-140,width:380,height:380,borderRadius:'50%',background:'rgba(60,160,255,0.04)',filter:'blur(100px)'}} />
      </div>

      <header className="gradient-header" style={{padding:'12px 24px',borderRadius:8,marginBottom:16,maxWidth:720,marginLeft:'auto',marginRight:'auto'}}>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <div style={{width:44,height:44,borderRadius:10,background:'linear-gradient(135deg,#ff7a18,#ff4e00)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:700}}>D</div>
          <h1 style={{margin:0,fontSize:18,color:'white',fontWeight:700}}>Denuncias</h1>
        </div>
      </header>

      <h2 className="page-title">Nueva denuncia</h2>

      <div className="stepper" aria-hidden>
        <div className={`step ${step>=1 ? 'active' : ''}`}>
          <div className="circle">1</div>
          <div className="step-label">Referencias</div>
        </div>
        <div className={`connector ${step>1 ? 'active' : ''}`} />
        <div className={`step ${step>=2 ? 'active' : ''}`}>
          <div className="circle">2</div>
          <div className="step-label">Detalles</div>
        </div>
        <div className={`connector ${step>2 ? 'active' : ''}`} />
        <div className={`step ${step>=3 ? 'active' : ''}`}>
          <div className="circle">3</div>
          <div className="step-label">Clasificación</div>
        </div>
      </div>

      <div className="card gradient-card glass-card shadow-card">
        <form onSubmit={handleSubmit}>
          {/* STEP 1 - Referencias */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="form-field">
                <label>ID Ciudadano</label>
                <div style={{display:'flex',gap:8,alignItems:'center'}}>
                  <input value={ciudadanoLabel || ciudadanoId} onChange={(e) => { setCiudadanoId(e.target.value); setCiudadanoLabel(''); }} placeholder="Ej: 1234567890" />
                  <button className="btn" type="button" onClick={() => setShowPicker(true)}>Buscar</button>
                </div>
                { (ciudadanoLabel || ciudadanoId) && (
                  <div style={{marginTop:10,display:'flex',gap:10,alignItems:'center',padding:10,borderRadius:10,background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.03)'}}>
                    <div style={{width:40,height:40,borderRadius:999,background:'linear-gradient(135deg,#ff7a18,#ff4e00)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:700}}>{(ciudadanoLabel||ciudadanoId).slice(0,2).toUpperCase()}</div>
                    <div>
                      <div style={{fontWeight:700}}>{ciudadanoLabel ? ciudadanoLabel : `Ciudadano #${ciudadanoId}`}</div>
                      <div style={{fontSize:12,opacity:0.8}}>Verificación pendiente</div>
                    </div>
                  </div>
                )}
              </div>

              <div style={{display:'flex',justifyContent:'flex-end',marginTop:6}}>
                <button type="button" className="btn primary glow-orange" onClick={() => setStep(2)}>Siguiente →</button>
              </div>
            </div>
          )}

          {/* STEP 2 - Detalles */}
          {step === 2 && (
            <div>
              <div className="form-field">
                <label>Título</label>
                <input value={titulo} onChange={(e) => setTitulo(e.target.value)} />
              </div>

              <div className="form-field">
                <label>Fecha</label>
                <input type="date" value={fechaDenuncia} onChange={(e) => setFechaDenuncia(e.target.value)} />
              </div>

              <div className="form-field">
                <label>Descripción</label>
                <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows={4} style={{width:'100%',padding:12,borderRadius:8,background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.04)',color:'var(--foreground)'}} placeholder="Describe los hechos con el mayor detalle posible..." />
              </div>

              <div className="form-field">
                <label>Ubicación</label>
                <input placeholder="Dirección o coordenadas" value={ubicacion} onChange={(e) => setUbicacion(e.target.value)} />
              </div>

              <div style={{display:'flex',justifyContent:'space-between',gap:8,marginTop:8}}>
                <button type="button" className="btn ghost" onClick={handlePrev}>← Anterior</button>
                <button type="button" className="btn primary glow-orange" onClick={() => setStep(3)}>Siguiente →</button>
              </div>
            </div>
          )}

          {/* STEP 3 - Clasificación */}
          {step === 3 && (
            <div>
              <div className="form-field">
                <label>Categoría</label>
                <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                  <option value="">-- Seleccionar categoría --</option>
                  {DEFAULT_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label>Prioridad</label>
                <div style={{display:'flex',gap:8}}>
                  {['Alta','Media','Baja'].map((p) => (
                    <button key={p} type="button" className={`btn chip ${prioridad === p ? 'selected' : ''}`} onClick={() => setPrioridad(p)}>{p}</button>
                  ))}
                </div>
              </div>

              <div style={{display:'flex',gap:8,marginTop:18,justifyContent:'flex-end'}}>
                <button className="btn ghost" type="button" onClick={handlePrev}>← Anterior</button>
                <button className="btn primary glow-orange" type="submit">{editingId ? 'Actualizar' : 'Crear denuncia'}</button>
              </div>
            </div>
          )}
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
