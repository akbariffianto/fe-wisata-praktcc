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
          <button className="bg-indigo-500 text-white px-4 py-2 rounded-lg shadow-lg shadow-indigo-500/50 hover:bg-indigo-600 transition-colors"><a href="/detailtour">Detail tour</a></button>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
