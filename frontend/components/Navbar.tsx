'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import './navbar.css';

export default function Navbar() {
  const [user, setUser] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('userEmail');
    console.log('Token:', token);
    console.log('Email:', email);
    if (token && email) {
      setUser(email);
      console.log('User set to:', email);
    }
  }, []);

  if (!mounted) return null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          <Link href="/" className="navbar-logo">
            Snap News
          </Link>
          
          <div className="navbar-menu">
            <Link href="/summarize" className="navbar-link">
              Summarize
            </Link>
            <Link href="/history" className="navbar-link">
              History
            </Link>
            {user ? (
              <>
                <div className="navbar-avatar">
                  {user[0].toUpperCase()}
                </div>
                <button onClick={handleLogout} className="navbar-link">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="navbar-link">
                  Login
                </Link>
                <Link href="/signup" className="navbar-btn-primary">
                  Signup
                </Link>
              </>
            )}
          </div>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="navbar-mobile-btn"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="navbar-mobile-menu">
            <Link href="/summarize" className="navbar-mobile-link">
              Summarize
            </Link>
            <Link href="/history" className="navbar-mobile-link">
              History
            </Link>
            {user ? (
              <>
                <div className="navbar-mobile-user">
                  <div className="navbar-avatar">
                    {user[0].toUpperCase()}
                  </div>
                  <span className="navbar-mobile-email">{user}</span>
                </div>
                <button onClick={handleLogout} className="navbar-mobile-link">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="navbar-mobile-link">
                  Login
                </Link>
                <Link href="/signup" className="navbar-btn-primary">
                  Signup
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
