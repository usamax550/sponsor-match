import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthPagesWrapper from "../../components/authPagesWrapper";
import Checkbox from "../../components/Checkbox";
import { z } from "zod";
import { useAuth } from "../../context/auth.context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import axiosInstance from "../../utils/axiosInstance";

const signupSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const SignupInfluencer = () => {
  const navigate = useNavigate();
  const { setUser, setToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const body = {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        password: data.password,
        role: "influencer",
        socialMedia: selectedPlatforms.map((platform) => ({ platform })),
      };
      console.log(body);

      const response = await axiosInstance.post("/auth/signup", body);

      const { token, user } = response.data;
      setToken(token);
      setUser(user);
      localStorage.setItem("token", token);

      navigate("/dashboard");
    } catch (error) {
      setError("form", {
        type: "manual",
        message: error.response?.data?.message || "Something went wrong",
      });
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPagesWrapper>
      <div className="">
        <h2 className="text-2xl font-[600] mb-8">Create Your Account</h2>
        <form
          className="w-full max-w-sm space-y-8"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* Input fields */}
          <div className="w-full space-y-3">
            <div className="flex justify-center space-x-2">
              <input
                type="text"
                placeholder="First Name"
                className="input-with-icon !pl-5"
                {...register("firstName")}
              />
              <input
                type="text"
                placeholder="Last Name"
                className="input-with-icon !pl-5"
                {...register("lastName")}
              />
            </div>
            {(errors.firstName || errors.lastName) && (
              <p className="text-red-500 text-sm">
                {errors.firstName?.message || errors.lastName?.message}
              </p>
            )}

            <div>
              <input
                type="email"
                placeholder="Email"
                className="input-with-icon bg-[url('/icons/email.svg')]"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                className="input-with-icon bg-[url('/icons/password.svg')]"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>
            <h3 className="text-lg max-sm:text-base font-medium  text-black mb-4 mt-8">
              Select Your Social Media Accounts
            </h3>
            <div className="flex w-full gap-4 h-10">
              <SocialMediaCheckboxes
                selectedPlatforms={selectedPlatforms}
                setSelectedPlatforms={setSelectedPlatforms}
              />
            </div>
          </div>

          {errors.form && (
            <div className="text-red-500 text-center text-sm">
              {errors.form.message}
            </div>
          )}

          <button
            type="submit"
            className="btn-primary bg-secondary"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
          <p className="mt-8 text-gray-600 text-center w-full">
            Already have an account?{" "}
            <Link
              to="/"
              className="text-primary font-semibold hover:underline"
            >
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </AuthPagesWrapper>
  );
};

const SocialMediaCheckboxes = ({ selectedPlatforms, setSelectedPlatforms }) => {
  const handleSelection = (platform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  return (
    <>
      <Checkbox
        key="insta"
        selected={selectedPlatforms.includes("insta")}
        setSelected={() => handleSelection("insta")}
        value="insta"
        isCheckbox={true}
        title={<img src="/images/insta.png" className="radio-img" />}
      />
      <Checkbox
        key="facebook"
        selected={selectedPlatforms.includes("facebook")}
        setSelected={() => handleSelection("facebook")}
        value="facebook"
        isCheckbox={true}
        title={<img src="/images/facebook.png" className="radio-img" />}
      />
      <Checkbox
        key="youtube"
        selected={selectedPlatforms.includes("youtube")}
        setSelected={() => handleSelection("youtube")}
        value="youtube"
        isCheckbox={true}
        title={<img src="/images/youtube.png" className="radio-img" />}
      />
      <Checkbox
        key="tiktok"
        selected={selectedPlatforms.includes("tiktok")}
        setSelected={() => handleSelection("tiktok")}
        value="tiktok"
        isCheckbox={true}
        title={<img src="/images/tiktok.png" className="radio-img" />}
      />
    </>
  );
};

export default SignupInfluencer;
