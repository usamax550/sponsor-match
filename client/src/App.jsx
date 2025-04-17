import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/layout";
import LoginPage from "./pages/login.page";
import Signup from "./pages/signup/signup.page";
import SignupBrand from "./pages/signup/signupBrand.page";
import SignupInfluencer from "./pages/signup/signupInfluencer.page";
import MyAds from "./pages/Ad/myAds.page";
import Dashboard from "./pages/Dashboard/dashboard";
import ViewAd from "./pages/Ad/viewAd.page";
import Profile from "./pages/profile/profile.page";
import ChatPage from "./pages/chat.page";
import Navbar from "./components/navbar";
import { useAuth } from "./context/auth.context";
import { Toaster } from "react-hot-toast";
import ViewProfile from "./pages/profile/viewProfile.page";
import Analytics from "./pages/Analytics";

const App = () => {
  const { setLoginStatus } = useAuth();

  useEffect(() => {
    setLoginStatus();
  }, []);

  return (
    <BrowserRouter>
      <div className="bg-background flex justify-center">
        <main className="w-full max-w-[1920px] min-[1921px]:border min-[1921px]:shadow-lg min-h-screen">
          <Routes>
            <Route
              path="/dashboard"
              element={
                <Layout>
                  <Dashboard />
                </Layout>
              }
            />
            <Route
              path="/my-ads"
              element={
                <Layout>
                  <MyAds />
                </Layout>
              }
            />
            <Route
              path="/view-ad/:id"
              element={
                <Layout>
                  <ViewAd />
                </Layout>
              }
            />
            <Route
              path="/profile"
              element={
                <Layout>
                  <Profile />
                </Layout>
              }
            />
            <Route
              path="/profile/:id"
              element={
                <Layout>
                  <ViewProfile />
                </Layout>
              }
            />
            <Route
              path="/chats"
              element={
                <>
                  <div className="p-4 md:px-8">
                    <Navbar />
                  </div>
                  <div className="pl-4 md:pl-8 relative max-md:pl-0">
                    <ChatPage />
                  </div>
                </>
              }
            />
            <Route path={"/analytics"} element={
              <Layout><Analytics/></Layout>}/>
            <Route path="/" element={<LoginPage />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signup/brand" element={<SignupBrand />} />
            <Route path="/signup/influencer" element={<SignupInfluencer />} />
          </Routes>
        </main>
      </div>
      <Toaster />
    </BrowserRouter>
  );
};

export default App;
