import React, {useState, useEffect} from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createServidor, updateServidor, getServidoresPaginated } from '../graphql/servidorPublico';

export default function ServidorForm() {
  const [nombre, setNombre] = useState('');
  const [cargo, setCargo] = useState('');
  const [apellidoP, setApellidoP] = useState('');
  const [apellidoM, setApellidoM] = useState('');
  const [emailPersonal, setEmailPersonal] = useState('');
  const [telefono, setTelefono] = useState('');
  const [dependencia, setDependencia] = useState('');
  const [fechaIngreso, setFechaIngreso] = useState('');
  const [activo, setActivo] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editingId = searchParams.get('id');

  useEffect(() => {
    if (!editingId) return;
    (async () => {
      try {
        const items = await getServidoresPaginated(1, 1000);
        const s = (items || []).find((x: any) => String(x.id_servidor) === String(editingId));
        if (s) {
          setNombre(s.nombre || '');
          setApellidoP(s.apellido_p || '');
          setApellidoM(s.apellido_m || '');
          setEmailPersonal(s.email_personal || '');
          setCargo(s.cargo || '');
          setTelefono(s.telefono || '');
          setDependencia(s.dependencia || '');
          setFechaIngreso(s.fecha_ingreso || '');
          setActivo(Boolean(s.activo));
        }
      } catch (err) { console.error(err); }
    })();
  }, [editingId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateServidor(Number(editingId), { nombre, apellido_p: apellidoP || undefined, apellido_m: apellidoM || undefined, email_personal: emailPersonal || undefined, cargo, telefono: telefono || undefined, dependencia: dependencia || undefined, fecha_ingreso: fechaIngreso || undefined, activo });
      } else {
        await createServidor({ nombre, apellido_p: apellidoP || undefined, apellido_m: apellidoM || undefined, email_personal: emailPersonal || undefined, cargo, telefono: telefono || undefined, dependencia: dependencia || undefined, fecha_ingreso: fechaIngreso || undefined, activo });
      }
      navigate('/servidores');
    } catch (err) { alert('Error: ' + (err as any)?.message || String(err)); }
  };

  return (
    <div>
      <h1 className="page-title">Servidor — Form</h1>
      <div className="card">
        <form onSubmit={submit}>
          <div className="form-field">
            <label>Nombre</label>
            <input value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </div>

          <div className="form-field">
            <label>Apellido Paterno</label>
            <input value={apellidoP} onChange={(e) => setApellidoP(e.target.value)} />
          </div>

          <div className="form-field">
            <label>Apellido Materno</label>
            <input value={apellidoM} onChange={(e) => setApellidoM(e.target.value)} />
          </div>

          <div className="form-field">
            <label>Email personal</label>
            <input value={emailPersonal} onChange={(e) => setEmailPersonal(e.target.value)} />
          </div>

          <div className="form-field">
            <label>Cargo</label>
            <input value={cargo} onChange={(e) => setCargo(e.target.value)} />
          </div>

          <div className="form-field">
            <label>Teléfono</label>
            <input value={telefono} onChange={(e) => setTelefono(e.target.value)} />
          </div>

          <div className="form-field">
            <label>Dependencia</label>
            <input value={dependencia} onChange={(e) => setDependencia(e.target.value)} />
          </div>

          <div className="form-field">
            <label>Fecha de ingreso</label>
            <input type="date" value={fechaIngreso} onChange={(e) => setFechaIngreso(e.target.value)} />
          </div>

          <div className="form-field">
            <label>Activo</label>
            <input type="checkbox" checked={activo} onChange={(e) => setActivo(e.target.checked)} />
          </div>

          <div style={{display:'flex',gap:8,marginTop:8}}>
            <button className="btn primary" type="submit">Crear</button>
            <button className="btn ghost" type="button" onClick={() => navigate('/servidores')}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
