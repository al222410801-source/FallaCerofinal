import React, {useState, useEffect} from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createEvidencia, getEvidencia, updateEvidencia } from '../graphql/evidencia';

export default function EvidenciaForm() {
  const [observaciones, setObservaciones] = useState('');
  const [imagen, setImagen] = useState('');
  const [searchParams] = useSearchParams();
  const editingId = searchParams.get('id');
  const navigate = useNavigate();

  useEffect(() => {
    if (!editingId) return;
    (async () => {
      try {
        const e = await getEvidencia(Number(editingId));
        if (e) {
          setObservaciones(e.observaciones || '');
          setImagen(e.imagen || '');
        }
      } catch (err) { console.error('load evidencia', err); }
    })();
  }, [editingId]);

  const handleFile = (file?: File) => {
    if (!file) { setImagen(''); return; }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string | null;
      if (result) setImagen(result);
    };
    reader.readAsDataURL(file);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateEvidencia(Number(editingId), { observaciones, imagen });
      } else {
        await createEvidencia({ observaciones, imagen });
      }
      navigate('/evidencias');
    } catch (err) { alert('Error: ' + (err as any)?.message || String(err)); }
  };

  return (
    <div>
      <h1 className="page-title">Evidencia — Form</h1>
      <div className="card">
        <form onSubmit={submit}>
          <div className="form-field">
            <label>Imagen (subir)</label>
            <input type="file" accept="image/*" onChange={(e) => handleFile(e.target.files ? e.target.files[0] : undefined)} />
            {imagen ? <div style={{marginTop:8}}><img src={imagen} alt="preview" style={{maxWidth:300, maxHeight:200}}/></div> : null}
          </div>

          <div className="form-field">
            <label>Observaciones</label>
            <input value={observaciones} onChange={(e) => setObservaciones(e.target.value)} />
          </div>

          <div style={{display:'flex',gap:8,marginTop:8}}>
            <button className="btn primary" type="submit">{editingId ? 'Actualizar' : 'Crear'}</button>
            <button className="btn ghost" type="button" onClick={() => navigate('/evidencias')}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
