import EducationCard from "./EducationCard";
import { IoAddCircleOutline } from "react-icons/io5";

export default function EducationList({ education, onAdd, onEdit }) {
   if (!education || education.length === 0) {
      return (
         <>
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 text-base">
                  🎓
               </div>
               <h2 className="text-sm sm:text-base font-semibold tracking-wide text-slate-800">
                  Education
               </h2>
            </div>
            <div className="flex flex-col items-center justify-center text-center">
               <p className="text-gray-500 mb-4">No education added yet</p>

               <button
                  onClick={onAdd}
                  className="flex items-center border border-blue-600 text-blue-600 text-sm font-semibold py-1 px-4 rounded hover:bg-blue-600 hover:text-white transition-all duration-300"
               >
                  Add Education
                  <IoAddCircleOutline className="ml-1" />
               </button>
            </div>
         </>
      );
   }

   return (
      <div className="space-y-3">
         <div className="flex justify-between items-center">
            <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 text-base">
                     🎓
                  </div>
                  <h2 className="text-sm sm:text-base font-semibold tracking-wide text-slate-800">
                     Education
                  </h2>
               </div>
            </div>
            <button
               onClick={onAdd}
               className="flex items-center border border-blue-600 text-blue-600 text-sm font-semibold py-1 px-4 rounded hover:bg-blue-600 hover:text-white transition-all duration-300"
            >
               Add Education
               <IoAddCircleOutline className="ml-1" />
            </button>
         </div>

         {education.map((item) => (
            <EducationCard key={item.id} education={item} onEdit={onEdit} />
         ))}
      </div>
   );
}
