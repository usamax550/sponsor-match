import { createContext, useContext, useState } from "react";
import axios from "axios";
import axiosInstance from "../utils/axiosInstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const baseUrl = import.meta.env.VITE_PUBLIC_API_BASE ?? "http://localhost:5000";

      const response = await axios.post(`${baseUrl}/auth/login`, {
        email,
        password,
      });
      
      const { token, user } = response?.data;

      setUser(user);
      setToken(token);
      localStorage.setItem("token", token);

      return response?.data;
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred during login");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  const setLoginStatus = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get("/profile/get-profile-info");
      if (response?.status === 200) setUser(response?.data?.user);
    } catch (error) {
      setError(
        error.response?.data?.message || "An error occurred during login"
      );
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    token,
    loading,
    error,
    login,
    logout,
    setToken,
    setUser,
    isAuthenticated: !!token,
    setLoginStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
