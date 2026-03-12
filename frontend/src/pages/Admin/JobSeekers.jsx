import React, { useEffect, useState } from "react";
import { useFetchJobSeekersQuery } from "../../services/adminService";
import LoadMoreButton from "../../components/admin/LoadMoreButton";
import SeekersSkeleton from "../../components/admin/skeletons/SeekersSkeleton";

const JobSeekers = () => {
   const [page, setPage] = useState(1);
   const [allData, setAllData] = useState([]);

   const { data, isLoading, error } = useFetchJobSeekersQuery({
      page,
   });

   if (error) return <div>{error}</div>;

   const removeDuplicates = (seekers) => {
      const uniqueSeekers = [];
      const seekerIds = new Set();

      seekers.forEach((seeker) => {
         if (!seekerIds.has(seeker.id)) {
            uniqueSeekers.push(seeker);
            seekerIds.add(seeker.id);
         }
      });

      return uniqueSeekers;
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

   const handleLoadMore = () => {
      setPage((prev) => prev + 1);
   };

   return (
      <div className="md:w-2/3 mx-auto mt-4 bg-white">
         <h2 className="text-2xl font-bold text-center mb-4 sticky top-0 bg-white py-2 z-10">
            Job Seekers
         </h2>
         <div className="md:max-h-[calc(100vh-13rem)] max-h-[calc(100vh-15rem)] overflow-y-auto">
            <table className="min-w-full table-auto border-collapse">
               <thead className="sticky top-0 bg-gray-200 z-10">
                  <tr>
                     <th className="px-4 py-2 border-b">#</th>
                     <th className="px-4 py-2 border-b">Name</th>
                     <th className="px-4 py-2 border-b">Username</th>
                     <th className="px-4 py-2 border-b">Email</th>
                  </tr>
               </thead>
               <tbody align="center">
                  {allData.map((seeker, index) => (
                     <tr key={seeker.id}>
                        <td className="px-4 py-2 border-b">{index + 1}</td>
                        <td className="px-4 py-2 border-b">
                           {seeker.get_full_name}
                        </td>
                        <td className="px-4 py-2 border-b">
                           {seeker.username}
                        </td>
                        <td className="px-4 py-2 border-b">{seeker.email}</td>
                     </tr>
                  ))}
                  <tr className="text-center">
                     <td colSpan={5} className="py-3">
                        {data?.next && (
                           <LoadMoreButton
                              onClick={handleLoadMore}
                              isLoading={isLoading}
                           />
                        )}
                     </td>
                  </tr>

                  {isLoading && <SeekersSkeleton />}
               </tbody>
            </table>
         </div>
      </div>
   );
};

export default JobSeekers;
