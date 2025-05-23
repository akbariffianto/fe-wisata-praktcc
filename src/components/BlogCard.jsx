import React from "react";

const BlogCard = ({ imageUrl, title, location, description, rating, kategori, onDetailsClick }) => {
  const handleImageError = (e) => {
    console.error(`Failed to load image: ${imageUrl}`);
    e.target.src = '/placeholder-image.png'; // Add a fallback image
    e.target.onerror = null; // Prevent infinite error loop
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="relative h-48">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
      </div>
      <div className="p-6">
        <h3 className="mt-3 font-bold text-lg pb-4 border-b border-slate-300">
          <a href="#" className="hover:text-blue-600 transition-colors">
            {title}
          </a>
        </h3>
        <h5 className="mt-3 text-l pb-4">{location}</h5>
        <p className="mt-3 text-sm text-gray-600">{description}</p>
        <div className="flex mt-4 gap-4 items-center">
          <button
            className="bg-indigo-500 text-white px-4 py-2 rounded-lg shadow-lg shadow-indigo-500/50 hover:bg-indigo-600 transition-colors"
            onClick={onDetailsClick}
          >
            Detail tour
          </button>
        </div>
        <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-lg shadow-md z-10">
          <span className="text-yellow-500 font-semibold">Rating: {rating}</span>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
