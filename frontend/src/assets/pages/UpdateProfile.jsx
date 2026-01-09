import { useContext, useState, useEffect } from "react";
import { AppContext } from "../../utils/AppProvider";
import { PrimaryButton } from "../elements/PrimaryButton";
import { HOST, UPDATE_PROFILE } from "../../api/endpoints";
import { Link, useNavigate } from "react-router";
import { singleCall } from "../../api/functions";

export const UpdateProfile = () => {
  const { userData, setUserData } = useContext(AppContext);
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    emailId: "",
    brandName: "",
    address: "",
    GSTNO: "",
    MSME: "",
    companyLogo: null,
    signatureImage: null,
  });

  const [previewLogo, setPreviewLogo] = useState(null);
  const [previewSignature, setPreviewSignature] = useState(null);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (userData) {
      setForm({
        fullName: userData.fullName || "",
        emailId: userData.emailId || "",
        brandName: userData.brandName || "",
        address: userData.address || "",
        GSTNO: userData.GSTNO || "",
        MSME: userData.MSME || "",
        companyLogo: userData.companyLogo || null,
        signatureImage: userData.signatureImage || null,
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setForm({ ...form, [name]: files[0] });
    setErrors({ ...errors, [name]: "" });
    if (files[0]) {
      if (name === "companyLogo") {
        setPreviewLogo(URL.createObjectURL(files[0]));
      } else if (name === "signatureImage") {
        setPreviewSignature(URL.createObjectURL(files[0]));
      }
    } else {
      if (name === "companyLogo") {
        setPreviewLogo(null);
      } else if (name === "signatureImage") {
        setPreviewSignature(null);
      }
    }
  };

  const validate = () => {
    let newErrors = {};

    if (!form.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!form.emailId.trim()) {
      newErrors.emailId = "Email ID is required";
    } else if (!/^\S+@\S+\.\S+$/.test(form.emailId)) {
      newErrors.emailId = "Enter a valid email address";
    }

    if (!form.brandName.trim()) {
      newErrors.brandName = "Brand name is required";
    }

    if (!form.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!form.companyLogo) {
      newErrors.companyLogo = "Company logo is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSuccess = (data) => {
    setUserData(data.data);
    navigate("/", { replace: true });
    setBusy(false);
  };

  const onFail = () => {
    setBusy(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;
    setBusy(true);

    const hasFiles = form.companyLogo || form.signatureImage;
    let dataToSend;

    if (hasFiles) {
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        if (form[key] !== null && form[key] !== "") {
          formData.append(key, form[key]);
        }
      });
      dataToSend = formData;
    } else {
      dataToSend = { ...form };
    }

    singleCall(UPDATE_PROFILE, dataToSend, onSuccess, onFail);
  };

  return (
    <div className="container mt-3">
      <div className="card shadow-sm">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0 text-center fw-bold">Update Your Profile</h5>
          <Link to="/" className="btn btn-sm btn-outline-success">
            Home
          </Link>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {/* Company Logo */}
            <div className="mb-3">
              {(previewLogo ||
                (typeof form.companyLogo === "string" && form.companyLogo)) && (
                <div className="mb-2">
                  <img
                    src={previewLogo || HOST + "/uploads/" + form.companyLogo}
                    alt="Company Logo Preview"
                    style={{ maxWidth: "200px", maxHeight: "200px" }}
                    crossOrigin="anonymous"
                  />
                </div>
              )}
              <label className="form-label">Company Logo *</label>
              <input
                type="file"
                className={`form-c  ontrol ${
                  errors.companyLogo ? "is-invalid" : ""
                }`}
                name="companyLogo"
                accept="image/*"
                onChange={handleFileChange}
              />
              <div className="invalid-feedback">{errors.companyLogo}</div>
            </div>

            {/* Full Name */}
            <div className="mb-3">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                className={`form-control ${
                  errors.fullName ? "is-invalid" : ""
                }`}
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
              />
              <div className="invalid-feedback">{errors.fullName}</div>
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="form-label">Email ID *</label>
              <input
                type="email"
                className={`form-control ${errors.emailId ? "is-invalid" : ""}`}
                name="emailId"
                value={form.emailId}
                onChange={handleChange}
              />
              <div className="invalid-feedback">{errors.emailId}</div>
            </div>

            {/* Brand Name */}
            <div className="mb-3">
              <label className="form-label">Brand Name *</label>
              <input
                type="text"
                className={`form-control ${
                  errors.brandName ? "is-invalid" : ""
                }`}
                name="brandName"
                value={form.brandName}
                onChange={handleChange}
              />
              <div className="invalid-feedback">{errors.brandName}</div>
            </div>

            {/* Address */}
            <div className="mb-3">
              <label className="form-label">Address *</label>
              <textarea
                className={`form-control ${errors.address ? "is-invalid" : ""}`}
                rows="3"
                name="address"
                value={form.address}
                onChange={handleChange}
              ></textarea>
              <div className="invalid-feedback">{errors.address}</div>
            </div>

            {/* GST (Optional) */}
            <div className="mb-3">
              <label className="form-label">GST Number (Optional)</label>
              <input
                type="text"
                className="form-control"
                name="GSTNO"
                value={form.GSTNO}
                onChange={handleChange}
              />
            </div>

            {/* MSME (Optional) */}
            <div className="mb-3">
              <label className="form-label">MSME Number (Optional)</label>
              <input
                type="text"
                className="form-control"
                name="MSME"
                value={form.MSME}
                onChange={handleChange}
              />
            </div>

            {/* Signature Image */}
            <div className="mb-3">
              {(previewSignature ||
                (typeof form.signatureImage === "string" &&
                  form.signatureImage)) && (
                <div className="mb-2">
                  <img
                    src={
                      previewSignature ||
                      HOST + "/uploads/" + form.signatureImage
                    }
                    alt="Signature Image Preview"
                    style={{ maxWidth: "200px", maxHeight: "200px" }}
                    crossOrigin="anonymous"
                  />
                </div>
              )}
              <label className="form-label">Signature Image (Optional)</label>
              <input
                type="file"
                className="form-control"
                name="signatureImage"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>

            <PrimaryButton
              action={() => {}}
              label="UPDATE PROFILE"
              busy={busy}
            />
          </form>
        </div>
      </div>
    </div>
  );
};
