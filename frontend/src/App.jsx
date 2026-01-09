import { Route, Routes } from "react-router";
import { Master } from "./assets/common/Master";
import { Login } from "./assets/pages/Login";
import { NonAuthPage } from "./assets/elements/NonAuthPage";
import { Home } from "./assets/pages/Home";
import { AuthPage } from "./assets/elements/AuthPage";
import { VerifyOTP } from "./assets/pages/VerifyOTP.JSX";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "./utils/AppProvider";
import { singleCall } from "./api/functions";
import { AUTOLOGIN } from "./api/endpoints";
import { UpdateProfile } from "./assets/pages/UpdateProfile";
import Loader from "./assets/elements/Loader";
import { AddClient } from "./assets/pages/AddClient";
import { ManageClients } from "./assets/pages/ManageClients";

function App() {
  const { isAuth, setIsAuth, setUserData } = useContext(AppContext);
  const token = localStorage.getItem("token");
  const deviceId = localStorage.getItem("deviceId");
  const [loading, setLoading] = useState(true);

  const onSuccess = (data) => {
    setUserData(data.data);
    setIsAuth(true);
    console.log("AUTOLOGIN", data);
    localStorage.setItem("token", data.token);
    localStorage.setItem("deviceId", data.deviceId);
    setLoading(false);
  };

  useEffect(() => {
    if (token && deviceId) {
      singleCall(AUTOLOGIN, { token, deviceId }, onSuccess, () => {
        localStorage.removeItem("token");
        localStorage.removeItem("deviceId");
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) return <Loader />;

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
            path="/update-profile"
            element={
              <AuthPage isAuth={isAuth} req={false}>
                <UpdateProfile />
              </AuthPage>
            }
          />

          <Route
            path="/add-client"
            element={
              <AuthPage isAuth={isAuth} req={false}>
                <AddClient />
              </AuthPage>
            }
          />

          <Route
            path="/manage-clients"
            element={
              <AuthPage isAuth={isAuth} req={false}>
                <ManageClients />
              </AuthPage>
            }
          />

          <Route
            path="/update-client/:clientId"
            element={
              <AuthPage isAuth={isAuth} req={false}>
                <AddClient />
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
