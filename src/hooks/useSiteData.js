import { useState, useEffect } from 'react';

const API_URL = '/api/content';

export function useSiteData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(API_URL)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        console.warn('API fetch failed, using fallback:', err);
        // Fallback: try to load from a static JSON if available
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
}

export function useSiteSection(section) {
  const { data, loading, error } = useSiteData();
  
  return {
    data: data ? data[section] : null,
    loading,
    error
  };
}

// For static fallback (when API is not available)
export const fallbackData = null;