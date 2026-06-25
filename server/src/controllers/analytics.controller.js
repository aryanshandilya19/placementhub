import Application from '../models/Application.model.js';
import DSAProgress from '../models/DSAProgress.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getDashboardAnalytics = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Run all queries in parallel for performance
  const [applications, dsaProgress] = await Promise.all([
    Application.find({ userId }).sort('appliedDate'),
    DSAProgress.findOne({ userId }),
  ]);

  // ── Application stats ──────────────────────────────────────────
  const appStatusCounts = {
    applied: 0, oa: 0, interview: 0,
    offer: 0, rejected: 0, ghosted: 0,
  };
  applications.forEach(({ status }) => {
    if (appStatusCounts[status] !== undefined) appStatusCounts[status]++;
  });

  // Applications per month (last 6 months)
  const monthlyMap = {};
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = d.toLocaleString('default', { month: 'short', year: '2-digit' });
    monthlyMap[key] = 0;
  }
  applications.forEach(({ appliedDate }) => {
    const d = new Date(appliedDate);
    const key = d.toLocaleString('default', { month: 'short', year: '2-digit' });
    if (monthlyMap[key] !== undefined) monthlyMap[key]++;
  });
  const monthlyData = Object.entries(monthlyMap).map(([month, count]) => ({ month, count }));

  // Offer rate
  const totalApps = applications.length;
  const offerRate = totalApps > 0
    ? Math.round((appStatusCounts.offer / totalApps) * 100)
    : 0;

  // ── DSA stats ──────────────────────────────────────────────────
  const dsaStats = dsaProgress?.stats || {
    totalSolved: 0, easySolved: 0,
    mediumSolved: 0, hardSolved: 0, streak: 0,
  };

  const dsaDifficultyData = [
    { name: 'Easy', value: dsaStats.easySolved, color: '#15803d' },
    { name: 'Medium', value: dsaStats.mediumSolved, color: '#854d0e' },
    { name: 'Hard', value: dsaStats.hardSolved, color: '#dc2626' },
  ];

  // Tag frequency (top 8)
  const tagMap = {};
  dsaProgress?.problems?.forEach(({ tags, status }) => {
    if (status === 'done') {
      tags?.forEach((tag) => {
        tagMap[tag] = (tagMap[tag] || 0) + 1;
      });
    }
  });
  const topTags = Object.entries(tagMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([tag, count]) => ({ tag, count }));

  return res.status(200).json(new ApiResponse(200, {
    applications: {
      total: totalApps,
      statusCounts: appStatusCounts,
      monthlyData,
      offerRate,
    },
    dsa: {
      stats: dsaStats,
      difficultyData: dsaDifficultyData,
      topTags,
    },
  }, 'Analytics fetched'));
});