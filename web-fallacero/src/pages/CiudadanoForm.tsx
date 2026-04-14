import React, {useState, useEffect} from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createCiudadano, getCiudadano, updateCiudadano } from '../graphql/ciudadano';

export default function CiudadanoForm() {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [apellidoM, setApellidoM] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [fechaRegistro, setFechaRegistro] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editingId = searchParams.get('id');

  useEffect(() => {
    if (!editingId) return;
    (async () => {
      try {
        const c = await getCiudadano(Number(editingId));
        if (c) {
          setNombre(c.nombre || '');
          setApellido(c.apellido_p || '');
          setApellidoM(c.apellido_m || '');
          setCorreo(c.correo || '');
          setTelefono(c.telefono || '');
          setFechaRegistro(c.fecha_registro || '');
        }
      } catch (err) { console.error(err); }
    })();
  }, [editingId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateCiudadano(Number(editingId), { nombre, apellido_p: apellido, apellido_m: apellidoM || undefined, correo: correo || undefined, telefono: telefono || undefined, fecha_registro: fechaRegistro || undefined });
      } else {
        await createCiudadano({ nombre, apellido_p: apellido, apellido_m: apellidoM || undefined, correo: correo || undefined, telefono: telefono || undefined, fecha_registro: fechaRegistro || undefined });
      }
      navigate('/ciudadanos');
    } catch (err) { alert('Error: ' + (err as any)?.message || String(err)); }
  };

  return (
    <div>
      <h1 className="page-title">Ciudadano — Form</h1>
      <div className="card">
        <form onSubmit={submit}>
          <div className="form-field">
            <label>Nombre</label>
            <input value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </div>

          <div className="form-field">
            <label>Apellido Paterno</label>
            <input value={apellido} onChange={(e) => setApellido(e.target.value)} />
          </div>

          <div className="form-field">
            <label>Apellido Materno</label>
            <input value={apellidoM} onChange={(e) => setApellidoM(e.target.value)} />
          </div>

          <div className="form-field">
            <label>Correo</label>
            <input value={correo} onChange={(e) => setCorreo(e.target.value)} />
          </div>

          <div className="form-field">
            <label>Teléfono</label>
            <input value={telefono} onChange={(e) => setTelefono(e.target.value)} />
          </div>

          <div className="form-field">
            <label>Fecha de registro</label>
            <input type="date" value={fechaRegistro} onChange={(e) => setFechaRegistro(e.target.value)} />
          </div>

          <div style={{display:'flex',gap:8,marginTop:8}}>
            <button className="btn primary" type="submit">Crear</button>
            <button className="btn ghost" type="button" onClick={() => navigate('/ciudadanos')}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
