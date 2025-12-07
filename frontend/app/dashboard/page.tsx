'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import './dashboard.css';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const handleOAuthToken = async () => {
      if (status === 'authenticated' && session?.user?.email) {
        const existingToken = localStorage.getItem('token');
        
        if (!existingToken) {
          // Fetch token from backend for OAuth users
          try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/oauth-login`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: session.user.email,
                name: session.user.name,
              }),
            });
            
            if (response.ok) {
              const data = await response.json();
              if (data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('userId', data.userId);
                localStorage.setItem('userEmail', session.user.email);
              }
            }
          } catch (error) {
            console.error('OAuth token fetch failed:', error);
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
    
    handleOAuthToken();
  }, [status, session, router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    signOut({ callbackUrl: '/login' });
  };

  if (status === 'loading' || !isAuthenticated) {
    return <div className="dashboard-loading">Loading...</div>;
  }

  const userEmail = session?.user?.email || localStorage.getItem('userEmail') || 'User';

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="dashboard-logout-btn"
        >
          Logout
        </button>
      </div>

      <div className="dashboard-card">
        <h2 className="dashboard-welcome">Welcome, {userEmail}!</h2>
        <p className="dashboard-auth-info">
          You are logged in via {session ? 'OAuth' : 'Email/Password'}
        </p>
        <div className="dashboard-feature">
          <h3 className="dashboard-feature-title">Snap News Summarizer</h3>
          <p className="dashboard-feature-desc">
            Start summarizing your text with AI-powered technology.
          </p>
          <a
            href="/summarize"
            className="dashboard-feature-btn"
          >
            Go to Summarizer
          </a>
        </div>
      </div>
    </div>
  );
}
