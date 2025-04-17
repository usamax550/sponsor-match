import React, { useState } from "react";
import Uploader from "../../components/Ad/uploader";
import Modal from "../../components/modal";
import { useAuth } from "../../context/auth.context";
import axiosInstance from "../../utils/axiosInstance";
import uploadImage from "../../utils/uploadImage";

const SocialMediaProfile = ({ socialMedia = [], isEditable = true }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const { setUser } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    reach: "",
    screenshot: null,
    followers: "",
  });

  const platforms = {
    insta: {
      name: "insta",
      icon: "/images/insta.png",
    },
    facebook: {
      name: "facebook",
      icon: "/images/facebook.png",
    },
    tiktok: {
      name: "tiktok",
      icon: "/images/tiktok.png",
    },
    youtube: {
      name: "youtube",
      icon: "/images/youtube.png",
    },
  };

  const connectedPlatforms = socialMedia.map((account) => account.platform);

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setSelectedPlatform(null);
    setIsEditing(false);
    setFormData({ username: "", reach: "", screenshot: null,followers:"" });
  };

  const handleAddAccount = (platform) => {
    setSelectedPlatform(platform);
    setIsEditing(false);
    setFormData({ username: "", reach: "", screenshot: null ,followers:""});
    setIsEditModalOpen(true);
  };

  const handleEditAccount = (account) => {
    setSelectedPlatform(account.platform);
    setIsEditing(true);
    setFormData({
      username: account.username || "",
      reach: account.reach || "",
      screenshot: account.screenshot || null,
      followers: account.followers || "",
    });
    setIsEditModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      let screenshotUrl = formData.screenshot;

      // Upload new screenshot if it's a File object
      if (formData.screenshot instanceof File) {
        screenshotUrl = await uploadImage(formData.screenshot);
      }

      const updatedSocialMedia = isEditing
        ? socialMedia.map((account) =>
            account.platform === selectedPlatform
              ? {
                  platform: selectedPlatform,
                  username: formData.username,
                  reach: formData.reach,
                  screenshot: screenshotUrl,
                  followers: formData.followers, 

                }
              : account
          )
        : [
            ...socialMedia,
            {
              platform: selectedPlatform,
              username: formData.username,
              reach: formData.reach,
              screenshot: screenshotUrl,
              followers: formData.followers,

            },
          ];

      const response = await axiosInstance.put("/profile/update-profile", {
        socialMedia: updatedSocialMedia,
      });

      setUser(response.data.data);
      handleEditModalClose();
      toast.success(
        `Successfully ${isEditing ? "updated" : "added"} ${
          platforms[selectedPlatform].name
        } account!`
      );
    } catch (error) {
      console.log(error);

      toast.error(
        `Failed to ${isEditing ? "update" : "add"} social media account`
      );
    }
  };

  return (
    <>
      <div className="">
        <h4 className="font-bold text-lg">Social Media Accounts</h4>
      </div>
      <ul className="flex gap-4 flex-wrap max-sm:flex-col">
        {socialMedia &&
          socialMedia.map((account) => (
            <li
            key={account.platform}
            className="bg-cardBg border rounded-md flex gap-2 p-2 relative"
            >
              {isEditable && (
                <button
                  onClick={() => handleEditAccount(account)}
                  className="absolute top-2 right-2 p-1 bg-gray-100 rounded-full hover:bg-gray-200"
                >
                  <img src="/icons/edit.svg" alt="Edit" className="w-4 h-4" />
                </button>
              )}
              <img
                src={account.screenshot || "/images/fallback.png"}
                alt={account.platform}
                className="w-20 object-cover"
              />
              <div className="space-y-2">
                <div className="flex gap-2">
                  <img
                    src={`/images/${account.platform}.png`}
                    alt={account.platform}
                    className="w-5"
                  />
                  <p className="social-profile-tag">
                    {account.username ? "@" + account.username : ""}
                  </p>
                </div>
                <p className="text-sm text-gray-500">Reach: {account.reach}</p>
                <p className="text-sm text-gray-500">Followers: {account.followers}</p>
              </div>
            </li>
          ))}

        {isEditable &&
          Object.entries(platforms).map(
            ([key, platform]) =>
              !connectedPlatforms.includes(key) && (
                <li key={key} className="social-profile-item">
                  <img src={platform.icon} alt={platform.name} />
                  <span
                    className="social-profile-add"
                    onClick={() => handleAddAccount(key)}
                  >
                    + Add your account
                  </span>
                </li>
              )
          )}

        <Modal
          isOpen={isEditModalOpen}
          onClose={handleEditModalClose}
          title={`${isEditing ? "Edit" : "Add"} ${
            selectedPlatform ? platforms[selectedPlatform].name : ""
          } Account`}
          saveText={isEditing ? "Save Changes" : "Add Account"}
          onSubmit={handleSubmit}
        >
          <div className="my-2 space-y-4">
            <div>
              <label htmlFor="username" className="block tracking-wide">
                Username
              </label>
              <input
                type="text"
                id="username"
                className="ad-input"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                placeholder="Enter your username"
              />
            </div>
            <div>
              <label htmlFor="reach" className="block tracking-wide">
                Reach
              </label>
              <input
                type="text"
                id="reach"
                className="ad-input"
                placeholder="Audience Reach"
                value={formData.reach}
                onChange={(e) =>
                  setFormData({ ...formData, reach: e.target.value })
                }
              />
            </div>
            <div>
              <label htmlFor="followers" className="block tracking-wide">
              Audience 
              </label>
              <input
                type="text"
                id="followers"
                className="ad-input"
                placeholder="Followers"
                value={formData.followers}
                onChange={(e) =>
                  setFormData({ ...formData, followers: e.target.value })
                }
              />
            </div>
            <Uploader
              icon={"/icons/thumbnail.svg"}
              title={"Screenshot"}
              acceptedFiles={"image/*"}
              file={formData.screenshot}
              setFile={(file) => setFormData({ ...formData, screenshot: file })}
            />
          </div>
        </Modal>
      </ul>
    </>
  );
};

export default SocialMediaProfile;
