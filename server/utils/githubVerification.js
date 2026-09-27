const axios = require("axios");

const parseGithubUrl = (githubUrl) => {
  try {
    const url = new URL(githubUrl);

    if (url.hostname !== "github.com") {
      return null;
    }

    const parts = url.pathname
      .split("/")
      .filter(Boolean);

    if (parts.length < 2) {
      return null;
    }

    return {
      owner: parts[0],
      repo: parts[1].replace(".git", ""),
    };
  } catch (error) {
    return null;
  }
};


// Convert technology names into a standard format
const normalizeTechnology = (technology) => {
  return technology
    .toLowerCase()
    .trim()
    .replace(/[.\-_]/g, "");
};


// Check package.json files for technologies
const detectPackageTechnologies = (packageFiles) => {
  const detected = new Set();

  for (const packageData of packageFiles) {
    const dependencies = {
      ...(packageData.dependencies || {}),
      ...(packageData.devDependencies || {}),
    };

    const dependencyNames = Object.keys(dependencies).map(
      (dependency) => dependency.toLowerCase()
    );

    // React
    if (
      dependencyNames.includes("react") ||
      dependencyNames.includes("react-dom")
    ) {
      detected.add("React");
    }

    // Express
    if (dependencyNames.includes("express")) {
      detected.add("Express");
    }

    // MongoDB
    if (
      dependencyNames.includes("mongodb") ||
      dependencyNames.includes("mongoose")
    ) {
      detected.add("MongoDB");
    }

    // Node.js
    if (
      packageData.engines &&
      packageData.engines.node
    ) {
      detected.add("Node.js");
    }

    // Express or other common Node packages
    // are also strong evidence that Node.js is being used
    if (
      dependencyNames.includes("express") ||
      dependencyNames.includes("mongoose") ||
      dependencyNames.includes("jsonwebtoken")
    ) {
      detected.add("Node.js");
    }
  }

  return Array.from(detected);
};

const calculateProjectRelevance = ({
  projectName,
  projectDescription,
  readmeContent,
  repositoryName,
  technologies,
}) => {
  const projectText = `
    ${projectName}
    ${projectDescription}
    ${technologies.join(" ")}
  `
    .toLowerCase();

  const githubText = `
    ${repositoryName}
    ${readmeContent}
  `
    .toLowerCase();

  // Extract meaningful words
  const stopWords = new Set([
    "the",
    "and",
    "for",
    "with",
    "this",
    "that",
    "from",
    "into",
    "using",
    "used",
    "project",
    "application",
    "app",
    "system",
    "website",
    "web",
  ]);

  const extractWords = (text) => {
    return [
      ...new Set(
        text
          .replace(/[^a-zA-Z0-9+#.\-]/g, " ")
          .split(/\s+/)
          .map((word) => word.trim().toLowerCase())
          .filter(
            (word) =>
              word.length >= 3 &&
              !stopWords.has(word)
          )
      ),
    ];
  };

  const projectWords = extractWords(projectText);

  const matchedKeywords = projectWords.filter(
    (word) => githubText.includes(word)
  );

  if (projectWords.length === 0) {
    return {
      score: 0,
      status: "Unable to Determine",
      matchedKeywords: [],
      reason:
        "Not enough project information was provided.",
    };
  }

  const score = Math.round(
    (matchedKeywords.length / projectWords.length) * 100
  );

  let status = "Low Relevance";

  if (score >= 60) {
    status = "Relevant";
  } else if (score >= 30) {
    status = "Partially Relevant";
  }

  return {
    score,
    status,
    matchedKeywords,
    reason:
      score >= 60
        ? "The repository contains information matching the submitted project."
        : score >= 30
        ? "Some repository information matches the submitted project."
        : "The repository contains limited information matching the submitted project.",
  };
};
const verifyGithubProject = async ({
    githubUrl,
  projectName = "",
  projectDescription = "",
  technologies = [],
}) => {
  const repository = parseGithubUrl(githubUrl);

  if (!repository) {
    return {
      status: "Failed",
      repositoryExists: false,
      hasReadme: false,
      hasCode: false,
      detectedLanguages: [],
      detectedTechnologies: [],
      matchedTechnologies: [],
      missingTechnologies: technologies,
      verifiedAt: new Date(),
    };
  }

  const { owner, repo } = repository;

  try {
    // --------------------------------
    // 1. Check repository
    // --------------------------------

    const repoResponse = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}`,
      {
        headers: {
          Accept: "application/vnd.github+json",
        },
      }
    );

    const repoData = repoResponse.data;


    // --------------------------------
    // 2. Check README
    // --------------------------------

   let hasReadme = false;
let readmeContent = "";

try {
  const readmeResponse = await axios.get(
    `https://api.github.com/repos/${owner}/${repo}/readme`,
    {
      headers: {
        Accept: "application/vnd.github+json",
      },
    }
  );

  hasReadme = true;

  if (readmeResponse.data.content) {
    readmeContent = Buffer.from(
      readmeResponse.data.content,
      "base64"
    ).toString("utf-8");
  }
} catch (error) {
  hasReadme = false;
  readmeContent = "";
}

    // --------------------------------
    // 3. Get repository tree
    // --------------------------------

    const treeResponse = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/git/trees/${repoData.default_branch}?recursive=1`,
      {
        headers: {
          Accept: "application/vnd.github+json",
        },
      }
    );

    const tree = treeResponse.data.tree || [];


    // --------------------------------
    // 4. Check for code anywhere
    // --------------------------------

    const codeExtensions = [
      ".js",
      ".jsx",
      ".ts",
      ".tsx",
      ".py",
      ".java",
      ".cpp",
      ".c",
      ".html",
      ".css",
    ];

    const hasCode = tree.some((item) => {
      if (item.type !== "blob") {
        return false;
      }

      const fileName = item.path.toLowerCase();

      return codeExtensions.some((extension) =>
        fileName.endsWith(extension)
      );
    });


    // --------------------------------
    // 5. Detect GitHub languages
    // --------------------------------

    const languagesResponse = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/languages`,
      {
        headers: {
          Accept: "application/vnd.github+json",
        },
      }
    );

    const detectedLanguages = Object.keys(
      languagesResponse.data
    );


    // --------------------------------
    // 6. Find package.json files
    // --------------------------------

    const packageJsonFiles = tree.filter(
      (item) =>
        item.type === "blob" &&
        item.path.toLowerCase().endsWith("package.json")
    );


    // --------------------------------
    // 7. Read package.json files
    // --------------------------------

    const packageFiles = [];

    for (const packageFile of packageJsonFiles) {
      try {
        const response = await axios.get(
          `https://api.github.com/repos/${owner}/${repo}/contents/${packageFile.path}`,
          {
            headers: {
              Accept: "application/vnd.github+json",
            },
          }
        );

        const content = Buffer.from(
          response.data.content,
          "base64"
        ).toString("utf-8");

        const packageData = JSON.parse(content);

        packageFiles.push(packageData);
      } catch (error) {
        // Ignore invalid or unreadable package.json
      }
    }


    // --------------------------------
    // 8. Detect technologies
    // --------------------------------

    const packageTechnologies =
      detectPackageTechnologies(packageFiles);

    const detectedTechnologies = [
      ...new Set([
        ...detectedLanguages,
        ...packageTechnologies,
      ]),
    ];


    // --------------------------------
    // 9. Compare claimed technologies
    // --------------------------------

    const detectedNormalized =
      detectedTechnologies.map(
        normalizeTechnology
      );

    const matchedTechnologies =
      technologies.filter((technology) =>
        detectedNormalized.includes(
          normalizeTechnology(technology)
        )
      );

    const missingTechnologies =
      technologies.filter(
        (technology) =>
          !matchedTechnologies.includes(
            technology
          )
      );


    // --------------------------------
    // 10. Final verification status
    // --------------------------------

    const status =
      repoData.private === false &&
      hasReadme &&
      hasCode &&
      missingTechnologies.length === 0
        ? "Verified"
        : "Failed";

    const relevance = calculateProjectRelevance({
  projectName,
  projectDescription,
  readmeContent,
  repositoryName: repoData.name,
  technologies,
});
    return {
      status,
      repositoryExists: true,
      hasReadme,
      hasCode,
      detectedLanguages,
      detectedTechnologies,
      matchedTechnologies,
      missingTechnologies,
      relevance,
      verifiedAt: new Date(),
    };

  } catch (error) {

    console.error(
      "GitHub verification error:",
      error.response?.data || error.message
    );

    return {
      status: "Failed",
      repositoryExists: false,
      hasReadme: false,
      hasCode: false,
      detectedLanguages: [],
      detectedTechnologies: [],
      matchedTechnologies: [],
      missingTechnologies: technologies,
      verifiedAt: new Date(),
    };
  }
};


module.exports = {
  verifyGithubProject,
};