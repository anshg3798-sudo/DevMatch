const axios = require("axios");

// =====================================================
// 1. PARSE GITHUB URL
// =====================================================

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


// =====================================================
// 2. PARSE GITHUB USERNAME
// =====================================================

const parseGithubUsername = (githubUrl) => {
  try {
    if (!githubUrl) {
      return null;
    }

    const url = new URL(githubUrl);

    if (url.hostname !== "github.com") {
      return null;
    }

    const parts = url.pathname
      .split("/")
      .filter(Boolean);

    return parts[0] || null;
  } catch (error) {
    return null;
  }
};


// =====================================================
// 3. NORMALIZE TECHNOLOGY
// =====================================================

const normalizeTechnology = (technology) => {
  return technology
    .toLowerCase()
    .trim()
    .replace(/[._-]/g, "");
};


// =====================================================
// 4. DETECT TECHNOLOGIES FROM package.json
// =====================================================

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

    if (
      dependencyNames.includes("express") ||
      dependencyNames.includes("mongoose") ||
      dependencyNames.includes("jsonwebtoken")
    ) {
      detected.add("Node.js");
    }

    // =================================================
    // AI / ML / RAG technologies
    // =================================================

    // OpenAI
    if (
      dependencyNames.includes("openai")
    ) {
      detected.add("AI");
    }

    // LangChain
    if (
      dependencyNames.includes("langchain") ||
      dependencyNames.includes("@langchain/core") ||
      dependencyNames.includes("@langchain/openai")
    ) {
      detected.add("AI");
      detected.add("RAG");
    }

    // Transformers
    if (
      dependencyNames.includes("@huggingface/transformers")
    ) {
      detected.add("AI");
      detected.add("ML");
    }

    // TensorFlow
    if (
      dependencyNames.includes("@tensorflow/tfjs")
    ) {
      detected.add("AI");
      detected.add("ML");
    }

    // Generic AI packages
    if (
      dependencyNames.some((dependency) =>
        dependency.includes("openai") ||
        dependency.includes("llama") ||
        dependency.includes("gemini") ||
        dependency.includes("anthropic")
      )
    ) {
      detected.add("AI");
    }
  }

  return Array.from(detected);
};


// =====================================================
// 5. DETECT PYTHON TECHNOLOGIES
// =====================================================

const detectPythonTechnologies = (dependencyText) => {
  const detected = new Set();

  const text = dependencyText.toLowerCase();

  // Python
  if (text.trim().length > 0) {
    detected.add("Python");
  }

  // Data Science
  if (
    text.includes("pandas") ||
    text.includes("numpy") ||
    text.includes("matplotlib")
  ) {
    detected.add("Data Science");
  }

  // Machine Learning
  if (
    text.includes("scikit-learn") ||
    text.includes("sklearn") ||
    text.includes("tensorflow") ||
    text.includes("torch") ||
    text.includes("pytorch") ||
    text.includes("xgboost")
  ) {
    detected.add("ML");
  }

  // AI
  if (
    text.includes("tensorflow") ||
    text.includes("torch") ||
    text.includes("pytorch") ||
    text.includes("transformers") ||
    text.includes("openai") ||
    text.includes("langchain") ||
    text.includes("llamaindex") ||
    text.includes("llama-index")
  ) {
    detected.add("AI");
  }

  // NLP
  if (
    text.includes("transformers") ||
    text.includes("spacy") ||
    text.includes("nltk") ||
    text.includes("sentence-transformers")
  ) {
    detected.add("NLP");
  }

  // RAG
  if (
    text.includes("langchain") ||
    text.includes("llamaindex") ||
    text.includes("llama-index") ||
    text.includes("faiss") ||
    text.includes("chromadb") ||
    text.includes("pinecone")
  ) {
    detected.add("RAG");
  }

  return Array.from(detected);
};


// =====================================================
// 6. PROJECT RELEVANCE
// =====================================================

const calculateProjectRelevance = ({
  projectName,
  projectDescription,
  readmeContent,
  repositoryName,
  repositoryDescription = "",
  repositoryTopics = [],
  technologies,
}) => {

  const projectText = `
    ${projectName}
    ${projectDescription}
    ${technologies.join(" ")}
  `.toLowerCase();

  const githubText = `
    ${repositoryName}
    ${repositoryDescription}
    ${repositoryTopics.join(" ")}
    ${readmeContent}
  `.toLowerCase();


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
    "built",
    "based",
    "developed",
  ]);


  const extractWords = (text) => {
    return [
      ...new Set(
        text
          .replace(/[^a-zA-Z0-9+#.-]/g, " ")
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


// =====================================================
// 7. PROJECT DOMAIN EVIDENCE
// =====================================================

const calculateDomainEvidence = ({
  projectName,
  projectDescription,
  technologies,
  readmeContent,
  repositoryName,
  repositoryTopics,
  detectedTechnologies,
  treePaths,
}) => {

  const claimedText = `
    ${projectName}
    ${projectDescription}
    ${technologies.join(" ")}
  `.toLowerCase();

  const repositoryText = `
    ${repositoryName}
    ${repositoryTopics.join(" ")}
    ${readmeContent}
    ${detectedTechnologies.join(" ")}
    ${treePaths.join(" ")}
  `.toLowerCase();


  const evidence = [];

  let score = 0;


  // =================================================
  // AI / ML / RAG PROJECT
  // =================================================

  const claimsAI =
    claimedText.includes("ai") ||
    claimedText.includes("artificial intelligence");

  const claimsML =
    claimedText.includes("ml") ||
    claimedText.includes("machine learning");

  const claimsRAG =
    claimedText.includes("rag") ||
    claimedText.includes("retrieval augmented");

  const claimsNLP =
    claimedText.includes("nlp") ||
    claimedText.includes("natural language");

  const hasAI =
    detectedTechnologies.includes("AI") ||
    repositoryText.includes("artificial intelligence");

  const hasML =
    detectedTechnologies.includes("ML") ||
    repositoryText.includes("machine learning");

  const hasRAG =
    detectedTechnologies.includes("RAG") ||
    repositoryText.includes("retrieval augmented") ||
    repositoryText.includes("rag");

  const hasNLP =
    detectedTechnologies.includes("NLP") ||
    repositoryText.includes("natural language");


  if (claimsAI) {
    if (hasAI) {
      score += 25;

      evidence.push({
        type: "AI",
        matched: true,
        reason: "Repository contains evidence of AI usage.",
      });
    } else {
      evidence.push({
        type: "AI",
        matched: false,
        reason: "AI was claimed but repository evidence is weak.",
      });
    }
  }


  if (claimsML) {
    if (hasML) {
      score += 25;

      evidence.push({
        type: "ML",
        matched: true,
        reason: "Repository contains machine-learning evidence.",
      });
    } else {
      evidence.push({
        type: "ML",
        matched: false,
        reason: "Machine learning was claimed but not detected.",
      });
    }
  }


  if (claimsRAG) {
    if (hasRAG) {
      score += 25;

      evidence.push({
        type: "RAG",
        matched: true,
        reason: "Repository contains evidence of RAG/vector-search technology.",
      });
    } else {
      evidence.push({
        type: "RAG",
        matched: false,
        reason: "RAG was claimed but supporting evidence was not detected.",
      });
    }
  }


  if (claimsNLP) {
    if (hasNLP) {
      score += 25;

      evidence.push({
        type: "NLP",
        matched: true,
        reason: "Repository contains NLP-related evidence.",
      });
    } else {
      evidence.push({
        type: "NLP",
        matched: false,
        reason: "NLP was claimed but supporting evidence was not detected.",
      });
    }
  }


  // =================================================
  // RESUME PROJECT
  // =================================================

  const claimsResume =
    claimedText.includes("resume") ||
    claimedText.includes("cv");


  if (claimsResume) {

    const resumeEvidence =
      repositoryText.includes("resume") ||
      repositoryText.includes("cv") ||
      repositoryText.includes("candidate") ||
      repositoryText.includes("skill extraction");


    if (resumeEvidence) {
      score += 15;

      evidence.push({
        type: "Resume",
        matched: true,
        reason:
          "Repository contains resume/CV-related project evidence.",
      });
    } else {
      evidence.push({
        type: "Resume",
        matched: false,
        reason:
          "Resume/CV was claimed but repository evidence is weak.",
      });
    }
  }


  // =================================================
  // CAP SCORE AT 100
  // =================================================

  score = Math.min(score, 100);


  let status = "Weak Domain Match";

  if (score >= 75) {
    status = "Strong Domain Match";
  } else if (score >= 40) {
    status = "Partial Domain Match";
  }


  return {
    score,
    status,
    evidence,
  };
};


// =====================================================
// 8. VERIFY GITHUB PROJECT
// =====================================================

const verifyGithubProject = async ({
  githubUrl,
  projectName = "",
  projectDescription = "",
  technologies = [],
  candidateGithub = "",
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

      relevance: {
        score: 0,
        status: "Unable to Determine",
        matchedKeywords: [],
      },

      authenticity: {
        score: 0,
        status: "Unable to Determine",
      },

      verifiedAt: new Date(),
    };
  }


  const { owner, repo } = repository;


  try {

    // =================================================
    // 1. CHECK REPOSITORY
    // =================================================

    const repoResponse = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}`,
      {
        headers: {
          Accept: "application/vnd.github+json",
        },
      }
    );


    const repoData = repoResponse.data;


    // =================================================
    // 2. CHECK README
    // =================================================

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


    // =================================================
    // 3. GET REPOSITORY TOPICS
    // =================================================

    let repositoryTopics = [];


    try {

      const topicsResponse = await axios.get(
        `https://api.github.com/repos/${owner}/${repo}/topics`,
        {
          headers: {
            Accept: "application/vnd.github+json",
          },
        }
      );


      repositoryTopics =
        topicsResponse.data.names || [];

    } catch (error) {

      repositoryTopics = [];
    }


    // =================================================
    // 4. GET REPOSITORY TREE
    // =================================================

    const treeResponse = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/git/trees/${repoData.default_branch}?recursive=1`,
      {
        headers: {
          Accept: "application/vnd.github+json",
        },
      }
    );


    const tree = treeResponse.data.tree || [];


    const treePaths = tree
      .filter((item) => item.type === "blob")
      .map((item) => item.path.toLowerCase());


    // =================================================
    // 5. CHECK FOR CODE
    // =================================================

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
      ".ipynb",
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


    // =================================================
    // 6. DETECT GITHUB LANGUAGES
    // =================================================

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


    // =================================================
    // 7. FIND package.json FILES
    // =================================================

    const packageJsonFiles = tree.filter(
      (item) =>
        item.type === "blob" &&
        item.path.toLowerCase().endsWith("package.json")
    );


    // =================================================
    // 8. READ package.json FILES
    // =================================================

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


    // =================================================
    // 9. DETECT PYTHON DEPENDENCIES
    // =================================================

    const pythonDependencyFiles = tree.filter(
      (item) =>
        item.type === "blob" &&
        (
          item.path.toLowerCase().endsWith("requirements.txt") ||
          item.path.toLowerCase().endsWith("pyproject.toml") ||
          item.path.toLowerCase().endsWith("environment.yml") ||
          item.path.toLowerCase().endsWith("environment.yaml")
        )
    );


    let pythonDependencyText = "";


    for (const dependencyFile of pythonDependencyFiles) {

      try {

        const response = await axios.get(
          `https://api.github.com/repos/${owner}/${repo}/contents/${dependencyFile.path}`,
          {
            headers: {
              Accept: "application/vnd.github+json",
            },
          }
        );


        if (response.data.content) {

          const content = Buffer.from(
            response.data.content,
            "base64"
          ).toString("utf-8");


          pythonDependencyText +=
            "\n" + content;
        }

      } catch (error) {

        // Ignore unreadable dependency files
      }
    }


    // =================================================
    // 10. DETECT TECHNOLOGIES
    // =================================================

    const packageTechnologies =
      detectPackageTechnologies(packageFiles);


    const pythonTechnologies =
      detectPythonTechnologies(
        pythonDependencyText
      );


    const detectedTechnologies = [
      ...new Set([
        ...detectedLanguages,
        ...packageTechnologies,
        ...pythonTechnologies,
      ]),
    ];


    // =================================================
    // 11. COMPARE CLAIMED TECHNOLOGIES
    // =================================================

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


    // =================================================
    // 12. CANDIDATE OWNERSHIP
    // =================================================

    const candidateUsername =
      parseGithubUsername(candidateGithub);


    const repositoryOwner =
      repoData.owner?.login || owner;


    let ownerMatches = false;


    if (candidateUsername) {

      ownerMatches =
        candidateUsername.toLowerCase() ===
        repositoryOwner.toLowerCase();
    }


    // =================================================
    // 13. CHECK CONTRIBUTORS
    // =================================================

    let candidateIsContributor = false;


    if (candidateUsername) {

      try {

        const contributorsResponse =
          await axios.get(
            `https://api.github.com/repos/${owner}/${repo}/contributors`,
            {
              headers: {
                Accept: "application/vnd.github+json",
              },

              params: {
                per_page: 100,
              },
            }
          );


        const contributors =
          contributorsResponse.data || [];


        candidateIsContributor =
          contributors.some(
            (contributor) =>
              contributor.login?.toLowerCase() ===
              candidateUsername.toLowerCase()
          );

      } catch (error) {

        candidateIsContributor = false;
      }
    }


    // =================================================
    // 14. OWNERSHIP SCORE
    // =================================================

    let ownershipScore = 50;


    if (candidateGithub) {

      if (ownerMatches) {
        ownershipScore = 100;
      } else if (candidateIsContributor) {
        ownershipScore = 70;
      } else {
        ownershipScore = 0;
      }
    }


    // =================================================
    // 15. PROJECT RELEVANCE
    // =================================================

    const relevance =
      calculateProjectRelevance({

        projectName,

        projectDescription,

        readmeContent,

        repositoryName:
          repoData.name,

        repositoryDescription:
          repoData.description || "",

        repositoryTopics,

        technologies,
      });


    // =================================================
    // 16. DOMAIN EVIDENCE
    // =================================================

    const domainEvidence =
      calculateDomainEvidence({

        projectName,

        projectDescription,

        technologies,

        readmeContent,

        repositoryName:
          repoData.name,

        repositoryTopics,

        detectedTechnologies,

        treePaths,
      });


    // =================================================
    // 17. TECHNOLOGY MATCH SCORE
    // =================================================

    let technologyScore = 100;


    if (technologies.length > 0) {

      technologyScore =
        Math.round(
          (
            matchedTechnologies.length /
            technologies.length
          ) * 100
        );
    }


    // =================================================
    // 18. AUTHENTICITY SCORE
    // =================================================

    const authenticityScore =
      Math.round(
        relevance.score * 0.40 +
        technologyScore * 0.25 +
        domainEvidence.score * 0.20 +
        ownershipScore * 0.15
      );


    // =================================================
    // 19. AUTHENTICITY STATUS
    // =================================================

    let authenticityStatus =
      "Likely Mismatch";


    if (authenticityScore >= 75) {

      authenticityStatus =
        "Strong Match";

    } else if (authenticityScore >= 50) {

      authenticityStatus =
        "Partial Match";
    }


    // =================================================
    // 20. BASIC VERIFICATION
    // =================================================

    const basicVerification =
      repoData.private === false &&
      hasReadme &&
      hasCode &&
      missingTechnologies.length === 0;


    // =================================================
    // 21. FINAL STATUS
    // =================================================

    const status =
      basicVerification &&
      authenticityScore >= 60
        ? "Verified"
        : "Failed";


    // =================================================
    // 22. RETURN RESULT
    // =================================================

    return {

      // Existing fields
      status,

      repositoryExists: true,

      hasReadme,

      hasCode,

      detectedLanguages,

      detectedTechnologies,

      matchedTechnologies,

      missingTechnologies,

      relevance,


      // NEW PROJECT AUTHENTICITY DATA
      authenticity: {

        score: authenticityScore,

        status: authenticityStatus,

        ownership: {

          candidateGithub:
            candidateUsername,

          repositoryOwner,

          ownerMatches,

          candidateIsContributor,

          score: ownershipScore,
        },


        technologyScore,

        domainEvidence,


        repositoryEvidence: {

          repositoryExists: true,

          repositoryName:
            repoData.name,

          repositoryDescription:
            repoData.description || "",

          repositoryTopics,

          hasReadme,

          hasCode,

          detectedLanguages,

          detectedTechnologies,
        },


        claim: {

          projectName,

          projectDescription,

          technologies,
        },
      },


      verifiedAt: new Date(),
    };


  } catch (error) {

    console.error(
      "GitHub verification error:",
      error.response?.data ||
      error.message
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


      relevance: {

        score: 0,

        status: "Unable to Determine",

        matchedKeywords: [],
      },


      authenticity: {

        score: 0,

        status: "Unable to Determine",

      },


      verifiedAt: new Date(),
    };
  }
};


// =====================================================
// 23. EXPORT
// =====================================================

module.exports = {
  verifyGithubProject,
};