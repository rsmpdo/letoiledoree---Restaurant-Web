import React, { useState, useEffect } from 'react';

export default function Navbar({ activeSection, onNavigate, onOpenReservation, onOpenAdmin }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'hero', label: 'Home' },
    { id: 'story', label: 'Our Story' },
    { id: 'menu', label: 'Menu' },
    { id: 'reviews', label: 'Reviews' }
  ];

  const handleNavClick = (sectionId) => {
    setMobileMenuOpen(false);
    onNavigate(sectionId);
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-logo" onClick={() => handleNavClick('hero')}>
          <span className="logo-star">✨</span>
          <span className="logo-text">L'Étoile Dorée</span>
        </div>

        {/* Desktop Menu */}
        <div className="navbar-links">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
            >
              {item.label}
            </button>
          ))}
          <button onClick={onOpenAdmin} className="nav-link nav-link-admin">
            Admin Portal
          </button>
          <button onClick={onOpenReservation} className="btn-gold nav-reserve-btn">
            Book A Table
          </button>
        </div>

        {/* Mobile Toggle Button */}
        <button 
          className={`mobile-menu-toggle ${mobileMenuOpen ? 'open' : ''}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Drawer */}
      <div className={`mobile-navbar-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-drawer-links">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`mobile-nav-link ${activeSection === item.id ? 'active' : ''}`}
            >
              {item.label}
            </button>
          ))}
          <button 
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenAdmin();
            }} 
            className="mobile-nav-link mobile-nav-link-admin"
          >
            Admin Portal
          </button>
          <button 
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenReservation();
            }} 
            className="btn-solid mobile-reserve-btn"
          >
            Book A Table
          </button>
        </div>
      </div>
    </nav>
  );
}
