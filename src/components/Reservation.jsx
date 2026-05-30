import React, { useState } from 'react';

const SEATING_ZONES = [
  { id: 'main', label: 'Main Dining Room', desc: 'Elegant crystal chandeliers, live grand piano ambiance.' },
  { id: 'greenhouse', label: 'The Glasshouse', desc: 'Under the stars, surrounded by exotic orchids and botanical arrays.' },
  { id: 'vault', label: 'VIP Vault', desc: 'Exclusive, intimate vault, private sommelier service.' },
  { id: 'terrace', label: 'Al Fresco Terrace', desc: 'Breathtaking open-air views of the city skyline.' }
];

const TIME_SLOTS = [
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'
];

export default function Reservation({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '19:00',
    guests: '2',
    zone: 'main',
    occasion: 'Standard Dining',
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const selectZone = (zoneId) => {
    setFormData(prev => ({ ...prev, zone: zoneId }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Quick Validation
    if (!formData.name || !formData.email || !formData.phone || !formData.date || !formData.time) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    try {
      const selectedZoneLabel = SEATING_ZONES.find(z => z.id === formData.zone)?.label || 'Main Dining Room';
      const body = {
        ...formData,
        zone: selectedZoneLabel
      };

      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      const result = await response.json();
      if (response.ok) {
        setSuccessData(result.reservation);
      } else {
        setError(result.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError('Connection error. Please check if backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSuccessData(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      date: '',
      time: '19:00',
      guests: '2',
      zone: 'main',
      occasion: 'Standard Dining',
      notes: ''
    });
    onClose();
  };

  // Get tomorrow's date string as minimum date for reservation
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel animate-fade-in">
        <button className="modal-close-btn" onClick={handleReset}>&times;</button>
        
        {!successData ? (
          <form onSubmit={handleSubmit} className="reservation-form">
            <h2 className="modal-title">Book A Culinary Journey</h2>
            <p className="modal-subtitle">Secure your dining table at L'Étoile Dorée. We look forward to hosting you.</p>

            {error && <div className="form-error-msg">{error}</div>}

            <div className="form-row-grid">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Jean Dupont"
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. jean@example.com"
                  className="form-control"
                  required
                />
              </div>
            </div>

            <div className="form-row-grid">
              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. +1 555 123 4567"
                  className="form-control"
                  required
                />
              </div>
              <div className="form-row-grid-three">
                <div className="form-group">
                  <label className="form-label">Guests *</label>
                  <select 
                    name="guests" 
                    value={formData.guests} 
                    onChange={handleChange} 
                    className="form-control"
                  >
                    {[1,2,3,4,5,6,7,8,9,10].map(n => (
                      <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Date *</label>
                  <input
                    type="date"
                    name="date"
                    min={getMinDate()}
                    value={formData.date}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Time *</label>
                  <select 
                    name="time" 
                    value={formData.time} 
                    onChange={handleChange} 
                    className="form-control"
                  >
                    {TIME_SLOTS.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Zone Selector */}
            <div className="form-group">
              <label className="form-label">Preferred Atmosphere *</label>
              <div className="zone-selector-grid">
                {SEATING_ZONES.map(z => (
                  <div 
                    key={z.id} 
                    className={`zone-card ${formData.zone === z.id ? 'active' : ''}`}
                    onClick={() => selectZone(z.id)}
                  >
                    <div className="zone-card-header">
                      <span className="zone-radio"></span>
                      <h4>{z.label}</h4>
                    </div>
                    <p>{z.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-row-grid">
              <div className="form-group">
                <label className="form-label">Occasion</label>
                <select 
                  name="occasion" 
                  value={formData.occasion} 
                  onChange={handleChange} 
                  className="form-control"
                >
                  <option value="Standard Dining">Standard Dining</option>
                  <option value="Anniversary">Anniversary</option>
                  <option value="Birthday">Birthday</option>
                  <option value="Business Meal">Business Meal</option>
                  <option value="Special Date">Special Date</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Special Notes / Allergies</label>
                <input
                  type="text"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="e.g. Gluten allergy, window seat preferred"
                  className="form-control"
                />
              </div>
            </div>

            <div className="form-submit-row">
              <button type="submit" disabled={loading} className="btn-solid modal-submit-btn">
                {loading ? 'Processing Booking...' : 'Submit Reservation'}
              </button>
            </div>
          </form>
        ) : (
          <div className="reservation-success container text-center">
            <div className="success-icon">✨</div>
            <h2 className="success-title">Reservation Confirmed</h2>
            <p className="success-intro">Your culinary experience has been reserved. Please find your ticket details below.</p>
            
            <div className="success-ticket glass-panel">
              <div className="ticket-header">
                <h3>L'Étoile Dorée</h3>
                <span className="ticket-code">{successData.id}</span>
              </div>
              <div className="ticket-body-grid">
                <div className="ticket-item">
                  <span className="ticket-label">Guest</span>
                  <span className="ticket-value">{successData.name}</span>
                </div>
                <div className="ticket-item">
                  <span className="ticket-label">Guests Count</span>
                  <span className="ticket-value">{successData.guests} Persons</span>
                </div>
                <div className="ticket-item">
                  <span className="ticket-label">Date & Time</span>
                  <span className="ticket-value">{successData.date} @ {successData.time}</span>
                </div>
                <div className="ticket-item">
                  <span className="ticket-label">Atmosphere</span>
                  <span className="ticket-value">{successData.zone}</span>
                </div>
                <div className="ticket-item-full">
                  <span className="ticket-label">Occasion</span>
                  <span className="ticket-value">{successData.occasion}</span>
                </div>
                {successData.notes && (
                  <div className="ticket-item-full">
                    <span className="ticket-label">Notes</span>
                    <span className="ticket-value">"{successData.notes}"</span>
                  </div>
                )}
              </div>
              <div className="ticket-footer">
                <p>Status: <span className="ticket-status-pending">{successData.status}</span></p>
                <small>Please present this code upon arrival. We hold tables for 15 minutes.</small>
              </div>
            </div>
            
            <button onClick={handleReset} className="btn-solid success-done-btn">
              Done & Return
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
