import React from "react";

const BlogCard = ({ imageUrl, title, likes, location }) => {
  return (
    <div className="bg-white w-1/3 shadow rounded-lg overflow-hidden relative">
      {/* Rating Badge */}
      <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-lg shadow-md z-10">
        <span className="text-yellow-500 font-semibold">Rating: 5.0</span>
      </div>
      <img src={imageUrl} className="object-cover h-52 w-full" alt={title} />
      <div className="p-6">
        <h3 className="mt-3 font-bold text-lg pb-4 border-b border-slate-300">
          <a href="#" className="hover:text-blue-600 transition-colors">
            {title}
          </a>
        </h3>
        <h5 className="mt-3 text-l pb-4">{location}</h5>
        <div className="flex mt-4 gap-4 items-center">
          <span className="flex gap-1 items-center text-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="text-sky-400 w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
              />
            </svg>
            {likes}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
