import axios from "axios";

const API_ENDPOINT = "https://stockpalapi.glassball.app";
let token = localStorage.getItem("token");
export const headers = {
  "Content-Type": "application/json",
  "x-access-token": token,
};

export const CoinList = (currency) =>
  `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=100&page=1&sparkline=false`;

export const SingleCoin = (id) =>
  `https://api.coingecko.com/api/v3/coins/${id}`;

export const HistoricalChart = (id, days = 365, currency) =>
  `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=${currency}&days=${days}`;

export const TrendingCoins = (currency) =>
  `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=gecko_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h`;

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
