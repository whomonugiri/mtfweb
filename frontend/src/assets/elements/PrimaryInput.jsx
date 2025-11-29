export const PrimaryInput = ({ type, label, busy = false }) => {
  return (
    <input
      type={type}
      className={`form-control  shadow-sm`}
      placeholder={label}
      disabled={busy}
    />
  );
};
