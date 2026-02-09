import axios from "axios";

// Use Vite environment variable VITE_API_URL at build time for the API base URL.
// Netlify: set VITE_API_URL in Site > Build & deploy > Environment to your backend URL.
const baseURL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000/";

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});
