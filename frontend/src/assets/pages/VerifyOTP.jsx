import { useState } from "react";
import Logo from "../images/logo.png";
import OtpInput from "react-otp-input";
import { FaArrowLeft } from "react-icons/fa";
import { PrimaryButton } from "../elements/PrimaryButton";
import { OutlineButton } from "../elements/OutlineButton";

export const VerifyOTP = () => {
  const [otp, setOtp] = useState("");

  return (
    <>
      <div className="mt-4 px-3 col-md-6 mx-auto">
        <div className="text-center mb-3">
          <button className="btn btn-sm btn-outline-dark fw-bold">
            <FaArrowLeft /> Change Mobile Number
          </button>
        </div>
        <div className="fw-bold fs-5 text-center">Enter 6 Digit Code</div>
        <div className="small text-center opacity-75">
          Sent to your mobile number
        </div>
        <div className="my-2">
          <OtpInput
            value={otp}
            onChange={setOtp}
            numInputs={6}
            renderSeparator={<span></span>}
            inputType="tel"
            renderInput={(props) => <input {...props} />}
            containerStyle={"d-flex justify-content-between gap-1"}
            inputStyle={
              "form-control w-100 rounded-5 border shadow-sm border-success fw-bold"
            }
          />
        </div>
        <div className="mt-2">
          <PrimaryButton label="VERIFY OTP" />
          <div className="small opacity-75 mt-1" style={{ fontSize: "12px" }}>
            By continuing to sign in to mtfonline, you confirm that you have
            read and agreed to our{" "}
            <span className="text-success">Terms & Conditions</span> and{" "}
            <span className="text-success">Privacy Policy.</span>
          </div>
        </div>

        <div className="border-top border-success mt-3 d-flex justify-content-between align-items-center pt-3">
          <div className="small opacity-75 text-success">Resend in 02:00</div>
          <div>
            <OutlineButton label="RESEND OTP" />
          </div>
        </div>
      </div>
    </>
  );
};
