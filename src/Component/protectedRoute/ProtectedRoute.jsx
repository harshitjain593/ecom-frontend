// src/Component/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
  const otpVerified = useSelector(state => state.forgotPasswordData?.otpVerified); // Adjust according to your state structure

  return otpVerified ? children : <Navigate to="/forgot" />;
};

export default ProtectedRoute;
