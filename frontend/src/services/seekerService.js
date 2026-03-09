import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "./_axiosInstance";

// --------------------
// API Functions
// --------------------

const fetchJobs = async () => {
   const response = await axiosInstance.get("company/jobs/");
   return response.data;
};

const fetchProfile = async () => {
   const response = await axiosInstance.get("seeker/profile/my_profile/");
   return response.data;
};

const updateProfile = async (data) => {
   const response = await axiosInstance.patch(
      "seeker/profile/my_profile/",
      data,
      {
         headers: {
            "Content-Type": "multipart/form-data",
         },
      },
   );
   return response.data;
};

const fetchResumes = async () => {
   const response = await axiosInstance.get("seeker/resume/");
   return response.data;
};

const createResume = async (data) => {
   const response = await axiosInstance.post("seeker/resume/", data, {
      headers: {
         "Content-Type": "multipart/form-data",
      },
   });
   return response.data;
};

const deleteResume = async (id) => {
   const response = await axiosInstance.delete(`seeker/resume/${id}/`);
   return response.data;
};

const fetchExperiences = async () => {
   const response = await axiosInstance.get("seeker/experience");
   return response.data;
};

const createExperience = async (data) => {
   const response = await axiosInstance.post("seeker/experience/", data);
   return response.data;
};

const deleteExperience = async (id) => {
   const response = await axiosInstance.delete(`seeker/experience/${id}/`);
   return response.data;
};

const updateExperience = async (data) => {
   const response = await axiosInstance.patch(
      `seeker/experience/${data.id}/`,
      data,
   );
   return response.data;
};

const fetchApplications = async () => {
   const response = await axiosInstance.get("company/applications/");
   return response.data;
};

const applyJob = async (data) => {
   const response = await axiosInstance.post(`company/applications/`, data);
   return response.data;
};

const fetchFilteredJobs = async (params) => {
   console.log("requesting...");
   const response = await axiosInstance.get("company/jobs/", {
      params: { ...params },
   });
   return response.data;
};

const createSkills = async (data) => {
   const response = await axiosInstance.post("seeker/skills/", data);
   return response.data;
};

const fetchSkills = async () => {
   const response = await axiosInstance.get("seeker/skills/");
   return response.data;
};

const createEducation = async (data) => {
   const response = await axiosInstance.post("seeker/education/", data);
   return response.data;
};

const fetchEducation = async () => {
   const response = await axiosInstance.get("seeker/education/");
   return response.data;
};

const updateEducation = async ({ id, data }) => {
   const response = await axiosInstance.patch(`seeker/education/${id}/`, data);
   return response.data;
};

const deleteEducation = async (id) => {
   const response = await axiosInstance.delete(`seeker/education/${id}/`);
   return response.data;
};

// --------------------
// Custom Hooks
// --------------------

const useFetchJobsQuery = () => {
   return useQuery({
      queryKey: ["allJobs"],
      queryFn: fetchJobs,
      staleTime: 5 * 60 * 1000,
   });
};

const useFetchProfileQuery = () => {
   return useQuery({
      queryKey: ["profile"],
      queryFn: fetchProfile,
      staleTime: 5 * 60 * 1000,
   });
};

const useUpdateProfileMutation = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: updateProfile,
      onSuccess: () => {
         queryClient.invalidateQueries("profile");
      },
      onError: (error) => {
         console.error("Error creating profile:", error);
      },
   });
};

const useFetchResumesQuery = () => {
   return useQuery({
      queryKey: ["resumes"],
      queryFn: fetchResumes,
      staleTime: 5 * 60 * 1000,
   });
};

const useCreateResumeMutation = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: createResume,
      onMutate: async (newResume) => {
         // optimistic updates
         await queryClient.cancelQueries({ queryKey: ["resumes"] }); // cancels any ongoing refetches
         const previousResumes = queryClient.getQueryData(["resumes"]);
         queryClient.setQueryData(["resumes"], (old) => [...old, newResume]);
         return { previousResumes };
         // If we use only invalidateQueries, there is a delay for server response
      },
      onError: (err, newResume, context) => {
         console.log(err);
         queryClient.setQueryData(["resumes"], context.previousResumes);
      },
      onSettled: () => {
         queryClient.invalidateQueries({ queryKey: ["resumes"] });
      },
   });
};

const useDeleteResumeMutation = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: deleteResume,
      onMutate: async (resumeId) => {
         // Optimistically update cache before mutation
         await queryClient.cancelQueries({ queryKey: ["resumes"] });
         const previousResumes = queryClient.getQueryData(["resumes"]);
         queryClient.setQueryData(["resumes"], (oldResumes) =>
            oldResumes.filter((resume) => resume.id !== resumeId),
         );

         return { previousResumes };
      },
      onError: (err, resumeId, context) => {
         queryClient.setQueryData(["resumes"], context.previousResumes);
      },
      onSettled: () => {
         queryClient.invalidateQueries({ queryKey: ["resumes"] });
      },
   });
};

const useFetchExperiencesQuery = () => {
   return useQuery({
      queryKey: ["experiences"],
      queryFn: fetchExperiences,
      staleTime: 5 * 60 * 1000,
   });
};

const useCreateExperienceMutation = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: createExperience,
      onMutate: async (newExp) => {
         await queryClient.cancelQueries({ queryKey: ["experiences"] });
         const previousExperiences = queryClient.getQueryData(["experiences"]);
         queryClient.setQueryData(["experiences"], (old) => [...old, newExp]);
         return { previousExperiences };
      },
      onError: (err, newExp, context) => {
         console.log(err);
         queryClient.setQueryData(["experiences"], context.previousExperiences);
      },
      onSettled: () => {
         queryClient.invalidateQueries({ queryKey: ["experiences"] });
      },
   });
};

const useDeleteExperienceMutation = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: deleteExperience,
      onMutate: async (expId) => {
         await queryClient.cancelQueries({ queryKey: ["experiences"] });
         const previousExps = queryClient.getQueryData(["experiences"]);
         queryClient.setQueryData(["experiences"], (oldExps) =>
            oldExps.filter((exp) => exp.id !== expId),
         );

         return { previousExps };
      },
      onError: (err, expId, context) => {
         queryClient.setQueryData(["experiences"], context.previousExps);
      },
      onSettled: () => {
         queryClient.invalidateQueries({ queryKey: ["experiences"] });
      },
   });
};

const useUpdateExperienceMutation = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: updateExperience,
      onMutate: async (updatedExp) => {
         console.log("values from service:", updatedExp);
         await queryClient.cancelQueries({ queryKey: ["experiences"] });
         const previousExps = queryClient.getQueryData(["experiences"]);

         queryClient.setQueryData(["experiences"], (oldExps) =>
            oldExps.map((exp) =>
               exp.id === updatedExp.id ? { ...exp, ...updatedExp } : exp,
            ),
         );

         return { previousExps };
      },
      onError: (err, updatedExp, context) => {
         console.log(err);
         queryClient.setQueryData(["experiences"], context.previousExps);
      },
      onSettled: () => {
         queryClient.invalidateQueries({ queryKey: ["experiences"] });
      },
   });
};

const useFetchApplicationsQuery = () => {
   return useQuery({
      queryKey: ["jobApplications"],
      queryFn: fetchApplications,
      staleTime: 5 * 60 * 1000,
   });
};

const useCreateApplicationMutation = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: applyJob,
      onSuccess: () => {
         queryClient.invalidateQueries(["jobApplications"]);
      },
      onError: (err) => {
         console.log(err);
      },
   });
};

const useFetchFilteredJobsQuery = (params) => {
   return useQuery({
      queryKey: ["filteredJobs", { ...params }],
      queryFn: () => fetchFilteredJobs(params),
      staleTime: 5 * 60 * 1000,
      keepPreviousData: true,
   });
};

const useCreateSkillsMutation = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: createSkills,
      onSuccess: (data) => {
         // console.log("Skills created successfully:", data);
         queryClient.setQueryData(["skills"], data);
      },
      onError: (err) => {
         console.log(err);
      },
   });
};

const useFetchSkillsQuery = () => {
   return useQuery({
      queryKey: ["skills"],
      queryFn: fetchSkills,
      staleTime: 5 * 60 * 1000,
   });
};

const useFetchEducationQuery = () => {
   return useQuery({
      queryKey: ["education"],
      queryFn: fetchEducation,
      staleTime: 5 * 60 * 1000,
   });
};

const useCreateEducationMutation = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: createEducation,

      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["education"] });
      },
   });
};

const useUpdateEducationMutation = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: updateEducation,

      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["education"] });
      },
   });
};

const useDeleteEducationMutation = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: deleteEducation,
      onSuccess: () => {
         queryClient.invalidateQueries(["education"]);
      },
   });
};

export {
   useFetchJobsQuery,
   useFetchProfileQuery,
   useUpdateProfileMutation,
   useFetchResumesQuery,
   useCreateResumeMutation,
   useDeleteResumeMutation,
   useFetchExperiencesQuery,
   useCreateExperienceMutation,
   useDeleteExperienceMutation,
   useUpdateExperienceMutation,
   useFetchApplicationsQuery,
   useCreateApplicationMutation,
   useFetchFilteredJobsQuery,
   useCreateSkillsMutation,
   useFetchSkillsQuery,
   useFetchEducationQuery,
   useCreateEducationMutation,
   useUpdateEducationMutation,
   useDeleteEducationMutation,
};
