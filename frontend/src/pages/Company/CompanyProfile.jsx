import React, { useState } from "react";
import ProfileCard from "../../components/company/ProfileCard";
import JobCard from "../../components/JobCard";
import {
   useFetchUserCompanyQuery,
   useFetchJobsbyCompanyQuery,
} from "../../services/companyService";
import CompanyForm from "../../components/company/CompanyForm";
import UserCard from "../../components/UserCard";
import UpdateUserForm from "../../components/company/UpdateUserForm";
import JobForm from "../../components/company/JobForm";
import { useGetUserQuery } from "../../services/authService";

const CompanyProfile = () => {
   const [activeSection, setActiveSection] = useState("jobs");

   const handleSectionChange = (section) => {
      setActiveSection(section);
   };
   const {
      data: companyData,
      error: companyError,
      isLoading: companyLoading,
   } = useFetchUserCompanyQuery();

   const {
      data: userData,
      error: userError,
      isLoading: userLoading,
   } = useGetUserQuery();

   const {
      data: jobsData,
      error: jobsError,
      isLoading: jobsLoading,
   } = useFetchJobsbyCompanyQuery();

   const companyDetails = {
      title: companyData?.title || "",
      location: companyData?.location || "",
      website: companyData?.website || "",
      established_date: companyData?.established_date || "",
      description: companyData?.description || "",
   };

   if (companyLoading || jobsLoading || userLoading)
      return <div>Loading...</div>;
   if (companyError) return <div>Error: {companyError.message}</div>;
   if (jobsError) return <div>Error: {jobsError.message}</div>;
   if (userError) return <div>Error: {userError.message}</div>;

   return (
      <>
         <div className="lg:flex justify-evenly">
            <ProfileCard
               initialValues={companyDetails}
               onEdit={() => handleSectionChange("updateCompany")}
               onAddJob={() => handleSectionChange("addJob")}
            />
            <UserCard
               user={userData}
               onEdit={() => handleSectionChange("updateUser")}
            />
         </div>
         {activeSection === "jobs" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-6 md:gap-y-20 p-6 mt-4 mx-0 lg:mx-20">
               {jobsData?.map((job) => (
                  <JobCard key={job.id} job={job} />
               ))}
            </div>
         )}
         {activeSection === "updateCompany" && (
            <CompanyForm
               initialValues={companyDetails}
               onClick={() => handleSectionChange("jobs")}
            />
         )}
         {activeSection === "updateUser" && (
            <UpdateUserForm
               user={userData}
               onClick={() => handleSectionChange("jobs")}
            />
         )}
         {activeSection === "addJob" && (
            <JobForm onClick={() => handleSectionChange("jobs")} />
         )}
      </>
   );
};

export default CompanyProfile;