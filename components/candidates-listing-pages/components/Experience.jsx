'use client'

import { useDispatch, useSelector } from "react-redux";
import { addExperience, clearExperienceF } from "../../../features/filter/candidateFilterSlice";

const Experience = () => {
    const dispatch = useDispatch();
    const { experiences } = useSelector((state) => state.candidateFilter) || {};
    
    const experienceLevels = [
        { id: 1, name: "Entry Level (0-1 year)", value: "entry-level" },
        { id: 2, name: "Junior (1-2 years)", value: "1-2-years" },
        { id: 3, name: "Mid-Level (2-5 years)", value: "2-5-years" },
        { id: 4, name: "Senior (5-10 years)", value: "5-10-years" },
        { id: 5, name: "Expert (10+ years)", value: "10-plus-years" }
    ];
    
    // Handle checkbox change
    const handleExperienceChange = (value) => {
        let newExperiences = [...(experiences || [])];
        
        if (newExperiences.includes(value)) {
            // Remove if already selected
            newExperiences = newExperiences.filter(exp => exp !== value);
        } else {
            // Add if not selected
            newExperiences.push(value);
        }
        
        dispatch(addExperience(newExperiences));
    };
    
    return (
        <ul className="switchbox">
            {experienceLevels.map((item) => {
                const isChecked = experiences?.includes(item.value) || false;
                return (
                    <li key={item.id}>
                        <label className="switch">
                            <input
                                type="checkbox"
                                checked={isChecked}
                                value={item.value}
                                onChange={() => handleExperienceChange(item.value)}
                            />
                            <span className="slider round"></span>
                            <span className="title" style={{ 
                                fontWeight: isChecked ? 'bold' : 'normal',
                                color: isChecked ? '#1967d2' : 'inherit'
                            }}>
                                {item.name} {isChecked && '✓'}
                            </span>
                        </label>
                    </li>
                );
            })}
        </ul>
    );
};

export default Experience;
