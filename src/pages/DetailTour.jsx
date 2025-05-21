import React from 'react';
import { useNavigate } from 'react-router-dom';

const DetailTour = () => {
  const navigate = useNavigate();
  
  // Dummy data for comments
  const comments = [
    { id: 1, author: "John Doe", text: "Amazing place! Would love to visit again.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1" },
    { id: 2, author: "Jane Smith", text: "The architecture is breathtaking!", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2" },
    { id: 3, author: "Mike Johnson", text: "Great tourist spot, highly recommended!", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=3" },
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
        <h1 className="text-2xl font-bold">Detail Wisata</h1>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left side - Tour Details Card */}
        <div className="md:w-1/2">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="relative">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Elizabeth_Tower%2C_June_2022.jpg/960px-Elizabeth_Tower%2C_June_2022.jpg" 
                alt="Big Ben"
                className="w-full h-64 object-cover"
              />
              <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-lg">
                <span className="text-yellow-500 font-semibold">Rating: 4.5</span>
              </div>
            </div>
            
            <div className="p-6">
              <h2 className="text-xl font-bold mb-2">Big Ben</h2>
              <div className="flex justify-between mb-4">
                <span className="text-gray-600">Lokasi: London, UK</span>
                <span className="text-blue-600">Anggaran: £20</span>
              </div>
              <p className="text-gray-700">
                Big Ben is the nickname for the Great Bell of the clock at the north end of the Houses of Parliament in Westminster, London. The tower is officially known as Elizabeth Tower, renamed to mark the Diamond Jubilee of Elizabeth II in 2012.
              </p>
              {/* Add Bookmark Button */}
              <button className="mt-6 w-full bg-yellow-400 text-black px-4 py-2 rounded-lg shadow-lg shadow-yellow-400/50 hover:bg-yellow-500 transition-colors flex items-center justify-center gap-2">
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
                Simpan ke Bookmark
              </button>
            </div>
          </div>
        </div>

        {/* Right side - Comments Section */}
        <div className="md:w-1/2">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold mb-6">Kolom Komentar</h3>
            
            {/* Add comment form */}
            <div className="mb-6">
              <textarea 
                className="w-full p-3 border rounded-lg resize-none mb-2" 
                placeholder="Tambah komentar"
                rows="3"
              />
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg float-right hover:bg-blue-700">
                Tambahkan
              </button>
            </div>

            {/* Comments list */}
            <div className="space-y-4 mt-16">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-4 items-start">
                  <img 
                    src={comment.avatar} 
                    alt={comment.author} 
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1 bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold mb-1">{comment.author}</h4>
                    <p className="text-gray-700">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailTour;