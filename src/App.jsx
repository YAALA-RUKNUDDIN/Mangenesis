import { Routes, Route, useLocation } from 'react-router-dom';
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

function App() {
  const location = useLocation();

  return (
    <div className="flex h-screen overflow-hidden bg-genesis-dark">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <TopBar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<CommandCenter />} />
              <Route path="/reserve-intelligence" element={<ReserveIntelligence />} />
              <Route path="/production-forecast" element={<ProductionForecast />} />
              <Route path="/risk-analysis" element={<RiskAnalysis />} />
              <Route path="/action-center" element={<ActionCenter />} />
              <Route path="/alert-center" element={<AlertCenter />} />
            </Routes>
          </AnimatePresence>
        </main>
        {/* Mobile bottom navigation for handheld devices */}
        <MobileNav />
      </div>
    </div>
  );
}

export default App;
