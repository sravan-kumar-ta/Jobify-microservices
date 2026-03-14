import { HiHome, HiArrowLeft } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
   return (
      <>
         <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-12px); }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(0.95); opacity: 0.6; }
          100% { transform: scale(1.15); opacity: 0;   }
        }
        .float    { animation: float 4s ease-in-out infinite; }
        .pulse-ring {
          animation: pulse-ring 2s ease-out infinite;
        }
      `}</style>

         <div className="h-[calc(100vh-64px)] bg-slate-50 flex flex-col">
            {/* ── Main Content ── */}
            <div className="flex-1 flex items-center justify-center px-4">
               <div className="w-full max-w-lg text-center">
                  {/* ── Floating 404 illustration ── */}
                  <div className="relative flex items-center justify-center mb-10">
                     {/* Pulse rings */}
                     <div className="absolute w-52 h-52 rounded-full bg-indigo-100 opacity-60 pulse-ring" />
                     <div
                        className="absolute w-40 h-40 rounded-full bg-indigo-100 opacity-40 pulse-ring"
                        style={{ animationDelay: "0.4s" }}
                     />

                     {/* Main circle */}
                     <div className="relative float w-36 h-36 rounded-3xl bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center shadow-xl shadow-indigo-200">
                        {/* Grid pattern overlay */}
                        <div
                           className="absolute inset-0 rounded-3xl opacity-20"
                           style={{
                              backgroundImage:
                                 "repeating-linear-gradient(0deg,transparent,transparent 10px,rgba(255,255,255,0.4) 10px,rgba(255,255,255,0.4) 11px),repeating-linear-gradient(90deg,transparent,transparent 10px,rgba(255,255,255,0.4) 10px,rgba(255,255,255,0.4) 11px)",
                           }}
                        />
                        <span
                           className="text-5xl font-bold text-white tracking-tighter relative z-10"
                           style={{ fontFamily: "'Fraunces', serif" }}
                        >
                           404
                        </span>
                     </div>

                     {/* Decorative dots */}
                     <div className="absolute top-4 right-8 w-3 h-3 rounded-full bg-violet-300 opacity-70" />
                     <div className="absolute bottom-6 left-10 w-2 h-2 rounded-full bg-indigo-300 opacity-60" />
                     <div className="absolute top-10 left-6 w-1.5 h-1.5 rounded-full bg-rose-300 opacity-50" />
                     <div className="absolute bottom-4 right-12 w-2 h-2 rounded-full bg-amber-300 opacity-60" />
                  </div>

                  {/* ── Copy ── */}
                  <h1
                     className="text-3xl sm:text-4xl font-bold text-slate-800 mb-3 leading-tight"
                     style={{ fontFamily: "'Fraunces', serif" }}
                  >
                     Page not found
                  </h1>

                  <p className="text-sm sm:text-base text-slate-500 leading-relaxed mb-8 max-w-sm mx-auto">
                     Looks like this page took a wrong turn. The link might be
                     broken, or the page may have been moved or deleted.
                  </p>

                  {/* ── Actions ── */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                     <button
                        onClick={() => navigate("/")}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold shadow-md shadow-indigo-200 transition-all border-none cursor-pointer w-full sm:w-auto justify-center"
                     >
                        <HiHome className="w-4 h-4" />
                        Go to Home
                     </button>

                     <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-600 text-sm font-medium border border-slate-200 hover:border-slate-300 transition-all cursor-pointer w-full sm:w-auto justify-center"
                     >
                        <HiArrowLeft className="w-4 h-4" />
                        Go Back
                     </button>
                  </div>
               </div>
            </div>

            {/* ── Footer note ── */}
            <p className="text-center text-xs text-slate-400 pb-6">
               © 2026 WorkFolio · All rights reserved
            </p>
         </div>
      </>
   );
}
