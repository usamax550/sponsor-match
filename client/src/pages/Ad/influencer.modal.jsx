import React, { useState } from "react";
import SocialMediaCheckboxes from "../../components/socialMediaCheckboxes";
import InputButtons from "../../components/Ad/inputButtons";
import Uploader from "../../components/Ad/uploader";
import AdsPageWrapper from "./adsPageWrapper";
import Modal from "../../components/modal";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axiosInstance from "../../utils/axiosInstance";
import queryKeys from "../../utils/queryKeys";
import uploadImage from "../../utils/uploadImage";
import toast from "react-hot-toast";

const influencerSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  platforms: z.array(z.string()).min(1, "Select at least one platform"),
  thumbnail: z
    .instanceof(File, { message: "Thumbnail is required" })
    .refine((file) => file?.size <= 5000000, "Max 5MB size is allowed")
    .refine(
      (file) => ["image/jpeg", "image/jpg", "image/png"].includes(file?.type),
      "Only .jpg, .jpeg, and .png formats are supported"
    ),
  video: z
    .instanceof(File, { message: "Video is required" })
    .refine((file) => file?.size <= 50000000, "Max 50MB size is allowed")
    .refine(
      (file) => file?.type.startsWith("video/"),
      "Only video files are supported"
    ),
  platformStats: z.record(
    z.object({
      followers: z
        .string()
        .min(1, "Followers count is required")
        .refine(
          (val) => !isNaN(val) && Number(val) >= 0,
          "Followers must be a non-negative number"
        ),
      reach: z
        .string()
        .min(1, "Post reach is required")
        .refine(
          (val) => !isNaN(val) && Number(val) >= 0,
          "Reach must be a non-negative number"
        ),
    })
  ),
});

const InfluencerModal = () => {
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(influencerSchema),
    defaultValues: {
      title: "",
      description: "",
      platforms: [],
      thumbnail: null,
      video: null,
      platformStats: {},
    },
  });

  const thumbnail = watch("thumbnail");
  const video = watch("video");

  const createInfluencerAd = useMutation({
    mutationFn: async (data) => {
      const response = await axiosInstance.post(
        "/ad/influencer/create-ad",
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.getMyAdsWithoutPageKey(),
        refetchType: "all",
      });
    },
  });

  const handlePlatformSelection = (platform) => {
    setSelectedPlatforms((prev) => {
      const newPlatforms = prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform];

      setValue("platforms", newPlatforms);

      if (!newPlatforms.includes(platform)) {
        const currentStats = { ...watch("platformStats") };
        delete currentStats[platform];
        setValue("platformStats", currentStats);
      }

      return newPlatforms;
    });
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      const [thumbnailUrl, videoUrl] = await Promise.all([
        uploadImage(data.thumbnail),
        uploadImage(data.video, true),
      ]);

      // Format social platforms data
      const socialPlatforms = Object.entries(data.platformStats).map(
        ([platform, stats]) => ({
          platform,
          followers: Number(stats.followers),
          reach: Number(stats.reach),
        })
      );

      const influencerAdData = {
        title: data.title,
        description: data.description,
        thumbnailUrl,
        videoUrl,
        socialPlatforms,
      };

      await createInfluencerAd.mutateAsync(influencerAdData);
      reset();
      toast.success("Influencer ad created successfully!");
      setOpenModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create ad");
    }
  });

  return (
    <AdsPageWrapper openModal={() => setOpenModal(true)}>
      <Modal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={onSubmit}
      >
        <div className="overflow-auto h-80 scrollbar px-4">
          <div className="">
            <label htmlFor="title" className="block tracking-wide">
              Title
            </label>
            <input
              type="text"
              id="title"
              className="ad-input"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>
          <div className="space-y-3 mt-3">
            <label htmlFor="description" className="block tracking-wide">
              Description
            </label>
            <textarea
              id="description"
              className="ad-textarea"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>
          <div>
            <label className="block my-2">Social Media Platforms</label>
            <div className="flex w-[80%] gap-4 h-10">
              <SocialMediaCheckboxes
                selectedPlatforms={selectedPlatforms}
                handlePlatformSelection={handlePlatformSelection}
              />
            </div>
            {errors.platforms && (
              <p className="text-red-500 text-sm mt-1">
                {errors.platforms.message}
              </p>
            )}
          </div>
          {/* Followers & Reach info */}
          <div className="space-y-4 my-4">
            {selectedPlatforms.map((platform) => (
              <div key={platform} className="flex gap-4">
                <input
                  type="text"
                  placeholder={`${platform} Followers`}
                  className="input-box"
                  {...register(`platformStats.${platform}.followers`)}
                />
                <input
                  type="text"
                  placeholder="Post reach"
                  className="input-box"
                  {...register(`platformStats.${platform}.reach`)}
                />
              </div>
            ))}
            {errors.platformStats && (
              <p className="text-red-500 text-sm mt-1">
                Please fill in all platform statistics
              </p>
            )}
          </div>

          <div className="space-y-4 my-4">
            <Uploader
              title={"Thumbnail"}
              icon={"/icons/thumbnail.svg"}
              acceptedFiles={"image/*"}
              file={thumbnail}
              setFile={(file) => setValue("thumbnail", file)}
            />
            {errors.thumbnail && (
              <p className="text-red-500 text-sm mt-1">
                {errors.thumbnail.message}
              </p>
            )}
            <Uploader
              title={"Video"}
              icon={"/icons/video.svg"}
              acceptedFiles={"video/*"}
              file={video}
              setFile={(file) => setValue("video", file)}
            />
            {errors.video && (
              <p className="text-red-500 text-sm mt-1">
                {errors.video.message}
              </p>
            )}
          </div>
        </div>
      </Modal>
    </AdsPageWrapper>
  );
};

export default InfluencerModal;
