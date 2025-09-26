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

  // Get unique companies for the filter
  const companies = useMemo(() => {
    const uniqueCompanies = Array.from(new Set(items.map(item => item.advertiserName)));
    return uniqueCompanies.sort();
  }, [items]);

  // Filter states
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc'); // Default to recent first
  const [lastActiveFilter, setLastActiveFilter] = useState<string>('all');
  const [runningSinceFilter, setRunningSinceFilter] = useState<string>('all');
  const [companyFilter, setCompanyFilter] = useState<string>('all');
  const [formatFilter, setFormatFilter] = useState<string>('Image'); // Default to Image

  const filteredAndSorted = useMemo(() => {
    let list = items.slice();

    // Filter by format
    if (formatFilter !== 'all') {
      list = list.filter((ad) => ad.format === formatFilter);
    }

    // Filter by company
    if (companyFilter !== 'all') {
      list = list.filter((ad) => ad.advertiserName === companyFilter);
    }

    // Filter by running since (campaign duration)
    if (runningSinceFilter !== 'all') {
      list = list.filter((ad) => {
        const days = computeActiveDays(ad.firstSeenDate, ad.lastSeenDate);
        if (runningSinceFilter === 'lt7') return days < 7;
        if (runningSinceFilter === '7to29') return days >= 7 && days < 30;
        if (runningSinceFilter === 'gte30') return days >= 30;
        if (runningSinceFilter === 'gte90') return days >= 90;
        if (runningSinceFilter === 'gte365') return days >= 365;
        return true;
      });
    }

    // Filter by last active
    if (lastActiveFilter !== 'all') {
      const now = new Date();
      list = list.filter((ad) => {
        const lastSeenDate = new Date(ad.lastSeenDate);
        if (lastActiveFilter === 'today') {
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          return lastSeenDate >= today;
        }
        if (lastActiveFilter === 'week') {
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return lastSeenDate >= weekAgo;
        }
        if (lastActiveFilter === 'month') {
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          return lastSeenDate >= monthAgo;
        }
        if (lastActiveFilter === 'quarter') {
          const quarterAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          return lastSeenDate >= quarterAgo;
        }
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
  }, [items, formatFilter, companyFilter, runningSinceFilter, lastActiveFilter, sortOrder]);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <img src="/itap.png" alt="iTAP" className="app-logo" />
      </div>
      <Filters
        sortOrder={sortOrder}
        onChangeSortOrder={setSortOrder}
        lastActiveFilter={lastActiveFilter}
        onChangeLastActiveFilter={setLastActiveFilter}
        runningSinceFilter={runningSinceFilter}
        onChangeRunningSinceFilter={setRunningSinceFilter}
        companyFilter={companyFilter}
        onChangeCompanyFilter={setCompanyFilter}
        companies={companies}
        formatFilter={formatFilter}
        onChangeFormatFilter={setFormatFilter}
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


