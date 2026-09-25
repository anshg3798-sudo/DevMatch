import API from "../api/axios";

export const getProfile = async () => {
  const response = await API.get("/users/profile");

  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await API.patch(
    "/users/profile",
    profileData
  );
 
  return response.data;
};
export const searchDevelopers = async (search = "") => {
  const response = await API.get(
    `/users/developers?search=${encodeURIComponent(search)}`
  );

  return response.data;
};
export const getDeveloperById = async (id) => {
  const response = await API.get(`/users/developers/${id}`);

  return response.data;
};
export const uploadResume = async (file) => {
  const formData = new FormData();

  formData.append("resume", file);

  const response = await API.post(
    "/users/resume",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};
