import React, { useState } from "react";
import CardRederer from "../../components/Card/CardRederer";
import Pagination from "../../components/pagination";
import { useGetMyAds } from "../../api/ads";
import { useAuth } from "../../context/auth.context";

const AdsPageWrapper = ({ openModal, children }) => {
  const [page, setPage] = useState(1);

  const { user } = useAuth();
  const { data: adsData, isLoading, error } = useGetMyAds(user?.role, page);
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <section className="">
      <div className="flex justify-end my-10">
        <button
          type="button"
          className="btn-primary bg-primary max-w-48"
          onClick={openModal}
        >
          Post Your Add
        </button>
        {children}
      </div>

      <CardRederer
        adsData={adsData}
        isLoading={isLoading}
        error={error}
        role={user?.role}
      />
      {adsData && (
        <div className="my-4">
          <Pagination
            currentPage={adsData.currentPage}
            totalPages={adsData.totalPages}
            totalDocs={adsData.totalDocs}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </section>
  );
};

export default AdsPageWrapper;
