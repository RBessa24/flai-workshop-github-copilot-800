import React, { useState, useEffect } from 'react';

function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });

  useEffect(() => {
    const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/activities/`;
    console.log('Fetching activities from:', apiUrl);

    fetch(apiUrl)
      .then(response => {
        console.log('Activities API Response Status:', response.status);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Activities API Response Data:', data);
        // Handle both paginated (.results) and plain array responses
        const activitiesData = data.results || data;
        console.log('Processed Activities Data:', activitiesData);
        setActivities(Array.isArray(activitiesData) ? activitiesData : []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching activities:', error);
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

  const getSortedActivities = () => {
    const sortedActivities = [...activities];
    sortedActivities.sort((a, b) => {
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
    return sortedActivities;
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) return ' ↕';
    return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
  };

  const getActivityIcon = (type) => {
    const icons = {
      'Running': '🏃',
      'Cycling': '🚴',
      'Swimming': '🏊',
      'Walking': '🚶',
      'Yoga': '🧘',
      'Gym': '🏋️',
      'default': '💪'
    };
    return icons[type] || icons['default'];
  };

  if (loading) return <div className="container mt-4"><div className="spinner-border text-success" role="status"><span className="visually-hidden">Loading...</span></div></div>;
  if (error) return <div className="container mt-4"><div className="alert alert-danger" role="alert"><strong>Error:</strong> {error}</div></div>;

  const sortedActivities = getSortedActivities();
  const totalCalories = sortedActivities.reduce((sum, a) => sum + (a.calories_burned || 0), 0);
  const totalPoints = sortedActivities.reduce((sum, a) => sum + (a.points_earned || 0), 0);
  const totalDistance = sortedActivities.reduce((sum, a) => sum + (a.distance || 0), 0);

  return (
    <div className="container mt-4">
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-success text-white">
          <h2 className="mb-0"><span className="me-2">⚡</span>Activity Tracker</h2>
        </div>

        <div className="card-body">
          <div className="row mb-4">
            <div className="col-md-3">
              <div className="card bg-light">
                <div className="card-body text-center">
                  <h6 className="text-muted">Total Activities</h6>
                  <h3 className="mb-0">{sortedActivities.length}</h3>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-danger text-white">
                <div className="card-body text-center">
                  <h6>Calories Burned</h6>
                  <h3 className="mb-0">{totalCalories.toLocaleString()}</h3>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-warning text-dark">
                <div className="card-body text-center">
                  <h6>Total Points</h6>
                  <h3 className="mb-0">{totalPoints.toLocaleString()}</h3>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-info text-white">
                <div className="card-body text-center">
                  <h6>Distance (km)</h6>
                  <h3 className="mb-0">{totalDistance.toFixed(2)}</h3>
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
                  <th style={{cursor: 'pointer'}} onClick={() => sortData('user_name')}>
                    User{getSortIcon('user_name')}
                  </th>
                  <th style={{cursor: 'pointer'}} onClick={() => sortData('activity_type')}>
                    Activity{getSortIcon('activity_type')}
                  </th>
                  <th style={{cursor: 'pointer'}} onClick={() => sortData('duration')}>
                    Duration (min){getSortIcon('duration')}
                  </th>
                  <th style={{cursor: 'pointer'}} onClick={() => sortData('distance')}>
                    Distance (km){getSortIcon('distance')}
                  </th>
                  <th style={{cursor: 'pointer'}} onClick={() => sortData('calories_burned')}>
                    Calories{getSortIcon('calories_burned')}
                  </th>
                  <th style={{cursor: 'pointer'}} onClick={() => sortData('points_earned')}>
                    Points{getSortIcon('points_earned')}
                  </th>
                  <th style={{cursor: 'pointer'}} onClick={() => sortData('date')}>
                    Date{getSortIcon('date')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedActivities.map(activity => (
                  <tr key={activity.id}>
                    <td><span className="badge bg-secondary">{activity.id}</span></td>
                    <td><strong>{activity.user_name}</strong></td>
                    <td>
                      <span className="me-1">{getActivityIcon(activity.activity_type)}</span>
                      {activity.activity_type}
                    </td>
                    <td><span className="badge bg-primary">{activity.duration} min</span></td>
                    <td>{activity.distance ? activity.distance.toFixed(2) : '0.00'}</td>
                    <td><span className="badge bg-danger">{activity.calories_burned} cal</span></td>
                    <td><span className="badge bg-warning text-dark">{activity.points_earned} pts</span></td>
                    <td>{activity.date ? new Date(activity.date).toLocaleDateString() : 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {sortedActivities.length === 0 && (
            <div className="alert alert-info text-center" role="alert">
              <strong>ℹ️ No activities found.</strong> Start tracking your workouts!
            </div>
          )}

          <div className="mt-3 text-muted small">
            <strong>Tip:</strong> Click column headers to sort by that metric
          </div>
        </div>
      </div>
    </div>
  );
}

export default Activities;
