import { useState } from 'react';
import {
  Drill,
  TrendingUp,
  Database,
  Search,
  Filter,
  Layers,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { useScenario } from '../context/ScenarioContext';
import KPICard from '../components/ui/KPICard';
import DataTable from '../components/ui/DataTable';
import Drawer from '../components/ui/Drawer';
import StatusBadge from '../components/ui/StatusBadge';
import Button from '../components/ui/Button';
import MineMap from '../components/maps/MineMap';

export default function DrillingAnalytics() {
  const { activeMineData } = useScenario();
  const [selectedHole, setSelectedHole] = useState(null);

  // Drillhole database records for MOIL Manganese deposits
  const drillholeRecords = [
    {
      id: 'DP-G01',
      block: 'Block A (North Vein)',
      depth: 148,
      lithology: 'Braunite-Quartzite',
      mn_grade: 44.8,
      confidence: 94.2,
      status: 'Completed',
      collar_lat: 21.1562,
      collar_lon: 79.0912,
      rqd: '88%',
      core_recovery: '96.4%',
      azimuth: '045°',
      dip: '-60°',
      intercept_m: '68m – 86.5m (18.5m thickness)',
      summary: 'High-grade commercial manganese reef intercept with minimal silicate impurities.',
    },
    {
      id: 'DP-G02',
      block: 'Block A (North Vein)',
      depth: 162,
      lithology: 'Pyrolusite Lens',
      mn_grade: 42.1,
      confidence: 91.8,
      status: 'Completed',
      collar_lat: 21.1578,
      collar_lon: 79.0935,
      rqd: '82%',
      core_recovery: '94.0%',
      azimuth: '045°',
      dip: '-65°',
      intercept_m: '72m – 90.5m (18.5m thickness)',
      summary: 'Dense crystalline ore seam conforming to regional anticlinal limb structure.',
    },
    {
      id: 'DP-G03',
      block: 'Block B (Central Pit)',
      depth: 135,
      lithology: 'Gondite / Schist',
      mn_grade: 36.4,
      confidence: 87.5,
      status: 'Completed',
      collar_lat: 21.1542,
      collar_lon: 79.0895,
      rqd: '79%',
      core_recovery: '91.2%',
      azimuth: '050°',
      dip: '-60°',
      intercept_m: '54m – 68m (14m thickness)',
      summary: 'Economic grade ore suitable for ferromanganese blending with low phosphorus.',
    },
    {
      id: 'DP-G04',
      block: 'Block B (Central Pit)',
      depth: 110,
      lithology: 'Quartzite Cap',
      mn_grade: 12.2,
      confidence: 82.0,
      status: 'Active Rig',
      collar_lat: 21.1528,
      collar_lon: 79.0872,
      rqd: '72%',
      core_recovery: '88.5%',
      azimuth: '045°',
      dip: '-55°',
      intercept_m: 'Overburden transition zone',
      summary: 'Currently drilling diamond core barrel at 110m depth targeting footwall contact.',
    },
    {
      id: 'DP-G05',
      block: 'Block C (East Extension)',
      depth: 185,
      lithology: 'Braunite-Psilomelane',
      mn_grade: 43.6,
      confidence: 93.0,
      status: 'Completed',
      collar_lat: 21.1592,
      collar_lon: 79.0965,
      rqd: '85%',
      core_recovery: '95.8%',
      azimuth: '040°',
      dip: '-70°',
      intercept_m: '92m – 114m (22m thickness)',
      summary: 'Substantial ore strike extension verifying UNFC 111 Measured category.',
    },
    {
      id: 'DP-G06',
      block: 'Block C (East Extension)',
      depth: 95,
      lithology: 'Mansar Schist',
      mn_grade: 8.4,
      confidence: 78.4,
      status: 'Planned',
      collar_lat: 21.1610,
      collar_lon: 79.0988,
      rqd: 'Pending',
      core_recovery: 'Pending',
      azimuth: '040°',
      dip: '-60°',
      intercept_m: 'Exploration borehole planned',
      summary: 'Proposed infill drilling coordinate derived from AI satellite alteration proxy.',
    },
  ];

  const columns = [
    {
      header: 'Hole ID',
      key: 'id',
      render: (val) => <span className="font-bold text-amber-400 font-mono">{val}</span>,
    },
    {
      header: 'Block',
      key: 'block',
      render: (val) => <span className="text-slate-300 font-mono">{val}</span>,
    },
    {
      header: 'Depth',
      key: 'depth',
      render: (val) => <span className="font-mono text-white">{val}m</span>,
    },
    {
      header: 'Lithology',
      key: 'lithology',
      render: (val) => <span className="text-slate-300">{val}</span>,
    },
    {
      header: 'Mn Grade',
      key: 'mn_grade',
      render: (val) => (
        <span
          className={`font-mono font-bold ${
            val >= 40 ? 'text-amber-400' : val >= 25 ? 'text-sky-400' : 'text-slate-400'
          }`}
        >
          {val}% Mn
        </span>
      ),
    },
    {
      header: 'Confidence',
      key: 'confidence',
      render: (val) => <span className="font-mono text-emerald-400">{val}%</span>,
    },
    {
      header: 'Status',
      key: 'status',
      render: (val) => (
        <StatusBadge
          status={val === 'Completed' ? 'healthy' : val === 'Active Rig' ? 'warning' : 'neutral'}
          label={val}
          size="xs"
        />
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Console Header */}
      <div className="bg-[#0D111A] border border-[#243046] rounded-[14px] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold font-mono text-white tracking-tight">
              Drilling Analytics & Core Assays
            </h1>
            <StatusBadge status="healthy" label="ASSAY REPOSITORY" size="xs" />
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Diamond core drilling database, depth-grade profiles, collar coordinates, and RQD rock quality logs.
          </p>
        </div>
      </div>

      {/* Top 5 Metrics (Section 31) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <KPICard title="Total Drillholes" value="48" unit="Collars" context="In database" icon={Drill} />
        <KPICard title="Active Rigs" value="3" unit="Operating" context="Diamond core rigs" variant="warning" icon={Drill} />
        <KPICard title="Average Depth" value="142" unit="m" context="Bench depth target" icon={Layers} />
        <KPICard title="Average Grade" value="38.6" unit="% Mn" context="Composite assay" variant="mineral" icon={TrendingUp} />
        <KPICard title="High-Grade Intercepts" value="19" unit="Veins" context="Grade > 40% Mn" variant="intelligence" icon={ShieldCheck} />
      </div>

      {/* Main Visualizations Split: Spatial Collars Map vs Depth Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Spatial Drillhole Map (7 cols) */}
        <div className="lg:col-span-7 bg-[#0D111A] border border-[#243046] rounded-[16px] overflow-hidden flex flex-col">
          <div className="p-3 bg-[#0A0D14] border-b border-[#1C2536] flex items-center justify-between text-xs font-mono">
            <span className="text-slate-300 font-bold">SPATIAL DRILLHOLE COLLAR DISTRIBUTION</span>
            <span className="text-amber-400">Click Collar to Inspect Log</span>
          </div>
          <div className="h-[380px] w-full">
            <MineMap height="100%" className="w-full h-full" />
          </div>
        </div>

        {/* Right: Depth vs Grade Scatter Profile (5 cols) */}
        <div className="lg:col-span-5 bg-[#0D111A] border border-[#243046] rounded-[16px] p-5 space-y-4 font-mono">
          <div className="flex items-center justify-between border-b border-[#1C2536] pb-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Depth vs Grade Assay Profile
            </span>
            <span className="text-[10px] text-slate-500">Commercial Cutoff: 25% Mn</span>
          </div>

          <p className="text-xs text-slate-400">
            Assay distribution across depth horizons shows peak mineralization between 60m and 110m.
          </p>

          <div className="space-y-2.5 pt-2">
            {drillholeRecords.map((dh) => (
              <div
                key={dh.id}
                onClick={() => setSelectedHole(dh)}
                className="bg-[#121824] p-2.5 rounded-[8px] border border-[#1C2536] hover:border-amber-500/40 cursor-pointer transition-colors flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="font-bold text-amber-400 w-16">{dh.id}</span>
                  <span className="text-slate-400 text-[11px]">{dh.depth}m depth</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-slate-400 text-[11px] truncate max-w-[120px]">{dh.lithology}</span>
                  <span
                    className={`font-bold font-mono ${
                      dh.mn_grade >= 40 ? 'text-amber-400' : 'text-slate-300'
                    }`}
                  >
                    {dh.mn_grade}% Mn
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tertiary: Drillhole Table (Section 31) */}
      <div className="space-y-2 font-mono">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Diamond Drillhole Assay Registry
          </h3>
          <span className="text-[11px] text-slate-400">Click any row to open core log drawer</span>
        </div>
        <DataTable
          columns={columns}
          data={drillholeRecords}
          keyField="id"
          searchPlaceholder="Filter by Hole ID, Lithology, Block..."
          searchField="id"
          onRowClick={(row) => setSelectedHole(row)}
        />
      </div>

      {/* Detailed Drillhole Log Drawer */}
      <Drawer
        isOpen={Boolean(selectedHole)}
        onClose={() => setSelectedHole(null)}
        title={selectedHole ? `${selectedHole.id} Core Log` : ''}
        subtitle={selectedHole ? selectedHole.block : ''}
        badge={selectedHole ? <StatusBadge status="healthy" label={selectedHole.status} size="xs" /> : null}
      >
        {selectedHole && (
          <div className="space-y-4 font-mono text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-[#121824] p-3 rounded-[8px] border border-[#1C2536]">
                <span className="text-slate-400 text-[10px] block">TOTAL DEPTH</span>
                <span className="text-white font-bold text-sm">{selectedHole.depth}m</span>
              </div>
              <div className="bg-[#121824] p-3 rounded-[8px] border border-[#1C2536]">
                <span className="text-slate-400 text-[10px] block">COMPOSITE GRADE</span>
                <span className="text-amber-400 font-bold text-sm">{selectedHole.mn_grade}% Mn</span>
              </div>
              <div className="bg-[#121824] p-3 rounded-[8px] border border-[#1C2536]">
                <span className="text-slate-400 text-[10px] block">CORE RECOVERY</span>
                <span className="text-emerald-400 font-bold">{selectedHole.core_recovery}</span>
              </div>
              <div className="bg-[#121824] p-3 rounded-[8px] border border-[#1C2536]">
                <span className="text-slate-400 text-[10px] block">ROCK QUALITY (RQD)</span>
                <span className="text-white font-bold">{selectedHole.rqd}</span>
              </div>
            </div>

            <div className="bg-[#121824] p-3.5 rounded-[8px] border border-[#1C2536] space-y-2">
              <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider block">
                Collar Coordinates & Trajectory
              </span>
              <div className="space-y-1 text-slate-300 text-[11px]">
                <div className="flex justify-between">
                  <span>Collar Latitude:</span>
                  <span className="text-white">{selectedHole.collar_lat}° N</span>
                </div>
                <div className="flex justify-between">
                  <span>Collar Longitude:</span>
                  <span className="text-white">{selectedHole.collar_lon}° E</span>
                </div>
                <div className="flex justify-between">
                  <span>Azimuth / Dip:</span>
                  <span className="text-sky-400">{selectedHole.azimuth} / {selectedHole.dip}</span>
                </div>
                <div className="flex justify-between">
                  <span>Ore Intercept:</span>
                  <span className="text-emerald-400 font-bold">{selectedHole.intercept_m}</span>
                </div>
              </div>
            </div>

            <div className="bg-[#07090E] p-3.5 rounded-[8px] border border-[#1C2536] space-y-1">
              <span className="text-[10px] font-semibold text-slate-400 uppercase block">
                Geological Core Summary
              </span>
              <p className="text-slate-200 text-xs leading-relaxed">
                {selectedHole.summary}
              </p>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
