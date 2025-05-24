// src/pages/DetailTour.jsx
import React, { useEffect } from 'react'; // << PASTIKAN useEffect DIIMPOR DI SINI
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthContext } from '../auth/AuthProvider';

// Import custom hooks
import { useTour } from '../hooks/useTour'; 
import { useComments } from '../hooks/useComments'; 

// Import komponen UI
import TourInformation from '../components/TourInformation'; 
import CommentForm from '../components/CommentForm';       
import CommentList from '../components/CommentList';       

// Komponen loading dan error sederhana
const LoadingSpinner = () => <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div><p className="ml-3">Loading...</p></div>;
const ErrorDisplay = ({ message }) => <div className="container mx-auto px-4 py-8"><div className="p-4 text-center text-red-700 bg-red-100 border border-red-300 rounded-lg">{message || "Terjadi kesalahan"}</div></div>;


const DetailTour = () => {
  const { userId: loggedInUserId } = useAuthContext();
  const navigate = useNavigate();
  const { id_wisata } = useParams();

  const { 
    tourDetail, 
    loading: tourLoading, 
    error: tourError, 
    isBookmarked, 
    handleBookmark, 
    handleDelete // Rename agar jelas ini untuk delete tur
  } = useTour(id_wisata);

  const { 
    comments, 
    commentLoading, 
    newCommentText, 
    setNewCommentText, 
    handleSubmitComment, // Ini akan menangani add dan update
    handleDeleteComment,
    editingCommentId,
    startEditComment,
    cancelEdit // Fungsi untuk membatalkan mode edit
  } = useComments(id_wisata);

  // Handle jika id_wisata tidak ada (misalnya URL salah)
  useEffect(() => {
    if (!id_wisata) {
        console.error("DetailTour: id_wisata tidak ditemukan di URL.");
        navigate('/tourpage', { replace: true });
    }
  }, [id_wisata, navigate]);


  if (tourLoading) return <LoadingSpinner />;
  // Tampilkan error dari fetch detail tur jika ada, sebelum render lainnya
  if (tourError && !tourDetail) return <ErrorDisplay message={tourError} />;


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => navigate('/tourpage')}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          {/* SVG untuk tombol kembali */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Kembali
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Detail Wisata</h1>
      </div>
      
      {/* Tampilkan error dari fetch detail tur jika turDetail ada tapi error muncul kemudian (jarang) */}
      {tourError && tourDetail && <ErrorDisplay message={`Error memuat detail tur: ${tourError}`} />}

      {tourDetail && (
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            <TourInformation
              tourDetail={tourDetail}
              loggedInUserId={loggedInUserId}
              isBookmarked={isBookmarked}
              onBookmark={handleBookmark}
              onDelete={handleDelete}
              onEditTour={() => navigate(`/edittour/${id_wisata}`)}
            />
          </div>

          <div className="md:w-1/2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold mb-6 text-gray-700">Kolom Komentar</h3>
              <CommentForm
                commentText={newCommentText}
                setCommentText={setNewCommentText}
                onSubmit={handleSubmitComment}
                isLoading={commentLoading}
                loggedInUserId={loggedInUserId}
                editingCommentId={editingCommentId} // Untuk mengubah teks tombol/judul form
                onCancelEdit={cancelEdit} // Untuk tombol batal edit
              />
              <div className="mt-8">
                <CommentList 
                  comments={comments} 
                  isLoading={commentLoading && comments.length === 0} // Loading awal untuk daftar komentar
                  loggedInUserId={loggedInUserId}
                  onEditComment={startEditComment} // Handler untuk memulai edit
                  onDeleteComment={handleDeleteComment} // Handler untuk menghapus
                  isSubmittingComment={commentLoading && comments.length > 0} // Loading saat submit/delete tapi sudah ada komentar
                />
              </div>
            </div>
          </div>
        </div>
      )}
      {!tourDetail && !tourLoading && !tourError && (
         <ErrorDisplay message="Detail wisata tidak dapat ditemukan." />
      )}
    </div>
  );
};

export default DetailTour;