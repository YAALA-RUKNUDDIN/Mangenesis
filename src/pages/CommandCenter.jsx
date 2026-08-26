import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Target,
  AlertTriangle,
  MapPin,
  TrendingUp,
  ChevronDown,
  Sparkles,
  Layers,
} from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import KPICard from '../components/shared/KPICard';
import AIInsightPanel from '../components/shared/AIInsightPanel';
import MineMap from '../components/maps/MineMap';
import ProductionForecastChart from '../components/charts/ProductionForecastChart';
import RiskBars from '../components/charts/RiskBars';
import AnimatedNumber from '../components/shared/AnimatedNumber';
import { useScenario } from '../context/ScenarioContext';

export default function CommandCenter() {
  const {
    activeMineData,
    activeScenario,
    switchScenario,
    scenarioData,
    forecastData,
    historicalData,
    availableScenarios,
    liveZones,
  } = useScenario();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const scenarioSelector = (
    <div className="relative z-[1500]">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2.5 bg-[#1A202C] hover:bg-[#262F3D] border border-[#262F3D] rounded-xl px-3.5 py-2 text-xs font-medium text-slate-200 transition-all cursor-pointer shadow-card relative"
      >
        <span className="text-slate-400 uppercase tracking-wider text-[10px] font-mono">
          Scenario:
        </span>
        <span className="text-white font-semibold">{scenarioData.label}</span>
        <ChevronDown size={14} className="text-slate-400" />
      </button>

      <AnimatePresence>
        {dropdownOpen && (
          <>
            {/* Click-outside backdrop */}
            <div
              className="fixed inset-0 z-[1550] bg-black/60 backdrop-blur-xs"
              onClick={() => setDropdownOpen(false)}
            />

            {/* Dropdown Popover */}
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-72 bg-[#131720] border border-[#262F3D] rounded-2xl py-2 shadow-popover z-[1600] overflow-hidden"
            >
              <div className="px-4 py-2 text-[10px] uppercase tracking-wider text-slate-400 font-mono font-bold border-b border-[#262F3D] mb-1">
                Select Operational Scenario
              </div>
              {availableScenarios.map((sc) => (
                <button
                  key={sc.id}
                  onClick={() => {
                    switchScenario(sc.id);
                    setDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-xs transition-colors flex items-center justify-between cursor-pointer ${
                    activeScenario === sc.id
                      ? 'bg-[#1A202C] text-white font-semibold border-l-2 border-[#C7B59F]'
                      : 'text-slate-300 hover:text-white hover:bg-[#1A202C]/60'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-slate-100">{sc.label}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{sc.description}</div>
                  </div>
                  {activeScenario === sc.id && (
                    <span className="w-2 h-2 rounded-full bg-[#C7B59F] shrink-0 ml-2" />
                  )}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );

  const zonesCount = (liveZones && liveZones.length) || (activeMineData.zones && activeMineData.zones.length) || 4;

  return (
    <PageLayout
      title="Mine Intelligence Overview"
      subtitle={`AI-powered space intelligence, reserve identification, and shortfall mitigation across ${activeMineData.name} and MOIL operations.`}
      rightContent={scenarioSelector}
    >
      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
        <KPICard
          title="Current Production"
          value={<AnimatedNumber value={scenarioData.currentProduction} suffix=" T" />}
          trend={scenarioData.productionChange}
          trendLabel="vs Daily Target"
          icon={Activity}
          delay={0}
        />
        <KPICard
          title="Production Target"
          value={`${scenarioData.targetProduction ? scenarioData.targetProduction.toLocaleString() : '10,000'} T`}
          subtitle="Daily Planned Output"
          icon={Target}
          delay={0.04}
        />
        <KPICard
          title="Shortfall Risk"
          value={<AnimatedNumber value={scenarioData.shortfallRisk} suffix="%" />}
          riskLevel={scenarioData.riskLevel}
          subtitle="Probability Severity"
          icon={AlertTriangle}
          delay={0.08}
        />
        <KPICard
          title="Target Sectors"
          value={`${zonesCount} Zones`}
          subtitle={activeMineData.geological_formation}
          icon={MapPin}
          delay={0.12}
        />
      </div>

      {/* Main Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* LEFT (7 Cols) — Reserve Map */}
        <div className="lg:col-span-7 flex flex-col space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-blue-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-200 font-mono">
                {activeMineData.name} Geospatial Map
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              {activeMineData.district}, {activeMineData.state} &bull; Live Telemetry
            </span>
          </div>

          <div className="rounded-2xl overflow-hidden border border-[#262F3D] shadow-card bg-[#0B0D12]">
            <MineMap
              height="540px"
              zones={liveZones}
              showControls={true}
              showLegend={true}
              showZonePanel={true}
            />
          </div>
        </div>

        {/* RIGHT (5 Cols) — Production & Risk */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          <div className="rounded-2xl border border-[#262F3D] bg-[#131720]/85 text-slate-100 shadow-card backdrop-blur-xl p-5">
            <div className="flex items-center justify-between mb-3.5 pb-3 border-b border-[#262F3D]">
              <div className="flex items-center gap-2">
                <TrendingUp size={15} className="text-blue-400" />
                <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-200 font-mono">
                  7-Day Production Forecast
                </h2>
              </div>
              <span className="text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold">
                LightGBM Regressor
              </span>
            </div>

            {/* Forecast Chart */}
            <ProductionForecastChart
              historicalData={historicalData.slice(-7)}
              forecastData={forecastData}
              height={180}
            />

            {/* AI Shortfall Alert Box */}
            <div className={`mt-4 p-3.5 rounded-xl border flex items-center justify-between ${
              scenarioData.expectedGap > 0
                ? 'bg-rose-500/10 border-rose-500/20'
                : 'bg-emerald-500/10 border-emerald-500/20'
            }`}>
              <div className="flex items-center gap-3">
                <AlertTriangle size={17} className={scenarioData.expectedGap > 0 ? 'text-rose-400 shrink-0' : 'text-emerald-400 shrink-0'} />
                <div>
                  <div className={`text-[10px] uppercase tracking-wider font-mono font-bold ${
                    scenarioData.expectedGap > 0 ? 'text-rose-400' : 'text-emerald-400'
                  }`}>
                    Shortfall Projection
                  </div>
                  <div className="text-sm font-bold font-mono text-white mt-0.5">
                    <AnimatedNumber value={scenarioData.shortfallRisk} suffix="% Probability" />
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">
                  Expected Deficit
                </div>
                <div className={`text-xs font-bold font-mono mt-0.5 ${
                  scenarioData.expectedGap > 0 ? 'text-rose-400' : 'text-emerald-400'
                }`}>
                  <AnimatedNumber value={scenarioData.expectedGap} suffix=" T" />
                </div>
              </div>
            </div>

            {/* Top Risk Drivers */}
            <div className="mt-4">
              <div className="text-[11px] uppercase tracking-wider font-mono font-bold text-slate-400 mb-2">
                Primary Risk Factors ({activeMineData.name})
              </div>
              <RiskBars drivers={scenarioData.riskDrivers} />
            </div>

            {/* AI Insight */}
            <div className="mt-4">
              <AIInsightPanel text={scenarioData.aiInsight} label="Operational Diagnostic" />
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
