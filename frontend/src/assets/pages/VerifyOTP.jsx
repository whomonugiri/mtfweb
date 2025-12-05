import { useContext, useEffect, useRef, useState } from "react";
import Logo from "../images/logo.png";
import OtpInput from "react-otp-input";
import { FaArrowLeft } from "react-icons/fa";
import { PrimaryButton } from "../elements/PrimaryButton";
import { OutlineButton } from "../elements/OutlineButton";
import { Navigate, useNavigate } from "react-router";
import toastr from "toastr";
import { SEND_OTP, VERFIY_OTP } from "../../api/endpoints";
import { singleCall } from "../../api/functions";
import { AppContext } from "../../utils/AppProvider";

export const VerifyOTP = () => {
  const { setIsAuth, setUserData } = useContext(AppContext);
  const [timer, setTimer] = useState(600);
  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState(false);
  const [busy2, setBusy2] = useState(false);
  const mobileNumber = localStorage.getItem("mobileNumber");
  const otpRef = localStorage.getItem("otpRef");

  const intervalRef = useRef(null);
  const startTimer = () => {
    setTimer(10);

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const formatTime = () => {
    const m = String(Math.floor(timer / 60)).padStart(2, "0");
    const s = String(timer % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  if (!mobileNumber || !otpRef) return <Navigate to="/login" replace />;

  const navigate = useNavigate();

  const onSuccess = (data) => {
    setUserData(data.data);
    setIsAuth(true);
    console.log(data);

    localStorage.removeItem("otpRef");
    localStorage.removeItem("mobileNumber");
    localStorage.setItem("token", data.token);
    localStorage.setItem("deviceId", data.deviceId);
  };

  const onFail = () => {
    setBusy(false);
  };

  const verifyOtp = () => {
    const data = {};
    data.mobileNumber = mobileNumber;
    data.otpRef = otpRef;
    data.otp = otp;
    setBusy(true);
    singleCall(VERFIY_OTP, data, onSuccess, onFail);
  };

  const resendOtp = () => {
    const data = {};
    data.mobileNumber = mobileNumber;
    setBusy2(true);
    singleCall(
      SEND_OTP,
      data,
      (data) => {
        localStorage.setItem("otpRef", data.otpRef);
        setBusy2(false);
        startTimer();
      },
      () => {
        setBusy2(false);
      }
    );
  };

  useEffect(() => {
    startTimer();
    return () => clearInterval(intervalRef.current); // cleanup
  }, []);

  return (
    <>
      <div className="mt-4 px-3 col-md-6 mx-auto">
        <div className="text-center mb-3">
          <button
            className="btn btn-sm btn-outline-dark fw-bold"
            onClick={() => {
              localStorage.removeItem("otpRef");
              localStorage.removeItem("mobileNumber");
              navigate("/login");
            }}
          >
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
          <PrimaryButton label="VERIFY OTP" busy={busy} action={verifyOtp} />
          <div className="small opacity-75 mt-1" style={{ fontSize: "12px" }}>
            By continuing to sign in to mtfonline, you confirm that you have
            read and agreed to our{" "}
            <span className="text-success">Terms & Conditions</span> and{" "}
            <span className="text-success">Privacy Policy.</span>
          </div>
        </div>

        <div className="border-top border-success mt-3 d-flex justify-content-center align-items-center pt-3">
          {timer > 0 && (
            <div className="small opacity-75 text-success">
              Resend in {formatTime()}
            </div>
          )}

          {timer < 1 && (
            <div>
              <OutlineButton
                action={resendOtp}
                label="RESEND OTP"
                busy={busy2}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};
