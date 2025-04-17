import React, { useState } from "react";
import { toast } from "react-hot-toast";
import Modal from "../../components/modal";
import { useAuth } from "../../context/auth.context";
import useRedirectAuth from "../../hooks/useRedirectAuth";
import axiosInstance from "../../utils/axiosInstance";
import uploadImage from "../../utils/uploadImage";
import ProfileCategory from "./categories";
import SocialMediaProfile from "./socialMediaAccounts";

const Profile = () => {
  useRedirectAuth();

  const { user, isLoading, setUser } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [showAvatarConfirm, setShowAvatarConfirm] = useState(false);

  const handleAvatarSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedAvatar(file);
      setShowAvatarConfirm(true);
    }
    event.target.value = "";
  };

  const handleAvatarUpdate = async () => {
    try {
      const avatarUrl = await uploadImage(selectedAvatar);
      const response = await axiosInstance.put("/profile/update-profile", {
        avatar: avatarUrl,
      });
      setUser(response?.data?.user);
      setShowAvatarConfirm(false);
      setSelectedAvatar(null);
      toast.success("Profile picture updated successfully!");
    } catch (error) {
      console.log(error);
      toast.error("Failed to update profile picture");
    }
  };

  const handleUpdateProfile = async () => {
    console.log("object: ", formData);
    if(!formData.name) return toast.error("Name is required")
    try {
      const response = await axiosInstance.put(
        "/profile/update-profile",
        formData
      );
      setUser(response?.data?.data);
      console.log("object: ", response?.data?.data);
      setIsEditModalOpen(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handleEditModalClose = () => {
    setFormData({ name: user?.name || "", bio: user?.bio || "" });
    setIsEditModalOpen(false);
  };

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
              src={
                selectedAvatar
                  ? URL.createObjectURL(selectedAvatar)
                  : user?.avatar || "/icons/profile_fallback.svg"
              }
              alt="profile"
              className="w-full h-full object-cover object-center"
            />
          </div>
          <p className="text-2xl font-semibold">{user?.name}</p>
          <label
            role="button"
            htmlFor="profile-update-img"
            className="text-primary text-sm cursor-pointer"
          >
            Update/Change {role === "brand" ? "Brand Logo" : "Profile Picture"}
          </label>
          <input
            type="file"
            id="profile-update-img"
            className="hidden"
            onChange={handleAvatarSelect}
          />
          <Modal
            isOpen={showAvatarConfirm}
            onClose={() => {
              setShowAvatarConfirm(false);
              setSelectedAvatar(null);
            }}
            title="Update Profile Picture"
            saveText="Update"
            onSubmit={handleAvatarUpdate}
          >
            <div className="text-center space-y-4">
              <div className="w-32 h-32 mx-auto rounded-full overflow-hidden">
                <img
                  src={
                    selectedAvatar
                      ? URL.createObjectURL(selectedAvatar)
                      : "/icons/profile_fallback.svg"
                  }
                  alt="New profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <p>Do you want to update your profile picture?</p>
            </div>
          </Modal>
        </div>

        <div className="space-y-4">
          <div className="flex items-end justify-between">
            <h4 className="font-bold text-lg">Description</h4>
            <button
              className="flex flex-col items-center justify-center"
              onClick={() => setIsEditModalOpen(true)}
            >
              <img src="/icons/edit.svg" alt="Edit" />
              <span className="text-sm text-primary">Edit</span>
            </button>
            <Modal
              isOpen={isEditModalOpen}
              onClose={handleEditModalClose}
              saveText={"Save"}
              title={`Edit ${role === "brand" ? "Brand" : "Profile"} Info`}
              onSubmit={handleUpdateProfile}
            >
              <div className="space-y-4">
                <div className="">
                  <label htmlFor="name" className="block tracking-wide">
                    {user?.role === "brand" ? "Brand Name" : "Name"}
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="ad-input"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-3">
                  <label htmlFor="bio" className="block tracking-wide">
                    Description
                  </label>
                  <textarea
                    id="bio"
                    className="ad-textarea scrollbar pr-1"
                    value={formData.bio}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
              </div>
            </Modal>
          </div>
          <p className="text-gray-500 leading-tight">
            {user?.bio || "No Bio provided"}
          </p>
        </div>
      </section>

      <hr className="my-4" />

      <section className="space-y-4">
        {role === "influencer" ? (
          <SocialMediaProfile socialMedia={user?.socialMedia} />
        ) : (
          <ProfileCategory />
        )}
      </section>
    </div>
  );
};

export default Profile;
