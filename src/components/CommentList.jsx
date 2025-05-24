// src/components/CommentList.jsx
import React from 'react';
import CommentItem from './CommentItem'; // Pastikan path ini benar

const CommentList = ({ comments, isLoading, loggedInUserId, onEditComment, onDeleteComment, isSubmittingComment }) => {
  if (isLoading) { // isLoading di sini untuk fetch awal daftar komentar
    return <div className="flex justify-center py-4"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div></div>;
  }
  if (!comments || comments.length === 0) {
    return <div className="text-center py-8 text-gray-500">Belum ada komentar.</div>;
  }

  return (
    <div className="space-y-4">
      {comments.map((komentar) => (
        <CommentItem 
          key={komentar.id_komentar} 
          comment={komentar}
          loggedInUserId={loggedInUserId}
          onEdit={onEditComment}
          onDelete={onDeleteComment}
          isProcessing={isSubmittingComment} // Untuk disable tombol saat ada operasi lain
        />
      ))}
      {/* Indikator loading jika sedang submit/delete tapi sudah ada komentar */}
      {isSubmittingComment && comments.length > 0 && (
          <div className="flex justify-center pt-4"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div></div>
      )}
    </div>
  );
};
export default CommentList;