import { techSkills } from "../../utils/TechSkills";

const ScoreRing = ({ score }) => {
   const formatted_score = Number(score.score).toFixed(1);

   const radius = 28;
   const circumference = 2 * Math.PI * radius;
   const filled = (score.score / 100) * circumference;
   const expScore = score.experience_score;
   const eduScore = score.education_score;
   const skillScore = score.required_skill_score;
   const color =
      score.score >= 75 ? "#6c8eff" : score.score >= 50 ? "#f59e0b" : "#f87171";
   const label =
      score.score >= 75
         ? "Great Match"
         : score.score >= 50
           ? "Good Match"
           : "Partial Match";
   const labelColor =
      score.score >= 75
         ? "text-indigo-600"
         : score.score >= 50
           ? "text-amber-600"
           : "text-rose-500";
   const bgColor =
      score.score >= 75
         ? "bg-indigo-50 border-indigo-100"
         : score.score >= 50
           ? "bg-amber-50 border-amber-100"
           : "bg-rose-50 border-rose-100";

   const getLabel = (skills) => {
      if (!skills || skills.length === 0) return "Nothing...!";

      return skills
         .map(
            (skill) =>
               techSkills.find((t) => t.value === skill.trim())?.label ||
               skill.trim(),
         )
         .join(", ");
   };
   return (
      <div
         className={`flex items-center gap-4 px-5 py-4 rounded-2xl border ${bgColor}`}
      >
         {/* Ring */}
         <div className="relative shrink-0 w-16 h-16">
            <svg className="w-16 h-16 -rotate-90" viewBox="0 0 72 72">
               <circle
                  cx="36"
                  cy="36"
                  r={radius}
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="6"
               />
               <circle
                  cx="36"
                  cy="36"
                  r={radius}
                  fill="none"
                  stroke={color}
                  strokeWidth="6"
                  strokeDasharray={`${filled} ${circumference}`}
                  strokeLinecap="round"
                  style={{ transition: "stroke-dasharray 1.2s ease" }}
               />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
               <span className="text-sm font-bold text-slate-700">
                  {formatted_score}%
               </span>
            </div>
         </div>

         {/* Text */}
         <div>
            <p className={`text-sm font-bold ${labelColor}`}>{label}</p>
            <p className="text-xs text-slate-500 leading-relaxed">
               {score.score >= 75
                  ? "Your profile aligns strongly with this role. You're a top candidate!"
                  : score.score >= 50
                    ? "You meet several key requirements. Consider highlighting more relevant skills."
                    : "Some gaps detected. Tailor your resume to better match this role."}
            </p>
            <p className="text-xs text-slate-500 leading-relaxed">
               Final score combines structured rule-based matching and semantic
               similarity.
            </p>
            <p className="text-xs text-slate-500 leading-relaxed">
               <span className="text-slate-600">Matching skills:</span>{" "}
               {getLabel(score.matched_required_skills)}
            </p>
            <p className="text-xs text-slate-500 leading-relaxed">
               <span className="text-slate-600">Missing Skills:</span>{" "}
               {getLabel(score.missing_required_skills)}
            </p>
            {/* Skill bars */}
            <div className="flex gap-6 mt-2.5 flex-wrap">
               {[
                  ["Skill", skillScore],
                  ["Experience", expScore],
                  ["Education", eduScore],
               ].map(([lbl, val]) => (
                  <div key={lbl} className="flex flex-col gap-0.5">
                     <span className="text-xs text-slate-500">{lbl}</span>
                     <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                           className="h-full rounded-full transition-all duration-1000"
                           style={{ width: `${val}%`, background: color }}
                        />
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
};

export default ScoreRing;
