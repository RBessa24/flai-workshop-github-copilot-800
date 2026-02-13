import React, { useState, useEffect } from 'react';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    team: '',
    points: 0
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

  const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/users/`;

  const fetchUsers = () => {
    console.log('Fetching users from:', apiUrl);
    setLoading(true);
    
    fetch(apiUrl)
      .then(response => {
        console.log('Users API Response Status:', response.status);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Users API Response Data:', data);
        const usersData = data.results || data;
        console.log('Processed Users Data:', usersData);
        setUsers(Array.isArray(usersData) ? usersData : []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
        setError(error.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'points' ? parseInt(value) || 0 : value
    });
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    console.log('Creating user:', formData);

    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    })
      .then(response => {
        console.log('Create User Response Status:', response.status);
        if (!response.ok) {
          throw new Error(`Failed to create user: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('User created:', data);
        setSuccessMessage('User created successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
        setFormData({ name: '', email: '', team: '', points: 0 });
        setShowForm(false);
        fetchUsers();
      })
      .catch(error => {
        console.error('Error creating user:', error);
        alert(`Error creating user: ${error.message}`);
      });
  };

  const handleDeleteUser = (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}"?`)) {
      return;
    }

    console.log('Deleting user ID:', userId);
    const deleteUrl = `${apiUrl}${userId}/`;

    fetch(deleteUrl, {
      method: 'DELETE',
    })
      .then(response => {
        console.log('Delete User Response Status:', response.status);
        if (!response.ok && response.status !== 204) {
          throw new Error(`Failed to delete user: ${response.status}`);
        }
        console.log('User deleted successfully');
        setSuccessMessage('User deleted successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
        fetchUsers();
      })
      .catch(error => {
        console.error('Error deleting user:', error);
        alert(`Error deleting user: ${error.message}`);
      });
  };

  const sortData = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortedUsers = () => {
    const sortedUsers = [...users];
    sortedUsers.sort((a, b) => {
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
    return sortedUsers;
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) return ' ↕';
    return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
  };

  if (loading) return <div className="container mt-4"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div></div>;
  if (error) return <div className="container mt-4"><div className="alert alert-danger" role="alert"><strong>Error:</strong> {error}</div></div>;

  const sortedUsers = getSortedUsers();

  return (
    <div className="container mt-4">
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <h2 className="mb-0"><span className="me-2">👥</span>Users Management</h2>
          <button 
            className={`btn ${showForm ? 'btn-light' : 'btn-success'}`}
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? '✕ Cancel' : '+ Add New User'}
          </button>
        </div>

        <div className="card-body">
          {successMessage && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              <strong>✓</strong> {successMessage}
            </div>
          )}

          {showForm && (
            <div className="card mb-4 border-success">
              <div className="card-body bg-light">
                <h5 className="card-title text-success">Create New User</h5>
                <form onSubmit={handleCreateUser}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="name" className="form-label fw-bold">Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter full name"
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="email" className="form-label fw-bold">Email *</label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="user@example.com"
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="team" className="form-label fw-bold">Team</label>
                      <input
                        type="text"
                        className="form-control"
                        id="team"
                        name="team"
                        value={formData.team}
                        onChange={handleInputChange}
                        placeholder="Team name (optional)"
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="points" className="form-label fw-bold">Points</label>
                      <input
                        type="number"
                        className="form-control"
                        id="points"
                        name="points"
                        value={formData.points}
                        onChange={handleInputChange}
                        min="0"
                      />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-success">
                    <strong>✓ Create User</strong>
                  </button>
                </form>
              </div>
            </div>
          )}

          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th style={{cursor: 'pointer'}} onClick={() => sortData('id')}>
                    ID{getSortIcon('id')}
                  </th>
                  <th style={{cursor: 'pointer'}} onClick={() => sortData('name')}>
                    Name{getSortIcon('name')}
                  </th>
                  <th style={{cursor: 'pointer'}} onClick={() => sortData('email')}>
                    Email{getSortIcon('email')}
                  </th>
                  <th style={{cursor: 'pointer'}} onClick={() => sortData('team')}>
                    Team{getSortIcon('team')}
                  </th>
                  <th style={{cursor: 'pointer'}} onClick={() => sortData('points')}>
                    Points{getSortIcon('points')}
                  </th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedUsers.map(user => (
                  <tr key={user.id}>
                    <td><span className="badge bg-secondary">{user.id}</span></td>
                    <td><strong>{user.name}</strong></td>
                    <td>{user.email}</td>
                    <td>
                      {user.team ? (
                        <span className="badge bg-info">{user.team}</span>
                      ) : (
                        <span className="text-muted">N/A</span>
                      )}
                    </td>
                    <td>
                      <span className="badge bg-success">{user.points} pts</span>
                    </td>
                    <td className="text-center">
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteUser(user.id, user.name)}
                        title="Delete user"
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {sortedUsers.length === 0 && (
            <div className="alert alert-info text-center" role="alert">
              <strong>ℹ️ No users found.</strong> Click "Add New User" to create one.
            </div>
          )}
          
          <div className="mt-3 text-muted small">
            <strong>Total Users:</strong> {sortedUsers.length} | <strong>Tip:</strong> Click column headers to sort
          </div>
        </div>
      </div>
    </div>
  );
}

export default Users;
