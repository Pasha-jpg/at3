import axios from "axios";


const baseURL = process.env.NEXT_PUBLIC_API_URL;
if (!baseURL) {
  console.error("FATAL ERROR: NEXT_PUBLIC_API_URL is not defined in .env.local");
}

const api = axios.create({
  baseURL: baseURL || "http://localhost:3000/api", // Fallback to prevent a crash
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN || ""}`,
    "Workspaces-Identifier": process.env.NEXT_PUBLIC_WORKSPACE_ID || "",
    "X-Integration-Name": process.env.NEXT_PUBLIC_INTEGRATION_NAME || "",
  },
});

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default api;