import * as Yup from "yup";

const registerValidationSchema = Yup.object().shape({
   first_name: Yup.string().required("First name is required"),
   last_name: Yup.string().required("Last name is required"),
   username: Yup.string().required("Username is required"),
   email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
   role: Yup.string().required("Role is required"),
   password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
   confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
});

const loginValidationSchema = Yup.object().shape({
   username: Yup.string().required("Username is required"),
   password: Yup.string()
      .min(3, "Password must be at least 3 characters")
      .required("Password is required"),
});

const userUpdateValidationSchema = registerValidationSchema.omit([
   "role",
   "password",
   "confirmPassword",
]);

const companyFormValidationSchema = Yup.object().shape({
   title: Yup.string().required("Title is required."),
   location: Yup.string().required("Location is required."),
   website: Yup.string().notRequired(),
   established_date: Yup.date().nullable().notRequired(),
});

const JobFormValidationSchema = Yup.object().shape({
   title: Yup.string()
      .trim()
      .min(3, "Title is too short")
      .required("Title is required."),
   salary: Yup.number()
      .typeError("Salary must be a number")
      .positive("Salary must be a positive number")
      .nullable(),
   experience: Yup.number()
      .typeError("exp. must be a number of years")
      .min(0, "Experience cannot be negative")
      .default(0)
      .nullable()
      .transform((value, originalValue) => (originalValue === "" ? 0 : value)),
   skills: Yup.string().required("Please add skills for the job"),
   description: Yup.string().required("Description is required."),
});

const ExperienceValidationSchema = Yup.object().shape({
   job_title: Yup.string().required("Title is required."),
   company: Yup.string().required("Company name is required."),
   start_date: Yup.date().required("Start date is required."),
   end_date: Yup.date()
      .nullable()
      .when("is_current", {
         is: false,
         then: (schema) =>
            schema
               .required("End date is required for non-current experiences.")
               .min(
                  Yup.ref("start_date"),
                  "End date must be after the start date.",
               ),
         otherwise: (schema) => schema.nullable(),
      }),
   is_current: Yup.boolean().default(false),
});

export {
   registerValidationSchema,
   loginValidationSchema,
   companyFormValidationSchema,
   JobFormValidationSchema,
   userUpdateValidationSchema,
   ExperienceValidationSchema,
};
