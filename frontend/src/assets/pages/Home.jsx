import { useContext } from "react";
import { AppContext } from "../../utils/AppProvider";
import { Link } from "react-router";
import { MdBusinessCenter } from "react-icons/md";

export const Home = () => {
  const { userData } = useContext(AppContext);
  return (
    <>
      <div className="container mt-4">
        <div className="card shadow-sm border-1">
          <div className="card-body">
            {/* Header */}
            <div className="d-flex align-items-center mb-4">
              <div
                className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center"
                style={{ width: 60, height: 60, fontSize: 22 }}
              >
                <MdBusinessCenter />
              </div>
              <div className="ms-3">
                <h5 className="mb-0">{userData?.fullName}</h5>
                <small className="text-muted">{userData?.brandName}</small>
              </div>
            </div>

            {/* Info Rows */}
            <div className="row g-3">
              <div className="col-md-6">
                <div className="d-flex align-items-start">
                  <i className="bi bi-telephone-fill text-primary fs-5 me-3"></i>
                  <div>
                    <small className="text-muted">Mobile Number</small>
                    <div className="fw-semibold">{userData?.mobileNumber}</div>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="d-flex align-items-start">
                  <i className="bi bi-envelope-fill text-primary fs-5 me-3"></i>
                  <div>
                    <small className="text-muted">Email</small>
                    <div className="fw-semibold">{userData?.emailId}</div>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="d-flex align-items-start">
                  <i className="bi bi-receipt text-primary fs-5 me-3"></i>
                  <div>
                    <small className="text-muted">GST Number</small>
                    <div className="fw-semibold">
                      {userData?.GSTNO || "Not Provided"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="d-flex align-items-start">
                  <i className="bi bi-award-fill text-primary fs-5 me-3"></i>
                  <div>
                    <small className="text-muted">MSME Number</small>
                    <div className="fw-semibold">
                      {userData?.MSME || "Not Provided"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12">
                <div className="d-flex align-items-start">
                  <i className="bi bi-geo-alt-fill text-primary fs-5 me-3"></i>
                  <div>
                    <small className="text-muted">Address</small>
                    <div className="fw-semibold">{userData?.address}</div>
                  </div>
                </div>
              </div>

              <div>
                <Link
                  to="/update-profile"
                  className="btn btn-sm btn-success w-100"
                >
                  UPDATE PROFILE
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
