import { useContext } from "react";
import { AppContext } from "../../utils/AppProvider";

export const Sidebar = () => {
  const { userData, isAuth } = useContext(AppContext);
  return (
    <>
      <div
        className="offcanvas offcanvas-start"
        data-bs-backdrop="static"
        tabIndex="-1"
        id="sidebar"
        aria-labelledby="staticBackdropLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="staticBackdropLabel"></h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body"></div>
      </div>
    </>
  );
};
