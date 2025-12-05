import { Route, Routes } from "react-router";
import { Master } from "./assets/common/Master";
import { Login } from "./assets/pages/Login";
import { NonAuthPage } from "./assets/elements/NonAuthPage";
import { Home } from "./assets/pages/Home";
import { AuthPage } from "./assets/elements/AuthPage";
import { VerifyOTP } from "./assets/pages/VerifyOTP.JSX";
import { useContext, useEffect } from "react";
import { AppContext } from "./utils/AppProvider";
import { singleCall } from "./api/functions";
import { AUTOLOGIN } from "./api/endpoints";

function App() {
  const { isAuth, setIsAuth, setUserData } = useContext(AppContext);
  const token = localStorage.getItem("token");
  const deviceId = localStorage.getItem("deviceId");

  const onSuccess = (data) => {
    setUserData(data.data);
    setIsAuth(true);
    console.log("AUTOLOGIN", data);
    localStorage.setItem("token", data.token);
    localStorage.setItem("deviceId", data.deviceId);
  };

  useEffect(() => {
    if (token && deviceId) {
      singleCall(AUTOLOGIN, { token, deviceId }, onSuccess, () => {
        localStorage.removeItem("token");
        localStorage.removeItem("deviceId");
      });
    }
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<Master />}>
          <Route
            index
            path="/"
            element={
              <AuthPage isAuth={isAuth}>
                <Home />
              </AuthPage>
            }
          />
          <Route
            path="/login"
            element={
              <NonAuthPage isAuth={isAuth}>
                <Login />
              </NonAuthPage>
            }
          />

          <Route
            path="/verify-otp"
            element={
              <NonAuthPage isAuth={isAuth}>
                <VerifyOTP />
              </NonAuthPage>
            }
          />
        </Route>
      </Routes>
    </>
  );
}
export default App;
