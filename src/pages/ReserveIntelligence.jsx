import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers,
  Cpu,
  Info,
  ChevronDown,
  X,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import MineMap from '../components/maps/MineMap';
import { useScenario } from '../context/ScenarioContext';

export default function ReserveIntelligence() {
  const { activeMineData, liveZones } = useScenario();
  const zonesToUse = liveZones || activeMineData.zones || [];
  const [selectedZone, setSelectedZone] = useState(null);
  const [isFusionOpen, setIsFusionOpen] = useState(true);

  const fusionLayers = [
    { name: `${activeMineData.geological_formation}`, status: 'Active', color: '#3B82F6' },
    { name: `Core Drill Lithology (${activeMineData.drill_points ? activeMineData.drill_points.length : 4} Holes)`, status: 'Active', color: '#0EA5E9' },
    { name: 'Multispectral NDVI Alteration', status: 'Active', color: '#10B981' },
    { name: 'Soil Moisture Variations (SMAP)', status: 'Active', color: '#0EA5E9' },
    { name: 'Surface Thermal (MODIS LST)', status: 'Active', color: '#F59E0B' },
    { name: 'Precipitation Grid (NASA GPM)', status: 'Active', color: '#6366F1' },
  ];

  return (
    <PageLayout
      title="Reserve Intelligence"
      subtitle={`AI-assisted identification of manganese exploration targets through spatial multi-band satellite data fusion across ${activeMineData.name}.`}
      className="h-[calc(100vh-64px)] flex flex-col p-6 !pb-4"
    >
      {/* Immersive GIS Map */}
      <div className="relative flex-1 w-full rounded-2xl overflow-hidden border border-slate-800 bg-[#080B11] shadow-2xl">
        <MineMap
          height="100%"
          zones={zonesToUse}
          showControls={true}
          showLegend={true}
          showZonePanel={true}
          selectedZone={selectedZone}
          onZoneSelect={setSelectedZone}
          className="h-full border-0"
        />

        {/* Floating Left Panel: Data Fusion Streams */}
        <div className="absolute top-4 left-4 z-[1000] pointer-events-auto">
          <AnimatePresence mode="wait">
            {isFusionOpen ? (
              <motion.div
                key="fusion-panel"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="w-84 bg-[#0E131F]/95 backdrop-blur-2xl border border-slate-800 rounded-2xl p-4 shadow-popover max-h-[calc(100vh-150px)] overflow-y-auto"
              >
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                      <Layers size={13} />
                    </div>
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-200 font-mono">
                      Data Fusion Streams
                    </h2>
                  </div>
                  <button
                    onClick={() => setIsFusionOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Minimize Data Fusion Panel"
                  >
                    <X size={14} />
                  </button>
                </div>

                {/* Active Data Streams */}
                <div className="py-3 space-y-1.5 border-b border-slate-800">
                  {fusionLayers.map((layer) => (
                    <div
                      key={layer.name}
                      className="flex items-center justify-between p-2 rounded-xl bg-[#080B11] border border-slate-800/80 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full shrink-0 shadow-sm"
                          style={{ backgroundColor: layer.color }}
                        />
                        <span className="text-slate-300 font-medium text-[11px] truncate max-w-[170px]">{layer.name}</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.2 rounded">
                        {layer.status}
                      </span>
                    </div>
                  ))}
                </div>

                {/* AI Model Status */}
                <div className="pt-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Cpu size={14} className="text-blue-400" />
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200 font-mono">
                      Reserve Model Status
                    </h3>
                  </div>

                  <div className="p-3 bg-[#080B11] border border-slate-800 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Architecture:</span>
                      <span className="font-mono text-slate-200 font-semibold">XGBoost Classifier</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Model ROC-AUC:</span>
                      <span className="font-mono text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.2 rounded">0.8825</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Calibration Site:</span>
                      <span className="font-mono text-slate-300">{activeMineData.name}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Assay Logs:</span>
                      <span className="font-mono text-slate-300">{activeMineData.drill_points ? activeMineData.drill_points.length : 4} Holes Linked</span>
                    </div>
                  </div>
                </div>

                {/* Summary Info */}
                <div className="mt-3.5 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-start gap-2.5 text-xs">
                  <Info size={15} className="text-blue-400 shrink-0 mt-0.5" />
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Click any deposit zone or drill core pin on the map to inspect mineral assay grades and estimated recoverable tonnage.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.button
                key="fusion-button"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                onClick={() => setIsFusionOpen(true)}
                className="flex items-center gap-2 bg-[#0E131F]/90 hover:bg-[#141C2E] border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-200 shadow-popover transition-all cursor-pointer backdrop-blur-xl"
              >
                <Layers size={14} className="text-blue-400" />
                <span>Show Data Fusion Streams</span>
                <ChevronDown size={14} className="text-slate-400 -rotate-90 ml-1" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageLayout>
  );
}
