import React, { useState, useEffect } from 'react';

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', rating: 5, comment: '' });
  const [hoverRating, setHoverRating] = useState(0);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/reviews');
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRatingClick = (r) => {
    setFormData(prev => ({ ...prev, rating: r }));
  };

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');

    if (!formData.name || !formData.comment) {
      setSubmitError('Please complete your name and comment.');
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitSuccess(true);
        setFormData({ name: '', rating: 5, comment: '' });
      } else {
        setSubmitError(data.error || 'Failed to submit review.');
      }
    } catch (err) {
      console.error(err);
      setSubmitError('Connection error. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (count, interactive = false) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const isFilled = interactive 
        ? (hoverRating ? i <= hoverRating : i <= formData.rating)
        : i <= count;

      stars.push(
        <span
          key={i}
          className={`star-char ${isFilled ? 'filled' : ''} ${interactive ? 'interactive-star' : ''}`}
          onClick={interactive ? () => handleRatingClick(i) : undefined}
          onMouseEnter={interactive ? () => setHoverRating(i) : undefined}
          onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
        >
          ★
        </span>
      );
    }
    return <div className="stars-wrapper">{stars}</div>;
  };

  return (
    <section id="reviews" className="section reviews-section">
      <div className="container">
        <h2>Guest Experiences</h2>
        <p className="reviews-intro text-center">
          Do not take our word for it. Read honest feedback from our valued guests about their dining experiences at L'Étoile Dorée.
        </p>

        <div className="reviews-split-layout">
          {/* Reviews List */}
          <div className="reviews-list-container">
            {loading ? (
              <div className="reviews-loading">Curating reviews...</div>
            ) : reviews.length === 0 ? (
              <div className="reviews-empty glass-panel text-center">
                <p>No reviews have been published yet. Be the first to share your experience!</p>
              </div>
            ) : (
              <div className="reviews-grid">
                {reviews.map((rev) => (
                  <div key={rev.id} className="review-card glass-panel animate-fade-in">
                    <div className="review-card-header">
                      <h4 className="review-author">{rev.name}</h4>
                      <span className="review-date">{rev.date}</span>
                    </div>
                    {renderStars(rev.rating)}
                    <p className="review-comment">"{rev.comment}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Review Submission Form */}
          <div className="review-form-container glass-panel">
            <h3 className="review-form-title">Share Your Experience</h3>
            <p className="review-form-subtitle">Your feedback helps us maintain the gold standard of luxury hospitality.</p>

            {submitSuccess ? (
              <div className="review-submit-success text-center">
                <div className="success-emoji">✨</div>
                <h4>Feedback Submitted</h4>
                <p>
                  Thank you! Your review has been sent to our moderators. It will appear on our page shortly after approval.
                </p>
                <button 
                  onClick={() => setSubmitSuccess(false)} 
                  className="btn-gold reset-review-form-btn"
                >
                  Write Another Review
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="review-submit-form">
                {submitError && <div className="form-error-msg">{submitError}</div>}
                
                <div className="form-group">
                  <label className="form-label">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleTextChange}
                    placeholder="e.g. Sofia V."
                    className="form-control"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Rating</label>
                  {renderStars(formData.rating, true)}
                </div>

                <div className="form-group">
                  <label className="form-label">Your Review</label>
                  <textarea
                    name="comment"
                    value={formData.comment}
                    onChange={handleTextChange}
                    placeholder="Describe your culinary experience, the atmosphere, or service..."
                    className="form-control review-textarea"
                    rows="4"
                    required
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={submitting} 
                  className="btn-solid submit-review-btn"
                >
                  {submitting ? 'Submitting...' : 'Post Review'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
