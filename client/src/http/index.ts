import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Базовый путь
const $api = axios.create({
  withCredentials: true,
  baseURL: `${API_URL}/api`,
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
        await axios.get(`${API_URL}/api/auth/refresh`, {
          withCredentials: true,
        });
        return $api.request(originalRequest);
      } catch (e) {
        console.log("Вы не авторизованы");
      }
    }
    throw error;
  }
);

export default $api;
