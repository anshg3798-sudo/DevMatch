const getCompatibilityExplanation = (studentSkills, requiredSkills) => {

    const studentSkillSet = new Set(
        studentSkills.map(skill => skill.toLowerCase())
    );

    const matchedSkills = [];
    const missingSkills = [];

    for (const skill of requiredSkills) {

        if (studentSkillSet.has(skill.toLowerCase())) {
            matchedSkills.push(skill);
        } else {
            missingSkills.push(skill);
        }

    }

    return {
        matchedSkills,
        missingSkills,
    };
};

module.exports = getCompatibilityExplanation;