'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

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
    <nav className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl sm:text-2xl font-bold hover:text-blue-100 transition-colors">
            📝 Suvidha
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex gap-2 lg:gap-4 items-center">
            <Link href="/summarize" className="hover:bg-blue-700 px-3 lg:px-4 py-2 rounded transition-colors">
              Summarize
            </Link>
            <Link href="/history" className="hover:bg-blue-700 px-3 lg:px-4 py-2 rounded transition-colors">
              History
            </Link>
            {user ? (
              <>
                <div className="w-10 h-10 rounded-full bg-blue-800 flex items-center justify-center text-lg font-bold border-2 border-blue-400">
                  {user[0].toUpperCase()}
                </div>
                <button onClick={handleLogout} className="hover:bg-blue-700 px-3 lg:px-4 py-2 rounded transition-colors">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="hover:bg-blue-700 px-3 lg:px-4 py-2 rounded transition-colors">
                  Login
                </Link>
                <Link href="/signup" className="bg-white text-blue-600 hover:bg-blue-50 px-3 lg:px-4 py-2 rounded font-semibold transition-colors">
                  Signup
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded hover:bg-blue-700 transition-colors"
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

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link href="/summarize" className="block hover:bg-blue-700 px-4 py-2 rounded transition-colors">
              Summarize
            </Link>
            <Link href="/history" className="block hover:bg-blue-700 px-4 py-2 rounded transition-colors">
              History
            </Link>
            {user ? (
              <>
                <div className="flex items-center gap-3 px-4 py-2">
                  <div className="w-10 h-10 rounded-full bg-blue-800 flex items-center justify-center text-lg font-bold border-2 border-blue-400">
                    {user[0].toUpperCase()}
                  </div>
                  <span className="text-sm">{user}</span>
                </div>
                <button onClick={handleLogout} className="block w-full text-left hover:bg-blue-700 px-4 py-2 rounded transition-colors">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="block hover:bg-blue-700 px-4 py-2 rounded transition-colors">
                  Login
                </Link>
                <Link href="/signup" className="block bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded font-semibold transition-colors">
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
