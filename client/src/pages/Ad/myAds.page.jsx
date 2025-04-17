import React from "react";
import { useAuth } from "../../context/auth.context";
import useRedirectAuth from "../../hooks/useRedirectAuth";
import BrandModal from "./brand.modal";
import InfluencerModal from "./influencer.modal";

const MyAds = () => {
  const { user } = useAuth();

  useRedirectAuth();

  if (user?.role === "brand") {
    return <BrandModal />;
  } else if (user?.role === "influencer") {
    return <InfluencerModal />;
  } else {
    return <>Loading....</>;
  }
};

export default MyAds;
