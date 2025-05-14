const API_URL = import.meta.env.VITE_API_URL; // Берет из .env, могу убрать
const ACCESS_KEY = 'access_token';
const REFRESH_KEY = 'refresh_token';

export function getAccessToken() {
  return localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_KEY);
}

export function setTokens({ access, refresh }) {
  localStorage.setItem(ACCESS_KEY, access);
  localStorage.setItem(REFRESH_KEY, refresh);
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

// Регистрация нового пользователя
export async function register(data) {
  const res = await fetch(`${API_URL}/api/v1/users/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || err.message || 'Ошибка регистрации');
  }
  return res.json();
}

// Вход — сохраняем access + refresh
export async function login(credentials) {
  const res = await fetch(`${API_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || err.message || 'Ошибка входа');
  }
  const data = await res.json();
  setTokens({ access: data.access, refresh: data.refresh });
  return data;
}

// Обновление access-токена по refresh
export async function refreshToken() {
  const refresh = getRefreshToken();
  if (!refresh) throw new Error('Нет refresh-токена');
  const res = await fetch(`${API_URL}/api/v1/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh }),
  });
  if (!res.ok) {
    clearTokens();
    throw new Error('Не удалось обновить сессию');
  }
  const data = await res.json();
  setTokens({ access: data.access, refresh: data.refresh });
  return data.access;
}

// Выход (опционально)
export async function logout() {
  const token = getAccessToken();
  await fetch(`${API_URL}/api/v1/auth/logout`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  clearTokens();
}
