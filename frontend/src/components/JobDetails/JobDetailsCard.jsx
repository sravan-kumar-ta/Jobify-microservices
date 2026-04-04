import { useEffect, useState } from "react";
import {
   HiLocationMarker,
   HiCurrencyDollar,
   HiClock,
   HiCalendar,
   HiBriefcase,
   HiCheckCircle,
   HiSparkles,
} from "react-icons/hi";
import ScoreRing from "./ScoreRing";
import { techSkills } from "../../utils/techSkills";
import { useGenerateJobMatches } from "../../services/AIService";

const JobDetailsCard = ({ job, userId, applied }) => {
   // AI score state
   const [scoreState, setScoreState] = useState("idle"); // "idle" | "checking" | "done"
   const [aiScore, setAiScore] = useState(null);

   // Apply section state
   const [showApply, setShowApply] = useState(false);
   const [selectedResume, setSelectedResume] = useState(1);
   const [coverLetter, setCoverLetter] = useState("");
   const [aiCoverState, setAiCoverState] = useState("idle"); // "idle" | "generating" | "done"
   const [applying, setApplying] = useState(false);

   const { mutate, data, isPending, isSuccess } = useGenerateJobMatches();

   const formatDate = (str) => {
      return new Date(str).toLocaleDateString("en-US", {
         month: "long",
         day: "numeric",
         year: "numeric",
      });
   };

   const skillLabels =
      job.skills
         .split(",")
         .map(
            (skill) =>
               techSkills.find((t) => t.value === skill.trim())?.label ||
               skill.trim(),
         ) || [];

   const handleGenerate = () => {
      mutate({
         job_id: job.id,
         seeker_id: userId,
      });
   };

   useEffect(() => {
      if (isSuccess && data) {
         console.log("Mutation data:", data);
      }
   }, [isSuccess, data]);

   const handleCheckScore = () => {
      if (scoreState !== "idle") return;
      setScoreState("checking");
      setTimeout(() => {
         setAiScore(32); // simulated backend score
         setScoreState("done");
      }, 2200);
   };

   const handleApply = () => {
      setApplying(true);
      setTimeout(() => {
         setApplying(false);
      }, 1800);
   };

   return (
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
         {/* Header */}
         <div className="px-6 pt-6 pb-5 border-b border-slate-100">
            <div className="flex items-start gap-4 flex-wrap">
               <div className="w-12 h-12 rounded-xl flex items-center justify-center text-base font-bold shrink-0 bg-violet-100 text-violet-600">
                  {job.company.title?.slice(0, 2).toUpperCase() || "UN"}
               </div>
               <div className="flex-1 min-w-0">
                  <div className="flex items-end gap-2 flex-wrap mb-2">
                     <h1
                        className="text-xl font-bold text-slate-800"
                        style={{ fontFamily: "'Fraunces', serif" }}
                     >
                        {job.title}
                     </h1>
                     <span className="text-gray-500">at</span>
                     <p className="text-sm font-medium text-indigo-500">
                        {job.company.title}
                     </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                     <HiCalendar className="w-3.5 h-3.5" />
                     Posted {formatDate(job.date_posted)}
                  </div>
               </div>
            </div>
         </div>

         {/* Meta grid */}
         <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 px-6 py-2 border-b border-slate-100">
            {[
               {
                  icon: HiCurrencyDollar,
                  label: "Salary",
                  val: "₹ " + job.salary + " LPA",
                  color: "text-emerald-500",
               },
               {
                  icon: HiLocationMarker,
                  label: "Location",
                  val: job.company.location,
                  color: "text-rose-400",
               },
               {
                  icon: HiClock,
                  label: "Experience",
                  val: "Minimum " + job.experience + " years.",
                  color: "text-indigo-400",
               },
            ].map(({ icon: Icon, label, val, color }) => (
               <div
                  key={label}
                  className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5"
               >
                  <Icon className={`w-4 h-4 shrink-0 ${color}`} />
                  <div>
                     <p className="text-xs text-slate-500">{label}</p>
                     <p className="text-xs font-semibold text-slate-700 mt-0.5">
                        {val}
                     </p>
                  </div>
               </div>
            ))}
         </div>

         {/* Skills */}
         <div className="px-6 pt-4  border-b border-slate-100">
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-widest mb-3">
               Skills Required
            </p>
            <div className="flex flex-wrap gap-2">
               {skillLabels.map((skill, idx) => (
                  <span
                     key={idx}
                     className="text-xs font-medium px-3 py-1 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100"
                  >
                     {skill}
                  </span>
               ))}
            </div>
         </div>

         {/* Description */}
         <div className="px-6 py-5 border-b border-slate-100">
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-widest mb-2">
               Job Description
            </p>
            <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
               {job.description}
            </div>
         </div>

         {/* AI Score area */}
         <div className="px-6 py-3 border-b border-slate-100 flex flex-col gap-3">
            {!isPending && !data && (
               <button
                  onClick={handleGenerate}
                  className="flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 rounded-xl bg-violet-50 hover:bg-violet-100 border border-violet-200 text-violet-700 text-sm font-semibold transition-all cursor-pointer"
               >
                  <HiSparkles className="w-4 h-4" />
                  Check Matching Score with AI
               </button>
            )}

            {isPending && (
               <div className="flex items-center gap-3 px-5 py-3 bg-violet-50 border border-violet-200 rounded-xl w-full sm:w-auto">
                  <svg
                     className="w-5 h-5 text-violet-600 animate-spin shrink-0"
                     viewBox="0 0 24 24"
                     fill="none"
                     aria-hidden="true"
                  >
                     <circle
                        className="opacity-20"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                     />
                     <path
                        className="opacity-90"
                        fill="currentColor"
                        d="M12 2a10 10 0 00-10 10h4a6 6 0 016-6V2z"
                     />
                  </svg>

                  <span className="text-sm font-medium text-violet-700">
                     Analysing your profile with AI…
                  </span>
               </div>
            )}

            {data && (
               <div className="fade-in">
                  <ScoreRing score={data} />
               </div>
            )}
         </div>

         {/* CTA Buttons */}
         <div className="px-6 py-5 flex flex-col sm:flex-row gap-3">
            {!applied ? (
               <button
                  onClick={() => {
                     setShowApply(true);
                     setTimeout(
                        () =>
                           document
                              .getElementById("apply-section")
                              ?.scrollIntoView({ behavior: "smooth" }),
                        80,
                     );
                  }}
                  className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold shadow-md shadow-indigo-200 transition-all border-none cursor-pointer"
               >
                  <HiBriefcase className="w-4 h-4" />
                  Ready to Apply
               </button>
            ) : (
               <div className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 text-sm font-semibold">
                  <HiCheckCircle className="w-4 h-4" />
                  Already Applied!
               </div>
            )}
         </div>
      </div>
   );
};

export default JobDetailsCard;
