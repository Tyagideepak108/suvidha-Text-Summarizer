'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchOAuthToken = async () => {
      if (status === 'authenticated' && session?.user?.email) {
        const existingToken = localStorage.getItem('token');
        if (!existingToken) {
          try {
            const response = await fetch('http://localhost:3002/auth/oauth-login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: session.user.email,
                name: session.user.name
              })
            });
            
            const data = await response.json();
            if (data.token) {
              localStorage.setItem('token', data.token);
              localStorage.setItem('userId', data.userId);
              localStorage.setItem('userEmail', session.user.email);
            }
          } catch (error) {
            console.error('OAuth token fetch error:', error);
          }
        }
        setIsAuthenticated(true);
      } else {
        const token = localStorage.getItem('token');
        if (token) {
          setIsAuthenticated(true);
        } else if (status === 'unauthenticated') {
          router.push('/login');
        }
      }
    };
    
    fetchOAuthToken();
  }, [status, session, router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    signOut({ callbackUrl: '/login' });
  };

  if (status === 'loading' || !isAuthenticated) {
    return <div className="text-center mt-16">Loading...</div>;
  }

  const userEmail = session?.user?.email || localStorage.getItem('userId') || 'User';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <div className="bg-white shadow-md rounded p-6">
        <h2 className="text-xl font-bold mb-4">Welcome, {userEmail}!</h2>
        <p className="text-gray-600 mb-4">
          You are logged in via {session ? 'OAuth' : 'Email/Password'}
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded p-4">
          <h3 className="font-bold mb-2">Text Summarizer</h3>
          <p className="text-gray-600 mb-4">
            Start summarizing your text with AI-powered technology.
          </p>
          <a
            href="/summarize"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
          >
            Go to Summarizer
          </a>
        </div>
      </div>
    </div>
  );
}
