import { HiX, HiLightningBolt, HiUser, HiBriefcase, HiShieldCheck } from "react-icons/hi";

const DUMMY_ACCOUNTS = [
   {
      role: "job_seeker",
      label: "Job Seeker",
      description: "Browse jobs & apply",
      icon: HiUser,
      credentials: { username: "seeker_demo", password: "demo1234" },
      color: "bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100",
      iconColor: "bg-indigo-100 text-indigo-600",
   },
   {
      role: "company",
      label: "Company",
      description: "Post jobs & manage applicants",
      icon: HiBriefcase,
      credentials: { username: "company_demo", password: "demo1234" },
      color: "bg-violet-50 border-violet-200 text-violet-700 hover:bg-violet-100",
      iconColor: "bg-violet-100 text-violet-600",
   },
   {
      role: "admin",
      label: "Admin",
      description: "Full platform access",
      icon: HiShieldCheck,
      credentials: { username: "admin", password: "admin" },
      color: "bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100",
      iconColor: "bg-rose-100 text-rose-600",
   },
];

const DummyLoginModal = ({ onClose, onLogin, isSubmitting, loadingRole }) => {
   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
         {/* Backdrop */}
         <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={onClose}
         />

         {/* Modal */}
         <div className="relative bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-sm p-6 z-10">

            {/* Header */}
            <div className="flex items-start justify-between mb-4">
               <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center">
                     <HiLightningBolt className="w-4 h-4 text-white" />
                  </div>
                  <div>
                     <h3
                        className="text-sm font-bold text-slate-800"
                        style={{ fontFamily: "'Fraunces', serif" }}
                     >
                        Dummy Login
                     </h3>
                     <p className="text-xs text-slate-400">For demo purposes only</p>
                  </div>
               </div>
               <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg hover:bg-slate-100 border-none bg-transparent cursor-pointer text-slate-400 hover:text-slate-600 transition-colors"
               >
                  <HiX className="w-4 h-4" />
               </button>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-500 leading-relaxed bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 mb-5">
               Instantly log in with a pre-filled demo account — no registration
               needed. Pick a role below to explore the platform from that perspective.
            </p>

            {/* Role Buttons */}
            <div className="flex flex-col gap-2.5">
               {DUMMY_ACCOUNTS.map(({ role, label, description, icon: Icon, credentials, color, iconColor }) => {
                  const isLoading = isSubmitting && loadingRole === role;

                  return (
                     <button
                        key={role}
                        onClick={() => onLogin(credentials, role)}
                        disabled={isSubmitting}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${color}`}
                     >
                        {/* Icon */}
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${iconColor}`}>
                           {isLoading ? (
                              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                              </svg>
                           ) : (
                              <Icon className="w-4 h-4" />
                           )}
                        </div>

                        {/* Text */}
                        <div className="flex-1 min-w-0">
                           <p className="text-sm font-semibold leading-none mb-0.5">
                              {isLoading ? "Signing in..." : `Login as ${label}`}
                           </p>
                           <p className="text-xs opacity-70">{description}</p>
                        </div>
                     </button>
                  );
               })}
            </div>

            {/* Footer note */}
            <p className="text-xs text-slate-400 text-center mt-4">
               Demo accounts are reset periodically.
            </p>
         </div>
      </div>
   );
};

export default DummyLoginModal;
