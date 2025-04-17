const InputButtons = ({ followers }) => {
  return (
    <div className="flex gap-4">
      <input type="text" placeholder={followers} className="input-box" />
      <input type="text" placeholder="Post reach" className="input-box" />
    </div>
  );
};

export default InputButtons;
