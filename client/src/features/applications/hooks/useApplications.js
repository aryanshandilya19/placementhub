import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import {
  getApplicationsAPI,
  createApplicationAPI,
  updateApplicationAPI,
  deleteApplicationAPI,
  getStatsAPI,
} from '../../../api/application.api.js';

export const useApplications = () => {
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: '', search: '' });

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter.status) params.status = filter.status;
      if (filter.search) params.search = filter.search;

      const [appsRes, statsRes] = await Promise.all([
        getApplicationsAPI(params),
        getStatsAPI(),
      ]);
      setApplications(appsRes.data.applications);
      setStats(statsRes.data.stats);
    } catch (error) {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const createApplication = async (data) => {
    try {
      const res = await createApplicationAPI(data);
      setApplications((prev) => [res.data.application, ...prev]);
      toast.success('Application added');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add application');
      return false;
    }
  };

  const updateApplication = async (id, data) => {
    try {
      const res = await updateApplicationAPI(id, data);
      setApplications((prev) =>
        prev.map((app) => (app._id === id ? res.data.application : app))
      );
      toast.success('Application updated');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update');
      return false;
    }
  };

  const deleteApplication = async (id) => {
    try {
      await deleteApplicationAPI(id);
      setApplications((prev) => prev.filter((app) => app._id !== id));
      toast.success('Application deleted');
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  return {
    applications, stats, loading, filter,
    setFilter, createApplication, updateApplication,
    deleteApplication, refetch: fetchApplications,
  };
};