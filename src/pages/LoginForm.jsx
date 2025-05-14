import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/authService';

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
    const v = {};
    if (!validateEmail(email)) v.email = 'Неверный email';
    if (!password) v.password = 'Введите пароль';
    if (Object.keys(v).length) {
      setErrors(v);
      return;
    }

    try {
      await login({ email, password });
      navigate('/');
    } catch (err) {
      setErrors({ server: err.message });
    }
  };

  return (
    <div className="form-wrapper">
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
