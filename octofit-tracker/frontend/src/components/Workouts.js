import React, { useState, useEffect } from 'react';

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'difficulty', direction: 'asc' });
  const [filterDifficulty, setFilterDifficulty] = useState('All');

  useEffect(() => {
    const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/workouts/`;
    console.log('Fetching workouts from:', apiUrl);

    fetch(apiUrl)
      .then(response => {
        console.log('Workouts API Response Status:', response.status);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Workouts API Response Data:', data);
        // Handle both paginated (.results) and plain array responses
        const workoutsData = data.results || data;
        console.log('Processed Workouts Data:', workoutsData);
        setWorkouts(Array.isArray(workoutsData) ? workoutsData : []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching workouts:', error);
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

  const getSortedAndFilteredWorkouts = () => {
    let filteredWorkouts = [...workouts];
    
    if (filterDifficulty !== 'All') {
      filteredWorkouts = filteredWorkouts.filter(w => w.difficulty === filterDifficulty);
    }
    
    filteredWorkouts.sort((a, b) => {
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
    return filteredWorkouts;
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) return ' ↕';
    return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
  };

  const getDifficultyBadge = (difficulty) => {
    const badges = {
      'Beginner': 'success',
      'Intermediate': 'warning',
      'Advanced': 'danger',
      'Easy': 'success',
      'Medium': 'warning',
      'Hard': 'danger'
    };
    return badges[difficulty] || 'secondary';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Cardio': '❤️',
      'Strength': '💪',
      'Flexibility': '🧘',
      'HIIT': '⚡',
      'Yoga': '🕉️',
      'default': '🏋️'
    };
    return icons[category] || icons['default'];
  };

  if (loading) return <div className="container mt-4"><div className="spinner-border text-danger" role="status"><span className="visually-hidden">Loading...</span></div></div>;
  if (error) return <div className="container mt-4"><div className="alert alert-danger" role="alert"><strong>Error:</strong> {error}</div></div>;

  const sortedFilteredWorkouts = getSortedAndFilteredWorkouts();
  const difficulties = ['All', ...new Set(workouts.map(w => w.difficulty))];
  const avgDuration = sortedFilteredWorkouts.length > 0 
    ? (sortedFilteredWorkouts.reduce((sum, w) => sum + (w.duration || 0), 0) / sortedFilteredWorkouts.length).toFixed(0) 
    : 0;

  return (
    <div className="container mt-4">
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-danger text-white">
          <h2 className="mb-0"><span className="me-2">💪</span>Workout Library</h2>
        </div>

        <div className="card-body">
          <div className="row mb-4">
            <div className="col-md-4">
              <div className="card bg-light">
                <div className="card-body text-center">
                  <h6 className="text-muted">Total Workouts</h6>
                  <h3 className="mb-0 text-danger">{workouts.length}</h3>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card bg-primary text-white">
                <div className="card-body text-center">
                  <h6>Showing</h6>
                  <h3 className="mb-0">{sortedFilteredWorkouts.length}</h3>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card bg-warning text-dark">
                <div className="card-body text-center">
                  <h6>Avg Duration</h6>
                  <h3 className="mb-0">{avgDuration} min</h3>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Filter by Difficulty:</label>
            <div className="btn-group" role="group">
              {difficulties.map(diff => (
                <button
                  key={diff}
                  type="button"
                  className={`btn btn-sm ${filterDifficulty === diff ? 'btn-danger' : 'btn-outline-danger'}`}
                  onClick={() => setFilterDifficulty(diff)}
                >
                  {diff}
                </button>
              ))}
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
                    Workout Name{getSortIcon('name')}
                  </th>
                  <th style={{cursor: 'pointer'}} onClick={() => sortData('category')}>
                    Category{getSortIcon('category')}
                  </th>
                  <th style={{cursor: 'pointer'}} onClick={() => sortData('difficulty')}>
                    Difficulty{getSortIcon('difficulty')}
                  </th>
                  <th style={{cursor: 'pointer'}} onClick={() => sortData('duration')}>
                    Duration (min){getSortIcon('duration')}
                  </th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {sortedFilteredWorkouts.map(workout => (
                  <tr key={workout.id}>
                    <td><span className="badge bg-secondary">{workout.id}</span></td>
                    <td><strong className="text-primary">{workout.name}</strong></td>
                    <td>
                      <span className="me-1">{getCategoryIcon(workout.category)}</span>
                      {workout.category}
                    </td>
                    <td>
                      <span className={`badge bg-${getDifficultyBadge(workout.difficulty)}`}>
                        {workout.difficulty}
                      </span>
                    </td>
                    <td><span className="badge bg-info">{workout.duration} min</span></td>
                    <td className="text-muted small">{workout.description || 'No description'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {sortedFilteredWorkouts.length === 0 && (
            <div className="alert alert-info text-center" role="alert">
              <strong>ℹ️ No workouts found.</strong> Try a different difficulty filter.
            </div>
          )}

          <div className="mt-3 text-muted small">
            <strong>Tip:</strong> Use difficulty filters above | Click column headers to sort
          </div>
        </div>
      </div>
    </div>
  );
}

export default Workouts;
