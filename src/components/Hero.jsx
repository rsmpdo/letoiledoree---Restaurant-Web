import React from 'react';

export default function Hero({ onOpenReservation, onScrollToMenu }) {
  return (
    <section id="hero" className="hero-section">
      <div className="hero-background-overlay"></div>
      <div className="hero-content container text-center animate-fade-in-up">
        <span className="hero-tagline">Welcome to L'Étoile Dorée</span>
        <h1 className="hero-title">Haute Cuisine & Luxury Dining</h1>
        <div className="hero-divider">
          <span className="divider-line"></span>
          <span className="divider-star">✨</span>
          <span className="divider-line"></span>
        </div>
        <p className="hero-subtitle">
          Experience a symphony of refined French-Italian flavors, meticulously crafted by master chefs and served in an atmosphere of unmatched elegance.
        </p>
        <div className="hero-buttons">
          <button onClick={onOpenReservation} className="btn-solid hero-btn">
            Book A Table
          </button>
          <button onClick={onScrollToMenu} className="btn-gold hero-btn">
            Explore Menu
          </button>
        </div>
      </div>
      <div className="hero-scroll-indicator" onClick={onScrollToMenu}>
        <span className="scroll-text">Discover More</span>
        <span className="scroll-arrow">↓</span>
      </div>
    </section>
  );
}
