import React, { useState } from "react";
import BlogCard from "../components/BlogCard";
import FilterDropdown from "../components/FilterDropdown";
import { useAuthContext } from "../auth/AuthProvider";

const TourPages = () => {
  const { userInfo } = useAuthContext();
  const [kategori, setKategori] = useState("");
  const [rating, setRating] = useState(0);

  const filterOptions = {
    kategori: [
      { value: "alam", label: "Alam" },
      { value: "budaya", label: "Budaya" },
      { value: "kuliner", label: "Kuliner" },
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
      category: "alam",
      rating: 4.5,
    },
    {
      imageUrl: "https://loremflickr.com/320/240?random=2",
      title: "Top 10 beaches in Hawaii",
      location: "Hawaii",
      views: 42,
      likes: 25,
      comments: 18,
      category: "alam",
      rating: 4.0,
    },
    {
      imageUrl: "https://loremflickr.com/320/240?random=3",
      title: "Must-visit restaurants in New York",
      location: "New York",
      views: 38,
      likes: 22,
      comments: 12,
      category: "kuliner",
      rating: 3.5,
    },
  ];

  return (
    <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-slate-100 py-6 sm:py-12">
      <div className="min-h-28">
        <div className="max-w-screen-lg mx-auto py-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-bold text-4xl text-slate-700 font-display">
              Hi, {userInfo?.username || "Guest"}!
            </h2>
            <div className="flex gap-4">
              <button className="bg-yellow-400 text-black px-4 py-2 rounded-lg shadow-lg shadow-yellow-400/50 hover:bg-yellow-500 transition-colors flex items-center gap-2">
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
                    d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
                  />
                </svg>
                <a href="/bookmark">Bookmark</a>
              </button>
              <button className="bg-indigo-500 text-white px-4 py-2 rounded-lg shadow-lg shadow-indigo-500/50 hover:bg-indigo-600 transition-colors">
                <a href="/inputtour">Input Rekomendasi</a>
              </button>
              <button className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg shadow-red-500/50 hover:bg-red-600 transition-colors">
                Log out
              </button>
            </div>
          </div>

          {/* Updated Filter Section */}
          <div className="flex items-center gap-8 mb-8">
            <div className="w-48">
              <FilterDropdown
                title="Kategori"
                options={filterOptions.kategori}
                value={kategori}
                onChange={setKategori}
              />
            </div>
            
            <div className="flex-1 max-w-md">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating Minimum: {rating.toFixed(1)}
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.1"
                  value={rating}
                  onChange={(e) => setRating(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-sm font-medium text-gray-600 w-12">
                  {rating.toFixed(1)}/5
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-6 mt-10">
            {blogPosts
              .filter(post => !kategori || post.category === kategori)
              .filter(post => post.rating >= rating)
              .map((post, index) => (
                <BlogCard key={index} {...post} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourPages;
