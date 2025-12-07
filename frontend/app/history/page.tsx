'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { summaryService } from '@/services/summaryService';
import './history.css';

export default function History() {
  const [summaries, setSummaries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await summaryService.getSummaries();
        setSummaries(data.summaries);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load history');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [router]);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this summary?')) return;
    
    console.log('Deleting summary with ID:', id);
    setDeleting(id);
    try {
      const result = await summaryService.deleteSummary(id);
      console.log('Delete result:', result);
      setSummaries(summaries.filter(s => s.id !== id));
      alert('Summary deleted successfully!');
    } catch (err: any) {
      console.error('Delete error:', err);
      alert(err.response?.data?.message || 'Failed to delete summary');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="history-loading">
        <svg className="history-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="history-container">
      <h1 className="history-title">Summary History</h1>

      {error && (
        <div className="history-error">
          {error}
        </div>
      )}

      {summaries.length === 0 ? (
        <p className="history-empty">No summaries yet. Create your first summary!</p>
      ) : (
        <div className="history-list">
          {summaries.map((item) => (
            <div key={item.id} className="history-item">
              <div className="history-item-header">
                <div className="history-item-content">
                  <h3 className="history-item-label">Original Text</h3>
                  <p className="history-item-text">{item.Article.original_text}</p>
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  disabled={deleting === item.id}
                  className="history-delete-btn"
                >
                  {deleting === item.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
              <div className="history-item-summary">
                <h3 className="history-item-summary-label">Summary</h3>
                <p className="history-item-summary-text">{item.summary_text}</p>
              </div>
              <p className="history-item-date">
                {new Date(item.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
