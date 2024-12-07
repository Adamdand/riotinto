// src/app/page.tsx
'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/hello`);
        const data = await response.json();
        setMessage(data.message);
      } catch (error) {
        console.error('Error fetching message:', error);
        setMessage('Error loading message');
      } finally {
        setLoading(false);
      }
    };

    fetchMessage();
  }, []);

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-8">Next.js + Flask Demo</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="p-4 bg-white rounded-lg shadow">
          <p className="text-xl">{message}</p>
        </div>
      )}
    </main>
  );
}