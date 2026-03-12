import { z } from "zod";

export const registerSchema = z
   .object({
      first_name: z.string().trim().min(1, "First name is required"),
      last_name: z.string().trim().min(1, "Last name is required"),
      username: z
         .string()
         .trim()
         .min(3, "Username must be at least 3 characters"),
      email: z.string().trim().email("Invalid email address"),
      role: z.enum(["job_seeker", "company"], {
         errorMap: () => ({ message: "Role is required" }),
      }),
      password: z.string().min(6, "Password must be at least 6 characters"),
      confirmPassword: z.string().min(1, "Confirm Password is required"),
   })
   .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords must match",
      path: ["confirmPassword"],
   });

export const loginSchema = z.object({
   username: z.string().trim().min(1, "Username is required"),
   password: z.string().min(3, "Password must be at least 3 characters"),
});

export const educationSchema = z
   .object({
      degree: z.string().min(1, "Degree is required"),
      institution: z.string().min(1, "Institution is required"),
      start_year: z.string().min(1, "Start date required"),
      end_year: z.string().optional().nullable(),
      is_current: z.boolean(),
   })
   .refine(
      (data) => data.is_current || (data.end_year && data.end_year.length > 0),
      {
         message: "End date required",
         path: ["end_year"],
      },
   )
   .refine(
      (data) => {
         if (!data.start_year || !data.end_year || data.is_current) return true;

         return data.end_year >= data.start_year;
      },
      {
         message: "End date must be after start date",
         path: ["end_year"],
      },
   );
