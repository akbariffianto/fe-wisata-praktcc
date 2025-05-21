// src/auth/AuthProvider.jsx
import { createContext, useContext, useState } from "react";
import Cookies from "js-cookie";
import axios from "../api/AxiosInstance";
import PropTypes from "prop-types";
import { BASE_URL } from "../utils/utils.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  
  const login = async (username, password) => {
    try {
      const res = await axios.post(`${BASE_URL}/login`, { username, password });
      setAccessToken(res.data.accessToken);

      setUserInfo({ username: res.data.username });

      return true;
    } catch (err) {
      console.error("Login failed:", err);
      return false;
    }
  };

  const logout = () => {
    setAccessToken(null);
    Cookies.remove("refreshToken");
  };

  const refreshToken = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/token`);
      setAccessToken(res.data.accessToken);
      return res.data.accessToken;
    } catch (err) {
      console.error("Token refresh failed:", err);
      logout();
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ accessToken, userInfo, login, logout, refreshToken }}>
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
