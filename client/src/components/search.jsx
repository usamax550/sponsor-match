import React from "react";

const Search = ({
  showSuggestions,
  isChat,
  placeholder,
  handleSearch,
  search,
}) => {
  return (
    <div className="space-y-4">
      {/* Input */}
      <div
        className={`relative flex items-center w-full h-10 rounded-lg ${
          isChat ? "chat-search" : "dashboard-search"
        }`}
      >
        <div className="grid place-items-center h-full w-10 text-gray-300">
          <img src="/icons/search.svg" className="w-4 h-4 opacity-55" />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder={placeholder || "Search"}
          className="peer h-full w-full outline-none text-sm text-gray-800 pr-2"
        />
      </div>

      {/* Suggestions */}
      {showSuggestions && (
        <div className="flex items-center space-x-2 mt-2 text-sm flex-wrap gap-1">
          <span>Search for: </span>
          <SuggestionCard title="Tech Influencers" />
          <SuggestionCard title="Fashion Brands" />
          <SuggestionCard title="Product Review" />
        </div>
      )}
    </div>
  );
};

export default Search;

const SuggestionCard = ({ title }) => {
  return (
    <>
      <div className="bg-background text-black inline-block rounded-md p-1 px-2 ">
        <p>{title}</p>
      </div>
    </>
  );
};
