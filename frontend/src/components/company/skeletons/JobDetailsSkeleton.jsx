import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const JobDetailsSkeleton = () => {
   return (
      <div className="flex justify-center">
         <div className="w-full lg:w-2/6 bg-white shadow-md rounded-lg p-6 my-4">
            <div className="flex justify-between">
               <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  <Skeleton width={220} />
               </h2>
               <p className="text-lg text-gray-600 mb-2">
                  <Skeleton width={150} />
               </p>
            </div>

            <div className="mx-20">
               <p className="text-md text-gray-600 mb-2">
                  <Skeleton width={300} />
               </p>
               <p className="text-md text-gray-600 mb-2">
                  <Skeleton width={300} />
               </p>
               <p className="text-md text-gray-600 mb-2">
                  <Skeleton width={300} />
               </p>
               <p className="text-md text-gray-600 mb-2">
                  <Skeleton width={300} />
               </p>
               <p className="text-md text-gray-600 mb-2">
                  <Skeleton width={300} />
               </p>
            </div>
         </div>
      </div>
   );
};

export default JobDetailsSkeleton;
