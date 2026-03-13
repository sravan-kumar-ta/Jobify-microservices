import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HiArrowLeft, HiPaperAirplane } from "react-icons/hi";

import { useGetChatHistoryQuery } from "../../services/chatService";
import { useUsernames, useGetUserQuery } from "../../services/authService";

// ── Avatar ──────────────────────────────────────────────────────
function Avatar({ initials, size = "md" }) {
   const sz =
      size === "lg"
         ? "w-11 h-11 text-sm"
         : size === "sm"
           ? "w-7 h-7 text-xs"
           : "w-10 h-10 text-sm";

   return (
      <div className="relative flex-shrink-0">
         <div
            className={`${sz} rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold`}
         >
            {initials}
         </div>
      </div>
   );
}

const WS_BASE = import.meta.env.VITE_WEBSOCKET_URL;

const ChatRoomPage = () => {
   const navigate = useNavigate();
   const { roomID, userID } = useParams();

   const { data: currentUser } = useGetUserQuery();
   const { data: usernames = [], isLoading: isUserLoading } = useUsernames([
      userID,
   ]);
   const { data: history = [], isLoading: isHistoryLoading } =
      useGetChatHistoryQuery(roomID);

   const [messages, setMessages] = useState([]);
   const [input, setInput] = useState("");

   const socketRef = useRef(null);
   const bottomRef = useRef(null);

   // Load initial history
   useEffect(() => {
      setMessages(history);
   }, [history]);

   // Open websocket
   useEffect(() => {
      const token = localStorage.getItem("access_token");

      if (!token || !roomID) return;

      const socket = new WebSocket(`${WS_BASE}${roomID}/?token=${token}`);
      socketRef.current = socket;

      socket.onopen = () => {
         console.log("WebSocket connected");
      };

      socket.onmessage = (event) => {
         const data = JSON.parse(event.data);

         setMessages((prev) => {
            const exists = prev.some((msg) => msg.id === data.id);
            if (exists) return prev;
            return [...prev, data];
         });
      };

      socket.onclose = () => {
         console.log("WebSocket disconnected");
      };

      socket.onerror = (error) => {
         console.error("WebSocket error:", error);
      };

      return () => {
         socket.close();
      };
   }, [roomID]);

   // Auto-scroll
   useEffect(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
   }, [messages]);

   const handleSend = () => {
      if (
         !socketRef.current ||
         socketRef.current.readyState !== WebSocket.OPEN ||
         !input.trim()
      ) {
         return;
      }

      socketRef.current.send(
         JSON.stringify({
            text: input.trim(),
         }),
      );

      setInput("");
   };

   const handleKeyDown = (e) => {
      if (e.key === "Enter") {
         e.preventDefault();
         handleSend();
      }
   };

   const otherUser = usernames[0];
   const currentUserId = currentUser?.id;

   return (
      <div className="h-[calc(100vh-64px)] max-w-2xl mx-auto bg-gray-50 flex flex-col">
         {/* Header */}
         <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
            <button
               onClick={() => navigate(-1)}
               className="p-2 rounded-lg hover:bg-gray-100"
            >
               <HiArrowLeft className="w-5 h-5 text-gray-700" />
            </button>

            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold">
               {(otherUser?.username || "U")[0]?.toUpperCase()}
            </div>

            <div>
               <p className="text-sm font-semibold text-gray-900">
                  {isUserLoading ? "Loading..." : otherUser?.username || "User"}
               </p>
               <p className="text-xs text-gray-500">Private chat</p>
            </div>
         </div>

         {/* Messages */}
         <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {isHistoryLoading ? (
               <p className="text-sm text-gray-500">Loading messages...</p>
            ) : messages.length === 0 ? (
               <p className="text-sm text-gray-500 text-center mt-8">
                  No messages yet. Start the conversation.
               </p>
            ) : (
               messages.map((msg) => {
                  const isMe = String(msg.sender_id) === String(currentUserId);

                  return (
                     <div
                        key={msg.id}
                        className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                     >
                        <div
                           className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${
                              isMe
                                 ? "bg-blue-600 text-white rounded-br-sm"
                                 : "bg-white border border-gray-200 text-gray-900 rounded-bl-sm"
                           }`}
                        >
                           <p>{msg.text}</p>
                           <p
                              className={`text-[10px] mt-1 ${
                                 isMe ? "text-blue-100" : "text-gray-400"
                              }`}
                           >
                              {new Date(msg.timestamp).toLocaleTimeString(
                                 "en-IN",
                                 {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                 },
                              )}
                           </p>
                        </div>
                     </div>
                  );
               })
            )}

            <div ref={bottomRef} />
         </div>

         {/* Input */}
         <div className="bg-white border-t border-gray-200 p-3">
            <div className="flex items-center gap-2">
               <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full outline-none focus:border-blue-500"
               />

               <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                     input.trim()
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
               >
                  <HiPaperAirplane className="w-4 h-4 rotate-90" />
               </button>
            </div>
         </div>
      </div>
   );
};

export default ChatRoomPage;
