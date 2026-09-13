import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import MobileNav from './components/layout/MobileNav';
import CommandCenter from './pages/CommandCenter';
import ReserveIntelligence from './pages/ReserveIntelligence';
import ProductionForecast from './pages/ProductionForecast';
import RiskAnalysis from './pages/RiskAnalysis';
import ActionCenter from './pages/ActionCenter';
import AlertCenter from './pages/AlertCenter';
import ROIDashboard from './pages/ROIDashboard';
import DigitalTwin from './pages/DigitalTwin';
import EquipmentIntelligence from './pages/EquipmentIntelligence';
import SafetyIntelligence from './pages/SafetyIntelligence';
import IncidentManagement from './pages/IncidentManagement';
import AIIntelligence from './pages/AIIntelligence';
import AuditLog from './pages/AuditLog';
import SystemArchitecture from './pages/SystemArchitecture';
import GlobalBackgroundCanvas from './components/3d/GlobalBackgroundCanvas';
import DemoTourHUD from './components/shared/DemoTourHUD';

function App() {
  const location = useLocation();

  return (
    <div className="flex h-screen overflow-hidden bg-[#07090E] relative">
      {/* Global 3D Ambient Spatial Mesh & Particle Field */}
      <GlobalBackgroundCanvas />

      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <TopBar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Navigate to="/command-center" replace />} />
              <Route path="/command-center" element={<CommandCenter />} />
              <Route path="/digital-twin" element={<DigitalTwin />} />
              <Route path="/reserve-intelligence" element={<ReserveIntelligence />} />
              <Route path="/production-forecast" element={<ProductionForecast />} />
              <Route path="/equipment" element={<EquipmentIntelligence />} />
              <Route path="/safety" element={<SafetyIntelligence />} />
              <Route path="/incidents" element={<IncidentManagement />} />
              <Route path="/ai-intelligence" element={<AIIntelligence />} />
              <Route path="/risk-analysis" element={<RiskAnalysis />} />
              <Route path="/action-center" element={<ActionCenter />} />
              <Route path="/alert-center" element={<AlertCenter />} />
              <Route path="/roi-dashboard" element={<ROIDashboard />} />
              <Route path="/audit-log" element={<AuditLog />} />
              <Route path="/architecture" element={<SystemArchitecture />} />
              <Route path="*" element={<Navigate to="/command-center" replace />} />
            </Routes>
          </AnimatePresence>
        </main>
        {/* Floating Presentation Demo Tour HUD */}
        <DemoTourHUD />

        {/* Mobile bottom navigation for handheld devices */}
        <MobileNav />
      </div>
    </div>
  );
}

export default App;
