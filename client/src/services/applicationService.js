import API from "../api/axios";
// recruiter:get applicants for a project
export const getApplicants = async (projectId) => {
  const response = await API.get(
    `/applications/project/${projectId}`
  );

  return response.data;
};
//recruiter: accept/reject application
export const updateApplicationStatus = async (
  applicationId,
  status
) => {
  const response = await API.patch(
    `/applications/${applicationId}/status`,
    { status }
  );

  return response.data;
};
//student
export const applyToProject = async (projectId) => {
  const response = await API.post(
    `/applications/${projectId}`
  );

  return response.data;
};
// Student: get own applications
export const getMyApplications = async () => {
  const response = await API.get("/applications/my");

  return response.data;
};