export const PrimaryInput = ({
  type = "text",
  label = "label",
  busy = false,
  value = "",
  onChange = () => {},
}) => {
  return (
    <input
      type={type}
      className={`form-control  shadow-sm`}
      placeholder={label}
      disabled={busy}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};
