import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthPagesWrapper from "../../components/authPagesWrapper";
import Radio from "../../components/Radio";
import useRedirectAuth from "../../hooks/useRedirectAuth";

const Signup = () => {
  const [selected, setSelected] = useState("");
  const navigate = useNavigate();

  useRedirectAuth(true);

  return (
    <AuthPagesWrapper>
      <h2 className="text-2xl font-[600] mb-8">Create Your Account</h2>
      <form
        className="w-full max-w-sm space-y-8"
        onSubmit={(e) => {
          e.preventDefault();
          if (selected === "") return;
          navigate(`/signup/${selected.toLowerCase()}`);
        }}
      >
        {/* Input fields */}
        {/* <div className="w-full space-y-3"></div> */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-black mb-4">
            Getting started:{" "}
            <span className="font-normal text-[#717171]">Pick one</span>
          </h3>
          <div className="flex w-full gap-4">
            <RadioButtons selected={selected} setSelected={setSelected} />
          </div>

          <button type="submit" className="btn-primary bg-secondary mt-8">
            Next
          </button>
        </div>
      </form>
    </AuthPagesWrapper>
  );
};

const RadioButtons = ({ selected, setSelected }) => {
  return (
    <>
      <Radio
        selected={selected}
        setSelected={setSelected}
        title={"Brand"}
        value={"Brand"}
        key={"brand"}
      />
      <Radio
        selected={selected}
        setSelected={setSelected}
        title={"Influencer"}
        value={"Influencer"}
        key={"influencer"}
      />
    </>
  );
};

export default Signup;
