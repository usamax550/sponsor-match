import React from "react";

const EditBrandModal = () => {
  return (
    <div className="space-y-4">
      <div className="">
        <label htmlFor="title" className="block tracking-wide">
          Brand Name
        </label>
        <input type="text" id="title" className="ad-input" />
      </div>
      <div className="space-y-3">
        <label htmlFor="description" className="block tracking-wide">
          Description
        </label>
        <textarea
          id="description"
          className="ad-textarea scrollbar pr-1"
        ></textarea>
      </div>
    </div>
  );
};

export default EditBrandModal;
