import { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import type {  AdRecord } from '../types';
import AdCard  from '../components/AdCard';
import { fetchAds, fetchStats } from '../services/api';
import debounce  from 'lodash.debounce';

export function Dashboard() {
  const [items, setItems] = useState<AdRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [formatFilter, setFormatFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [itemsPerPage] = useState<number>(12); // Fixed to 12 items per page
  const [stats, setStats] = useState({
    totalAds: 0,
    uniqueCompanies: 0,
    imageAds: 0,
    videoAds: 0
  });
  
  // Filter states
  const [lastActiveFilter, setLastActiveFilter] = useState<string>('all');
  const [runningSinceFilter, setRunningSinceFilter] = useState<string>('asc');
  const [companyFilter, setCompanyFilter] = useState<string>('all');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  
  const observer = useRef<IntersectionObserver | null>(null);
  const lastItemRef = useCallback((node: HTMLDivElement) => {
    if (loading || !hasMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setCurrentPage(prev => prev + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      setCurrentPage(1); // Reset to first page when searching
      setItems([]); // Clear current items
      setHasMore(true); // Reset has more flag
    }, 300),
    []
  );
  
  // Load ads data
  const loadAds = useCallback(async () => {
    // if (loading) return; // Don't load if already loading
    
    try {
      if (currentPage === 1) {
        setLoading(true); // Only show loading spinner for first page
      }
      
      const result = await fetchAds(currentPage, itemsPerPage, {
        advertiserName: searchQuery || undefined,
        format: formatFilter !== 'all' ? formatFilter : undefined,
      });
      
      if (Array.isArray(result)) {
        // For backward compatibility with array response
        if (currentPage === 1) {
          setItems(result);
        } else {
          setItems(prev => [...prev, ...result]);
        }
        // Assume there are more items if we got a full page
        setHasMore(result.length === itemsPerPage);
      } else if (result && result.items && result.pagination) {
        // Handle paginated response
        if (currentPage === 1) {
          setItems(result.items);
        } else {
          setItems(prev => [...prev, ...result.items]);
        }
        // Check if we have more items to load
        setHasMore(currentPage < result.pagination.total_pages);
      } else {
        throw new Error('Invalid API response format');
      }
      
      setError(null);
    } catch (err) {
      console.error('Error loading ads:', err);
      setError('Failed to load ads. Please try again later.');
    } finally {
      if (currentPage === 1) {
        setLoading(false);
      }
    }
  }, [currentPage, itemsPerPage, formatFilter, searchQuery, loading]);
  
  // Load stats data
  const loadStats = useCallback(async () => {
    try {
      const statsData = await fetchStats();
      setStats(statsData);
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  }, []);
  
  // Initial data loading and handling page changes
  useEffect(() => {
    loadAds();
  }, [loadAds]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // Reset and reload when filters change
  useEffect(() => {
    setCurrentPage(1);
    setItems([]);
    setHasMore(true);
  }, [searchQuery, formatFilter, companyFilter, platformFilter, lastActiveFilter, runningSinceFilter]);
  
  // Get unique companies for the filter
  const companies = useMemo(() => {
    if (!items || items.length === 0) return [];
    const uniqueCompanies = Array.from(new Set(items.map(item => item.advertiserName)));
    return uniqueCompanies.sort();
  }, [items]);
  
  // Function to reset all filters
  const resetFilters = useCallback(() => {
    setLastActiveFilter('all');
    setRunningSinceFilter('asc');
    setCompanyFilter('all');
    setFormatFilter('all');
    setPlatformFilter('all');
    setSearchQuery('');
    setCurrentPage(1);
  }, []);
  
  // Handle search query change with debouncing
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  }, [debouncedSearch]);
  
  
  
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="logo-wrapper">
          <img src="/itap.png" alt="iTAP" className="app-logo" />
          <div className="logo-title" aria-hidden>
            Ad Intelligence AI Agent
          </div>
        </div>
        <div className="header-stats">
          <div className="stat-card">
            <div className="stat-value">{stats.totalAds}</div>
            <div className="stat-label">Total Ads</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.uniqueCompanies}</div>
            <div className="stat-label">Companies</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.imageAds}</div>
            <div className="stat-label">Image Ads</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.videoAds}</div>
            <div className="stat-label">Video Ads</div>
          </div>
        </div>
      </header>
      
      <div className="toolbar">
        <div className="control">
          <label className="control-label">Search</label>
          <input
            type="text"
            placeholder="Search by advertiser name..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>
        
        <div className="control">
          <label className="control-label">Format</label>
          <select
            value={formatFilter}
            onChange={(e) => setFormatFilter(e.target.value)}
            className="select"
          >
            <option value="all">All Formats</option>
            <option value="Image">Image</option>
            <option value="Video">Video</option>
          </select>
        </div>
        
        <div className="control">
          <label className="control-label">Company</label>
          <select
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
            className="select"
          >
            <option value="all">All Companies</option>
            {companies.map(company => (
              <option key={company} value={company}>{company}</option>
            ))}
          </select>
        </div>
        
        <div className="control">
          <label className="control-label">Platform</label>
          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            className="select"
          >
            <option value="all">All Platforms</option>
            <option value="FACEBOOK">Facebook</option>
            <option value="INSTAGRAM">Instagram</option>
            <option value="MESSENGER">Messenger</option>
            <option value="AUDIENCE_NETWORK">Audience Network</option>
          </select>
        </div>
        
        <div className="control">
          <label className="control-label">&nbsp;</label>
          <button className="reset-filters-button" onClick={resetFilters}>
            Reset Filters
          </button>
        </div>
      </div>
      
      {loading && items.length === 0 ? (
        <div className="loading-state">
          <div className="loading-icon">⏳</div>
          <p>Loading ads...</p>
        </div>
      ) : error ? (
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h3>Error loading ads</h3>
          <p>{error}</p>
          <button className="retry-button" onClick={loadAds}>
            Retry
          </button>
        </div>
      ) : items.length > 0 ? (
        <>
          <div className="results-info">
            <span>Showing {items.length} ads</span>
          </div>
          <div className="grid">
            {items.map((ad, idx) => {
              if (items.length === idx + 1) {
                // If this is the last item, attach the ref for infinite scroll
                return <div ref={lastItemRef} key={`${ad.apiData.creativeId}-${idx}`}><AdCard ad={ad} /></div>;
              } else {
                return <AdCard key={`${ad.apiData.creativeId}-${idx}`} ad={ad} />;
              }
            })}
          </div>
          {loading && items.length > 0 && (
            <div className="loading">
              <div className="loading-spinner"></div>
              <span>Loading more ads...</span>
            </div>
          )}
        </>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <h3>No ads found</h3>
          <p>Try adjusting your filters to find what you're looking for</p>
          <button className="reset-filters-button" onClick={resetFilters}>
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}

export default Dashboard;