import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import {
  getAdminStatsAPI,
  getAllUsersAPI,
  updateUserRoleAPI,
  deleteUserAPI,
} from '../../../api/admin.api.js';

export const useAdmin = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchData = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (search) params.search = search;

      const [usersRes, statsRes] = await Promise.all([
        getAllUsersAPI(params),
        getAdminStatsAPI(),
      ]);

      setUsers(usersRes.data.users);
      setPagination(usersRes.data.pagination);
      setStats(statsRes.data.stats);
    } catch {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateRole = async (id, role) => {
    try {
      const res = await updateUserRoleAPI(id, role);
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, role: res.data.user.role } : u))
      );
      toast.success('Role updated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update role');
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Are you sure? This will delete the user and all their data.')) return;
    try {
      await deleteUserAPI(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      setStats((prev) => prev ? { ...prev, totalUsers: prev.totalUsers - 1 } : prev);
      toast.success('User deleted');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  return {
    users, stats, pagination, loading,
    search, setSearch, updateRole, deleteUser,
    refetch: fetchData,
  };
};