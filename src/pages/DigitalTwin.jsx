import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers,
  Truck,
  AlertTriangle,
  CheckCircle2,
  Maximize2,
  Activity,
  Gauge,
  Thermometer,
  Radio,
  MapPin,
  X,
} from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import MineMap from '../components/maps/MineMap';
import { useScenario } from '../context/ScenarioContext';

export default function DigitalTwin() {
  const { equipmentList, activeMineData, scenarioData, simulationActive } = useScenario();
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [activeView, setActiveView] = useState('OPERATIONAL'); // 'OPERATIONAL' | 'SENSORS'

  return (
    <PageLayout
      title="In-Pit Digital Twin & Fleet Telematics Map"
      subtitle={`Geospatial digital twin of pit extraction benches, haul routes, and live assets • ${activeMineData.name}`}
      badge="DIGITAL TWIN"
    >
      <div className="space-y-4">
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-2xl bg-[#131720] border border-[#262F3D] gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400 mr-1">Layer Mode:</span>
            {['OPERATIONAL', 'SENSORS'].map((mode) => (
              <button
                key={mode}
                onClick={() => setActiveView(mode)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  activeView === mode
                    ? 'bg-[#C7B59F] text-[#1E1813] font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Normal</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Warning</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              <span>Critical</span>
            </span>
          </div>
        </div>

        {/* Main Map Container */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Left / Center Map View (3 Cols) */}
          <div className="lg:col-span-3 rounded-2xl overflow-hidden border border-[#262F3D] h-[540px] relative bg-[#0B0D12]">
            <MineMap />

            {/* In-Map Telemetry HUD Overlay */}
            <div className="absolute top-3 left-3 z-[1000] p-3 rounded-xl bg-[#0E121D]/90 backdrop-blur-md border border-[#262F3D] text-xs space-y-1.5 pointer-events-auto">
              <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">DIGITAL TWIN STATUS</div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-semibold text-white">7 Fleet Beacons Transmitting</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                Lat: {activeMineData.center?.[0] || 21.155}°N &bull; Lon: {activeMineData.center?.[1] || 79.090}°E
              </div>
            </div>
          </div>

          {/* Right Fleet Sidebar (1 Col) */}
          <div className="space-y-3 overflow-y-auto max-h-[540px] pr-1">
            <div className="px-2 py-1 flex items-center justify-between text-xs font-mono text-slate-400">
              <span>LIVE FLEET BEACONS</span>
              <span>{equipmentList.length} Units</span>
            </div>

            {equipmentList.map((asset) => {
              const isCrit = asset.status === 'CRITICAL';
              const isWarn = asset.status === 'WARNING';

              return (
                <div
                  key={asset.id}
                  onClick={() => setSelectedAsset(asset)}
                  className={`p-3 rounded-xl bg-[#131720] border transition-all cursor-pointer ${
                    isCrit
                      ? 'border-rose-500/50 hover:bg-rose-950/10'
                      : isWarn
                      ? 'border-amber-500/40 hover:bg-amber-950/10'
                      : 'border-[#262F3D] hover:border-[#C7B59F]/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white">{asset.name}</span>
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.2 rounded ${
                        isCrit ? 'bg-rose-500/20 text-rose-300' : isWarn ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                      }`}
                    >
                      {asset.status}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>{asset.zone}</span>
                    <span className="font-bold text-slate-200">{asset.healthScore}% Health</span>
                  </div>

                  <div className="mt-2 pt-2 border-t border-[#262F3D]/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>Temp: {asset.engineTempC}°C</span>
                    <span>Vib: {asset.vibrationMmS} mm/s</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Asset Inspection Modal */}
      <AnimatePresence>
        {selectedAsset && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#131720] border border-[#262F3D] rounded-3xl p-5 shadow-2xl space-y-3"
            >
              <div className="flex items-start justify-between pb-2 border-b border-[#262F3D]">
                <div>
                  <h3 className="font-display font-bold text-white text-base">{selectedAsset.name}</h3>
                  <p className="text-xs text-slate-400 font-mono">{selectedAsset.model} &bull; {selectedAsset.zone}</p>
                </div>
                <button
                  onClick={() => setSelectedAsset(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 rounded-xl bg-[#0B0D12] border border-[#262F3D]">
                  <span className="text-[10px] text-slate-400">HEALTH SCORE</span>
                  <div className="text-slate-100 font-bold">{selectedAsset.healthScore}%</div>
                </div>
                <div className="p-2 rounded-xl bg-[#0B0D12] border border-[#262F3D]">
                  <span className="text-[10px] text-slate-400">STATUS</span>
                  <div className="text-amber-300 font-bold">{selectedAsset.status}</div>
                </div>
                <div className="p-2 rounded-xl bg-[#0B0D12] border border-[#262F3D]">
                  <span className="text-[10px] text-slate-400">FAILURE RISK</span>
                  <div className="text-rose-400 font-bold">{selectedAsset.predictedFailureWindow}</div>
                </div>
                <div className="p-2 rounded-xl bg-[#0B0D12] border border-[#262F3D]">
                  <span className="text-[10px] text-slate-400">PRESSURE</span>
                  <div className="text-slate-100 font-bold">{selectedAsset.hydraulicPressureBar} bar</div>
                </div>
              </div>

              <p className="text-xs text-slate-300 p-2.5 rounded-xl bg-[#0B0D12] border border-[#262F3D]/60">
                {selectedAsset.failureRiskDescription}
              </p>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedAsset(null)}
                  className="px-4 py-1.5 rounded-xl bg-[#1A202C] hover:bg-[#262F3D] text-slate-200 text-xs font-semibold"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageLayout>
  );
}
