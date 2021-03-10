import axios from "axios";

// Base API endpoint
export default () => {
  return axios.create({
    baseURL: "https://api.pro.coinbase.com/",
  });
};
