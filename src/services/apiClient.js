import { getAccessToken, refreshToken, clearTokens } from './authService';
export async function fetchWithAuth(path, init = {}) {
  const url = path;

  // подставляем токен, если есть
  const token = getAccessToken();
  init.headers = {
    'Content-Type': 'application/json',
    ...(init.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  // первый запрос
  let res = await fetch(url, init);

  // если пришёл 401 — пробуем рефрешить
  if (res.status === 401) {
    try {
      const newAccess = await refreshToken();
      init.headers.Authorization = `Bearer ${newAccess}`;
      res = await fetch(url, init);
    } catch {
      // рефреш не прошёл — чистим токены и кидаем на логин
      clearTokens();
      window.location.href = '/login';
      throw new Error('Сессия истекла, перенаправляю на вход');
    }
  }

  return res;
}
