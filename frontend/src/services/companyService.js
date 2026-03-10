import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "./_axiosInstance";

// --------------------
// API Functions
// --------------------

const checkCompany = async () => {
   const response = await axiosInstance.get("company/check-company/");
   return response.data;
};

const createCompany = async (companyData) => {
   console.log("Creating company with data:", companyData);   
   const response = await axiosInstance.post("company/companies/", companyData);
   return response.data;
};

const fetchUserCompany = async () => {
   const response = await axiosInstance.get("company/user-company/");
   return response.data;
};

const fetchJobListbyCompany = async () => {
   const response = await axiosInstance.get("company/company-jobs/");
   return response.data;
};

const updateUserCompany = async (companyData) => {
   const response = await axiosInstance.patch(
      "company/user-company/",
      companyData
   );
   return response.data;
};

const createJob = async (jobData) => {
   console.log("Creating job with data:", jobData);
   const response = await axiosInstance.post("company/jobs/", jobData);
   return response.data;
};

const fetchJob = async (jobId) => {
   const response = await axiosInstance.get(`company/jobs/${jobId}/`);
   return response.data;
};

const updateJob = async ({ jobId, jobData }) => {
   const response = await axiosInstance.patch(
      `company/company-jobs/${jobId}/`,
      jobData
   );
   return response.data;
};

const fetchFilteredApplications = async (jobID, status) => {
   const response = await axiosInstance.get(
      "company/applications/filter_applications/",
      {
         params: { jobID, status },
      }
   );
   return response.data;
};

const fetchUserResume = async (resumeId) => {
   const response = await axiosInstance.get(`seeker/resume/${resumeId}/`);
   return response.data;
}

const updateApplication = async ({ id, data }) => {
   const response = await axiosInstance.patch(
      `company/applications/${id}/`,
      data
   );
   return response.data;
};

// --------------------
// Custom Hooks
// --------------------

const useCheckCompanyQuery = () => {
   return useQuery({
      queryKey: ["company"],
      queryFn: checkCompany,
      staleTime: 5 * 60 * 1000,
   });
};

const useCreateCompanyQuery = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: createCompany,
      onSuccess: (data) => {
         queryClient.invalidateQueries({ queryKey: ["userCompany"] });
         console.log("Company created successfully.");
      },
      onError: (error) => {
         console.error("Error creating comapany:", error);
      },
   });
};

const useFetchUserCompanyQuery = () => {
   return useQuery({
      queryKey: ["userCompany"],
      queryFn: fetchUserCompany,
      staleTime: 5 * 60 * 1000,
   });
};

const useFetchJobsbyCompanyQuery = () => {
   return useQuery({
      queryKey: ["company-jobs"],
      queryFn: fetchJobListbyCompany,
      staleTime: 5 * 60 * 1000,
   });
};

const useUpdateCompanyMutation = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: updateUserCompany,
      onSuccess: (data) => {
         // queryClient.invalidateQueries({ queryKey: ["userCompany"] });
         queryClient.invalidateQueries({ queryKey: ["company"] });
         // console.log("Company updated successfully");
      },
      onError: (error) => {
         console.error("Error updating company:", error);
      },
   });
};

const useCreateJobMutation = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: createJob,
      onSuccess: (data) => {
         queryClient.invalidateQueries({ queryKey: ["company-jobs"] });
         console.log("Job created successfully:", data);
      },
      onError: (error) => {
         console.error("Error creating job:", error);
      },
   });
};

const useFetchJobQuery = (jobId) => {
   return useQuery({
      queryKey: ["job" + jobId],
      queryFn: () => fetchJob(jobId),
      staleTime: 5 * 60 * 1000,
      enabled: !!jobId, // Only run the query if jobId is truthy
   });
};

const useUpdateJobMutation = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: updateJob,
      onSuccess: (data, variables) => {
         queryClient.invalidateQueries({ queryKey: ["job" + variables.jobId] });
         queryClient.invalidateQueries({ queryKey: ["company-jobs"] });
      },
      onError: (error) => {
         console.error("Error updating job:", error);
      },
   });
};

const useFilteredApplicationsQuery = (jobID, status) => {
   return useQuery({
      queryKey: ["applications", jobID, status],
      queryFn: () => fetchFilteredApplications(jobID, status),
      enabled: !!jobID,
      staleTime: 5 * 60 * 1000,
   });
};

const useUserResumeQuery = (resumeId) => {
   return useQuery({
      queryKey: ["resume", resumeId],
      queryFn: () => fetchUserResume(resumeId),
      enabled: !!resumeId, // Only run the query if resumeId is truthy
      staleTime: 5 * 60 * 1000,
   });
}

const useUpdateApplicationMutation = (jobID, prevStatus, newStatus) => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: updateApplication,
      onSuccess: () => {
         queryClient.invalidateQueries(["applications", jobID, prevStatus]);
         queryClient.invalidateQueries(["applications", jobID, newStatus]);
      },

      onError: (err) => {
         console.error("Error:", err);
      },
   });
};

export {
   useCheckCompanyQuery,
   useCreateCompanyQuery,
   useFetchUserCompanyQuery,
   useUpdateCompanyMutation,
   useCreateJobMutation,
   useFetchJobsbyCompanyQuery,
   useFetchJobQuery,
   useUpdateJobMutation,
   useFilteredApplicationsQuery,
   useUserResumeQuery,
   useUpdateApplicationMutation,
};
