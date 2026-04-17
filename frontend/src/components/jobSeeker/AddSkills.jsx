import { useState } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { techSkills } from "../../utils/TechSkills";
import { useCreateSkillsMutation } from "../../services/seekerService";

const AddSkills = ({ skills, setIsAddingSkills }) => {
   const [selectedSkills, setSelectedSkills] = useState(() => {
      return techSkills.filter((option) =>
         skills?.skills?.includes(option.value),
      );
   });

   const animatedComponents = makeAnimated();
   const createSkills = useCreateSkillsMutation();

   const handleSubmit = () => {
      const skillsForBackend = selectedSkills.map((skill) => skill.value);
      const payload = { skills: skillsForBackend };
      
      createSkills.mutate(payload, {
         onSuccess: () => {
            setIsAddingSkills(false);
         },
         onError: (err) => {
            console.log("Error creating skills:", err);
         },
      });
   };

   return (
      <div className="bg-slate-200 p-3 rounded-lg">
         <Select
            options={techSkills}
            closeMenuOnSelect={false}
            components={animatedComponents}
            isMulti
            onChange={(selected) => setSelectedSkills(selected || [])}
            value={selectedSkills}
            placeholder="Select your skills..."
         />
         <div className="flex justify-end">
            <button
               className="px-4 mt-3 bg-indigo-500 text-sm text-white py-1 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center justify-center"
               onClick={handleSubmit}
            >
               ✓ Save
            </button>
         </div>
      </div>
   );
};

export default AddSkills;
