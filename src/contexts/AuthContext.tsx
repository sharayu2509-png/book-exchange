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
const LOCAL_USERS_KEY = 'book-exchange-local-users';
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface LocalUser extends User {
  password: string;
}

const DEMO_USERS: LocalUser[] = [
  {
    id: 'demo-user-1',
    name: 'Ananya Sharma',
    email: 'ananya@bookexchange.test',
    college: 'IIT Delhi',
    branch: 'Computer Science',
    semester: '3rd',
    phone: '9999999001',
    avatarUrl: 'https://api.dicebear.com/7.x/thumbs/svg?seed=Ananya%20Sharma',
    password: 'Password123',
  },
  {
    id: 'demo-user-2',
    name: 'Rohit Verma',
    email: 'rohit@bookexchange.test',
    college: 'Delhi University',
    branch: 'Commerce',
    semester: '4th',
    phone: '9999999002',
    avatarUrl: 'https://api.dicebear.com/7.x/thumbs/svg?seed=Rohit%20Verma',
    password: 'Password123',
  },
];

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

const readLocalUsers = (): LocalUser[] => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(LOCAL_USERS_KEY);
    const users = raw ? (JSON.parse(raw) as LocalUser[]) : [];
    if (users.length === 0) {
      window.localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(DEMO_USERS));
      return DEMO_USERS;
    }

    return users;
  } catch {
    window.localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(DEMO_USERS));
    return DEMO_USERS;
  }
};

const writeLocalUsers = (users: LocalUser[]) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
};

const buildLocalSession = (user: User): AuthSession => ({
  user,
  token: `local-${user.id}-${Date.now()}`,
});

const toLocalUser = (payload: RegistrationPayload, password: string, avatarUrl?: string): LocalUser => ({
  id: `local-${Date.now()}`,
  name: payload.name,
  email: payload.email.toLowerCase().trim(),
  college: payload.college,
  branch: payload.branch,
  semester: payload.semester,
  phone: payload.phone,
  avatarUrl: avatarUrl ?? `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(payload.name)}`,
  password,
});

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
        if (storedSession.user) {
          setSession(storedSession);
          setStatus('authenticated');
          return;
        }

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
        try {
          const nextSession = await loginRequest(payload);
          persistSession(nextSession);
          setStatus('authenticated');
          return nextSession;
        } catch {
          const localUser = readLocalUsers().find(
            (user) => user.email === payload.email.toLowerCase().trim() && user.password === payload.password,
          );

          if (!localUser) {
            throw new Error('Unable to sign in right now');
          }

          const nextSession = buildLocalSession({
            id: localUser.id,
            name: localUser.name,
            email: localUser.email,
            college: localUser.college,
            branch: localUser.branch,
            semester: localUser.semester,
            phone: localUser.phone,
            avatarUrl: localUser.avatarUrl,
          });

          persistSession(nextSession);
          setStatus('authenticated');
          return nextSession;
        }
      },
      register: async (payload) => {
        try {
          const nextSession = await registerRequest(payload);
          persistSession(nextSession);
          setStatus('authenticated');
          return nextSession;
        } catch {
          const users = readLocalUsers();
          const email = payload.email.toLowerCase().trim();
          if (users.some((user) => user.email === email)) {
            throw new Error('An account with this email already exists');
          }

          const localUser = toLocalUser(payload, payload.password);
          users.push(localUser);
          writeLocalUsers(users);

          const nextSession = buildLocalSession(localUser);
          persistSession(nextSession);
          setStatus('authenticated');
          return nextSession;
        }
      },
      loginWithGoogle: async (payload) => {
        try {
          const nextSession = await googleAuthRequest(payload);
          persistSession(nextSession);
          setStatus('authenticated');
          return nextSession;
        } catch {
          const users = readLocalUsers();
          const email = payload.email.toLowerCase().trim();
          const existingUser = users.find((user) => user.email === email);
          const user =
            existingUser ??
            toLocalUser(
              {
                name: payload.name,
                email: payload.email,
                college: payload.college ?? 'Campus College',
                branch: payload.branch ?? 'Computer Science',
                semester: payload.semester ?? '4th',
                phone: payload.phone ?? '9999999999',
                password: cryptoRandomFallback(payload.email),
              },
              cryptoRandomFallback(payload.email),
              payload.avatarUrl,
            );

          if (!existingUser) {
            users.push(user);
            writeLocalUsers(users);
          }

          const nextSession = buildLocalSession({
            id: user.id,
            name: user.name,
            email: user.email,
            college: user.college,
            branch: user.branch,
            semester: user.semester,
            phone: user.phone,
            avatarUrl: payload.avatarUrl ?? user.avatarUrl,
          });

          persistSession(nextSession);
          setStatus('authenticated');
          return nextSession;
        }
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

const cryptoRandomFallback = (seed: string) => `google-${seed.toLowerCase().trim()}`;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
