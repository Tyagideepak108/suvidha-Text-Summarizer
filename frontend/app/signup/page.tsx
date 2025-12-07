'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { authService } from '@/services/authService';
import './auth.css';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await authService.signup(email, password);
      alert('Signup successful! Please login.');
      router.push('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h1 className="auth-title">Sign Up for Snap News</h1>
      
      <form onSubmit={handleSubmit} className="auth-form">
        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <div className="auth-field">
          <label className="auth-label">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-input"
            required
          />
        </div>

        <div className="auth-field">
          <label className="auth-label">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="auth-input"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="auth-submit"
        >
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>

        <p className="auth-footer">
          Already have an account?{' '}
          <a href="/login" className="auth-link">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
