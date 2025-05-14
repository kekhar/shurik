// src/pages/Home.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/authService';

export function Home() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.warn('Logout failed:', e);
    } finally {
      navigate('/login');
    }
  };

  return (
    <div className="home-wrapper">
      <div className="home-container">
        <div>
          <h1>Добро пожаловать! Шурик Павлович!</h1>
          <p>Самый лучший программист</p>
		<p>Тут внизу кнопка чтоб проверить, если выходит!</p>
        </div>
        <button className="btn" onClick={handleLogout}>
          Выйти
        </button>
      </div>
    </div>
  );
}
