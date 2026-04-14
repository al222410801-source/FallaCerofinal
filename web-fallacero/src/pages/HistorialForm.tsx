import React, {useState, useEffect} from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ModalPicker from '../components/ModalPicker';
import { getHistorial, createHistorial, updateHistorial } from '../graphql/historialEstado';
import { getCiudadanosPaginated } from '../graphql/ciudadano';
import { getDenunciasPaginated } from '../graphql/denuncia';
import { getServidoresPaginated } from '../graphql/servidorPublico';

const ESTADOS = ['RECIBIDO','EN_REVISION','ASIGNADO','EN_PROCESO','RESUELTO','CERRADO','RECHAZADO'];

export default function HistorialForm() {
  const [fecha, setFecha] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [estado, setEstado] = useState('RECIBIDO');
  const [ciudadanoId, setCiudadanoId] = useState('');
  const [ciudadanoLabel, setCiudadanoLabel] = useState('');
  const [denunciaId, setDenunciaId] = useState('');
  const [denunciaLabel, setDenunciaLabel] = useState('');
  const [servidorId, setServidorId] = useState('');
  const [servidorLabel, setServidorLabel] = useState('');
  const [showCiudadanoPicker, setShowCiudadanoPicker] = useState(false);
  const [showDenunciaPicker, setShowDenunciaPicker] = useState(false);
  const [showServidorPicker, setShowServidorPicker] = useState(false);
  const [searchParams] = useSearchParams();
  const editingId = searchParams.get('id');
  const navigate = useNavigate();

  useEffect(() => {
    if (!editingId) return;
    (async () => {
      try {
        const h = await getHistorial(Number(editingId));
        if (h) {
          setFecha(h.fecha || '');
          setObservaciones(h.observaciones || '');
          setEstado(h.estado || 'RECIBIDO');
          setCiudadanoId(h.ciudadano_id ? String(h.ciudadano_id) : '');
          setCiudadanoLabel(h.ciudadano ? `${h.ciudadano.nombre} ${h.ciudadano.apellido_p || ''}` : '');
          setDenunciaId(h.denuncia_id ? String(h.denuncia_id) : '');
          setDenunciaLabel(h.denuncia ? `${h.denuncia.titulo}` : '');
          setServidorId(h.servidor_publico_id ? String(h.servidor_publico_id) : '');
          setServidorLabel(h.servidor_publico ? `${h.servidor_publico.nombre} ${h.servidor_publico.apellido_p || ''}` : '');
        }
      } catch (err) { console.error(err); }
    })();
  }, [editingId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const f = fecha && String(fecha).trim() !== '' ? fecha : new Date().toISOString().slice(0,10);
      const input: any = { fecha: f, observaciones, estado };
      if (ciudadanoId && String(ciudadanoId).trim() !== '') input.ciudadano_id = Number(ciudadanoId);
      if (denunciaId && String(denunciaId).trim() !== '') input.denuncia_id = Number(denunciaId);
      if (servidorId && String(servidorId).trim() !== '') input.servidor_publico_id = Number(servidorId);
      if (editingId) {
        await updateHistorial(Number(editingId), input);
      } else {
        await createHistorial(input);
      }
      navigate('/historiales');
    } catch (err) { alert('Error: ' + (err as any)?.message || String(err)); }
  };

  return (
    <div>
      <h1 className="page-title">Historial — Form</h1>
      <div className="card">
        <form onSubmit={submit}>
          <div className="form-field">
            <label>Fecha</label>
            <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
          </div>

          <div className="form-field">
            <label>Observaciones</label>
            <textarea value={observaciones} onChange={(e) => setObservaciones(e.target.value)} />
          </div>

          <div className="form-field">
            <label>Estado</label>
            <select value={estado} onChange={(e) => setEstado(e.target.value)}>
              {ESTADOS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="form-field">
            <label>Ciudadano</label>
            <div style={{display:'flex',gap:8,alignItems:'center'}}>
              <input value={ciudadanoLabel || ciudadanoId} onChange={(e) => { setCiudadanoId(e.target.value); setCiudadanoLabel(''); }} placeholder="ID o nombre" />
              <button className="btn" type="button" onClick={() => setShowCiudadanoPicker(true)}>Buscar</button>
            </div>
          </div>

          <div className="form-field">
            <label>Denuncia</label>
            <div style={{display:'flex',gap:8,alignItems:'center'}}>
              <input value={denunciaLabel || denunciaId} onChange={(e) => { setDenunciaId(e.target.value); setDenunciaLabel(''); }} placeholder="ID o título" />
              <button className="btn" type="button" onClick={() => setShowDenunciaPicker(true)}>Buscar</button>
            </div>
          </div>

          <div className="form-field">
            <label>Servidor público</label>
            <div style={{display:'flex',gap:8,alignItems:'center'}}>
              <input value={servidorLabel || servidorId} onChange={(e) => { setServidorId(e.target.value); setServidorLabel(''); }} placeholder="ID o nombre" />
              <button className="btn" type="button" onClick={() => setShowServidorPicker(true)}>Buscar</button>
            </div>
          </div>

          <div style={{display:'flex',gap:8,marginTop:8}}>
            <button className="btn primary" type="submit">Guardar</button>
            <button className="btn ghost" type="button" onClick={() => navigate('/historiales')}>Cancelar</button>
          </div>
        </form>
      </div>

      {showCiudadanoPicker && (
        <ModalPicker
          title="Seleccionar ciudadano"
          fetchItems={getCiudadanosPaginated}
          renderItem={(it: any) => `${it.id_ciudadano} — ${it.nombre} ${it.apellido_p || ''}`}
          onClose={() => setShowCiudadanoPicker(false)}
          onSelect={(it: any) => { setCiudadanoId(String(it.id_ciudadano)); setCiudadanoLabel(`${it.nombre} ${it.apellido_p || ''}`); setShowCiudadanoPicker(false); }}
        />
      )}

      {showDenunciaPicker && (
        <ModalPicker
          title="Seleccionar denuncia"
          fetchItems={getDenunciasPaginated}
          renderItem={(it: any) => `${it.id_denuncia} — ${it.titulo}`}
          onClose={() => setShowDenunciaPicker(false)}
          onSelect={(it: any) => { setDenunciaId(String(it.id_denuncia)); setDenunciaLabel(`${it.titulo}`); setShowDenunciaPicker(false); }}
        />
      )}

      {showServidorPicker && (
        <ModalPicker
          title="Seleccionar servidor público"
          fetchItems={getServidoresPaginated}
          renderItem={(it: any) => `${it.id_servidor} — ${it.nombre} ${it.apellido_p || ''}`}
          onClose={() => setShowServidorPicker(false)}
          onSelect={(it: any) => { setServidorId(String(it.id_servidor)); setServidorLabel(`${it.nombre} ${it.apellido_p || ''}`); setShowServidorPicker(false); }}
        />
      )}
    </div>
  );
}
