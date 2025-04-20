import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AuthWrapper = () => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default AuthWrapper;