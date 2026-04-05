import { useState } from "react";
import { useParams } from "react-router-dom";
import { useFetchJobQuery } from "../services/companyService";
import { useGetUserQuery } from "../services/authService";
import { useFetchApplicationsQuery } from "../services/seekerService";
import UpdateJob from "../components/UpdateJob";
import JobDetailsSkeleton from "../components/company/skeletons/JobDetailsSkeleton";
import JobDetailsCard from "../components/JobDetails/JobDetailsCard";
import JobApply from "../components/JobDetails/JobApply";

const JobDetails = () => {
   const { jobId } = useParams();

   const [showUpdation, setShowUpdation] = useState(false);
   const [isApplying, setIsApplying] = useState(false);
   const [showApply, setShowApply] = useState(false);
   const [applied, setApplied] = useState(false);

   const { data: user, isLoading: isLoadingUser } = useGetUserQuery();
   const {
      data,
      isLoading: isLoadingJob,
      isError,
      error,
   } = useFetchJobQuery(jobId);

   let userRole = "";

   if (user && data) {
      if (user.role === "job_seeker") {
         userRole = "seeker";
      } else if (user.role === "admin") {
         userRole = "admin";
      } else if (user.role === "company" && user.id === data.company.user_id) {
         userRole = "owner";
      }
   }

   // Fetch applications ONLY for seekers
   const { data: applications = [], isLoading: isLoadingApplications } =
      useFetchApplicationsQuery(undefined, {
         enabled: user?.role === "job_seeker",
      });

   // Check if already applied
   const alreadyApplied =
      user?.role === "job_seeker" &&
      applications.some((application) => application.job?.id === Number(jobId));

   if (isLoadingJob || isLoadingUser) {
      return (
         <div>
            <JobDetailsSkeleton />
         </div>
      );
   }

   if (isError) {
      return <div>Error: {error.message}</div>;
   }

   return (
      <>
         <div
            className={`mx-auto px-4 sm:px-6 py-8 w-full
          ${
             showApply && !applied || showUpdation
                ? "max-w-7xl flex flex-col lg:flex-row gap-5 items-start"
                : "max-w-3xl flex flex-col gap-5"
          }`}
         >
            <JobDetailsCard
               job={data}
               userId={user.id}
               applied={alreadyApplied}
               showApply={showApply}
               isLoadingApplications={isLoadingApplications}
               setShowApply={setShowApply}
               user={userRole}
               setShowUpdation={setShowUpdation}
            />
            {showApply && <JobApply job={data} setShowApply={setShowApply} />}

            {showUpdation && (
               <UpdateJob jobDetails={data} toggle={setShowUpdation} />
            )}
         </div>
      </>
   );
};

export default JobDetails;
