import { useContext } from "react";
import { Navigate } from "react-router";
import { AppContext } from "../../utils/AppProvider";

export const AuthPage = ({ isAuth, children, req = true }) => {
  const { userData } = useContext(AppContext);
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  if (
    (userData.fullName == "" ||
      userData.brandName == "" ||
      userData.emailId == "" ||
      userData.address == "") &&
    req
  )
    return <Navigate to="/update-profile" replace />;
  return <>{children}</>;
};
