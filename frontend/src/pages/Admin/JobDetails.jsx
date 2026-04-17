import { useNavigate, useParams } from "react-router-dom";
import { useFetchJobQuery } from "../../services/companyService";
import { NumericFormat } from "react-number-format";
import { techSkills } from "../../utils/TechSkills";

const JobDetails = () => {
   const { jobId } = useParams();
   const navigate = useNavigate();
   const { data, isLoading, isError, error } = useFetchJobQuery(jobId);

   if (isLoading) {
      return <div>Loading job details...</div>;
   }

   if (isError) {
      return <div>Error: {error.message}</div>;
   }

   const getLabel = (skills) => {
      return skills
         .split(",")
         .map(
            (skill) =>
               techSkills.find((t) => t.value === skill)?.label || skill,
         )
         .join(", ");
   };

   return (
      <div className="flex justify-center">
         <div className="w-full lg:w-2/6 bg-white shadow-md rounded-lg p-6 my-4">
            <div className="flex justify-between">
               <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  {data.title}
               </h2>
               <p className="text-lg text-gray-600 mb-2">
                  {data.company.title}
               </p>
            </div>
            <div className="mx-14">
               <p className="text-md text-gray-600 mb-2">
                  <strong className="mr-2">Date Posted:</strong>
                  {new Date(data.date_posted).toLocaleDateString()}
               </p>
               <p className="text-md text-gray-600 mb-2">
                  <strong className="mr-2">Salary:</strong>
                  {data.salary ? (
                     <NumericFormat
                        value={data.salary}
                        thousandSeparator={true}
                        prefix={"₹ "}
                        suffix={" LPA"}
                        displayType={"text"}
                        className="text-gray-500"
                     />
                  ) : (
                     "Not disclosed"
                  )}
               </p>
               <p className="text-md text-gray-600 mb-2">
                  <strong className="mr-2">Experience:</strong> Minimum{" "}
                  {data.experience} years.
               </p>
               <p className="text-md text-gray-600 mb-2">
                  <strong className="mr-2">Skills:</strong>{" "}
                  {getLabel(data.skills)}
               </p>
               <p className="text-md text-gray-600 mb-2">
                  <strong className="mr-2">Description:</strong>
                  {data.description}
               </p>
            </div>
            <button
               onClick={() => navigate(-1)}
               className="bg-gray-500 text-white text-xs px-2 py-1 rounded-md"
            >
               back
            </button>
         </div>
      </div>
   );
};

export default JobDetails;
