import API from "../api/axios";

export const loginUser = async (loginData) => {
    const response = await API.post("/auth/login", loginData);
    return response.data;
};

export const signupUser = async (signupData) => {
    const response = await API.post("/auth/signup", signupData);
    return response.data;
};