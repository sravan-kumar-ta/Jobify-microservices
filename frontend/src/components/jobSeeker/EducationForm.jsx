import { useEffect } from "react";
import { IoIosSchool } from "react-icons/io";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { educationSchema } from "../../utils/zodValidation";
import {
   useCreateEducationMutation,
   useUpdateEducationMutation,
} from "../../services/seekerService";
import SubmitButton from "../SubmitButton";

export default function EducationForm({ initial, onCancel, onSuccess }) {
   const { mutate: createEducation } = useCreateEducationMutation();
   const { mutate: updateEducation } = useUpdateEducationMutation();
   const title = initial ? "Update Education" : "Add Education";

   initial = initial
      ? {
           ...initial,
           currently_studying:
              initial.end_year == null || initial.end_year == "" ? true : false,
        }
      : null;

   const {
      register,
      handleSubmit,
      watch,
      setValue,
      formState: { errors, isSubmitting },
   } = useForm({
      resolver: zodResolver(educationSchema),
      defaultValues: initial || {
         degree: "",
         institution: "",
         start_year: "",
         end_year: "",
         currently_studying: false,
      },
   });

   const currentlyStudying = watch("currently_studying");

   useEffect(() => {
      if (currentlyStudying) {
         setValue("end_year", "");
      }
   }, [currentlyStudying, setValue]);

   const onSubmit = (data) => {
      console.log("Form Data:", data);
      if (initial?.id) {
         updateEducation({ id: initial.id, data }, { onSuccess });
      } else {
         createEducation(data, { onSuccess });
      }
   };

   return (
      <>
         <div className="flex mb-2">
            <IoIosSchool className="text-violet-600 text-3xl mr-4" />
            <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
         </div>
         <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white border rounded-xl p-5 space-y-4"
         >
            <div>
               <label className="text-sm">Degree</label>

               <input
                  {...register("degree")}
                  className="w-full border rounded px-3 py-2 text-sm"
               />

               {errors.degree && (
                  <p className="text-xs text-red-500 mt-1">
                     {errors.degree.message}
                  </p>
               )}
            </div>

            <div>
               <label className="text-sm">Institution</label>

               <input
                  {...register("institution")}
                  className="w-full border rounded px-3 py-2 text-sm"
               />

               {errors.institution && (
                  <p className="text-xs text-red-500 mt-1">
                     {errors.institution.message}
                  </p>
               )}
            </div>

            <div className="grid grid-cols-2 gap-3">
               <div>
                  <label className="text-sm">Start Date</label>

                  <input
                     type="month"
                     {...register("start_year")}
                     className="w-full border rounded px-3 py-2 text-sm"
                  />

                  {errors.start_year && (
                     <p className="text-xs text-red-500 mt-1">
                        {errors.start_year.message}
                     </p>
                  )}
               </div>

               <div>
                  <label className="text-sm">End Date</label>

                  <input
                     type="month"
                     disabled={currentlyStudying}
                     {...register("end_year")}
                     className="w-full border rounded px-3 py-2 text-sm"
                  />

                  {errors.end_year && (
                     <p className="text-xs text-red-500 mt-1">
                        {errors.end_year.message}
                     </p>
                  )}
               </div>
            </div>

            <div className="flex items-center gap-2">
               <input
                  type="checkbox"
                  {...register("currently_studying")}
                  id="crr_sty"
                  className="h-4 w-4 cursor-pointer"
               />
               <label htmlFor="crr_sty" className="text-sm cursor-pointer">
                  Currently studying
               </label>
            </div>

            <div className="flex gap-3 pt-2">
               <SubmitButton
                  isSubmitting={isSubmitting}
                  text={initial ? "Update" : "Save"}
               />

               <button
                  type="button"
                  onClick={onCancel}
                  className="border px-4 py-2 rounded-lg text-sm"
               >
                  Cancel
               </button>
            </div>
         </form>
      </>
   );
}
