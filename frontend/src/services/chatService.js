import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "./_axiosInstance";

// --------------------
// API Functions
// --------------------
const createRoom = async (userID) => {
   const response = await axiosInstance.post("chat/get-room/", {
      user_id: userID,
   });
   return response.data;
};

const getChatList = async () => {
   const response = await axiosInstance.get("chat/rooms/");
   return response.data;
};

const getChatHistory = async (roomName) => {
   const response = await axiosInstance.get(`chat/messages/${roomName}/`);
   return response.data;
};

// --------------------
// Custom Hooks
// --------------------
const useCreateChatRoomMutation = () => {
   return useMutation({
      mutationFn: createRoom,
      onSuccess: () => {
         console.log("Chat Room created successfully.");
      },
      onError: (error) => {
         console.error("Error creating chatRoom:", error);
      },
   });
};

const useGetChatListQuery = () => {
   return useQuery({
      queryKey: ["chat-list"],
      queryFn: getChatList,
      staleTime: 5 * 60 * 1000,
   });
};

const useGetChatHistoryQuery = (roomName) => {
   return useQuery({
      queryKey: ["chat-history", roomName],
      queryFn: () => getChatHistory(roomName),
      enabled: !!roomName,
      staleTime: 5 * 60 * 1000,
   });
};

export {
   useCreateChatRoomMutation,
   useGetChatListQuery,
   useGetChatHistoryQuery,
};
