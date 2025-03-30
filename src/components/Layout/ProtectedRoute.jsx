
import React from "react"
import { Outlet, Navigate } from "react-router-dom";
import auth from "../../services/authentication/authService";
export const ProtectedRoute = ({ children }) => {

  const user = auth.getCurrentUser()

  return user ? (
    <>
      {children}
      <Outlet />
    </>
  ) : (
    <Navigate
      to={'/'}
      state={{ from: location.pathname }}
    />
  );
}