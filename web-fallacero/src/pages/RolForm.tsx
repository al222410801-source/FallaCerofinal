import React, {useState, useEffect} from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createRol } from '../graphql/rol';
import { updateRol, getAllRoles } from '../graphql/rol';

export default function RolForm() {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [usCiudadano, setUsCiudadano] = useState(false);
  const [usServidor, setUsServidor] = useState(false);
  const [usAdministrador, setUsAdministrador] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editingId = searchParams.get('id');

  useEffect(() => {
    if (!editingId) return;
    (async () => {
      try {
        const roles = await getAllRoles();
        const r = (roles || []).find((x: any) => String(x.id_rol) === String(editingId));
        if (r) {
          setNombre(r.nombre || '');
          setDescripcion(r.descripcion || '');
          setUsCiudadano(Boolean(r.us_ciudadano));
          setUsServidor(Boolean(r.us_servidor));
          setUsAdministrador(Boolean(r.us_administrador));
        }
      } catch (err) { console.error(err); }
    })();
  }, [editingId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateRol(Number(editingId), { nombre, descripcion, us_ciudadano: usCiudadano, us_servidor: usServidor, us_administrador: usAdministrador });
      } else {
        await createRol({ nombre, descripcion, us_ciudadano: usCiudadano, us_servidor: usServidor, us_administrador: usAdministrador });
      }
      navigate('/roles');
    } catch (err) { alert('Error: ' + (err as any)?.message || String(err)); }
  };

  return (
    <div>
      <h1 className="page-title">Rol — Crear</h1>
      <div className="card">
        <form onSubmit={submit}>
          <div className="form-field">
            <label>Nombre</label>
            <input value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </div>
          <div className="form-field">
            <label>Descripción</label>
            <input value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
          </div>

          <div className="form-field">
            <label><input type="checkbox" checked={usCiudadano} onChange={(e) => setUsCiudadano(e.target.checked)} /> Permite ciudadano</label>
          </div>
          <div className="form-field">
            <label><input type="checkbox" checked={usServidor} onChange={(e) => setUsServidor(e.target.checked)} /> Permite servidor</label>
          </div>
          <div className="form-field">
            <label><input type="checkbox" checked={usAdministrador} onChange={(e) => setUsAdministrador(e.target.checked)} /> Permite administrador</label>
          </div>
          <div style={{display:'flex',gap:8,marginTop:8}}>
            <button className="btn btn-primary" type="submit">Crear</button>
            <button className="btn btn-ghost" type="button" onClick={() => navigate('/roles')}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
