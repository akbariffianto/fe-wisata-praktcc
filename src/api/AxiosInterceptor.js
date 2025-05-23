import { useEffect } from "react";
import axios from "./AxiosInstance.js";
import useAuth from "../auth/useAuth";

const AxiosInterceptor = () => {
  const { accessToken, refreshToken, logout } = useAuth();

  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        // Add auth header if token exists
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }

        // Validasi FormData untuk foto_wisata
        if (config.data instanceof FormData) {
          const foto = config.data.get('foto_wisata');
          if (foto instanceof File) {
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            if (!validTypes.includes(foto.type)) {
              throw new Error('Format foto tidak valid. Gunakan PNG, JPG, atau JPEG');
            }
            // Validasi ukuran file (maksimal 5MB)
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (foto.size > maxSize) {
              throw new Error('Ukuran foto maksimal 5MB');
            }
          }
          delete config.headers['Content-Type'];
        }

        // Log request for debugging
        console.log('Request:', {
          url: config.url,
          method: config.method,
          headers: config.headers,
          data: config.data instanceof FormData ? 'FormData' : config.data
        });

        return config;
      },
      (error) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
      }
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => {
        // Log successful response
        console.log('Response:', {
          url: response.config.url,
          status: response.status,
          data: response.data
        });
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        // Handle 403 (Forbidden) - typically expired token
        if (error.response?.status === 403 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const newToken = await refreshToken();
            if (newToken) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return axios(originalRequest);
            }
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
            logout();
            return Promise.reject(refreshError);
          }
        }

        // Handle 401 (Unauthorized)
        if (error.response?.status === 401) {
          console.error('Unauthorized access:', error);
          logout();
        }

        console.error('Response Error:', {
          url: error.config?.url,
          status: error.response?.status,
          message: error.response?.data?.message || error.message
        });

        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [accessToken, refreshToken, logout]);

  return null;
};

export default AxiosInterceptor;