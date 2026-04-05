import { useState } from "react";
import {
   HiCheckCircle,
   HiDocumentText,
   HiPaperAirplane,
   HiSparkles,
} from "react-icons/hi";
import { IoCloseSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

import {
   useCreateApplicationMutation,
   useFetchResumesQuery,
} from "../../services/seekerService";

import ResumeOptionSkeleton from "../company/skeletons/ResumeOptionSkeleton";
import { useGenerateCoverLetter } from "../../services/AIService";

const ResumeOption = ({ resume, isSelected, onSelect }) => (
   <label
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all ${
         isSelected
            ? "border-indigo-400 bg-indigo-50"
            : "border-slate-200 bg-slate-50 hover:border-indigo-200 hover:bg-indigo-50/40"
      }`}
   >
      <input
         type="radio"
         name="resume_id"
         value={resume.id}
         checked={isSelected}
         onChange={() => onSelect(resume.id)}
         className="accent-indigo-500 w-4 h-4 shrink-0"
      />

      <div
         className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
            isSelected ? "bg-indigo-100" : "bg-slate-200"
         }`}
      >
         <HiDocumentText
            className={`w-4 h-4 ${
               isSelected ? "text-indigo-500" : "text-slate-400"
            }`}
         />
      </div>

      <div className="flex-1 min-w-0">
         <p
            className={`text-xs font-semibold truncate ${
               isSelected ? "text-indigo-700" : "text-slate-700"
            }`}
         >
            {resume.resume_title}
         </p>
      </div>

      {isSelected && (
         <HiCheckCircle className="w-4 h-4 text-indigo-500 shrink-0" />
      )}
   </label>
);

const JobApply = ({ job, setShowApply, setIsApplying }) => {
   const navigate = useNavigate();

   const [selectedResume, setSelectedResume] = useState("");
   const [coverLetter, setCoverLetter] = useState("");
   const [applied, setApplied] = useState(false);

   const { data: resumes, isLoading: isResumesLoading } =
      useFetchResumesQuery();

   const {
      mutate: createApplication,
      isPending: isApplyingMutation,
      isError: isApplyError,
      error: applyError,
   } = useCreateApplicationMutation();

   const {
      mutate: generateCoverLetter,
      isPending: isGeneratingCoverLetter,
      isError: isGenerateError,
      error: generateError,
      reset: resetGenerateState,
   } = useGenerateCoverLetter();

   const handleGenerateCoverLetter = () => {
      if (!selectedResume || isGeneratingCoverLetter) return;

      resetGenerateState();

      generateCoverLetter(
         {
            resume_id: selectedResume,
            job_id: job?.id,
         },
         {
            onSuccess: (response) => {
               // Adjust this based on your backend response shape
               const generatedText =
                  response?.cover_letter ||
                  response?.data?.cover_letter ||
                  response?.generated_cover_letter ||
                  response?.content ||
                  response?.message ||
                  "";

               setCoverLetter(generatedText);
            },
         },
      );
   };

   const handleApply = () => {
      if (!selectedResume || !coverLetter.trim() || isApplyingMutation) return;

      createApplication(
         {
            resume_id: selectedResume,
            cover_letter: coverLetter.trim(),
            job: job.id,
         },
         {
            onSuccess: () => {
               setApplied(true);

               // Support both parent prop names safely
               if (typeof setShowApply === "function") {
                  setTimeout(() => setShowApply(false), 800);
               }

               if (typeof setIsApplying === "function") {
                  setTimeout(() => setIsApplying(false), 800);
               }

               // Keep your old behavior if needed
               setTimeout(() => navigate("/"), 800);
            },
         },
      );
   };

   const isSubmitDisabled =
      isApplyingMutation ||
      isGeneratingCoverLetter ||
      !selectedResume ||
      !coverLetter.trim();

   return (
      <div
         id="apply-section"
         className="relative bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden fade-in lg:w-96 xl:w-105 w-full shrink-0"
      >
         <IoCloseSharp
            className="absolute right-4 top-4 text-red-700 cursor-pointer"
            onClick={() => {
               if (typeof setShowApply === "function") setShowApply(false);
               if (typeof setIsApplying === "function") setIsApplying(false);
            }}
         />

         {/* Section Header */}
         <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center">
               <HiPaperAirplane className="w-3.5 h-3.5 text-indigo-500 rotate-90" />
            </div>

            <div>
               <h2
                  className="text-sm font-semibold text-slate-800"
                  style={{ fontFamily: "'Fraunces', serif" }}
               >
                  Submit Application
               </h2>

               <p className="text-xs text-slate-500">
                  Applying for{" "}
                  <span className="font-medium text-indigo-600">
                     {job?.title}
                  </span>{" "}
                  at {job?.company?.title}
               </p>
            </div>
         </div>

         <div className="px-6 py-5 flex flex-col gap-6">
            {/* Global success */}
            {applied && (
               <p className="text-xs text-center px-3 py-2 rounded-lg bg-green-50 text-green-600 border border-green-200">
                  Application submitted successfully.
               </p>
            )}

            {/* Application error */}
            {isApplyError && (
               <p className="text-xs text-center px-3 py-2 rounded-lg bg-red-50 text-red-500 border border-red-200">
                  {applyError?.response?.data?.detail ||
                     "Unable to submit application right now."}
               </p>
            )}

            {/* ── Select Resume ── */}
            <div>
               <p className="text-xs font-semibold text-slate-600 uppercase tracking-widest mb-3">
                  Select Resume <span className="text-red-500">*</span>
               </p>

               <div className="space-y-3">
                  {isResumesLoading ? (
                     Array.from({ length: 3 }).map((_, i) => (
                        <ResumeOptionSkeleton key={i} index={i} />
                     ))
                  ) : resumes?.length > 0 ? (
                     resumes.map((resume) => (
                        <ResumeOption
                           key={resume.id}
                           resume={resume}
                           isSelected={selectedResume === resume.id}
                           onSelect={setSelectedResume}
                        />
                     ))
                  ) : (
                     <div className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-slate-200 bg-slate-50">
                        <div className="w-4 h-4 rounded-full bg-slate-200 shrink-0" />
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-slate-200">
                           <HiDocumentText className="w-4 h-4 text-slate-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                           <p className="text-xs font-semibold text-slate-500 truncate">
                              No Resume Found
                           </p>
                        </div>
                     </div>
                  )}
               </div>
            </div>

            {/* ── Cover Letter ── */}
            <div>
               <div className="flex items-center justify-between flex-wrap gap-2">
                  <p className="text-xs font-semibold text-slate-600 uppercase tracking-widest">
                     Cover Letter <span className="text-red-500">*</span>
                  </p>

                  <button
                     type="button"
                     onClick={handleGenerateCoverLetter}
                     disabled={!selectedResume || isGeneratingCoverLetter}
                     className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                        !selectedResume || isGeneratingCoverLetter
                           ? "bg-violet-50 border-violet-200 text-violet-400 cursor-not-allowed"
                           : "bg-violet-50 hover:bg-violet-100 border-violet-200 text-violet-700 cursor-pointer"
                     }`}
                  >
                     {isGeneratingCoverLetter ? (
                        <>
                           <svg
                              className="w-3.5 h-3.5 spin"
                              viewBox="0 0 24 24"
                              fill="none"
                           >
                              <circle
                                 className="opacity-25"
                                 cx="12"
                                 cy="12"
                                 r="10"
                                 stroke="currentColor"
                                 strokeWidth="4"
                              />
                              <path
                                 className="opacity-75"
                                 fill="currentColor"
                                 d="M4 12a8 8 0 018-8v8z"
                              />
                           </svg>
                           Generating…
                        </>
                     ) : (
                        <>
                           <HiSparkles className="w-3.5 h-3.5" />
                           Generate AI Cover Letter
                        </>
                     )}
                  </button>
               </div>

               {!selectedResume && (
                  <p className="text-xs text-center my-2 text-amber-500">
                     Please select a resume before generating a cover letter.
                  </p>
               )}

               {isGenerateError && (
                  <p className="text-xs text-center my-2 text-red-500">
                     {generateError?.response?.data?.detail ||
                        "Unable to generate cover letter right now."}
                  </p>
               )}

               <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  disabled={isGeneratingCoverLetter}
                  placeholder="Write your cover letter here, or use the AI generator above…"
                  rows={4}
                  className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm text-slate-700 placeholder-slate-400 outline-none resize-y transition-all leading-relaxed ${
                     isGeneratingCoverLetter
                        ? "border-violet-200 bg-violet-50/30 opacity-60 cursor-not-allowed"
                        : "border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  }`}
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
               />

               {!isGeneratingCoverLetter && coverLetter.trim() && (
                  <p className="flex items-center gap-1.5 text-xs text-violet-600 mt-1.5 fade-in">
                     <HiSparkles className="w-3 h-3" />
                     AI cover letter generated. Feel free to personalise it.
                  </p>
               )}
            </div>

            {/* ── Submit Button ── */}
            <button
               type="button"
               onClick={handleApply}
               disabled={isSubmitDisabled}
               className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold border-none transition-all ${
                  isSubmitDisabled
                     ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                     : "bg-indigo-500 hover:bg-indigo-600 text-white shadow-md shadow-indigo-200 cursor-pointer"
               }`}
            >
               {isApplyingMutation ? (
                  <>
                     <svg
                        className="w-4 h-4 spin"
                        viewBox="0 0 24 24"
                        fill="none"
                     >
                        <circle
                           className="opacity-25"
                           cx="12"
                           cy="12"
                           r="10"
                           stroke="currentColor"
                           strokeWidth="4"
                        />
                        <path
                           className="opacity-75"
                           fill="currentColor"
                           d="M4 12a8 8 0 018-8v8z"
                        />
                     </svg>
                     Submitting Application…
                  </>
               ) : (
                  <>
                     <HiPaperAirplane className="w-4 h-4 rotate-90" />
                     Submit Application
                  </>
               )}
            </button>

            {(!selectedResume || !coverLetter.trim()) && (
               <p className="text-xs text-slate-400 text-center -mt-4">
                  Please select a resume and add a cover letter to enable
                  submission.
               </p>
            )}
         </div>
      </div>
   );
};

export default JobApply;
