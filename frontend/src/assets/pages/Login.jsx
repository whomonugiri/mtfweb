import { PrimaryButton } from "../elements/PrimaryButton";
import { PrimaryInput } from "../elements/PrimaryInput";
import Logo from "../images/logo.png";
export const Login = () => {
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
            busy="true"
          />
        </div>
        <div className="mt-2">
          <PrimaryButton label="LOGIN" busy={true} />
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
