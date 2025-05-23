import axios from 'axios';
import { BASE_URL } from "../utils/utils.js";


const useAuth = () => {
  const login = async (username, password) => {
    try {
      const response = await axios.post(`${BASE_URL}/login`, {
        username,
        password
      }, {
        withCredentials: true // Penting! Ini untuk menerima cookies
      });
      
      return response.data; // Berisi accessToken
    } catch (error) {
      throw error;
    }
  };

  const verifyAuth = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) return false;

      const response = await axios.get(`${BASE_URL}/verify`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        withCredentials: true // Untuk mengirim cookies refresh token
      });
      
      return response.status === 200;
    } catch (error) {
      localStorage.removeItem('accessToken');
      return false;
    }
  };

  return { login, verifyAuth };
};

export default useAuth;