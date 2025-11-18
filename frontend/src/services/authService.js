import { configureAuth } from "react-query-auth";
import { axiosInstance } from "./_axiosInstance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";

const { useUser, useLogin, useRegister, useLogout } = configureAuth({
   userFn: async () => {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("No access token found");

      const response = await axiosInstance.get("/auth/user/", {
         headers: {
            Authorization: `Bearer ${token}`,
         },
      });

      return response.data;
   },
   loginFn: async (credentials) => {
      try {
         const { data } = await axiosInstance.post(
            "/auth/token/",
            credentials,
            {
               skipInterceptor: true,
            }
         );
         const { access, refresh, user } = data;

         localStorage.setItem("access_token", access);
         localStorage.setItem("refresh_token", refresh);
         axiosInstance.defaults.headers.common[
            "Authorization"
         ] = `Bearer ${access}`;
         return { status: "success", user };
      } catch (error) {
         if (error.response?.data) {
            return { status: "error", data: error.response.data };
         }
         return {
            status: "error",
            data: {
               detail:
                  "Login failed. Please check your credentials and try again.",
            },
         };
      }
   },
   registerFn: async (credentials) => {
      try {
         const { data } = await axiosInstance.post(
            "/auth/register/",
            credentials
         );
         return { status: "success", data };
      } catch (error) {
         if (error.response?.status === 400) {
            return { status: "error", data: error.response.data };
         }
         return {
            status: "error",
            data: "An unexpected error occurred. Please try again.",
         };
      }
   },
   logoutFn: async () => {
      try {
         await axiosInstance.post("/auth/logout/", {
            refresh: localStorage.getItem("refresh_token"),
         });
      } catch (error) {
         console.error("Logout failed", error);
      } finally {
         localStorage.removeItem("access_token");
         localStorage.removeItem("refresh_token");
         console.log("Logout successfully.");

         window.location.href = "/login";
      }
   },
});

const getUser = async () => {
  try {
    const response = await axiosInstance.get("auth/user/");
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      console.log("User is not authenticated!");
      window.location.href = "/login";
      throw new Error("Unauthorized");
    }

    throw error;
  }
};


const useGetUserQuery = () => {
   return useQuery({
      queryKey: ["user"],
      queryFn: getUser,
      retry: false,
      staleTime: 5 * 60 * 1000,
   });
};

const updateUser = async (userData) => {
   const response = await axiosInstance.patch("auth/user/update/", userData);
   return response.data;
};

const useUpdateUserMutation = () => {
   const { updateUser: userUpdate } = useAuth();
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: updateUser,
      onSuccess: (data, variables) => {
         const user = data || variables;
         userUpdate(user);
         queryClient.invalidateQueries({ queryKey: ["user"] });
      },
   });
};

const fetchUsernames = async (userIds) => {
   const response = await axiosInstance.post('auth/users/usernames/', {
      user_ids: userIds,
   });
   return response.data;
};

const useUsernames = (userIds = []) => {
   return useQuery({
      queryKey: ['usernames', userIds], 
      queryFn: () => fetchUsernames(userIds),
      enabled: userIds.length > 0,          // prevent fetch if no IDs  
      staleTime: 1000 * 60 * 15,            // cache for 15 mins
   });
};

export {
   useUser,
   useLogin,
   useRegister,
   useLogout,
   useGetUserQuery,
   useUpdateUserMutation,
   useUsernames,
};
