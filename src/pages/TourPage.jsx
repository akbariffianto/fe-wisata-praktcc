import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/AxiosInstance";
import { BASE_URL } from "../utils/utils.js";
import { useAuthContext } from "../auth/AuthProvider";
import BlogCard from "../components/BlogCard";

const TourPages = () => {
  const navigate = useNavigate();
  const { userId, logout, username } = useAuthContext();
  
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedRating, setSelectedRating] = useState(0);

  const categories = [
    { value: '', label: 'Semua Kategori' },
    { value: 'pegunungan', label: 'Pegunungan' },
    { value: 'perairan', label: 'Perairan' },
    { value: 'budaya', label: 'Budaya' },
    { value: 'kuliner', label: 'Kuliner' },
  ];

  const fetchTours = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No access token found');
      }

      // Perbaiki pembangunan query string
      let queryString = '';
      if (filters.category && filters.category !== '') {
        queryString = `kategori=${filters.category}`;
      }
      if (filters.rating && filters.rating > 0) {
        queryString = queryString 
          ? `${queryString}&rating=${filters.rating}` 
          : `rating=${filters.rating}`;
      }

      const url = queryString ? `/wisata?${queryString}` : '/wisata';
      console.log('Fetching URL:', url); // Debugging

      const response = await axiosInstance.get(url);

      if (response.data?.data) {
        setTours(Array.isArray(response.data.data) ? response.data.data : []);
      } else {
        throw new Error('No data received from server');
      }
    } catch (error) {
      console.error('Error fetching tours:', error);
      setError(error.message || 'Failed to load tours');
      setTours([]);
    } finally {
      setLoading(false);
    }
  };

  // Perbarui fungsi handleFilterChange
  const handleFilterChange = () => {
    const filters = {
      category: selectedCategory,
      rating: parseFloat(selectedRating)
    };
    
    console.log('Applying filters:', filters); // Debugging
    fetchTours(filters);
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token || !userId) {
      navigate('/login');
      return;
    }

    fetchTours(); // Initial fetch without filters
  }, [userId, navigate]);

  const handleLogout = () => {
    try {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userId');
      if (typeof logout === 'function') {
        logout();
      }
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Fixed Header Section */}
      <div className="fixed top-0 left-0 right-0 bg-slate-100 z-10 py-4 shadow-md">
        <div className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <h2 className="font-bold text-3xl sm:text-4xl text-slate-700 font-display text-center sm:text-left">
              Hi, {username}!
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
        </div>
      </div>

      {/* Main Content with Padding for Fixed Header */}
      <div className="pt-32 pb-6"> {/* Adjust pt-32 value if needed */}
        <div className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter Section */}
          <div className="mb-8 bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Filter Wisata</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    const newCategory = e.target.value;
                    setSelectedCategory(newCategory);
                    fetchTours({
                      category: newCategory,
                      rating: selectedRating
                    });
                  }}
                  className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating Minimal ({selectedRating})
                </label>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.1"
                  value={selectedRating}
                  onChange={(e) => {
                    const newRating = parseFloat(e.target.value);
                    setSelectedRating(newRating);
                    fetchTours({
                      category: selectedCategory,
                      rating: newRating
                    });
                  }}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => {
                  setSelectedCategory('');
                  setSelectedRating(0);
                  fetchTours();
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Reset Filter
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-center py-4 px-3 text-red-700 bg-red-100 border border-red-400 rounded mb-6">
              <p><strong>Gagal Memuat Data:</strong> {error}</p>
            </div>
          )}

          {/* Loading and Tours Grid */}
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
                  category={tour.kategori_wisata} 
                  rating={tour.rating_wisata} // Add rating prop
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