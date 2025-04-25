import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function validateEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const validationErrors = {};
    if (!validateEmail(email)) validationErrors.email = 'Неверный email';
    if (!password) validationErrors.password = 'Введите пароль';
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) navigate('/');
      else {
        const data = await response.json();
        setErrors({ server: data.message || 'Ошибка входа' });
      }
    } catch {
      setErrors({ server: 'Сервер недоступен' });
    }
  };

  return (
    <div className="form-wrapper" style={{ maxWidth: '320px' }}>
      <h2>Авторизация</h2>
      {errors.server && <div className="error">{errors.server}</div>}
      <form onSubmit={handleLogin}>
        <div className="field-container">
          <label>Email</label>
          <input
            className="input"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors({ ...errors, email: '' });
            }}
          />
          {errors.email && <div className="error">{errors.email}</div>}
        </div>
        <div className="field-container">
          <label>Пароль</label>
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors({ ...errors, password: '' });
            }}
          />
          {errors.password && <div className="error">{errors.password}</div>}
        </div>
        <button type="submit" className="btn">
          Войти
        </button>
      </form>
      <p className="link-text">
        Ещё не зарегистрированы? <Link to="/register">Зарегистрируйтесь!</Link>
      </p>
    </div>
  );
}
