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
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-blue-600 mb-4">
          Welcome to Suvidha Text Summarizer
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          AI-powered text summarization made simple
        </p>
        <div className="flex gap-4 justify-center">
          <button 
            onClick={handleGetSummarize}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Get Summarize
          </button>
          {isLoggedIn ? (
            <button 
              onClick={handleLogout}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          ) : (
            <a href="/login" className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300">
              Login
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
