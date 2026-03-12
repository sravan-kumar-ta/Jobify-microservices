import React from "react";
import {
   HiLocationMarker,
   HiBriefcase,
   HiCurrencyDollar,
   HiClock,
} from "react-icons/hi";
import { Link } from "react-router-dom";
import { NumericFormat } from "react-number-format";
import { techSkills } from "../utils/techSkills";

const JobCard = ({ job = null }) => {
   const excerpt = (text, length) => {
      if (!text) return "";
      if (text.length <= length) return text;
      return text.substring(0, length) + "...";
   };

   const getSkillsArray = (skills) => {
      if (!skills) return [];
      return skills
         .split(",")
         .map((skill) => skill.trim())
         .filter(Boolean)
         .map(
            (skill) =>
               techSkills.find((t) => t.value === skill)?.label || skill,
         );
   };

   const btnLink = `/job/${job.id}`;
   const skillsArray = getSkillsArray(job.skills);

   return (
      <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 h-full">
         {/* Employment Type Badge */}
         <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center flex-shrink-0">
               <HiBriefcase className="w-5 h-5" />
            </div>

            <div className="min-w-0 flex-1">
               <h2 className="text-sm sm:text-base font-semibold text-slate-800 leading-snug line-clamp-2">
                  {job.title}
               </h2>
               <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  {job.company?.title || "Unknown Company"}
               </p>
            </div>
         </div>

         {/* Meta Info */}
         <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
               <HiCurrencyDollar className="w-4 h-4 text-emerald-500 flex-shrink-0" />
               {job.salary ? (
                  <NumericFormat
                     value={job.salary}
                     thousandSeparator={true}
                     prefix={"₹ "}
                     suffix={" LPA"}
                     displayType={"text"}
                     className="font-medium text-slate-700"
                  />
               ) : (
                  <span className="text-slate-400">Not disclosed</span>
               )}
            </div>

            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
               <HiLocationMarker className="w-4 h-4 text-rose-400 flex-shrink-0" />
               <span>{job.company?.location || "Not disclosed"}</span>
            </div>

            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
               <HiClock className="w-4 h-4 text-indigo-400 flex-shrink-0" />
               <span>Minimum {job.experience || "Not disclosed"} years</span>
            </div>
         </div>

         {/* Skills */}
         <div className="flex flex-wrap gap-1.5">
            {skillsArray.length > 0 ? (
               skillsArray.slice(0, 4).map((skill) => (
                  <span
                     key={skill}
                     className="text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 border border-slate-200"
                  >
                     {skill}
                  </span>
               ))
            ) : (
               <span className="text-xs text-slate-400">No skills listed</span>
            )}

            {skillsArray.length > 4 && (
               <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
                  +{skillsArray.length - 4} more
               </span>
            )}
         </div>

         {/* Description */}
         <p
            className="text-xs sm:text-sm text-slate-500 leading-relaxed flex-1"
            style={{
               display: "-webkit-box",
               WebkitLineClamp: 3,
               WebkitBoxOrient: "vertical",
               overflow: "hidden",
            }}
         >
            {excerpt(job.description || "", 120)}
         </p>

         {/* Footer CTA */}
         <div className="pt-1 mt-auto">
            <Link
               to={btnLink}
               className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold bg-indigo-500 hover:bg-indigo-600 text-white shadow-sm shadow-indigo-200 transition-all"
            >
               <HiBriefcase className="w-4 h-4" />
               Open
            </Link>
         </div>
      </div>
   );
};

export default JobCard;
