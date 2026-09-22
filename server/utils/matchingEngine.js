const calculateMatchingScore = ({
  developer,
  project,
}) => {
  /*
    Weighting:

    Skills        40%
    Availability  20%
    Experience    15%
    Communication 15%
    Projects      10%
  */

  const developerSkills = (developer.skills || []).map(
    (skill) => skill.toLowerCase().trim()
  );

  const requiredSkills = (
    project.requiredSkills || []
  ).map((skill) => skill.toLowerCase().trim());

  const matchedSkills = requiredSkills.filter(
    (skill) =>
      developerSkills.includes(skill)
  );

  const missingSkills = requiredSkills.filter(
    (skill) =>
      !developerSkills.includes(skill)
  );

  // -------------------------
  // Skills - 40%
  // -------------------------

  const skillScore =
    requiredSkills.length === 0
      ? 100
      : (matchedSkills.length /
          requiredSkills.length) *
        100;

  // -------------------------
  // Experience - 15%
  // -------------------------

  const experienceRequired =
    project.experienceRequired || 0;

  const experienceScore =
    experienceRequired === 0
      ? 100
      : Math.min(
          (developer.experienceYears /
            experienceRequired) *
            100,
          100
        );

  // -------------------------
  // Availability - 20%
  // -------------------------

  const availabilityRequired =
    project.availabilityRequired || 0;

  const availabilityScore =
    availabilityRequired === 0
      ? 100
      : Math.min(
          (developer.availabilityHours /
            availabilityRequired) *
            100,
          100
        );

  // -------------------------
  // Communication - 15%
  // -------------------------

  const communicationRequired =
    project.communicationRequired || 3;

  const communicationScore =
    communicationRequired === 0
      ? 100
      : Math.min(
          (developer.communicationRating /
            communicationRequired) *
            100,
          100
        );

  // -------------------------
  // Projects - 10%
  // -------------------------

  const projectsScore =
    Math.min(
      (developer.projectsCount / 5) * 100,
      100
    );

  // -------------------------
  // Final Score
  // -------------------------

  const score = Math.round(
    skillScore * 0.40 +
    availabilityScore * 0.20 +
    experienceScore * 0.15 +
    communicationScore * 0.15 +
    projectsScore * 0.10
  );

  return {
    score,

    breakdown: {
      skills: Math.round(skillScore),
      availability: Math.round(
        availabilityScore
      ),
      experience: Math.round(
        experienceScore
      ),
      communication: Math.round(
        communicationScore
      ),
      projects: Math.round(
        projectsScore
      ),
    },

    matchedSkills,
    missingSkills,
  };
};

module.exports = {
  calculateMatchingScore,
};