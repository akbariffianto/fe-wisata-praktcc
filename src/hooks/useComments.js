// src/hooks/useComments.js
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/AxiosInstance'; // Sesuaikan path
import { BASE_URL } from '../utils/utils'; // Sesuaikan path
import { useAuthContext } from '../auth/AuthProvider'; // Sesuaikan path

export const useComments = (id_wisata) => {
  const { userId: loggedInUserId } = useAuthContext(); // ID pengguna yang sedang login
  const navigate = useNavigate();

  const [comments, setComments] = useState([]);
  const [commentLoading, setCommentLoading] = useState(false);
  const [newCommentText, setNewCommentText] = useState(""); 
  const [editingCommentId, setEditingCommentId] = useState(null);

  const fetchComments = useCallback(async () => {
    if (!id_wisata) return;
    try {
      setCommentLoading(true);
      const response = await axios.get(`${BASE_URL}/komentar/${id_wisata}`);
      if (response.data?.status === "success" && Array.isArray(response.data.data)) {
        const sortedComments = response.data.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setComments(sortedComments);
      } else {
        console.warn("[useComments] fetchComments: Respons tidak sukses atau data bukan array", response.data);
        setComments([]);
      }
    } catch (err) {
      console.error("[useComments] Error fetching comments:", err);
      setComments([]);
    } finally {
      setCommentLoading(false);
    }
  }, [id_wisata]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmitComment = async () => {
    if (!loggedInUserId) {
      alert("Silahkan login terlebih dahulu.");
      navigate("/login");
      return;
    }
    if (!newCommentText.trim()) {
      alert("Komentar tidak boleh kosong.");
      return;
    }

    setCommentLoading(true);
    const payload = { komentar: newCommentText.trim() };

    try {
      let response;
      const apiConfig = {}; // AxiosInstance Anda seharusnya sudah menangani token via interceptor

      if (editingCommentId) {
        console.log(`[useComments] handleSubmitComment: UPDATING comment ID: ${editingCommentId} with text: "${newCommentText}"`);
        response = await axios.put(`${BASE_URL}/komentar/${editingCommentId}`, payload, apiConfig);
      } else {
        console.log(`[useComments] handleSubmitComment: ADDING new comment for wisata ID: ${id_wisata} with text: "${newCommentText}"`);
        response = await axios.post(`${BASE_URL}/komentar/${id_wisata}`, payload, apiConfig);
      }

      console.log("[useComments] handleSubmitComment: Response from backend:", response.data);

      if (response.data && response.data.status === "success") {
        alert(response.data.message || (editingCommentId ? "Komentar berhasil diperbarui!" : "Komentar berhasil dikirim!"));
        setNewCommentText("");
        setEditingCommentId(null); 
        await fetchComments(); 
      } else {
        alert(response.data?.message || "Gagal memproses komentar.");
      }
    } catch (err) {
      console.error(`[useComments] Error ${editingCommentId ? 'updating' : 'adding'} comment:`, err.response?.data || err.message || err);
      if (err.response?.status === 403 || err.response?.status === 401) {
        alert("Sesi Anda telah berakhir atau Anda tidak diizinkan. Silakan login kembali.");
        navigate("/login");
      } else {
        alert(err.response?.data?.message || `Gagal ${editingCommentId ? 'memperbarui' : 'menambahkan'} komentar.`);
      }
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDeleteComment = async (commentIdToDelete) => {
    // ... (logika handleDeleteComment Anda sudah terlihat baik, pastikan endpoint dan respons API sesuai)
    if (!loggedInUserId) { /* ... */ return; }
    if (window.confirm("Apakah Anda yakin ingin menghapus komentar ini?")) {
      try {
        setCommentLoading(true);
        const response = await axios.delete(`${BASE_URL}/komentar/${commentIdToDelete}`);
        console.log("[useComments] handleDeleteComment: Response from backend:", response.data);
        if (response.data && response.data.status === "success") {
          alert(response.data.message || "Komentar berhasil dihapus.");
          await fetchComments();
        } else {
          alert(response.data?.message || "Gagal menghapus komentar.");
        }
      } catch (err) {
        console.error("[useComments] Error deleting comment:", err.response?.data || err.message || err);
        // ... (penanganan error 401/403 Anda) ...
        if (err.response?.status === 403 || err.response?.status === 401) {
          alert("Sesi Anda telah berakhir atau Anda tidak diizinkan. Silakan login kembali.");
          navigate("/login");
        } else {
          alert(err.response?.data?.message || "Gagal menghapus komentar.");
        }
      } finally {
        setCommentLoading(false);
      }
    }
  };

  const startEditComment = (commentToEdit) => {
    console.log('[useComments] startEditComment CALLED with commentToEdit:', commentToEdit);
    
    // Pastikan commentToEdit dan loggedInUserId ada nilainya
    if (!commentToEdit || loggedInUserId == null) { // Periksa null atau undefined
        console.error("[useComments] startEditComment: commentToEdit atau loggedInUserId tidak valid.");
        alert("Data tidak lengkap untuk memulai edit.");
        return;
    }

    // Ekstrak ID pembuat komentar. PERIKSA STRUKTUR OBJEK KOMENTAR ANDA DARI API!
    // Apakah ID user ada di commentToEdit.user.id atau commentToEdit.userId?
    const commenterId = commentToEdit.user?.id ?? commentToEdit.userId; 
    // `??` (nullish coalescing) akan menggunakan commentToEdit.userId jika commentToEdit.user?.id adalah null atau undefined

    console.log(`[useComments] startEditComment - loggedInUserId: "${loggedInUserId}" (tipe: ${typeof loggedInUserId})`);
    console.log(`[useComments] startEditComment - commenterId (dari comment.user.id atau comment.userId): "${commenterId}" (tipe: ${typeof commenterId})`);

    // Bandingkan sebagai string untuk konsistensi, setelah memastikan keduanya tidak null/undefined
    const isOwner = commenterId != null && String(loggedInUserId) === String(commenterId);

    console.log(`[useComments] startEditComment - Apakah pemilik? ${isOwner}. Membandingkan String(${loggedInUserId}) === String(${commenterId})`);

    if (!isOwner) {
      alert("Anda tidak bisa mengedit komentar ini (otorisasi gagal).");
      console.log('[useComments] startEditComment - Otorisasi GAGAL.');
      return;
    }
    
    console.log('[useComments] startEditComment - Otorisasi BERHASIL. Mengatur mode edit.');
    setEditingCommentId(commentToEdit.id_komentar);
    setNewCommentText(commentToEdit.isi_komentar);
    
    const textarea = document.querySelector('textarea[placeholder="Tulis komentar Anda di sini..."]');
    if (textarea) {
      textarea.focus();
      console.log('[useComments] startEditComment - Textarea difokuskan.');
    } else {
      console.warn('[useComments] startEditComment - Textarea tidak ditemukan untuk difokuskan.');
    }
  };

  const cancelEdit = () => {
    console.log("[useComments] cancelEdit dipanggil.");
    setEditingCommentId(null);
    setNewCommentText("");
  }

  return { 
    comments, 
    commentLoading, 
    newCommentText, 
    setNewCommentText, 
    handleSubmitComment, 
    handleDeleteComment,
    editingCommentId,
    startEditComment,
    cancelEdit,
    fetchComments
  };
};