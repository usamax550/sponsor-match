import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth.context";
import { useQueryClient } from "@tanstack/react-query";

const Navbar = () => {
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    queryClient.clear();
    navigate("/", { replace: true });
  };

  const isActive = (path) =>
    location.pathname === path ? "text-primary font-semibold" : "";

  return (
    <header className="flex justify-between items-center p-4 relative">
      {/* Logo */}
      <div className="sm:w-28 w-20 max-[386px]:hidden">
        <img src="/icons/logo.svg" alt="Logo" />
      </div>

      {/* Desktop Nav */}
      <nav className="hidden sm:block">
        <ul className="flex space-x-8">
          <li>
            <Link to={"/dashboard"} className={isActive("/dashboard")}>
              Dashboard
            </Link>
          </li>
          <li>
            <Link to={"/my-ads"} className={isActive("/my-ads")}>
              My Ads
            </Link>
          </li>
          <li>
            <Link to={"/chats"} className={isActive("/chats")}>
              Messages
            </Link>
          </li>
          <li>
            <Link to={"/analytics"} className={isActive("/analytics")}>
              Analytics
            </Link>
          </li>
        </ul>
      </nav>

      {/* Hamburger Icon for Mobile */}
      <div className="sm:hidden absolute top-[90%] left-4">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-2xl focus:outline-none"
        >
          ☰
        </button>
      </div>

      {/* Profile Button */}
      <div className="sm:w-12 w-10 ml-4">
        <div className="relative">
          <button onClick={() => setIsModalOpen(!isModalOpen)}>
            <img
              className="w-full rounded-full aspect-square"
              src={user?.avatar || "/icons/profile_fallback.svg"}
              alt="Profile"
            />
          </button>
          {isModalOpen && (
            <div
              className="absolute right-0 bg-chatCardBg border z-50 font-normal text-sm w-40 text-left rounded-lg mt-2"
              onClick={() => setIsModalOpen(false)}
            >
              <div>
                <div className="font-semibold p-3 border-b uppercase">
                  <Link to={"/profile"}>Profile</Link>
                </div>
                <div className="p-3">
                  <button onClick={handleLogout}>Logout</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
{/* Mobile Menu Dropdown with Close Button */}
{isMobileMenuOpen && (
  <nav className="absolute top-full left-0 w-full bg-white sm:hidden shadow-md z-40 px-4 pb-4 pt-2">
    <div className="flex justify-end mb-2">
      <button
        onClick={() => setIsMobileMenuOpen(false)}
        className="text-2xl font-bold text-gray-700"
      >
        &times;
      </button>
    </div>
    <ul className="flex flex-col items-center space-y-2">
      <li>
        <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className={isActive("/dashboard")}>
          Dashboard
        </Link>
      </li>
      <li>
        <Link to="/my-ads" onClick={() => setIsMobileMenuOpen(false)} className={isActive("/my-ads")}>
          My Ads
        </Link>
      </li>
      <li>
        <Link to="/chats" onClick={() => setIsMobileMenuOpen(false)} className={isActive("/chats")}>
          Messages
        </Link>
      </li>
      <li>
        <Link to="/analytics" onClick={() => setIsMobileMenuOpen(false)} className={isActive("/analytics")}>
          Analytics
        </Link>
      </li>
    </ul>
  </nav>
)}

    </header>
  );
};

export default Navbar;
