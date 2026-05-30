import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Menu from './components/Menu';
import Reviews from './components/Reviews';
import Reservation from './components/Reservation';
import Admin from './components/Admin';
import { SpeedInsights } from '@vercel/speed-insights/react';

export default function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const handleNavigate = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      // Offset scroll to account for sticky navbar
      const navbarOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navbarOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleScrollToMenu = () => {
    handleNavigate('menu');
  };

  return (
    <div className="app-wrapper">
      {/* Header Sticky Navbar */}
      <Navbar 
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenReservation={() => setIsReservationOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Main Pages */}
      <main>
        {/* 1. Hero Landing Page */}
        <Hero 
          onOpenReservation={() => setIsReservationOpen(true)}
          onScrollToMenu={handleScrollToMenu}
        />

        {/* 2. Restaurant Story Section */}
        <section id="story" className="section story-section">
          <div className="container story-grid">
            <div className="story-image-container">
              <div className="story-image-frame glass-panel">
                <img 
                  src="/assets/chef_portrait.svg" 
                  alt="Chef Jean-Luc L'Étoile" 
                  className="chef-img"
                  onError={(e) => {
                    e.target.src = "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 fill=%22%23121212%22/><text x=%2250%%22 y=%2250%%22 fill=%22%23c5a880%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-size=%2210%22>Chef Jean-Luc</text></svg>";
                  }}
                />
                <div className="chef-card-badge">
                  <h4>Chef Jean-Luc</h4>
                  <span>Executive Chef & Owner</span>
                </div>
              </div>
            </div>
            
            <div className="story-info-container">
              <span className="story-tag">Our Legacy</span>
              <h2>A Fusion of French Elegance & Italian Soul</h2>
              <p className="story-lead">
                At L'Étoile Dorée, food is not merely sustenance—it is a performance, a sensory journey, and a work of fine art.
              </p>
              <p className="story-text">
                Founded in 2018 by Michelin-starred culinary virtuoso Jean-Luc L'Étoile, our cuisine explores the historic borders where French precision meets the passionate, sun-drenched flavors of Italian traditions. Every dish is a curated expression of rare white truffles, hand-pressed olive oils, and wild sea herbs.
              </p>
              <p className="story-text">
                Nestled in an architect-designed glasshouse structure, the dining room invites guests to experience starlit dinners surrounded by living flora, while our private VIP vaults offer discrete luxury with limestone walls and personalized sommelier service.
              </p>
              
              <div className="story-features">
                <div className="story-feature-item">
                  <span className="feature-icon">🌿</span>
                  <div>
                    <h5>Organic Sourcing</h5>
                    <p>Ingredients are harvested daily from our private garden estates.</p>
                  </div>
                </div>
                <div className="story-feature-item">
                  <span className="feature-icon">🍇</span>
                  <div>
                    <h5>Exclusive Cellar</h5>
                    <p>An award-winning archive of 450+ rare European vintages.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. The Menu */}
        <Menu />

        {/* 4. Guest Reviews */}
        <Reviews />
      </main>

      {/* Footer */}
      <footer className="footer-section">
        <div className="container footer-grid">
          <div className="footer-brand">
            <div className="navbar-logo">
              <span className="logo-star">✨</span>
              <span className="logo-text">L'Étoile Dorée</span>
            </div>
            <p className="footer-brand-desc">
              Exquisite fine dining in the heart of the city. Michelin-level creations served in a luxury obsidian glasshouse setting.
            </p>
          </div>
          <div className="footer-hours">
            <h4>Operating Hours</h4>
            <ul>
              <li><span>Monday – Thursday:</span> 17:00 – 23:00</li>
              <li><span>Friday – Saturday:</span> 17:00 – 00:00</li>
              <li><span>Sunday:</span> 16:00 – 22:30</li>
            </ul>
          </div>
          <div className="footer-contact">
            <h4>Inquiries & Location</h4>
            <p>📍 782 Rue de la Lune, Suite A, Metropolia</p>
            <p>📞 +1 (555) 763-9824</p>
            <p>✉️ concierge@etoiledoree.com</p>
          </div>
        </div>
        <div className="footer-bottom text-center">
          <p>&copy; {new Date().getFullYear()} L'Étoile Dorée. All rights reserved. Designed for elite gastronomic experiences.</p>
        </div>
      </footer>

      {/* Modals overlays */}
      <Reservation 
        isOpen={isReservationOpen}
        onClose={() => setIsReservationOpen(false)}
      />

      <Admin 
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />
    <SpeedInsights />
</div>
  );
}
