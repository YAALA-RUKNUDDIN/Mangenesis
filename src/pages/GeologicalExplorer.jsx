import { useState } from 'react';
import {
  Compass,
  Layers,
  Filter,
  Sliders,
  Drill,
  Satellite,
  Info,
  ChevronRight,
  Maximize2,
  CheckSquare,
  Activity,
} from 'lucide-react';
import { useScenario } from '../context/ScenarioContext';
import MineMap from '../components/maps/MineMap';
import Button from '../components/ui/Button';
import StatusBadge from '../components/ui/StatusBadge';

export default function GeologicalExplorer() {
  const { activeMineData } = useScenario();

  // Filter States
  const [depthFilter, setDepthFilter] = useState(120); // 0m to 250m
  const [minGradeFilter, setMinGradeFilter] = useState(25); // 15% to 50% Mn
  const [selectedFormation, setSelectedFormation] = useState('mansar');
  const [activeLayerMode, setActiveLayerMode] = useState('all');

  const formations = {
    mansar: {
      name: 'Mansar Formation (Sausar Group)',
      lithology: 'Garnetiferous Muscovite-Biotite Schist with Braunite Bed',
      thickness: '45m – 65m true thickness',
      mineralization: 'Primary Manganese Ore Horizon (38%–46% Mn)',
      strikeDip: 'Strike N75°E, Dip 55° SSE',
      rqd: '84% (Competent crystalline host)',
      spectralSignal: 'Strong SWIR Band 11/12 ratio (2.18x background)',
    },
    chorbaoli: {
      name: 'Chorbaoli Quartzite (Hanging Wall)',
      lithology: 'Microcrystalline glassy quartzite and quartz schist',
      thickness: '30m – 45m cap',
      mineralization: 'Barren Country Rock (< 2% Mn)',
      strikeDip: 'Conformable over Mansar',
      rqd: '76% (Moderate blockiness)',
      spectralSignal: 'High visible/NIR reflectance',
    },
    tirodi: {
      name: 'Tirodi Gneissic Basement Complex',
      lithology: 'Biotite Gneiss and Amphibolite Granite',
      thickness: 'Basement rock (> 200m depth)',
      mineralization: 'Barren Basement Footwall',
      strikeDip: 'Regional basement fold axis',
      rqd: '92% (High structural stability)',
      spectralSignal: 'Low thermal anomaly differential',
    },
  };

  const activeFormationData = formations[selectedFormation] || formations.mansar;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Console Header */}
      <div className="bg-[#0D111A] border border-[#243046] rounded-[14px] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold font-mono text-white tracking-tight">
              Geological Explorer & Strata
            </h1>
            <StatusBadge status="intelligence" label="SPACE + SUBSURFACE" size="xs" />
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Map-first geological exploration console for structural fault analysis, multi-spectral band ratios, and depth bench filtering.
          </p>
        </div>

        {/* Global Depth & Grade Slider Controls */}
        <div className="flex flex-wrap items-center gap-4 font-mono text-xs">
          <div className="flex items-center gap-2 bg-[#121824] px-3 py-1.5 rounded-[8px] border border-[#243046]">
            <span className="text-slate-400 text-[10px]">DEPTH BENCH:</span>
            <span className="text-amber-400 font-bold">0m to -{depthFilter}m</span>
            <input
              type="range"
              min="30"
              max="250"
              step="10"
              value={depthFilter}
              onChange={(e) => setDepthFilter(Number(e.target.value))}
              className="w-20 accent-amber-400 cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-2 bg-[#121824] px-3 py-1.5 rounded-[8px] border border-[#243046]">
            <span className="text-slate-400 text-[10px]">CUTOFF GRADE:</span>
            <span className="text-emerald-400 font-bold">≥ {minGradeFilter}% Mn</span>
            <input
              type="range"
              min="15"
              max="45"
              step="1"
              value={minGradeFilter}
              onChange={(e) => setMinGradeFilter(Number(e.target.value))}
              className="w-16 accent-emerald-400 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* 3-Column Exploration Workspace (Left: Controls, Center: Map, Right: Selected Feature) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Layer Controls (3 cols) */}
        <div className="lg:col-span-3 bg-[#0D111A] border border-[#243046] rounded-[16px] p-5 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#1C2536] text-xs font-mono font-bold text-white uppercase tracking-wider">
            <Layers className="w-4 h-4 text-amber-400" />
            <span>Spectral & Strata Layers</span>
          </div>

          <div className="space-y-2">
            {[
              { id: 'all', name: 'All Geological Horizons', desc: 'Composite Sausar Group' },
              { id: 'alteration', name: 'SWIR 11/12 Mn Alteration', desc: 'Manganese spectral reflectance proxy' },
              { id: 'ndvi', name: 'Sentinel-2 NDVI Alteration', desc: 'Vegetation stress over mineral outcrops' },
              { id: 'drilling', name: 'Core Drill Collars Only', desc: 'High-density assay intersections' },
            ].map((layer) => (
              <button
                key={layer.id}
                onClick={() => setActiveLayerMode(layer.id)}
                className={`w-full text-left p-3 rounded-[8px] border transition-all cursor-pointer font-mono ${
                  activeLayerMode === layer.id
                    ? 'bg-[#172030] border-amber-500/40 text-amber-300 shadow-sm'
                    : 'bg-[#121824] border-[#1C2536] text-slate-400 hover:text-white hover:border-[#243046]'
                }`}
              >
                <div className="text-xs font-semibold">{layer.name}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{layer.desc}</div>
              </button>
            ))}
          </div>

          {/* Formations Selector */}
          <div className="pt-3 border-t border-[#1C2536] space-y-2">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
              Stratigraphic Formation Focus
            </span>
            <div className="space-y-1 text-xs font-mono">
              {Object.entries(formations).map(([key, form]) => (
                <button
                  key={key}
                  onClick={() => setSelectedFormation(key)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-[6px] transition-colors cursor-pointer ${
                    selectedFormation === key
                      ? 'bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {form.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center Column: Large Interactive Map (6 cols) */}
        <div className="lg:col-span-6 bg-[#0D111A] border border-[#243046] rounded-[16px] overflow-hidden">
          <div className="p-3 bg-[#0A0D14] border-b border-[#1C2536] flex items-center justify-between text-xs font-mono">
            <span className="text-slate-300 font-bold">
              EXPLORATION MAP • {activeMineData.name || 'Gumgaon'}
            </span>
            <span className="text-sky-400 text-[11px]">Filtered to -{depthFilter}m Depth</span>
          </div>
          <div className="h-[520px] w-full relative">
            <MineMap height="100%" className="w-full h-full" />
          </div>
        </div>

        {/* Right Column: Selected Geological Formation Attributes (3 cols) */}
        <div className="lg:col-span-3 bg-[#0D111A] border border-[#243046] rounded-[16px] p-5 space-y-4 font-mono">
          <div className="flex items-center gap-2 pb-2 border-b border-[#1C2536] text-xs font-bold text-white uppercase tracking-wider">
            <Activity className="w-4 h-4 text-sky-400" />
            <span>Lithological Attributes</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-[10px] text-slate-500 uppercase block">Formation Name</span>
              <span className="text-white font-bold text-sm">{activeFormationData.name}</span>
            </div>

            <div className="bg-[#121824] p-3 rounded-[8px] border border-[#1C2536] space-y-1">
              <span className="text-[10px] text-amber-400 uppercase font-semibold block">
                Primary Mineralization
              </span>
              <span className="text-slate-200 text-xs block">{activeFormationData.mineralization}</span>
            </div>

            <div className="space-y-2 text-[11px] pt-1">
              <div className="flex justify-between border-b border-[#1C2536] pb-1">
                <span className="text-slate-400">Rock Quality (RQD):</span>
                <span className="text-emerald-400 font-semibold">{activeFormationData.rqd}</span>
              </div>
              <div className="flex justify-between border-b border-[#1C2536] pb-1">
                <span className="text-slate-400">Vein Thickness:</span>
                <span className="text-white font-semibold">{activeFormationData.thickness}</span>
              </div>
              <div className="flex justify-between border-b border-[#1C2536] pb-1">
                <span className="text-slate-400">Strike / Dip:</span>
                <span className="text-slate-300 font-semibold">{activeFormationData.strikeDip}</span>
              </div>
            </div>

            <div className="bg-[#121824] p-3 rounded-[8px] border border-[#1C2536]">
              <span className="text-[10px] text-sky-400 uppercase font-semibold block mb-1">
                Sentinel-2 Spectral Signal
              </span>
              <p className="text-[11px] text-slate-300 leading-snug">
                {activeFormationData.spectralSignal}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
