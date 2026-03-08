import React, { useState } from "react";
import { IoAddCircleOutline, IoDocumentText } from "react-icons/io5";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { ImMail4 } from "react-icons/im";
import { MdWork } from "react-icons/md";
import { SiHyperskill } from "react-icons/si";
import AddResume from "../../components/jobSeeker/AddResume";
import Resume from "../../components/jobSeeker/Resume";
import Experience from "../../components/jobSeeker/Experience";
import ExperienceForm from "../../components/jobSeeker/ExperienceForm";
import {
   useFetchExperiencesQuery,
   useFetchProfileQuery,
   useFetchResumesQuery,
   useFetchSkillsQuery,
} from "../../services/seekerService";
import ExperienceSkeleton from "../../components/jobSeeker/skeletons/ExperienceSkeleton";
import ResumeSkeleton from "../../components/jobSeeker/skeletons/ResumeSkeleton";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useGetUserQuery } from "../../services/authService";
import { BiEditAlt } from "react-icons/bi";
import ProfileImageForm from "../../components/jobSeeker/ProfileImageForm";
import ProfileBioForm from "../../components/jobSeeker/ProfileBioForm";
import AddSkills from "../../components/jobSeeker/AddSkills";
import SkillList from "../../components/jobSeeker/SkillList";

const Profile = () => {
   const [isAddingSkills, setIsAddingSkills] = useState(false);
   const [isAddingResume, setIsAddingResume] = useState(false);
   const [isAddingExp, setIsAddingExp] = useState(false);
   const [isUpdatingExp, setIsUpdatingExp] = useState(false);
   const [updationExp, setUpdationExp] = useState();
   const [isAddingPicture, setIsAddingPicture] = useState(false);
   const [isAddingBio, setIsAddingBio] = useState(false);

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

   return (
      <div className="p-6 bg-gray-100 min-h-screen">
         <div className="lg:w-3/5 xl:w-2/5 mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
               My Profile
            </h1>

            {/* User Details Section */}
            <div className="flex bg-white border border-gray-200 rounded-lg shadow-lg p-6 mb-6 relative">
               <>
                  {isLoadingProfile ? (
                     <Skeleton circle={true} height={128} width={128} />
                  ) : isAddingPicture ? (
                     <ProfileImageForm
                        setIsAddingPicture={setIsAddingPicture}
                     />
                  ) : profile?.profile_photo ? (
                     <div className="relative">
                        <img
                           className="w-32 h-32 rounded-full my-auto"
                           src={profile.profile_photo}
                           alt="Profile photo"
                        />
                        <BiEditAlt
                           size={18}
                           onClick={() => setIsAddingPicture(true)}
                           className="absolute bottom-1 right-1 cursor-pointer"
                        />
                     </div>
                  ) : (
                     <div className="relative">
                        <img
                           className="w-32 h-32 rounded-full my-auto"
                           src="https://loremflickr.com/320/320/girl"
                           alt="Profile photo"
                        />

                        <BiEditAlt
                           size={18}
                           onClick={() => setIsAddingPicture(true)}
                           className="absolute bottom-1 right-1 cursor-pointer"
                        />
                     </div>
                  )}
               </>

               <div className="ml-6">
                  {isLoadingUser ? (
                     <>
                        <p className="font-medium leading-none text-gray-900">
                           <Skeleton width={180} />
                        </p>
                        <div className="flex text-gray-700 py-2">
                           <div className="flex items-center">
                              <FaUserCircle className="mr-1" />
                              <Skeleton width={80} />
                           </div>
                           <div className="flex items-center">
                              <ImMail4 className="ml-4 mr-1" />
                              <Skeleton width={100} />
                           </div>
                        </div>
                     </>
                  ) : (
                     <>
                        <p className="font-medium leading-none text-gray-900">
                           {user.get_full_name || <Skeleton width={180} />}
                        </p>
                        <div className="flex text-gray-700 py-2">
                           <div className="flex items-center">
                              <FaUserCircle className="mr-1" />
                              <p>{user.username || <Skeleton width={80} />}</p>
                           </div>
                           <div className="flex items-center">
                              <ImMail4 className="ml-4 mr-1" />
                              <p>{user.email || <Skeleton width={100} />}</p>
                           </div>
                        </div>
                     </>
                  )}

                  {isLoadingProfile ? (
                     <Skeleton count={3} />
                  ) : isAddingBio ? (
                     <>
                        <ProfileBioForm
                           setIsAddingBio={setIsAddingBio}
                           profile={profile || ""}
                        />
                     </>
                  ) : profile?.bio ? (
                     <div className="flex items-end">
                        <p className="mt-2 text-sm text-gray-900">
                           {profile.bio}
                        </p>
                        <BiEditAlt
                           size={18}
                           onClick={() => setIsAddingBio(true)}
                           className="cursor-pointer"
                        />
                     </div>
                  ) : (
                     <div className="flex items-end">
                        <p className="mt-2 text-sm text-red-600">
                           Bio not added yet.
                        </p>
                        <BiEditAlt
                           size={18}
                           onClick={() => setIsAddingBio(true)}
                           className="cursor-pointer"
                        />
                     </div>
                  )}

                  <div className="absolute right-6 bottom-6">
                     <Link
                        to={"update"}
                        className="border border-blue-600 text-blue-600 text-sm font-semibold py-2 px-4 rounded hover:bg-blue-600 hover:text-white transition-colors duration-300"
                     >
                        Update
                     </Link>
                  </div>
               </div>
            </div>

            {/* User Skills Section */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 mb-6 relative">
               <div className="flex justify-between items-center mb-4">
                  <div className="flex">
                     <SiHyperskill className="text-amber-600 text-3xl mr-4" />
                     <h2 className="text-2xl font-semibold text-gray-800">
                        {isAddingSkills ? "Add Skills" : "Skills"}
                     </h2>
                  </div>
                  {isAddingSkills ? (
                     <IoMdCloseCircleOutline
                        onClick={toggleSkills}
                        className="text-red-600 cursor-pointer transition-all duration-300"
                        size={21}
                     />
                  ) : (
                     <button
                        onClick={toggleSkills}
                        className="flex items-center border border-blue-600 text-blue-600 text-sm font-semibold py-1 px-4 rounded hover:bg-blue-600 hover:text-white transition-all duration-300"
                     >
                        Add Skills
                        <IoAddCircleOutline className="ml-1" />
                     </button>
                  )}
               </div>

               {isAddingSkills ? (
                  <AddSkills
                     skills={skills}
                     setIsAddingSkills={setIsAddingSkills}
                  />
               ) : isLoadingSkills ? (
                  <div className="grid grid-cols-3 lg:grid-cols-5 md:grid-cols-4 gap-x-4 gap-y-2">
                     {Array.from({ length: 8 }).map((_, index) => (
                        <Skeleton
                           key={index}
                           width={90}
                           height={20}
                           className="w-full"
                        />
                     ))}
                  </div>
               ) : isError ? (
                  <p className="text-amber-600">No skills added yet.</p>
               ) : (
                  <SkillList skills={skills} />
               )}
            </div>

            {/* Resumes and Experience Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
               {/* Resumes Section */}
               <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                     <div className="flex">
                        <IoDocumentText className="text-blue-600 text-3xl mr-4" />
                        <h2 className="text-2xl font-semibold text-gray-800">
                           {isAddingResume ? "Add Resume" : "Resumes"}
                        </h2>
                     </div>
                     {isAddingResume ? (
                        <IoMdCloseCircleOutline
                           onClick={toggleAdd}
                           className="text-red-600 cursor-pointer transition-all duration-300"
                           size={21}
                        />
                     ) : (
                        <button
                           onClick={toggleAdd}
                           className="flex items-center border border-blue-600 text-blue-600 text-sm font-semibold py-1 px-4 rounded hover:bg-blue-600 hover:text-white transition-all duration-300"
                        >
                           Add
                           <IoAddCircleOutline className="ml-1" />
                        </button>
                     )}
                  </div>

                  {isAddingResume ? (
                     <AddResume setIsAddingResume={setIsAddingResume} />
                  ) : isLoadingResume ? (
                     <ResumeSkeleton />
                  ) : (
                     resumes?.map((resume) => (
                        <Resume
                           key={resume.id}
                           id={resume.id}
                           title={resume.resume_title}
                           link={resume.resume}
                        />
                     ))
                  )}
               </div>

               {/* Experience Section */}
               <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                     <div className="flex">
                        <MdWork className="text-green-600 text-3xl mr-4" />
                        <h2 className="text-2xl font-semibold text-gray-800">
                           {!isAddingExp && !isUpdatingExp
                              ? "Experiences"
                              : (isAddingExp && "Add Experience") ||
                                (isUpdatingExp && "Update Experien...")}
                        </h2>
                     </div>
                     {isAddingExp || isUpdatingExp ? (
                        <IoMdCloseCircleOutline
                           onClick={closeExpForm}
                           className="text-red-600 cursor-pointer transition-all duration-300"
                           size={21}
                        />
                     ) : (
                        <button
                           onClick={() => {
                              setIsAddingExp(true);
                           }}
                           className="flex items-center border border-blue-600 text-blue-600 text-sm font-semibold py-1 px-4 rounded hover:bg-blue-600 hover:text-white transition-all duration-300"
                        >
                           Add
                           <IoAddCircleOutline className="ml-1" />
                        </button>
                     )}
                  </div>
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
                  ) : (
                     <>
                        {experiences.map((exp) => (
                           <Experience
                              key={exp.id}
                              exp={exp}
                              setUpdation={setUpdation}
                           />
                        ))}
                     </>
                  )}
               </div>
            </div>
         </div>
      </div>
   );
};

export default Profile;
