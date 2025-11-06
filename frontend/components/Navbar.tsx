'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [user, setUser] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

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
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold">
            Suvidha Summarizer
          </Link>
          <div className="flex gap-4 items-center">
            <Link href="/summarize" className="hover:bg-blue-700 px-4 py-2 rounded">
              Summarize
            </Link>
            <Link href="/history" className="hover:bg-blue-700 px-4 py-2 rounded">
              History
            </Link>
            {user ? (
              <>
                <div className="w-10 h-10 rounded-full bg-blue-800 flex items-center justify-center text-lg font-bold">
                  {user[0].toUpperCase()}
                </div>
                <button onClick={handleLogout} className="hover:bg-blue-700 px-4 py-2 rounded">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="hover:bg-blue-700 px-4 py-2 rounded">
                  Login
                </Link>
                <Link href="/signup" className="hover:bg-blue-700 px-4 py-2 rounded">
                  Signup
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
