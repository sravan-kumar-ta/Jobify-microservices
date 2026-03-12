import React from "react";
import { FaGlobe } from "react-icons/fa";
import { FaLocationDot, FaCalendarDays } from "react-icons/fa6";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ProfileCardSkeleton = () => {
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
                  <FaLocationDot className="mr-2" />
                  <span>
                     <Skeleton width={150} height={20} />
                  </span>
               </div>
               <div className="flex items-center mt-1 text-gray-600">
                  <FaCalendarDays className="mr-2" />
                  <span>
                     <Skeleton width={150} height={20} />
                  </span>
               </div>
            </div>
         </div>
         <p className="text-gray-700 mt-4 italic">
            <Skeleton count={3} />
         </p>

         <div className="md:flex justify-between mt-4">
            <div className="flex items-center">
               <FaGlobe className="text-gray-600 mr-2" />
               <span className="text-gray-600">
                  <Skeleton width={150} height={20} />
               </span>
            </div>
            <div className="flex mt-4 md:mt-0 justify-between">
               <div className="flex items-center gap-4">
                  <div className="flex items-center">
                     <Skeleton circle={true} width={30} height={30} />
                  </div>
                  <div className="flex items-center">
                     <Skeleton circle={true} width={30} height={30} />
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default ProfileCardSkeleton;
