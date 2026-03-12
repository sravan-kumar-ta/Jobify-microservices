import React, { useState } from "react";
import {
   useCreateApplicationMutation,
   useFetchResumesQuery,
} from "../../services/seekerService";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";
import SubmitButton from "../../components/SubmitButton";

const ApplyJob = ({ setIsApplying, jobId }) => {
   const [isResumeNull, setIsResumeNull] = useState(false);
   const { data, isLoading } = useFetchResumesQuery();
   const { mutate, isError, error } = useCreateApplicationMutation();
   const navigate = useNavigate();

   const handleSubmit = (values, { setSubmitting }) => {
      console.log("values", values);

      setIsResumeNull(false);
      if (!values.resume_id) {
         setIsResumeNull(true);
         setSubmitting(false);
      } else {
         mutate(
            // { resume_id: values.resume_id, cover_letter, job: jobId },
            { ...values, job: jobId },
            {
               onSuccess: () => {
                  setIsApplying(false);
                  navigate("/");
                  setSubmitting(false);
               },
               onError: () => {
                  setSubmitting(false);
               },
            },
         );
      }
   };

   return (
      <Formik
         initialValues={{ resume: "", cover_letter: "" }}
         onSubmit={handleSubmit}
      >
         {({ isSubmitting }) => (
            <Form className="lg:w-3/5 xl:w-2/5 mx-auto bg-white rounded-lg shadow-lg p-6 relative">
               {isError && (
                  <p className="text-center mx-auto w-3/6 p-2 border border-red-300 mb-2 text-red-400">
                     {error.response.data.detail}
                  </p>
               )}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 items-start mb-4">
                  {/* Resume Selection */}
                  <div
                     className={`border rounded-md ${
                        isResumeNull ? "border-red-400" : "border-blue-200"
                     } px-3`}
                  >
                     <p className="text-center font-bold text-gray-600 p-3">
                        Select Resume
                     </p>
                     <hr />
                     {isResumeNull && (
                        <p className="text-sm text-center text-red-500">
                           A resume must be selected.
                        </p>
                     )}

                     {isLoading ? (
                        <div className="bg-slate-50 p-3 my-3">Loading...</div>
                     ) : (
                        data?.map((resume) => (
                           <div
                              key={resume.id}
                              className="flex items-center ps-3 bg-slate-50 hover:bg-slate-300 my-2 shadow-md hover:shadow-sm"
                           >
                              <Field
                                 type="radio"
                                 name="resume_id"
                                 value={String(resume.id)}
                                 id={`resume-list-${resume.id}`}
                                 className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 cursor-pointer"
                                 onClick={() => setIsResumeNull(false)}
                              />
                              <label
                                 htmlFor={`resume-list-${resume.id}`}
                                 className="w-full py-3 ms-2 text-sm font-medium text-gray-900 cursor-pointer"
                              >
                                 {resume.resume_title}
                              </label>
                           </div>
                        ))
                     )}
                     <ErrorMessage
                        name="resume"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                     />
                  </div>

                  {/* Cover Letter */}
                  <div className="border rounded-md border-blue-200 px-3">
                     <p className="text-center font-bold text-gray-600 p-3">
                        Cover Letter
                     </p>
                     <hr />
                     <Field
                        as="textarea"
                        name="cover_letter"
                        cols="33"
                        rows="5"
                        placeholder="Write your cover letter here..."
                        className="w-full my-2 text-sm p-2.5 text-gray-800 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                     />
                     <ErrorMessage
                        name="cover_letter"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                     />
                  </div>
               </div>

               {/* Submit Button */}
               <SubmitButton
                  type="submit"
                  text="Apply"
                  loadText="Applying..."
                  isSubmitting={isSubmitting}
               />
               {/* Close Button */}
               <IoMdCloseCircleOutline
                  onClick={() => setIsApplying(false)}
                  className="text-red-600 cursor-pointer absolute right-1 top-1"
                  size={21}
               />
            </Form>
         )}
      </Formik>
   );
};

export default ApplyJob;
