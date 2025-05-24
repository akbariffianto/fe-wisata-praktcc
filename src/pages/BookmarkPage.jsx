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

        if (response.data?.message === "Data berhasil didapatkan") {
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

  // Add handleDelete function after the useEffect
  const handleDelete = async (id_bookmark) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus bookmark ini?')) {
      try {
        const response = await axios.delete(`${BASE_URL}/bookmark/${id_bookmark}`);
        
        if (response.data?.message === "Data berhasil dihapus") {
          // Update the bookmarks state to remove the deleted bookmark
          setBookmarks(bookmarks.filter(bookmark => bookmark.id_bookmark !== id_bookmark));
          alert('Bookmark berhasil dihapus');
        }
      } catch (err) {
        console.error('Error deleting bookmark:', err);
        if (err.response?.status === 401) {
          alert('Sesi anda telah berakhir. Silahkan login kembali');
          navigate('/login');
        } else {
          alert('Gagal menghapus bookmark');
        }
      }
    }
  };

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
              <div key={bookmark.id_bookmark} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="relative">
                  <img 
                    src={bookmark.wisata.foto_wisata}
                    alt={bookmark.wisata.nama_wisata}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{bookmark.wisata.nama_wisata}</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => navigate(`/detailtour/${bookmark.wisataId}`)}
                      className="w-full bg-indigo-500 text-white px-4 py-2 rounded-lg shadow-lg shadow-indigo-500/50 hover:bg-indigo-600 transition-colors flex items-center justify-center gap-2"
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
                          d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5"
                        />
                      </svg>
                      Lihat Detail
                    </button>
                    <button
                      onClick={() => handleDelete(bookmark.id_bookmark)}
                      className="w-full bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg shadow-red-500/50 hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
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
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                        />
                      </svg>
                      Hapus dari Bookmark
                    </button>
                  </div>
                </div>
              </div>
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