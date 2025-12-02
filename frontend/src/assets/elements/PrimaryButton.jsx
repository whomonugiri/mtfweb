import { Hourglass } from "react-loader-spinner";
export const PrimaryButton = ({
  busy = false,
  label = "label",
  action = () => {},
}) => {
  return (
    <button
      onClick={action}
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
