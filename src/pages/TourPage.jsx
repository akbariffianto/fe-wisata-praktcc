import React, { useState, useEffect } from "react";
import BlogCard from "../components/BlogCard";
import FilterDropdown from "../components/FilterDropdown";
import { useAuthContext } from "../auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/utils";

const TourPages = () => {
  const navigate = useNavigate();
  const { userInfo, logout } = useAuthContext();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    kategori: "",
    rating: 0
  });

  // Fetch tours data with filters
  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        let url = `${BASE_URL}`;
        const params = new URLSearchParams();

        if (filters.kategori) {
          params.append('kategori', filters.kategori);
        }
        if (filters.rating > 0) {
          params.append('rating', filters.rating);
        }

        const queryString = params.toString();
        if (queryString) {
          url += `?${queryString}`;
        }

        const response = await axios.get(url);
        setTours(response.data);
      } catch (error) {
        console.error('Error fetching tours:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, [filters]);
  
  const filterOptions = {
    kategori: [
      { value: "pegunungan", label: "Pegunungan" },
      { value: "perairan", label: "Perairan" },
      { value: "budaya", label: "Budaya" },
      { value: "kuliner", label: "Kuliner" },
    ]
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-slate-100 py-6 sm:py-12">
      <div className="min-h-28">
        <div className="max-w-screen-lg mx-auto py-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-bold text-4xl text-slate-700 font-display">
              Hi, {userInfo?.username || "Guest"}!
            </h2>
            <div className="flex gap-4">
              <button className="bg-yellow-400 text-black px-4 py-2 rounded-lg shadow-lg shadow-yellow-400/50 hover:bg-yellow-500 transition-colors flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
                  />
                </svg>
                <a href="/bookmark">Bookmark</a>
              </button>
              <button className="bg-indigo-500 text-white px-4 py-2 rounded-lg shadow-lg shadow-indigo-500/50 hover:bg-indigo-600 transition-colors">
                <a href="/inputtour">Input Rekomendasi</a>
              </button>
              <button 
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg shadow-red-500/50 hover:bg-red-600 transition-colors"
              >
                Log out
              </button>
            </div>
          </div>

          {/* Updated Filter Section */}
          <div className="flex items-center gap-6 mb-8 flex-wrap">
            <div className="w-48">
              <FilterDropdown
                title="Kategori Wisata"
                options={filterOptions.kategori}
                value={filters.kategori}
                onChange={(value) => setFilters(prev => ({ ...prev, kategori: value }))}
              />
            </div>
            
            <div className="flex-1 max-w-xs">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating Minimum: {filters.rating.toFixed(1)}
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.1"
                  value={filters.rating}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    rating: parseFloat(e.target.value) 
                  }))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-sm font-medium text-gray-600 w-12">
                  {filters.rating.toFixed(1)}/5
                </span>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tours.map((tour) => (
                <BlogCard
                  key={tour.id_wisata}
                  imageUrl={tour.imageUrl}
                  title={tour.nama_wisata}
                  location={tour.lokasi}
                  description={tour.description}
                  rating={tour.rating}
                  price={tour.harga}
                  type={tour.tipe}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TourPages;
