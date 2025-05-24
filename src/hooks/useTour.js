// src/hooks/useTour.js
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/AxiosInstance'; // Sesuaikan path
import { BASE_URL } from '../utils/utils'; // Sesuaikan path
import { useAuthContext } from '../auth/AuthProvider'; // Sesuaikan path

export const useTour = (id_wisata) => {
  const { userId } = useAuthContext(); // ID pengguna yang sedang login
  const navigate = useNavigate();

  const [tourDetail, setTourDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false); 
  // TODO: Idealnya, status bookmark awal juga di-fetch dan di-set di sini

  const fetchTourDetail = useCallback(async () => {
    if (!id_wisata) {
      console.warn("[useTour] fetchTourDetail: id_wisata tidak valid atau tidak ada.");
      setError("ID Wisata tidak valid.");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      console.log(`[useTour] fetchTourDetail: Fetching tour with id_wisata = ${id_wisata}`);
      const response = await axios.get(`${BASE_URL}/wisata/${id_wisata}`);
      console.log("[useTour] fetchTourDetail: Response from API:", response.data);

      if (response.data?.message === "Data berhasil didapatkan") {
        // Lebih aman untuk mengecek apakah response.data.data adalah objek atau array
        const tourDataResult = Array.isArray(response.data.data) ? response.data.data[0] : response.data.data;
        
        if (tourDataResult) {
          console.log("[useTour] fetchTourDetail: Tour data found:", tourDataResult);
          setTourDetail(tourDataResult);
          // Di sini Anda akan fetch status bookmark awal jika ada API-nya
          // Contoh:
          // if (userId) { // Hanya fetch jika user login
          //   try {
          //     const bookmarkStatusResponse = await axios.get(`${BASE_URL}/bookmark/status/${id_wisata}`); // Asumsi endpoint
          //     if (bookmarkStatusResponse.data?.isBookmarked) {
          //       setIsBookmarked(true);
          //     } else {
          //       setIsBookmarked(false);
          //     }
          //   } catch (bookmarkError) {
          //     console.warn("Could not fetch initial bookmark status", bookmarkError);
          //   }
          // }
        } else {
          console.warn("[useTour] fetchTourDetail: 'Data berhasil didapatkan' tapi tourDataResult kosong atau tidak valid.");
          throw new Error("Data detail wisata tidak ditemukan dalam respons");
        }
      } else {
        console.warn("[useTour] fetchTourDetail: Pesan sukses API tidak sesuai atau tidak ada.", response.data?.message);
        throw new Error(response.data?.message || "Gagal memuat detail wisata (pesan tidak sesuai)");
      }
    } catch (err) {
      console.error("[useTour] Error fetching tour details (useTour):", err.response?.data || err.message || err);
      if (err.response?.status === 403 || err.response?.status === 401) {
        navigate("/login");
      } else {
        setError(err.message || "Gagal memuat detail wisata");
      }
    } finally {
      setLoading(false);
    }
  }, [id_wisata, navigate, userId]); // Tambahkan userId jika fetch bookmark bergantung padanya

  useEffect(() => {
    fetchTourDetail();
  }, [fetchTourDetail]); // fetchTourDetail sudah di-memoize dengan useCallback

  const handleBookmark = async () => {
    // ... (Logika handleBookmark Anda sebelumnya sudah cukup baik)
    if (!userId) { /* ... */ return; }
    try {
      if (isBookmarked) {
        // Logika unbookmark jika sudah diimplementasikan
        // const response = await axios.delete(`${BASE_URL}/bookmark/${id_wisata}`);
        // if (response.data?.status === "success" || response.data?.message === "Data berhasil dihapus") {
        //   setIsBookmarked(false);
        //   alert("Wisata dihapus dari bookmark.");
        // } else {
        //   alert(response.data?.message || "Gagal menghapus bookmark.");
        // }
        alert("Fitur unbookmark belum diimplementasikan sepenuhnya di contoh ini.");
      } else {
        const response = await axios.post(`${BASE_URL}/bookmark/${id_wisata}`);
        // Sesuaikan pengecekan sukses dengan respons API bookmark Anda
        if (response.data?.status === "success" || response.data?.message === "Data berhasil ditambahkan") {
          setIsBookmarked(true);
          alert("Wisata berhasil disimpan ke bookmark");
        } else {
          alert(response.data?.message || "Gagal memproses bookmark");
        }
      }
    } catch (err) { /* ... penanganan error Anda ... */ }
  };

  const handleDelete = async () => {
    console.log('[useTour] handleDelete: Proses hapus dimulai.');
    console.log('[useTour] handleDelete: Logged-in userId:', userId, `(Tipe: ${typeof userId})`);
    console.log('[useTour] handleDelete: tourDetail saat ini:', tourDetail);
    console.log('[useTour] handleDelete: tourDetail.userId (pemilik):', tourDetail?.userId, `(Tipe: ${typeof tourDetail?.userId})`);
    console.log('[useTour] handleDelete: id_wisata (untuk API call):', id_wisata);

    if (!tourDetail) {
      alert("Data detail wisata belum dimuat atau tidak ada. Tidak dapat menghapus.");
      console.log('[useTour] handleDelete: DIBATALKAN - tourDetail null.');
      return;
    }

    // Pastikan kedua ID ada dan bandingkan sebagai string untuk konsistensi
    const isOwner = userId != null && tourDetail.userId != null && String(userId) === String(tourDetail.userId);
    
    console.log(`[useTour] handleDelete: Apakah pengguna ini pemilik? ${isOwner}. (Membandingkan String(${userId}) === String(${tourDetail.userId}))`);

    if (!isOwner) {
      alert("Anda tidak memiliki hak untuk menghapus wisata ini.");
      console.log('[useTour] handleDelete: DIBATALKAN - Pengguna bukan pemilik.');
      return;
    }

    if (window.confirm("Apakah Anda yakin ingin menghapus wisata ini?")) {
      console.log('[useTour] handleDelete: Pengguna mengkonfirmasi penghapusan.');
      try {
        // Diasumsikan AxiosInstance Anda sudah menangani token
        const response = await axios.delete(`${BASE_URL}/wisata/${id_wisata}`);
        
        console.log('[useTour] handleDelete: Respons API setelah delete:', response);
        console.log('[useTour] handleDelete: response.data:', response.data);
        console.log('[useTour] handleDelete: response.status (HTTP):', response.status); // Status HTTP dari Axios
        console.log('[useTour] handleDelete: response.data.status (dari body JSON jika ada):', response.data?.status);
        console.log('[useTour] handleDelete: response.data.message (dari body JSON):', response.data?.message);

        // Pengecekan Sukses yang Lebih Robust:
        // 1. Periksa status HTTP (200 OK atau 204 No Content adalah umum untuk DELETE sukses)
        // 2. DAN/ATAU periksa field "status" atau "message" dari body JSON jika API Anda memberikannya.
        if ((response.status === 200 || response.status === 204) && 
            (response.data?.status === "success" || response.data?.message === "Data berhasil dihapus")) {
          console.log('[useTour] handleDelete: Penghapusan berhasil berdasarkan respons API.');
          alert(response.data?.message || "Wisata berhasil dihapus");
          navigate("/tourpage");
        } else {
          console.warn('[useTour] handleDelete: Penghapusan gagal atau kondisi sukses tidak terpenuhi.');
          alert(response.data?.message || "Gagal menghapus wisata (respons server tidak sesuai).");
        }
      } catch (err) {
        console.error("[useTour] handleDelete: Error saat menghapus (blok CATCH):", err.response || err.message || err);
        if (err.response) {
          console.error('[useTour] handleDelete - Error response data:', err.response.data);
          console.error('[useTour] handleDelete - Error response status:', err.response.status);
        }
        // ... penanganan error 401/403 Anda ...
        if (err.response?.status === 403 || err.response?.status === 401) {
          alert("Sesi anda telah berakhir atau Anda tidak diizinkan. Silahkan login kembali");
          navigate("/login");
        } else {
          alert(err.response?.data?.message || err.message || "Gagal menghapus wisata (exception).");
        }
      }
    } else {
      console.log('[useTour] handleDelete: Pengguna membatalkan penghapusan.');
    }
  };

  return { tourDetail, loading, error, isBookmarked, handleBookmark, handleDelete, fetchTourDetail };
};