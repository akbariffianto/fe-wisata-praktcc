import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/AxiosInstance";
import { BASE_URL } from "../utils/utils.js";
import { useAuthContext } from "../auth/AuthProvider"; // Changed this import
import BlogCard from "../components/BlogCard";

const TourPages = () => {
  const navigate = useNavigate();
  const { userInfo, logout } = useAuthContext(); // Using AuthContext instead of useAuth
  
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fungsi untuk mengambil data tour
  const fetchTours = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${BASE_URL}/wisata`); // Removed /wisata since it's in BASE_URL

      // Struktur respons diharapkan memiliki 'data.data' seperti di NotesApp dan dokumentasi awal
      if (response.data && response.data.message === "Data berhasil didapatkan") {
        if (Array.isArray(response.data.data)) {
          setTours(response.data.data);
        } else {
          console.error("API Data Error: Expected 'data' to be an array, received:", typeof response.data.data);
          throw new Error('Format data dari server tidak sesuai (data bukan array).');
        }
      } else {
        const errorMessage = response.data?.message || 'Gagal mendapatkan data: Format respons tidak sesuai atau pesan sukses tidak ditemukan.';
        console.error("API Response Error:", errorMessage, response.data);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error fetching tours:', error);
      if (error.response) {
        setError(`Error ${error.response.status}: ${error.response.data?.message || error.message}`);
      } else if (error.request) {
        setError('Tidak dapat terhubung ke server. Periksa koneksi internet Anda.');
      } else {
        setError(error.message || 'Gagal memuat data wisata.');
      }
      setTours([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTours();
  }, []); // Dependency array kosong agar fetch hanya sekali saat mount

  const handleLogout = () => { // Removed async since logout is handled in context
    logout();
    navigate('/login');
  };

  return (
    <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-slate-100 py-6 sm:py-12">
      <div className="min-h-28">
        <div className="max-w-screen-lg mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
            <h2 className="font-bold text-3xl sm:text-4xl text-slate-700 font-display text-center sm:text-left">
              {/* Sesuaikan dengan struktur userInfo/user dari useAuth */}
              Hi, {userInfo?.username || "Guest"}! 
            </h2>
            <div className="flex flex-wrap justify-center sm:justify-end gap-2 sm:gap-4">
              <button 
                onClick={() => navigate('/bookmark')}
                className="bg-yellow-400 text-black px-3 py-2 sm:px-4 rounded-lg shadow-lg shadow-yellow-400/50 hover:bg-yellow-500 transition-colors flex items-center gap-2 text-sm sm:text-base"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4 sm:w-5 sm:h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
                  />
                </svg>
                Bookmark
              </button>
              <button 
                onClick={() => navigate('/inputtour')}
                className="bg-indigo-500 text-white px-3 py-2 sm:px-4 rounded-lg shadow-lg shadow-indigo-500/50 hover:bg-indigo-600 transition-colors text-sm sm:text-base"
              >
                Input Rekomendasi
              </button>
              <button 
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-2 sm:px-4 rounded-lg shadow-lg shadow-red-500/50 hover:bg-red-600 transition-colors text-sm sm:text-base"
              >
                Log out
              </button>
            </div>
          </div>

          {error && (
            <div className="text-center py-4 px-3 text-red-700 bg-red-100 border border-red-400 rounded mb-6">
              <p><strong>Gagal Memuat Data:</strong> {error}</p>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
              <p className="ml-3 mt-2 text-indigo-600">Memuat data wisata...</p>
            </div>
          ) : tours.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tours.map((tour) => (
                <BlogCard
                  key={tour.id_wisata}
                  imageUrl={tour.foto_wisata}
                  title={tour.nama_wisata}
                  onDetailsClick={() => navigate(`/detailtour/${tour.id_wisata}`)}
                />
              ))}
            </div>
          ) : !error ? ( 
            <div className="text-center py-8 text-gray-500">
              Tidak ada data wisata yang ditemukan.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default TourPages;