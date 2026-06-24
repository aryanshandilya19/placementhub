export const recalculateStats = (problems) => {
  const solved = problems.filter((p) => p.status === 'done');

  const stats = {
    totalSolved: solved.length,
    easySolved: solved.filter((p) => p.difficulty === 'easy').length,
    mediumSolved: solved.filter((p) => p.difficulty === 'medium').length,
    hardSolved: solved.filter((p) => p.difficulty === 'hard').length,
    streak: 0,
    lastSolvedAt: solved.length > 0
      ? new Date(Math.max(...solved.map((p) => new Date(p.solvedAt || p.updatedAt))))
      : null,
  };

  // Calculate streak — consecutive days with at least one problem solved
  if (solved.length > 0) {
    const solvedDates = [
      ...new Set(
        solved.map((p) =>
          new Date(p.solvedAt || p.updatedAt).toISOString().split('T')[0]
        )
      ),
    ].sort((a, b) => new Date(b) - new Date(a));

    let streak = 1;
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    if (solvedDates[0] !== today && solvedDates[0] !== yesterday) {
      stats.streak = 0;
    } else {
      for (let i = 0; i < solvedDates.length - 1; i++) {
        const curr = new Date(solvedDates[i]);
        const next = new Date(solvedDates[i + 1]);
        const diff = (curr - next) / 86400000;
        if (diff === 1) streak++;
        else break;
      }
      stats.streak = streak;
    }
  }

  return stats;
};