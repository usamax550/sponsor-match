const CardSkeleton = () => {
  return (
    <>
      <div
        role="status"
        className="p-4 bg-cardBg rounded-sm shadow-sm animate-pulse md:p-6 md:pb-10"
      >
        <div className="flex items-center justify-center h-40 mb-4 bg-primary rounded-md"></div>
        <div className="h-4 bg-cardSkeleton w-48 mb-4"></div>
        <div className="h-2 bg-cardSkeleton mb-2.5"></div>
        <div className="h-2 bg-cardSkeleton mb-2.5"></div>
        <div className="h-2 bg-cardSkeleton"></div>

        <span className="sr-only">Loading...</span>
      </div>
    </>
  );
};

export default CardSkeleton;
