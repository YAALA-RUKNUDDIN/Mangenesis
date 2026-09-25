import { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AppLayout from './layouts/AppLayout';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import AboutPage from './pages/public/AboutPage';
import MethodologyPage from './pages/public/MethodologyPage';
import TechnologyPage from './pages/public/TechnologyPage';
import ContactPage from './pages/public/ContactPage';

// Authenticated Application Pages
import CommandCenter from './pages/CommandCenter';
import ReserveIntelligence from './pages/ReserveIntelligence';
import GeologicalExplorer from './pages/GeologicalExplorer';
import DrillingAnalytics from './pages/DrillingAnalytics';
import ProductionForecast from './pages/ProductionForecast';
import RiskIntelligence from './pages/RiskIntelligence';
import ActionCenter from './pages/ActionCenter';
import ReportsPage from './pages/ReportsPage';
import DataHealthPage from './pages/DataHealthPage';
import SettingsPage from './pages/SettingsPage';

// Specialized Intelligence & Compliance Modules
import EquipmentIntelligence from './pages/EquipmentIntelligence';
import SafetyIntelligence from './pages/SafetyIntelligence';
import IncidentManagement from './pages/IncidentManagement';
import AIIntelligence from './pages/AIIntelligence';
import AuditLog from './pages/AuditLog';
import ROIDashboard from './pages/ROIDashboard';
import AlertCenter from './pages/AlertCenter';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  }, [pathname]);

  return null;
}

function App() {
  const location = useLocation();

  // Determine if current route is part of public experience or authenticated application
  const isAppRoute = location.pathname.startsWith('/app');

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 font-sans">
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* ===================== PUBLIC MARKETING WEBSITE ===================== */}
          <Route path="/" element={<PublicLayout><LandingPage /></PublicLayout>} />
          <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
          <Route path="/methodology" element={<PublicLayout><MethodologyPage /></PublicLayout>} />
          <Route path="/technology" element={<PublicLayout><TechnologyPage /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />

          {/* ===================== AUTHENTICATED APPLICATION ===================== */}
          <Route path="/app" element={<AppLayout><CommandCenter /></AppLayout>} />
          <Route path="/app/reserve-intelligence" element={<AppLayout><ReserveIntelligence /></AppLayout>} />
          <Route path="/app/geological-explorer" element={<AppLayout><GeologicalExplorer /></AppLayout>} />
          <Route path="/app/drilling-analytics" element={<AppLayout><DrillingAnalytics /></AppLayout>} />
          <Route path="/app/production-forecast" element={<AppLayout><ProductionForecast /></AppLayout>} />
          <Route path="/app/risk-intelligence" element={<AppLayout><RiskIntelligence /></AppLayout>} />
          <Route path="/app/recommendations" element={<AppLayout><ActionCenter /></AppLayout>} />
          <Route path="/app/reports" element={<AppLayout><ReportsPage /></AppLayout>} />
          <Route path="/app/data-health" element={<AppLayout><DataHealthPage /></AppLayout>} />
          <Route path="/app/settings" element={<AppLayout><SettingsPage /></AppLayout>} />

          {/* Specialized Modules */}
          <Route path="/app/equipment" element={<AppLayout><EquipmentIntelligence /></AppLayout>} />
          <Route path="/app/safety" element={<AppLayout><SafetyIntelligence /></AppLayout>} />
          <Route path="/app/incidents" element={<AppLayout><IncidentManagement /></AppLayout>} />
          <Route path="/app/ai-intelligence" element={<AppLayout><AIIntelligence /></AppLayout>} />
          <Route path="/app/audit-log" element={<AppLayout><AuditLog /></AppLayout>} />
          <Route path="/app/roi-dashboard" element={<AppLayout><ROIDashboard /></AppLayout>} />
          <Route path="/app/alert-center" element={<AppLayout><AlertCenter /></AppLayout>} />

          {/* ===================== LEGACY ROUTE COMPATIBILITY REDIRECTS ===================== */}
          <Route path="/command-center" element={<Navigate to="/app" replace />} />
          <Route path="/reserve-intelligence" element={<Navigate to="/app/reserve-intelligence" replace />} />
          <Route path="/geological-explorer" element={<Navigate to="/app/geological-explorer" replace />} />
          <Route path="/drilling-analytics" element={<Navigate to="/app/drilling-analytics" replace />} />
          <Route path="/production-forecast" element={<Navigate to="/app/production-forecast" replace />} />
          <Route path="/risk-analysis" element={<Navigate to="/app/risk-intelligence" replace />} />
          <Route path="/risk-intelligence" element={<Navigate to="/app/risk-intelligence" replace />} />
          <Route path="/action-center" element={<Navigate to="/app/recommendations" replace />} />
          <Route path="/recommendations" element={<Navigate to="/app/recommendations" replace />} />
          <Route path="/digital-twin" element={<Navigate to="/app/geological-explorer" replace />} />
          <Route path="/equipment" element={<Navigate to="/app/equipment" replace />} />
          <Route path="/safety" element={<Navigate to="/app/safety" replace />} />
          <Route path="/incidents" element={<Navigate to="/app/incidents" replace />} />
          <Route path="/ai-intelligence" element={<Navigate to="/app/ai-intelligence" replace />} />
          <Route path="/audit-log" element={<Navigate to="/app/audit-log" replace />} />
          <Route path="/roi-dashboard" element={<Navigate to="/app/roi-dashboard" replace />} />
          <Route path="/alert-center" element={<Navigate to="/app/alert-center" replace />} />
          <Route path="/architecture" element={<Navigate to="/technology" replace />} />

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/app" replace />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
