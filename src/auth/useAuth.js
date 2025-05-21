import { useAuthContext } from "./AuthProvider.jsx";

const useAuth = () => {
  const { accessToken, login, logout, refreshToken } = useAuthContext();

  return {
    accessToken,
    login,
    logout,
    refreshToken,
    isAuthenticated: !!accessToken,
  };
};

export default useAuth;