'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { summaryService } from '@/services/summaryService';
import './summarize.css';

export default function Summarize() {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Token from localStorage:', token);
    if (!token) {
      console.log('No token found, redirecting to login');
      router.push('/login');
    }
  }, [router]);

  const pollJobStatus = async (jobId: string) => {
    const maxAttempts = 60;
    let attempts = 0;

    const poll = async () => {
      try {
        const status = await summaryService.getJobStatus(jobId);
        
        if (status.status === 'completed') {
          setSummary(status.result.summary_text);
          setLoading(false);
          return;
        }
        
        if (status.status === 'failed') {
          setError('Summary generation failed');
          setLoading(false);
          return;
        }
        
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 2000);
        } else {
          setError('Request timeout');
          setLoading(false);
        }
      } catch (err) {
        setError('Failed to check job status');
        setLoading(false);
      }
    };

    poll();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text.trim()) {
      setError('Please enter some text to summarize');
      return;
    }

    setLoading(true);
    setError('');
    setSummary('');

    try {
      console.log('Sending request to create summary...');
      const result = await summaryService.createSummary(text);
      console.log('Result:', result);
      
      if (result.summary) {
        setSummary(result.summary.summary_text);
      }
      setLoading(false);
    } catch (err: any) {
      console.error('Error creating summary:', err);
      console.error('Error response:', err.response);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to generate summary';
      setError(errorMsg);
      setLoading(false);
    }
  };

  return (
    <div className="summarize-container">
      <h1 className="summarize-title">Snap News Summarizer</h1>

      <form onSubmit={handleSubmit} className="summarize-form">
        <div>
          <label className="summarize-field-label">
            Enter Text to Summarize
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="summarize-textarea"
            placeholder="Paste your long text here..."
            disabled={loading}
          />
          <p className="summarize-char-count">
            {text.length} characters
          </p>
        </div>

        {error && (
          <div className="summarize-error">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !text.trim()}
          className="summarize-submit"
        >
          {loading ? (
            <>
              <svg
                className="summarize-spinner"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Generating Summary...
            </>
          ) : (
            'Summarize Text'
          )}
        </button>
      </form>

      {summary && (
        <div className="summarize-result">
          <h2 className="summarize-result-title">Summary</h2>
          <p className="summarize-result-text">{summary}</p>
        </div>
      )}
    </div>
  );
}
