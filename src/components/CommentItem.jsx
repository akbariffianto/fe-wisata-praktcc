// src/components/CommentItem.jsx
import React from 'react';

const CommentItem = ({ comment, loggedInUserId, onEdit, onDelete, isProcessing }) => {
  // Coba kedua kemungkinan path untuk ID pembuat komentar, sesuaikan dengan struktur data API Anda
  const commenterId = comment?.user?.id || comment?.userId; 
  const commenterUsername = comment?.user?.username || 'User Anonim';

  // Debugging Log PENTING:
  console.log(
    `[CommentItem] ID Komentar: ${comment?.id_komentar}, ` +
    `loggedInUserId: ${loggedInUserId} (Tipe: ${typeof loggedInUserId}), ` +
    `commenterId (dari comment.user.id atau comment.userId): ${commenterId} (Tipe: ${typeof commenterId})`
  );

  const isOwner = loggedInUserId != null && // Pastikan loggedInUserId tidak null/undefined
                  commenterId != null &&  // Pastikan commenterId tidak null/undefined
                  String(loggedInUserId) === String(commenterId); // Bandingkan sebagai string untuk konsistensi

  if (comment?.id_komentar) { // Hanya log jika id_komentar ada, untuk menghindari spam
    console.log(
        `[CommentItem ID: ${comment.id_komentar}] Pemilik? ${isOwner}. ` +
        `Perbandingan: String(${loggedInUserId}) === String(${commenterId})`
    );
  }


  return (
    <div className="flex gap-3 sm:gap-4 bg-gray-50 rounded-lg p-3 sm:p-4 shadow">
      {/* ... Avatar dan info komentar ... */}
      <div className="flex-shrink-0">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-sm sm:text-base">
          {commenterUsername.charAt(0).toUpperCase()}
        </div>
      </div>
      <div className="flex-grow">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1">
          <span className="font-medium text-gray-800 text-sm sm:text-base">{commenterUsername}</span>
          <span className="text-xs text-gray-500 mt-1 sm:mt-0">
            {new Date(comment.createdAt).toLocaleDateString("id-ID", { 
              year: 'numeric', month: 'short', day: 'numeric', 
              hour: '2-digit', minute: '2-digit' 
            })}
          </span>
        </div>
        <p className="text-gray-700 text-sm sm:text-base whitespace-pre-wrap">{comment.isi_komentar}</p>
        
        {/* Tombol Edit dan Hapus Komentar */}
        {isOwner && ( // Gunakan variabel isOwner yang sudah dihitung
          <div className="mt-2 flex items-center gap-3">
            <button 
              onClick={() => onEdit(comment)}
              className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors py-1"
              disabled={isProcessing}
            >
              Edit
            </button>
            <span className="text-gray-300">|</span>
            <button 
              onClick={() => onDelete(comment.id_komentar)}
              className="text-xs font-medium text-red-600 hover:text-red-800 transition-colors py-1"
              disabled={isProcessing}
            >
              Hapus
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentItem;