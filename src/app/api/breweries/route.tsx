// src/app/api/breweries/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://api.openbrewerydb.org/v1/breweries');
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch breweries' }, { status: 500 });
  }
}

// src/app/page.tsx
'use client';

import { useState, useEffect } from 'react';

interface Brewery {
  id: string;
  name: string;
  brewery_type: string;
  city: string;
  state: string;
  country: string;
}

export default function Home() {
  const [breweries, setBreweries] = useState<Brewery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBreweries = async () => {
      try {
        const response = await fetch('/api/breweries');
        const data = await response.json();
        setBreweries(data);
      } catch (error) {
        console.error('Error fetching breweries:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBreweries();
  }, []);

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-8">Brewery Finder</h1>
      {loading ? (
        <p>Loading breweries...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {breweries.map((brewery) => (
            <div
              key={brewery.id}
              className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2">{brewery.name}</h2>
              <p className="text-gray-600 capitalize mb-1">
                Type: {brewery.brewery_type}
              </p>
              <p className="text-gray-600">
                Location: {brewery.city}, {brewery.state}, {brewery.country}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}