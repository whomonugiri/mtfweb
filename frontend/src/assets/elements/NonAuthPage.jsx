import { Navigate } from "react-router";

export const NonAuthPage = ({ isAuth, children }) => {
  if (isAuth) {
    return <Navigate to="/" replace />;
  }
  return children;
};
