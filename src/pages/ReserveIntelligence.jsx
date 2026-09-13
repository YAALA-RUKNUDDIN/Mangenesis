import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers,
  Box,
  Sparkles,
  Activity,
  CheckCircle2,
  Sliders,
  Maximize2,
  Compass,
  FileText,
  Search,
  ChevronRight,
  Database,
  ArrowRight,
} from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import RealLifeGeological3D from '../components/3d/RealLifeGeological3D';
import OriginCard from '../components/ui/OriginCard';
import { useScenario } from '../context/ScenarioContext';

export default function ReserveIntelligence() {
  const { activeMineData } = useScenario();
  const [selectedStrata, setSelectedStrata] = useState('all'); // 'all' | 'braunite' | 'schist' | 'quartzite'
  const [depthSlice, setDepthSlice] = useState(72); // 0m to 120m
  const [selectedCore, setSelectedCore] = useState(null);

  // Strata details dictionary for meaningful geological education & verification
  const strataInfo = {
    all: {
      name: 'Full Sausar Group Stratigraphic Column',
      classification: 'UNFC 111 (Proven) + UNFC 122 (Probable)',
      thickness: '120m Modeled Depth Window',
      oreGrade: '44.8% Mn (Average Commercial Ore)',
      tonnage: '4.82 MT Proven In-Situ Reserve',
      lithology: 'Muscovite-Biotite Schist, Gondite & Braunite Quartzite',
      remoteSensing: 'Sentinel-2 SWIR 11/12 (Ratio 2.18) & RISAT-1A SAR',
      prognosis: '14.2% prospective reserve expansion along eastern strike extension towards Chikla.',
      status: 'EXPLORATION VALIDATED',
      stripRatio: '1 : 4.2 (m³ waste / T ore)',
    },
    braunite: {
      name: 'Primary Braunite Manganese Ore Lenses',
      classification: 'Commercial Metallurgical Grade Mn Ore',
      thickness: '18.5m Average True Vein Thickness',
      oreGrade: '44.8% Mn, 5.2% Fe, 0.12% P, 6.2% SiO₂',
      tonnage: '4.82 MT In-Situ Mineable Reserves',
      lithology: 'Dense crystalline Braunite with Pyrolusite veinlets',
      remoteSensing: 'Ferrous Iron absorption dip at Band 12 (2190nm)',
      prognosis: 'Target drilling on 96% AI confidence envelope avoids 6 dry boreholes (saves ₹76.5L).',
      status: 'HIGH-PRIORITY EXTRACTION',
      stripRatio: 'Zero internal waste in core zone',
    },
    schist: {
      name: 'Mansar Formation (Footwall Host Rock)',
      classification: 'Competent Metamorphic Basement Host',
      thickness: '45.0m Basal Unit Thickness',
      oreGrade: '< 4.5% Mn (Disseminated sub-economic)',
      tonnage: 'Barren Footwall Buffer',
      lithology: 'Garnetiferous Muscovite-Biotite Schist (RQD: 82%)',
      remoteSensing: 'Clay mineral absorption peaks in SWIR Band 11',
      prognosis: 'Stable footwall dip angle (55° SE) supports safe bench design at DGMS FoS 1.48.',
      status: 'GEOTECHNICAL STABILITY BENCHMARK',
      stripRatio: 'Host rock structural support',
    },
    quartzite: {
      name: 'Chorbaoli Quartzite Cap (Hanging Wall)',
      classification: 'Overburden Rock Strata',
      thickness: '0m – 35m from Surface',
      oreGrade: '0% Mn (Non-mineralized Arenite)',
      tonnage: '12.4 Million m³ Stripping Volume',
      lithology: 'Vitreous Microcrystalline Quartzite & Weathered Regolith',
      remoteSensing: 'High optical reflectance in visible and NIR bands',
      prognosis: 'Ripping and pre-splitting blast optimization reduces secondary fragmentation cost by 18%.',
      status: 'ACTIVE STRIPPING OVERBURDEN',
      stripRatio: 'Main contributor to 1:4.2 strip ratio',
    },
  };

  const currentStrata = strataInfo[selectedStrata] || strataInfo.all;

  // Active depth slice interpretation
  const getDepthSummary = (depth) => {
    if (depth <= 35) {
      return {
        zone: 'Quartzite Cap & Overburden Strata',
        desc: `At ${depth}m depth: Surface stripping zone. Waste rock pre-stripping benches active.`,
        intercepts: 'Boreholes DP-G04 & DP-G05 collar zone',
        gradeColor: 'text-slate-400',
        gradeVal: 'Barren Cap (0% Mn)',
      };
    } else if (depth <= 88) {
      return {
        zone: 'Primary Braunite Ore Body Intercept',
        desc: `At ${depth}m depth: Penetrating high-grade manganese lens. Confirmed by diamond core DP-G01 (68m-86m).`,
        intercepts: 'Core DP-G01 (44.8% Mn) & Core DP-G02 (42.1% Mn)',
        gradeColor: 'text-[#C7B59F]',
        gradeVal: 'High-Grade Ore (44.8% Mn)',
      };
    } else {
      return {
        zone: 'Mansar Schist Footwall & Deep Transition',
        desc: `At ${depth}m depth: Approaching deep footwall contact. F2 synformal fold axis continuation.`,
        intercepts: 'Deep core DP-G06 exploratory tail (145m planned)',
        gradeColor: 'text-emerald-400',
        gradeVal: 'Exploratory Extension',
      };
    }
  };

  const depthInfo = getDepthSummary(depthSlice);

  return (
    <PageLayout
      title="Subsurface Reserve Intelligence & Geological Twin"
      subtitle={`Volumetric 3D ore body modeling, UNFC-111 resource confidence, and multispectral drill validation for ${activeMineData.name}.`}
      className="p-6 lg:p-8 max-w-[1700px] mx-auto space-y-6"
    >
      {/* 1. PURPOSE & VALUE BANNER (Answers 'What is the use of this map?') */}
      <div className="rounded-2xl border border-[#C7B59F]/30 bg-gradient-to-r from-[#C7B59F]/10 via-[#131720] to-[#131720] p-4 sm:p-5 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#C7B59F]/20 border border-[#C7B59F]/40 flex items-center justify-center text-[#E8DFD1] shrink-0">
              <Box size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#C7B59F] px-2 py-0.5 rounded bg-[#C7B59F]/10 border border-[#C7B59F]/20">
                  HOW THIS MAP CREATES VALUE FOR MOIL
                </span>
                <span className="text-xs font-bold text-white font-mono">
                  Orbital SWIR + SAR Predictive Drill Planning
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Traditional exploration drills speculative 50m blind grids costing <strong className="text-white font-mono">₹8,500 / meter</strong>. MANGENESIS pairs Sentinel-2 SWIR bands 11/12 with ISRO RISAT-1A SAR to model subsurface manganese lenses before drilling — <strong className="text-emerald-400 font-mono">saving ₹76.5 Lakhs per mine</strong> in avoided dry boreholes.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="px-3.5 py-2 rounded-xl bg-[#0B0D12] border border-[#262F3D] text-center font-mono">
              <span className="text-[10px] text-slate-400 block uppercase">Commercial Lift</span>
              <span className="text-xs font-bold text-emerald-400">6 Dry Holes Avoided</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. EXECUTIVE METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <OriginCard glowColor="rgba(199, 181, 159, 0.2)" borderColor="rgba(199, 181, 159, 0.35)" className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400">Proven Reserves</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold">
              UNFC 111
            </span>
          </div>
          <div className="text-3xl font-extrabold font-mono text-white mt-2.5">
            4.82 <span className="text-base font-normal text-slate-400">MT</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5">Confirmed via 6 diamond core assay stations</p>
        </OriginCard>

        <OriginCard glowColor="rgba(199, 181, 159, 0.2)" borderColor="rgba(199, 181, 159, 0.35)" className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400">Mean Manganese Grade</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#C7B59F]/20 text-[#E8DFD1] border border-[#C7B59F]/30 font-bold">
              METALLURGICAL
            </span>
          </div>
          <div className="text-3xl font-extrabold font-mono text-[#E8DFD1] mt-2.5">
            44.8<span className="text-base font-normal text-slate-400">% Mn</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5">Braunite dominant with low phosphorus (0.12%)</p>
        </OriginCard>

        <OriginCard glowColor="rgba(56, 189, 248, 0.2)" borderColor="rgba(56, 189, 248, 0.3)" className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400">Stripping Ratio</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/15 text-sky-400 border border-sky-500/30 font-bold">
              OPTIMAL
            </span>
          </div>
          <div className="text-3xl font-extrabold font-mono text-white mt-2.5">1 : 4.2</div>
          <p className="text-[11px] text-slate-400 mt-1.5">m³ waste per tonne of extracted ore</p>
        </OriginCard>

        <OriginCard glowColor="rgba(245, 158, 11, 0.2)" borderColor="rgba(245, 158, 11, 0.3)" className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400">Ore Strike Extension</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold">
              EXPANDING
            </span>
          </div>
          <div className="text-3xl font-extrabold font-mono text-white mt-2.5">
            1,450 <span className="text-base font-normal text-slate-400">m</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5">+80m eastward extension confirmed at DP-G06</p>
        </OriginCard>
      </div>

      {/* 3. INTERACTIVE 3D EXPLORER & STRATA/DEPTH CONTROLS */}
      <div className="rounded-3xl border border-[#262F3D] bg-[#0E1322] p-5 shadow-2xl space-y-4">
        {/* Interactive Controls Bar: Strata Tabs + Depth Slice Slider */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-3.5 rounded-2xl bg-[#131720] border border-[#262F3D]">
          {/* Strata Tabs */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono text-slate-400 mr-1 flex items-center gap-1.5">
              <Layers size={13} className="text-[#C7B59F]" />
              <span>Strata Layer:</span>
            </span>
            {[
              { id: 'all', label: 'All Strata Column' },
              { id: 'braunite', label: 'Manganese Lenses (Braunite)' },
              { id: 'schist', label: 'Mansar Schist' },
              { id: 'quartzite', label: 'Quartzite Cap' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedStrata(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${
                  selectedStrata === tab.id
                    ? 'bg-[#C7B59F] text-[#0B0D12] shadow-md font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Depth Slicer */}
          <div className="flex items-center gap-3 w-full lg:w-auto bg-[#0B0D12] px-4 py-2 rounded-xl border border-[#262F3D]">
            <span className="text-xs font-mono text-slate-400 uppercase font-bold shrink-0">
              DEPTH SLICE:
            </span>
            <input
              type="range"
              min="0"
              max="120"
              step="2"
              value={depthSlice}
              onChange={(e) => setDepthSlice(Number(e.target.value))}
              className="w-36 sm:w-48 accent-[#C7B59F] cursor-pointer"
            />
            <span className="text-xs font-mono font-bold text-[#E8DFD1] w-12 text-right">
              {depthSlice}m
            </span>
          </div>
        </div>

        {/* Dynamic Depth Horizon Feedback Strip */}
        <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-[#0B0D12] border border-[#262F3D] text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C7B59F] animate-pulse" />
            <span className="text-slate-300 font-bold">{depthInfo.zone}</span>
            <span className="text-slate-500">&bull;</span>
            <span className="text-slate-400">{depthInfo.desc}</span>
          </div>
          <span className={`font-bold ${depthInfo.gradeColor} shrink-0 hidden sm:inline`}>
            {depthInfo.gradeVal}
          </span>
        </div>

        {/* 3D WebGL Geological Block Canvas */}
        <div className="rounded-2xl overflow-hidden border border-[#262F3D]">
          <RealLifeGeological3D
            height="580px"
            selectedStrata={selectedStrata}
            depthSlice={depthSlice}
            onSelectCore={setSelectedCore}
          />
        </div>

        {/* 4. DYNAMIC FORMATION METADATA CARDS (Updates when Strata is clicked!) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Lithology Details */}
          <div className="p-4 rounded-xl bg-[#0B0D12] border border-[#262F3D] space-y-2">
            <div className="flex items-center gap-2 pb-2 border-b border-[#1F2937]">
              <Box size={14} className="text-[#C7B59F]" />
              <h4 className="text-xs font-mono font-bold uppercase text-white tracking-wider">
                Geological Lithology
              </h4>
            </div>
            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Target Formation:</span>
                <span className="text-slate-200 font-bold text-right truncate max-w-[180px]">{currentStrata.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Lithological Rock:</span>
                <span className="text-slate-300 text-right truncate max-w-[180px]">{currentStrata.lithology}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Assay Grade:</span>
                <span className="text-[#E8DFD1] font-bold">{currentStrata.oreGrade}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Modeled Tonnage:</span>
                <span className="text-emerald-400 font-bold">{currentStrata.tonnage}</span>
              </div>
            </div>
          </div>

          {/* Remote Sensing Validation */}
          <div className="p-4 rounded-xl bg-[#0B0D12] border border-[#262F3D] space-y-2">
            <div className="flex items-center gap-2 pb-2 border-b border-[#1F2937]">
              <Sparkles size={14} className="text-sky-400" />
              <h4 className="text-xs font-mono font-bold uppercase text-white tracking-wider">
                Multi-Band Remote Sensing
              </h4>
            </div>
            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Orbital Sensor:</span>
                <span className="text-slate-200">Sentinel-2 MSI + RISAT-1A</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Spectral Band:</span>
                <span className="text-sky-400 font-bold">SWIR Band 11/12 (Ratio 2.18)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Signature:</span>
                <span className="text-slate-300 text-right truncate max-w-[170px]">{currentStrata.remoteSensing}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Correlation:</span>
                <span className="text-emerald-400 font-bold">R² 0.942 with Core DP-G01</span>
              </div>
            </div>
          </div>

          {/* AI Prognosis & CapEx Lift */}
          <div className="p-4 rounded-xl bg-[#0B0D12] border border-[#262F3D] space-y-2">
            <div className="flex items-center gap-2 pb-2 border-b border-[#1F2937]">
              <Activity size={14} className="text-emerald-400" />
              <h4 className="text-xs font-mono font-bold uppercase text-white tracking-wider">
                AI Target Extension & Lift
              </h4>
            </div>
            <p className="text-xs text-slate-300 font-mono leading-relaxed">
              {currentStrata.prognosis}
            </p>
            <div className="pt-2 flex items-center justify-between border-t border-[#1F2937]">
              <span className="text-[10px] text-slate-400 font-mono">Target Status:</span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {currentStrata.status}
              </span>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
