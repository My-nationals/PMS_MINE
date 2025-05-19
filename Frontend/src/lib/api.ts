import { getCookie } from "@/utils/cookie";
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:9000/api/v1",
    headers: {
        "Content-Type": "application/json",
    },
});

// Auto attach token if needed
api.interceptors.request.use((config) => {
    const token = getCookie("auth_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export default api;
