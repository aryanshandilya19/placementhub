import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getDSAAPI, addProblemAPI, updateProblemAPI, deleteProblemAPI } from '../../../api/dsa.api.js';

export const useDSA = () => {
  const [problems, setProblems] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ difficulty: '', status: '', search: '' });

  useEffect(() => {
    const fetchDSA = async () => {
      try {
        const res = await getDSAAPI();
        setProblems(res.data.progress.problems);
        setStats(res.data.progress.stats);
      } catch {
        toast.error('Failed to load DSA progress');
      } finally {
        setLoading(false);
      }
    };
    fetchDSA();
  }, []);

  const filteredProblems = problems.filter((p) => {
    if (filter.difficulty && p.difficulty !== filter.difficulty) return false;
    if (filter.status && p.status !== filter.status) return false;
    if (filter.search && !p.title.toLowerCase().includes(filter.search.toLowerCase())) return false;
    return true;
  });

  const addProblem = async (data) => {
    try {
      const res = await addProblemAPI(data);
      setProblems((prev) => [res.data.problem, ...prev]);
      setStats(res.data.stats);
      toast.success('Problem added');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add problem');
      return false;
    }
  };

  const updateProblem = async (problemId, data) => {
    try {
      const res = await updateProblemAPI(problemId, data);
      setProblems((prev) => prev.map((p) => (p._id === problemId ? res.data.problem : p)));
      setStats(res.data.stats);
      toast.success('Problem updated');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update problem');
      return false;
    }
  };

  const deleteProblem = async (problemId) => {
    try {
      await deleteProblemAPI(problemId);
      setProblems((prev) => prev.filter((p) => p._id !== problemId));
      toast.success('Problem deleted');
    } catch {
      toast.error('Failed to delete problem');
    }
  };

  return {
    problems: filteredProblems,
    allProblems: problems,
    stats, loading, filter, setFilter,
    addProblem, updateProblem, deleteProblem,
  };
};