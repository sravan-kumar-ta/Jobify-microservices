import React from "react";
import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const UserCardSkeleton = () => {
   return (
      <div className="lg:w-2/6 mx-10 bg-white border border-gray-200 rounded-lg shadow-lg p-6 mt-3">
         <div className="flex items-center">
            <div className="w-16 h-16 rounded-full bg-gray-200 mr-4 flex items-center justify-center text-xl font-bold text-gray-400">
               <Skeleton circle={true} width={64} height={64} />
            </div>
            <div>
               <h1 className="text-2xl font-bold text-gray-800">
                  <Skeleton width={200} height={30} />
               </h1>
               <div className="flex items-center mt-2 text-gray-600">
                  <FaUser className="mr-2" />
                  <span>
                     <Skeleton width={150} height={20} />
                  </span>
               </div>
               <div className="flex items-center mt-1 text-gray-600">
                  <MdEmail className="mr-2" />
                  <span>
                     <Skeleton width={150} height={20} />
                  </span>
               </div>
            </div>
         </div>

         <div className="flex items-end justify-center h-24 relative">
            <Skeleton width={120} height={40} className="absolute" />
         </div>
      </div>
   );
};

export default UserCardSkeleton;
