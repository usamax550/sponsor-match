const Radio = ({ value, title, selected, setSelected, isCheckbox }) => {
  return (
    <label
      className={`${
        typeof title === "string" ? "radio-wrapper" : "radio-wrapper-with-img"
      }`}
    >
      <span className="text-black font-medium">{title}</span>
      <input
        type={isCheckbox ? "checkbox" : "radio"}
        name="role"
        value={value}
        checked={selected === value}
        onChange={() => setSelected(value)}
        className="hidden"
      />
      <div
        className={`radio ${selected === value ? "bg-secondary" : "bg-white"}`}
      />
    </label>
  );
};

export default Radio;
