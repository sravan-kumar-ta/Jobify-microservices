import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
   HiCalendar,
   HiEye,
   HiChevronDown,
   HiUser,
   HiBriefcase,
   HiClock,
   HiCheckCircle,
   HiXCircle,
   HiFilter,
} from "react-icons/hi";
import { useFilteredApplicationsQuery } from "../../services/companyService";
import Applicant from "./Applicant";
import ApplicantSkeleton from "../../components/company/skeletons/ApplicantSkeleton";

const STATUS_CONFIG = {
   pending: {
      label: "Pending",
      dot: "bg-amber-400",
      badge: "bg-amber-50 text-amber-700 border-amber-200",
      icon: HiClock,
   },
   accepted: {
      label: "Accepted",
      dot: "bg-emerald-400",
      badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: HiCheckCircle,
   },
   rejected: {
      label: "Rejected",
      dot: "bg-rose-400",
      badge: "bg-rose-50 text-rose-700 border-rose-200",
      icon: HiXCircle,
   },
};

const FILTER_OPTIONS = [
   { value: "all", label: "All" },
   { value: "pending", label: "Pending" },
   { value: "accepted", label: "Accepted" },
   { value: "rejected", label: "Rejected" },
];

function StatusBadge({ status }) {
   const cfg = STATUS_CONFIG[status];
   if (!cfg) return null;

   return (
      <span
         className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg border ${cfg.badge}`}
      >
         <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
         {cfg.label}
      </span>
   );
}

const ApplicantsList = () => {
   const { jobID } = useParams();

   const [selectedApplication, setSelectedApplication] = useState(null);
   const [showDropdown, setShowDropdown] = useState(false);
   const [filterStatus, setFilterStatus] = useState("all");

   const { data, isLoading, error } = useFilteredApplicationsQuery(
      jobID,
      filterStatus,
   );

   const applications = data || [];

   const counts = useMemo(() => {
      return {
         all: applications.length,
         pending: applications.filter((a) => a.status === "pending").length,
         accepted: applications.filter((a) => a.status === "accepted").length,
         rejected: applications.filter((a) => a.status === "rejected").length,
      };
   }, [applications]);

   const formattedDate = (appliedAt) => {
      if (!appliedAt) return "—";
      const date = new Date(appliedAt);
      const day = date.getUTCDate();
      const month = date.toLocaleString("en-US", { month: "short" });
      const year = date.getUTCFullYear();
      return `${day} ${month} ${year}`;
   };

   const handleFilter = (status) => {
      setFilterStatus(status);
      setShowDropdown(false);
      setSelectedApplication(null);
   };

   if (error) {
      return (
         <div className="min-h-screen bg-slate-50 px-4 sm:px-6 py-8">
            <div className="max-w-5xl mx-auto">
               <div className="bg-white border border-rose-200 rounded-2xl p-6 text-rose-600 shadow-sm">
                  Failed to load applications.
               </div>
            </div>
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-slate-50 px-4 sm:px-6 py-8">
         <div className="max-w-7xl mx-auto flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
               <div>
                  <h1
                     className="text-2xl font-bold text-slate-800 mb-0.5"
                     style={{ fontFamily: "Fraunces, serif" }}
                  >
                     Applications
                  </h1>
                  <p className="text-sm text-slate-500">
                     Review and manage candidates for this job posting.
                  </p>
               </div>

               {/* Filter dropdown */}
               <div className="relative self-start">
                  <button
                     onClick={() => setShowDropdown((prev) => !prev)}
                     className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all shadow-sm cursor-pointer"
                  >
                     <HiFilter className="w-4 h-4 text-slate-400" />
                     {
                        FILTER_OPTIONS.find((f) => f.value === filterStatus)
                           ?.label
                     }
                     <HiChevronDown className="w-4 h-4 text-slate-400" />
                  </button>

                  {showDropdown && (
                     <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-xl shadow-lg z-20 overflow-hidden">
                        {FILTER_OPTIONS.map((opt) => (
                           <button
                              key={opt.value}
                              onClick={() => handleFilter(opt.value)}
                              className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer
                              ${
                                 filterStatus === opt.value
                                    ? "bg-indigo-50 text-indigo-600 font-medium"
                                    : "text-slate-600 hover:bg-slate-50"
                              }`}
                           >
                              {opt.label}
                           </button>
                        ))}
                     </div>
                  )}
               </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
               {[
                  {
                     label: "All",
                     value: counts.all,
                     icon: HiBriefcase,
                     box: "bg-slate-50 border-slate-200",
                     iconBox: "bg-slate-100 text-slate-600",
                  },
                  {
                     label: "Pending",
                     value: counts.pending,
                     icon: HiClock,
                     box: "bg-amber-50 border-amber-200",
                     iconBox: "bg-amber-100 text-amber-600",
                  },
                  {
                     label: "Accepted",
                     value: counts.accepted,
                     icon: HiCheckCircle,
                     box: "bg-emerald-50 border-emerald-200",
                     iconBox: "bg-emerald-100 text-emerald-600",
                  },
                  {
                     label: "Rejected",
                     value: counts.rejected,
                     icon: HiXCircle,
                     box: "bg-rose-50 border-rose-200",
                     iconBox: "bg-rose-100 text-rose-600",
                  },
               ].map(({ label, value, icon: Icon, box, iconBox }) => (
                  <div
                     key={label}
                     className={`rounded-2xl border px-4 py-4 ${box}`}
                  >
                     <div className="flex items-center justify-between">
                        <div>
                           <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                              {label}
                           </p>
                           <p className="text-xl font-bold text-slate-800 mt-1">
                              {value}
                           </p>
                        </div>
                        <div
                           className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBox}`}
                        >
                           <Icon className="w-5 h-5" />
                        </div>
                     </div>
                  </div>
               ))}
            </div>

            {/* Main content */}
            <div
               className={`flex gap-5 items-start ${
                  selectedApplication ? "flex-col lg:flex-row" : ""
               }`}
            >
               {/* Table section */}
               <div
                  className={`bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden ${
                     selectedApplication ? "lg:w-3/5 w-full" : "w-full"
                  }`}
               >
                  <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                     <h2 className="text-sm font-semibold text-slate-700">
                        Applicant List
                        <span className="ml-2 text-xs font-normal text-slate-400">
                           {applications.length} applicants
                        </span>
                     </h2>
                  </div>

                  {isLoading ? (
                     <div className="p-5">
                        <ApplicantSkeleton />
                     </div>
                  ) : applications.length === 0 ? (
                     <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                           <HiUser className="w-5 h-5 text-slate-400" />
                        </div>
                        <p className="text-sm font-medium text-slate-600 mb-1">
                           No applications found
                        </p>
                        <p className="text-xs text-slate-400">
                           Applications for this filter will appear here.
                        </p>
                     </div>
                  ) : (
                     <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                           <thead>
                              <tr className="bg-slate-50 border-b border-slate-100">
                                 <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">
                                    #
                                 </th>
                                 <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3 hidden sm:table-cell">
                                    Date
                                 </th>
                                 <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">
                                    Status
                                 </th>
                                 <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">
                                    Action
                                 </th>
                              </tr>
                           </thead>

                           <tbody className="divide-y divide-slate-100">
                              {applications.map((application, index) => (
                                 <tr
                                    key={application.id}
                                    className={`transition-colors ${
                                       selectedApplication?.id ===
                                       application.id
                                          ? "bg-indigo-50/60"
                                          : "hover:bg-slate-50/80"
                                    }`}
                                 >
                                    <td className="px-5 py-3.5 text-xs text-slate-400 font-medium">
                                       {`APP_${(index + 1).toString().padStart(3, "0")}`}
                                    </td>

                                    <td className="px-5 py-3.5 text-xs text-slate-500 hidden sm:table-cell">
                                       <div className="flex items-center gap-1.5">
                                          <HiCalendar className="w-3.5 h-3.5 text-slate-400" />
                                          {formattedDate(
                                             application.applied_at,
                                          )}
                                       </div>
                                    </td>

                                    <td className="px-5 py-3.5">
                                       <StatusBadge
                                          status={application.status}
                                       />
                                    </td>

                                    <td className="px-5 py-3.5">
                                       <button
                                          onClick={() =>
                                             setSelectedApplication(
                                                selectedApplication?.id ===
                                                   application.id
                                                   ? null
                                                   : application,
                                             )
                                          }
                                          className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all cursor-pointer
                                          ${
                                             selectedApplication?.id ===
                                             application.id
                                                ? "bg-indigo-500 text-white border-indigo-500"
                                                : "bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                                          }`}
                                       >
                                          <HiEye className="w-3.5 h-3.5" />
                                          {selectedApplication?.id ===
                                          application.id
                                             ? "Viewing"
                                             : "View"}
                                       </button>
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  )}
               </div>

               {/* Detail panel */}
               {selectedApplication && (
                  <div className="lg:w-2/5 w-full lg:sticky lg:top-20">
                     <Applicant
                        application={selectedApplication}
                        setApplication={setSelectedApplication}
                        jobID={jobID}
                     />
                  </div>
               )}
            </div>
         </div>
      </div>
   );
};

export default ApplicantsList;
