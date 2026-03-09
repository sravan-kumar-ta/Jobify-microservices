import { FiEdit2 } from "react-icons/fi";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const EducationSkeleton = () => {
   return Array(3)
      .fill()
      .map((_, index) => {
         return (
            <div
               className="flex justify-between bg-slate-100 p-2 my-2 relative"
               key={index}
            >
               <div className="flex items-center space-x-1">
                  <div>
                     <strong className="text-zinc-600">
                        <Skeleton width={200} />
                     </strong>
                     <div className="flex items-center">
                        <div className="flex">
                           <p className="text-zinc-500">
                              <Skeleton width={60} />
                           </p>
                           <p className="text-zinc-500 mx-2">—</p>
                           <p className="text-zinc-500">
                              <Skeleton width={60} />
                           </p>
                        </div>
                     </div>
                  </div>
               </div>
               <div className="flex items-center text-blue-600 right-2 font-semibold">
                  <FiEdit2 className="w-4 h-4 mr-2" />
                  Edit
               </div>
            </div>
         );
      });
};

export default EducationSkeleton;
