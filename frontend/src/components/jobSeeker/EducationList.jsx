import EducationCard from "./EducationCard";
import { IoAddCircleOutline } from "react-icons/io5";
import { IoIosSchool } from "react-icons/io";

export default function EducationList({ education, onAdd, onEdit }) {
   if (!education || education.length === 0) {
      return (
         <div className="border border-dashed rounded-xl p-8 text-center">
            <p className="text-gray-500 mb-4">No education added yet</p>

            <button
               onClick={onAdd}
               className="flex items-center border border-blue-600 text-blue-600 text-sm font-semibold py-1 px-4 rounded hover:bg-blue-600 hover:text-white transition-all duration-300"
            >
               Add Education
               <IoAddCircleOutline className="ml-1" />
            </button>
         </div>
      );
   }

   return (
      <div className="space-y-3">
         <div className="flex justify-between items-center">
            <div className="flex">
               <IoIosSchool className="text-violet-600 text-3xl mr-4" />
               <h2 className="text-2xl font-semibold text-gray-800">
                  Education
               </h2>
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
