import axios from "axios";

const API = import.meta.env.VITE_BACKEND_URL;

export const signup = (formData: { username: string; email: string; password: string }) => {
  return axios.post(`${API}/signup`, formData);
};

export const signin = (formData: { username: string; password: string }) => {
  return axios.post(`${API}/signin`, formData);
};