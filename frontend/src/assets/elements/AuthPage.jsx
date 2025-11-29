import { Navigate } from "react-router";

export const AuthPage = ({ isAuth, children }) => {
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }
  return <>auth page {children}</>;
};
