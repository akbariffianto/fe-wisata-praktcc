import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/utils";

const InputTourPages = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false); // Add this
  const [formData, setFormData] = useState({
    foto_wisata: null,
    imagePreview: null,
    nama_wisata: "",
    lokasi_wisata: "",
    kategori_wisata: "",
    deskripsi_wisata: "",
    rating_wisata: ""
  });

  // Tour types for dropdown matching enum values
  const tourTypes = [
    { value: "pegunungan", label: "Pegunungan" },
    { value: "perairan", label: "Perairan" },
    { value: "budaya", label: "Budaya" },
    { value: "kuliner", label: "Kuliner" }
  ];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validasi ukuran dan tipe file
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        alert('Format foto tidak valid. Gunakan PNG, JPG, atau JPEG');
        e.target.value = ''; // Reset input
        return;
      }

      if (file.size > maxSize) {
        alert('Ukuran foto maksimal 5MB');
        e.target.value = ''; // Reset input
        return;
      }

      // Preview image
      setFormData({ 
        ...formData, 
        foto_wisata: file,
        imagePreview: URL.createObjectURL(file)
      });

      // Cleanup preview URL when component unmounts
      return () => {
        URL.revokeObjectURL(formData.imagePreview);
      };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi form
    if (!formData.nama_wisata || 
        !formData.lokasi_wisata || 
        !formData.kategori_wisata || 
        !formData.deskripsi_wisata || 
        !formData.rating_wisata || 
        !formData.foto_wisata) {
      alert('Mohon lengkapi semua field');
      return;
    }

    setIsLoading(true); // Set loading true before submission

    try {
      const data = new FormData();

      // Field names exactly matching DB columns
      data.append("nama_wisata", formData.nama_wisata);
      data.append("lokasi_wisata", formData.lokasi_wisata);
      data.append("kategori_wisata", formData.kategori_wisata);
      data.append("deskripsi_wisata", formData.deskripsi_wisata);
      data.append("rating_wisata", parseFloat(formData.rating_wisata));

      if (formData.foto_wisata) {
        data.append("foto_wisata", formData.foto_wisata);
        console.log('Uploading image:', formData.foto_wisata);
      }

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
      };

      console.log('Sending request to:', `${BASE_URL}/wisata`);
      const response = await axios.post(`${BASE_URL}/wisata`, data, config);

      if (response.data && response.data.message === "Data berhasil ditambahkan") {
        alert(response.data.message);
        navigate("/tourpage");
      } else {
        throw new Error(response.data.message || "Gagal menambahkan data wisata");
      }
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = error.response?.data?.message || 
                         error.message || 
                         "Gagal menambahkan data wisata. Silakan coba lagi.";
      alert(errorMessage);
    } finally {
      setIsLoading(false); // Set loading false after completion
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/tourpage")}
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
        <h1 className="text-2xl font-bold">Input Rekomendasi Wisata</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-8">
        <div className="flex-1">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Upload Gambar Wisata</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              {formData.imagePreview ? (
                <div className="relative">
                  <img
                    src={formData.imagePreview}
                    alt="Preview"
                    className="max-w-full h-auto rounded"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      URL.revokeObjectURL(formData.imagePreview);
                      setFormData({ 
                        ...formData, 
                        foto_wisata: null,
                        imagePreview: null 
                      });
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div>
                  <input
                    type="file"
                    accept=".png,.jpg,.jpeg,image/png,image/jpeg,image/jpg"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        // Validasi ukuran dan tipe file
                        const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
                        const maxSize = 5 * 1024 * 1024; // 5MB

                        if (!validTypes.includes(file.type)) {
                          alert('Format foto tidak valid. Gunakan PNG, JPG, atau JPEG');
                          e.target.value = ''; // Reset input
                          return;
                        }

                        if (file.size > maxSize) {
                          alert('Ukuran foto maksimal 5MB');
                          e.target.value = ''; // Reset input
                          return;
                        }

                        console.log('Selected file:', file);
                        setFormData({ 
                          ...formData, 
                          foto_wisata: file,
                          imagePreview: URL.createObjectURL(file)
                        });

                        // Cleanup preview URL when component unmounts
                        return () => {
                          URL.revokeObjectURL(formData.imagePreview);
                        };
                      }
                    }}
                    className="hidden"
                    id="imageInput"
                    required
                  />
                  <label htmlFor="imageInput" className="cursor-pointer text-gray-500 hover:text-gray-700">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-12 h-12 mx-auto mb-2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                      />
                    </svg>
                    <span>Klik untuk upload gambar</span>
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Detail Wisata</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Wisata
                </label>
                <input
                  type="text"
                  value={formData.nama_wisata}
                  onChange={(e) =>
                    setFormData({ ...formData, nama_wisata: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lokasi Wisata
                </label>
                <input
                  type="text"
                  value={formData.lokasi_wisata}
                  onChange={(e) =>
                    setFormData({ ...formData, lokasi_wisata: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kategori Wisata
                </label>
                <select
                  value={formData.kategori_wisata}
                  onChange={(e) =>
                    setFormData({ ...formData, kategori_wisata: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Pilih Kategori</option>
                  {tourTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deskripsi
                </label>
                <textarea
                  value={formData.deskripsi_wisata}
                  onChange={(e) =>
                    setFormData({ ...formData, deskripsi_wisata: e.target.value })
                  }
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rating {formData.rating_wisata && `(${formData.rating_wisata})`}
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="0.1"
                  value={formData.rating_wisata}
                  onChange={(e) =>
                    setFormData({ ...formData, rating_wisata: e.target.value })
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  required
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>1</span>
                  <span>2</span>
                  <span>3</span>
                  <span>4</span>
                  <span>5</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors mt-6"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default InputTourPages;
