// src/auth/AuthProvider.jsx
import { createContext, useContext, useState } from "react";
import Cookies from "js-cookie";
import axios from "../api/AxiosInstance";
import PropTypes from "prop-types";
import { BASE_URL } from "../utils/utils.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
  const [userId, setUserId] = useState(() => {
    const savedUserId = localStorage.getItem('userId');
    return savedUserId || null;
  });

  const login = async (username, password) => {
    try {
      console.log('Attempting login...');
      const res = await axios.post(`${BASE_URL}/login`, { username, password });
      console.log('Login response:', res.data);
      
      const token = res.data.accessToken;
      console.log('Access token:', token);
      
      localStorage.setItem('accessToken', token);
      localStorage.setItem('userId', res.data.userId);
      setAccessToken(token);
      setUserId(res.data.userId);

      return res.data;
    } catch (err) {
      console.error("Login failed:", err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      // Panggil endpoint logout jika ada
      await axios.post(`${BASE_URL}/logout`);
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      // Bersihkan state dan storage
      setAccessToken(null);
      setUserId(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userId');
      Cookies.remove("refreshToken");
    }
  };

  const refreshToken = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/token`, {
        withCredentials: true // Penting untuk mengirim cookies
      });
      
      const newToken = res.data.accessToken;
      localStorage.setItem('accessToken', newToken);
      setAccessToken(newToken);
      return newToken;
    } catch (err) {
      console.error("Token refresh failed:", err);
      logout();
      return null;
    }
  };

  const isAuthenticated = () => {
    const token = accessToken || localStorage.getItem('accessToken');
    console.log('Checking auth, token:', token);
    return !!token;
  };

  return (
    <AuthContext.Provider 
      value={{ 
        accessToken, 
        userId, 
        login, 
        logout, 
        refreshToken,
        isAuthenticated 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
