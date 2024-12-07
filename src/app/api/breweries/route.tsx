import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://api.openbrewerydb.org/v1/breweries');
    if (!response.ok) {
      throw new Error(`Brewery API error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('API Route Error:', error);
    return NextResponse.json({ error: 'Failed to fetch breweries', details: (error as Error).message }, { status: 500 });
  }
}