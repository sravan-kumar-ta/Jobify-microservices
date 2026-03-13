import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
   HiArrowLeft,
   HiDocumentText,
   HiDownload,
   HiChat,
   HiCheckCircle,
   HiXCircle,
   HiClock,
} from "react-icons/hi";
import {
   useUpdateApplicationMutation,
   useUserResumeQuery,
} from "../../services/companyService";
import { useUsernames } from "../../services/authService";
import { useCreateChatRoomMutation } from "../../services/chatService";

const STATUS_CONFIG = {
   pending: {
      label: "Pending",
      badge: "bg-amber-50 text-amber-700 border-amber-200",
      icon: HiClock,
   },
   accepted: {
      label: "Accepted",
      badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: HiCheckCircle,
   },
   rejected: {
      label: "Rejected",
      badge: "bg-rose-50 text-rose-700 border-rose-200",
      icon: HiXCircle,
   },
};

const Applicant = ({ application, setApplication, jobID }) => {
   const [status, setStatus] = useState(application.status);
   const [selectedResumeId, setSelectedResumeId] = useState(null);
   const [resumeURL, setResumeURL] = useState(null);
   const [updateLoading, setUpdateLoading] = useState(false);

   const navigate = useNavigate();

   const prevStatus = application.status;
   const newStatus = status;

   const createChatMutation = useCreateChatRoomMutation();

   const { data: usernames, isLoading: usernameLoading } = useUsernames([
      application.applicant_id,
   ]);

   const { mutate } = useUpdateApplicationMutation(
      jobID,
      prevStatus,
      newStatus,
   );

   const {
      data,
      isLoading: resumeIsLoading,
      error,
   } = useUserResumeQuery(selectedResumeId, {
      skip: !selectedResumeId,
   });

   useEffect(() => {
      setStatus(application.status);
      setSelectedResumeId(null);
      setResumeURL(null);
   }, [application]);

   useEffect(() => {
      if (!selectedResumeId) return;

      if (data?.resume) {
         setResumeURL(data.resume);
         window.open(data.resume, "_blank", "noopener,noreferrer");
      }
   }, [selectedResumeId, data]);

   const handleStatusChange = (nextStatus) => {
      setStatus(nextStatus);
   };

   const handleUpdate = () => {
      if (status === application.status) return;

      setUpdateLoading(true);

      mutate(
         { id: application.id, data: { status } },
         {
            onSuccess: () => {
               setUpdateLoading(false);
            },
            onError: () => {
               setUpdateLoading(false);
            },
         },
      );
   };

   const openResume = (resumeId) => {
      if (!resumeId) return;
      setSelectedResumeId(resumeId);
   };

   const handleChat = () => {
      createChatMutation.mutate(application.applicant_id, {
         onSuccess: (data) => {
            navigate(
               `/company/chat/${data.room_name}/${application.applicant_id}`,
            );
         },
         onError: (error) => {
            console.error("Error creating chat room:", error);
         },
      });
   };

   const displayName = usernameLoading
      ? "Loading..."
      : usernames?.[0]?.username || application.applicant_id?.slice(0, 8);

   const initials = displayName?.slice(0, 2)?.toUpperCase() || "AP";

   return (
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
         {/* Header */}
         <div className="flex items-center justify-between px-6 pt-4 border-b border-slate-100">
            <div className="flex items-center gap-3 min-w-0">
               <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold bg-indigo-100 text-indigo-600 shrink-0">
                  {initials}
               </div>

               <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-slate-800 truncate">
                     {displayName}
                  </h3>
               </div>
            </div>

            <button
               onClick={() => setApplication(null)}
               className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 border-none px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
            >
               <HiArrowLeft className="w-3.5 h-3.5" />
               Close
            </button>
         </div>

         {/* Body */}
         <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
            {/* Resume */}
            <div>
               <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">
                  Resume
               </p>

               <div className="flex items-center justify-between gap-3 bg-indigo-50/60 border border-indigo-100 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                     <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
                        <HiDocumentText className="w-4 h-4 text-indigo-500" />
                     </div>

                     <div className="min-w-0">
                        <p className="text-xs font-medium text-slate-700 truncate">
                           Resume Document
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                           PDF Document
                        </p>
                     </div>
                  </div>

                  {resumeIsLoading ? (
                     <span className="text-xs text-slate-500 shrink-0">
                        Loading...
                     </span>
                  ) : error ? (
                     <span className="text-xs text-rose-500 shrink-0">
                        Resume unavailable
                     </span>
                  ) : resumeURL ? (
                     <a
                        href={resumeURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 bg-indigo-100 hover:bg-indigo-200 px-3 py-1.5 rounded-lg transition-colors shrink-0 no-underline"
                     >
                        <HiDownload className="w-3.5 h-3.5" />
                        Open
                     </a>
                  ) : (
                     <button
                        onClick={() => openResume(application.resume_id)}
                        className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 bg-indigo-100 hover:bg-indigo-200 border-none px-3 py-1.5 rounded-lg cursor-pointer transition-colors shrink-0"
                     >
                        <HiDownload className="w-3.5 h-3.5" />
                        Open
                     </button>
                  )}
               </div>
            </div>

            {/* Cover letter */}
            <div>
               <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">
                  Cover Letter
               </p>

               <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                     {application.cover_letter || "No cover letter added."}
                  </p>
               </div>
            </div>

            {/* Status selector */}
            <div>
               <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">
                  Update Status
               </p>

               <div className="flex flex-col sm:flex-row gap-2">
                  {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
                     const Icon = cfg.icon;

                     return (
                        <button
                           key={key}
                           onClick={() => handleStatusChange(key)}
                           className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer
                           ${
                              status === key
                                 ? `${cfg.badge} border-current font-semibold`
                                 : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
                           }`}
                        >
                           <Icon className="w-3.5 h-3.5" />
                           {cfg.label}
                        </button>
                     );
                  })}
               </div>

               <button
                  onClick={handleUpdate}
                  disabled={updateLoading || status === application.status}
                  className="w-full mt-3 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold border-none cursor-pointer shadow-sm shadow-indigo-200 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
               >
                  {updateLoading ? "Updating..." : "Save Status"}
               </button>
            </div>

            {/* Chat */}
            <button
               onClick={handleChat}
               disabled={createChatMutation.isPending}
               className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold border-none cursor-pointer transition-all mt-auto disabled:opacity-70 disabled:cursor-not-allowed"
            >
               <HiChat className="w-4 h-4" />
               {createChatMutation.isPending
                  ? "Opening chat..."
                  : "Chat with applicant"}
            </button>
         </div>
      </div>
   );
};

export default Applicant;
