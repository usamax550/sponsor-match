import React from "react";
import CardSkeleton from "./cardSkeleton";
import BrandAdCard from "./brandCard";
import InfluencerAdCard from "./InfluencerCard";

const CardRederer = ({ adsData, isLoading, error, role }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 mt-6 sm:grid-cols-3 lg:grid-cols-4">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="max-w-sm">
            <CardSkeleton />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error loading ads</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-6 mt-6 sm:grid-cols-3 lg:grid-cols-4">
      {adsData?.data.map((ad) => (
        <div key={ad._id} className="max-w-sm h-full">
          {role === "brand" ? (
            <BrandAdCard ad={ad} role={role} />
          ) : (
            <InfluencerAdCard ad={ad} />
          )}
        </div>
      ))}
    </div>
  );
};

export default CardRederer;
