import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ApplicantSkeleton = ({ rows = 6 }) => {
   return (
      <div className="overflow-x-auto">
         <table className="w-full text-sm min-w-[640px]">
            <thead>
               <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left px-5 py-3">
                     <Skeleton width={14} height={12} />
                  </th>
                  <th className="text-left px-5 py-3">
                     <Skeleton width={80} height={12} />
                  </th>
                  <th className="text-left px-5 py-3 hidden sm:table-cell">
                     <Skeleton width={50} height={12} />
                  </th>
                  <th className="text-left px-5 py-3">
                     <Skeleton width={50} height={12} />
                  </th>
                  <th className="text-left px-5 py-3">
                     <Skeleton width={50} height={12} />
                  </th>
               </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
               {Array.from({ length: rows }).map((_, index) => (
                  <tr key={index} className="bg-white">
                     {/* # */}
                     <td className="px-5 py-4">
                        <Skeleton width={18} height={14} />
                     </td>

                     {/* Applicant ID */}
                     <td className="px-5 py-4">
                        <Skeleton width={95} height={14} />
                     </td>

                     {/* Date */}
                     <td className="px-5 py-4 hidden sm:table-cell">
                        <div className="flex items-center gap-2">
                           <Skeleton circle width={14} height={14} />
                           <Skeleton width={85} height={14} />
                        </div>
                     </td>

                     {/* Status */}
                     <td className="px-5 py-4">
                        <Skeleton width={78} height={28} borderRadius={10} />
                     </td>

                     {/* Action */}
                     <td className="px-5 py-4">
                        <Skeleton width={72} height={30} borderRadius={10} />
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   );
};

export default ApplicantSkeleton;
