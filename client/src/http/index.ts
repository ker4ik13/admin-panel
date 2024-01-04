import type { IUser } from "@/shared/types/IUser";
import axios from "axios";

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: IUser;
}

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || "";

// Базовый путь
const $api = axios.create({
  withCredentials: true,
  baseURL: `${NEXT_PUBLIC_API_URL}/api`,
});

// Настройка куки
$api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  return config;
});

$api.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response.status == 401 &&
      error.config &&
      !error.config._isRetry
    ) {
      originalRequest._isRetry = true;
      try {
        const response = await axios.get<AuthResponse>(
          `${NEXT_PUBLIC_API_URL}/refresh`,
          { withCredentials: true }
        );
        localStorage.setItem("token", response.data.access_token);
        return $api.request(originalRequest);
      } catch (e) {
        // TODO: доделать
        console.log("НЕ АВТОРИЗОВАН");
      }
    }
    throw error;
  }
);

export default $api;
