import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/AxiosInstance";
import { BASE_URL } from "../utils/utils.js";
import { useAuthContext } from "../auth/AuthProvider";
import BlogCard from "../components/BlogCard";

const BookmarkPage = () => {
  const navigate = useNavigate();
  const { userId } = useAuthContext();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get(`${BASE_URL}/bookmark`);
        console.log('Bookmarks response:', response.data);

        if (response.data?.data) {
          // Filter bookmarks for current user
          const userBookmarks = response.data.data.filter(
            bookmark => bookmark.userId === Number(userId)
          );
          setBookmarks(userBookmarks);
        }
      } catch (err) {
        console.error('Error fetching bookmarks:', err);
        if (err.response?.status === 401) {
          alert('Sesi anda telah berakhir. Silahkan login kembali');
          navigate('/login');
        } else {
          setError('Gagal memuat bookmark');
        }
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchBookmarks();
    } else {
      navigate('/login');
    }
  }, [userId, navigate]);

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => navigate('/tourpage')}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
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
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" 
              />
            </svg>
            Kembali
          </button>
          <h1 className="text-2xl font-bold">Bookmark Wisata</h1>
        </div>

        {error && (
          <div className="text-center py-4 px-3 text-red-700 bg-red-100 border border-red-400 rounded mb-6">
            <p><strong>Error:</strong> {error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            <p className="ml-3 mt-2 text-indigo-600">Memuat bookmark...</p>
          </div>
        ) : bookmarks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarks.map((bookmark) => (
              <BlogCard
                key={bookmark.id_bookmark}
                imageUrl={bookmark.wisata.foto_wisata}
                title={bookmark.wisata.nama_wisata}
                category={bookmark.wisata.kategori_wisata}
                rating={bookmark.wisata.rating_wisata}
                onDetailsClick={() => navigate(`/detailtour/${bookmark.wisataId}`)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Belum ada wisata yang dibookmark.
          </div>
        )}
      </div>
    </div>
  );
};

export default BookmarkPage;