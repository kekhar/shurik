import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoginForm } from './pages/LoginForm';
import { RegistrationForm } from './pages/RegistrationForm';
import { Home } from './pages/Home';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <Routes>
      <Route path="/register" element={<RegistrationForm />} />
      <Route path="/" element={<Home />} />
      <Route path="*" element={<LoginForm />} />
    </Routes>
  </Router>
);
