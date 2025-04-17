import { useNavigate } from "react-router-dom";
import { incrementCount } from "../../api/ads";

const InfluencerAdCard = ({ ad }) => {
  const navigate = useNavigate();

  return (
    <div className="p-4 bg-cardBg rounded-sm shadow-sm gap-2 flex flex-col flex-grow h-full">
      <img
        src={ad.thumbnailUrl}
        alt={ad.title}
        className="w-full h-40 object-cover rounded-md mb-4"
      />
      <h3 className="text-lg font-semibold mb-2">{ad.title}</h3>
      <div className="flex gap-2 flex-wrap">
        {ad.socialPlatforms.map((platform) => (
          <span
            key={platform.platform}
            className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded"
          >
            {platform.platform}
          </span>
        ))}
      </div>
      <button
        onClick={async() =>{ await incrementCount(
                             ad._id,
                             "views", 
                             true,
                          ); navigate(`/view-ad/${ad._id}`)}}
        className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors mt-auto"
      >
        View Ad
      </button>
    </div>
  );
};

export default InfluencerAdCard;
