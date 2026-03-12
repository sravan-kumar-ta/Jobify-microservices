import React from "react";

const SubmitButton = ({
   type = "submit",
   text = "Submit",
   loadText = "Processing...",
   isSubmitting,
}) => {
   return (
      <button
         type={type}
         disabled={isSubmitting}
         className={`mx-auto w-2/4 bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center justify-center ${
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
         {isSubmitting ? loadText : text}
      </button>
   );
};

export default SubmitButton;
