import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { fetchCurrentUser, googleAuthRequest, loginRequest, logoutRequest, registerRequest } from '../services/api';
import type { AuthSession, GoogleAuthPayload, RegistrationPayload, User } from '../types';

type AuthStatus = 'loading' | 'authenticated' | 'anonymous';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  status: AuthStatus;
  login: (payload: { email: string; password: string }) => Promise<AuthSession>;
  register: (payload: RegistrationPayload) => Promise<AuthSession>;
  loginWithGoogle: (payload: GoogleAuthPayload) => Promise<AuthSession>;
  logout: () => Promise<void>;
}

const SESSION_KEY = 'book-exchange-session';
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const readStoredSession = (): AuthSession | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) {
      return null;
    }

    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');

  useEffect(() => {
    const initialize = async () => {
      const storedSession = readStoredSession();
      if (!storedSession?.token) {
        setStatus('anonymous');
        return;
      }

      try {
        const user = await fetchCurrentUser(storedSession.token);
        const nextSession = { ...storedSession, user };
        setSession(nextSession);
        window.localStorage.setItem(SESSION_KEY, JSON.stringify(nextSession));
        setStatus('authenticated');
      } catch {
        window.localStorage.removeItem(SESSION_KEY);
        setSession(null);
        setStatus('anonymous');
      }
    };

    initialize();
  }, []);

  const persistSession = (nextSession: AuthSession | null) => {
    setSession(nextSession);
    if (typeof window === 'undefined') {
      return;
    }

    if (nextSession) {
      window.localStorage.setItem(SESSION_KEY, JSON.stringify(nextSession));
    } else {
      window.localStorage.removeItem(SESSION_KEY);
    }
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      token: session?.token ?? null,
      isAuthenticated: Boolean(session),
      isLoading: status === 'loading',
      status,
      login: async (payload) => {
        const nextSession = await loginRequest(payload);
        persistSession(nextSession);
        setStatus('authenticated');
        return nextSession;
      },
      register: async (payload) => {
        const nextSession = await registerRequest(payload);
        persistSession(nextSession);
        setStatus('authenticated');
        return nextSession;
      },
      loginWithGoogle: async (payload) => {
        const nextSession = await googleAuthRequest(payload);
        persistSession(nextSession);
        setStatus('authenticated');
        return nextSession;
      },
      logout: async () => {
        await logoutRequest(session?.token ?? undefined);
        persistSession(null);
        setStatus('anonymous');
      },
    }),
    [session, status],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
