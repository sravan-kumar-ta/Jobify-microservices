import React from "react";
import { useFetchApplicationsQuery } from "../../services/seekerService";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Link } from "react-router-dom";

const AppliedJobs = () => {
   const { data, isLoading, error } = useFetchApplicationsQuery();

   if (error) return <p>Error: {error.message}</p>;

   const formattedDate = (appliedAt) => {
      const date = new Date(appliedAt);
      const day = date.getUTCDate();
      const month = date.toLocaleString("en-US", { month: "short" });
      const year = date.getUTCFullYear();
      const formattedDate = `${day} ${month} ${year}`;

      return formattedDate;
   };

   return (
      <div className="p-6 bg-gray-100 min-h-screen">
         <div className="lg:w-4/5 xl:w-3/5 mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
               Applied Jobs
            </h1>

            <div className="relative overflow-x-auto shadow-lg">
               <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                     <tr>
                        <th scope="col" className="pl-6 py-3">
                           #
                        </th>
                        <th scope="col" className="px-6 py-3">
                           Job Title
                        </th>
                        <th scope="col" className="px-6 py-3 text-center">
                           Company
                        </th>
                        <th scope="col" className="px-6 py-3 text-center">
                           Application Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-center">
                           Status
                        </th>
                        {/* <th scope="col" className="px-6 py-3 text-center">
                           Connecting
                        </th> */}
                     </tr>
                  </thead>
                  <tbody>
                     {isLoading ? (
                        <>
                           {[...Array(5)].map((_, index) => (
                              <tr key={index} className="bg-white border-b">
                                 {Array(4)
                                    .fill()
                                    .map((_, idx) => (
                                       <td key={idx} className="px-6 py-4">
                                          <Skeleton />
                                       </td>
                                    ))}
                              </tr>
                           ))}
                        </>
                     ) : data?.length > 0 ? (
                        data.map((job, index) => (
                           <tr key={job.id} className="bg-white border-b">
                              <th
                                 scope="row"
                                 className="pl-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                              >
                                 {index + 1}
                              </th>
                              <th
                                 scope="row"
                                 className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                              >
                                 <Link
                                    to={`/job/${job.job.id}`}
                                    className="text-indigo-600 hover:text-indigo-900 hover:underline"
                                 >
                                    {job.job.title}
                                 </Link>
                              </th>
                              <td className="px-6 py-4 text-center">
                                 {job.job.company.title}
                              </td>
                              <td className="px-6 py-4 text-center">
                                 {formattedDate(job.applied_at)}
                              </td>
                              <td className="px-6 py-4 text-center">
                                 {{
                                    pending: (
                                       <span className="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">
                                          Pending
                                       </span>
                                    ),
                                    accepted: (
                                       <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">
                                          Accepted
                                       </span>
                                    ),
                                    rejected: (
                                       <span className="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">
                                          Rejected
                                       </span>
                                    ),
                                 }[job.status] || ""}
                              </td>
                              {/* <td className="px-6 py-4 text-center">
                                 <button className="py-1.5 px-4 me-2 mb-2 text-xs font-medium text-green-700 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100">
                                    Chat
                                 </button>
                              </td> */}
                           </tr>
                        ))
                     ) : (
                        <tr>
                           <td
                              colSpan={5}
                              className="py-5 text-center tracking-wider font-bold text-amber-900"
                           >
                              No jobs applied yet.
                           </td>
                        </tr>
                     )}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
   );
};

export default AppliedJobs;
