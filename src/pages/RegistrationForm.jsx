import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/authService';

function validateEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}
function validatePhone(phone) {
  return /^\d{10,15}$/.test(phone);
}
function validatePassword(pw) {
  return pw.length >= 6;
}

export function RegistrationForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [patronymic, setPatronymic] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const v = {};
    if (!firstName.trim()) v.firstName = 'Введите имя';
    if (!lastName.trim()) v.lastName = 'Введите фамилию';
    if (!validatePhone(phone)) v.phone = 'Неверный номер';
    if (!validateEmail(email)) v.email = 'Неверный email';
    if (!validatePassword(password)) v.password = 'Пароль минимум 6 символов';

    if (Object.keys(v).length) {
      setErrors(v);
      return;
    }

    try {
      await register({
        firstName,
        lastName,
        patronymic,
        phone,
        email,
        password,
      });
      navigate('/login');
    } catch (err) {
      setErrors({ server: err.message });
    }
  };

  return (
    <div className="form-wrapper">
      <h2>Регистрация</h2>
      {errors.server && <div className="error">{errors.server}</div>}
      <form onSubmit={handleRegister}>
        <div className="field-container">
          <label>Имя</label>
          <input
            className="input"
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
              setErrors({ ...errors, firstName: '' });
            }}
          />
          {errors.firstName && <div className="error">{errors.firstName}</div>}
        </div>

        <div className="field-container">
          <label>Фамилия</label>
          <input
            className="input"
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value);
              setErrors({ ...errors, lastName: '' });
            }}
          />
          {errors.lastName && <div className="error">{errors.lastName}</div>}
        </div>

        <div className="field-container">
          <label>Отчество (необязательно)</label>
          <input
            className="input"
            value={patronymic}
            onChange={(e) => setPatronymic(e.target.value)}
          />
        </div>

        <div className="field-container">
          <label>Номер телефона</label>
          <input
            className="input"
            type="tel"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              setErrors({ ...errors, phone: '' });
            }}
          />
          {errors.phone && <div className="error">{errors.phone}</div>}
        </div>

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
          Зарегистрироваться
        </button>
      </form>
      <p className="link-text">
        Уже есть аккаунт? <Link to="/login">Войдите!</Link>
      </p>
    </div>
  );
}
