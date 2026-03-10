import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { techSkills } from "../utils/techSkills";
import InputField from "./InputField";
import SubmitButton from "./SubmitButton";
import { JobFormValidationSchema } from "../utils/validationSchemas";
import { IoCloseSharp } from "react-icons/io5";
import { useUpdateJobMutation } from "../services/companyService";

const UpdateJob = ({ jobDetails, toggle }) => {
   const updateJobMutation = useUpdateJobMutation();

   const animatedComponents = makeAnimated();

   // Convert backend skills string → react-select format
   const [selectedSkills, setSelectedSkills] = useState(() => {
      return techSkills.filter((option) =>
         jobDetails?.skills?.includes(option.value),
      );
   });

   const initialValues = {
      title: jobDetails.title || "",
      salary: jobDetails.salary || "",
      skills: jobDetails.skills || "",
      description: jobDetails.description || "",
      experience: jobDetails.experience || "",
   };

   const handleSubmit = (values, { setSubmitting, setFieldError }) => {
      const filteredValues = Object.fromEntries(
         Object.entries(values).map(([key, value]) => [
            key,
            value === "" ? null : value,
         ]),
      );

      updateJobMutation.mutate(
         {
            jobId: jobDetails.id,
            jobData: filteredValues,
         },
         {
            onSuccess: () => {
               setSubmitting(false);
               toggle(false);
            },
            onError: (error) => {
               if (error.response?.data) {
                  const errors = error.response.data;

                  Object.keys(errors).forEach((field) => {
                     setFieldError(field, errors[field][0]);
                  });
               }

               setSubmitting(false);
            },
         },
      );
   };

   return (
      <Formik
         initialValues={initialValues}
         validationSchema={JobFormValidationSchema}
         onSubmit={handleSubmit}
      >
         {({ isSubmitting, touched, errors, setFieldValue }) => (
            <Form className="max-w-lg mx-auto p-6 pt-1 bg-white rounded shadow-md mt-6 relative">
               <h1 className="text-center text-2xl my-4 font-bold">
                  Update Job
               </h1>
               <hr />

               <div className="flex space-x-11 mt-2">
                  <InputField
                     name="title"
                     label="Job Title"
                     touched={touched}
                     errors={errors}
                  />

                  <InputField
                     name="salary"
                     label="Salary in LPA"
                     touched={touched}
                     errors={errors}
                  />
               </div>

               <div className="flex space-x-11 mt-2">
                  {/* Skills */}
                  <div className="flex flex-col w-full">
                     <label className="block text-gray-700 font-bold mb-2">
                        Required Skills
                     </label>

                     <Select
                        options={techSkills}
                        isMulti
                        components={animatedComponents}
                        closeMenuOnSelect={false}
                        value={selectedSkills}
                        placeholder="Select skills..."
                        onChange={(selected) => {
                           const skills = selected || [];

                           setSelectedSkills(skills);

                           // sync with Formik
                           setFieldValue(
                              "skills",
                              skills.map((s) => s.value).join(","),
                           );
                        }}
                     />

                     {errors.skills && (
                        <p className="text-red-500 text-sm mt-1">
                           {errors.skills}
                        </p>
                     )}
                  </div>

                  <InputField
                     name="experience"
                     label="Experience"
                     touched={touched}
                     errors={errors}
                  />
               </div>

               {/* Description */}
               <div className="mb-4">
                  <label className="block text-gray-700 font-bold mb-2">
                     Description
                  </label>

                  <Field
                     as="textarea"
                     name="description"
                     rows="3"
                     className={`block w-full px-3 py-2 border rounded-md shadow-sm
                        ${
                           touched.description && errors.description
                              ? "border-red-500"
                              : "border-gray-300"
                        }`}
                  />

                  <ErrorMessage
                     name="description"
                     component="div"
                     className="text-red-500 text-sm mt-1"
                  />
               </div>

               <div className="flex items-center justify-between">
                  <SubmitButton
                     isSubmitting={isSubmitting || updateJobMutation.isPending}
                     text="Update Job"
                  />
               </div>

               <button
                  onClick={() => toggle(false)}
                  className="absolute top-2 right-2 rounded-full bg-zinc-100 p-1 text-2xl text-red-400 hover:bg-zinc-200 hover:text-red-600 shadow-xl"
               >
                  <IoCloseSharp />
               </button>
            </Form>
         )}
      </Formik>
   );
};

export default UpdateJob;
