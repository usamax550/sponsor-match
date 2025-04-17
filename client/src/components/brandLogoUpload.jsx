const UploadLogo = ({ selectedFile, setSelectedFile }) => {
  const handleFileChange = (event) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <div className="flex items-center space-x-4 ">
      {/* Circle Container for the Icon */}
      <label
        htmlFor="brand-logo-upload"
        className="flex items-center justify-center w-11 h-11 bg-gray-100 rounded-full cursor-pointer"
      >
        <img
          src={
            selectedFile
              ? URL.createObjectURL(selectedFile)
              : "/icons/image.svg"
          }
          alt="Upload Icon"
          className={`${
            selectedFile ? "w-full aspect-square rounded-full" : "w-5"
          }`}
        />
        <input
          id="brand-logo-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>
      {/* Text */}
      <span className="text-gray-700 font-medium">
        {selectedFile
          ? (() => {
              const nameParts = selectedFile.name.split(".");
              const extension = nameParts.pop();
              const nameWithoutExt = nameParts.join(".");
              const maxLength = 20;

              if (nameWithoutExt.length > maxLength + 4 + extension.length) {
                return `${nameWithoutExt.slice(
                  0,
                  maxLength
                )}...${nameWithoutExt.slice(-3)}.${extension}`;
              }

              return selectedFile.name;
            })()
          : "Upload Brand’s logo Here"}
      </span>
    </div>
  );
};

export default UploadLogo;
