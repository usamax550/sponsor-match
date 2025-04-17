import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthPagesWrapper from "../../components/authPagesWrapper";
import { z } from "zod";
import { useAuth } from "../../context/auth.context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import uploadImage from "../../utils/uploadImage";
import UploadLogo from "../../components/brandLogoUpload";
import axiosInstance from "../../utils/axiosInstance";

const signupSchema = z.object({
  name: z.string().min(2, "Brand name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const SignupBrand = () => {
  const navigate = useNavigate();
  const { setUser, setToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

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
      let avatarUrl = "";
      if (selectedFile) {
        avatarUrl = await uploadImage(selectedFile);
      }

      
const response = await axiosInstance.post("/auth/signup", {
  ...data,
  role: "brand",
  avatar: avatarUrl,
});

      const { token, user } = response.data;

      // Store token and user in context
      setToken(token);
      setUser(user);
      localStorage.setItem("token", token);

      navigate("/dashboard"); // Navigate to home or dashboard
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
      <h2 className="text-2xl font-[600] mb-8">Create Your Account</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm space-y-8"
      >
        {/* Input fields */}
        <div className="w-full space-y-3">
          <div>
            <input
              type="text"
              placeholder="Enter Brand's Name"
              className="input-without-icon"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>
          <div>
            <input
              type="email"
              placeholder="Email"
              className="input-with-icon bg-[url('/icons/email.svg')]"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
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
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <UploadLogo
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
          />
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
    </AuthPagesWrapper>
  );
};

export default SignupBrand;
