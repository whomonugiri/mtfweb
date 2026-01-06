import { Link, useNavigate } from "react-router";
import { IoIosArrowForward } from "react-icons/io";

export const SidebarButton = ({ title, icon, path }) => {
  const navigate = useNavigate();
  const go = () => {
    navigate(path);
  };
  return (
    <>
      <Link
        onClick={go}
        className="btn w-100 d-flex justify-content-between"
        data-bs-dismiss="offcanvas"
      >
        <div className="fs-6">
          {icon} {title}
        </div>
        <div>
          <IoIosArrowForward className="fs-4" />
        </div>
      </Link>
    </>
  );
};
