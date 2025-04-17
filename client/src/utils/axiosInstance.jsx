import axios from "axios";

// Create an Axios instance
const baseURL = import.meta.env.VITE_PUBLIC_API_BASE || "http://localhost:5000";
const axiosInstance = axios.create({
  baseURL:  baseURL
  ,
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
