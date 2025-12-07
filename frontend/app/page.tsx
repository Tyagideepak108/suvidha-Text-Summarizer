'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import './home.css';

export default function Home() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/signup');
    } else {
      setIsLoggedIn(true);
    }
  }, [router]);

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
    <div className="home-container">
      <div className="home-content">
        <div className="home-hero">
          <h1 className="home-title">
            Snap News
          </h1>
          <p className="home-subtitle">
            Transform long texts into concise summaries with AI-powered technology
          </p>
          <div className="home-buttons">
            <button 
              onClick={handleGetSummarize}
              className="home-btn-primary"
            >
              Get Started
            </button>
            {isLoggedIn ? (
              <button 
                onClick={handleLogout}
                className="home-btn-secondary"
              >
                Logout
              </button>
            ) : (
              <a href="/login" className="home-btn-secondary">
                Login
              </a>
            )}
          </div>
        </div>

        <div className="home-features">
          <div className="home-feature-card">
            <h3 className="home-feature-title">AI-Powered</h3>
            <p className="home-feature-desc">Advanced NLP models for accurate summarization</p>
          </div>
          <div className="home-feature-card">
            <h3 className="home-feature-title">Fast & Efficient</h3>
            <p className="home-feature-desc">Get summaries in seconds, not minutes</p>
          </div>
          <div className="home-feature-card">
            <h3 className="home-feature-title">History Tracking</h3>
            <p className="home-feature-desc">Save and manage all your summaries</p>
          </div>
        </div>
      </div>
    </div>
  );
}
