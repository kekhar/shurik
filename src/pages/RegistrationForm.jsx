import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUser } from '../services/authService';
import { Eye, EyeOff } from 'lucide-react';

function validateEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}

function validatePhone(value) {
  const digits = value.replace(/\D/g, '');
  return digits.length === 10 || digits.length === 11;
}

function normalizePhone(value) {
  const digits = value.replace(/\D/g, '');
  return digits.length === 10 ? '+7' + digits : '+' + digits;
}

function formatPhone(value) {
  let d = value.replace(/\D/g, '');
  if (d.startsWith('8')) d = '7' + d.slice(1);
  if (!d.startsWith('7')) d = '7' + d;
  let r = '+7';
  if (d.length > 1) r += ' (' + d.slice(1, 4);
  if (d.length >= 4) r += ') ' + d.slice(4, 7);
  if (d.length >= 7) r += '-' + d.slice(7, 9);
  if (d.length >= 9) r += '-' + d.slice(9, 11);
  return r;
}

function validatePassword(pw) {
  return pw.length >= 8;
}

export function RegistrationForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [patronymic, setPatronymic] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const toggleShow = () => setShowPassword((v) => !v);
  const onPhoneChange = (e) => {
    setPhone(formatPhone(e.target.value));
    setErrors({ ...errors, phone: '' });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const v = {};

    if (!firstName.trim()) v.firstName = 'Введите имя';
    if (!lastName.trim()) v.lastName = 'Введите фамилию';
    if (!validatePhone(phone)) v.phone = 'Неверный формат номера';
    if (!validateEmail(email)) v.email = 'Неверный email';
    if (!validatePassword(password)) v.password = 'Пароль минимум 8 символов';
    if (password !== confirmPassword) v.confirmPassword = 'Пароли не совпадают';

    if (Object.keys(v).length) {
      setErrors(v);
      return;
    }

    const payload = {
      name: firstName,
      surname: lastName,
      patronymic,
      phone_number: normalizePhone(phone),
      email,
      password,
    };

    try {
      await createUser(payload);
      navigate('/login');
    } catch (err) {
      if (err.validation) {
        setErrors(err.validation);
      } else {
        setErrors({ server: err.message || 'Серверная ошибка' });
      }
    }
  };

  return (
    <div className="form-wrapper">
      <h2>Регистрация</h2>
      {errors.server && <div className="error">{errors.server}</div>}

      <form onSubmit={handleRegister}>
        {/* Имя */}
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

        {/* Фамилия */}
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

        {/* Отчество */}
        <div className="field-container">
          <label>Отчество (необязательно)</label>
          <input
            className="input"
            value={patronymic}
            onChange={(e) => setPatronymic(e.target.value)}
          />
        </div>

        {/* Телефон */}
        <div className="field-container">
          <label>Номер телефона</label>
          <input
            className="input"
            type="tel"
            placeholder="+7 (999) 999-99-99"
            value={phone}
            onChange={onPhoneChange}
          />
          {errors.phone && <div className="error">{errors.phone}</div>}
        </div>

        {/* Email */}
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

        {/* Пароль */}
        <div className="field-container">
          <label>Пароль</label>
          <div style={{ position: 'relative' }}>
            <input
              className="input"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors({ ...errors, password: '' });
              }}
            />
            <div
              onClick={toggleShow}
              style={{
                position: 'absolute',
                top: '50%',
                right: '8px',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                color: '#888',
              }}
              title={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
          </div>
          {errors.password && <div className="error">{errors.password}</div>}
        </div>

        {/* Подтвердите пароль */}
        <div className="field-container">
          <label>Подтвердите пароль</label>
          <div style={{ position: 'relative' }}>
            <input
              className="input"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => {
                setConfirm(e.target.value);
                setErrors({ ...errors, confirmPassword: '' });
              }}
            />
            <div
              onClick={toggleShow}
              style={{
                position: 'absolute',
                top: '50%',
                right: '8px',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                color: '#888',
              }}
              title={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
          </div>
          {errors.confirmPassword && (
            <div className="error">{errors.confirmPassword}</div>
          )}
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
