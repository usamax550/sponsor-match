import { useNavigate } from "react-router-dom";
import { incrementCount } from "../../api/ads";


const BrandAdCard = ({ ad , role}) => {
  const navigate = useNavigate();

  const handleViewClick = async () => {
    // // Increment count before navigation
    await incrementCount(
       ad._id,
       "views", // since this is a BrandAdCard
       false,
    );

    navigate(`/view-ad/${ad._id}`);
  };

  return (
    <div className="p-4 bg-cardBg rounded-sm shadow-sm space-y-2">
      <img
        src={ad.thumbnail}
        alt={ad.name}
        className="w-full h-40 object-cover rounded-md mb-4"
      />
      <h3 className="text-lg font-semibold mb-2">{ad.name}</h3>
      <p className="text-sm text-gray-600">{ad.productCategory}</p>
      <button
        onClick={handleViewClick}
        className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
      >
        View Ad
      </button>
    </div>
  );
};

export default BrandAdCard;
