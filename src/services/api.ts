import type {
  AuthCredentials,
  AuthSession,
  Book,
  GoogleAuthPayload,
  RegistrationPayload,
  User,
} from '../types';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000';

type ApiOptions = RequestInit & {
  fallbackMessage?: string;
  token?: string;
};

const requestJson = async <T>(path: string, options: ApiOptions = {}): Promise<T> => {
  const { token, ...requestOptions } = options;
  const response = await fetch(`${apiBaseUrl}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
    ...requestOptions,
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    const message = payload?.message ?? options.fallbackMessage ?? 'Request failed';
    throw new Error(message);
  }

  return response.json() as Promise<T>;
};

export const requestApiJson = requestJson;

export const fetchBooks = async (): Promise<Book[]> => {
  try {
    return await requestJson<Book[]>('/api/books');
  } catch {
    return [];
  }
};

export const createBook = async (book: Book): Promise<Book> => {
  return requestJson<Book>('/api/books', {
    method: 'POST',
    body: JSON.stringify(book),
    fallbackMessage: 'Failed to create book',
  });
};

export const loginRequest = async (payload: AuthCredentials): Promise<AuthSession> => {
  return requestJson<AuthSession>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
    fallbackMessage: 'Unable to sign in right now',
  });
};

export const registerRequest = async (payload: RegistrationPayload): Promise<AuthSession> => {
  return requestJson<AuthSession>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
    fallbackMessage: 'Unable to create account right now',
  });
};

export const googleAuthRequest = async (payload: GoogleAuthPayload): Promise<AuthSession> => {
  return requestJson<AuthSession>('/api/auth/google', {
    method: 'POST',
    body: JSON.stringify(payload),
    fallbackMessage: 'Google sign-in is unavailable right now',
  });
};

export const fetchCurrentUser = async (token: string): Promise<User> => {
  const response = await fetch(`${apiBaseUrl}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Session expired');
  }

  const payload = (await response.json()) as { user: User };
  return payload.user;
};

export const logoutRequest = async (token?: string): Promise<void> => {
  await fetch(`${apiBaseUrl}/api/auth/logout`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  }).catch(() => undefined);
};
