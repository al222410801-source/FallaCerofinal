import { graphqlRequest } from '../api/pandoraApi';

const CIUDADANO_FIELDS = `
  id_ciudadano
  nombre
  apellido_p
  apellido_m
  correo
  telefono
  fecha_registro
`;

export const getCiudadanosPaginated = (page = 1, limit = 10, q?: string) => {
  if (q && q.length > 0) {
    return graphqlRequest<{ciudadanosP: any[]}>(
      `query GetCiudadanosP($page: Int, $limit: Int, $q: String) { ciudadanosP(page: $page, limit: $limit, q: $q) { ${CIUDADANO_FIELDS} } }`,
      {page: Number(page), limit: Number(limit), q}
    ).then((d) => d.ciudadanosP);
  }

  return graphqlRequest<{ciudadanosP: any[]}>(
    `query GetCiudadanosP($page: Int, $limit: Int) { ciudadanosP(page: $page, limit: $limit) { ${CIUDADANO_FIELDS} } }`,
    {page: Number(page), limit: Number(limit)}
  ).then((d) => d.ciudadanosP);
};

export const getCiudadano = (id: number) =>
  graphqlRequest<{ciudadano: any}>(
    `query GetCiudadano($id: Int!) { ciudadano(id: $id) { ${CIUDADANO_FIELDS} } }`,
    {id: Number(id)}
  ).then((d) => d.ciudadano);

export const deleteCiudadano = (id: number) =>
  graphqlRequest<{removeCiudadano: boolean}>(
    `mutation DeleteCiudadano($id: Int!) { removeCiudadano(id: $id) }`,
    {id: Number(id)}
  ).then((d) => d.removeCiudadano);

export const createCiudadano = (input: any) =>
  graphqlRequest<{createCiudadano: any}>(
    `mutation CreateCiudadano($input: CreateCiudadanoInput!) { createCiudadano(input: $input) { ${CIUDADANO_FIELDS} } }`,
    {input}
  ).then((d) => d.createCiudadano);

export const updateCiudadano = (id: number, input: any) =>
  graphqlRequest<{updateCiudadano: any}>(
    `mutation UpdateCiudadano($id: Int!, $input: UpdateCiudadanoInput!) { updateCiudadano(id: $id, input: $input) { ${CIUDADANO_FIELDS} } }`,
    // Ensure input includes required id_ciudadano field expected by the server DTO
    {id: Number(id), input: {...input, id_ciudadano: Number(id)}}
  ).then((d) => d.updateCiudadano);
