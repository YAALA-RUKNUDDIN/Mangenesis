import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

/**
 * MANGENESIS Landing Page — Intelligence Designed To Evolve
 * Single-viewport, full-bleed video-background landing page
 * calibrated for MOIL Ltd. / Ministry of Steel SIH26009.
 */
export default function LandingPage() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('home');

  // Stats counting animation
  const [stat1, setStat1] = useState(0);
  const [stat2, setStat2] = useState(0);
  const [stat3, setStat3] = useState(0);
  const [stat4, setStat4] = useState(0);
  const statsRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setStat1(120);
      setStat2(99.99);
      setStat3(24);
      setStat4(2.4);
      return;
    }

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const animateVal = (target, setter, duration, delay, isDecimal = false) => {
      setTimeout(() => {
        let startTime = null;
        function step(timestamp) {
          if (!startTime) startTime = timestamp;
          const elapsed = timestamp - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const current = easeOutCubic(progress) * target;
          setter(isDecimal ? parseFloat(current.toFixed(isDecimal === 1 ? 1 : 2)) : Math.round(current));
          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            setter(target);
          }
        }
        requestAnimationFrame(step);
      }, delay);
    };

    // IntersectionObserver to trigger once
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateVal(120, setStat1, 1500, 480);
            animateVal(99.99, setStat2, 1580, 570, true);
            animateVal(24, setStat3, 1660, 660);
            animateVal(2.4, setStat4, 1740, 750, 1);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.25 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    } else {
      animateVal(120, setStat1, 1500, 480);
      animateVal(99.99, setStat2, 1580, 570, true);
      animateVal(24, setStat3, 1660, 660);
      animateVal(2.4, setStat4, 1740, 750, 1);
    }

    return () => observer.disconnect();
  }, []);

  // Handle escape key and window resize for mobile menu
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    const handleResize = () => {
      if (window.innerWidth > 720) setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="relative w-full h-[100vh] h-[100dvh] bg-black text-white overflow-hidden select-none font-sans">
      {/* Exact CloudFront Background Video */}
      <div className="bg">
        <video className="bg-video" autoPlay muted loop playsInline>
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260809_012548_ef22562c-c0ae-4816-ad9d-f8922af4e6a7.mp4"
            type="video/mp4"
          />
        </video>
      </div>

      {/* Main Single Viewport Content */}
      <div className="page">
        {/* 1) Header */}
        <header className="header">
          {/* Logo Button */}
          <Link to="/" className="logo-btn" aria-label="MANGENESIS Home">
            <img src="/assets/logo.webp" alt="" width="52" height="52" />
          </Link>

          {/* Desktop Nav Pill (White) */}
          <nav className="nav-pill" aria-label="Main Navigation">
            <button
              onClick={() => setActiveLink('home')}
              className={`nav-link cursor-pointer ${activeLink === 'home' ? 'active' : ''}`}
            >
              Home
            </button>
            <Link
              to="/reserve-intelligence"
              className="nav-link"
              onClick={() => setActiveLink('reserve')}
            >
              Reserve AI
            </Link>
            <Link
              to="/production-forecast"
              className="nav-link"
              onClick={() => setActiveLink('forecast')}
            >
              Forecast
            </Link>
            <Link
              to="/risk-analysis"
              className="nav-link"
              onClick={() => setActiveLink('risk')}
            >
              Risk Engine
            </Link>
            <Link
              to="/roi-dashboard"
              className="nav-link"
              onClick={() => setActiveLink('roi')}
            >
              ROI & Value
            </Link>
          </nav>

          {/* Desktop Sign in / Launch Command Center */}
          <Link to="/command-center" className="sign-in-btn cursor-pointer">
            Sign in
          </Link>

          {/* Mobile Hamburger Toggle Button */}
          <button
            className="mobile-burger-btn cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <span className={`burger-bar ${mobileMenuOpen ? 'rotate-45 translate-y-[5.5px] !bg-black' : ''}`} />
            <span className={`burger-bar ${mobileMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`burger-bar ${mobileMenuOpen ? '-rotate-45 -translate-y-[5.5px] !bg-black' : ''}`} />
          </button>
        </header>

        {/* 2) Hero */}
        <main className="hero">
          {/* Trust Row */}
          <div className="trust-row anim" style={{ '--d': '0.05s' }}>
            <div className="trust-avatar">
              <div className="trust-inner-circle">
                <i className="fa-brands fa-microsoft text-[14px]"></i>
              </div>
            </div>
            <div className="trust-avatar">
              <div className="trust-inner-circle">
                <i className="fa-brands fa-amazon text-[14px]"></i>
              </div>
            </div>
            <div className="trust-avatar">
              <div className="trust-inner-circle">
                <i className="fa-brands fa-google text-[14px]"></i>
              </div>
            </div>
            <div className="trust-pill">
              <span className="trust-pill-text">
                Trusted by MOIL &amp; Ministry of Steel (2000+ Operations)
              </span>
            </div>
          </div>

          {/* Exact Headline in Retro Dot-Matrix Display Font */}
          <h1 className="headline anim">
            <span className="headline-line line-1">Intelligence</span>
            <span className="headline-line line-2">Designed To Evolve</span>
          </h1>

          {/* Subhead */}
          <p className="subhead anim" style={{ '--d': '0.28s' }}>
            Build applications that reason, adapt and collaborate using a modular
            AI platform designed for production.
          </p>

          {/* CTA Button */}
          <Link
            to="/command-center"
            className="cta-btn anim flex items-center gap-2 group cursor-pointer"
            style={{ '--d': '0.4s' }}
          >
            <span>Get Started</span>
            <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </main>

        {/* 3) Stats Footer */}
        <footer className="stats-footer" ref={statsRef}>
          {/* Metric 1 */}
          <div className="stat-item anim" style={{ '--d': '0.5s' }}>
            <span className="stat-glyph">&lt;</span>
            <div className="stat-content">
              <span className="stat-value">
                {stat1}ms
              </span>
              <span className="stat-label">Inference Time</span>
            </div>
          </div>

          {/* Metric 2 */}
          <div className="stat-item anim" style={{ '--d': '0.58s' }}>
            <span className="stat-glyph">%</span>
            <div className="stat-content">
              <span className="stat-value">
                {stat2.toFixed(2)}%
              </span>
              <span className="stat-label">Platform Uptime</span>
            </div>
          </div>

          {/* Metric 3 */}
          <div className="stat-item anim" style={{ '--d': '0.66s' }}>
            <span className="stat-glyph">*</span>
            <div className="stat-content">
              <span className="stat-value">
                {stat3}/7
              </span>
              <span className="stat-label">Autonomous Runtime</span>
            </div>
          </div>

          {/* Metric 4 */}
          <div className="stat-item anim" style={{ '--d': '0.74s' }}>
            <span className="stat-glyph">#</span>
            <div className="stat-content">
              <span className="stat-value">
                {stat4.toFixed(1)}M
              </span>
              <span className="stat-label">Context Windows</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Mobile Navigation Sheet & Backdrop Overlay */}
      <div
        className={`mobile-overlay ${mobileMenuOpen ? 'active' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
      />
      <div className={`mobile-sheet ${mobileMenuOpen ? 'active' : ''}`}>
        <button
          onClick={() => {
            setActiveLink('home');
            setMobileMenuOpen(false);
          }}
          className={`mobile-nav-link text-left cursor-pointer ${activeLink === 'home' ? 'active' : ''}`}
        >
          Home
        </button>
        <Link
          to="/command-center"
          className="mobile-nav-link text-left"
          onClick={() => setMobileMenuOpen(false)}
        >
          3D Command Center
        </Link>
        <Link
          to="/reserve-intelligence"
          className="mobile-nav-link text-left"
          onClick={() => setMobileMenuOpen(false)}
        >
          Reserve Intelligence
        </Link>
        <Link
          to="/production-forecast"
          className="mobile-nav-link text-left"
          onClick={() => setMobileMenuOpen(false)}
        >
          Production Forecast
        </Link>
        <Link
          to="/risk-analysis"
          className="mobile-nav-link text-left"
          onClick={() => setMobileMenuOpen(false)}
        >
          Risk Diagnostics
        </Link>
        <Link
          to="/roi-dashboard"
          className="mobile-nav-link text-left"
          onClick={() => setMobileMenuOpen(false)}
        >
          ROI Dashboard
        </Link>
        <Link
          to="/command-center"
          className="mobile-sign-in-btn cursor-pointer"
          onClick={() => setMobileMenuOpen(false)}
        >
          Launch Command Center
        </Link>
      </div>
    </div>
  );
}
