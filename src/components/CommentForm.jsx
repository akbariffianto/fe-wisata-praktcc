// src/components/CommentForm.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const CommentForm = ({ 
  commentText, 
  setCommentText, 
  onSubmit, 
  isLoading, 
  loggedInUserId,
  editingCommentId, // ID komentar yang sedang diedit (null jika menambah baru)
  onCancelEdit      // Fungsi untuk membatalkan mode edit
}) => {
  const navigate = useNavigate();

  if (!loggedInUserId) {
    return (
      <div className="text-center py-4 px-3 bg-yellow-100 border border-yellow-300 rounded-lg">
        <p className="text-yellow-800">
          Silahkan <button onClick={() => navigate('/login')} className="text-blue-600 hover:underline font-semibold">login</button> untuk menambahkan komentar.
        </p>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(); // Memanggil handleSubmitComment dari hook useComments
  };

  return (
    <div className="mb-6">
      <h4 className="text-lg font-semibold mb-2 text-gray-700">
        {editingCommentId ? 'Edit Komentar Anda:' : 'Tulis Komentar Baru:'}
      </h4>
      <textarea
        className="w-full p-3 border border-gray-300 rounded-lg resize-none mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
        placeholder="Tulis komentar Anda di sini..."
        rows="3"
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
      />
      <div className="flex justify-between items-center mt-2">
        <span className="text-sm text-gray-500">{commentText.length} karakter</span>
        <div className="flex gap-2">
          {editingCommentId && (
            <button
              type="button"
              onClick={onCancelEdit}
              disabled={isLoading}
              className="px-4 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors"
            >
              Batal
            </button>
          )}
          <button
            type="button" // Ubah ke type="button" jika form submission dihandle onClick
            onClick={handleSubmit}
            disabled={!commentText.trim() || isLoading}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2
              ${commentText.trim() && !isLoading 
                ? (editingCommentId ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-blue-600 text-white hover:bg-blue-700') 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
          >
            {/* SVG Icon bisa ditambahkan di sini jika perlu */}
            {isLoading ? 'Memproses...' : (editingCommentId ? 'Update Komentar' : 'Kirim Komentar')}
          </button>
        </div>
      </div>
    </div>
  );
};
export default CommentForm;