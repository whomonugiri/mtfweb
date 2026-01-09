import { useContext, useState, useEffect } from "react";
import { AppContext } from "../../utils/AppProvider";
import { PrimaryButton } from "../elements/PrimaryButton";
import {
  ADD_CLIENT,
  GET_CLIENT,
  HOST,
  UPDATE_CLIENT,
} from "../../api/endpoints";
import { Link, useNavigate, useParams, useSearchParams } from "react-router";
import { singleCall } from "../../api/functions";

export const AddClient = () => {
  const { userData } = useContext(AppContext);
  const [busy, setBusy] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const clientId = useParams("clientid").clientId;

  const [isUpdateMode, setIsUpdateMode] = useState(false);

  const [form, setForm] = useState({
    clientName: "",
    mobileNumber: "",
    email: "",
    gstNumber: "",
    address: "",
  });

  const [errors, setErrors] = useState({});

  // Fetch client data if clientId is provided
  useEffect(() => {
    if (clientId) {
      setIsLoading(true);
      // Fetch client data - assuming endpoint /api/client/v1/getClient
      singleCall(
        GET_CLIENT,
        { clientId },
        (data) => {
          if (data.data) {
            setForm({
              clientName: data.data.clientName || "",
              mobileNumber: data.data.mobileNumber || "",
              email: data.data.email || "",
              gstNumber: data.data.gstNumber || "",
              address: data.data.address || "",
            });
            setIsUpdateMode(true);
          }
          setIsLoading(false);
        },
        () => {
          setIsLoading(false);
          // Invalid client ID, act as add mode
          setIsUpdateMode(false);
        }
      );
    }
  }, [clientId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    let newErrors = {};

    if (!form.clientName.trim()) {
      newErrors.clientName = "Client name is required";
    }

    if (!form.mobileNumber.trim()) {
      newErrors.mobileNumber = "Mobile number is required";
    } else if (!/^\d{10}$/.test(form.mobileNumber.replace(/\D/g, ""))) {
      newErrors.mobileNumber = "Enter a valid 10-digit mobile number";
    }

    if (form.email.trim() && !/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = "Enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSuccess = (data) => {
    navigate("/manage-clients", { replace: true });
    setBusy(false);
  };

  const onFail = () => {
    setBusy(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;
    setBusy(true);

    const dataToSend = { ...form };
    if (isUpdateMode && clientId) {
      dataToSend.clientId = clientId;
    }

    const endpoint = isUpdateMode ? UPDATE_CLIENT : ADD_CLIENT;

    singleCall(endpoint, dataToSend, isUpdateMode ? onFail : onSuccess, onFail);
  };

  return (
    <div className="container mt-3">
      <div className="card shadow-sm">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0 text-center fw-bold">
            {isUpdateMode ? "Update Client" : "Add New Client"}
          </h5>
          <Link to="/manage-clients" className="btn btn-sm btn-outline-success">
            Mange Clients
          </Link>
        </div>

        <div className="card-body">
          {isLoading ? (
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Client Name */}
              <div className="mb-3">
                <label className="form-label">
                  Client Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${
                    errors.clientName ? "is-invalid" : ""
                  }`}
                  name="clientName"
                  value={form.clientName}
                  onChange={handleChange}
                  placeholder="Enter client name"
                />
                <div className="invalid-feedback">{errors.clientName}</div>
              </div>

              {/* Mobile Number */}
              <div className="mb-3">
                <label className="form-label">
                  Mobile Number <span className="text-danger">*</span>
                </label>
                <input
                  type="tel"
                  className={`form-control ${
                    errors.mobileNumber ? "is-invalid" : ""
                  }`}
                  name="mobileNumber"
                  value={form.mobileNumber}
                  onChange={handleChange}
                  placeholder="Enter 10-digit mobile number"
                />
                <div className="invalid-feedback">{errors.mobileNumber}</div>
              </div>

              {/* Email (Optional) */}
              <div className="mb-3">
                <label className="form-label">Email (Optional)</label>
                <input
                  type="email"
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                />
                <div className="invalid-feedback">{errors.email}</div>
              </div>

              {/* GST Number (Optional) */}
              <div className="mb-3">
                <label className="form-label">GST Number (Optional)</label>
                <input
                  type="text"
                  className="form-control"
                  name="gstNumber"
                  value={form.gstNumber}
                  onChange={handleChange}
                  placeholder="Enter GST number"
                />
              </div>

              {/* Address (Optional) */}
              <div className="mb-3">
                <label className="form-label">Address (Optional)</label>
                <textarea
                  className="form-control"
                  rows="3"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Enter address"
                ></textarea>
              </div>

              <PrimaryButton
                action={() => {}}
                label={isUpdateMode ? "UPDATE CLIENT" : "ADD CLIENT"}
                busy={busy}
              />
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
