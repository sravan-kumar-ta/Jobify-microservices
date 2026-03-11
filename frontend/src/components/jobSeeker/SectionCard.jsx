const SectionCard = ({ title, icon, children, action }) => (
   <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm mb-6">
      <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
         <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 text-base">
               {icon}
            </div>
            <h2 className="text-sm sm:text-base font-semibold tracking-wide text-slate-800">
               {title}
            </h2>
         </div>
         {action}
      </div>
      {children}
   </div>
);

export default SectionCard;
