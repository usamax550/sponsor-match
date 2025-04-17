const Pagination = ({
  currentPage,
  totalPages,
  totalDocs,
  onPageChange,
  numPages = 8,
}) => {
  return (
    <div className="flex flex-col items-center">
      <span className="text-sm text-gray-400">
        Showing{" "}
        <span className="font-semibold text-gray-900">
          {(currentPage - 1) * numPages + 1}
        </span>{" "}
        to{" "}
        <span className="font-semibold text-gray-900">
          {Math.min(currentPage * numPages, totalDocs)}
        </span>{" "}
        of <span className="font-semibold text-gray-900">{totalDocs}</span>{" "}
        Entries
      </span>
      <div className="inline-flex mt-2 xs:mt-0">
        <button
          className="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-primary rounded-s border-secondary hover:brightness-95 disabled:opacity-50"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <button
          className="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-primary rounded-e border-secondary hover:brightness-95 disabled:opacity-50"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
