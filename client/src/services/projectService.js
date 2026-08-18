import API from "../api/axios";

// Create a new project
export const createProject = async (projectData) => {
  const response = await API.post("/projects", projectData);

  return response.data;
};

// Get projects created by the logged-in recruiter
export const getMyProjects = async () => {
  const response = await API.get("/projects/my-projects");

  return response.data;
};

// Get all public projects
export const getAllProjects = async () => {
  const response = await API.get("/projects");

  return response.data;
};

// Get a single project
export const getProjectById = async (projectId) => {
  const response = await API.get(`/projects/${projectId}`);

  return response.data;
};

// Update a project
export const updateProject = async (projectId, projectData) => {
  const response = await API.put(
    `/projects/${projectId}`,
    projectData
  );

  return response.data;
};

// Delete a project
export const deleteProject = async (projectId) => {
  const response = await API.delete(
    `/projects/${projectId}`
  );

  return response.data;
};