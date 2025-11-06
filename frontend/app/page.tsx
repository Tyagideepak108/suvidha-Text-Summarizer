'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Home() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'));
  }, []);

  const handleGetSummarize = () => {
    if (isLoggedIn) {
      router.push('/summarize');
    } else {
      router.push('/signup');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4 sm:mb-6">
            Suvidha Text Summarizer
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Transform long texts into concise summaries with AI-powered technology
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
            <button 
              onClick={handleGetSummarize}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl font-semibold"
            >
              Get Started
            </button>
            {isLoggedIn ? (
              <button 
                onClick={handleLogout}
                className="w-full sm:w-auto bg-red-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg hover:bg-red-700 transition-all shadow-lg hover:shadow-xl font-semibold"
              >
                Logout
              </button>
            ) : (
              <a href="/login" className="w-full sm:w-auto bg-white text-gray-800 px-6 sm:px-8 py-3 sm:py-4 rounded-lg hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl font-semibold border-2 border-gray-200">
                Login
              </a>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 sm:mt-20 lg:mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-3xl sm:text-4xl mb-4"></div>
            <h3 className="text-lg sm:text-xl font-bold mb-2 text-gray-800">AI-Powered</h3>
            <p className="text-sm sm:text-base text-gray-600">Advanced NLP models for accurate summarization</p>
          </div>
          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-3xl sm:text-4xl mb-4"></div>
            <h3 className="text-lg sm:text-xl font-bold mb-2 text-gray-800">Fast & Efficient</h3>
            <p className="text-sm sm:text-base text-gray-600">Get summaries in seconds, not minutes</p>
          </div>
          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow sm:col-span-2 lg:col-span-1">
            <div className="text-3xl sm:text-4xl mb-4"></div>
            <h3 className="text-lg sm:text-xl font-bold mb-2 text-gray-800">History Tracking</h3>
            <p className="text-sm sm:text-base text-gray-600">Save and manage all your summaries</p>
          </div>
        </div>
      </div>
    </div>
  );
}
