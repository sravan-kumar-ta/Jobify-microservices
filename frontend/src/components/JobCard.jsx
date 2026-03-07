import React from "react";
import { FaRegBuilding } from "react-icons/fa";
import { MdCalendarMonth } from "react-icons/md";
import { GiMoneyStack } from "react-icons/gi";
import { FaLocationDot } from "react-icons/fa6";
import { SiHyperskill } from "react-icons/si";
import { Link } from "react-router-dom";
import { NumericFormat } from "react-number-format";

const JobCard = ({ btn_text = "Apply", job = null }) => {
   const excerpt = (text, length) => {
      if (text.length <= length) return text;
      return text.substring(0, length) + "...";
   };

   let btnLink = `/job/${job.id}`;

   return (
      <div className="md:w-11/12 w-full mx-auto bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 relative">
         <span className="text-gray-600 bg-gray-100 py-1 px-2 rounded-bl-lg absolute top-0 right-0">
            {job.employment_type}
         </span>

         <header className="p-4">
            <h2 className="text-xl font-semibold text-gray-800">{job.title}</h2>
         </header>
         <hr />

         <div className="flex items-center ml-4 mt-2">
            <FaRegBuilding className="text-gray-700 mr-1" />
            <p className="text-gray-600">{job.company.title}</p>
         </div>

         <div className="flex items-center ml-4">
            <GiMoneyStack className="text-gray-700 mr-1" />
            {/* <p className="text-gray-500">{job.salary || "Not disclosed"} LPA</p> */}
            {job.salary ? (
               <NumericFormat
                  value={job.salary}
                  thousandSeparator={true}
                  prefix={"₹ "}
                  suffix={" LPA"}
                  displayType={"text"}
                  className="text-gray-500"
               />
            ) : (
               "Not disclosed"
            )}
         </div>
         <div className="flex items-center ml-4">
            <FaLocationDot className="text-gray-600 mr-1" />
            <p className="text-gray-600">{job.company.location}</p>
         </div>

         <div className="flex items-center ml-4 mb-2">
            <SiHyperskill className="text-gray-700 mr-1" />
            <p className="text-gray-500">
               {job.skills.slice(0, 20) || "Not disclosed"}, etc...
            </p>
         </div>
         <div className="flex items-center ml-4 mb-2">
            <MdCalendarMonth className="text-gray-700 mr-1" />
            <p className="text-gray-500">
               Minimum {job.experience || "Not disclosed"} years.
            </p>
         </div>
         <hr />

         <section className="px-4 pb-4 mt-2">
            <p className="text-gray-700">
               {excerpt(job.description, 20)}
               <a
                  href={btnLink}
                  // onClick={(e) => e.preventDefault()}
                  className="text-blue-600 hover:text-blue-800"
               >
                  {" "}
                  Read more...
               </a>
            </p>
         </section>

         <footer className="px-4 py-4 bg-gray-100 border-t border-gray-200 text-center">
            <Link
               to={btnLink}
               className="bg-blue-600 text-white text-sm font-semibold py-2 px-5 rounded hover:bg-blue-700 transition-colors duration-300"
            >
               {btn_text}
            </Link>
         </footer>
      </div>
   );
};

export default JobCard;
