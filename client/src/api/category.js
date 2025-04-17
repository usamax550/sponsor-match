import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../utils/axiosInstance"
import queryKeys from "../utils/queryKeys";


const fetchCategories = async () => {
    const {data} = await axiosInstance.get('/category/get-categories');
    return data.categories;
}


export const useCategories = () => {
    return useQuery({
        queryKey: queryKeys.getCategoryKey(),
        queryFn: fetchCategories,
        staleTime: 1000 * 60 * 60 * 24,
    })
}