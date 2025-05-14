import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import { LoginForm } from './pages/LoginForm';
import { RegistrationForm } from './pages/RegistrationForm';
import { Home } from './pages/Home';
import { RequireAuth } from './components/RequireAuth';

import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <Routes>
      {/* публичные маршруты */}
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegistrationForm />} />
      {/* защищённый маршрут */}
      <Route
        path="/"
        element={
          <RequireAuth>
            <Home />
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  </Router>
);
