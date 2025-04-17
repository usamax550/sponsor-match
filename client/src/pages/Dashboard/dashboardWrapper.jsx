import React from "react";
import CardRederer from "../../components/Card/CardRederer";
import Pagination from "../../components/pagination";
import Search from "../../components/search";

const DashboardWrapper = ({
  adsData,
  isLoading,
  error,
  role,
  handlePageChange,
  search,
  handleSearch,
  children,
}) => {
  return (
    <div className="my-8 space-y-8">
      {/* Upper Section */}

      <h1 className="text-xl font-extrabold w-fit uppercase tracking-wide shadow-lg p-3 transition duration-300 ease-in-out">
  Welcome, {role?.toUpperCase() === "BRAND" ? "Influencer" : "Brand"}
</h1>
      <section className="flex items-center justify-center bg-primary text-white p-16 py-20 rounded-xl">
        <div className="space-y-5 min-w-[500px] max-md:min-w-full">
          <h1 className="text-3xl text-center font-bold tracking-wide">
            Explore Ads & Collaborations
          </h1>
          <Search search={search} handleSearch={handleSearch} />
        </div>
      </section>

      {/* Ads */}

      <section className="space-y-4">
        <h1 className="font-bold text-xl">Filters</h1>
        {/* Filters */}
        {children ? children : null}

        {/* Cards */}
        <CardRederer
          adsData={adsData}
          isLoading={isLoading}
          error={error}
          role={role}
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
    </div>
  );
};

export default DashboardWrapper;
