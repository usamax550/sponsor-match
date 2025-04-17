import React from "react";
import Navbar from "./navbar";

const LayoutWrapper = ({ children }) => {
  return (
    <div className="p-4 md:px-8 h-full relative">
      <Navbar />
      {children}
    </div>
  );
};

export default LayoutWrapper;
