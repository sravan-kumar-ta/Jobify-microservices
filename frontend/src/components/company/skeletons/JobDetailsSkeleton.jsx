import { HiBriefcase, HiSparkles } from "react-icons/hi";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const JobDetailsSkeleton = () => {
   return (
      <div className="min-h-screen bg-slate-50">
         <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-5">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
               {/* Header */}
               <div className="px-6 pt-2 pb-1 border-b border-slate-100">
                  <div className="flex items-end gap-4 flex-wrap">
                     <div className="w-12 h-12 rounded-xl shrink-0 overflow-hidden">
                        <Skeleton height={48} width={48} borderRadius={12} />
                     </div>

                     <div className="flex-1 min-w-0">
                        <div className="flex items-end gap-2 flex-wrap mb-2">
                           <Skeleton width={180} height={28} />
                           <Skeleton width={20} height={16} />
                           <Skeleton width={100} height={18} />
                        </div>
                     </div>
                  </div>
               </div>

               {/* Meta grid */}
               <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 px-6 py-2 border-b border-slate-100">
                  {[1, 2, 3].map((item) => (
                     <div
                        key={item}
                        className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 rounded-xl px-3"
                     >
                        <Skeleton circle width={16} height={16} />
                        <div className="flex-1">
                           <Skeleton width={50} height={12} />
                           <Skeleton
                              width="80%"
                              height={14}
                              style={{ marginTop: 4 }}
                           />
                        </div>
                     </div>
                  ))}
               </div>

               {/* Skills */}
               <div className="px-6 pt-3 pb-1 border-b border-slate-100">
                  <p className="text-xs font-semibold text-slate-600 uppercase tracking-widest mb-3">
                     Skills Required
                  </p>

                  <div className="flex flex-wrap gap-2">
                     {[1, 2, 3, 4, 5, 6].map((item) => (
                        <Skeleton
                           key={item}
                           width={70}
                           height={18}
                           borderRadius={8}
                        />
                     ))}
                  </div>
               </div>

               {/* Description */}
               <div className="px-6 py-5 border-b border-slate-100">
                  <p className="text-xs font-semibold text-slate-600 uppercase tracking-widest mb-2">
                     Job Description
                  </p>

                  <div className="flex flex-col gap-2">
                     <Skeleton height={14} />
                     <Skeleton height={14} />
                     <Skeleton height={14} width="85%" />
                     <Skeleton height={14} width="78%" />
                  </div>
               </div>

               {/* CTA Buttons */}
               <div className="px-6 pb-5">
                     <Skeleton height={20} width="10%" />
               </div>
            </div>
         </div>
      </div>
   );
};

export default JobDetailsSkeleton;
