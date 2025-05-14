## 1. Как установить?

### 1.1 Что нужно установить

[**Node.js**](https://nodejs.org/en)

### 1.2 Установка зависимостей

1. Клонируйте репозиторий:

   ```bash
   git clone https://github.com/kekhar/shurik.git
   ```

2. Установите пакеты:
   ```bash
   npm install
   ```

## 2. Как запустить?

1. Запуск в режиме разработки
   ```bash
   npm run dev
   ```

## 3. Как это работает?

# 1.1 Переменная окружения

- import.meta.env.VITE_API_URL
  используется в src/services/authService.js и src/services/apiClient.js как базовый URL для всех запросов к API.

# 1.2. Где храняться клиентские запросы?

# - в src/services/authService.js

- register(data)
  Отправляет POST ${VITE_API_URL}/api/v1/users/ с телом { firstName, lastName, patronymic, phone, email, password }.
  При ошибке выбрасывает Error с сообщением из ответа.

- login(credentials)
  Отправляет POST ${VITE_API_URL}/api/v1/auth/login с { email, password }.
  Ожидает ответ { access_token, refresh_token }, сохраняет их в localStorage и возвращает данные.

- refreshToken()
  Читает refresh_token из localStorage,
  отправляет POST ${VITE_API_URL}/api/v1/auth/refresh с { refresh_token }.
  Если OK — обновляет access_token и refresh_token в localStorage и возвращает новый access_token.
  Если не OK — очищает оба токена и выбрасывает Error.

- logout()
  Отправляет DELETE ${VITE_API_URL}/api/v1/auth/logout с заголовком Authorization: Bearer <access_token>,
  затем очищает токены из localStorage.

# - src/services/apiClient.js

- fetchWithAuth(path, init)
  Формирует URL: если path начинается с http — использует его напрямую, иначе префиксует VITE_API_URL.
  Добавляет заголовок Authorization: Bearer <access_token> (если есть).
  При получении 401 Unauthorized автоматически вызывает refreshToken() и повторяет запрос с новым access_token.
  Если рефреш не удался — очищает токены и перенаправляет пользователя на /login.
