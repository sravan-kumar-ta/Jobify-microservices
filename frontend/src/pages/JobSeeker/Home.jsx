import React, { useState, useEffect } from "react";
import {
   HiSearch,
   HiAdjustments,
   HiSortAscending,
   HiX,
   HiBriefcase,
   HiFilter,
   HiChevronDown,
   HiChevronUp,
} from "react-icons/hi";
import { useFetchFilteredJobsQuery } from "../../services/seekerService";
import JobCardSkeleton from "../../components/JobCardSkeleton";
import JobCard from "../../components/JobCard";

const Home = () => {
   const [searchQuery, setSearchQuery] = useState("");
   const [minSalary, setMinSalary] = useState("");
   const [maxSalary, setMaxSalary] = useState("");
   const [empType, setEmpType] = useState("");
   const [sortBy, setSortBy] = useState("");
   const [page, setPage] = useState(1);
   const [allData, setAllData] = useState([]);
   const [filtersOpen, setFiltersOpen] = useState(false); // NEW

   const params = {
      search: searchQuery,
      min_salary: minSalary,
      max_salary: maxSalary,
      employment_type: empType,
      ordering: sortBy,
      page,
   };

   const { data, isLoading, error } = useFetchFilteredJobsQuery(params);

   const removeDuplicates = (jobs) => {
      const uniqueJobs = [];
      const jobIds = new Set();

      jobs.forEach((job) => {
         if (!jobIds.has(job.id)) {
            uniqueJobs.push(job);
            jobIds.add(job.id);
         }
      });

      return uniqueJobs;
   };

   useEffect(() => {
      if (data && data.results) {
         if (page === 1) {
            setAllData(removeDuplicates(data.results));
         } else {
            setAllData((prevData) =>
               removeDuplicates([...prevData, ...data.results]),
            );
         }
      }
   }, [data, page]);

   const handleNonNegativeNumber = (value, setter) => {
      if (value === "") {
         setter("");
         return;
      }

      const num = Number(value);

      if (!Number.isNaN(num) && num >= 0) {
         setter(value);
         setPage(1);
      }
   };

   const clearFilters = () => {
      setSearchQuery("");
      setMinSalary("");
      setMaxSalary("");
      setEmpType("");
      setSortBy("");
      setPage(1);
   };

   const hasFilters =
      searchQuery || minSalary || maxSalary || empType || sortBy;

   return (
      <div className="min-h-screen bg-slate-50 px-4 sm:px-6 py-2">
         <div className="max-w-7xl mx-auto">
            {/* Sticky Filters Area */}
            <div className="sticky top-16 z-40 bg-slate-50 pb-4">
               {/* Mobile Toggle Button */}
               <div className="md:hidden mb-3">
                  <button
                     onClick={() => setFiltersOpen((prev) => !prev)}
                     className="w-full flex items-center justify-between bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm text-slate-700 font-medium"
                  >
                     <span className="flex items-center gap-2">
                        <HiFilter className="w-5 h-5 text-indigo-500" />
                        Filters
                        {hasFilters && (
                           <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
                              Active
                           </span>
                        )}
                     </span>

                     {filtersOpen ? (
                        <HiChevronUp className="w-5 h-5 text-slate-500" />
                     ) : (
                        <HiChevronDown className="w-5 h-5 text-slate-500" />
                     )}
                  </button>
               </div>

               {/* Desktop Filters (always open) */}
               <div className="hidden md:flex bg-white border border-slate-200 rounded-2xl shadow-sm px-4 py-4 flex-wrap gap-3 items-end">
                  {/* Search */}
                  <div className="flex-1 min-w-[220px]">
                     <label className="block text-xs font-medium text-slate-500 mb-1.5">
                        Search
                     </label>
                     <div className="relative">
                        <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                           type="text"
                           placeholder="Job title..."
                           value={searchQuery}
                           onChange={(e) => {
                              setSearchQuery(e.target.value);
                              setPage(1);
                           }}
                           className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                        />
                     </div>
                  </div>

                  {/* Min Salary */}
                  <div className="w-full sm:w-36">
                     <label className="block text-xs font-medium text-slate-500 mb-1.5">
                        <span className="flex items-center gap-1">
                           <HiAdjustments className="w-3.5 h-3.5" />
                           Min Salary in LPA
                        </span>
                     </label>
                     <input
                        type="number"
                        placeholder="e.g. 3"
                        value={minSalary}
                        onChange={(e) =>
                           handleNonNegativeNumber(e.target.value, setMinSalary)
                        }
                        className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                     />
                  </div>

                  {/* Max Salary */}
                  <div className="w-full sm:w-36">
                     <label className="block text-xs font-medium text-slate-500 mb-1.5">
                        <span className="flex items-center gap-1">
                           <HiAdjustments className="w-3.5 h-3.5" />
                           Max Salary in LPA
                        </span>
                     </label>
                     <input
                        type="number"
                        placeholder="e.g. 12"
                        value={maxSalary}
                        onChange={(e) => {
                           setMaxSalary(e.target.value);
                           setPage(1);
                        }}
                        className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                     />
                  </div>

                  {/* Sort */}
                  <div className="w-full sm:w-52">
                     <label className="block text-xs font-medium text-slate-500 mb-1.5">
                        <span className="flex items-center gap-1">
                           <HiSortAscending className="w-3.5 h-3.5" />
                           Sort By
                        </span>
                     </label>
                     <select
                        value={sortBy}
                        onChange={(e) => {
                           setSortBy(e.target.value);
                           setPage(1);
                        }}
                        className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all cursor-pointer appearance-none"
                     >
                        <option value="">Sort By</option>
                        <option value="salary">Salary (Low to High)</option>
                        <option value="-salary">Salary (High to Low)</option>
                        <option value="date_posted">
                           Date Posted (Oldest)
                        </option>
                        <option value="-date_posted">
                           Date Posted (Newest)
                        </option>
                     </select>
                  </div>

                  {/* Clear */}
                  {hasFilters && (
                     <button
                        onClick={clearFilters}
                        className="flex items-center gap-1.5 px-3.5 py-2.5 text-sm font-medium text-slate-500 hover:text-rose-500 bg-slate-100 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-xl transition-all cursor-pointer"
                     >
                        <HiX className="w-4 h-4" />
                        Clear
                     </button>
                  )}
               </div>

               {/* Mobile Filters (collapsible) */}
               <div
                  className={`md:hidden overflow-hidden transition-all duration-300 ${
                     filtersOpen ? "max-h-[700px]" : "max-h-0"
                  }`}
               >
                  <div className="bg-white border border-slate-200 rounded-2xl shadow-sm px-4 py-4 flex flex-col gap-3">
                     {/* Search */}
                     <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1.5">
                           Search
                        </label>
                        <div className="relative">
                           <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                           <input
                              type="text"
                              placeholder="Job title, company..."
                              value={searchQuery}
                              onChange={(e) => {
                                 setSearchQuery(e.target.value);
                                 setPage(1);
                              }}
                              className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                           />
                        </div>
                     </div>

                     {/* Min Salary */}
                     <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1.5">
                           <span className="flex items-center gap-1">
                              <HiAdjustments className="w-3.5 h-3.5" />
                              Min Salary
                           </span>
                        </label>
                        <input
                           type="number"
                           placeholder="e.g. 3"
                           value={minSalary}
                           onChange={(e) =>
                              handleNonNegativeNumber(
                                 e.target.value,
                                 setMinSalary,
                              )
                           }
                           className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                        />
                     </div>

                     {/* Max Salary */}
                     <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1.5">
                           <span className="flex items-center gap-1">
                              <HiAdjustments className="w-3.5 h-3.5" />
                              Max Salary
                           </span>
                        </label>
                        <input
                           type="number"
                           placeholder="e.g. 12"
                           value={maxSalary}
                           onChange={(e) => {
                              setMaxSalary(e.target.value);
                              setPage(1);
                           }}
                           className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                        />
                     </div>

                     {/* Employment Type */}
                     <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1.5">
                           <span className="flex items-center gap-1">
                              <HiBriefcase className="w-3.5 h-3.5" />
                              Employment Type
                           </span>
                        </label>
                        <select
                           value={empType}
                           onChange={(e) => {
                              setEmpType(e.target.value);
                              setPage(1);
                           }}
                           className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all cursor-pointer appearance-none"
                        >
                           <option value="">All Types</option>
                           <option value="Full-time">Full-time</option>
                           <option value="Part-time">Part-time</option>
                           <option value="Contract">Contract</option>
                           <option value="Internship">Internship</option>
                        </select>
                     </div>

                     {/* Sort */}
                     <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1.5">
                           <span className="flex items-center gap-1">
                              <HiSortAscending className="w-3.5 h-3.5" />
                              Sort By
                           </span>
                        </label>
                        <select
                           value={sortBy}
                           onChange={(e) => {
                              setSortBy(e.target.value);
                              setPage(1);
                           }}
                           className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all cursor-pointer appearance-none"
                        >
                           <option value="">Sort By</option>
                           <option value="salary">Salary (Low to High)</option>
                           <option value="-salary">Salary (High to Low)</option>
                           <option value="date_posted">
                              Date Posted (Oldest)
                           </option>
                           <option value="-date_posted">
                              Date Posted (Newest)
                           </option>
                        </select>
                     </div>

                     {/* Mobile Actions */}
                     {hasFilters && (
                        <button
                           onClick={clearFilters}
                           className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-sm font-medium text-slate-500 hover:text-rose-500 bg-slate-100 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-xl transition-all cursor-pointer"
                        >
                           <HiX className="w-4 h-4" />
                           Clear Filters
                        </button>
                     )}
                  </div>
               </div>
            </div>

            {/* Error State */}
            {error && (
               <div className="bg-rose-50 border border-rose-200 text-rose-600 rounded-2xl px-4 py-3 mt-6">
                  Failed to load jobs. Try again.
               </div>
            )}

            {/* Jobs Grid */}
            <div className="mt-6">
               {isLoading && page === 1 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
                     <JobCardSkeleton />
                  </div>
               ) : allData?.length ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
                     {allData.map((job) => (
                        <JobCard key={job.id} job={job} />
                     ))}
                  </div>
               ) : (
                  !isLoading && (
                     <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                           <HiSearch className="w-6 h-6 text-slate-400" />
                        </div>
                        <p className="text-slate-600 font-medium mb-1">
                           No jobs found
                        </p>
                        <p className="text-sm text-slate-400 mb-4">
                           Try adjusting your search or filters.
                        </p>
                        <button
                           onClick={clearFilters}
                           className="text-sm font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-xl transition-all border-none cursor-pointer"
                        >
                           Clear all filters
                        </button>
                     </div>
                  )
               )}
            </div>

            {/* Load More */}
            {data && data.next && (
               <div className="flex justify-center py-8">
                  <button
                     className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-white border border-slate-200 text-slate-700 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all shadow-sm"
                     onClick={() => setPage((prevPage) => prevPage + 1)}
                     disabled={!data.next}
                  >
                     {isLoading && page > 1 ? "Loading..." : "Load more"}
                  </button>
               </div>
            )}
         </div>
      </div>
   );
};

export default Home;
