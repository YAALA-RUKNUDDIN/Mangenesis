import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Satellite,
  Compass,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Layers,
  Activity,
  Crosshair,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/ui/StatusBadge';

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [scanOffset, setScanOffset] = useState(0);

  // Subtle living geospatial telemetry loop
  useEffect(() => {
    const interval = setInterval(() => {
      setScanOffset((prev) => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const capabilities = [
    { label: 'Spatial AI Inference', icon: Cpu, desc: '3D Ordinary Kriging' },
    { label: 'Geospatial Radar', icon: Compass, desc: 'Structural Fault Mapping' },
    { label: 'Sentinel-2 Multispectral', icon: Satellite, desc: 'Iron-Oxide Indices' },
    { label: 'Production Continuity', icon: TrendingUp, desc: '30-Day Shortfall Horizon' },
    { label: 'Geotechnical Safety', icon: AlertTriangle, desc: 'DGMS Bench Stability' },
    { label: 'Action Prescriptions', icon: CheckCircle2, desc: 'Closed-Loop Recovery' },
  ];

  const workflowSteps = [
    {
      num: '01',
      title: 'Collect',
      subtitle: 'Multi-source Data Ingestion',
      desc: 'Ingests core drillhole assays, drone LiDAR surveys, Sentinel-2 MSI spectral bands, and fleet SCADA telemetry.',
      badge: 'Data Layer',
    },
    {
      num: '02',
      title: 'Analyze',
      subtitle: 'Lithology & Anomaly AI',
      desc: 'Machine learning algorithms detect manganese mineralization signatures, spectral alteration indices, and structural fault boundaries.',
      badge: 'Analytical Engine',
    },
    {
      num: '03',
      title: 'Predict',
      subtitle: 'Reserves & 30-Day Outlook',
      desc: '3D Kriging block modeling calculates grade volume according to UNFC standards, while time-series models project production trajectories.',
      badge: 'Prediction Model',
    },
    {
      num: '04',
      title: 'Explain',
      subtitle: 'SHAP Feature Drivers & Confidence',
      desc: 'Explainable AI breaks down which operational variables (rock mass rating, haul saturation, blast clearance) drive each forecast.',
      badge: 'Explainable AI',
    },
    {
      num: '05',
      title: 'Act',
      subtitle: 'Closed-Loop Prescriptions',
      desc: 'Prescriptive operational protocols recommend shovel reallocation, blast pattern densification, and wet-weather routing.',
      badge: 'Action Protocol',
    },
  ];

  const showcaseItems = [
    {
      id: 'reserve',
      title: 'Reserve Intelligence & UNFC Model',
      tagline: 'From geological signals to classified ore reserves.',
      desc: 'Transform scattered core drill logs and satellite reflectance into UNFC 111 (Measured), 122 (Indicated), and 333 (Inferred) ore block estimations with spatial confidence metrics.',
      cta: 'Explore Reserve Intelligence',
      path: '/app/reserve-intelligence',
      highlights: ['UNFC 1997/2009 Standards', 'Ordinary Kriging Variance', 'Discrete Block Grade % Mn', 'Subsurface Cross-Sections'],
    },
    {
      id: 'explorer',
      title: 'Geological Explorer & Strata',
      tagline: 'Multi-spectral satellite intelligence across the deposit.',
      desc: 'Sentinel-2 band ratio 11/12 analysis, iron-oxide alteration indices, land surface temperature mapping, and regional structural lineaments.',
      cta: 'Open Geological Explorer',
      path: '/app/geological-explorer',
      highlights: ['Band Ratio 11/12 Alteration', 'Sausar Group Formations', 'Bench Depth Slicing', 'Spectral Anomaly Pinpointing'],
    },
    {
      id: 'forecast',
      title: 'Production Forecast & Shortfall Horizon',
      tagline: '30-day production outlook calibrated to reality.',
      desc: 'Forecasting balances historical extraction velocity against equipment availability, ore availability, and rainfall hazards to spot shortfalls weeks before they occur.',
      cta: 'View Production Forecast',
      path: '/app/production-forecast',
      highlights: ['95% Confidence Bounds', 'Shortfall Gap Quantification', 'Multi-scenario Simulation', 'Daily Telemetry Recalibration'],
    },
    {
      id: 'risk',
      title: 'Risk Intelligence Matrix',
      tagline: 'Detect operational disruptions before they halt extraction.',
      desc: 'Dynamic risk matrix indexing excavator maintenance status, haul-road saturation indices, and blasting clearance delays with real-time severity scoring.',
      cta: 'Inspect Risk Intelligence',
      path: '/app/risk-intelligence',
      highlights: ['Dynamic Severity Scoring', 'Multi-horizon Projections', 'Root Cause Dissection', 'DGMS Compliance Safeguards'],
    },
    {
      id: 'action',
      title: 'Action Center & Prescriptions',
      tagline: 'Turn predictions into closed-loop operational actions.',
      desc: 'Do not stop at predictions. MANGENESIS delivers prescriptive interventions with quantified recovery potential, confidence scoring, and end-to-end execution tracking.',
      cta: 'Launch Action Center',
      path: '/app/recommendations',
      highlights: ['Quantified Recovery % Impact', 'Assignee Lifecycle Tracking', 'Pending-to-Complete Flow', 'Immutable Audit History'],
    },
  ];

  return (
    <div className="space-y-20 py-6">
      {/* ===================== HERO SECTION ===================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Hero Left Column: Editorial Engineering Typography */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[6px] bg-[#141924] border border-amber-500/35 text-amber-300 text-xs font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>GEOLOGICAL INTELLIGENCE & PRODUCTION CONTINUITY</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white font-mono leading-[1.08]">
              See the reserve.<br />
              <span className="text-amber-400">Predict the shortfall.</span><br />
              Act before production slips.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Mangenesis combines geological block modeling, satellite-derived spectral indicators, operational fleet telemetry, and machine learning to help MOIL mining teams identify manganese reserves, forecast production risk, and make operational decisions.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link to="/app/reserve-intelligence">
                <Button variant="primary" size="lg" iconRight={ArrowRight}>
                  Explore Reserve Intelligence
                </Button>
              </Link>
              <Link to="/app">
                <Button variant="secondary" size="lg">
                  Operational Console
                </Button>
              </Link>
            </div>

            {/* Subdued engineering metadata */}
            <div className="flex items-center gap-6 pt-4 text-xs font-mono text-slate-400 border-t border-[#1C2536]">
              <div className="flex items-center gap-2">
                <span className="text-amber-400 font-bold">MOIL</span>
                <span>Nagpur & Balaghat Belts</span>
              </div>
              <span className="text-slate-600">•</span>
              <div className="flex items-center gap-2">
                <span className="text-sky-400 font-bold">UNFC</span>
                <span>111/122/333 Compliance</span>
              </div>
              <span className="text-slate-600 hidden sm:inline">•</span>
              <div className="hidden sm:flex items-center gap-1.5 text-slate-400">
                <Crosshair className="w-3.5 h-3.5 text-emerald-400" />
                <span>21°24'N 79°01'E</span>
              </div>
            </div>
          </div>

          {/* Hero Right Column: Living Geospatial Intelligence Canvas */}
          <div className="lg:col-span-5">
            <div className="relative bg-[#0D111A] border border-[#243046] rounded-[14px] p-4 sm:p-5 shadow-2xl overflow-hidden">
              {/* Header bar of visualization */}
              <div className="flex items-center justify-between pb-3 border-b border-[#1C2536] mb-3 text-xs font-mono">
                <div className="flex items-center gap-2 text-slate-200">
                  <Compass className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-semibold text-white">Gumgaon Pit 4 • Spatial Strata</span>
                </div>
                <StatusBadge status="healthy" label="TELEMETRY SYNC" size="xs" />
              </div>

              {/* Living Strata / Topographic Canvas */}
              <div className="relative h-72 rounded-[8px] bg-[#07090E] border border-[#1C2536] overflow-hidden flex flex-col justify-between p-3.5 strata-grid">
                {/* Geological Topographic Contours (SVG with subtle animated drift) */}
                <svg
                  className="absolute inset-0 w-full h-full opacity-25 pointer-events-none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d={`M0,45 Q120,${20 + Math.sin(scanOffset * 0.05) * 8} 240,55 T480,35`}
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="1.2"
                    strokeDasharray="4 2"
                  />
                  <path
                    d={`M0,105 Q140,${90 + Math.cos(scanOffset * 0.05) * 6} 280,115 T480,95`}
                    fill="none"
                    stroke="#38BDF8"
                    strokeWidth="1"
                  />
                  <path
                    d={`M0,165 Q110,${155 + Math.sin(scanOffset * 0.06) * 5} 250,175 T480,150`}
                    fill="none"
                    stroke="#64748B"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                  <path
                    d={`M0,225 Q130,${210 + Math.cos(scanOffset * 0.04) * 7} 260,235 T480,215`}
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="1"
                  />
                </svg>

                {/* Subtle Horizontal Radar/Scan Line */}
                <div
                  className="absolute left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent pointer-events-none transition-all duration-75"
                  style={{ top: `${scanOffset}%` }}
                />

                {/* Geological Strata Layers (Domain Accurate) */}
                <div className="relative z-10 space-y-2 text-[11px] font-mono">
                  {/* Layer 1: Overburden */}
                  <div className="bg-[#0E131E]/95 border border-[#1C2536] p-2 rounded-[6px] flex items-center justify-between">
                    <div>
                      <div className="text-slate-400 text-[9px] uppercase tracking-wider">
                        SURFACE STRATA (0m to -40m)
                      </div>
                      <div className="text-slate-200 font-medium">Deccan Trap Basalt & Alluvium</div>
                    </div>
                    <span className="text-slate-400 text-[10px]">Overburden</span>
                  </div>

                  {/* Layer 2: Braunite Ore Reef (Primary Target) */}
                  <div className="bg-[#141924]/95 border border-amber-500/40 p-2.5 rounded-[6px] flex items-center justify-between shadow-sm">
                    <div>
                      <div className="text-amber-400 text-[9px] uppercase tracking-wider font-bold">
                        MANGANESE ORE REEF (-40m to -120m)
                      </div>
                      <div className="text-white font-semibold flex items-center gap-2">
                        <span>Braunite + Pyrolusite</span>
                        <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded text-[10px] font-bold num-tabular">
                          41.8% Mn
                        </span>
                      </div>
                    </div>
                    <span className="text-emerald-400 text-[10px] font-bold">UNFC 111</span>
                  </div>

                  {/* Layer 3: Barren Rock */}
                  <div className="bg-[#0E131E]/95 border border-[#1C2536] p-2 rounded-[6px] flex items-center justify-between">
                    <div>
                      <div className="text-slate-400 text-[9px] uppercase tracking-wider">
                        FOOTWALL COUNTRY ROCK (-120m+)
                      </div>
                      <div className="text-slate-300 font-medium">Sausar Mansar Schist / Quartzite</div>
                    </div>
                    <span className="text-slate-400 text-[10px]">Barren Rock</span>
                  </div>
                </div>

                {/* Active telemetry collars overlay */}
                <div className="relative z-10 pt-2 border-t border-[#1C2536] flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5 text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      DH-04: Active Core
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      DH-09: Assay Ready
                    </span>
                  </div>
                  <span className="text-sky-400">Sentinel-2 Synced</span>
                </div>
              </div>

              {/* Bottom Quick KPI preview with precise tabular formatting */}
              <div className="grid grid-cols-3 gap-2 mt-3 text-center font-mono">
                <div className="bg-[#0E131E] p-2 rounded-[6px] border border-[#1C2536]">
                  <span className="text-[9px] text-slate-400 block uppercase tracking-wider">EST. RESERVE</span>
                  <div className="text-sm font-bold text-white num-tabular">
                    4.82 <span className="text-[10px] font-normal text-slate-400">Mt</span>
                  </div>
                </div>
                <div className="bg-[#0E131E] p-2 rounded-[6px] border border-[#1C2536]">
                  <span className="text-[9px] text-slate-400 block uppercase tracking-wider">CONFIDENCE</span>
                  <div className="text-sm font-bold text-emerald-400 num-tabular">
                    89.4<span className="text-[10px] font-normal text-slate-400">%</span>
                  </div>
                </div>
                <div className="bg-[#0E131E] p-2 rounded-[6px] border border-[#1C2536]">
                  <span className="text-[9px] text-slate-400 block uppercase tracking-wider">30D SHORTFALL</span>
                  <div className="text-sm font-bold text-amber-400 num-tabular">
                    -4.2 <span className="text-[10px] font-normal text-slate-400">kt</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== HERO TRUST STRIP ===================== */}
      <section className="border-y border-[#1C2536] bg-[#0A0D14]/80 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-center font-mono">
            {capabilities.map((cap) => {
              const Icon = cap.icon;
              return (
                <div key={cap.label} className="flex flex-col items-center gap-1.5 p-2 rounded-[6px] hover:bg-[#121824] transition-colors">
                  <div className="p-1.5 rounded-[6px] bg-[#141924] border border-[#243046] text-amber-400">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-semibold text-slate-200">{cap.label}</span>
                  <span className="text-[10px] text-slate-400">{cap.desc}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================== PROBLEM SECTION (OPEN CANVAS HIERARCHY) ===================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-amber-400">
            THE OPERATIONAL REALITY
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-mono">
            Mining decisions are only as good as the intelligence behind them.
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            In modern opencast and underground manganese operations, fragmented data causes unbudgeted production shortfalls and delayed reserve capital expenditures.
          </p>
        </div>

        {/* 3-Stage Problem Section (Level 2 Subtle Panels) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-[#0D111A] border border-[#1C2536] rounded-[10px] p-5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="text-[10px] font-mono text-rose-300 bg-rose-950/40 border border-rose-800/40 px-2 py-0.5 rounded-[4px] inline-block font-semibold">
                CHALLENGE 01
              </div>
              <h3 className="text-base font-bold text-white font-mono">Reserve Uncertainty</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Manual survey reports, fragmented drill core logs, and delayed lab assays slow down reserve identification and cause exploration capital misallocation.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-[#1C2536] text-[11px] font-mono text-slate-400">
              Impact: 6-12 month lag in UNFC classification
            </div>
          </div>

          <div className="bg-[#0D111A] border border-[#1C2536] rounded-[10px] p-5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="text-[10px] font-mono text-amber-300 bg-amber-950/40 border border-amber-800/40 px-2 py-0.5 rounded-[4px] inline-block font-semibold">
                CHALLENGE 02
              </div>
              <h3 className="text-base font-bold text-white font-mono">Production Volatility</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Unscheduled excavator downtime, monsoon haul-road saturation, and DGMS blasting clearance delays create unexpected monthly production shortfalls.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-[#1C2536] text-[11px] font-mono text-slate-400">
              Impact: 10-18% unplanned monthly output shortfall
            </div>
          </div>

          <div className="bg-[#0D111A] border border-[#1C2536] rounded-[10px] p-5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="text-[10px] font-mono text-sky-300 bg-sky-950/40 border border-sky-800/40 px-2 py-0.5 rounded-[4px] inline-block font-semibold">
                CHALLENGE 03
              </div>
              <h3 className="text-base font-bold text-white font-mono">Decision Lag</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Insights are siloed across GIS maps, spreadsheets, and shift logs instead of being presented as a single actionable, closed-loop decision workflow.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-[#1C2536] text-[11px] font-mono text-slate-400">
              Impact: Reactive triage after production has slipped
            </div>
          </div>
        </div>
      </section>

      {/* ===================== HOW MANGENESIS WORKS ===================== */}
      <section className="bg-[#0A0D14] border-y border-[#1C2536] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-amber-400">
              INTELLIGENCE PIPELINE
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-white font-mono">
              The 5-Stage Decision Pipeline
            </h2>
            <p className="text-xs font-mono text-slate-400">
              From raw earth observation to prescriptive operational intervention.
            </p>
          </div>

          {/* Horizontal Step Pipeline */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {workflowSteps.map((step) => (
              <div
                key={step.num}
                className="bg-[#0D111A] border border-[#1C2536] rounded-[10px] p-4 flex flex-col justify-between hover:border-amber-500/35 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-xl font-bold font-mono text-amber-400">{step.num}</span>
                    <span className="text-[9px] font-mono text-slate-400 bg-[#121824] px-1.5 py-0.5 rounded border border-[#1C2536]">
                      {step.badge}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white font-mono mb-1">{step.title}</h4>
                  <div className="text-[11px] text-sky-400 font-mono mb-2">{step.subtitle}</div>
                  <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== CORE WORKSPACE SHOWCASE ===================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-amber-400">
            ENTERPRISE WORKSPACES
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-white font-mono">
            Engineered for Ground-Truth Mining Operations
          </h2>
          <p className="text-xs font-mono text-slate-400">
            Connecting geology, satellite observation, predictive forecasting, and prescriptive action.
          </p>
        </div>

        {/* Tabbed Interactive Showcase Container */}
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
            {showcaseItems.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(idx)}
                className={`px-3.5 py-1.5 rounded-[7px] text-xs font-mono transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === idx
                    ? 'bg-[#161D2B] text-amber-400 border border-amber-500/40 font-semibold'
                    : 'bg-[#0E131E] text-slate-400 hover:text-white border border-[#1C2536]'
                }`}
              >
                {item.title}
              </button>
            ))}
          </div>

          {/* Active Showcase Level 3 Surface Panel */}
          <div className="bg-[#0D111A] border border-[#243046] rounded-[12px] p-6 sm:p-7 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-mono text-amber-400 uppercase font-semibold">
                WORKBENCH 0{activeTab + 1}
              </span>
              <h3 className="text-2xl font-bold text-white font-mono">
                {showcaseItems[activeTab].tagline}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {showcaseItems[activeTab].desc}
              </p>

              <div className="grid grid-cols-2 gap-2 pt-2">
                {showcaseItems[activeTab].highlights.map((h) => (
                  <div key={h} className="flex items-center gap-2 text-xs font-mono text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3">
                <Link to={showcaseItems[activeTab].path}>
                  <Button variant="primary" size="md" iconRight={ArrowRight}>
                    {showcaseItems[activeTab].cta}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Visual preview box */}
            <div className="lg:col-span-6 bg-[#07090E] border border-[#1C2536] rounded-[10px] p-4 font-mono space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#1C2536] text-xs text-slate-400">
                <span>SIMULATED WORKSPACE TELEMETRY</span>
                <span className="text-emerald-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  REAL-TIME
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center bg-[#0E131E] p-2.5 rounded-[6px] border border-[#1C2536]">
                  <span className="text-slate-400">Target Formation:</span>
                  <span className="text-white font-semibold">Mansar Manganese Bed (Gumgaon)</span>
                </div>
                <div className="flex justify-between items-center bg-[#0E131E] p-2.5 rounded-[6px] border border-[#1C2536]">
                  <span className="text-slate-400">Resource Estimation:</span>
                  <span className="text-emerald-400 font-bold num-tabular">4.82 Mt @ 41.8% Mn</span>
                </div>
                <div className="flex justify-between items-center bg-[#0E131E] p-2.5 rounded-[6px] border border-[#1C2536]">
                  <span className="text-slate-400">30-Day Forecast Outlook:</span>
                  <span className="text-amber-400 font-bold num-tabular">42.8 kt (Target: 47.0 kt)</span>
                </div>
                <div className="flex justify-between items-center bg-[#0E131E] p-2.5 rounded-[6px] border border-[#1C2536]">
                  <span className="text-slate-400">Prescribed Intervention:</span>
                  <span className="text-sky-300 font-semibold">Reassign EX-04 to Block B</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== DECISION IMPACT METRICS ===================== */}
      <section className="bg-[#0A0D14] border-y border-[#1C2536] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-amber-400">
              OPERATIONAL BENCHMARK
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-white font-mono">
              Quantifiable Impact on Extraction Continuity
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              *Evaluated via SIH26009 benchmark historical validation runs on MOIL central Indian manganese deposits.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-center">
            <div className="bg-[#0D111A] border border-[#1C2536] p-5 rounded-[10px]">
              <div className="text-3xl font-bold text-amber-400 mb-1 num-tabular">+42%</div>
              <div className="text-xs font-semibold text-white mb-1">Reserve Visibility</div>
              <div className="text-[11px] text-slate-400">Accelerated UNFC block categorization lead time</div>
            </div>

            <div className="bg-[#0D111A] border border-[#1C2536] p-5 rounded-[10px]">
              <div className="text-3xl font-bold text-emerald-400 mb-1 num-tabular">94.6%</div>
              <div className="text-xs font-semibold text-white mb-1">Forecast Accuracy</div>
              <div className="text-[11px] text-slate-400">R² correlation over 30-day extraction targets</div>
            </div>

            <div className="bg-[#0D111A] border border-[#1C2536] p-5 rounded-[10px]">
              <div className="text-3xl font-bold text-sky-400 mb-1 num-tabular">7–14 D</div>
              <div className="text-xs font-semibold text-white mb-1">Lead Time Detection</div>
              <div className="text-[11px] text-slate-400">Early warning prior to operational shortfall events</div>
            </div>

            <div className="bg-[#0D111A] border border-[#1C2536] p-5 rounded-[10px]">
              <div className="text-3xl font-bold text-slate-100 mb-1 num-tabular">-65%</div>
              <div className="text-xs font-semibold text-white mb-1">Decision Cycle Lag</div>
              <div className="text-[11px] text-slate-400">Reduced triage turnaround from alert to action</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== FINAL LANDING CTA ===================== */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5 py-8">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-mono">
          Turn fragmented mining data into a decision.
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
          One unified intelligence layer for reserve discovery, production forecasting, and operational planning across India's premier manganese mining deposits.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link to="/app">
            <Button variant="primary" size="lg" iconRight={ArrowRight}>
              Launch Mangenesis Platform
            </Button>
          </Link>
          <Link to="/methodology">
            <Button variant="secondary" size="lg">
              Explore the Methodology
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
