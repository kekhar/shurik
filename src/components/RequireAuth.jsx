import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getAccessToken } from '../services/authService';

export function RequireAuth({ children }) {
  const token = getAccessToken();
  const location = useLocation();
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}
