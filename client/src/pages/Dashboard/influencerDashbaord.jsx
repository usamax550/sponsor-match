import React, { useEffect, useState } from "react";
import { useGetBrandAds } from "../../api/ads";
import DashboardWrapper from "./dashboardWrapper";
import { useCategories } from "../../api/category";

const InfluencerDashboard = () => {
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: adsData,
    isLoading,
    error,
  } = useGetBrandAds(page, selectedCategory, searchQuery);

  const { data: categories } = useCategories();

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setPage(1);
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
    setPage(1);
  };

  const handleReset = () => {
    setSelectedCategory("");
    setPage(1);
  };

  return (
    <DashboardWrapper
      adsData={adsData}
      isLoading={isLoading}
      error={error}
      handlePageChange={handlePageChange}
      role={"brand"}
      search={searchQuery}
      handleSearch={handleSearch}
    >
      <form className="w-32 flex gap-2">
        <select
          id="categories"
          className="w-40 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <option selected hidden value={""}>
            Category
          </option>
          {categories &&
            categories.map((cat, ind) => {
              return (
                <option key={ind} value={cat.toString()}>
                  {cat}
                </option>
              );
            })}
        </select>
        {selectedCategory && (
          <button
            type="button"
            onClick={handleReset}
            className="px-2 py-1 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Reset
          </button>
        )}
      </form>
    </DashboardWrapper>
  );
};

export default InfluencerDashboard;
