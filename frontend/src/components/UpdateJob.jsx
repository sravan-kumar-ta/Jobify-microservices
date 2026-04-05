import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { HiBriefcase, HiSparkles } from "react-icons/hi";
import { IoCloseSharp } from "react-icons/io5";

import { techSkills } from "../utils/techSkills";
import { JobFormValidationSchema } from "../utils/validationSchemas";
import { useUpdateJobMutation } from "../services/companyService";

const selectStyles = {
   control: (base, state) => ({
      ...base,
      minHeight: "48px",
      borderRadius: "12px",
      borderColor: state.isFocused ? "#818cf8" : "#e2e8f0",
      boxShadow: state.isFocused
         ? "0 0 0 2px rgba(99, 102, 241, 0.12)"
         : "none",
      backgroundColor: "#f8fafc",
      "&:hover": {
         borderColor: "#c7d2fe",
      },
   }),
   valueContainer: (base) => ({
      ...base,
      padding: "4px 12px",
   }),
   placeholder: (base) => ({
      ...base,
      color: "#94a3b8",
      fontSize: "14px",
   }),
   multiValue: (base) => ({
      ...base,
      backgroundColor: "#eef2ff",
      borderRadius: "8px",
   }),
   multiValueLabel: (base) => ({
      ...base,
      color: "#4338ca",
      fontSize: "12px",
      fontWeight: 600,
   }),
   multiValueRemove: (base) => ({
      ...base,
      color: "#6366f1",
      borderRadius: "0 8px 8px 0",
      ":hover": {
         backgroundColor: "#c7d2fe",
         color: "#312e81",
      },
   }),
   menu: (base) => ({
      ...base,
      borderRadius: "12px",
      overflow: "hidden",
      zIndex: 30,
   }),
   option: (base, state) => ({
      ...base,
      fontSize: "14px",
      backgroundColor: state.isSelected
         ? "#6366f1"
         : state.isFocused
           ? "#eef2ff"
           : "#fff",
      color: state.isSelected ? "#fff" : "#334155",
      cursor: "pointer",
   }),
};

const FieldLabel = ({ children, required = false }) => (
   <label className="block text-xs font-semibold text-slate-600 uppercase tracking-widest mb-2">
      {children} {required && <span className="text-red-500">*</span>}
   </label>
);

const Input = ({ name, type = "text", placeholder, touched, errors }) => (
   <Field
      name={name}
      type={type}
      placeholder={placeholder}
      className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm text-slate-700 placeholder-slate-400 outline-none transition-all ${
         touched[name] && errors[name]
            ? "border-red-400 focus:ring-2 focus:ring-red-100"
            : "border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
      }`}
   />
);

const UpdateJob = ({ jobDetails, toggle }) => {
   const updateJobMutation = useUpdateJobMutation();
   const animatedComponents = makeAnimated();

   const [selectedSkills, setSelectedSkills] = useState(() => {
      return techSkills.filter((option) =>
         jobDetails?.skills?.includes(option.value),
      );
   });

   const initialValues = {
      title: jobDetails?.title || "",
      salary: jobDetails?.salary || "",
      skills: jobDetails?.skills || "",
      description: jobDetails?.description || "",
      experience: jobDetails?.experience || "",
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
               if (error?.response?.data) {
                  const errors = error.response.data;

                  Object.keys(errors).forEach((field) => {
                     if (Array.isArray(errors[field])) {
                        setFieldError(field, errors[field][0]);
                     } else if (typeof errors[field] === "string") {
                        setFieldError(field, errors[field]);
                     }
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
         enableReinitialize
         onSubmit={handleSubmit}
      >
         {({ isSubmitting, touched, errors, setFieldValue }) => (
            <Form className="relative bg-white border border-slate-200 rounded-2xl shadow-sm overflow-visible fade-in max-w-3xl w-full mx-auto">
               {/* Close */}
               <button
                  type="button"
                  onClick={() => toggle(false)}
                  className="absolute right-4 top-4 text-red-700 hover:text-red-800 transition-colors cursor-pointer"
               >
                  <IoCloseSharp className="w-5 h-5" />
               </button>

               {/* Header */}
               <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center">
                     <HiBriefcase className="w-3.5 h-3.5 text-indigo-500" />
                  </div>

                  <div>
                     <h2
                        className="text-sm font-semibold text-slate-800"
                        style={{ fontFamily: "'Fraunces', serif" }}
                     >
                        Update Job
                     </h2>
                     <p className="text-xs text-slate-500">
                        Edit job details for{" "}
                        <span className="font-medium text-indigo-600">
                           {jobDetails?.title || "this role"}
                        </span>
                     </p>
                  </div>
               </div>

               <div className="px-6 py-5 flex flex-col gap-6">
                  {/* Global API Error */}
                  {updateJobMutation.isError && !Object.keys(errors).length && (
                     <p className="text-xs text-center px-3 py-2 rounded-lg bg-red-50 text-red-500 border border-red-200">
                        {updateJobMutation.error?.response?.data?.detail ||
                           "Unable to update job right now."}
                     </p>
                  )}

                  {/* Row 1 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                        <FieldLabel required>Job Title</FieldLabel>
                        <Input
                           name="title"
                           placeholder="e.g. Senior Frontend Developer"
                           touched={touched}
                           errors={errors}
                        />
                        <ErrorMessage
                           name="title"
                           component="div"
                           className="text-red-500 text-xs mt-1.5"
                        />
                     </div>

                     <div>
                        <FieldLabel required>Salary in LPA</FieldLabel>
                        <Input
                           name="salary"
                           type="number"
                           placeholder="e.g. 12"
                           touched={touched}
                           errors={errors}
                        />
                        <ErrorMessage
                           name="salary"
                           component="div"
                           className="text-red-500 text-xs mt-1.5"
                        />
                     </div>
                  </div>

                  {/* Row 2 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                        <FieldLabel required>Required Skills</FieldLabel>

                        <Select
                           options={techSkills}
                           isMulti
                           components={animatedComponents}
                           closeMenuOnSelect={false}
                           value={selectedSkills}
                           styles={selectStyles}
                           placeholder="Select required skills..."
                           onChange={(selected) => {
                              const skills = selected || [];
                              setSelectedSkills(skills);
                              setFieldValue(
                                 "skills",
                                 skills.map((s) => s.value).join(","),
                              );
                           }}
                        />

                        {errors.skills && (
                           <p className="text-red-500 text-xs mt-1.5">
                              {errors.skills}
                           </p>
                        )}
                     </div>

                     <div>
                        <FieldLabel required>Experience</FieldLabel>
                        <Input
                           name="experience"
                           placeholder="e.g. 2-4 years"
                           touched={touched}
                           errors={errors}
                        />
                        <ErrorMessage
                           name="experience"
                           component="div"
                           className="text-red-500 text-xs mt-1.5"
                        />
                     </div>
                  </div>

                  {/* Description */}
                  <div>
                     <FieldLabel required>Description</FieldLabel>

                     <Field
                        as="textarea"
                        name="description"
                        rows="4"
                        placeholder="Describe the role, responsibilities, expectations, and qualifications..."
                        className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm text-slate-700 placeholder-slate-400 outline-none resize-y transition-all leading-relaxed ${
                           touched.description && errors.description
                              ? "border-red-400 focus:ring-2 focus:ring-red-100"
                              : "border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                        }`}
                     />

                     <ErrorMessage
                        name="description"
                        component="div"
                        className="text-red-500 text-xs mt-1.5"
                     />
                  </div>

                  {/* Footer CTA */}
                  <div className="flex flex-col gap-2">
                     <button
                        type="submit"
                        disabled={isSubmitting || updateJobMutation.isPending}
                        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold border-none transition-all ${
                           isSubmitting || updateJobMutation.isPending
                              ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                              : "bg-indigo-500 hover:bg-indigo-600 text-white shadow-md shadow-indigo-200 cursor-pointer"
                        }`}
                     >
                        {isSubmitting || updateJobMutation.isPending ? (
                           <>
                              <svg
                                 className="w-4 h-4 spin"
                                 viewBox="0 0 24 24"
                                 fill="none"
                              >
                                 <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                 />
                                 <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v8z"
                                 />
                              </svg>
                              Updating Job…
                           </>
                        ) : (
                           <>
                              <HiSparkles className="w-4 h-4" />
                              Update Job
                           </>
                        )}
                     </button>

                     <p className="text-[11px] text-slate-400 text-center">
                        Make sure the title, skills, and description match the
                        actual role before saving.
                     </p>
                  </div>
               </div>
            </Form>
         )}
      </Formik>
   );
};

export default UpdateJob;
