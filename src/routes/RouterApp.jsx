import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage.jsx";
import TourPage from "../pages/TourPage.jsx";
import DetailTour from "../pages/DetailTour.jsx";
import InputTourPages from "../pages/InputTourPages.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import RegisterPage from "../pages/RegisterPage.jsx";

const RouterApp = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/tourpage"
          element={
            <ProtectedRoute>
              <TourPage />
            </ProtectedRoute>
          }
        />
        <Route path="/detailtour" element={<DetailTour />} />
        <Route path="/inputtour" element={<InputTourPages />} />
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </Router>
  );
};

export default RouterApp;
