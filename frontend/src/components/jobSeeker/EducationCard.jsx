import { useDeleteEducationMutation } from "../../services/seekerService";

function formatMonthYear(dateString) {
   if (!dateString) return "—";

   const date = new Date(dateString);

   return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
   });
}

export default function EducationCard({ education, onEdit }) {
   const { mutate: deleteEducation, isPending } = useDeleteEducationMutation();

   const handleDelete = () => {
      const confirmed = window.confirm(
         "Are you sure you want to delete this education?",
      );

      if (!confirmed) return;

      deleteEducation(education.id);
   };

   return (
      <div className="bg-white border border-gray-200 rounded-xl p-4 flex justify-between items-center">
         <div>
            <div className="flex">
               <p className="font-semibold text-gray-900 text-sm">
                  {education.degree}&nbsp;
               </p>

               <p className="text-sm text-gray-500">
                  at {education.institution}
               </p>
            </div>
            <p className="text-xs text-gray-500 mt-1">
               {formatMonthYear(education.start_year)} –{" "}
               {education.end_year
                  ? formatMonthYear(education.end_year)
                  : "Present"}
            </p>
         </div>

         <div className="flex space-x-4">
            <button
               onClick={() => onEdit(education)}
               className="text-sm text-blue-600 hover:text-blue-700"
            >
               Edit
            </button>

            <button
               disabled={isPending}
               onClick={handleDelete}
               className="text-sm text-red-600 hover:text-red-700"
            >
               Delete
            </button>
         </div>
      </div>
   );
}
