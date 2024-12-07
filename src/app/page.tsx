'use client';

import { useState, useEffect } from 'react';
import styles from '@/styles/Home.module.css';

interface Brewery {
  id: string;
  name: string;
  brewery_type: string;
  city: string;
  state: string;
  country: string;
  website_url: string | null;
  address_1: string;
  phone: string;
}

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
              <div key={brewery.id} className={styles.breweryCard}>
              <div className={styles.cardContent}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.breweryName}>
                    {brewery.name}
                  </h2>
                  <span className={styles.breweryType}>
                    {brewery.brewery_type}
                  </span>
                </div>
                  
                  <div className={styles.infoContainer}>
                    <p className={styles.infoText}>
                      <span className={styles.infoLabel}>Location:</span><br/>
                      {brewery.address_1}<br/>
                      {brewery.city}, {brewery.state}<br/>
                      {brewery.country}
                    </p>
                    
                    <p className={styles.infoText}>
                      <span className={styles.infoLabel}>Phone:</span><br/>
                      {formatPhoneNumber(brewery.phone)}
                    </p>

                    {brewery.website_url && (
                      <a
                        href={brewery.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.websiteButton}
                      >
                        Visit Website
                        <svg className={styles.websiteIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}