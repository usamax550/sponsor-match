import {useQuery} from '@tanstack/react-query';
import queryKeys from '../utils/queryKeys';
import axiosInstance from '../utils/axiosInstance';


export const useGetAllChats = () => {
    return useQuery({
        queryKey: queryKeys.getAllChatsKey(),
        queryFn: async () => {
            const response = await axiosInstance.get('/chat/');
            return response.data.data
        },
        staleTime: 5 * 60 * 1000
    })
}
export const getAIResponse = async(text,image) => {
    const response = await axiosInstance.post("/chat/generate-content", {
        content: {
          parts: [{ text }],
        },
      });
      return response.data.content;
}

export const sendMessage = async (recipientId, content, attachment) => {
    
    const response = await axiosInstance.post(`/chat/send-message`, {
        recipientId, content, attachment
    })      
    return response.data.data
}

export const useGetChat = (userId) => {
    return useQuery({
        queryKey: queryKeys.getChatKey(userId),
        queryFn: async () => {
            const response = await axiosInstance.get(`/chat/with/${userId}`);
            return response.data.data
        },
        staleTime: 5 * 60 * 1000,
        enabled: !!userId,
        retryDelay: (attempt) => Math.max(10 * 1000, attempt * 1000),
    })
}

export const useGetMessages = (chatId) => {
    return useQuery({
        queryKey: queryKeys.getMessageKey(chatId),
        queryFn: async () => {
            const response = await axiosInstance.get(`/chat/${chatId}/messages`);
            return response.data.data
        },
        staleTime: 5 * 60 * 1000,
        enabled: !!chatId,
    })
}

export const useGetChatCardInfo = (userId) => {
    return useQuery({
        queryKey: queryKeys.getChatCardKey(userId),
        queryFn: async () => {
            const response = await axiosInstance.get(`/chat/user-info/${userId}`)
            return response.data.data
        },
        staleTime: 5 * 60 * 1000,
        enabled: !!userId,
        retryDelay: (attempt) => Math.max(10 * 1000, attempt * 1000),
    })
}