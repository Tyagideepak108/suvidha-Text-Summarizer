'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { summaryService } from '@/services/summaryService';

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
      <div className="max-w-6xl mx-auto px-4 py-8 flex justify-center">
        <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Summary History</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {summaries.length === 0 ? (
        <p className="text-gray-500">No summaries yet. Create your first summary!</p>
      ) : (
        <div className="space-y-4">
          {summaries.map((item) => (
            <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-500 mb-2">Original Text</h3>
                  <p className="text-gray-700">{item.Article.original_text}</p>
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  disabled={deleting === item.id}
                  className="ml-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                  {deleting === item.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-green-600 mb-2">Summary</h3>
                <p className="text-gray-800">{item.summary_text}</p>
              </div>
              <p className="text-xs text-gray-400 mt-4">
                {new Date(item.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
