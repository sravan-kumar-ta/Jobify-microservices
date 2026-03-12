import React from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaRectangleList } from "react-icons/fa6";
import { useDeleteResumeMutation } from "../../services/seekerService";

const Resume = ({ link, title, id }) => {
   const deleteResumeMutation = useDeleteResumeMutation();

   const handleDelete = () => {
      const confirmed = window.confirm(
         "Are you sure you want to delete this resume?",
      );

      if (!confirmed) return;
      deleteResumeMutation.mutate(id);
   };

   return (
      <div className="flex items-center justify-between bg-slate-100 p-2 my-2">
         <div className="flex items-center">
            <FaRectangleList className="mr-2 text-sky-800" />
            <a
               href={link}
               className="text-blue-600 hover:underline"
               target="_blank"
            >
               {title}
            </a>
         </div>
         <FaRegTrashAlt
            className="ml-3 text-red-500 cursor-pointer"
            onClick={handleDelete}
         />
      </div>
   );
};

export default Resume;
