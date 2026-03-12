import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { educationSchema } from "../../utils/zodValidation";
import {
   useCreateEducationMutation,
   useUpdateEducationMutation,
} from "../../services/seekerService";
import SubmitButton from "../SubmitButton";

export default function EducationForm({ initial, onCancel, onSuccess }) {
   const { mutate: createEducation, isPending: isCreating } =
      useCreateEducationMutation();

   const { mutate: updateEducation, isPending: isUpdating } =
      useUpdateEducationMutation();

   const title = initial ? "Update Education" : "Add Education";

   const normalizedInitial = initial
      ? {
           ...initial,
           is_current:
              initial.end_year == null || initial.end_year === ""
                 ? true
                 : (initial.is_current ?? false),
        }
      : null;

   const {
      register,
      handleSubmit,
      watch,
      setValue,
      formState: { errors },
   } = useForm({
      resolver: zodResolver(educationSchema),
      defaultValues: normalizedInitial || {
         degree: "",
         institution: "",
         start_year: "",
         end_year: "",
         is_current: false,
      },
   });

   const is_current = watch("is_current");
   const isSubmitting = isCreating || isUpdating;

   useEffect(() => {
      if (is_current) {
         setValue("end_year", "");
      }
   }, [is_current, setValue]);

   const onSubmit = (data) => {
      if (normalizedInitial?.id) {
         updateEducation({ id: normalizedInitial.id, data }, { onSuccess });
      } else {
         createEducation(data, { onSuccess });
      }
   };

   return (
      <>
         <div className="flex mb-2">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 text-base">
                  🎓
               </div>
               <h2 className="text-sm sm:text-base font-semibold tracking-wide text-slate-800">
                  {title}
               </h2>
            </div>
         </div>

         <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white border rounded-xl p-5 space-y-4"
         >
            <div>
               <label className="text-sm">Degree</label>
               <input
                  {...register("degree")}
                  disabled={isSubmitting}
                  className="w-full border rounded px-3 py-2 text-sm disabled:bg-slate-100 disabled:cursor-not-allowed"
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
                  disabled={isSubmitting}
                  className="w-full border rounded px-3 py-2 text-sm disabled:bg-slate-100 disabled:cursor-not-allowed"
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
                     disabled={isSubmitting}
                     className="w-full border rounded px-3 py-2 text-sm disabled:bg-slate-100 disabled:cursor-not-allowed"
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
                     disabled={is_current || isSubmitting}
                     {...register("end_year")}
                     className="w-full border rounded px-3 py-2 text-sm disabled:bg-slate-100 disabled:cursor-not-allowed"
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
                  {...register("is_current")}
                  id="crr_sty"
                  disabled={isSubmitting}
                  className="h-4 w-4 cursor-pointer disabled:cursor-not-allowed"
               />
               <label htmlFor="crr_sty" className="text-sm cursor-pointer">
                  Currently studying
               </label>
            </div>

            <div className="flex gap-3 pt-2">
               <SubmitButton
                  isSubmitting={isSubmitting}
                  text={normalizedInitial ? "Update" : "Save"}
               />

               <button
                  type="button"
                  onClick={onCancel}
                  disabled={isSubmitting}
                  className="border border-red-400 text-red-500 font-medium hover:bg-red-100 px-3 py-1 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
               >
                  Cancel
               </button>
            </div>
         </form>
      </>
   );
}
