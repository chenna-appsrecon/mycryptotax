import axios from "axios";

const API_ENDPOINT = "https://stockpalapi.glassball.app";
let token = localStorage.getItem("token");
export const headers = {
  "Content-Type": "application/json",
  "x-access-token": token,
};

export const fetchPosts = async () => {
  return await axios.get(API_ENDPOINT);
};

export const fetchSinglePost = async (id) => {
  return await axios.get(`${API_ENDPOINT}/${id}`);
};

export const createPost = async (post) => {
  return await axios.post(API_ENDPOINT, post);
};

export const updatePost = async (id, updatedPost) => {
  return await axios.patch(`${API_ENDPOINT}/${id}`, updatedPost);
};

export const deletePost = async (id) => {
  return await axios.delete(`${API_ENDPOINT}/${id}`);
};
