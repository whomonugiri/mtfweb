import { useState } from "react";
import { PrimaryButton } from "../elements/PrimaryButton";
import { PrimaryInput } from "../elements/PrimaryInput";
import Logo from "../images/logo.png";
import toastr from "toastr";
import { singleCall } from "../../api/functions";
import { SEND_OTP } from "../../api/endpoints";
import { Navigate, useNavigate } from "react-router";

export const Login = () => {
  const [mobile, setMobile] = useState("");
  const [busy, setBusy] = useState(false);
  const handleInputChange = (val) => {
    setMobile(val);
  };

  const navigate = useNavigate();

  const onSuccess = (data) => {
    localStorage.setItem("otpRef", data.otpRef);
    localStorage.setItem("mobileNumber", mobile);
    navigate("/verify-otp", { replace: true });
  };

  const onFail = () => {
    setBusy(false);
  };

  const sendOtp = () => {
    const data = {};
    if (!mobile || !/^[0-9]{10}$/.test(mobile)) {
      toastr.error("Invalid Mobile Number");
      return;
    }

    data.mobileNumber = mobile;
    setBusy(true);
    singleCall(SEND_OTP, data, onSuccess, onFail);
  };
  return (
    <>
      <div className="mt-4 px-3 col-md-6 mx-auto">
        <div className="text-center">
          <img src={Logo} width="100px" />
        </div>
        <div className="fw-bold fs-5 text-center">Login to your account</div>
        <div className="small text-center opacity-75">
          Management Tool For Freelancers
        </div>
        <div className="my-2">
          <PrimaryInput
            type="number"
            label="Enter Your 10 Digit Mobile Number"
            value={mobile}
            onChange={handleInputChange}
            busy={busy}
          />
        </div>
        <div className="mt-2">
          <PrimaryButton action={sendOtp} label="LOGIN" busy={busy} />
          <div className="small opacity-75 mt-1" style={{ fontSize: "12px" }}>
            By continuing to sign in to mtfonline, you confirm that you have
            read and agreed to our{" "}
            <span className="text-success">Terms & Conditions</span> and{" "}
            <span className="text-success">Privacy Policy.</span>
          </div>
        </div>
      </div>
    </>
  );
};
