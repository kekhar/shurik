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

### 1. Переменная окружения

#### Proxy через Vite

- В vite.config.js настроен прокси для всех запросов /api/\*, перенаправляющий их на https://api.tutor.donater.dev.
- Благодаря этому во фронтенде всегда можно использовать относительные пути /api/v1/..., и Vite автоматически скрывает детали CORS и базового URL.

### 2. Где храняться клиентские запросы?

#### - в src/services/authService.js

- createUser(data)
  Отправляет POST /api/v1/users/ с телом { name, surname, patronymic, phone, email, password }.
  При ошибке выбрасывает Error с сообщением из ответа.

- login(credentials)
  Отправляет POST /api/v1/auth/login с { email, password }.
  Ожидает ответ { access_token, refresh_token }, сохраняет их в localStorage и возвращает данные.

- refreshToken()
  Читает refresh_token из localStorage,
  отправляет POST /api/v1/auth/refresh с { refresh_token }.
  Если OK — обновляет access_token и refresh_token в localStorage и возвращает новый access_token.
  Если не OK — очищает оба токена и выбрасывает Error.

- logout()
  Отправляет DELETE /api/v1/auth/logout с заголовком Authorization: Bearer <access_token>,
  затем очищает токены из localStorage.

#### - src/services/apiClient.js

- fetchWithAuth(path, init)
  Добавляет заголовок Authorization: Bearer <access_token> (если есть).
  При получении 401 Unauthorized автоматически вызывает refreshToken() и повторяет запрос с новым access_token.
  Если рефреш не удался — очищает токены и перенаправляет пользователя на /login.
