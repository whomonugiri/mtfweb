import { Route, Routes } from "react-router";
import { Master } from "./assets/common/Master";
import { Login } from "./assets/pages/Login";
import { NonAuthPage } from "./assets/elements/NonAuthPage";
import { Home } from "./assets/pages/Home";
import { AuthPage } from "./assets/elements/AuthPage";
import { VerifyOTP } from "./assets/pages/VerifyOTP.JSX";

function App() {
  const isAuth = false;
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
