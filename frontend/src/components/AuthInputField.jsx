const AuthInputField = ({
   label,
   type = "text",
   placeholder,
   icon: Icon,
   rightElement,
   error,
   registration,
   half = false,
}) => {
   return (
      <div className={half ? "flex-1 min-w-0" : "w-full"}>
         <label className="block text-xs font-semibold text-slate-600 mb-1.5 tracking-wide uppercase">
            {label}
         </label>

         <div className="relative">
            {Icon && (
               <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            )}

            <input
               type={type}
               placeholder={placeholder}
               {...registration}
               className={`w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 border rounded-xl text-slate-800 placeholder-slate-400 outline-none transition-all
               ${
                  error
                     ? "border-rose-400 focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                     : "border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
               }`}
            />

            {rightElement}
         </div>

         {error && (
            <p className="text-xs text-rose-500 mt-1">{error.message}</p>
         )}
      </div>
   );
};

export default AuthInputField;
