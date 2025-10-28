import axios from "axios";

// Create an axios instance with your Django backend URL
export const api = axios.create({
  baseURL: "http://127.0.0.1:8000/", // backend base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach JWT access token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle expired access tokens and refresh automatically
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refresh = localStorage.getItem("refresh");
        if (refresh) {
          const res = await axios.post("http://127.0.0.1:8000/auth/token/refresh/", {
            refresh,
          });

          localStorage.setItem("access", res.data.access);
          originalRequest.headers.Authorization = `Bearer ${res.data.access}`;

          return api(originalRequest); // retry with new access token
        }
      } catch (err) {
        console.error("Token refresh failed:", err);
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
      }
    }

    return Promise.reject(error);
  }
);
