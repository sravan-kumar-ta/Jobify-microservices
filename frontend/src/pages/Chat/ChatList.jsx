import { useGetChatListQuery } from "../../services/chatService";
import { useUsernames } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { HiChatAlt2 } from "react-icons/hi";

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

// ── Skeleton Item ───────────────────────────────────────────────
function ChatListSkeleton() {
   return (
      <div className="px-4 py-4 flex items-center gap-3 animate-pulse">
         <div className="w-10 h-10 rounded-xl bg-slate-200" />
         <div className="flex-1">
            <div className="h-3 w-28 bg-slate-200 rounded mb-2" />
            <div className="h-2.5 w-40 bg-slate-100 rounded" />
         </div>
         <div className="h-2.5 w-10 bg-slate-100 rounded" />
      </div>
   );
}

// ── Chat Item ───────────────────────────────────────────────────
function ChatListItem({ chat, user, onOpen }) {
   const username = user?.username || "Unknown User";
   const initials = username?.[0]?.toUpperCase() || "U";

   const formattedTime = chat.last_message_time
      ? new Date(chat.last_message_time).toLocaleTimeString("en-IN", {
           hour: "2-digit",
           minute: "2-digit",
           hour12: true,
        })
      : "";

   return (
      <button
         onClick={() => onOpen(chat.room_id, chat.user_id)}
         className="w-full flex items-center gap-3 px-4 py-4 border-none bg-transparent hover:bg-slate-50 cursor-pointer text-left transition-colors"
      >
         <Avatar initials={initials} />

         <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-0.5">
               <p className="text-sm font-semibold text-slate-700 truncate">
                  {username}
               </p>

               {formattedTime && (
                  <span className="text-xs text-slate-400 flex-shrink-0 ml-2">
                     {formattedTime}
                  </span>
               )}
            </div>

            <p className="text-xs text-slate-500 truncate">
               {chat.last_message || "Start conversation"}
            </p>
         </div>
      </button>
   );
}

// ── Main Page ───────────────────────────────────────────────────
const ChatList = () => {
   const navigate = useNavigate();

   const {
      data: chatList = [],
      isLoading: isChatListLoading,
      isError: isChatListError,
   } = useGetChatListQuery();

   const chatUserIds = chatList.map((item) => item.user_id);

   const {
      data: usernames = [],
      isLoading: isUsernamesLoading,
      isError: isUsernamesError,
   } = useUsernames(chatUserIds);

   const usernameMap = Object.fromEntries(
      usernames.map((user) => [user.id, user]),
   );

   const handleOpenChat = (roomId, userId) => {
      // Better: navigate(`/chat/${roomId}/${userId}`);
      navigate(`${roomId}/${userId}`);
   };

   const isLoading = isChatListLoading || isUsernamesLoading;
   const isError = isChatListError || isUsernamesError;

   return (
      <div className="min-h-screen bg-slate-50 px-4 sm:px-6 py-8">
         <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="mb-6">
               <h1
                  className="text-2xl font-bold text-slate-800 mb-1"
                  style={{ fontFamily: "'Fraunces', serif" }}
               >
                  Messages
               </h1>
               <p className="text-sm text-slate-500">
                  Conversations with applicants and companies.
               </p>
            </div>

            {/* Chat Card */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden divide-y divide-slate-100">
               {/* Card top bar */}
               <div className="px-4 py-4 border-b border-slate-100 flex items-center gap-2 bg-white">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center">
                     <HiChatAlt2 className="w-5 h-5 text-indigo-500" />
                  </div>
                  <div>
                     <p className="text-sm font-semibold text-slate-800">
                        Chats
                     </p>
                     <p className="text-xs text-slate-500">
                        {chatList.length} conversation
                        {chatList.length !== 1 ? "s" : ""}
                     </p>
                  </div>
               </div>

               {/* Loading */}
               {isLoading && (
                  <>
                     {Array(5)
                        .fill(null)
                        .map((_, index) => (
                           <ChatListSkeleton key={index} />
                        ))}
                  </>
               )}

               {/* Error */}
               {!isLoading && isError && (
                  <div className="p-6 text-center">
                     <p className="text-sm font-medium text-red-500">
                        Failed to load chats.
                     </p>
                     <p className="text-xs text-slate-400 mt-1">
                        Please refresh and try again.
                     </p>
                  </div>
               )}

               {/* Empty */}
               {!isLoading && !isError && chatList.length === 0 && (
                  <div className="py-12 px-6 text-center">
                     <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-4">
                        <HiChatAlt2 className="w-6 h-6 text-indigo-400" />
                     </div>
                     <p className="text-sm font-semibold text-slate-700">
                        No chats yet
                     </p>
                     <p className="text-xs text-slate-400 mt-1">
                        Start a conversation from an applicant or company page.
                     </p>
                  </div>
               )}

               {/* List */}
               {!isLoading &&
                  !isError &&
                  chatList.length > 0 &&
                  chatList.map((chat) => {
                     const user = usernameMap[chat.user_id];

                     return (
                        <ChatListItem
                           key={chat.room_id}
                           chat={chat}
                           user={user}
                           onOpen={handleOpenChat}
                        />
                     );
                  })}
            </div>
         </div>
      </div>
   );
};

export default ChatList;
