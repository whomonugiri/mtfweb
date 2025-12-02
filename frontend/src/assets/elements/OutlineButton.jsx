import { Hourglass } from "react-loader-spinner";
export const OutlineButton = ({
  busy = false,
  label = "label",
  action = () => {},
}) => {
  return (
    <button
      className={`btn btn-outline-success btn-sm fw-bold w-100 ${
        busy && "disabled"
      }`}
      onClick={action}
    >
      <Hourglass
        visible={busy}
        height="15"
        width="15"
        ariaLabel="hourglass-loading"
        wrapperStyle={{}}
        wrapperClass=""
        colors={["#34ce62ff", "#148443ff"]}
      />{" "}
      {label}
    </button>
  );
};
