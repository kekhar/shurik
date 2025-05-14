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

// —————— Создать пользователя — POST /api/v1/users/ ——————
export async function createUser(data) {
  const res = await fetch('/api/v1/users/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const body = await res.json();

  if (!res.ok) {
    // Обработка ошибок валидации
    if (
      body.error_code === 'ValidationException' &&
      body.additional_info?.errors
    ) {
      const fieldErrors = {};
      body.additional_info.errors.forEach((err) => {
        let key;
        switch (err.field) {
          case 'name':
            key = 'firstName';
            break;
          case 'surname':
            key = 'lastName';
            break;
          case 'phone_number':
            key = 'phone';
            break;
          case 'email':
            key = 'email';
            break;
          case 'password':
            key = 'password';
            break;
          default:
            key = err.field;
        }
        fieldErrors[key] = err.message;
      });
      throw { validation: fieldErrors };
    }
    throw new Error(
      body.detail || body.message || 'Ошибка создания пользователя'
    );
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
