import axios from "axios";

// Base API endpoint
const api = () => {
  return axios.create({
    baseURL: "https://api.exchangeratesapi.io/",
  });
};

export default api;
