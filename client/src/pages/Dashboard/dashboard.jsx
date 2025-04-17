import React from "react";
import { useAuth } from "../../context/auth.context";
import useRedirectAuth from "../../hooks/useRedirectAuth";
import BrandDashboard from "./brandDashboard";
import InfluencerDashboard from "./influencerDashbaord";

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();

  useRedirectAuth();

  if (user?.role === "brand") {
    return <BrandDashboard />;
  } else if (user?.role === "influencer") {
    return <InfluencerDashboard />;
  } else {
    return <>Loading....</>;
  }
};

export default Dashboard;
