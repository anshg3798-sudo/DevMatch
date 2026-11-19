
const DEFAULT_WEIGHTS = {
  skills: 40,
  availability: 20,
  experience: 15,
  communication: 15,
  projects: 10,
};

// Normalize skill names so equivalent technologies match.
const normalizeSkill = (skill) => {
  const value = String(skill || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

  const aliases = {
    "react.js": "react",
    "reactjs": "react",
    "node.js": "node",
    "nodejs": "node",
    "mongodb": "mongodb",
    "mongo db": "mongodb",
    "express.js": "express",
    "expressjs": "express",
    "next.js": "nextjs",
  };

  return aliases[value] || value;
};

const safeNumber = (value, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(0, number) : fallback;
};

const calculateMatchingScore = ({ developer, project }) => {
  const weights = {
    ...DEFAULT_WEIGHTS,
    ...(project.matchingWeights?.toObject?.() ||
      project.matchingWeights ||
      {}),
  };

  const totalWeight = Object.values(weights).reduce(
    (sum, weight) => sum + safeNumber(weight),
    0
  );

  if (totalWeight !== 100) {
    throw new Error("Matching weights must total 100.");
  }

  // -------------------------
  // SKILLS - Recruiter weight
  // -------------------------

  const developerSkills = [
    ...new Set((developer.skills || []).map(normalizeSkill).filter(Boolean)),
  ];

  const requiredSkills = [
    ...new Set((project.requiredSkills || []).map(normalizeSkill).filter(Boolean)),
  ];

  const matchedSkills = requiredSkills.filter((skill) =>
    developerSkills.includes(skill)
  );

  const missingSkills = requiredSkills.filter(
    (skill) => !developerSkills.includes(skill)
  );

  const skillScore =
    requiredSkills.length === 0
      ? 100
      : (matchedSkills.length / requiredSkills.length) * 100;

  // -------------------------
  // EXPERIENCE
  // -------------------------

  const experienceRequired = safeNumber(project.experienceRequired);
  const experience = safeNumber(developer.experienceYears);

  const experienceScore =
    experienceRequired === 0
      ? 100
      : Math.min((experience / experienceRequired) * 100, 100);

  // -------------------------
  // AVAILABILITY
  // -------------------------

  const availabilityRequired = safeNumber(project.availabilityRequired);
  const availability = safeNumber(developer.availabilityHours);

  const availabilityScore =
    availabilityRequired === 0
      ? 100
      : Math.min(
          (availability / availabilityRequired) * 100,
          100
        );

  // -------------------------
  // COMMUNICATION
  // -------------------------

  const communicationRequired = safeNumber(
    project.communicationRequired,
    3
  );

  const communication = safeNumber(developer.communicationRating);

  const communicationScore =
    communicationRequired === 0
      ? 100
      : Math.min(
          (communication / communicationRequired) * 100,
          100
        );

  // -------------------------
  // PROJECTS
  // -------------------------

  const projectsCount = safeNumber(
    developer.projectsCount,
    developer.projects?.length || 0
  );

  // Maximum reference: 5 projects.
  const projectsScore = Math.min(
    (projectsCount / 5) * 100,
    100
  );

  // -------------------------
  // FACTOR BREAKDOWN
  // -------------------------

  const breakdown = {
    skills: Math.round(skillScore),
    availability: Math.round(availabilityScore),
    experience: Math.round(experienceScore),
    communication: Math.round(communicationScore),
    projects: Math.round(projectsScore),
  };

  // -------------------------
  // WEIGHTED FINAL SCORE
  // -------------------------

  const score = Math.round(
    Object.keys(weights).reduce(
      (total, factor) =>
        total + breakdown[factor] * weights[factor] / 100,
      0
    )
  );

  return {
    score,
    breakdown,
    weights,
    matchedSkills,
    missingSkills,
  };
};

module.exports = {
  calculateMatchingScore,
  DEFAULT_WEIGHTS,
  normalizeSkill,
};
