import React, { useEffect, useState } from "react";
import { useGetInfluencerAds } from "../../api/ads";
import DashboardWrapper from "./dashboardWrapper";

const initialFilters = {
  minFollowers: "",
  maxFollowers: "",
  minReach: "",
  maxReach: "",
};

const BrandDashboard = () => {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState(initialFilters);
  const [pendingFilters, setPendingFilters] = useState(initialFilters);
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: adsData,
    isLoading,
    error,
  } = useGetInfluencerAds(page, searchQuery, filters);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setPendingFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
    setPage(1);
  };

  const handleApplyFilters = (e) => {
    e.preventDefault();

    const minFollowers =
      Number(pendingFilters.minFollowers) > 0
        ? Number(pendingFilters.minFollowers)
        : "";
    const maxFollowers =
      Number(pendingFilters.maxFollowers) > 0
        ? Math.max(minFollowers || 0, Number(pendingFilters.maxFollowers))
        : "";

    const minReach =
      Number(pendingFilters.minReach) > 0
        ? Number(pendingFilters.minReach)
        : "";
    const maxReach =
      Number(pendingFilters.maxReach) > 0
        ? Math.max(minReach || 0, Number(pendingFilters.maxReach))
        : "";

    setFilters({
      minFollowers,
      maxFollowers,
      minReach,
      maxReach,
    });
  };

  const handleResetFilters = () => {
    setPendingFilters(initialFilters);
    setFilters(initialFilters);
  };

  return (
    <DashboardWrapper
      adsData={adsData}
      isLoading={isLoading}
      error={error}
      handlePageChange={handlePageChange}
      role={"influencer"}
      search={searchQuery}
      handleSearch={handleSearch}
    >
      <form
        className="flex flex-row max-md:flex-col gap-4"
        onSubmit={handleApplyFilters}
      >
        {/* Followers Filter */}
        <div className="flex items-center gap-2">
          <label className="text-gray-700 font-medium">Community:</label>
          <input
            type="number"
            placeholder="Min"
            name="minFollowers"
            value={pendingFilters.minFollowers}
            onChange={handleFilterChange}
            min="0"
            className="w-24 p-2 border border-gray-300 rounded-lg text-sm"
          />
          <span>-</span>
          <input
            type="number"
            placeholder="Max"
            name="maxFollowers"
            value={pendingFilters.maxFollowers}
            onChange={handleFilterChange}
            className="w-24 p-2 border border-gray-300 rounded-lg text-sm"
            min={pendingFilters.minFollowers || 0}
          />
        </div>

        {/* Reach Filter */}
        <div className="flex items-center gap-2">
          <label className="text-gray-700 font-medium">Reach:</label>
          <input
            type="number"
            placeholder="Min"
            name="minReach"
            value={pendingFilters.minReach}
            onChange={handleFilterChange}
            className="w-24 p-2 border border-gray-300 rounded-lg text-sm"
            min="0"
          />
          <span>-</span>
          <input
            type="number"
            placeholder="Max"
            name="maxReach"
            value={pendingFilters.maxReach}
            onChange={handleFilterChange}
            className="w-24 p-2 border border-gray-300 rounded-lg text-sm"
            min={pendingFilters.minReach || 0}
          />
        </div>
        <div className="space-x-2">
          <button type="submit" className="btn-primary bg-secondary w-20">
            Apply
          </button>
          <button
            onClick={handleResetFilters}
            type="reset"
            className="btn-primary bg-cardBg text-gray-500 w-20"
          >
            Reset
          </button>
        </div>
      </form>
    </DashboardWrapper>
  );
};

export default BrandDashboard;
