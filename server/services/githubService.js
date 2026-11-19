
const GITHUB_API = "https://api.github.com";

const githubHeaders = () => {
  const headers = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2026-03-10",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  return headers;
};

// Extract owner and repository name from a GitHub URL
const parseGitHubUrl = (githubUrl) => {
  try {
    const url = new URL(githubUrl);

    if (
      url.protocol !== "https:" ||
      !["github.com", "www.github.com"].includes(
        url.hostname.toLowerCase()
      )
    ) {
      throw new Error("Please provide a valid GitHub repository URL.");
    }

    const parts = url.pathname
      .split("/")
      .filter(Boolean);

    if (parts.length < 2) {
      throw new Error("Invalid GitHub repository URL.");
    }

    const owner = parts[0];
    const repo = parts[1].replace(/\.git$/, "");

    if (!owner || !repo) {
      throw new Error("Invalid GitHub repository URL.");
    }

    return { owner, repo };
  } catch (error) {
    if (error.message.includes("GitHub")) {
      throw error;
    }

    throw new Error("Please provide a valid GitHub repository URL.");
  }
};

// Make a request to GitHub API
const githubRequest = async (endpoint) => {
  const response = await fetch(
    `${GITHUB_API}${endpoint}`,
    {
      method: "GET",
      headers: githubHeaders(),
    }
  );

  if (response.status === 404) {
    return null;
  }

  if (response.status === 403 || response.status === 429) {
    throw new Error(
      "GitHub API rate limit exceeded. Please try again later."
    );
  }

  if (!response.ok) {
    throw new Error(
      `GitHub API request failed with status ${response.status}.`
    );
  }

  return response.json();
};

// Verify a public GitHub repository
const verifyGitHubRepository = async (githubUrl) => {
  const { owner, repo } = parseGitHubUrl(githubUrl);

  // 1. Check whether repository exists
  const repository = await githubRequest(
    `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`
  );

  if (!repository) {
    return {
      exists: false,
      message: "Repository does not exist or is not publicly accessible.",
    };
  }

  // 2. Fetch languages and README information
  const [languages, readme] = await Promise.all([
    githubRequest(
      `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/languages`
    ),
    githubRequest(
      `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/readme`
    ),
  ]);

  // 3. Prepare verification result
  return {
    exists: true,

    repository: {
      name: repository.name,
      fullName: repository.full_name,
      description: repository.description,
      url: repository.html_url,
      visibility: repository.visibility,
      isPrivate: repository.private,
      stars: repository.stargazers_count,
      forks: repository.forks_count,
      defaultBranch: repository.default_branch,
      createdAt: repository.created_at,
      updatedAt: repository.updated_at,
      pushedAt: repository.pushed_at,
    },

    verification: {
      status: "Verified",
      repositoryExists: true,
      hasReadme: Boolean(readme),
      hasCode: Object.keys(languages || {}).length > 0,
      detectedLanguages: Object.keys(languages || {}),
      languageBytes: languages || {},
      verifiedAt: new Date(),
    },
  };
};

module.exports = {
  parseGitHubUrl,
  verifyGitHubRepository,
};
