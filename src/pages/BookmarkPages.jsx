import React from 'react';
import { useNavigate } from 'react-router-dom';

const BookmarkPages = () => {
  const navigate = useNavigate();

  // Dummy data for bookmarks - replace with actual data from your backend
  const bookmarks = [
    {
      id: 1,
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Elizabeth_Tower%2C_June_2022.jpg/960px-Elizabeth_Tower%2C_June_2022.jpg", 
      title: "Big Ben",
      location: "London, UK",
      budget: "£20",
      rating: 4.5
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => navigate('/tourpage')}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Kembali
        </button>
        <h1 className="text-2xl font-bold">Bookmark</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {bookmarks.map((bookmark) => (
          <div key={bookmark.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="relative">
              <img 
                src={bookmark.image}
                alt={bookmark.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-lg">
                <span className="text-yellow-500 font-semibold">
                  Rating: {bookmark.rating}
                </span>
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-lg">{bookmark.title}</h3>
                <span className="text-blue-600">{bookmark.budget}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-600 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                <span className="text-sm">{bookmark.location}</span>
              </div>
              <button 
                onClick={() => navigate('/detailtour')}
                className="w-full bg-indigo-500 text-white px-4 py-2 rounded-lg shadow-lg shadow-indigo-500/50 hover:bg-indigo-600 transition-colors text-sm"
              >
                Detail Page
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookmarkPages;