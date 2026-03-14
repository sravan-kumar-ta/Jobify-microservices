import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
   HiUser,
   HiMail,
   HiLockClosed,
   HiEye,
   HiEyeOff,
   HiLightningBolt,
   HiBriefcase,
   HiIdentification,
} from "react-icons/hi";
import { useRegister } from "../services/authService";
import { registerSchema } from "../utils/zodValidation";
import AuthInputField from "../components/AuthInputField";

const Register = () => {
   const { mutateAsync: registerUser } = useRegister();
   const navigate = useNavigate();

   const [showPass, setShowPass] = useState(false);
   const [showConf, setShowConf] = useState(false);

   const {
      register,
      handleSubmit,
      watch,
      setError,
      setValue,
      formState: { errors, isSubmitting },
   } = useForm({
      resolver: zodResolver(registerSchema),
      defaultValues: {
         first_name: "",
         last_name: "",
         username: "",
         email: "",
         password: "",
         confirmPassword: "",
         role: "job_seeker",
      },
   });

   const password = watch("password");
   const confirmPassword = watch("confirmPassword");
   const selectedRole = watch("role");

   const onSubmit = async (values) => {
      try {
         const { status, data } = await registerUser({
            first_name: values.first_name,
            last_name: values.last_name,
            username: values.username,
            email: values.email,
            password: values.password,
            role: values.role,
         });

         if (status === "success") {
            navigate("/login", { state: { username: values.username } });
         } else if (status === "error") {
            if (typeof data === "object" && data !== null) {
               Object.keys(data).forEach((field) => {
                  const msg = Array.isArray(data[field])
                     ? data[field][0]
                     : data[field];

                  // backend safety mapping
                  const fieldMap = {
                     first_name: "first_name",
                     last_name: "last_name",
                     username: "username",
                     email: "email",
                     password: "password",
                     role: "role",
                  };

                  const mappedField = fieldMap[field];

                  if (mappedField) {
                     setError(mappedField, { type: "server", message: msg });
                  } else {
                     setError("root.serverError", {
                        type: "server",
                        message: msg,
                     });
                  }
               });
            } else {
               setError("root.serverError", {
                  type: "server",
                  message: data || "Registration failed. Please try again.",
               });
            }
         }
      } catch (error) {
         setError("root.serverError", {
            type: "server",
            message: "Something went wrong. Please try again.",
         });
      }
   };

   return (
      <>
         <div className="min-h-screen bg-slate-50 flex">
            {/* Left Panel */}
            <div className="hidden lg:flex lg:w-5/12 bg-gradient-to-br from-violet-500 via-indigo-500 to-indigo-600 flex-col justify-between p-12 relative overflow-hidden">
               <div className="absolute -top-24 -right-16 w-80 h-80 rounded-full bg-white/5" />
               <div className="absolute bottom-0 -left-10 w-60 h-60 rounded-full bg-white/5" />
               <div className="absolute top-1/3 right-1/4 w-32 h-32 rounded-full bg-violet-300/10" />

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
                     Start your journey
                     <br />
                     today.
                  </h1>
                  <p className="text-indigo-200 text-sm leading-relaxed max-w-xs">
                     Join thousands of job seekers and companies already
                     building their future on Jobify.
                  </p>

                  <div className="flex gap-3 mt-8">
                     <div className="flex-1 bg-white/10 border border-white/20 rounded-xl p-4">
                        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center mb-2">
                           <HiUser className="w-4 h-4 text-white" />
                        </div>
                        <p className="text-white text-xs font-semibold mb-0.5">
                           Job Seeker
                        </p>
                        <p className="text-indigo-300 text-xs">
                           Find & apply to roles
                        </p>
                     </div>

                     <div className="flex-1 bg-white/10 border border-white/20 rounded-xl p-4">
                        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center mb-2">
                           <HiBriefcase className="w-4 h-4 text-white" />
                        </div>
                        <p className="text-white text-xs font-semibold mb-0.5">
                           Company
                        </p>
                        <p className="text-indigo-300 text-xs">
                           Post jobs & hire talent
                        </p>
                     </div>
                  </div>
               </div>

               <p className="text-indigo-300 text-xs relative z-10">
                  © 2026 Jobify. All rights reserved.
               </p>
            </div>

            {/* Right Panel */}
            <div className="flex-1 flex items-center justify-center px-5 py-10 overflow-y-auto">
               <div className="w-full max-w-md">
                  {/* Mobile logo */}
                  <div className="flex items-center gap-2 mb-7 lg:hidden">
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
                     Create an account
                  </h2>
                  <p className="text-sm text-slate-500 mb-7">
                     Already have an account?{" "}
                     <Link
                        to="/login"
                        className="text-indigo-600 font-medium hover:text-indigo-700 no-underline"
                     >
                        Sign in
                     </Link>
                  </p>

                  <form
                     onSubmit={handleSubmit(onSubmit)}
                     className="flex flex-col gap-4"
                  >
                     {/* First + Last Name */}
                     <div className="flex flex-col sm:flex-row gap-3">
                        <AuthInputField
                           label="First Name"
                           placeholder="John"
                           icon={HiUser}
                           registration={register("first_name")}
                           error={errors.first_name}
                           half
                        />

                        <AuthInputField
                           label="Last Name"
                           placeholder="Doe"
                           icon={HiUser}
                           registration={register("last_name")}
                           error={errors.last_name}
                           half
                        />
                     </div>

                     {/* Username */}
                     <AuthInputField
                        label="Username"
                        placeholder="johndoe"
                        icon={HiIdentification}
                        registration={register("username")}
                        error={errors.username}
                     />

                     {/* Email */}
                     <AuthInputField
                        label="Email"
                        type="email"
                        placeholder="john@example.com"
                        icon={HiMail}
                        registration={register("email")}
                        error={errors.email}
                     />

                     {/* Role selector */}
                     <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5 tracking-wide uppercase">
                           I am a...
                        </label>

                        <div className="flex gap-3">
                           {[
                              {
                                 value: "job_seeker",
                                 label: "Job Seeker",
                                 icon: HiUser,
                                 desc: "Looking for work",
                              },
                              {
                                 value: "company",
                                 label: "Company",
                                 icon: HiBriefcase,
                                 desc: "Hiring talent",
                              },
                           ].map(({ value, label, icon: Icon, desc }) => (
                              <button
                                 key={value}
                                 type="button"
                                 onClick={() =>
                                    setValue("role", value, {
                                       shouldValidate: true,
                                       shouldDirty: true,
                                    })
                                 }
                                 className={`flex-1 flex flex-col items-start gap-1 p-3.5 rounded-xl border-2 text-left transition-all cursor-pointer
                                 ${
                                    selectedRole === value
                                       ? "border-indigo-500 bg-indigo-50"
                                       : "border-slate-200 bg-slate-50 hover:border-indigo-300 hover:bg-indigo-50/50"
                                 }`}
                              >
                                 <div
                                    className={`w-7 h-7 rounded-lg flex items-center justify-center
                                    ${
                                       selectedRole === value
                                          ? "bg-indigo-500"
                                          : "bg-slate-200"
                                    }`}
                                 >
                                    <Icon
                                       className={`w-3.5 h-3.5 ${
                                          selectedRole === value
                                             ? "text-white"
                                             : "text-slate-500"
                                       }`}
                                    />
                                 </div>

                                 <p
                                    className={`text-xs font-semibold ${
                                       selectedRole === value
                                          ? "text-indigo-700"
                                          : "text-slate-700"
                                    }`}
                                 >
                                    {label}
                                 </p>

                                 <p
                                    className={`text-xs ${
                                       selectedRole === value
                                          ? "text-indigo-500"
                                          : "text-slate-400"
                                    }`}
                                 >
                                    {desc}
                                 </p>
                              </button>
                           ))}
                        </div>

                        {errors.role && (
                           <p className="text-xs text-rose-500 mt-1">
                              {errors.role.message}
                           </p>
                        )}
                     </div>

                     {/* Password */}
                     <AuthInputField
                        label="Password"
                        type={showPass ? "text" : "password"}
                        placeholder="Min. 6 characters"
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

                     {/* Confirm Password */}
                     <AuthInputField
                        label="Confirm Password"
                        type={showConf ? "text" : "password"}
                        placeholder="Re-enter your password"
                        icon={HiLockClosed}
                        registration={register("confirmPassword")}
                        error={errors.confirmPassword}
                        rightElement={
                           <button
                              type="button"
                              onClick={() => setShowConf((prev) => !prev)}
                              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer transition-colors"
                           >
                              {showConf ? (
                                 <HiEyeOff className="w-4 h-4" />
                              ) : (
                                 <HiEye className="w-4 h-4" />
                              )}
                           </button>
                        }
                     />

                     {/* Password match indicator */}
                     {password && confirmPassword && (
                        <p
                           className={`text-xs flex items-center gap-1.5 -mt-2 ${
                              password === confirmPassword
                                 ? "text-emerald-600"
                                 : "text-rose-500"
                           }`}
                        >
                           {password === confirmPassword
                              ? "Passwords match"
                              : "Passwords do not match"}
                        </p>
                     )}

                     {/* General server error */}
                     {errors.root?.serverError && (
                        <div className="text-sm text-rose-500 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
                           {errors.root.serverError.message}
                        </div>
                     )}

                     {/* Submit */}
                     <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold shadow-md shadow-indigo-200 transition-all border-none cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
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
                              Creating account...
                           </span>
                        ) : (
                           "Create Account"
                        )}
                     </button>
                  </form>
               </div>
            </div>
         </div>
      </>
   );
};

export default Register;
