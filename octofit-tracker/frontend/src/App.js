import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';
import Users from './components/Users';
import Activities from './components/Activities';
import Teams from './components/Teams';
import Leaderboard from './components/Leaderboard';
import Workouts from './components/Workouts';

function NavBar() {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold fs-4 text-white" to="/">
          <span className="me-2">🐙</span>OctoFit Tracker
        </Link>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/users')}`} to="/users">
                <span className="me-1">👥</span> Users
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/activities')}`} to="/activities">
                <span className="me-1">⚡</span> Activities
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/teams')}`} to="/teams">
                <span className="me-1">🏆</span> Teams
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/leaderboard')}`} to="/leaderboard">
                <span className="me-1">🏅</span> Leaderboard
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/workouts')}`} to="/workouts">
                <span className="me-1">💪</span> Workouts
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

function HomePage() {
  return (
    <div className="container mt-5">
      <div className="text-center mb-5">
        <h1 className="display-3 fw-bold mb-3" style={{color: '#667eea'}}>
          <span className="me-3">🐙</span>OctoFit Tracker
        </h1>
        <p className="lead text-muted fs-4">
          Track your fitness journey, compete with teams, and achieve your goals!
        </p>
      </div>

      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <Link to="/users" className="text-decoration-none">
            <div className="card h-100 shadow-sm hover-card">
              <div className="card-body text-center p-4">
                <div className="display-1 mb-3">👥</div>
                <h3 className="card-title text-primary">Users</h3>
                <p className="card-text text-muted">
                  Manage user profiles, track points, and view team memberships.
                </p>
              </div>
            </div>
          </Link>
        </div>

        <div className="col-md-4">
          <Link to="/activities" className="text-decoration-none">
            <div className="card h-100 shadow-sm hover-card">
              <div className="card-body text-center p-4">
                <div className="display-1 mb-3">⚡</div>
                <h3 className="card-title text-success">Activities</h3>
                <p className="card-text text-muted">
                  Log workouts, track calories burned, and monitor your progress.
                </p>
              </div>
            </div>
          </Link>
        </div>

        <div className="col-md-4">
          <Link to="/teams" className="text-decoration-none">
            <div className="card h-100 shadow-sm hover-card">
              <div className="card-body text-center p-4">
                <div className="display-1 mb-3">🏆</div>
                <h3 className="card-title text-info">Teams</h3>
                <p className="card-text text-muted">
                  Join teams, compete together, and climb the rankings.
                </p>
              </div>
            </div>
          </Link>
        </div>

        <div className="col-md-6">
          <Link to="/leaderboard" className="text-decoration-none">
            <div className="card h-100 shadow-sm hover-card">
              <div className="card-body text-center p-4">
                <div className="display-1 mb-3">🏅</div>
                <h3 className="card-title text-warning">Leaderboard</h3>
                <p className="card-text text-muted">
                  See how you rank against others and celebrate top performers.
                </p>
              </div>
            </div>
          </Link>
        </div>

        <div className="col-md-6">
          <Link to="/workouts" className="text-decoration-none">
            <div className="card h-100 shadow-sm hover-card">
              <div className="card-body text-center p-4">
                <div className="display-1 mb-3">💪</div>
                <h3 className="card-title text-danger">Workouts</h3>
                <p className="card-text text-muted">
                  Browse workout plans tailored to your fitness level and goals.
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      <div className="card shadow-sm mb-5" style={{background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)'}}>
        <div className="card-body p-4">
          <h4 className="card-title mb-3">✨ Features</h4>
          <div className="row">
            <div className="col-md-4 mb-3">
              <div className="d-flex align-items-start">
                <span className="me-2 fs-4">📊</span>
                <div>
                  <strong>Track Progress</strong>
                  <p className="text-muted small mb-0">Monitor your fitness metrics and achievements</p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="d-flex align-items-start">
                <span className="me-2 fs-4">🎯</span>
                <div>
                  <strong>Set Goals</strong>
                  <p className="text-muted small mb-0">Challenge yourself and reach new milestones</p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="d-flex align-items-start">
                <span className="me-2 fs-4">🤝</span>
                <div>
                  <strong>Team Competition</strong>
                  <p className="text-muted small mb-0">Compete with friends and stay motivated</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        .hover-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .hover-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
        }
      `}</style>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="App" style={{minHeight: '100vh', backgroundColor: '#f8f9fa'}}>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/users" element={<Users />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/workouts" element={<Workouts />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
