'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { summaryService } from '@/services/summaryService';

export default function Summarize() {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // Token check removed - NextAuth handles authentication

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
      const result = await summaryService.createSummary(text);
      
      if (result.summary) {
        setSummary(result.summary.summary_text);
      }
      setLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to generate summary');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Text Summarizer</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Input Text Area */}
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Enter Text to Summarize
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Paste your long text here..."
            disabled={loading}
          />
          <p className="text-sm text-gray-500 mt-2">
            {text.length} characters
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !text.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <>
              {/* Loading Spinner */}
              <svg
                className="animate-spin h-5 w-5 mr-3 text-white"
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

      {/* Summary Result */}
      {summary && (
        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-green-800 mb-4">Summary</h2>
          <p className="text-gray-700 leading-relaxed">{summary}</p>
        </div>
      )}
    </div>
  );
}
