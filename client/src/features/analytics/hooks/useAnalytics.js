import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getDashboardAnalyticsAPI } from '../../../api/analytics.api.js';

export const useAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getDashboardAnalyticsAPI();
        setData(res.data);
      } catch {
        toast.error('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return { data, loading };
};