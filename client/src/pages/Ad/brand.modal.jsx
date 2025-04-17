import React, { useState } from "react";
import Uploader from "../../components/Ad/uploader";
import UploadLogo from "../../components/brandLogoUpload";
import { useCategories } from "../../api/category";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../utils/axiosInstance";
import AdsPageWrapper from "./adsPageWrapper";
import Modal from "../../components/modal";
import uploadImage from "../../utils/uploadImage";
import toast from "react-hot-toast";
import queryKeys from "../../utils/queryKeys";
import { useAuth } from "../../context/auth.context";

const brandSchema = z.object({
  brandName: z.string().min(1, "Brand name must be at least 1 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Please select a category"),
  logo: z
    .instanceof(File, { message: "Brand logo is required" })
    .refine((file) => file?.size <= 5000000, "Max 5MB size is allowed")
    .refine(
      (file) => ["image/jpeg", "image/jpg", "image/png"].includes(file?.type),
      "Only .jpg, .jpeg, and .png formats are supported"
    ),
  thumbnail: z
    .instanceof(File, { message: "Thumbnail image is required" })
    .refine((file) => file?.size <= 5000000, "Max 5MB size is allowed")
    .refine(
      (file) => ["image/jpeg", "image/jpg", "image/png"].includes(file?.type),
      "Only .jpg, .jpeg, and .png formats are supported"
    ),
});

const BrandModal = () => {
  const { user } = useAuth();
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
    resolver: zodResolver(brandSchema),
    defaultValues: {
      brandName: "",
      description: "",
      category: "",
      logo: null,
      thumbnail: null,
    },
  });

  const logo = watch("logo");
  const thumbnail = watch("thumbnail");

  const createBrandAd = useMutation({
    mutationFn: async (data) => {
      const response = await axiosInstance.post("/ad/brand/create-ad", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.getMyAdsWithoutPageKey(),
        refetchType: "all",
      });
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      // Upload images to Cloudinary
      const [logoUrl, thumbnailUrl] = await Promise.all([
        uploadImage(data.logo),
        uploadImage(data.thumbnail),
      ]);

      // Prepare data for API
      const brandAdData = {
        name: data.brandName,
        description: data.description,
        productCategory: data.category,
        brandLogoUrl: logoUrl,
        thumbnail: thumbnailUrl,
      };

      const result = await createBrandAd.mutateAsync(brandAdData);
      reset();
      toast.success("Brand ad created successfully!");
      setOpenModal(false);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to create brand ad");
    }
  });

  return (
    <AdsPageWrapper openModal={() => setOpenModal(true)}>
      <Modal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={onSubmit}
      >
        <div className="overflow-auto h-80 scrollbar p-4 space-y-3">
          <div className="">
            <label htmlFor="title" className="block tracking-wide">
              Brand Name
            </label>
            <input
              type="text"
              id="title"
              className="ad-input"
              {...register("brandName")}
            />
            {errors.brandName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.brandName.message}
              </p>
            )}
          </div>
          <div className="space-y-3">
            <label htmlFor="brand-logo-upload">Brand Logo</label>
            <UploadLogo
              selectedFile={logo}
              setSelectedFile={(file) => setValue("logo", file)}
            />
            {errors.logo && (
              <p className="text-red-500 text-sm mt-1">{errors.logo.message}</p>
            )}
          </div>
          <div className="space-y-3">
            <label htmlFor="description" className="block tracking-wide">
              Description
            </label>
            <textarea
              id="description"
              className="ad-textarea"
              {...register("description")}
            ></textarea>
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>
          <div>
            <select
              id="ad-create-categories"
              {...register("category")}
              className="w-full bg-[#F1EFEF] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
            >
              <option value="" hidden>
                Category
              </option>
              {user?.categories?.map((cat, ind) => (
                <option value={cat} key={ind}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">
                {errors.category.message}
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
          </div>
        </div>
      </Modal>
    </AdsPageWrapper>
  );
};

export default BrandModal;
