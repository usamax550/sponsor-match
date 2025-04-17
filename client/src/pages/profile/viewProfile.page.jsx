import React, { useEffect } from "react";
import { toast } from "react-hot-toast";
import { useParams } from "react-router-dom";
import { useGetProfileById } from "../../api/user.api";
import useRedirectAuth from "../../hooks/useRedirectAuth";
import ProfileCategory from "./categories";
import SocialMediaProfile from "./socialMediaAccounts";

const ViewProfile = () => {
  useRedirectAuth();

  const { id } = useParams();
  const { data: user, isLoading, error } = useGetProfileById(id);

  useEffect(() => {
    if (error) {
      toast.error("Failed to fetch profile");
    }
  }, [error]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  let role = user?.role;

  return (
    <div className="my-4">
      <section className="space-y-4">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="w-32 h-32 rounded-full overflow-hidden">
            <img
              src={user?.avatar || "/icons/profile_fallback.svg"}
              alt="profile"
              className="w-full h-full object-cover object-center"
            />
          </div>
          <p className="text-2xl font-semibold">{user?.name}</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-end justify-between">
            <h4 className="font-bold text-lg">Description</h4>
          </div>
          <p className="text-gray-500 leading-tight">
            {user?.bio || "No Bio provided"}
          </p>
        </div>
      </section>

      <hr className="my-4" />

      <section className="space-y-4">
        {role === "influencer" ? (
          <SocialMediaProfile
            socialMedia={user?.socialMedia}
            isEditable={false}
          />
        ) : (
          <ProfileCategory isEditable={false} data={user?.categories} />
        )}
      </section>
    </div>
  );
};

export default ViewProfile;
