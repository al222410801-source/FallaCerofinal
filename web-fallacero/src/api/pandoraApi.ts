import axios from 'axios';

// Vite environment variable (use VITE_GRAPHQL_URL). Fallback a localhost.
const BASE_URL = (import.meta.env.VITE_GRAPHQL_URL as string) || 'http://localhost:3000/graphql';

export const pandoraApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function graphqlRequest<T>(query: string, variables?: object): Promise<T> {
  const requestBody = { query, variables };
  try {
    try { console.debug('GraphQL request:', JSON.stringify(requestBody)); } catch (e) {}
    const response = await pandoraApi.post('', requestBody);

    if (response.data?.errors) {
      throw new Error(response.data.errors[0].message);
    }

    return response.data.data as T;

  } catch (error: any) {
    if (error.response && error.response.data) {
      const resp = error.response.data;
      const msg = resp.errors ? resp.errors.map((e: any) => e.message).join('; ') : JSON.stringify(resp);
      const body = (() => {
        try { return JSON.stringify((error.config && error.config.data) ? JSON.parse(error.config.data) : requestBody); } catch (e) { return JSON.stringify(requestBody); }
      })();
      // Log detailed info to aid debugging in browser console
      try {
        console.error('GraphQL error response:', {status: error.response.status, resp, request: body});
        if (resp && resp.errors) console.error('GraphQL errors array:', resp.errors);
      } catch (e) {}
      // Show a visible alert in the browser to help the developer copy the error quickly
      try {
        if (typeof window !== 'undefined' && resp && resp.errors) {
          const msgs = (resp.errors || []).map((x: any) => x.message || JSON.stringify(x)).join('\n');
          alert(`GraphQL error (${error.response.status}):\n${msgs}`);
        }
      } catch (e) {}
      throw new Error(`GraphQL error (${error.response.status}): ${msg} -- request: ${body}`);
    }
    throw new Error(error.message || String(error));
  }
}

export function setAuthToken(token?: string | null) {
  if (token) {
    pandoraApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete pandoraApi.defaults.headers.common['Authorization'];
  }
}
