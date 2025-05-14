const ACCESS_KEY = 'access_token';
const REFRESH_KEY = 'refresh_token';

// —————— Работа с токенами ——————
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

// —————— Регистрация — POST /api/v1/auth/register ——————
export async function register(data) {
  console.log('[authService] register payload:', data);
  const res = await fetch('/api/v1/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const body = await res.json();
  console.log('[authService] register response status:', res.status);
  console.log('[authService] register response body:', body);

  if (!res.ok) {
    throw new Error(body.detail || body.message || 'Ошибка регистрации');
  }
  if (body.access_token && body.refresh_token) {
    setTokens({ access: body.access_token, refresh: body.refresh_token });
  }
  return body;
}

// —————— Вход — POST /api/v1/auth/login ——————
export async function login(credentials) {
  const res = await fetch('/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  const body = await res.json();

  if (!res.ok) {
    throw new Error(body.detail || body.message || 'Ошибка входа');
  }
  setTokens({ access: body.access_token, refresh: body.refresh_token });
  return body;
}

// —————— Рефреш — POST /api/v1/auth/refresh ——————
export async function refreshToken() {
  const refresh = getRefreshToken();
  if (!refresh) throw new Error('Нет refresh-токена');

  const res = await fetch('/api/v1/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refresh }),
  });
  const body = await res.json();

  if (!res.ok) {
    clearTokens();
    throw new Error(
      body.detail || body.message || 'Не удалось обновить сессию'
    );
  }

  setTokens({ access: body.access_token, refresh: body.refresh_token });
  return body.access_token;
}

// —————— Выход — DELETE /api/v1/auth/logout ——————
export async function logout() {
  try {
    const token = getAccessToken();
    await fetch('/api/v1/auth/logout', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (e) {
    console.warn('Ошибка при logout:', e);
  } finally {
    clearTokens();
  }
}
