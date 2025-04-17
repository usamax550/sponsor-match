import React from "react";

const AuthPagesWrapper = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      {/* Left Section */}
      <div className="w-1/3 max-lg:w-1/2 max-md:hidden bg-primary relative text-white flex flex-col justify-center items-start p-12 rounded-r-3xl">
        <img
          className="absolute top-0 left-0 min-h-full min-w-full object-cover rounded-r-3xl opacity-10"
          src={"/images/auth_cover.jpg"}
          alt="cover"
        />
        <h1 className="text-4xl font-bold mb-4">
          Grow Your <span className="text-secondary">Influence</span> and
          Impact.
        </h1>
        <p className="text-lg">Log In to Connect. Collaborate.</p>
      </div>

      {/* Right Section */}
      <div className="w-2/3 max-lg:w-1/2 max-md:w-full max-md:items-center bg-white relative flex flex-col justify-center items-baseline p-12 pl-32 max-lg:pl-12">
        <div className="mb-auto">
          <img className="size-28" src="/icons/logo.svg" alt="Logo" />
        </div>
        {children}
        <div className="mt-auto" aria-hidden="true"></div>
      </div>
      <div className="bg-primary fixed top-0 left-0 w-full h-5 hidden max-md:block"></div>
      <div className="bg-primary fixed bottom-0 left-0 w-full h-5 hidden max-md:block"></div>
    </div>
  );
};

export default AuthPagesWrapper;
