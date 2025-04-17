const Checkbox = ({ value, title, selected, setSelected, isCheckbox }) => {
    return (
      <label
        className={`${
          typeof title === "string" ? "radio-wrapper" : "radio-wrapper-with-img"
        }`}
      >
        <span className="text-black font-medium">{title}</span>
        <input
          type={isCheckbox ? "checkbox" : "radio"}
          name={value}
          value={value}
          checked={selected}
          onChange={() => setSelected(value)}
          className="hidden"
        />
        <div
          className={`radio ${selected ? "bg-secondary" : "bg-white"}`}
        />
      </label>
    );
  };
  
  export default Checkbox;
  