import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage.jsx";
import TourPage from "../pages/TourPage.jsx";
import DetailTour from "../pages/DetailTour.jsx";
import InputTourPages from "../pages/InputTourPages.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import RegisterPage from "../pages/RegisterPage.jsx";
import BookmarkPages from "../pages/BookmarkPage.jsx";
import EditTourPages from "../pages/EditTourPages.jsx";
import { useAuthContext } from "../auth/AuthProvider";

const RouterApp = () => {
  const { isAuthenticated } = useAuthContext();
  console.log('Router render, authenticated:', isAuthenticated());

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
        <Route
          path="/bookmark"
          element={
            <ProtectedRoute>
              <BookmarkPages />
            </ProtectedRoute>
          }
        />
        <Route
          path="/detailtour/:id_wisata"
          element={
            <ProtectedRoute>
              <DetailTour />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inputtour"
          element={
            <ProtectedRoute>
              <InputTourPages />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edittour/:id_wisata"
          element={
            <ProtectedRoute>
              <EditTourPages />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </Router>
  );
};

export default RouterApp;