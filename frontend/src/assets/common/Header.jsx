import Logo from "../images/logo.png";
import { GiHamburgerMenu } from "react-icons/gi";

export const Header = () => {
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
      </nav>
    </>
  );
};
