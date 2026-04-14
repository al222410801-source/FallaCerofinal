import { graphqlRequest } from '../api/pandoraApi';

const USUARIO_FIELDS = `
  id_usuario
  username
  rol_id: id_tipo_usuario
  empleado_id
  ciudadano_id
  avatar_url
  ultimo_acceso
  activo
`;

export const getUsuarios = (page = 1, limit = 10) =>
  graphqlRequest<{usuariosP: any[]}>(
    `query GetUsuarios($page: Int, $limit: Int) { usuariosP(page: $page, limit: $limit) { ${USUARIO_FIELDS} } }`,
    {page: Number(page), limit: Number(limit)}
  ).then((d) => d.usuariosP);

export const createUsuario = (input: any) => {
  const serverInput: any = {...input};
  if (serverInput.rol_id !== undefined) {
    serverInput.id_tipo_usuario = Number(serverInput.rol_id);
    delete serverInput.rol_id;
  }
  return graphqlRequest<{createUsuario: any}>(
    `mutation CreateUsuario($input: CreateUsuarioInput!) { createUsuario(input: $input) { ${USUARIO_FIELDS} } }`,
    {input: serverInput}
  ).then((d) => d.createUsuario);
};

export const updateUsuario = (id: number, input: any) => {
  const serverInput: any = {...input};
  if (serverInput.rol_id !== undefined) {
    serverInput.id_tipo_usuario = Number(serverInput.rol_id);
    delete serverInput.rol_id;
  }
  return graphqlRequest<{updateUsuario: any}>(
    `mutation UpdateUsuario($id: Int!, $input: UpdateUsuarioInput!) { updateUsuario(id: $id, input: $input) { ${USUARIO_FIELDS} } }`,
    {id: Number(id), input: serverInput}
  ).then((d) => d.updateUsuario);
};

export const deleteUsuario = (id: number) =>
  graphqlRequest<{removeUsuario: boolean}>(
    `mutation DeleteUsuario($id: Int!) { removeUsuario(id: $id) }`,
    {id: Number(id)}
  ).then((d) => d.removeUsuario);
