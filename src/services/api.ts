import type { ScrapedData } from '../types';

// Base API URL - change this to match your backend server
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

/**
 * Fetch ads from the backend API
 */
export const fetchAds = async (
  page: number = 1,
  limit: number = 100,
  filters?: {
    advertiserName?: string;
    format?: string;
    platform?: string;
    region?: string;
  }
): Promise<{ items: ScrapedData; pagination: { current_page: number; page_size: number; total_items: number; total_pages: number } }> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (filters?.advertiserName) params.append('advertiser_name', filters.advertiserName);
  if (filters?.format) params.append('format_type', filters.format);
  if (filters?.platform) params.append('platform', filters.platform);
  if (filters?.region) params.append('region', filters.region);

  const response = await fetch(`${API_BASE_URL}/frontend/ads?${params}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch ads: ${response.statusText}`);
  }

  const result = await response.json();
  return result; // Return the full response which includes pagination data from the backend
};

/**
 * Fetch a single ad by ID
 */
export const fetchAdById = async (adId: string): Promise<ScrapedData[0]> => {
  const response = await fetch(`${API_BASE_URL}/frontend/ads/${adId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch ad: ${response.statusText}`);
  }
  return response.json();
};

/**
 * Fetch dashboard statistics
 */
export const fetchStats = async (): Promise<{ totalAds: number; uniqueCompanies: number; imageAds: number; videoAds: number }> => {
  const response = await fetch(`${API_BASE_URL}/frontend/stats`);
  if (!response.ok) {
    throw new Error(`Failed to fetch stats: ${response.statusText}`);
  }
  return response.json();
};