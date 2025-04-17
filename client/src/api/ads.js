import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../utils/axiosInstance";
import queryKeys from "../utils/queryKeys";




export const incrementCount = async (adId, type, isBrand) => {
  try { 
    const route = isBrand
      ? `/ad/brand/increment-influencer-count/${adId}`
      : `/ad/influencer/increment-brand-count/${adId}`;

    const response = await axiosInstance.post(route, { type });
  } catch (err) {
    console.error("Failed to increment count", err);
  }
};



export const getAdsByUserId = async ({ userId, role }) => {
  try {
    let endpoint = "";

    if (role.toUpperCase() === "BRAND") {
      endpoint = `/ad/brand/get-ads/${userId}`;
    } else if (role.toUpperCase() === "INFLUENCER") {
      endpoint = `/ad/influencer/get-ads/${userId}`;
    } else {
      throw new Error("Invalid role");
    }

    const res = await axiosInstance.get(endpoint);
    return res.data.data;
  } catch (error) {
    console.error("Error fetching ads by userId:", error);
    throw error;
  }
};



const fetchMyAds = async (page) => {
    const response = await axiosInstance.get(`/ad/my-ads?page=${page}`);
    return response.data;
};

export const useGetMyAds = (role, page = 1) => {
    return useQuery({
        queryKey: queryKeys.getMyAdsKey(role, page),
        queryFn: () => fetchMyAds(page),
        staleTime: 5 * 60 * 1000,
    });
};

export const useGetBrandAds = (page = 1, category = '', search = '') => {
    return useQuery({
        queryKey: queryKeys.getBrandAds(page,category, search),
        queryFn: async () => {
            const response = await axiosInstance.get(`/ad/brand/ads?page=${page}&category=${encodeURIComponent(category)}&search=${encodeURIComponent(search)}`);
            if (response.data?.data?.length > 0) {
                for (const ad of response?.data?.data) {
                    const titleMatch = search && (search?.trim().toUpperCase() === ad?.name?.trim().toUpperCase());
                    const categoryMatch = !search && category && (category?.trim().toUpperCase() === ad?.productCategory?.trim().toUpperCase());
                    if (titleMatch || categoryMatch) {
                        await incrementCount(ad?._id,"search", false);
                    }
                }
            }
            return response.data;
        },
        staleTime: 2 * 60 * 1000,
    });
};

export const useGetInfluencerAds = (page = 1, search ='', filters) => {
    return useQuery({
        queryKey: queryKeys.getInfluencerAds(page, search, filters),
        queryFn: async () => {
            const response = await axiosInstance.get(`/ad/influencer/ads`, {
                params: {
                    page, ...filters, search
                }
            });
            if (search) {
                for (const ad of response.data.data) {
                    if (search.toUpperCase() === ad.title.toUpperCase()) {
                        await incrementCount(ad._id, "search", true);
                    }
                }
            }
            return response.data;
        },
        staleTime: 2 * 60 * 1000,
    });
};


export const useGetAdById = (adId) => {
    return useQuery({
        queryKey: queryKeys.getAdById(adId),
        queryFn: async () => {
            const response = await axiosInstance.get(`/ad/${adId}`);
            return response.data.data;
        },
        staleTime: 2 * 60 * 1000,
        enabled: !!adId,
    })
}