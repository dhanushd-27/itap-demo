import { useMemo, useState } from 'react';
import data from '../assets/scraped-data.json';
import type { ScrapedData, AdRecord } from '../types';
import { AdCard } from '../components/AdCard';
import Filters from '../components/Filters';
import { computeActiveDays } from '../utils/dates';

const scrapedData = data as ScrapedData;

export function Dashboard() {
  // Basic safety: filter for items with minimal required fields
  const items: AdRecord[] = scrapedData.filter((d) => !!d.advertiserName && !!d.format && !!d.lastSeenDate && !!d.firstSeenDate) as AdRecord[];

  const [minActiveFilter, setMinActiveFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const filteredAndSorted = useMemo(() => {
    let list = items.slice();

    // Filter by active duration bucket
    if (minActiveFilter !== 'all') {
      list = list.filter((ad) => {
        const days = computeActiveDays(ad.firstSeenDate, ad.lastSeenDate);
        if (minActiveFilter === 'lt7') return days < 7;
        if (minActiveFilter === '7to29') return days >= 7 && days < 30;
        if (minActiveFilter === 'gte30') return days >= 30;
        return true;
      });
    }

    // Sort by last seen date
    list.sort((a, b) => {
      const da = new Date(a.lastSeenDate).getTime();
      const db = new Date(b.lastSeenDate).getTime();
      return sortOrder === 'asc' ? da - db : db - da;
    });

    return list;
  }, [items, minActiveFilter, sortOrder]);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>iTap POC</h1>
      </header>
      <Filters
        minActiveFilter={minActiveFilter}
        sortOrder={sortOrder}
        onChangeMinActiveFilter={setMinActiveFilter}
        onChangeSortOrder={(v) => setSortOrder(v)}
      />
      <div className="grid">
        {filteredAndSorted.slice(0, 50).map((ad, idx) => (
          <AdCard key={`${ad.apiData.creativeId}-${idx}`} ad={ad} />
        ))}
      </div>
    </div>
  );
}

export default Dashboard;


