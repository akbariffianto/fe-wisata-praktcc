import { AuthProvider } from "./auth/AuthProvider";
import Router from "./routes/RouterApp"; // halaman-halaman
import AxiosInterceptor from "./api/AxiosInterceptor";


const App = () => {
  return (
    <AuthProvider>
      <AxiosInterceptor />
      <Router />
    </AuthProvider>
  );
};

export default App;