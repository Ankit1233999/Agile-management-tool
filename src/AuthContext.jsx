/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from './api';

const SESSION_KEY = 'agileflow-session';
const AuthContext = createContext(null);

const readStoredSession = () => {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (session?.token && !localStorage.getItem('token')) {
      localStorage.setItem('token', session.token);
    }
    return session;
  } catch {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem('token');
    return null;
  }
};

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readStoredSession);
  const [isCheckingSession, setIsCheckingSession] = useState(Boolean(session?.token));

  const setAuthenticatedSession = (nextSession) => {
    const token = nextSession.token || localStorage.getItem('token') || '';
    const normalized = {
      token,
      user: {
        _id: nextSession._id || nextSession.user?._id,
        name: nextSession.name || nextSession.user?.name,
        email: nextSession.email || nextSession.user?.email,
        avatar: nextSession.avatar || nextSession.user?.avatar || '',
      },
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(normalized));
    if (token) {
      localStorage.setItem('token', token);
    }
    setSession(normalized);
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem('token');
    setSession(null);
  };

  useEffect(() => {
    if (!session?.token) {
      return undefined;
    }

    let active = true;
    api.me(session.token)
      .then((user) => {
        if (active) setAuthenticatedSession({ token: session.token, user });
      })
      .catch(() => {
        if (active) logout();
      })
      .finally(() => {
        if (active) setIsCheckingSession(false);
      });

    return () => {
      active = false;
    };
  }, [session?.token]);

  const value = useMemo(() => ({
    user: session?.user || null,
    token: session?.token || null,
    isCheckingSession,
    login: async (credentials) => {
      const result = await api.login(credentials);
      setAuthenticatedSession(result);
      return result;
    },
    register: async (details) => {
      const result = await api.register(details);
      setAuthenticatedSession(result);
      return result;
    },
    logout,
  }), [session, isCheckingSession]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
