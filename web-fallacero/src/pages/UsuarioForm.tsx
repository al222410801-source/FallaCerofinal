import React, {useState, useEffect} from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createUsuario, updateUsuario, getUsuarios } from '../graphql/usuario-crud';
import ModalPicker from '../components/ModalPicker';
import { getAllRoles } from '../graphql/rol';

export default function UsuarioForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rolId, setRolId] = useState('');
  const [roles, setRoles] = useState<any[]>([]);
  const [empleadoId, setEmpleadoId] = useState('');
  const [ciudadanoId, setCiudadanoId] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [ultimoAcceso, setUltimoAcceso] = useState('');
  const [activo, setActivo] = useState(true);
  const [showRolPicker, setShowRolPicker] = useState(false);
  const [rolLabel, setRolLabel] = useState('');
  const [searchParams] = useSearchParams();
  const editingId = searchParams.get('id');

  useEffect(() => {
    if (!editingId) return;
    (async () => {
      try {
        const users = await getUsuarios(1, 1000);
        const u = (users || []).find((x: any) => String(x.id_usuario) === String(editingId));
        if (u) {
          setUsername(u.username || '');
          setPassword('');
          setRolId(u.rol_id ? String(u.rol_id) : '');
          setEmpleadoId(u.empleado_id ? String(u.empleado_id) : '');
          setCiudadanoId(u.ciudadano_id ? String(u.ciudadano_id) : '');
          setAvatarUrl(u.avatar_url || '');
          setUltimoAcceso(u.ultimo_acceso || '');
          setActivo(Boolean(u.activo));
          setRolLabel(u.rol_id ? String(u.rol_id) : '');
        }
      } catch (err) { console.error(err); }
    })();
  }, [editingId]);

  useEffect(() => {
    getAllRoles().then((r: any[]) => setRoles(r)).catch((e) => console.error('Error loading roles', e));
  }, []);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Validaciones similares a la app
      if (!username.trim()) { alert('El nombre de usuario es obligatorio.'); return; }
      if (!editingId && !password.trim()) { alert('La contraseña es obligatoria al crear un usuario.'); return; }
      if (!rolId) { alert('Debes seleccionar un rol.'); return; }

      const inputParaEnvio: any = {
        username: username.trim(),
        password_hash: password,
        rol_id: rolId ? Number(rolId) : undefined,
        empleado_id: empleadoId ? Number(empleadoId) : undefined,
        ciudadano_id: ciudadanoId ? Number(ciudadanoId) : undefined,
        avatar_url: avatarUrl || '',
        ultimo_acceso: ultimoAcceso || new Date().toISOString().split('T')[0],
        activo,
      };
      if (editingId) {
        // no enviar contraseña si quedó vacía (no modificarla)
        if (!inputParaEnvio.password_hash) delete inputParaEnvio.password_hash;
        await updateUsuario(Number(editingId), inputParaEnvio);
      } else {
        await createUsuario(inputParaEnvio);
      }
      navigate('/usuarios');
    } catch (err) { alert('Error: ' + (err as any)?.message || String(err)); }
  };

  return (
    <div>
      <h1 className="page-title">{editingId ? 'Editar usuario' : 'Nuevo usuario'}</h1>
      <div className="card">
        <form onSubmit={submit}>
          <div className="form-field">
            <label>Username</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>

          <div className="form-field">
            <label>{editingId ? 'Nueva contraseña (vacío = sin cambios)' : 'Contraseña *'}</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <h3 className="section">Rol</h3>
          <div className="form-field">
            {roles.length === 0 ? (
              <div>Loading roles...</div>
            ) : (
              <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
                {roles.map((r: any) => (
                  <button key={r.id_rol} type="button"
                    className={String(rolId) === String(r.id_rol) ? 'btn btn-selected' : 'btn'}
                    onClick={() => {
                      console.debug('Seleccionado rol', r);
                      setRolId(String(r.id_rol));
                      setRolLabel(`${r.id_rol} — ${r.nombre}`);
                    }}>
                    {r.nombre}
                  </button>
                ))}
              </div>
            )}
            {!rolId && <div style={{color:'#b91c1c',marginTop:6,fontSize:12}}>Debes seleccionar un rol</div>}
            <div style={{marginTop:6,fontSize:13,color:'#374151'}}>Rol seleccionado: {rolLabel || (rolId ? String(rolId) : 'Ninguno')}</div>
            <div style={{marginTop:8}}>
              <button className="btn" type="button" onClick={() => setShowRolPicker(true)}>Buscar rol</button>
            </div>
          </div>

          <div className="form-field">
            <label>Usuario Activo</label>
            <input type="checkbox" checked={activo} onChange={(e) => setActivo(e.target.checked)} />
          </div>

          <div style={{display:'flex',gap:8,marginTop:8}}>
            <button className="btn btn-primary" type="submit">{editingId ? 'Actualizar usuario' : 'Crear usuario'}</button>
            <button className="btn btn-ghost" type="button" onClick={() => navigate('/usuarios')}>Cancelar</button>
          </div>
        </form>
      </div>
      {showRolPicker && (
        <ModalPicker
          title="Seleccionar rol"
          fetchItems={getAllRoles}
          renderItem={(it: any) => `${it.id_rol} — ${it.nombre}`}
          onClose={() => setShowRolPicker(false)}
          onSelect={(it: any) => { setRolId(String(it.id_rol)); setRolLabel(`${it.id_rol} — ${it.nombre}`); setShowRolPicker(false); }}
        />
      )}
    </div>
  );
}
