import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import UpdateUser from "../pages/UpdateUser";
import JobSeekers from "../pages/Admin/JobSeekers";
import Companies from "../pages/Admin/Companies";
import CompanyProfile from "../pages/Admin/CompanyProfile";
import Jobs from "../pages/Admin/Jobs";
import Applications from "../pages/Admin/Applications";
import JobDetails from "../pages/Admin/JobDetails";

const adminRoutesConfig = [
   { path: "dashboard", element: <AdminDashboard /> },
   { path: "dashboard/update-admin", element: <UpdateUser /> },
   { path: "dashboard/job-seekers", element: <JobSeekers /> },
   { path: "dashboard/companies", element: <Companies /> },
   { path: "dashboard/companies/:companyName/profile", element: <CompanyProfile /> },
   { path: "dashboard/jobs", element: <Jobs /> },
   { path: "dashboard/jobs/:jobId", element: <JobDetails /> },
   { path: "dashboard/application", element: <Applications /> },
];

const AdminRoutes = () => {
   return (
      <Routes>
         {adminRoutesConfig.map((route, index) => (
            <Route
               key={index}
               path={route.path}
               element={
                  <ProtectedRoute
                     element={route.element}
                     requiredRole={"admin"}
                  />
               }
            />
         ))}
      </Routes>
   );
};

export default AdminRoutes;
