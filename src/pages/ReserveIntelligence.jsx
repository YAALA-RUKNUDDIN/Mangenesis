import { useState } from 'react';
import {
  Layers,
  Cpu,
  Activity,
  Compass,
  Database,
  ArrowRight,
  ShieldCheck,
  Info,
  Maximize2,
  Sliders,
  Filter,
  Drill,
  ExternalLink,
} from 'lucide-react';
import { useScenario } from '../context/ScenarioContext';
import KPICard from '../components/ui/KPICard';
import Button from '../components/ui/Button';
import StatusBadge from '../components/ui/StatusBadge';
import Drawer from '../components/ui/Drawer';
import ConfidenceIndicator from '../components/ui/ConfidenceIndicator';
import MineMap from '../components/maps/MineMap';

export default function ReserveIntelligence() {
  const { activeMineData, activeMine } = useScenario();

  // Selected Zone Drawer State
  const [selectedZone, setSelectedZone] = useState(null);
  const [selectedStrata, setSelectedStrata] = useState('all');
  const [activeModel, setActiveModel] = useState('kriging_xgb'); // 'kriging_xgb' | 'random_forest' | 'bayesian'
  const [confidenceCutoff, setConfidenceCutoff] = useState(70);

  // Default selected zone if none clicked
  const defaultZoneData = {
    id: 'ZONE-A1',
    name: 'North-East Strike Extension (G-01)',
    estimated_volume_mt: '1.84 Mt',
    avg_grade_mn: '43.2% Mn',
    unfc_class: 'UNFC 111',
    confidence: 91.4,
    depth_m: '65m – 115m',
    nearest_drillholes: ['DP-G01 (44.8% Mn)', 'DP-G02 (42.1% Mn)'],
    indicators: [
      { name: 'Sentinel-2 Band 11/12 Ratio', value: '2.18 (Strong Alteration)', weight: '+34%' },
      { name: 'Core Assay Intercept', value: '18.5m true thickness', weight: '+28%' },
      { name: 'Magnetic Anomaly High', value: '+140 nT above background', weight: '+18%' },
      { name: 'Hydrological Porosity', value: 'Low saturation index', weight: '+12%' },
    ],
    recommendation: 'Priority excavation bench. Grade exceeds commercial threshold by +8.2% Mn. Proceed with blast design.',
  };

  const activeZoneDetail = selectedZone || defaultZoneData;

  // Feature Importance Drivers (Section 28)
  const explainabilityFeatures = [
    { name: 'Geological Structure & Fault Mapping', contribution: 34, color: 'bg-amber-400' },
    { name: 'Manganese Spectral Response (SWIR 11/12)', contribution: 22, color: 'bg-sky-400' },
    { name: 'Drillhole Assay Composite Grade', contribution: 18, color: 'bg-emerald-400' },
    { name: 'Terrain Slope & SRTM Morphology', contribution: 11, color: 'bg-amber-300' },
    { name: 'Soil Moisture & Clay Index', contribution: 8, color: 'bg-sky-300' },
    { name: 'Geophysical Resistivity', contribution: 7, color: 'bg-slate-400' },
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* ===================== HEADER & OPERATIONAL CONTROLS ===================== */}
      <div className="bg-[#0D111A] border border-[#243046] rounded-[14px] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold font-mono text-white tracking-tight">
              Reserve Intelligence Console
            </h1>
            <StatusBadge status="unfc111" label="UNFC 1997/2009 CALIBRATED" size="xs" />
          </div>
          <p className="text-xs text-slate-400 mt-1">
            AI-assisted reserve mapping, geostatistical Ordinary Kriging, and multi-spectral anomaly detection for {activeMineData.name || 'Gumgaon Mine'}.
          </p>
        </div>

        {/* Console Filters */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <div className="flex items-center gap-1.5 bg-[#121824] px-2.5 py-1.5 rounded-[8px] border border-[#243046]">
            <span className="text-slate-500 text-[10px]">MODEL:</span>
            <select
              value={activeModel}
              onChange={(e) => setActiveModel(e.target.value)}
              className="bg-[#121824] text-slate-100 focus:outline-none cursor-pointer text-xs font-mono"
            >
              <option value="kriging_xgb" className="bg-[#0D111A] text-slate-100 py-1.5">3D Kriging + XGBoost (Ensemble)</option>
              <option value="random_forest" className="bg-[#0D111A] text-slate-100 py-1.5">Random Forest Classifier</option>
              <option value="bayesian" className="bg-[#0D111A] text-slate-100 py-1.5">Bayesian LST Inversion</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-[#121824] px-2.5 py-1.5 rounded-[8px] border border-[#243046]">
            <span className="text-slate-500 text-[10px]">CONFIDENCE CUTOFF:</span>
            <span className="text-amber-400 font-bold">{confidenceCutoff}%</span>
            <input
              type="range"
              min="50"
              max="95"
              value={confidenceCutoff}
              onChange={(e) => setConfidenceCutoff(Number(e.target.value))}
              className="w-16 accent-amber-400 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* ===================== 4 PRIMARY KPI CARDS ===================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Estimated Reserve"
          value="4.82"
          unit="Mt"
          trend={{ value: "+4.2% YTD", positive: true }}
          context="UNFC 111 (3.1 Mt) + UNFC 122 (1.7 Mt)"
          timestamp="Updated 14m ago"
          variant="mineral"
          icon={Layers}
        />
        <KPICard
          title="Reserve Confidence"
          value="89.4"
          unit="%"
          trend={{ value: "High Reliability", positive: true }}
          context="Kriging Variance σ² ≤ 8.4"
          timestamp="XGBoost Ensemble"
          variant="intelligence"
          icon={ShieldCheck}
        />
        <KPICard
          title="Average Ore Grade"
          value="41.8"
          unit="% Mn"
          trend={{ value: "Commercial Grade", positive: true }}
          context="Cutoff: 25% Mn • High-grade reef"
          timestamp="Lab assay verified"
          icon={Activity}
        />
        <KPICard
          title="Exploration Targets"
          value="5"
          unit="Zones"
          trend={{ value: "2 High Potential", positive: true }}
          context="Eastern strike expansion active"
          timestamp="Sentinel-2 SWIR"
          icon={Compass}
        />
      </div>

      {/* ===================== MAIN MAP CONTAINER (60-70% VISUAL FOCUS) ===================== */}
      <div className="bg-[#0D111A] border border-[#243046] rounded-[16px] overflow-hidden">
        {/* Map Header Toolbar */}
        <div className="p-3.5 bg-[#0A0D14] border-b border-[#1C2536] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-white font-mono uppercase tracking-wide">
              Interactive Geospatial Reserve Map & Satellite Telemetry
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="text-slate-300 text-[11px]">UNFC 111 Measured</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span className="text-slate-300 text-[11px]">UNFC 122 Indicated</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
              <span className="text-slate-300 text-[11px]">UNFC 333 Inferred</span>
            </div>
          </div>
        </div>

        {/* Map Viewport with interactive zone selector */}
        <div className="relative h-[560px] w-full">
          <MineMap
            height="100%"
            className="w-full h-full"
            onSelectZone={(zone) => setSelectedZone(zone)}
          />

          {/* Floating Zone Inspection Prompt Banner */}
          <div className="absolute top-4 left-4 z-[999] bg-[#0D111A]/90 backdrop-blur-md border border-[#243046] p-3 rounded-[10px] shadow-xl max-w-xs font-mono text-xs">
            <div className="text-[10px] text-amber-400 uppercase font-bold mb-1">
              Interactive Exploration
            </div>
            <p className="text-slate-300 leading-snug">
              Click on any reserve zone polygon or diamond drillhole collar to trigger deep subsurface intelligence drawer.
            </p>
            <Button
              size="sm"
              variant="secondary"
              className="mt-2 w-full text-[11px]"
              onClick={() => setSelectedZone(defaultZoneData)}
            >
              Inspect Active Strike Zone (G-01)
            </Button>
          </div>
        </div>
      </div>

      {/* ===================== SUBSURFACE CROSS-SECTION & AI EXPLAINABILITY ===================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Subsurface Geological Cross-Section (7 cols) */}
        <div className="lg:col-span-7 bg-[#0D111A] border border-[#243046] rounded-[16px] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#1C2536] pb-3">
            <div className="flex items-center gap-2 font-mono">
              <Layers className="w-4 h-4 text-sky-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Geological Subsurface Cross-Section (NW–SE Strike)
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Scale: 1:2500 • Vertical 2x</span>
          </div>

          {/* Visual Stratigraphic Column Diagram */}
          <div className="bg-[#07090E] border border-[#1C2536] rounded-[10px] p-4 space-y-3 font-mono">
            {/* Surface level */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 pb-1 border-b border-dashed border-slate-700">
              <span>Surface Datum: +320m RL</span>
              <span>Open-cast Pit Edge</span>
            </div>

            {/* Overburden Layer */}
            <div className="bg-[#121824] border border-slate-700/80 rounded-[8px] p-3 flex items-center justify-between">
              <div>
                <div className="text-slate-400 text-[10px] uppercase font-bold">0m to -35m • Hanging Wall Cap</div>
                <div className="text-white text-xs font-medium">Chorbaoli Quartzite & Weathered Regolith</div>
              </div>
              <span className="text-slate-500 text-xs">Barren (0% Mn)</span>
            </div>

            {/* Primary Braunite Manganese Ore Reef */}
            <div className="bg-gradient-to-r from-amber-500/20 to-amber-600/10 border-2 border-amber-500/60 rounded-[8px] p-3 flex items-center justify-between shadow-lg">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-amber-400 text-[10px] uppercase font-bold">
                    -35m to -110m • Manganiferous Ore Body
                  </span>
                  <StatusBadge status="unfc111" label="UNFC 111" size="xs" />
                </div>
                <div className="text-white text-sm font-bold flex items-center gap-2 mt-0.5">
                  <span>Primary Braunite + Pyrolusite Bed</span>
                  <span className="text-amber-300 font-mono text-xs bg-amber-400/20 px-2 py-0.5 rounded">
                    41.8% – 44.8% Mn
                  </span>
                </div>
                <div className="text-[11px] text-slate-300 mt-1">
                  Intersected by core holes DP-G01 (68m-86m) & DP-G02 (72m-90m). True thickness: 18.5m.
                </div>
              </div>
              <div className="text-right">
                <div className="text-amber-400 font-bold text-sm">4.82 Mt</div>
                <div className="text-[10px] text-slate-400">In-situ reserve</div>
              </div>
            </div>

            {/* Basement Footwall */}
            <div className="bg-[#121824] border border-slate-700/80 rounded-[8px] p-3 flex items-center justify-between">
              <div>
                <div className="text-slate-400 text-[10px] uppercase font-bold">-110m to -250m • Footwall Host</div>
                <div className="text-slate-300 text-xs font-medium">Mansar Formation (Garnetiferous Muscovite Schist)</div>
              </div>
              <span className="text-slate-500 text-xs">FoS: 1.48 (DGMS Approved)</span>
            </div>
          </div>
        </div>

        {/* AI Explainability & Confidence Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Feature Drivers Section (Section 28) */}
          <div className="bg-[#0D111A] border border-[#243046] rounded-[16px] p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1C2536] pb-3">
              <div className="flex items-center gap-2 font-mono">
                <Cpu className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Geological & ML Attribution (SHAP Analysis)
                </h3>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Why did the model classify this zone as high-confidence commercial manganese reserve?
            </p>

            <div className="space-y-3 font-mono">
              {explainabilityFeatures.map((feat) => (
                <div key={feat.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 text-[11px] truncate max-w-[220px]">
                      {feat.name}
                    </span>
                    <span className="text-white font-bold text-[11px]">+{feat.contribution}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#1C2536] overflow-hidden">
                    <div
                      className={`h-full rounded-full ${feat.color}`}
                      style={{ width: `${feat.contribution * 2.2}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Model Transparency & Freshness Card */}
          <ConfidenceIndicator
            score={89}
            level="High"
            coverage={91}
            uncertainty="±3.8%"
            updated="14m ago"
          />
        </div>
      </div>

      {/* ===================== SIDE INTELLIGENCE DRAWER ===================== */}
      <Drawer
        isOpen={Boolean(selectedZone)}
        onClose={() => setSelectedZone(null)}
        title={activeZoneDetail.name || 'Reserve Zone Intelligence'}
        subtitle={`Spatial Boundary ID: ${activeZoneDetail.id || 'ZONE-A1'}`}
        badge={<StatusBadge status="unfc111" label={activeZoneDetail.unfc_class || 'UNFC 111'} size="xs" />}
        footer={
          <div className="flex items-center gap-2 w-full">
            <Button
              variant="secondary"
              size="sm"
              className="flex-1"
              onClick={() => setSelectedZone(null)}
            >
              Close
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="flex-1"
              onClick={() => alert(`Operational drill schedule pinned for ${activeZoneDetail.name}`)}
            >
              Schedule Infill Drilling
            </Button>
          </div>
        }
      >
        <div className="space-y-4 font-mono text-xs">
          {/* Key Attributes Grid */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-[#121824] p-3 rounded-[8px] border border-[#1C2536]">
              <span className="text-slate-400 text-[10px] block">ESTIMATED VOLUME</span>
              <span className="text-white font-bold text-sm">
                {activeZoneDetail.estimated_volume_mt || '1.84 Mt'}
              </span>
            </div>
            <div className="bg-[#121824] p-3 rounded-[8px] border border-[#1C2536]">
              <span className="text-slate-400 text-[10px] block">AVERAGE GRADE</span>
              <span className="text-amber-400 font-bold text-sm">
                {activeZoneDetail.avg_grade_mn || '43.2% Mn'}
              </span>
            </div>
            <div className="bg-[#121824] p-3 rounded-[8px] border border-[#1C2536]">
              <span className="text-slate-400 text-[10px] block">DEPTH HORIZON</span>
              <span className="text-slate-200 font-bold">
                {activeZoneDetail.depth_m || '65m – 115m'}
              </span>
            </div>
            <div className="bg-[#121824] p-3 rounded-[8px] border border-[#1C2536]">
              <span className="text-slate-400 text-[10px] block">MODEL CONFIDENCE</span>
              <span className="text-emerald-400 font-bold">
                {activeZoneDetail.confidence || 91.4}%
              </span>
            </div>
          </div>

          {/* Nearest Drill Core Intercepts */}
          <div className="bg-[#121824] p-3.5 rounded-[8px] border border-[#1C2536] space-y-2">
            <span className="text-[10px] font-semibold text-sky-400 uppercase tracking-wider block">
              Nearest Core Hole Assays
            </span>
            <div className="space-y-1 text-slate-300">
              {(activeZoneDetail.nearest_drillholes || []).map((dh, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Drill className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{dh}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Contributing Remote Sensing & Geophysical Indicators */}
          <div className="bg-[#121824] p-3.5 rounded-[8px] border border-[#1C2536] space-y-2">
            <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider block">
              Contributing Satellite & Earth Indicators
            </span>
            <div className="space-y-2">
              {(activeZoneDetail.indicators || []).map((ind, idx) => (
                <div key={idx} className="flex items-center justify-between text-[11px] pb-1 border-b border-slate-800 last:border-0">
                  <span className="text-slate-300">{ind.name}</span>
                  <span className="text-emerald-400 font-bold">{ind.weight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Operational Recommendation */}
          <div className="bg-amber-500/10 border border-amber-500/30 p-3.5 rounded-[8px] space-y-1 text-slate-200">
            <span className="text-[10px] font-bold text-amber-400 uppercase">
              Recommended Operational Next Action
            </span>
            <p className="text-xs leading-relaxed">
              {activeZoneDetail.recommendation}
            </p>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
