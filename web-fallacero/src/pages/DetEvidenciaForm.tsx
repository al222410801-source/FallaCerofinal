import React, {useState, useEffect} from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createDetEvidencia, getDetEvidencia, updateDetEvidencia } from '../graphql/detEvidencia';
import ModalPicker from '../components/ModalPicker';
import { getDenunciasPaginated, getDenuncia, createDenuncia } from '../graphql/denuncia';
import { getEvidencias, getEvidencia, createEvidencia } from '../graphql/evidencia';

export default function DetEvidenciaForm() {
  const [denunciaId, setDenunciaId] = useState('');
  const [evidenciaId, setEvidenciaId] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [localEv, setLocalEv] = useState({ imagen: '', observaciones: '' });
  const [localDen, setLocalDen] = useState({ titulo: '', ciudadano_id: '', categoria: '', prioridad: '' });
  const [showDenunciaPicker, setShowDenunciaPicker] = useState(false);
  const [showEvidenciaPicker, setShowEvidenciaPicker] = useState(false);
  const [denunciaLabel, setDenunciaLabel] = useState('');
  const [evidenciaLabel, setEvidenciaLabel] = useState('');
  const [saving, setSaving] = useState(false);
  const [searchParams] = useSearchParams();
  const editingId = searchParams.get('id');
  const navigate = useNavigate();

  useEffect(() => {
    if (!editingId) return;
    (async () => {
      try {
        const d = await getDetEvidencia(Number(editingId));
        if (d) {
          setDenunciaId(d.denuncia_id ? String(d.denuncia_id) : '');
          setDenunciaLabel(d.denuncia ? `${d.denuncia.id_denuncia} — ${d.denuncia.titulo || ''}` : '');
          setEvidenciaId(d.evidencia_id ? String(d.evidencia_id) : '');
          setEvidenciaLabel(d.evidencia ? `${d.evidencia.id_evidencia} — ${d.evidencia.observaciones || ''}` : '');
          setDescripcion(d.descripcion || '');
        }
      } catch (err) { console.error('load detEvidencia', err); }
    })();
  }, [editingId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      let denId = denunciaId ? Number(denunciaId) : undefined;
      let evId = evidenciaId ? Number(evidenciaId) : undefined;

      // create evidencia if needed
      if (!evId && (localEv.imagen || localEv.observaciones)) {
        const ev = await createEvidencia({ imagen: localEv.imagen || '', observaciones: localEv.observaciones || '' });
        if (ev && ev.id_evidencia) {
          evId = Number(ev.id_evidencia);
          setEvidenciaId(String(evId));
        }
      }

      // create denuncia if needed
      if (!denId && localDen.titulo && localDen.ciudadano_id) {
        const denPayload: any = {
          ciudadano_id: Number(localDen.ciudadano_id),
          titulo: localDen.titulo,
          fecha_denuncia: new Date().toISOString().slice(0,10),
          categoria: localDen.categoria || 'Otro',
          prioridad: localDen.prioridad || 'Media'
        };
        const den = await createDenuncia(denPayload);
        if (den && den.id_denuncia) {
          denId = Number(den.id_denuncia);
          setDenunciaId(String(denId));
        }
      }

      // ensure both ids exist
      if (!denId || !evId) {
        alert('IDs de denuncia y evidencia son obligatorios. Si no existen, complétalos para crearlas automáticamente.');
        setSaving(false);
        return;
      }

      const [den, ev] = await Promise.all([
        getDenuncia(Number(denId)).catch(() => null),
        getEvidencia(Number(evId)).catch(() => null),
      ]);

      if (!den || !ev) {
        const missing = [] as string[];
        if (!den) missing.push('denuncia');
        if (!ev) missing.push('evidencia');
        if (!confirm(`No se encontró la(s) ${missing.join(' y ')} indicada(s). Crear ahora?`)) { setSaving(false); return; }
        if (!den) navigate('/denuncia/new');
        else if (!ev) navigate('/evidencias/new');
        setSaving(false);
        return;
      }

      // call create or update (backend only needs denuncia_id & evidencia_id)
      if (editingId) {
        await updateDetEvidencia(Number(editingId), { denuncia_id: denId, evidencia_id: evId, descripcion });
      } else {
        await createDetEvidencia({ denuncia_id: denId, evidencia_id: evId, descripcion: descripcion || undefined });
      }
      navigate('/det-evidencias');
    } catch (err) { alert('Error: ' + (err as any)?.message || String(err)); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <h1 className="page-title">{editingId ? 'Editar Det. Evidencia' : 'Nueva Det. Evidencia'}</h1>
      <div className="card">
        <form onSubmit={submit}>
          <div className="form-field">
            <label>ID Denuncia</label>
            <div style={{display:'flex',gap:8,alignItems:'center'}}>
              <input value={denunciaLabel || denunciaId} onChange={(e) => { setDenunciaId(e.target.value); setDenunciaLabel(''); }} style={{width:200}} />
              <button className="btn" type="button" onClick={() => setShowDenunciaPicker(true)}>Buscar</button>
            </div>
          </div>

          <div className="form-field">
            <label>ID Evidencia</label>
            <div style={{display:'flex',gap:8,alignItems:'center'}}>
              <input value={evidenciaLabel || evidenciaId} onChange={(e) => { setEvidenciaId(e.target.value); setEvidenciaLabel(''); }} style={{width:200}} />
              <button className="btn" type="button" onClick={() => setShowEvidenciaPicker(true)}>Buscar</button>
            </div>
          </div>

          <div className="form-field">
            <label>Crear evidencia (opcional)</label>
            <input placeholder="URL o base64 de imagen" value={localEv.imagen} onChange={(e) => setLocalEv(prev => ({...prev, imagen: e.target.value}))} />
            <input placeholder="Observaciones" value={localEv.observaciones} onChange={(e) => setLocalEv(prev => ({...prev, observaciones: e.target.value}))} />
          </div>

          <div className="form-field">
            <label>Descripción</label>
            <input value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
          </div>

          <div className="form-field">
            <label>Crear denuncia (opcional)</label>
            <input placeholder="Título (requerido para crear)" value={localDen.titulo} onChange={(e) => setLocalDen(prev => ({...prev, titulo: e.target.value}))} />
            <input placeholder="ID Ciudadano (requerido)" value={localDen.ciudadano_id} onChange={(e) => setLocalDen(prev => ({...prev, ciudadano_id: e.target.value}))} />
            <input placeholder="Categoría" value={localDen.categoria} onChange={(e) => setLocalDen(prev => ({...prev, categoria: e.target.value}))} />
            <input placeholder="Prioridad" value={localDen.prioridad} onChange={(e) => setLocalDen(prev => ({...prev, prioridad: e.target.value}))} />
          </div>

          <div style={{display:'flex',gap:8,marginTop:8}}>
            <button className="btn primary" type="submit" disabled={saving}>{saving ? 'Guardando...' : (editingId ? 'Actualizar' : 'Crear')}</button>
            <button className="btn ghost" type="button" onClick={() => navigate('/det-evidencias')}>Cancelar</button>
          </div>
        </form>
      </div>

      {showDenunciaPicker && (
        <ModalPicker
          title="Seleccionar denuncia"
          fetchItems={getDenunciasPaginated}
          renderItem={(it: any) => `${it.id_denuncia} — ${it.titulo || ''}`}
          onClose={() => setShowDenunciaPicker(false)}
          onSelect={(it: any) => { setDenunciaId(String(it.id_denuncia)); setDenunciaLabel(`${it.id_denuncia} — ${it.titulo || ''}`); setShowDenunciaPicker(false); }}
        />
      )}

      {showEvidenciaPicker && (
        <ModalPicker
          title="Seleccionar evidencia"
          fetchItems={getEvidencias}
          renderItem={(it: any) => `${it.id_evidencia} — ${it.observaciones || ''}`}
          onClose={() => setShowEvidenciaPicker(false)}
          onSelect={(it: any) => { setEvidenciaId(String(it.id_evidencia)); setEvidenciaLabel(`${it.id_evidencia} — ${it.observaciones || ''}`); setShowEvidenciaPicker(false); }}
        />
      )}
    </div>
  );
}
