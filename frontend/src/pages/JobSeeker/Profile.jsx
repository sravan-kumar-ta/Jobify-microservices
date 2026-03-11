import avatarImg from "../../assets/avatar.jpg";
import { useState } from "react";
import { IoAddCircleOutline, IoDocumentText } from "react-icons/io5";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { ImMail4 } from "react-icons/im";
import { BiEditAlt } from "react-icons/bi";
import AddResume from "../../components/jobSeeker/AddResume";
import Resume from "../../components/jobSeeker/Resume";
import Experience from "../../components/jobSeeker/Experience";
import ExperienceForm from "../../components/jobSeeker/ExperienceForm";
import {
   useFetchEducationQuery,
   useFetchExperiencesQuery,
   useFetchProfileQuery,
   useFetchResumesQuery,
   useFetchSkillsQuery,
} from "../../services/seekerService";
import ExperienceSkeleton from "../../components/jobSeeker/skeletons/ExperienceSkeleton";
import ResumeSkeleton from "../../components/jobSeeker/skeletons/ResumeSkeleton";
import Skeleton from "react-loading-skeleton";
import SectionCard from "../../components/jobSeeker/SectionCard";
import "react-loading-skeleton/dist/skeleton.css";
import { useGetUserQuery } from "../../services/authService";
import ProfileImageForm from "../../components/jobSeeker/ProfileImageForm";
import ProfileBioForm from "../../components/jobSeeker/ProfileBioForm";
import AddSkills from "../../components/jobSeeker/AddSkills";
import SkillList from "../../components/jobSeeker/SkillList";
import EducationList from "../../components/jobSeeker/EducationList";
import EducationForm from "../../components/jobSeeker/EducationForm";
import EducationSkeleton from "../../components/jobSeeker/skeletons/EducationSkeleton";

const actionBtnClass =
   "flex items-center gap-1.5 bg-indigo-50 border border-indigo-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium text-indigo-600 hover:bg-indigo-100 transition-colors cursor-pointer";

const closeBtnClass =
   "text-rose-500 hover:text-rose-600 cursor-pointer transition-all duration-300";

const Profile = () => {
   const [isAddingSkills, setIsAddingSkills] = useState(false);
   const [isAddingResume, setIsAddingResume] = useState(false);
   const [isAddingExp, setIsAddingExp] = useState(false);
   const [isUpdatingExp, setIsUpdatingExp] = useState(false);
   const [updationExp, setUpdationExp] = useState();
   const [isAddingPicture, setIsAddingPicture] = useState(false);
   const [isAddingBio, setIsAddingBio] = useState(false);
   const [mode, setMode] = useState("list");
   const [editing, setEditing] = useState(null);

   const { data: user, isLoading: isLoadingUser } = useGetUserQuery();
   const { data: resumes, isLoading: isLoadingResume } = useFetchResumesQuery();
   const { data: profile, isLoading: isLoadingProfile } =
      useFetchProfileQuery();
   const { data: experiences, isLoading: isLoadingExp } =
      useFetchExperiencesQuery();
   const {
      data: skills,
      isLoading: isLoadingSkills,
      isError,
   } = useFetchSkillsQuery();
   const { data: educations, isLoading: isLoadingEdu } =
      useFetchEducationQuery();

   const toggleAdd = () => {
      setIsAddingResume((prev) => !prev);
   };

   const toggleSkills = () => {
      setIsAddingSkills((prev) => !prev);
   };

   const closeExpForm = () => {
      setIsAddingExp(false);
      setIsUpdatingExp(false);
   };

   const setUpdation = (exp) => {
      setUpdationExp(exp);
      setIsUpdatingExp(true);
   };

   // Education section
   const handleAdd = () => {
      setEditing(null);
      setMode("create");
   };

   const handleEdit = (item) => {
      setEditing(item);
      setMode("edit");
   };

   const handleSuccess = () => {
      setMode("list");
      setEditing(null);
   };

   return (
      <div className="min-h-screen bg-slate-50 px-4 sm:px-6 py-2">
         {/* top accent line */}
         <div className="fixed top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-400 via-violet-400 to-sky-400 z-50" />
         <div className="max-w-4xl mx-auto">
            {/* ── Profile Section ───────────────────────────── */}
            <SectionCard
               title="Profile"
               icon="👤"
               action={
                  <Link
                     to={"update"}
                     className="bg-white border border-slate-200 text-slate-500 text-xs sm:text-sm font-medium px-4 py-2 rounded-xl hover:border-indigo-300 hover:text-indigo-600 transition-all"
                  >
                     ✎ Update
                  </Link>
               }
            >
               <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
                  {/* Avatar */}
                  <div className="relative mx-auto md:mx-0 flex-shrink-0">
                     {isLoadingProfile ? (
                        <Skeleton circle={true} height={96} width={96} />
                     ) : isAddingPicture ? (
                        <ProfileImageForm
                           setIsAddingPicture={setIsAddingPicture}
                        />
                     ) : profile?.profile_photo ? (
                        <div className="relative">
                           <img
                              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover ring-4 ring-white ring-offset-2 ring-offset-slate-50 shadow-sm"
                              src={profile.profile_photo}
                              alt="Profile photo"
                           />
                           <button
                              type="button"
                              onClick={() => setIsAddingPicture(true)}
                              className="absolute bottom-1 right-1 w-7 h-7 rounded-full bg-indigo-500 border-2 border-white flex items-center justify-center text-white shadow-md hover:bg-indigo-600 transition-colors cursor-pointer"
                           >
                              <BiEditAlt size={15} />
                           </button>
                        </div>
                     ) : (
                        <div className="relative">
                           <img
                              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover ring-4 ring-white ring-offset-2 ring-offset-slate-50 shadow-sm"
                              src={avatarImg}
                              alt="Profile photo"
                           />
                           <button
                              type="button"
                              onClick={() => setIsAddingPicture(true)}
                              className="absolute bottom-1 right-1 w-7 h-7 rounded-full bg-indigo-500 border-2 border-white flex items-center justify-center text-white shadow-md hover:bg-indigo-600 transition-colors cursor-pointer"
                           >
                              <BiEditAlt size={15} />
                           </button>
                        </div>
                     )}
                  </div>

                  {/* User Info */}
                  <div className="flex-1 w-full">
                     {isLoadingUser ? (
                        <>
                           <div className="mb-2">
                              <Skeleton width={220} height={28} />
                           </div>

                           <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-5 py-2">
                              <div className="flex items-center gap-2">
                                 <FaUserCircle className="text-slate-400" />
                                 <Skeleton width={100} />
                              </div>
                              <div className="flex items-center gap-2">
                                 <ImMail4 className="text-slate-400" />
                                 <Skeleton width={180} />
                              </div>
                           </div>
                        </>
                     ) : (
                        <>
                           <p className="text-2xl font-bold text-slate-800 tracking-tight">
                              {user?.get_full_name || <Skeleton width={180} />}
                           </p>

                           <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-5 py-3 text-sm text-slate-500">
                              <div className="flex items-center gap-2">
                                 <FaUserCircle className="text-indigo-400" />
                                 <p>
                                    {user?.username || <Skeleton width={80} />}
                                 </p>
                              </div>

                              <div className="flex items-center gap-2 break-all">
                                 <ImMail4 className="text-indigo-400" />
                                 <p>
                                    {user?.email || <Skeleton width={120} />}
                                 </p>
                              </div>
                           </div>
                        </>
                     )}

                     {isLoadingProfile ? (
                        <Skeleton count={3} />
                     ) : isAddingBio ? (
                        <ProfileBioForm
                           setIsAddingBio={setIsAddingBio}
                           profile={profile || ""}
                        />
                     ) : profile?.bio ? (
                        <div className="flex items-start gap-2 mt-1">
                           <p className="text-sm text-slate-600 leading-relaxed flex-1">
                              {profile.bio}
                           </p>
                           <button
                              type="button"
                              onClick={() => setIsAddingBio(true)}
                              className="text-indigo-500 hover:text-indigo-600 transition-colors cursor-pointer"
                           >
                              <BiEditAlt size={18} />
                           </button>
                        </div>
                     ) : (
                        <div className="flex items-start gap-2 mt-1">
                           <p className="text-sm text-amber-600">
                              Bio not added yet.
                           </p>
                           <button
                              type="button"
                              onClick={() => setIsAddingBio(true)}
                              className="text-indigo-500 hover:text-indigo-600 transition-colors cursor-pointer"
                           >
                              <BiEditAlt size={18} />
                           </button>
                        </div>
                     )}
                  </div>
               </div>
            </SectionCard>

            {/* ── Skills Section ────────────────────────────── */}
            <SectionCard
               title={isAddingSkills ? "Add Skills" : "Skills"}
               icon="⚡"
               action={
                  isAddingSkills ? (
                     <IoMdCloseCircleOutline
                        onClick={toggleSkills}
                        className={closeBtnClass}
                        size={22}
                     />
                  ) : (
                     <button onClick={toggleSkills} className={actionBtnClass}>
                        <IoAddCircleOutline className="text-base" />
                        Add Skills
                     </button>
                  )
               }
            >
               {isAddingSkills ? (
                  <AddSkills
                     skills={skills}
                     setIsAddingSkills={setIsAddingSkills}
                  />
               ) : isLoadingSkills ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                     {Array.from({ length: 8 }).map((_, index) => (
                        <Skeleton
                           key={index}
                           width={90}
                           height={24}
                           className="w-full"
                        />
                     ))}
                  </div>
               ) : isError ? (
                  <p className="text-sm text-slate-400">No skills added yet.</p>
               ) : (
                  <SkillList skills={skills} />
               )}
            </SectionCard>

            {/* ── Education Section ─────────────────────────── */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm mb-6">
               {mode === "create" && (
                  <EducationForm
                     onCancel={() => setMode("list")}
                     onSuccess={handleSuccess}
                  />
               )}

               {mode === "edit" && (
                  <EducationForm
                     initial={editing}
                     onCancel={() => setMode("list")}
                     onSuccess={handleSuccess}
                  />
               )}

               {isLoadingEdu ? (
                  <EducationSkeleton />
               ) : (
                  mode === "list" && (
                     <EducationList
                        education={educations}
                        onAdd={handleAdd}
                        onEdit={handleEdit}
                     />
                  )
               )}
            </div>

            {/* ── Resume + Experience Grid ─────────────────── */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
               {/* Resumes */}
               <SectionCard
                  title={isAddingResume ? "Add Resume" : "Resumes"}
                  icon={<IoDocumentText />}
                  action={
                     isAddingResume ? (
                        <IoMdCloseCircleOutline
                           onClick={toggleAdd}
                           className={closeBtnClass}
                           size={22}
                        />
                     ) : (
                        <button onClick={toggleAdd} className={actionBtnClass}>
                           <IoAddCircleOutline className="text-base" />
                           Add
                        </button>
                     )
                  }
               >
                  {isAddingResume ? (
                     <AddResume setIsAddingResume={setIsAddingResume} />
                  ) : isLoadingResume ? (
                     <ResumeSkeleton />
                  ) : resumes?.length ? (
                     resumes.map((resume) => (
                        <Resume
                           key={resume.id}
                           id={resume.id}
                           title={resume.resume_title}
                           link={resume.resume}
                        />
                     ))
                  ) : (
                     <p className="text-sm text-slate-400">
                        No resumes uploaded yet.
                     </p>
                  )}
               </SectionCard>

               {/* Experience */}
               <SectionCard
                  title={
                     !isAddingExp && !isUpdatingExp
                        ? "Experiences"
                        : isAddingExp
                          ? "Add Experience"
                          : "Update Experience"
                  }
                  icon="💼"
                  action={
                     isAddingExp || isUpdatingExp ? (
                        <IoMdCloseCircleOutline
                           onClick={closeExpForm}
                           className={closeBtnClass}
                           size={22}
                        />
                     ) : (
                        <button
                           onClick={() => setIsAddingExp(true)}
                           className={actionBtnClass}
                        >
                           <IoAddCircleOutline className="text-base" />
                           Add
                        </button>
                     )
                  }
               >
                  {isUpdatingExp ? (
                     <ExperienceForm
                        setIsAddingExp={setIsAddingExp}
                        updationValues={updationExp}
                        setIsUpdatingExp={setIsUpdatingExp}
                     />
                  ) : isAddingExp ? (
                     <ExperienceForm setIsAddingExp={setIsAddingExp} />
                  ) : isLoadingExp ? (
                     <ExperienceSkeleton />
                  ) : experiences?.length ? (
                     <>
                        {experiences.map((exp) => (
                           <Experience
                              key={exp.id}
                              exp={exp}
                              setUpdation={setUpdation}
                           />
                        ))}
                     </>
                  ) : (
                     <p className="text-sm text-slate-400">
                        No experience added yet.
                     </p>
                  )}
               </SectionCard>
            </div>
         </div>
      </div>
   );
};

export default Profile;
