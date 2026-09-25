import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Menu, X, ExternalLink } from 'lucide-react';
import Button from '../components/ui/Button';

export default function PublicLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const location = useLocation();

  // Track scroll progress for subtle indicator
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const currentProgress = (window.scrollY / totalScroll) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Overview', path: '/' },
    { label: 'Methodology', path: '/methodology' },
    { label: 'Technology', path: '/technology' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col font-sans selection:bg-amber-500/20 selection:text-amber-200">
      {/* Subtle Scroll Progress Indicator */}
      <div className="fixed top-0 left-0 right-0 h-[2px] z-50 pointer-events-none">
        <div
          className="h-full bg-amber-400 transition-all duration-75 ease-out opacity-80"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Top Banner: SIH 2026 Context */}
      <div className="bg-[#0A0D14] border-b border-[#1C2536] px-4 py-1.5 text-center text-[11px] font-mono text-slate-400 flex items-center justify-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
        <span className="font-semibold text-slate-300">Smart India Hackathon SIH26009</span>
        <span className="text-slate-600">•</span>
        <span className="text-slate-400">Ministry of Steel & MOIL Ltd. Multi-Mine Intelligence</span>
      </div>

      {/* Main Public Navbar */}
      <header className="sticky top-0 z-40 bg-[#07090E]/95 backdrop-blur-md border-b border-[#1C2536]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-15 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded-[6px] bg-[#141924] border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold font-mono text-sm shadow-sm group-hover:border-amber-400 transition-colors">
              M
            </div>
            <div>
              <span className="text-sm font-bold tracking-tight text-white font-mono group-hover:text-amber-400 transition-colors">
                MANGENESIS
              </span>
              <span className="block text-[8px] font-mono text-slate-400 tracking-wider uppercase">
                Reserve & Continuity AI
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-1.5 text-xs font-mono rounded-[6px] transition-colors ${
                    isActive
                      ? 'text-white bg-[#151D2C] border border-amber-500/25'
                      : 'text-slate-400 hover:text-white hover:bg-[#0E131E]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/app">
              <Button variant="primary" size="sm" iconRight={ArrowRight}>
                Launch Platform
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-[6px] text-slate-400 hover:text-white hover:bg-[#121824]"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-[#1C2536] bg-[#0A0D14] px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-xs font-mono text-slate-300 hover:text-white hover:bg-[#121824] rounded-[6px]"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-[#1C2536]">
              <Link to="/app" onClick={() => setMobileMenuOpen(false)} className="block w-full">
                <Button variant="primary" size="md" className="w-full">
                  Launch Platform
                </Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Page Body */}
      <main className="flex-1">{children}</main>

      {/* Enterprise Footer */}
      <footer className="bg-[#0A0D14] border-t border-[#1C2536] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-[6px] bg-[#141924] border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-xs font-mono">
                M
              </div>
              <span className="font-bold text-white font-mono tracking-tight text-sm">MANGENESIS</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              AI-assisted manganese reserve intelligence and production continuity forecasting platform engineered for MOIL Limited and India's critical mineral security.
            </p>
            <div className="text-[10px] font-mono text-amber-400/90 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-[4px] inline-block">
              SIH26009 • Grand Finale Edition
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3 font-mono">
              Intelligence
            </h4>
            <ul className="space-y-2 text-xs font-mono text-slate-400">
              <li><Link to="/app/reserve-intelligence" className="hover:text-amber-400">Reserve Mapping (UNFC)</Link></li>
              <li><Link to="/app/geological-explorer" className="hover:text-amber-400">Geological Explorer</Link></li>
              <li><Link to="/app/drilling-analytics" className="hover:text-amber-400">Drilling Analytics</Link></li>
              <li><Link to="/app/production-forecast" className="hover:text-amber-400">Production Forecasting</Link></li>
              <li><Link to="/app/recommendations" className="hover:text-amber-400">Action Recommendations</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3 font-mono">
              Science & Compliance
            </h4>
            <ul className="space-y-2 text-xs font-mono text-slate-400">
              <li><Link to="/methodology" className="hover:text-amber-400">End-to-End Pipeline</Link></li>
              <li><Link to="/technology" className="hover:text-amber-400">Geospatial + AI Architecture</Link></li>
              <li><Link to="/app/data-health" className="hover:text-amber-400">Data Lineage & Telemetry</Link></li>
              <li><Link to="/about" className="hover:text-amber-400">Problem Statement Compliance</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3 font-mono">
              MOIL Belts
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              Calibrated for Nagpur & Balaghat manganese belts (Gumgaon, Balaghat, Chikla, Dongri Buzurg, Mansar, Tirodi).
            </p>
            <Link to="/app">
              <Button variant="secondary" size="sm" className="w-full">
                Enter Command Console
              </Button>
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-[#1C2536] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-mono">
          <div>
            © 2026 MANGENESIS • Developed for SIH26009
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>DGMS Safety Standards Aware</span>
            <span>•</span>
            <span>UNFC 1997/2009 Classification System</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
