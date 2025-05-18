
import { Navigate } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";
import type { JSX } from "react";
export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuthContext();
  return isAuthenticated ? children : <Navigate to="/login" />;
};