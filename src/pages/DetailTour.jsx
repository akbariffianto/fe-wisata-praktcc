import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../api/AxiosInstance';
import { BASE_URL } from '../utils/utils';
import { useAuthContext } from '../auth/AuthProvider';

const DetailTour = () => {
  const { userId } = useAuthContext(); // This is the logged-in user's ID
  const navigate = useNavigate();
  const { id_wisata } = useParams();
  
  const [tourDetail, setTourDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [commentLoading, setCommentLoading] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false); // New state for bookmark status

  useEffect(() => {
    const fetchTourDetail = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/wisata/${id_wisata}`);
        
        if (response.data?.message === "Data berhasil didapatkan") {
          const tourData = response.data.data[0];
          if (tourData) {
            setTourDetail(tourData);
          } else {
            throw new Error('Tour data not found');
          }
        } else {
          throw new Error(response.data?.message || 'Failed to load tour details');
        }
      } catch (err) {
        console.error('Error fetching tour details:', err);
        if (err.response?.status === 403 || err.response?.status === 401) {
          navigate('/login');
          return;
        }
        setError(err.message || 'Failed to load tour details');
      } finally {
        setLoading(false);
      }
    };

    if (id_wisata) {
      fetchTourDetail();
      // Moved fetchComments outside useEffect for reusability
      fetchComments();
    }
  }, [id_wisata, navigate]);

  // Move fetchComments outside useEffect for reusability
  const fetchComments = async () => {
    try {
      setCommentLoading(true);
      const response = await axios.get(`${BASE_URL}/komentar/${id_wisata}`);
      
      // Log for debugging
      console.log('Comments response:', response.data);
      console.log('Current userId from context:', userId);

      if (response.data?.status === "success") {
        const sortedComments = response.data.data.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setComments(sortedComments);
      }
    } catch (err) {
      console.error('Error fetching comments:', err);
    } finally {
      setCommentLoading(false);
    }
  };

  // Update the handleAddComment function
  const handleAddComment = async () => {
    if (!userId) {
      alert('Silahkan login terlebih dahulu');
      navigate('/login');
      return;
    }

    if (!comment.trim()) {
      alert('Komentar tidak boleh kosong');
      return;
    }

    try {
      setCommentLoading(true);
      
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No access token found');
      }

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      const payload = {
        komentar: comment.trim(),
        userId: userId
      };

      const response = await axios.post(
        `${BASE_URL}/komentar/${id_wisata}`, 
        payload,
        config
      );

      if (response.data?.message === "Data berhasil ditambahkan") {
        setComment('');
        // Refresh the entire page data
        await Promise.all([
          fetchTourDetail(),
          fetchComments()
        ]);
        // Optional: Scroll to comments section
        document.querySelector('.md\\:w-1\\/2:last-child')?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    } catch (err) {
      console.error('Error adding comment:', err);
      if (err.response?.status === 403 || err.response?.status === 401) {
        alert('Sesi anda telah berakhir. Silahkan login kembali');
        navigate('/login');
        return;
      }
      alert(err.response?.data?.message || 'Gagal menambahkan komentar');
    } finally {
      setCommentLoading(false);
    }
  };

  // Update handleBookmark function
  const handleBookmark = async () => {
    if (!userId) {
      alert('Silahkan login terlebih dahulu');
      navigate('/login');
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/bookmark/${id_wisata}`);
      
      if (response.data?.message === "Data berhasil ditambahkan") {
        setIsBookmarked(true);
        alert('Wisata berhasil disimpan ke bookmark');
      }
    } catch (err) {
      console.error('Error bookmarking tour:', err);
      if (err.response?.status === 403 || err.response?.status === 401) {
        alert('Sesi anda telah berakhir. Silahkan login kembali');
        navigate('/login');
        return;
      }
      alert(err.response?.data?.message || 'Gagal menyimpan bookmark');
    }
  };

  // Add comment section protection
  const renderCommentForm = () => {
    if (!userId) {
      return (
        <div className="text-center py-4 px-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-700">
            Silahkan <button 
              onClick={() => navigate('/login')}
              className="text-blue-600 hover:underline"
            >
              login
            </button> untuk menambahkan komentar
          </p>
        </div>
      );
    }

    return (
      <div className="mb-6">
        <textarea 
          className="w-full p-3 border rounded-lg resize-none mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
          placeholder="Tulis komentar Anda di sini..."
          rows="3"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm text-gray-500">
            {comment.length} karakter
          </span>
          <button 
            onClick={handleAddComment}
            disabled={!comment.trim()}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2
              ${comment.trim() 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
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
                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" 
              />
            </svg>
            Kirim Komentar
          </button>
        </div>
      </div>
    );
  };

  // Add this function after other handlers
  const handleDelete = async () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus wisata ini?')) {
      try {
        const response = await axios.delete(`${BASE_URL}/wisata/${id_wisata}`);
        
        if (response.data?.message === "Data berhasil dihapus") {
          alert('Wisata berhasil dihapus');
          navigate('/tourpage');
        }
      } catch (err) {
        console.error('Error deleting tour:', err);
        if (err.response?.status === 403 || err.response?.status === 401) {
          alert('Sesi anda telah berakhir. Silahkan login kembali');
          navigate('/login');
          return;
        }
        alert(err.response?.data?.message || 'Gagal menghapus wisata');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-red-500 text-center">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => navigate('/tourpage')}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Kembali
        </button>
        <h1 className="text-2xl font-bold">Detail Wisata</h1>
      </div>
      
      {tourDetail && (
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left side - Tour Details Card */}
          <div className="md:w-1/2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative">
                <img 
                  src={tourDetail.foto_wisata}
                  alt={tourDetail.nama_wisata}
                  className="w-full h-64 object-cover"
                />
                {/* Add rating badge */}
                <div className="absolute bottom-2 right-2 bg-yellow-400 text-black px-3 py-1 rounded-lg text-sm font-semibold shadow-md">
                  ⭐ {tourDetail.rating_wisata || '0'}
                </div>
              </div>
              
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">{tourDetail.nama_wisata}</h2>
                <div className="flex justify-between mb-4">
                  <span className="text-gray-600">Lokasi: {tourDetail.lokasi_wisata}</span>
                </div>
                <p className="text-gray-700 mb-6">
                  {tourDetail.deskripsi_wisata}
                </p>
                
                {/* Edit and Delete buttons - only shown to creator */}
                {Number(userId) === Number(tourDetail.userId) && (
                  <div className="flex gap-3 mb-3">
                    <button 
                      onClick={() => navigate(`/edittour/${id_wisata}`)}
                      className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg shadow-blue-500/50 hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
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
                          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" 
                        />
                      </svg>
                      Edit Wisata
                    </button>
                    
                    <button 
                      onClick={handleDelete}
                      className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg shadow-red-500/50 hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
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
                      Hapus Wisata
                    </button>
                  </div>
                )}

                {/* Bookmark button */}
                <button 
                  onClick={handleBookmark}
                  className="w-full bg-yellow-400 text-black px-4 py-2 rounded-lg shadow-lg shadow-yellow-400/50 hover:bg-yellow-500 transition-colors flex items-center justify-center gap-2"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill={isBookmarked ? "currentColor" : "none"}
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
                  {isBookmarked ? 'Tersimpan' : 'Simpan ke Bookmark'}
                </button>
              </div>
            </div>
          </div>

          {/* Right side - Comments Section */}
          <div className="md:w-1/2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold mb-6">Kolom Komentar</h3>
              
              {/* Replace comment form with conditional render */}
              {renderCommentForm()}

              {/* Comments list */}
              <div className="mt-8 space-y-4">
                {commentLoading ? (
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                ) : comments.length > 0 ? (
                  comments.map((comment) => (
                    <div 
                      key={comment.id_komentar} 
                      className="flex gap-4 bg-gray-50 rounded-lg p-4"
                    >
                      {/* User avatar */}
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                          {comment.user.username.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      
                      {/* Comment content */}
                      <div className="flex-grow">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-gray-900">
                            {comment.user.username}
                          </span>
                          <span className="text-sm text-gray-500">
                            {new Date(comment.createdAt).toLocaleDateString('id-ID', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <p className="text-gray-700">{comment.isi_komentar}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Belum ada komentar
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailTour;