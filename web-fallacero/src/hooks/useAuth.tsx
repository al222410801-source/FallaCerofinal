import React, {createContext, useContext, useEffect, useMemo, useState} from 'react';
import {pandoraApi, setAuthToken, graphqlRequest} from '../api/pandoraApi';
import { loginUsuario } from '../graphql/usuario';

type User = any;

type AuthContextType = {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  loginWithToken: (token: string) => Promise<void>;
  loginWithCredentials?: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [token, setToken] = useState<string | null>(() => {
    try { return localStorage.getItem('fc_token'); } catch { return null; }
  });
  const [user, setUser] = useState<User | null>(() => {
    try { const raw = localStorage.getItem('fc_user'); return raw ? JSON.parse(raw) : null; } catch { return null; }
  });
  const [loading, setLoading] = useState<boolean>(!!token);

  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  useEffect(() => {
    if (!token) return setLoading(false);
    // try to fetch "me" info; tolerant if GraphQL schema differs
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const query = `query Me { me { id username email } }`;
        const res = await graphqlRequest<{ me: User }>(query);
        if (mounted) setUser(res?.me ?? null);
      } catch (err) {
        // ignore errors for now — user will remain as-is
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [token]);

  const loginWithToken = async (newToken: string) => {
    setToken(newToken);
    try { localStorage.setItem('fc_token', newToken); } catch {}
    setAuthToken(newToken);
  };

  const loginWithCredentials = async (username: string, password: string) => {
    setLoading(true);
    try {
      const u = await loginUsuario(username, password);
      if (!u) throw new Error('Credenciales inválidas');
      setUser(u);
      try { localStorage.setItem('fc_user', JSON.stringify(u)); } catch {}
      // no token issued by backend; ensure auth header cleared
      setToken(null);
      setAuthToken(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    try { localStorage.removeItem('fc_token'); localStorage.removeItem('fc_user'); } catch {}
    setAuthToken(null);
    // redirect to home after logout
    try {
      window.location.href = '/';
    } catch (e) {
      // fallback: replace history
      window.location.replace('/');
    }
  };

  const value = useMemo(() => ({ token, user, isAuthenticated: !!token || !!user, loading, loginWithToken, loginWithCredentials, logout }), [token, user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
