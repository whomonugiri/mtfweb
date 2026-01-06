import { useContext } from "react";
import { AppContext } from "../../utils/AppProvider";
import {
  MdBookOnline,
  MdChatBubble,
  MdComputer,
  MdLibraryBooks,
  MdOutlineWork,
  MdQuestionMark,
  MdSupervisedUserCircle,
} from "react-icons/md";
import { SidebarButton } from "../elements/SidebarButton";
import { HOST } from "../../api/endpoints";

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
        <div className="offcanvas-body">
          <div className="d-flex align-items-center mb-2 border-bottom pb-2">
            <div className="border rounded p-1 text-white d-flex align-items-center justify-content-center">
              <img
                src={HOST + "/uploads/" + userData?.companyLogo}
                alt="Company Logo Preview"
                crossOrigin="anonymous"
                style={{ height: 60 }}
              />
            </div>
            <div className="ms-3">
              <h5 className="mb-0">{userData?.brandName}</h5>
              <small className="text-muted">{userData?.emailId}</small>
              <br></br>
              <small className="text-muted">{userData?.mobileNumber}</small>
            </div>
          </div>

          {isAuth && (
            <div>
              <SidebarButton
                title="My Profile"
                icon={<MdOutlineWork />}
                path="/"
              />

              <SidebarButton
                title="Manage Clients"
                icon={<MdSupervisedUserCircle />}
                path="/"
              />

              <SidebarButton
                title="Manage Projects"
                icon={<MdComputer />}
                path="/"
              />

              <SidebarButton
                title="Manage Invoices"
                icon={<MdLibraryBooks />}
                path="/"
              />
            </div>
          )}

          <SidebarButton title="About MTF" icon={<MdQuestionMark />} path="/" />
          <SidebarButton
            title="Contact Support"
            icon={<MdChatBubble />}
            path="/"
          />

          <div
            className="text-muted text-center my-2"
            style={{ fontSize: "10px" }}
          >
            Developed by Dev Ninja ♡ 2026
          </div>
        </div>
      </div>
    </>
  );
};
