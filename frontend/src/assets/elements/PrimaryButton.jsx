import { Hourglass } from "react-loader-spinner";
export const PrimaryButton = ({ busy = false, label }) => {
  return (
    <button
      className={`btn btn-success btn-sm fw-bold w-100 ${busy && "disabled"}`}
    >
      <Hourglass
        visible={busy}
        height="15"
        width="15"
        ariaLabel="hourglass-loading"
        wrapperStyle={{}}
        wrapperClass=""
        colors={["#ffffffff", "#ffffffff"]}
      />{" "}
      {label}
    </button>
  );
};
