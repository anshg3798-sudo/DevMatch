const axios = require("axios");

// One shared GitHub API client.
// If GITHUB_TOKEN is absent, public repository requests still work.
const githubApi = axios.create({
  baseURL: "https://api.github.com",
  timeout: 20000,
  headers: {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    ...(process.env.GITHUB_TOKEN
      ? {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        }
      : {}),
  },
});

// =====================================================
// 1. PARSE GITHUB URL
// =====================================================

const parseGithubUrl = (githubUrl) => {
  try {
    if (typeof githubUrl !== "string" || !githubUrl.trim()) {
      return null;
    }

    const url = new URL(githubUrl.trim());

    if (
      url.protocol !== "https:" ||
      url.hostname.toLowerCase() !== "github.com"
    ) {
      return null;
    }

    const parts = url.pathname.split("/").filter(Boolean);

    // A repository URL must contain exactly owner/repository.
    if (parts.length !== 2) {
      return null;
    }

    const owner = parts[0];
    const repo = parts[1].replace(/\.git$/i, "");

    if (!owner || !repo) {
      return null;
    }

    return { owner, repo };
  } catch {
    return null;
  }
};

// =====================================================
// 2. PARSE GITHUB USERNAME
// =====================================================

const parseGithubUsername = (githubUrl) => {
  try {
    if (typeof githubUrl !== "string" || !githubUrl.trim()) {
      return null;
    }

    const url = new URL(githubUrl.trim());

    if (
      url.protocol !== "https:" ||
      url.hostname.toLowerCase() !== "github.com"
    ) {
      return null;
    }

    const parts = url.pathname.split("/").filter(Boolean);

    return parts[0] || null;
  } catch {
    return null;
  }
};

// =====================================================
// 3. NORMALIZE TECHNOLOGY
// =====================================================

const normalizeTechnology = (technology) => {
  if (typeof technology !== "string") {
    return "";
  }

  return technology
    .toLowerCase()
    .trim()
    .replace(/[.\_-]/g, "");
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
    if (dependencyNames.includes("openai")) {
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
    // =================================================
  // WEB PROJECT RELEVANCE ANALYSIS
  // =================================================

  // Keep AI/ML/RAG/NLP projects on the original relevance calculation.
  const claimsNonWeb =
    /\b(ai|ml|rag|nlp)\b|artificial intelligence|machine learning|deep learning|retrieval augmented|vector database|embeddings/i.test(
      projectText
    );

  const normalizedClaimedTechnologies = technologies.map(
    (technology) => normalizeTechnology(technology)
  );

  const isWebProject =
    !claimsNonWeb &&
    (
      projectText.includes("full stack") ||
      projectText.includes("fullstack") ||
      normalizedClaimedTechnologies.some((technology) =>
        ["react", "express", "nodejs", "mongodb", "vue", "angular", "nextjs"].includes(technology)
      )
    );

  if (isWebProject) {
    const normalizedProjectName = projectName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");

    const normalizedRepositoryName = repositoryName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");

    // Semantic groups help recognize related project descriptions.
    const conceptGroups = [
      {
        name: "platform",
        aliases: ["platform", "application", "app", "system", "portal"],
      },
      {
        name: "people",
        aliases: [
          "recruiter", "recruiters", "developer", "developers",
          "student", "students", "candidate", "candidates",
          "team", "teams", "teammate", "teammates",
        ],
      },
      {
        name: "purpose",
        aliases: [
          "connect", "connecting", "connection", "match", "matching",
          "find", "discover", "recommend", "recommendation",
        ],
      },
      {
        name: "project domain",
        aliases: ["project", "projects", "software", "portfolio", "collaboration"],
      },
    ];

    const matchedGroups = [];
    const applicableGroups = [];

    for (const group of conceptGroups) {
      const claimedGroup = group.aliases.some((alias) =>
        projectText.includes(alias)
      );

      if (!claimedGroup) continue;

      applicableGroups.push(group.name);

      const repositoryMatches = group.aliases.filter((alias) =>
        githubText.includes(alias)
      );

      if (repositoryMatches.length > 0) {
        matchedGroups.push({
          name: group.name,
          matchedKeywords: repositoryMatches,
        });
      }
    }

    const nameMatches =
      normalizedProjectName.length >= 3 &&
      normalizedProjectName === normalizedRepositoryName;

    const nameScore = nameMatches ? 25 : 0;

    const conceptScore =
      applicableGroups.length > 0
        ? Math.round((matchedGroups.length / applicableGroups.length) * 75)
        : 0;

    const webRelevanceScore = Math.min(100, nameScore + conceptScore);

    let webStatus = "Low Relevance";

    if (webRelevanceScore >= 60) {
      webStatus = "Relevant";
    } else if (webRelevanceScore >= 30) {
      webStatus = "Partially Relevant";
    }

    return {
      score: webRelevanceScore,
      status: webStatus,
      matchedKeywords: [
        ...(nameMatches ? [projectName] : []),
        ...matchedGroups.flatMap((group) => group.matchedKeywords),
      ],
      reason:
        "WEB project relevance was evaluated using repository name and matching project concepts.",
      details: {
        nameMatches,
        nameScore,
        applicableGroups,
        matchedGroups,
        conceptScore,
      },
    };
  }

  // Original relevance calculation for AI/ML/RAG/NLP and other projects.
  const projectWords = extractWords(projectText);

  const matchedKeywords = projectWords.filter(
    (word) => githubText.includes(word)
  );

  if (projectWords.length === 0) {
    return {
      score: 0,
      status: "Unable to Determine",
      matchedKeywords: [],
      reason: "Not enough project information was provided.",
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
  // WEB DEVELOPMENT PROJECT
  // =================================================

  const claimsAiMl =
    /\b(ai|ml|artificial intelligence|machine learning|deep learning)\b/i.test(
      claimedText
    );

  const claimsRag =
    /\b(rag|retrieval augmented generation|vector database|embeddings)\b/i.test(
      claimedText
    );

  const claimsWeb =
    claimedText.includes("mern") ||
    claimedText.includes("full stack") ||
    claimedText.includes("fullstack") ||
    claimedText.includes("web development") ||
    claimedText.includes("react") ||
    claimedText.includes("node.js") ||
    claimedText.includes("express") ||
    claimedText.includes("mongodb");

  if (claimsWeb && !claimsAiMl && !claimsRag && !claimsNLP) {
    const normalizedDetected = detectedTechnologies.map(
      (technology) => normalizeTechnology(technology)
    );

    // FRONTEND TECHNOLOGIES
    const frontendTechnologies = [
      "react",
      "react-dom",
      "vue",
      "angular",
      "nextjs",
      "svelte",
    ];

    const matchedFrontend = frontendTechnologies.filter(
      (technology) =>
        normalizedDetected.includes(
          normalizeTechnology(technology)
        )
    );

    // BACKEND TECHNOLOGIES
    const backendTechnologies = [
      "node.js",
      "express",
      "django",
      "flask",
      "fastapi",
      "spring",
      "laravel",
    ];

    const matchedBackend = backendTechnologies.filter(
      (technology) =>
        normalizedDetected.includes(
          normalizeTechnology(technology)
        )
    );

    // DATABASE TECHNOLOGIES
    const databaseTechnologies = [
      "mongodb",
      "mongoose",
      "postgresql",
      "mysql",
      "sqlite",
      "redis",
    ];

    const matchedDatabase = databaseTechnologies.filter(
      (technology) =>
        normalizedDetected.includes(
          normalizeTechnology(technology)
        )
    );

    // FRONTEND EVIDENCE: 35 POINTS
    if (matchedFrontend.length > 0) {
      score += 35;

      evidence.push({
        type: "WEB_FRONTEND",
        matched: true,
        score: 35,
        technologies: matchedFrontend,
        reason: "Repository contains evidence of frontend technologies.",
      });
    } else {
      evidence.push({
        type: "WEB_FRONTEND",
        matched: false,
        score: 0,
        technologies: [],
        reason: "No recognized frontend technology was detected.",
      });
    }

    // BACKEND EVIDENCE: 35 POINTS
    if (matchedBackend.length > 0) {
      score += 35;

      evidence.push({
        type: "WEB_BACKEND",
        matched: true,
        score: 35,
        technologies: matchedBackend,
        reason: "Repository contains evidence of backend technologies.",
      });
    } else {
      evidence.push({
        type: "WEB_BACKEND",
        matched: false,
        score: 0,
        technologies: [],
        reason: "No recognized backend technology was detected.",
      });
    }

    // DATABASE EVIDENCE: 30 POINTS
    if (matchedDatabase.length > 0) {
      score += 30;

      evidence.push({
        type: "WEB_DATABASE",
        matched: true,
        score: 30,
        technologies: matchedDatabase,
        reason: "Repository contains evidence of database technologies.",
      });
    } else {
      evidence.push({
        type: "WEB_DATABASE",
        matched: false,
        score: 0,
        technologies: [],
        reason: "No recognized database technology was detected.",
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
// 8. SOURCE STRUCTURE ANALYSIS
// =====================================================

const analyzeSourceStructure = ({
  projectDomains,
  treePaths = [],
}) => {
  const paths = treePaths.map((path) =>
    path.toLowerCase()
  );

  const evidence = [];
  let score = 0;

  // ==========================================
  // AI / ML STRUCTURE
  // ==========================================

  if (projectDomains.includes("AI_ML")) {
    const mlPatterns = [
      "model.py",
      "train.py",
      "training.py",
      "predict.py",
      "inference.py",
      "machine_learning",
      "machine-learning",
      "ml/",
      "models/",
      "model/",
      "pipeline",
    ];

    const matched = paths.filter((path) =>
      mlPatterns.some((pattern) =>
        path.includes(pattern)
      )
    );

    if (matched.length > 0) {
      score += 30;

      evidence.push({
        category: "AI/ML Source Structure",
        matched: true,
        files: matched.slice(0, 10),
      });
    } else {
      evidence.push({
        category: "AI/ML Source Structure",
        matched: false,
        files: [],
      });
    }
  }

  // ==========================================
  // RAG STRUCTURE
  // ==========================================

  if (projectDomains.includes("RAG")) {
    const ragPatterns = [
      "embedding",
      "embeddings",
      "vector",
      "vectorstore",
      "vector_store",
      "retriever",
      "retrieval",
      "rag",
      "chunk",
    ];

    const matched = paths.filter((path) =>
      ragPatterns.some((pattern) =>
        path.includes(pattern)
      )
    );

    if (matched.length > 0) {
      score += 30;

      evidence.push({
        category: "RAG Source Structure",
        matched: true,
        files: matched.slice(0, 10),
      });
    } else {
      evidence.push({
        category: "RAG Source Structure",
        matched: false,
        files: [],
      });
    }
  }

  // ==========================================
  // RESUME STRUCTURE
  // ==========================================

  if (projectDomains.includes("RESUME")) {
    const resumePatterns = [
      "resume",
      "cv",
      "candidate",
      "skill",
      "parser",
      "jobmatch",
      "job_match",
    ];

    const matched = paths.filter((path) =>
      resumePatterns.some((pattern) =>
        path.includes(pattern)
      )
    );

    if (matched.length > 0) {
      score += 30;

      evidence.push({
        category: "Resume Source Structure",
        matched: true,
        files: matched.slice(0, 10),
      });
    } else {
      evidence.push({
        category: "Resume Source Structure",
        matched: false,
        files: [],
      });
    }
  }

  // ==========================================
  // WEB DEVELOPMENT STRUCTURE
  // ==========================================

  if (projectDomains.includes("WEB")) {
    const frontendPatterns = [
      "client/src/",
      "frontend/src/",
      "src/components/",
      "src/pages/",
      "components/",
      "pages/",
      "views/",
      "app/",
      "public/",
      "vite.config.",
      "next.config.",
    ];

    const backendPatterns = [
      "server/",
      "backend/",
      "routes/",
      "controllers/",
      "middleware/",
      "server.js",
      "app.js",
    ];

    const databasePatterns = [
      "models/",
      "schemas/",
      "migrations/",
      "prisma/",
      "database/",
      "db/",
    ];

    const frontendFiles = paths.filter((path) =>
      frontendPatterns.some((pattern) =>
        path.includes(pattern)
      )
    );

    const backendFiles = paths.filter((path) =>
      backendPatterns.some((pattern) =>
        path.includes(pattern)
      )
    );

    const databaseFiles = paths.filter((path) =>
      databasePatterns.some((pattern) =>
        path.includes(pattern)
      )
    );

    // Frontend evidence
    if (frontendFiles.length > 0) {
      score += 35;

      evidence.push({
        category: "WEB Frontend Structure",
        matched: true,
        files: frontendFiles.slice(0, 10),
      });
    } else {
      evidence.push({
        category: "WEB Frontend Structure",
        matched: false,
        files: [],
      });
    }

    // Backend evidence
    if (backendFiles.length > 0) {
      score += 35;

      evidence.push({
        category: "WEB Backend Structure",
        matched: true,
        files: backendFiles.slice(0, 10),
      });
    } else {
      evidence.push({
        category: "WEB Backend Structure",
        matched: false,
        files: [],
      });
    }

    // Database evidence
    if (databaseFiles.length > 0) {
      score += 30;

      evidence.push({
        category: "WEB Database Structure",
        matched: true,
        files: databaseFiles.slice(0, 10),
      });
    } else {
      evidence.push({
        category: "WEB Database Structure",
        matched: false,
        files: [],
      });
    }
  }

  return {
    score: Math.min(score, 100),
    evidence,
  };
};

// =====================================================
// 9. REPOSITORY EVIDENCE
// =====================================================

const analyzeRepositoryEvidence = ({
  projectDomains,
  repositoryName = "",
  repositoryDescription = "",
  repositoryTopics = [],
  readmeContent = "",
  detectedTechnologies = [],
  treePaths = [],
}) => {
  const repositoryText = `
    ${repositoryName}
    ${repositoryDescription}
    ${repositoryTopics.join(" ")}
    ${readmeContent}
    ${detectedTechnologies.join(" ")}
    ${treePaths.join(" ")}
  `.toLowerCase();

  const evidence = [];
  let score = 0;

  // ==========================================
  // AI / ML
  // ==========================================

  if (projectDomains.includes("AI_ML")) {
    const aiKeywords = [
      "artificial intelligence",
      "machine learning",
      "deep learning",
      "neural network",
      "model",
      "prediction",
      "classification",
      "training",
      "inference",
      "transformer",
    ];

    const matched = aiKeywords.filter((keyword) =>
      repositoryText.includes(keyword)
    );

    if (matched.length > 0) {
      score += 25;

      evidence.push({
        category: "AI/ML",
        matched: true,
        keywords: matched,
      });
    } else {
      evidence.push({
        category: "AI/ML",
        matched: false,
        keywords: [],
      });
    }
  }

  // ==========================================
  // RAG
  // ==========================================

  if (projectDomains.includes("RAG")) {
    const ragKeywords = [
      "rag",
      "retrieval augmented",
      "retrieval-augmented",
      "embedding",
      "vector database",
      "vector store",
      "faiss",
      "chromadb",
      "pinecone",
      "weaviate",
      "langchain",
      "llamaindex",
    ];

    const matched = ragKeywords.filter((keyword) =>
      repositoryText.includes(keyword)
    );

    if (matched.length > 0) {
      score += 25;

      evidence.push({
        category: "RAG",
        matched: true,
        keywords: matched,
      });
    } else {
      evidence.push({
        category: "RAG",
        matched: false,
        keywords: [],
      });
    }
  }

  // ==========================================
  // RESUME
  // ==========================================

  if (projectDomains.includes("RESUME")) {
    const resumeKeywords = [
      "resume",
      "cv",
      "candidate",
      "skill extraction",
      "skills",
      "experience",
      "education",
      "job description",
      "job matching",
    ];

    const matched = resumeKeywords.filter((keyword) =>
      repositoryText.includes(keyword)
    );

    if (matched.length > 0) {
      score += 25;

      evidence.push({
        category: "RESUME",
        matched: true,
        keywords: matched,
      });
    } else {
      evidence.push({
        category: "RESUME",
        matched: false,
        keywords: [],
      });
    }
  }

  // ==========================================
  // WEB
  // ==========================================

  if (projectDomains.includes("WEB")) {
    const webKeywords = [
      "react",
      "node",
      "express",
      "mongodb",
      "mongoose",
      "api",
      "frontend",
      "backend",
      "authentication",
      "router",
    ];

    const matched = webKeywords.filter((keyword) =>
      repositoryText.includes(keyword)
    );

    if (matched.length > 0) {
      score += 25;

      evidence.push({
        category: "WEB",
        matched: true,
        keywords: matched,
      });
    } else {
      evidence.push({
        category: "WEB",
        matched: false,
        keywords: [],
      });
    }
  }

  return {
    score: Math.min(score, 100),
    evidence,
  };
};
// =====================================================
// 10. DETECT PROJECT DOMAIN
// =====================================================

const detectProjectDomain = ({
  projectName = "",
  projectDescription = "",
  technologies = [],
}) => {
  const text = `
    ${projectName}
    ${projectDescription}
    ${technologies.join(" ")}
  `.toLowerCase();

  const domains = [];

  const claimsAI =
    /\b(ai|artificial intelligence)\b/i.test(text);

  const claimsML =
    /\b(ml|machine learning|deep learning)\b/i.test(text);

  const claimsRAG =
    /\b(rag|retrieval augmented|vector database|embedding)\b/i.test(text);

  const claimsNLP =
    /\b(nlp|natural language processing)\b/i.test(text);

  if (claimsAI || claimsML) {
    domains.push("AI_ML");
  }

  if (claimsRAG) {
    domains.push("RAG");
  }

  if (
    text.includes("resume") ||
    text.includes("cv") ||
    text.includes("candidate")
  ) {
    domains.push("RESUME");
  }

  // Only classify as WEB if this is not an AI/ML/RAG/NLP project.
  if (
    !claimsAI &&
    !claimsML &&
    !claimsRAG &&
    !claimsNLP &&
    (
      text.includes("mern") ||
      text.includes("full stack") ||
      text.includes("fullstack") ||
      text.includes("web development") ||
      text.includes("react") ||
      text.includes("node") ||
      text.includes("express") ||
      text.includes("mongodb")
    )
  ) {
    domains.push("WEB");
  }

  if (
    text.includes("data science") ||
    text.includes("data analysis") ||
    text.includes("pandas") ||
    text.includes("numpy")
  ) {
    domains.push("DATA_SCIENCE");
  }

  return [...new Set(domains)];
};

// =====================================================
// 11. VERIFY GITHUB PROJECT
// =====================================================

const verifyGithubProject = async ({
  githubUrl,
  projectName = "",
  projectDescription = "",
  technologies = [],
  candidateGithub = "",
}) => {
  technologies = Array.isArray(technologies)
    ? technologies.filter(
        (item) => typeof item === "string" && item.trim()
      )
    : [];

  projectName =
    typeof projectName === "string" ? projectName : "";

  projectDescription =
    typeof projectDescription === "string"
      ? projectDescription
      : "";

  candidateGithub =
    typeof candidateGithub === "string" ? candidateGithub : "";

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

    const repoResponse = await githubApi.get(
      `/repos/${owner}/${repo}`,
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
      const readmeResponse = await githubApi.get(
        `/repos/${owner}/${repo}/readme`,
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
      if (error.response?.status !== 404) {
        throw error;
      }

      hasReadme = false;
      readmeContent = "";
    }

    // =================================================
    // 3. GET REPOSITORY TOPICS
    // =================================================

    let repositoryTopics = [];

    try {
      const topicsResponse = await githubApi.get(
        `/repos/${owner}/${repo}/topics`,
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

    const treeResponse = await githubApi.get(
      `/repos/${owner}/${repo}/git/trees/${repoData.default_branch}?recursive=1`,
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

    const languagesResponse = await githubApi.get(
      `/repos/${owner}/${repo}/languages`,
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
        const response = await githubApi.get(
          `/repos/${owner}/${repo}/contents/${packageFile.path}`,
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
        const response = await githubApi.get(
          `/repos/${owner}/${repo}/contents/${dependencyFile.path}`,
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

          pythonDependencyText += "\n" + content;
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
      detectPythonTechnologies(pythonDependencyText);

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

    const safeTechnologies = Array.isArray(technologies)
      ? technologies.filter(
          (technology) =>
            typeof technology === "string" &&
            technology.trim().length > 0
        )
      : [];

    const detectedNormalized = detectedTechnologies
      .map(normalizeTechnology)
      .filter(Boolean);

    const matchedTechnologies = safeTechnologies.filter(
      (technology) =>
        detectedNormalized.includes(
          normalizeTechnology(technology)
        )
    );

    const missingTechnologies = safeTechnologies.filter(
      (technology) =>
        !matchedTechnologies.includes(technology)
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
        // GitHub returns at most 100 contributors per page.
        // Check up to 10 pages and stop when we find the candidate.
        for (let page = 1; page <= 10; page++) {
          const contributorsResponse = await githubApi.get(
            `/repos/${owner}/${repo}/contributors`,
            {
              params: {
                per_page: 100,
                page,
              },
            }
          );

          const contributors = contributorsResponse.data || [];

          candidateIsContributor = contributors.some(
            (contributor) =>
              contributor.login?.toLowerCase() ===
              candidateUsername.toLowerCase()
          );

          if (
            candidateIsContributor ||
            contributors.length < 100
          ) {
            break;
          }
        }
      } catch (error) {
        // Do not silently treat API errors as "not a contributor".
        // The outer verification error handler handles API errors.
        throw error;
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
// 15. PROJECT RELEVANCE AND EVIDENCE
// =================================================

const relevance = calculateProjectRelevance({
  projectName,
  projectDescription,
  readmeContent,
  repositoryName: repoData.name,
  repositoryDescription: repoData.description || "",
  repositoryTopics,
  technologies,
});

const projectDomains = detectProjectDomain({
  projectName,
  projectDescription,
  technologies,
});

const repositoryEvidence = analyzeRepositoryEvidence({
  projectDomains,
  repositoryName: repoData.name,
  repositoryDescription: repoData.description || "",
  repositoryTopics,
  readmeContent,
  detectedTechnologies,
  treePaths,
});

const sourceStructure = analyzeSourceStructure({
  projectDomains,
  treePaths,
});

// =================================================
// 16. DOMAIN EVIDENCE
// =================================================

const domainEvidence = calculateDomainEvidence({
  projectName,
  projectDescription,
  technologies,
  readmeContent,
  repositoryName: repoData.name,
  repositoryTopics,
  detectedTechnologies,
  treePaths,
});

const projectEvidenceScore = Math.round(
  relevance.score * 0.35 +
  repositoryEvidence.score * 0.35 +
  sourceStructure.score * 0.30
);

let projectEvidenceStatus = "Likely Mismatch";

if (projectEvidenceScore >= 75) {
  projectEvidenceStatus = "Strong Match";
} else if (projectEvidenceScore >= 50) {
  projectEvidenceStatus = "Partial Match";
}
// =================================================
// 17. TECHNOLOGY MATCH SCORE
// =================================================

let technologyScore = 100;

if (technologies.length > 0) {
  technologyScore = Math.round(
    (matchedTechnologies.length / technologies.length) * 100
  );
}

// =================================================
// 18. AUTHENTICITY SCORE
// =================================================

const authenticityScore = Math.round(
  relevance.score * 0.40 +
  technologyScore * 0.25 +
  domainEvidence.score * 0.20 +
  ownershipScore * 0.15
);

// =================================================
// 19. AUTHENTICITY STATUS
// =================================================

let authenticityStatus = "Likely Mismatch";

if (authenticityScore >= 75) {
  authenticityStatus = "Strong Match";
} else if (authenticityScore >= 50) {
  authenticityStatus = "Partial Match";
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
  basicVerification && authenticityScore >= 60
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

  projectEvidence: {
    score: projectEvidenceScore,
    status: projectEvidenceStatus,
    domains: projectDomains,
    repositoryEvidence,
    sourceStructure,
    relevance,
  },

  // Project authenticity data
  authenticity: {
    score: authenticityScore,
    status: authenticityStatus,

    ownership: {
      candidateGithub: candidateUsername,
      repositoryOwner,
      ownerMatches,
      candidateIsContributor,
      score: ownershipScore,
    },

    technologyScore,
    domainEvidence,

    repositoryEvidence: {
      repositoryExists: true,
      repositoryName: repoData.name,
      repositoryDescription: repoData.description || "",
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
  const httpStatus = error.response?.status;

  let errorCode = "GITHUB_API_ERROR";
  let errorMessage = "GitHub verification could not be completed.";

  if (httpStatus === 404) {
    errorCode = "REPOSITORY_NOT_FOUND";
    errorMessage =
      "Repository was not found or is private/inaccessible.";
  } else if (httpStatus === 403 || httpStatus === 429) {
    errorCode = "GITHUB_RATE_LIMIT";
    errorMessage =
      "GitHub API rate limit or access restriction reached. Try again later.";
  } else if (error.code === "ECONNABORTED") {
    errorCode = "GITHUB_TIMEOUT";
    errorMessage = "GitHub took too long to respond. Try again.";
  } else if (!error.response) {
    errorCode = "GITHUB_NETWORK_ERROR";
    errorMessage =
      "Could not connect to GitHub. Check your internet connection and try again.";
  }

  console.error("GitHub verification error:", {
    status: httpStatus,
    code: error.code,
    message: error.response?.data?.message || error.message,
  });

  return {
    status: "Unable to Verify",

    // These values are unknown when GitHub could not be reached.
    repositoryExists: null,
    hasReadme: null,
    hasCode: null,

    detectedLanguages: [],
    detectedTechnologies: [],
    matchedTechnologies: [],
    missingTechnologies: technologies,

    relevance: {
      score: 0,
      status: "Unable to Determine",
      matchedKeywords: [],
    },

    projectEvidence: {
      score: 0,
      status: "Unable to Determine",
      domains: [],
      repositoryEvidence: [],
      sourceStructure: [],
      relevance: null,
    },

    authenticity: {
      score: 0,
      status: "Unable to Determine",
    },

    error: {
      code: errorCode,
      message: errorMessage,
      httpStatus: httpStatus || null,
    },

    verifiedAt: null,
  };
}

};

// =====================================================
// 23. EXPORT
// =====================================================

module.exports = {
  verifyGithubProject,
};