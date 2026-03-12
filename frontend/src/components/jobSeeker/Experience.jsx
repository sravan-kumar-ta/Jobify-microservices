import React from "react";
import { FaBuilding, FaRegTrashAlt } from "react-icons/fa";
import { HiOutlineBadgeCheck } from "react-icons/hi";
import { GrEdit } from "react-icons/gr";
import { LuTimer } from "react-icons/lu";
import { useDeleteExperienceMutation } from "../../services/seekerService";

const Experience = ({ exp, setUpdation }) => {
   const deleteExperienceMutation = useDeleteExperienceMutation();

   const formatDate = (dateString) => {
      const [year, month] = dateString.split("-");
      const date = new Date(year, month - 1);
      return date.toLocaleString("default", {
         month: "short",
         year: "numeric",
      });
   };

   const handleDelete = () => {
      const confirmed = window.confirm(
         "Are you sure you want to delete this experience?",
      );

      if (!confirmed) return;
      deleteExperienceMutation.mutate(exp.id);
   };

   return (
      <div className="flex justify-between bg-slate-100 p-2 my-2 relative">
         <div className="flex items-center space-x-1">
            <HiOutlineBadgeCheck className="text-sky-800" />
            <div className="border-l-2 border-l-zinc-400 pl-1">
               <strong className="text-zinc-600">{exp.job_title}</strong>
               <div className="flex items-center">
                  <FaBuilding className="mr-1 text-zinc-600" size={14} />
                  <p className="text-zinc-500">{exp.company}</p>
               </div>
               <div className="flex items-center">
                  <LuTimer className="mr-1 text-zinc-600" size={14} />
                  <div className="flex">
                     <p className="text-zinc-500">
                        {formatDate(exp.start_date)}
                     </p>
                     <p className="text-zinc-500 mx-2">to</p>
                     {exp.is_current ? (
                        <p className="text-zinc-700">Present</p>
                     ) : (
                        <p className="text-zinc-500">
                           {formatDate(exp.end_date)}
                        </p>
                     )}
                  </div>
               </div>
            </div>
         </div>
         <div className="absolute flex items-start space-x-3 right-2">
            <GrEdit
               className="text-yellow-500 cursor-pointer"
               onClick={() => setUpdation(exp)}
            />
            <FaRegTrashAlt
               className="text-red-500 cursor-pointer"
               onClick={handleDelete}
            />
         </div>
      </div>
   );
};

export default Experience;
