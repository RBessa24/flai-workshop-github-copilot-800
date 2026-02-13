import React, { useState, useEffect } from 'react';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'total_points', direction: 'desc' });

  useEffect(() => {
    const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/teams/`;
    console.log('Fetching teams from:', apiUrl);

    fetch(apiUrl)
      .then(response => {
        console.log('Teams API Response Status:', response.status);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Teams API Response Data:', data);
        // Handle both paginated (.results) and plain array responses
        const teamsData = data.results || data;
        console.log('Processed Teams Data:', teamsData);
        setTeams(Array.isArray(teamsData) ? teamsData : []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching teams:', error);
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

  const getSortedTeams = () => {
    const sortedTeams = [...teams];
    sortedTeams.sort((a, b) => {
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
    return sortedTeams;
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) return ' ↕';
    return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
  };

  if (loading) return <div className="container mt-4"><div className="spinner-border text-info" role="status"><span className="visually-hidden">Loading...</span></div></div>;
  if (error) return <div className="container mt-4"><div className="alert alert-danger" role="alert"><strong>Error:</strong> {error}</div></div>;

  const sortedTeams = getSortedTeams();
  const totalMembers = sortedTeams.reduce((sum, t) => sum + (t.member_count || 0), 0);
  const totalPoints = sortedTeams.reduce((sum, t) => sum + (t.total_points || 0), 0);

  return (
    <div className="container mt-4">
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-info text-white">
          <h2 className="mb-0"><span className="me-2">🏆</span>Team Competition</h2>
        </div>

        <div className="card-body">
          <div className="row mb-4">
            <div className="col-md-4">
              <div className="card bg-light">
                <div className="card-body text-center">
                  <h6 className="text-muted">Total Teams</h6>
                  <h3 className="mb-0 text-info">{sortedTeams.length}</h3>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card bg-primary text-white">
                <div className="card-body text-center">
                  <h6>Total Members</h6>
                  <h3 className="mb-0">{totalMembers}</h3>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card bg-success text-white">
                <div className="card-body text-center">
                  <h6>Combined Points</h6>
                  <h3 className="mb-0">{totalPoints.toLocaleString()}</h3>
                </div>
              </div>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th style={{cursor: 'pointer'}} onClick={() => sortData('id')}>
                    ID{getSortIcon('id')}
                  </th>
                  <th style={{cursor: 'pointer'}} onClick={() => sortData('name')}>
                    Team Name{getSortIcon('name')}
                  </th>
                  <th style={{cursor: 'pointer'}} onClick={() => sortData('description')}>
                    Description{getSortIcon('description')}
                  </th>
                  <th style={{cursor: 'pointer'}} onClick={() => sortData('total_points')}>
                    Total Points{getSortIcon('total_points')}
                  </th>
                  <th style={{cursor: 'pointer'}} onClick={() => sortData('member_count')}>
                    Members{getSortIcon('member_count')}
                  </th>
                  <th style={{cursor: 'pointer'}} onClick={() => sortData('created_at')}>
                    Created{getSortIcon('created_at')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedTeams.map((team, index) => (
                  <tr key={team.id}>
                    <td><span className="badge bg-secondary">{team.id}</span></td>
                    <td>
                      <strong className="text-primary">
                        {index < 3 && sortConfig.key === 'total_points' && sortConfig.direction === 'desc' && (
                          <span className="me-2">{['🥇', '🥈', '🥉'][index]}</span>
                        )}
                        {team.name}
                      </strong>
                    </td>
                    <td className="text-muted">{team.description || 'No description'}</td>
                    <td>
                      <span className="badge bg-success fs-6">{team.total_points.toLocaleString()} pts</span>
                    </td>
                    <td>
                      <span className="badge bg-primary">{team.member_count} 
                        <span className="ms-1">👥</span>
                      </span>
                    </td>
                    <td>{team.created_at ? new Date(team.created_at).toLocaleDateString() : 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {sortedTeams.length === 0 && (
            <div className="alert alert-info text-center" role="alert">
              <strong>ℹ️ No teams found.</strong> Create teams to start competing!
            </div>
          )}

          <div className="mt-3 text-muted small">
            <strong>Tip:</strong> Click column headers to sort | Top 3 teams get medals when sorted by points
          </div>
        </div>
      </div>
    </div>
  );
}

export default Teams;
