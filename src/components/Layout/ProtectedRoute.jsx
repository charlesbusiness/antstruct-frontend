import React from "react";
import { Outlet } from "react-router-dom";

export const ProtectedRoute = ({ children }) => {
  return (
    <>
      {children}
      <Outlet />
    </>
  );
};

export default ProtectedRoute;