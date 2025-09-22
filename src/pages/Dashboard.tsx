import data from '../assets/scraped-data.json';
import type { ScrapedData, AdRecord } from '../types';
import { AdCard } from '../components/AdCard';

const scrapedData = data as ScrapedData;

export function Dashboard() {
  // Basic safety: filter for items with minimal required fields
  const items: AdRecord[] = scrapedData.filter((d) => !!d.advertiserName && !!d.format && !!d.lastSeenDate && !!d.firstSeenDate) as AdRecord[];

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>iTap POC</h1>
      </header>
      <div className="grid">
        {items.slice(0, 50).map((ad, idx) => (
          <AdCard key={`${ad.apiData.creativeId}-${idx}`} ad={ad} />
        ))}
      </div>
    </div>
  );
}

export default Dashboard;


