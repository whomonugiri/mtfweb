import { useContext } from "react";
import Logo from "../images/logo.png";
import { GiHamburgerMenu } from "react-icons/gi";
import { AppContext } from "../../utils/AppProvider";

export const Header = () => {
  const { isAuth, setIsAuth, setUserData } = useContext(AppContext);
  const logout = () => {
    setIsAuth(false);
    setUserData({});
    localStorage.removeItem("token");
    localStorage.removeItem("deviceId");
  };

  return (
    <>
      <nav className="navbar bg-body-tertiary shadow-sm border-bottom">
        <div className="container">
          <a
            className="navbar-brand fw-bold d-flex align-items-center"
            href="#"
            style={{ fontFamily: "calibri" }}
          >
            <img
              src={Logo}
              alt="Logo"
              width="30"
              height="24"
              className="d-inline-block align-text-top"
            />
            MTFWEB
          </a>

          <div className="d-flex gap-2 align-items-center">
            {isAuth && (
              <div>
                <button
                  onClick={logout}
                  className="btn btn-sm btn-danger p-0 px-3 fw-bold small"
                >
                  Logout
                </button>
              </div>
            )}

            <div>
              <button
                className="btn fs-3 p-0 m-0"
                type="button"
                data-bs-toggle="offcanvas"
                data-bs-target="#sidebar"
                aria-controls="staticBackdrop"
              >
                <GiHamburgerMenu />
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};
