import styles from '@/styles/Home.module.css';
import { ExternalLink } from 'lucide-react';
import { Brewery } from '@/types/brewery';

interface BreweryCardProps {
  brewery: Brewery;
  formatPhoneNumber: (phone: string) => string;
}

export default function BreweryCard({ brewery, formatPhoneNumber }: BreweryCardProps) {
  return (
    <div className={styles.breweryCard}>
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
              <ExternalLink className="ml-2 h-4 w-4" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}