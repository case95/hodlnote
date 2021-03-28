import axios from "axios";

// Base API endpoint
const api = () => {
  return axios.create({
    baseURL: "https://api.pro.coinbase.com/",
  });
};

export default api;
