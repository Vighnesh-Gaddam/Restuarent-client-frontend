import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("accessToken"); // or use your context/auth state

  if (!isAuthenticated) {
    return <Navigate to="/" />; // Redirect to Login if not authenticated
  }

  return children; // Return the protected component if authenticated
};

export default ProtectedRoute;
