import React, { useState, useEffect } from 'react';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'total_points', direction: 'desc' });

  useEffect(() => {
    const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/leaderboard/`;
    console.log('Fetching leaderboard from:', apiUrl);

    fetch(apiUrl)
      .then(response => {
        console.log('Leaderboard API Response Status:', response.status);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Leaderboard API Response Data:', data);
        // Handle both paginated (.results) and plain array responses
        const leaderboardData = data.results || data;
        console.log('Processed Leaderboard Data:', leaderboardData);
        setLeaderboard(Array.isArray(leaderboardData) ? leaderboardData : []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching leaderboard:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const sortData = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortedLeaderboard = () => {
    const sortedLeaderboard = [...leaderboard];
    sortedLeaderboard.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];
      
      if (aValue === null || aValue === undefined) aValue = '';
      if (bValue === null || bValue === undefined) bValue = '';
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sortedLeaderboard;
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) return ' ↕';
    return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
  };

  const getRankBadge = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getRankClass = (rank) => {
    if (rank === 1) return 'table-warning';
    if (rank === 2) return 'table-secondary';
    if (rank === 3) return 'table-info';
    return '';
  };

  if (loading) return <div className="container mt-4"><div className="spinner-border text-warning" role="status"><span className="visually-hidden">Loading...</span></div></div>;
  if (error) return <div className="container mt-4"><div className="alert alert-danger" role="alert"><strong>Error:</strong> {error}</div></div>;

  const sortedLeaderboard = getSortedLeaderboard();
  const totalPoints = sortedLeaderboard.reduce((sum, e) => sum + (e.total_points || 0), 0);
  const avgPoints = sortedLeaderboard.length > 0 ? (totalPoints / sortedLeaderboard.length).toFixed(0) : 0;

  return (
    <div className="container mt-4">
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-warning">
          <h2 className="mb-0"><span className="me-2">🏅</span>Leaderboard Rankings</h2>
        </div>

        <div className="card-body">
          <div className="row mb-4">
            <div className="col-md-4">
              <div className="card bg-light">
                <div className="card-body text-center">
                  <h6 className="text-muted">Total Athletes</h6>
                  <h3 className="mb-0 text-warning">{sortedLeaderboard.length}</h3>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card bg-success text-white">
                <div className="card-body text-center">
                  <h6>Total Points</h6>
                  <h3 className="mb-0">{totalPoints.toLocaleString()}</h3>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card bg-primary text-white">
                <div className="card-body text-center">
                  <h6>Average Points</h6>
                  <h3 className="mb-0">{avgPoints}</h3>
                </div>
              </div>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th style={{cursor: 'pointer'}} onClick={() => sortData('rank')}>
                    Rank{getSortIcon('rank')}
                  </th>
                  <th style={{cursor: 'pointer'}} onClick={() => sortData('user_name')}>
                    User{getSortIcon('user_name')}
                  </th>
                  <th style={{cursor: 'pointer'}} onClick={() => sortData('user_email')}>
                    Email{getSortIcon('user_email')}
                  </th>
                  <th style={{cursor: 'pointer'}} onClick={() => sortData('team')}>
                    Team{getSortIcon('team')}
                  </th>
                  <th style={{cursor: 'pointer'}} onClick={() => sortData('total_points')}>
                    Total Points{getSortIcon('total_points')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedLeaderboard.map((entry, index) => {
                  const rank = entry.rank || index + 1;
                  return (
                    <tr key={entry.user_email || index} className={getRankClass(rank)}>
                      <td>
                        <span className="badge bg-dark fs-5">{getRankBadge(rank)}</span>
                      </td>
                      <td><strong className="fs-6">{entry.user_name}</strong></td>
                      <td className="text-muted">{entry.user_email}</td>
                      <td>
                        {entry.team ? (
                          <span className="badge bg-info">{entry.team}</span>
                        ) : (
                          <span className="text-muted">No team</span>
                        )}
                      </td>
                      <td>
                        <span className="badge bg-success fs-6">{entry.total_points.toLocaleString()} pts</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {sortedLeaderboard.length === 0 && (
            <div className="alert alert-info text-center" role="alert">
              <strong>ℹ️ No leaderboard data found.</strong> Complete activities to earn points!
            </div>
          )}

          <div className="mt-3 text-muted small">
            <strong>Tip:</strong> Top 3 positions are highlighted | Click column headers to sort
          </div>
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;
