import { getAccessToken, refreshToken, clearTokens } from './authService';

const API_URL = import.meta.env.VITE_API_URL;

// Обёртка над fetch, автоматически пробует рефрешить токен
export async function fetchWithAuth(path, init = {}) {
  const url = path.startsWith('http') ? path : `${API_URL}${path}`;

  const token = getAccessToken();
  init.headers = {
    ...(init.headers || {}),
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  let res = await fetch(url, init);
  if (res.status === 401) {
    try {
      const newAccess = await refreshToken();
      init.headers.Authorization = `Bearer ${newAccess}`;
      res = await fetch(url, init);
    } catch {
      clearTokens();
      window.location.href = '/login';
      throw new Error('Сессия истекла, перенаправляю на вход');
    }
  }
  return res;
}
