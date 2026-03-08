import { techSkills } from "../../utils/TechSkills";

const SkillList = ({ skills }) => {
   const initialValue = techSkills.filter((option) =>
      skills.skills.includes(option.value),
   );

   return (
      <>
         {initialValue.length > 0 ? (
            initialValue.map((skill) => (
               <span
                  key={skill.value}
                  className="inline-block bg-blue-200 text-gray-800 text-sm px-3 py-1 rounded-md mr-2 mb-2 font-medium"
               >
                  {skill.label}
               </span>
            ))
         ) : (
            <p className="text-gray-600">Your skill list is empty.</p>
         )}
      </>
   );
};

export default SkillList;
