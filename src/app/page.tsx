'use client';

import { useState, useEffect } from 'react';
import styles from '@/styles/Home.module.css';
import BreweryCard from './components/BreweryCard';
import { Brewery } from '@/types/brewery';

export default function Home() {
  const [breweries, setBreweries] = useState<Brewery[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('');

  useEffect(() => {
    const fetchBreweries = async () => {
      try {
        const response = await fetch('/api/breweries');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
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

  const states = [...new Set(breweries.map(brewery => brewery.state))].sort();

  const filteredBreweries = breweries.filter(brewery => {
    const matchesSearch = brewery.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         brewery.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesState = selectedState === '' || brewery.state === selectedState;
    return matchesSearch && matchesState;
  });

  const formatPhoneNumber = (phone: string) => {
    if (!phone) return 'N/A';
    return `(${phone.slice(0,3)}) ${phone.slice(3,6)}-${phone.slice(6)}`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            Brewery Explorer
          </h1>
          <p className={styles.subtitle}>
            Discover unique breweries across the United States
          </p>
          
          <div className={styles.searchContainer}>
            <div className={styles.searchRow}>
              <input
                type="text"
                placeholder="Search breweries or cities..."
                className={styles.searchInput}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                className={styles.stateSelect}
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
              >
                <option value="" className={styles.stateOption}>All States</option>
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
            
            <p className={styles.resultCount}>
              Found {filteredBreweries.length} breweries
            </p>
          </div>
        </div>

        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingText}>
              Loading amazing breweries...
            </div>
          </div>
        ) : (
          <div className={styles.breweriesGrid}>
            {filteredBreweries.map((brewery) => (
              <BreweryCard
                key={brewery.id}
                brewery={brewery}
                formatPhoneNumber={formatPhoneNumber}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}