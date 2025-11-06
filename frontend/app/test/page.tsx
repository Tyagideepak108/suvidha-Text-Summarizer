'use client';

export default function TestPage() {
  const setTestUser = () => {
    localStorage.setItem('token', 'test-token-123');
    localStorage.setItem('userEmail', 'test@example.com');
    alert('Test user set! Refresh page to see avatar.');
    window.location.reload();
  };

  const clearUser = () => {
    localStorage.clear();
    alert('LocalStorage cleared! Refresh page.');
    window.location.reload();
  };

  return (
    <div className="max-w-2xl mx-auto mt-16 px-4">
      <h1 className="text-3xl font-bold mb-8">Test Avatar Icon</h1>
      
      <div className="space-y-4">
        <button
          onClick={setTestUser}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded w-full"
        >
          Set Test User (test@example.com)
        </button>

        <button
          onClick={clearUser}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded w-full"
        >
          Clear LocalStorage
        </button>

        <div className="mt-8 p-4 bg-gray-100 rounded">
          <h2 className="font-bold mb-2">Current LocalStorage:</h2>
          <pre className="text-sm">
            Token: {typeof window !== 'undefined' ? localStorage.getItem('token') : 'N/A'}<br/>
            Email: {typeof window !== 'undefined' ? localStorage.getItem('userEmail') : 'N/A'}
          </pre>
        </div>
      </div>
    </div>
  );
}
