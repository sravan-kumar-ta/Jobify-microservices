import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "./_axiosInstance";

// --------------------
// API Functions
// --------------------
const fetchJobMatches = async (payload) => {
   const response = await axiosInstance.post("matches/v1/generate/", payload);
   return response.data;
};

const fetchCoverLetter = async (payload) => {
   const response = await axiosInstance.post("matches/v1/generate/", payload);
   return response.data;
};

// --------------------
// Custom Hooks
// --------------------
const useGenerateJobMatches = () => {
   return useMutation({
      mutationFn: fetchJobMatches,
   });
};

const useGenerateCoverLetter = () => {
   return useMutation({
      mutationFn: fetchCoverLetter,
   });
};

export { useGenerateJobMatches, useGenerateCoverLetter };
