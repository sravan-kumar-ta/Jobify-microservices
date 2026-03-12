import React, { useMemo, useState } from "react";
import {
   useCheckCompanyQuery,
   useFetchJobsbyCompanyQuery,
} from "../../services/companyService";
import ProfileCard from "../../components/company/ProfileCard";
import JobCard from "../../components/JobCard";
import CompanyForm from "../../components/company/CompanyForm";
import CompanyUpdate from "../../components/company/CompanyUpdate";
import UserCard from "../../components/UserCard";
import { useGetUserQuery } from "../../services/authService";
import JobForm from "../../components/company/JobForm";
import UpdateUserForm from "../../components/company/UpdateUserForm";
import ProfileCardSkeleton from "../../components/company/skeletons/ProfileCardSkeleton";
import JobCardSkeleton from "../../components/JobCardSkeleton";

const CompanyDashboard = () => {
   const [activeSection, setActiveSection] = useState("jobs");

   const handleSectionChange = (section) => {
      setActiveSection(section);
   };

   // Fetch company data
   const {
      data: companyData,
      error: companyError,
      isLoading: companyLoading,
      refetch: refetchCompany,
   } = useCheckCompanyQuery();

   // Fetch user data
   const {
      data: userData,
      error: userError,
      isLoading: userLoading,
   } = useGetUserQuery();

   // Fetch jobs by company
   const {
      data: jobsData,
      error: jobsError,
      isLoading: jobsLoading,
   } = useFetchJobsbyCompanyQuery();

   const hasCompany = companyData?.company_exists;

   const companyDetails = useMemo(() => {
      if (!hasCompany) return {};
      const company = companyData.company;

      return {
         title: company?.title || "",
         location: company?.location || "",
         website: company?.website || "",
         established_date: company?.established_date || "",
         description: company?.description || "",
      };
   }, [hasCompany, companyData]);

   if (companyError) return <div>Error loading company data</div>;

   return (
      <>
         <div className="lg:flex justify-evenly">
            {companyLoading ? (
               <ProfileCardSkeleton />
            ) : hasCompany ? (
               <ProfileCard
                  initialValues={companyDetails}
                  onEdit={() => handleSectionChange("updateCompany")}
                  onAddJob={() => handleSectionChange("addJob")}
               />
            ) : (
               <CompanyForm onSuccess={refetchCompany} />
            )}
            {userLoading ? (
               <ProfileCardSkeleton />
            ) : (
               <UserCard
                  user={userData}
                  onEdit={() => handleSectionChange("updateUser")}
               />
            )}
         </div>

         {jobsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-6 md:gap-y-20 p-6 mt-4 mx-0 lg:mx-20">
               <JobCardSkeleton />
            </div>
         ) : (
            activeSection === "jobs" && (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-6 md:gap-y-20 p-6 mt-4 mx-0 lg:mx-20">
                  {jobsData?.map((job) => (
                     <JobCard key={job.id} job={job} />
                  ))}
               </div>
            )
         )}
         {activeSection === "updateCompany" && (
            <CompanyUpdate
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

export default CompanyDashboard;
