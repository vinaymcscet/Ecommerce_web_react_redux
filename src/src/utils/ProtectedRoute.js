import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
    const userState = useSelector((state) => state.user);
    const isLoggedIn = userState?.user != null;

  return isLoggedIn ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
