const ResumeOptionSkeleton = ({ index }) => {
   return (
      <div
         key={index}
         className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-slate-200 bg-slate-50 animate-pulse"
      >
         <div className="w-4 h-4 rounded-full bg-slate-200 shrink-0" />
         <div className="w-8 h-8 rounded-lg bg-slate-200 shrink-0" />
         <div className="flex-1 min-w-0">
            <div className="h-3 w-32 bg-slate-200 rounded" />
         </div>
      </div>
   );
};

export default ResumeOptionSkeleton;
