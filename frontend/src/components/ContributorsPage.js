import React from 'react';
import { Link } from 'react-router-dom';
import Contributors from './Contributors';

const ContributorsPage = () => {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#FFFFFF' }}>
      {/* Navigation Bar */}
      <nav className={`isb-navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="isb-nav-container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img 
              src="/logo.png" 
              alt="College Logo" 
              style={{ 
                height: '45px', 
                width: 'auto',
                objectFit: 'contain'
              }} 
            />
            <div>
              <div className="isb-nav-logo" style={{ fontSize: '1.25rem', lineHeight: '1.2' }}>
                CEG, Anna University
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 500, letterSpacing: '0.02em' }}>
                OD Application System
              </div>
            </div>
          </div>
          <ul className="isb-nav-menu">
            <li className="isb-nav-item">
              <Link to="/" className="isb-nav-link">Home</Link>
            </li>
            <li className="isb-nav-item">
              <Link to="/contributors" className="isb-nav-link active">Contributors</Link>
            </li>
            <li className="isb-nav-item">
              <Link to="/login" className="isb-nav-link">Login</Link>
            </li>
            <li className="isb-nav-item">
              <Link to="/register" className="isb-btn isb-btn-primary isb-btn-small">Register</Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Contributors Section */}
      <div style={{ 
        padding: '80px 20px 60px 20px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <Contributors 
          images={[
            "Kavya Sri V.jpg",
            "Roshni Banu S.jpg",
            "Abhijith M.jpg",
            "Deepak R.jpg",
            "Divapriya B.jpg"
          ]}
        />
      </div>
    </div>
  );
};

export default ContributorsPage;

