import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useGetUserQuery, useLogout } from "../services/authService";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import {
   HiMenuAlt3,
   HiX,
   HiHome,
   HiClipboardList,
   HiUser,
   HiChat,
   HiBriefcase,
   HiLogout,
   HiLightningBolt,
} from "react-icons/hi";

const NavBar = () => {
   const { mutateAsync: logout } = useLogout();
   const { data: user, isLoading } = useGetUserQuery();

   const [menuOpen, setMenuOpen] = useState(false);

   const handleLogout = () => {
      logout();
      setMenuOpen(false);
   };

   const role = user?.role;

   let links = [];

   if (role) {
      if (role === "admin") {
         links.push({
            href: "/admin/dashboard",
            text: "Dashboard",
            icon: HiBriefcase,
         });
      } else if (role === "job_seeker") {
         links.push({ href: "/", text: "Home", icon: HiHome });
         links.push({
            href: "/job_seeker/applied-jobs",
            text: "Applications",
            icon: HiClipboardList,
         });
         links.push({
            href: "/job_seeker/profile",
            text: "Profile",
            icon: HiUser,
         });
         links.push({
            href: "/job_seeker/connections",
            text: "Chats",
            icon: HiChat,
         });
      } else if (role === "company") {
         links.push({
            href: "/company/dashboard",
            text: "Dashboard",
            icon: HiBriefcase,
         });

         links.push({
            href: "/company/jobs",
            text: "Applications",
            icon: HiClipboardList,
         });

         links.push({
            href: "/company/connections",
            text: "Chats",
            icon: HiChat,
         });
      }
   } else {
      links.push({ href: "/signup", text: "Signup", icon: HiUser });
      links.push({ href: "/login", text: "Login", icon: HiUser });
   }

   const linkClass = ({ isActive }) =>
      `flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all
      ${
         isActive
            ? "bg-indigo-50 text-indigo-600"
            : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
      }`;

   const mobileLinkClass = ({ isActive }) =>
      `flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
      ${
         isActive
            ? "bg-indigo-50 text-indigo-600"
            : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
      }`;

   if (isLoading) {
      return (
         <nav className="bg-white p-4 sticky top-0 z-50 shadow">
            <div className="flex justify-center">
               <Skeleton width={60} height={25} className="mx-3" />
               <Skeleton width={60} height={25} className="mx-3" />
               <Skeleton width={60} height={25} className="mx-3" />
            </div>
         </nav>
      );
   }

   return (
      <nav className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 shadow-sm">
         <div className="max-w-6xl mx-auto px-5">
            <div className="flex items-center justify-between h-16">
               {/* Logo */}
               <Link
                  to="/"
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
               >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center">
                     <HiLightningBolt className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-slate-800">
                     Jobify
                  </span>
               </Link>

               {/* Center Navigation */}
               <div className="hidden md:flex flex-1 justify-center items-center gap-1">
                  {links.map(({ href, text, icon: Icon }, index) => (
                     <NavLink key={index} to={href} className={linkClass}>
                        {Icon && <Icon className="w-4 h-4" />}
                        {text}
                     </NavLink>
                  ))}
               </div>

               {/* Logout */}
               <div className="hidden md:flex items-center">
                  {role && (
                     <button
                        onClick={handleLogout}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium text-rose-500 hover:bg-rose-50 border border-rose-200 transition"
                     >
                        <HiLogout className="w-4 h-4" />
                        Logout
                     </button>
                  )}
               </div>

               {/* Mobile Menu Button */}
               <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="md:hidden p-2 rounded-lg hover:bg-slate-100"
               >
                  {menuOpen ? (
                     <HiX className="w-5 h-5" />
                  ) : (
                     <HiMenuAlt3 className="w-5 h-5" />
                  )}
               </button>
            </div>
         </div>

         {/* Mobile Menu */}

         <div
            className={`md:hidden overflow-hidden transition-all duration-300
            ${menuOpen ? "max-h-72 py-2" : "max-h-0"}`}
         >
            <div className="px-4 flex flex-col gap-1">
               {links.map(({ href, text, icon: Icon }, index) => (
                  <NavLink
                     key={index}
                     to={href}
                     className={mobileLinkClass}
                     onClick={() => setMenuOpen(false)}
                  >
                     {Icon && <Icon className="w-4 h-4" />}
                     {text}
                  </NavLink>
               ))}

               {role && (
                  <button
                     onClick={handleLogout}
                     className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-500 hover:bg-rose-50"
                  >
                     <HiLogout className="w-4 h-4" />
                     Logout
                  </button>
               )}
            </div>
         </div>
      </nav>
   );
};

export default NavBar;
