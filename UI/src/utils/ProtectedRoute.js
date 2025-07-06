import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from './Auth';
import { hasAccess } from './roleAccess';

export const RoleProtectedRoute = ({ category, feature, children }) => {
  const location = useLocation();
  return isAuthenticated() && hasAccess(category, feature) ? (
    children
  ) : (
    <Navigate to="/not-authorized" state={{ from: location }} replace />
  );
};
