import axios, { AxiosHeaders } from "axios";

const baseURL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000/";

export const api = axios.create({
  baseURL,
  headers: new AxiosHeaders({ "Content-Type": "application/json" }),
});

api.interceptors.request.use((config) => {
  try {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access");
      if (token) {
        // Ensure config.headers is an AxiosHeaders instance
        const headers = new AxiosHeaders(config.headers);
        headers.set("Authorization", `Bearer ${token}`);
        config.headers = headers;
      }
    }
  } catch (e) {
    // ignore errors
  }
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => Promise.reject(err)
);
