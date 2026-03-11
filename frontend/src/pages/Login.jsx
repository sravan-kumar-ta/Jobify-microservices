import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
   HiUser,
   HiLockClosed,
   HiEye,
   HiEyeOff,
   HiLightningBolt,
} from "react-icons/hi";
import { useLogin, useLogout } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { loginSchema } from "../utils/zodValidation";
import AuthInputField from "../components/AuthInputField";

const LoginForm = () => {
   const [showPass, setShowPass] = useState(false);
   const [errorMessage, setErrorMessage] = useState("");

   const { mutateAsync: login } = useLogin();
   const { mutateAsync: logout } = useLogout();
   const { updateUser } = useAuth();
   const navigate = useNavigate();
   const location = useLocation();

   const username = location.state?.username || "";

   const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
   } = useForm({
      resolver: zodResolver(loginSchema),
      defaultValues: {
         username,
         password: "",
      },
   });

   const onSubmit = async (values) => {
      setErrorMessage("");

      try {
         const response = await login(values);

         if (response?.status === "success") {
            const role = response.user?.role;
            updateUser(response.user);

            if (role === "admin") {
               navigate("/admin/dashboard");
            } else if (role === "company") {
               navigate("/company/dashboard");
            } else if (role === "job_seeker") {
               navigate("/");
            } else {
               await logout();
            }
         } else {
            setErrorMessage(
               response?.data?.detail ||
                  "Invalid credentials. Please try again.",
            );
         }
      } catch (error) {
         setErrorMessage("Something went wrong. Please try again.");
      }
   };

   return (
      <>
         <div className="min-h-screen bg-slate-50 flex">
            {/* Left Panel */}
            <div className="hidden lg:flex lg:w-5/12 bg-gradient-to-br from-indigo-500 via-violet-500 to-indigo-600 flex-col justify-between p-12 relative overflow-hidden">
               <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-white/5" />
               <div className="absolute bottom-10 -right-16 w-64 h-64 rounded-full bg-white/5" />
               <div className="absolute top-1/2 left-1/3 w-40 h-40 rounded-full bg-violet-400/10" />

               <div className="flex items-center gap-2.5 relative z-10">
                  <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                     <HiLightningBolt className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white font-semibold text-base tracking-tight">
                     Jobify
                  </span>
               </div>

               <div className="relative z-10">
                  <h1
                     className="text-4xl font-bold text-white leading-tight mb-4"
                     style={{ fontFamily: "'Fraunces', serif" }}
                  >
                     Welcome back.
                     <br />
                     Let’s get you hired.
                  </h1>
                  <p className="text-indigo-200 text-sm leading-relaxed max-w-xs">
                     Sign in to manage applications, connect with companies, and
                     keep your profile ready for the next opportunity.
                  </p>
               </div>

               <div className="flex gap-8 relative z-10">
                  {[
                     ["12k+", "Companies"],
                     ["85k+", "Job Listings"],
                     ["200k+", "Candidates"],
                  ].map(([num, label]) => (
                     <div key={label}>
                        <p
                           className="text-white font-bold text-xl"
                           style={{ fontFamily: "'Fraunces', serif" }}
                        >
                           {num}
                        </p>
                        <p className="text-indigo-300 text-xs mt-0.5">
                           {label}
                        </p>
                     </div>
                  ))}
               </div>
            </div>

            {/* Right Panel */}
            <div className="flex-1 flex items-center justify-center px-5 py-12">
               <div className="w-full max-w-md">
                  {/* Mobile logo */}
                  <div className="flex items-center gap-2 mb-8 lg:hidden">
                     <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center">
                        <HiLightningBolt className="w-3.5 h-3.5 text-white" />
                     </div>
                     <span className="text-sm font-semibold text-slate-800">
                        WorkFolio
                     </span>
                  </div>

                  <h2
                     className="text-2xl font-bold text-slate-800 mb-1"
                     style={{ fontFamily: "'Fraunces', serif" }}
                  >
                     Sign in
                  </h2>
                  <p className="text-sm text-slate-500 mb-8">
                     Don&apos;t have an account?{" "}
                     <Link
                        to="/register"
                        className="text-indigo-600 font-medium hover:text-indigo-700 no-underline"
                     >
                        Create one
                     </Link>
                  </p>

                  <form
                     onSubmit={handleSubmit(onSubmit)}
                     className="flex flex-col gap-4"
                  >
                     <AuthInputField
                        label="Username"
                        placeholder="Enter your username"
                        icon={HiUser}
                        registration={register("username")}
                        error={errors.username}
                     />

                     <AuthInputField
                        label="Password"
                        type={showPass ? "text" : "password"}
                        placeholder="Enter your password"
                        icon={HiLockClosed}
                        registration={register("password")}
                        error={errors.password}
                        rightElement={
                           <button
                              type="button"
                              onClick={() => setShowPass((prev) => !prev)}
                              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer transition-colors"
                           >
                              {showPass ? (
                                 <HiEyeOff className="w-4 h-4" />
                              ) : (
                                 <HiEye className="w-4 h-4" />
                              )}
                           </button>
                        }
                     />

                     {errorMessage && (
                        <div className="text-sm text-rose-500 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
                           {errorMessage}
                        </div>
                     )}

                     <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-2.5 mt-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold shadow-md shadow-indigo-200 transition-all border-none cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                     >
                        {isSubmitting ? (
                           <span className="flex items-center justify-center gap-2">
                              <svg
                                 className="w-4 h-4 animate-spin"
                                 viewBox="0 0 24 24"
                                 fill="none"
                              >
                                 <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                 />
                                 <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v8z"
                                 />
                              </svg>
                              Signing in...
                           </span>
                        ) : (
                           "Sign In"
                        )}
                     </button>
                  </form>
               </div>
            </div>
         </div>
      </>
   );
};

export default LoginForm;
