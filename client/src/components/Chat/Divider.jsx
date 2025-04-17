import React from "react";

export const Divider = ({ text }) => {
  return (
    <div className="flex items-center gap-10">
      <div className="divider-bar" />
      <p className="text-gray-700 text-nowrap">{text}</p>
      <div className="divider-bar" />
    </div>
  );
};
