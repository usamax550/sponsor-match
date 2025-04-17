import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { incrementCount, useGetAdById } from "../../api/ads";
import { useAuth } from "../../context/auth.context";
import useRedirectAuth from "../../hooks/useRedirectAuth";

const ViewAd = () => {
  useRedirectAuth();

  const navigate = useNavigate();
  const { id: adId } = useParams();
  const { user, isAuthenticated } = useAuth();

  const { data: ad, isLoading, error } = useGetAdById(adId);

  if (isLoading) return <p>Loading ad details...</p>;
  if (error) return <p>Failed to load ad.</p>;

  if (!isAuthenticated) {
    return (
      <>
        <p className="text-center text-xl">Please login to view ad details</p>
      </>
    );
  }

  let adRole = ad?.brandId ? "brand" : "influencer";

  return (
    <div className="py-4 pb-12">
      <section className="grid grid-cols-5 gap-6 min-h-[350px]">
        <div className="col-span-2 max-md:col-span-5">
          {adRole === "brand" ? (
            <img
              src={ad?.thumbnail || "/images/fallback.png"}
              className="bg-primary h-full rounded object-cover"
            />
          ) : (
            <video
              src={ad?.videoUrl}
              controls
              className="bg-primary h-full w-full rounded object-cover"
            />
          )}
        </div>
        <div className="col-span-3 max-md:col-span-5 overflow-y-auto scrollbar pr-2 space-y-4">
          <h1 className="text-3xl font-bold">{ad?.title || ad?.name}</h1>
          <p className="text-gray-600 w-[60%] max-lg:w-[80%] max-md:w-full">
            {ad?.description}
          </p>
        </div>
      </section>

      {adRole === "brand" ? (
        <ViewBrandAd productCategory={ad?.productCategory} />
      ) : (
        <ViewInfluencerAd socialPlatforms={ad?.socialPlatforms} />
      )}

      {!(
        user?._id === ad?.brandId?._id || user?._id === ad?.influencer?._id
      ) && (
        <footer className="w-full bg-white bottom-0 left-0 right-0 fixed rounded-t-3xl shadow-[0px_-3px_10px_rgba(0,0,0,0.20)] p-4 md:px-8">
          <button
            className="btn-primary bg-primary w-[100%] text-lg"
            onClick={async() =>{
                  await incrementCount(
                     ad._id,
                     "chat", 
                     ad?.brandId?false:true,
                  );
              navigate(
                `/chats?recipientId=${ad?.brandId?._id || ad?.influencer?._id}`
              )}
            }
          >
            Chat
          </button>
        </footer>
      )}
    </div>
  );
};

export default ViewAd;

function formatNumber(num) {
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
  } else if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  } else if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return num.toString();
}

const ViewInfluencerAd = ({ socialPlatforms }) => {
  let socialMedia = ["facebook", "insta"];

  return (
    <section className="my-8 space-y-4">
      <h2 className="font-bold text-2xl">About Me</h2>
      <div className="grid grid-cols-5 max-md:grid-cols-4 gap-4">
        <div className="ad-social-accounts-grid">
          <h3 className="font-semibold">Social Media Accounts</h3>
        </div>
        <div className="ad-social-accounts-grid">
          <h3 className="font-semibold">Post reach</h3>
        </div>

        {socialPlatforms &&
          socialPlatforms.map((el, ind) => {
            return (
              <React.Fragment key={`${el} ${ind} ${Math.random() * 1000} `}>
                <div className="flex items-center gap-2 ad-social-accounts-grid">
                  <img src={`/images/${el.platform}.png`} />
                  <p>{formatNumber(el.followers)} Followers</p>
                </div>

                <div className="ad-social-accounts-grid flex items-center gap-2">
                  {ind & 1 ? (
                    <img src="/icons/product_category.svg" alt="" />
                  ) : (
                    <img src="/icons/people.svg" alt="" />
                  )}
                  <p>{formatNumber(el.reach)}</p>
                </div>
              </React.Fragment>
            );
          })}
      </div>
    </section>
  );
};

const ViewInfluencerAdOld = () => {
  let socialMedia = ["facebook", "insta"];

  return (
    <section className="my-8 space-y-4">
      <h2 className="font-bold text-2xl">About Me</h2>
      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-2 space-y-4 max-md:col-span-5">
          <h3 className="font-semibold">Folowers and Post reach</h3>
          <div className="flex items-center gap-2">
            <img src="/icons/people.svg" />
            <p>10K Followers</p>
          </div>
          <div className="flex items-center gap-2">
            <img src="/icons/product_category.svg" />
            <p>100K Post reach</p>
          </div>
        </div>

        <div className="col-span-3 space-y-4 max-md:col-span-5">
          <h3 className="font-semibold">Social Media Accounts</h3>
          <div className="flex gap-4">
            {socialMedia.map((el) => {
              return <img key={el} src={`/images/${el}.png`} />;
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

const ViewBrandAd = ({ productCategory }) => {
  return (
    <section className=" space-y-4 my-4">
      <h2 className="font-bold text-2xl">What We're Looking For</h2>
      <h3 className="font-semibold">Product Category</h3>
      <div className="flex items-center gap-2">
        <img src="/icons/product_category.svg" />
        <p className="text-gray-600">{productCategory}</p>
      </div>
    </section>
  );
};
