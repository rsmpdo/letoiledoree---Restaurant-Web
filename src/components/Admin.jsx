import React, { useState, useEffect } from 'react';

export default function Admin({ isOpen, onClose }) {
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  // Dashboard Data State
  const [activeTab, setActiveTab] = useState('reservations');
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    totalGuests: 0,
    pendingReviews: 0,
    avgRating: 0
  });
  const [reservations, setReservations] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch data if authenticated
  useEffect(() => {
    if (token && isOpen) {
      fetchDashboardData();
    }
  }, [token, isOpen]);

  const fetchDashboardData = async () => {
    setLoadingData(true);
    setErrorMsg('');
    try {
      const headers = { Authorization: `Bearer ${token}` };
      
      // Fetch stats
      const statsRes = await fetch('/api/admin/stats', { headers });
      const statsData = await statsRes.json();

      // Fetch bookings
      const bookRes = await fetch('/api/admin/reservations', { headers });
      const bookData = await bookRes.json();

      // Fetch reviews
      const revRes = await fetch('/api/admin/reviews', { headers });
      const revData = await revRes.json();

      if (statsRes.ok && bookRes.ok && revRes.ok) {
        setStats(statsData);
        // Sort reservations by created time (latest first) or date
        setReservations(bookData.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)));
        setReviews(revData.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } else {
        setErrorMsg('Failed to load dashboard statistics.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to sync data with restaurant server.');
    } finally {
      setLoadingData(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoggingIn(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok) {
        setToken(data.token);
        localStorage.setItem('adminToken', data.token);
        setUsername('');
        setPassword('');
      } else {
        setLoginError(data.error || 'Authentication failed.');
      }
    } catch (err) {
      console.error(err);
      setLoginError('Could not establish connection to authentication server.');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('adminToken');
  };

  // Action methods
  const updateReservationStatus = async (id, status) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/reservations/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        await fetchDashboardData(); // Reload
      } else {
        alert('Failed to update reservation status.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const deleteReservation = async (id) => {
    if (!window.confirm('Are you sure you want to delete this reservation?')) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/reservations/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        await fetchDashboardData();
      } else {
        alert('Failed to delete reservation.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const updateReviewStatus = async (id, status) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/reviews/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        await fetchDashboardData();
      } else {
        alert('Failed to moderate review.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const deleteReview = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        await fetchDashboardData();
      } else {
        alert('Failed to delete review.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay admin-modal-overlay">
      <div className="modal-content admin-modal-content glass-panel animate-fade-in">
        <button className="modal-close-btn" onClick={onClose}>&times;</button>

        {!token ? (
          /* Login Form */
          <div className="admin-login-container">
            <div className="text-center">
              <span className="login-logo-icon">✨</span>
              <h2 className="admin-login-title">L'Étoile Dorée Backoffice</h2>
              <p className="admin-login-subtitle">Please sign in with your administrator credentials to access the manager dashboard.</p>
            </div>
            
            {loginError && <div className="form-error-msg">{loginError}</div>}
            
            <form onSubmit={handleLogin} className="admin-login-form">
              <div className="form-group">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="•••••••••••••••••"
                  className="form-control"
                  required
                />
              </div>
              <button type="submit" disabled={loggingIn} className="btn-solid login-submit-btn">
                {loggingIn ? 'Authenticating...' : 'Sign In'}
              </button>
            </form>
            <div className="text-center default-credentials-hint">
              <small>Demo Credentials: <code>admin</code> / <code>goldstarrestaurant</code></small>
            </div>
          </div>
        ) : (
          /* Dashboard Interface */
          <div className="admin-dashboard-container">
            <div className="admin-header">
              <div>
                <h2 className="dashboard-title">Backoffice Control Center</h2>
                <p className="dashboard-subtitle">Manage table reservations, moderate guest reviews, and track daily capacity metrics.</p>
              </div>
              <button onClick={handleLogout} className="btn-gold logout-btn">
                Log Out
              </button>
            </div>

            {errorMsg && <div className="form-error-msg">{errorMsg}</div>}

            {/* Statistics Row */}
            <div className="admin-stats-grid">
              <div className="stat-card glass-panel">
                <span className="stat-label">Total Reservations</span>
                <span className="stat-number">{stats.totalBookings}</span>
              </div>
              <div className="stat-card glass-panel highlight-pending">
                <span className="stat-label">Pending Review</span>
                <span className="stat-number">{stats.pendingBookings}</span>
              </div>
              <div className="stat-card glass-panel highlight-confirmed">
                <span className="stat-label">Confirmed Seats</span>
                <span className="stat-number">{stats.confirmedBookings} <span className="stat-subtext">({stats.totalGuests} Guests)</span></span>
              </div>
              <div className="stat-card glass-panel">
                <span className="stat-label">Reviews Moderation</span>
                <span className="stat-number">{stats.pendingReviews} <span className="stat-subtext">Pending</span></span>
              </div>
              <div className="stat-card glass-panel">
                <span className="stat-label">Average Guest Rating</span>
                <span className="stat-number text-gold">★ {stats.avgRating.toFixed(1)}</span>
              </div>
            </div>

            {/* Content Tabs */}
            <div className="admin-tabs">
              <button 
                className={`admin-tab-btn ${activeTab === 'reservations' ? 'active' : ''}`}
                onClick={() => setActiveTab('reservations')}
              >
                Bookings Management ({reservations.length})
              </button>
              <button 
                className={`admin-tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
                onClick={() => setActiveTab('reviews')}
              >
                Review Moderations ({reviews.length})
              </button>
              <button 
                onClick={fetchDashboardData} 
                className="admin-tab-refresh-btn"
                disabled={loadingData}
              >
                {loadingData ? 'Syncing...' : 'Sync Server ↻'}
              </button>
            </div>

            {/* Tabs Contents */}
            {loadingData && reservations.length === 0 ? (
              <div className="admin-loading-screen text-center">Loading management files...</div>
            ) : activeTab === 'reservations' ? (
              /* Reservations Tab */
              <div className="admin-table-wrapper glass-panel">
                {reservations.length === 0 ? (
                  <p className="no-records-msg text-center">No reservations found in database.</p>
                ) : (
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Code</th>
                        <th>Name</th>
                        <th>Contact</th>
                        <th>Details</th>
                        <th>Date & Time</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reservations.map((res) => (
                        <tr key={res.id}>
                          <td className="cell-code">{res.id}</td>
                          <td className="cell-name">{res.name}</td>
                          <td>
                            <div className="cell-contact">
                              <span>{res.email}</span>
                              <small>{res.phone}</small>
                            </div>
                          </td>
                          <td>
                            <div className="cell-details">
                              <span><strong>{res.guests}</strong> guests in <em>{res.zone}</em></span>
                              {res.occasion && <span className="occ-tag">{res.occasion}</span>}
                              {res.notes && <p className="notes-para">"{res.notes}"</p>}
                            </div>
                          </td>
                          <td className="cell-datetime">
                            <span>{res.date}</span>
                            <strong>{res.time}</strong>
                          </td>
                          <td>
                            <span className={`status-badge status-${res.status.toLowerCase()}`}>
                              {res.status}
                            </span>
                          </td>
                          <td className="cell-actions">
                            {res.status === 'Pending' && (
                              <>
                                <button 
                                  onClick={() => updateReservationStatus(res.id, 'Confirmed')}
                                  disabled={actionLoading}
                                  className="action-btn action-confirm"
                                  title="Confirm booking"
                                >
                                  ✓
                                </button>
                                <button 
                                  onClick={() => updateReservationStatus(res.id, 'Cancelled')}
                                  disabled={actionLoading}
                                  className="action-btn action-cancel"
                                  title="Cancel booking"
                                >
                                  ✗
                                </button>
                              </>
                            )}
                            {res.status === 'Confirmed' && (
                              <button 
                                onClick={() => updateReservationStatus(res.id, 'Cancelled')}
                                disabled={actionLoading}
                                className="action-btn action-cancel"
                                title="Cancel booking"
                              >
                                Cancel
                              </button>
                            )}
                            {res.status === 'Cancelled' && (
                              <button 
                                onClick={() => updateReservationStatus(res.id, 'Confirmed')}
                                disabled={actionLoading}
                                className="action-btn action-confirm"
                                title="Re-confirm booking"
                              >
                                Restore
                              </button>
                            )}
                            <button 
                              onClick={() => deleteReservation(res.id)}
                              disabled={actionLoading}
                              className="action-btn action-delete"
                              title="Delete booking permanently"
                            >
                              🗑
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            ) : (
              /* Reviews Tab */
              <div className="admin-reviews-management glass-panel">
                {reviews.length === 0 ? (
                  <p className="no-records-msg text-center">No reviews found in database.</p>
                ) : (
                  <div className="admin-reviews-list">
                    {reviews.map((rev) => (
                      <div key={rev.id} className={`admin-review-item-card ${rev.status === 'Pending' ? 'moderation-required' : ''}`}>
                        <div className="review-meta-row">
                          <strong>{rev.name}</strong>
                          <span className="review-meta-date">{rev.date}</span>
                          <span className="review-meta-stars">{'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}</span>
                          <span className={`status-badge status-${rev.status.toLowerCase()}`}>
                            {rev.status}
                          </span>
                        </div>
                        <p className="admin-review-comment">"{rev.comment}"</p>
                        
                        <div className="admin-review-actions-row">
                          {rev.status === 'Pending' && (
                            <>
                              <button 
                                onClick={() => updateReviewStatus(rev.id, 'Approved')}
                                disabled={actionLoading}
                                className="admin-action-btn app-btn"
                              >
                                Approve & Publish
                              </button>
                              <button 
                                onClick={() => updateReviewStatus(rev.id, 'Rejected')}
                                disabled={actionLoading}
                                className="admin-action-btn rej-btn"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {rev.status === 'Approved' && (
                            <button 
                              onClick={() => updateReviewStatus(rev.id, 'Rejected')}
                              disabled={actionLoading}
                              className="admin-action-btn rej-btn"
                            >
                              Un-approve
                            </button>
                          )}
                          {rev.status === 'Rejected' && (
                            <button 
                              onClick={() => updateReviewStatus(rev.id, 'Approved')}
                              disabled={actionLoading}
                              className="admin-action-btn app-btn"
                            >
                              Approve
                            </button>
                          )}
                          <button 
                            onClick={() => deleteReview(rev.id)}
                            disabled={actionLoading}
                            className="admin-action-btn del-btn"
                          >
                            Delete Permanently
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
