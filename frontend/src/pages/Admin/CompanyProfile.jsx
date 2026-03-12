import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaLocationDot, FaCalendarDays } from "react-icons/fa6";
import { IoMdOpen } from "react-icons/io";
import { useUpdateCompanyStatusMutation } from "../../services/adminService";
import { SlClose } from "react-icons/sl";

const CompanyProfile = () => {
   const location = useLocation();
   const navigate = useNavigate();
   const { company } = location.state || {};
   const [approved, setApproved] = useState(company.is_active);

   const { mutate } = useUpdateCompanyStatusMutation();

   const handleToggleApproval = () => {
      const newStatus = !approved;
      setApproved(newStatus);

      mutate({
         company_id: company.id,
         is_active: newStatus,
      });
   };

   return (
      <div className="lg:w-3/5 xl:w-2/5 mx-auto bg-white rounded-lg shadow-lg p-5 mt-4">
         <div className="flex items-center justify-between">
            <h2 className="text-3xl tracking-wider font-bold text-slate-700">
               {company.title}
            </h2>
            <button onClick={() => navigate(-1)} className="text-xl">
               <SlClose className="cursor-pointer text-red-400 font-bold" />
            </button>
         </div>
         <div className="flex mt-4 gap-5">
            <div className="flex">
               <FaLocationDot className="text-amber-900 mr-1" size={18} />
               <span className="text-neutral-600 font-semibold tracking-wide">
                  {company.location}
               </span>
            </div>
            <div className="flex">
               <FaCalendarDays className="text-emerald-500 mr-1" size={18} />
               <span className="text-neutral-600 font-semibold tracking-wide">
                  {company.established_date || "Not added."}
               </span>
            </div>
         </div>
         <div className="flex mt-4">
            <h3 className="text-neutral-600 font-semibold mr-2">Website :</h3>
            {company.website ? (
               <a
                  href={company.website}
                  target="_blank"
                  className="text-blue-600 hover:underline flex items-center"
               >
                  Open
                  <IoMdOpen className="ml-1 text-blue-600" />
               </a>
            ) : (
               <span className="text-neutral-600 tracking-wide">
                  Not added.
               </span>
            )}
         </div>
         <p className="mt-1 p-3 text-neutral-600">
            {company.description || "Description not added."}
         </p>
         <div className="flex items-center mt-4">
            <span className="text-neutral-600 font-semibold">Status:</span>
            <span className="ml-2 text-sm font-medium text-neutral-600">
               {approved
                  ? "The company is approved."
                  : "The company is pending approval."}
            </span>
            <span className="ml-1 text-sm font-medium text-blue-900">
               {approved ? "Revoke approval?" : "Approve?"}
            </span>
            <label className="inline-flex items-center cursor-pointer">
               <input
                  type="checkbox"
                  checked={approved}
                  className="sr-only peer"
                  onChange={handleToggleApproval}
               />
               <div className="relative left-2 w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600"></div>
            </label>
         </div>
      </div>
   );
};

export default CompanyProfile;
