import React, { useState } from "react";
import BlogCard from "../components/BlogCard";
import FilterDropdown from "../components/FilterDropdown";

const TourPages = () => {
  const [kategori, setKategori] = useState("");
  const [anggaran, setAnggaran] = useState("");
  const [jumlahSuka, setJumlahSuka] = useState("");

  const filterOptions = {
    kategori: [
      { value: "alam", label: "Alam" },
      { value: "budaya", label: "Budaya" },
      { value: "kuliner", label: "Kuliner" },
    ],
    anggaran: [
      { value: "1-500", label: "1-500rb" },
      { value: "500-1000", label: "500rb-1jt" },
      { value: "1000-5000", label: "1jt-5jt" },
    ],
    jumlahSuka: [
      { value: "1-10", label: "1-10 Suka" },
      { value: "10-50", label: "10-50 Suka" },
      { value: "50-100", label: "50-100 Suka" },
    ],
  };

  const blogPosts = [
    {
      imageUrl: "https://loremflickr.com/320/240?random=1",
      title: "Finding best places to visit in California",
      location: "California",
      views: 35,
      likes: 20,
      comments: 15,
    },
    {
      imageUrl: "https://loremflickr.com/320/240?random=2",
      title: "Top 10 beaches in Hawaii",
      location: "Hawaii",
      views: 42,
      likes: 25,
      comments: 18,
    },
    {
      imageUrl: "https://loremflickr.com/320/240?random=3",
      title: "Must-visit restaurants in New York",
      location: "New York",
      views: 38,
      likes: 22,
      comments: 12,
    },
  ];

  return (
    <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-slate-100 py-6 sm:py-12">
      <div className="min-h-28">
        <div className="max-w-screen-lg mx-auto py-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-bold text-4xl text-slate-700 font-display">
              Hi, Wijdan!
            </h2>
            <div className="flex gap-4">
              <button className="bg-indigo-500 text-white px-4 py-2 rounded-lg shadow-lg shadow-indigo-500/50 hover:bg-indigo-600 transition-colors">
                Input Rekomendasi
              </button>
              <button className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg shadow-red-500/50 hover:bg-red-600 transition-colors">
                Log out
              </button>
            </div>
          </div>

          {/* Filter Section */}
          <div className="flex gap-4 mb-8">
            <FilterDropdown
              title="Kategori"
              options={filterOptions.kategori}
              value={kategori}
              onChange={setKategori}
            />
            <FilterDropdown
              title="Anggaran"
              options={filterOptions.anggaran}
              value={anggaran}
              onChange={setAnggaran}
            />
            <FilterDropdown
              title="Jumlah Suka"
              options={filterOptions.jumlahSuka}
              value={jumlahSuka}
              onChange={setJumlahSuka}
            />
          </div>

          <div className="flex gap-6 mt-10">
            {blogPosts.map((post, index) => (
              <BlogCard key={index} {...post} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourPages;
