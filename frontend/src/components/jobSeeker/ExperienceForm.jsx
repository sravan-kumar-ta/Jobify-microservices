import React from "react";
import { Formik, Field, Form } from "formik";
import { ExperienceValidationSchema } from "../../utils/validationSchemas";
import InputField from "../InputField";
import SubmitButton from "../SubmitButton";
import {
   useCreateExperienceMutation,
   useUpdateExperienceMutation,
} from "../../services/seekerService";

const ExperienceForm = ({
   setIsAddingExp,
   updationValues = null,
   setIsUpdatingExp,
}) => {
   const { mutate, isLoading, isError, error } = useCreateExperienceMutation();
   const updateExperienceMutation = useUpdateExperienceMutation();

   const initialValues = {
      job_title: updationValues?.job_title || "",
      company: updationValues?.company || "",
      start_date: updationValues?.start_date || "",
      end_date: updationValues?.end_date || "",
      is_current: updationValues?.is_current || false,
   };

   const handleSubmit = (values, { setSubmitting }) => {
      const payload = { ...values };
      if (payload.is_current) {
         delete payload.end_date;
      }

      if (updationValues) {
         console.log("updatingg.....");
         updateExperienceMutation.mutate(
            { id: updationValues.id, ...payload },
            {
               onSuccess: () => {
                  setIsAddingExp(false);
                  setIsUpdatingExp(false);
                  console.log(
                     `Experience with id ${updationValues.id} updated successfully.`,
                  );
               },
               onError: (error) => {
                  console.error("Error updating experience:", error);
               },
               onSettled: () => {
                  setSubmitting(false);
               },
            },
         );
      } else {
         mutate(payload, {
            onSuccess: () => {
               setIsAddingExp(false);
            },
            onError: (error) => {
               console.error("Error creating experience:", error);
            },
            onSettled: () => {
               setSubmitting(false);
            },
         });
      }
   };

   return (
      <Formik
         initialValues={initialValues}
         validationSchema={ExperienceValidationSchema}
         onSubmit={handleSubmit}
      >
         {({ values, touched, errors, isSubmitting }) => (
            <Form className="border border-green-200 rounded px-2 py-4">
               <InputField
                  name="job_title"
                  label="Job Title"
                  placeholder="Job Title"
                  touched={touched}
                  errors={errors}
               />
               <InputField
                  name="company"
                  label="Company"
                  placeholder="Company Title"
                  touched={touched}
                  errors={errors}
               />

               <InputField
                  name="start_date"
                  label="Start Date"
                  type="month"
                  touched={touched}
                  errors={errors}
               />

               <InputField
                  name="end_date"
                  label="End Date"
                  type="month"
                  touched={touched}
                  errors={errors}
                  disabled={values.is_current}
               />

               <div className="flex items-center justify-between ps-4 border border-gray-200 rounded dark:border-gray-700 py-2 mb-3">
                  <label
                     htmlFor="is_current"
                     className="block text-gray-700 font-bold cursor-pointer"
                  >
                     Current Position
                  </label>
                  <Field
                     type="checkbox"
                     id="is_current"
                     name="is_current"
                     className="cursor-pointer w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 mr-4"
                  />
               </div>

               <SubmitButton
                  isSubmitting={isSubmitting}
                  text={updationValues ? "Update" : "Add"}
               />
            </Form>
         )}
      </Formik>
   );
};

export default ExperienceForm;
