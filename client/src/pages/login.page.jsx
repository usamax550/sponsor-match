import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import AuthPagesWrapper from "../components/authPagesWrapper";
import { useAuth } from "../context/auth.context";
import useRedirectAuth from "../hooks/useRedirectAuth";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();

  useRedirectAuth(true);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      await login(data?.email, data?.password);
      navigate("/dashboard");
    } catch (err) {
      if (err.status === 401 || error?.response?.status === 401) {
        setError("email", {
          type: "manual",
          message: err.response?.data?.message || "Invalid email or password",
        });
        setError("password", {
          type: "manual",
          message: err.response?.data?.message || "Invalid email or password",
        });
      } else {
        alert(
          err.response?.data?.message ||
            "An error occurred. Please try again later."
        );
      }
    }
  };

  return (
    <AuthPagesWrapper>
      <h2 className="text-2xl font-[600] mb-8">Log In to your Account</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm space-y-8"
      >
        {/* Input fields */}
        <div className="w-full space-y-3">
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
        </div>

        <button
          type="submit"
          className="btn-primary bg-secondary"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Log In"}
        </button>
        <p className="mt-8 text-gray-600 text-center w-full">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-primary font-semibold hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </form>
    </AuthPagesWrapper>
  );
};

export default LoginPage;
