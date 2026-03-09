import { z } from "zod";

export const educationSchema = z
   .object({
      degree: z.string().min(1, "Degree is required"),
      institution: z.string().min(1, "Institution is required"),
      start_year: z.string().min(1, "Start date required"),
      end_year: z.string().optional().nullable(),
      currently_studying: z.boolean(),
   })
   .refine(
      (data) =>
         data.currently_studying || (data.end_year && data.end_year.length > 0),
      {
         message: "End date required",
         path: ["end_year"],
      },
   )
   .refine(
      (data) => {
         if (!data.start_year || !data.end_year || data.currently_studying)
            return true;

         return data.end_year >= data.start_year;
      },
      {
         message: "End date must be after start date",
         path: ["end_year"],
      },
   );
