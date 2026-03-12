import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { useCreateResumeMutation } from "../../services/seekerService";

const validationSchema = Yup.object().shape({
   resume_title: Yup.string().required("Resume title is required."),
   resume: Yup.mixed()
      .required("Resume is required.")
      .test(
         "fileSize",
         "File size is too large",
         (value) => value && value.size <= 2 * 1024 * 1024, // 2MB size limit
      )
      .test(
         "fileFormat",
         "Unsupported Format",
         (value) =>
            value &&
            ["application/pdf", "application/msword"].includes(value.type),
      ),
});

const initialValues = {
   resume_title: "",
   resume: null,
};

const AddResume = ({ setIsAddingResume }) => {
   const createResumeMutation = useCreateResumeMutation();

   const handleSubmit = (values, { setSubmitting }) => {
      createResumeMutation.mutate(values, {
         onSuccess: () => {
            setIsAddingResume(false);
         },
         onError: (error) => {
            if (error.response && error.response.data) {
               const errors = error.response.data;
               Object.keys(errors).forEach((field) => {
                  setFieldError(field, errors[field][0]);
               });
            }
         },
         onSettled: () => {
            setSubmitting(false);
         },
      });
   };

   return (
      <Formik
         initialValues={initialValues}
         validationSchema={validationSchema}
         onSubmit={handleSubmit}
      >
         {({ isSubmitting, touched, errors, setFieldValue }) => (
            <Form
               encType="multipart/form-data"
               className="border border-green-200 rounded px-2 py-4"
            >
               <Field
                  type="text"
                  name="resume_title"
                  placeholder="Resume title"
                  className={`block w-full px-3 py-2 border rounded-2xl shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                     touched["resume_title"] && errors["resume_title"]
                        ? "border-red-500"
                        : touched["resume_title"]
                          ? "border-green-500"
                          : "border-gray-300"
                  }`}
               />

               <ErrorMessage
                  name="resume_title"
                  component="div"
                  className="text-red-500 text-sm mt-1 pl-4"
               />

               <input
                  type="file"
                  name="resume"
                  className={`border rounded-2xl block w-full mt-3 text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 ${
                     touched["resume"] && errors["resume"]
                        ? "border-red-500"
                        : touched["resume"]
                          ? "border-green-500"
                          : "border-gray-300"
                  }`}
                  onChange={(event) => {
                     const file = event.target.files[0];
                     setFieldValue("resume", file);
                  }}
               />

               <ErrorMessage
                  name="resume"
                  component="div"
                  className="text-red-500 text-sm mt-1 pl-4"
               />

               <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`mx-auto px-4 mt-3 bg-indigo-500 text-sm text-white py-1 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center justify-center ${
                     isSubmitting ? "cursor-not-allowed opacity-50" : ""
                  }`}
               >
                  {isSubmitting && (
                     <svg
                        className="animate-spin h-5 w-5 mr-3 text-white"
                        viewBox="0 0 24 24"
                     >
                        <circle
                           className="opacity-25"
                           cx="12"
                           cy="12"
                           r="10"
                           stroke="currentColor"
                           strokeWidth="4"
                        ></circle>
                        <path
                           className="opacity-75"
                           fill="currentColor"
                           d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zM2 12a10 10 0 0010 10v-4a6 6 0 01-6-6H2z"
                        ></path>
                     </svg>
                  )}
                  {isSubmitting ? "Uploading..." : "Upload"}
               </button>
            </Form>
         )}
      </Formik>
   );
};

export default AddResume;
