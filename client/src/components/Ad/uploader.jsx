import { useState } from "react";

const Uploader = ({ title, icon, acceptedFiles, file, setFile }) => {
  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="font-semibold text-gray-900">{title}</label>
      <label
        htmlFor={`file-upload-${title}`}
        className="flex items-center gap-2 px-4 py-2 bg-[#F1EFEF] text-gray-500 border border-gray-300 rounded-lg cursor-pointer hover:brightness-95 w-fit min-w-48 text-sm"
      >
        {file && file?.type?.startsWith("image/") ? (
          <img
            src={URL.createObjectURL(file)}
            alt="Selected file"
            className="w-5 h-5 rounded"
          />
        ) : (
          <img src={icon} alt="Upload icon" className="w-5 h-5" />
        )}

        {/* <img src={icon} className="w-5 h-5 " /> */}
        {file ? file.name : `Upload ${title}`}
      </label>
      <input
        id={`file-upload-${title}`}
        type="file"
        accept={acceptedFiles}
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default Uploader;
