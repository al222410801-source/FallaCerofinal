import { graphqlRequest } from '../api/pandoraApi';

export const loginUsuario = (username: string, password: string) =>
  graphqlRequest<{ login: any }>(
    `query Login($input: UpdateUsuarioInput!) {
      login(input: $input) {
        id_usuario
        username
        rol_id: id_tipo_usuario
        empleado_id
        ciudadano_id
        avatar_url
        ultimo_acceso
        activo
      }
    }`,
    {
      input: {
        id_usuario: 0,
        username,
        password_hash: password,
      },
    }
  ).then((d) => d.login);
