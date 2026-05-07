import axios from "axios";

// 1. Create a reusable axios instance
export const axiosinstance = axios.create({
  baseURL: "http://localhost:3001", // ✅ optional, set if you always hit same backend
});

// 2. Add a request interceptor for automatic token injection
axiosinstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 3. Add a response interceptor for handling expired/invalid tokens
axiosinstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login"; // redirect to login
    }
    return Promise.reject(error);
  },
);

// 4. Connector utility for flexible calls
export const apiconnector = (
  method,
  url,
  bodyData = null,
  headers = {},
  params = {},
) => 
  {console.log("PARAMS", params);
  return axiosinstance({
    method,
    url,
    data: bodyData,
    headers,
    params,
  });
};
