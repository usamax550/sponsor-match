import axiosInstance from "../utils/axiosInstance"
import queryKeys from "../utils/queryKeys";
import {useQuery} from "@tanstack/react-query"

export const useProfileInfo = () => {
    return useQuery({
      queryKey: queryKeys.getProfileKey(),
      queryFn: async () => {
        const { data } = await axiosInstance.get("/profile/get-profile-info");
        return data.user;
      },
      staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
      retryDelay: 1000 * 10,
    });
  };

  export const useGetProfileById = (userId) => {
    return useQuery({
      queryKey: queryKeys.getProfileByIdKey(userId),
      queryFn: async () => {
        const { data } = await axiosInstance.get(`/profile/get-profile/${userId}`);
        return data.data;
      },
      staleTime: 5 * 60 * 1000, 
      retryDelay: 1000 * 15,
    })
  }


export const incrementProfileViews = async (userId) => {
  try {
    const { data } = await axiosInstance.post(`/profile/increment-views/${userId}`);
    return data;
  } catch (error) {
    console.error("Error incrementing profile views:", error);
    throw error;
  }
};
