const calculateCompatibility = (studentSkills, requiredSkills) => {

    if (!requiredSkills || requiredSkills.length === 0) {
        return {
            score: 0,
            matchedSkills: [],
            missingSkills: [],
        };
    }

    const studentSkillSet = new Set(
        studentSkills.map(skill => skill.toLowerCase())
    );

    let matchedSkills = [];
    let missingSkills = [];

    for (const skill of requiredSkills) {

        if (studentSkillSet.has(skill.toLowerCase())) {
            matchedSkills.push(skill);
        } else {
            missingSkills.push(skill);
        }

    }

    const score = Math.round(
        (matchedSkills.length / requiredSkills.length) * 100
    );

    return {
        score,
        matchedSkills,
        missingSkills,
    };
};

module.exports = calculateCompatibility;