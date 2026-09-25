import { useState } from 'react';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Satellite,
  Database,
  Drill,
  TrendingUp,
  CloudRain,
  Truck,
  ShieldCheck,
  Server,
} from 'lucide-react';
import { useScenario } from '../context/ScenarioContext';
import KPICard from '../components/ui/KPICard';
import Button from '../components/ui/Button';
import StatusBadge from '../components/ui/StatusBadge';

export default function DataHealthPage() {
  const { activeMineData } = useScenario();
  const [refreshing, setRefreshing] = useState(false);

  const pipelines = [
    {
      id: 'PIPE-SAT',
      name: 'Copernicus Sentinel-2 Level-2A Satellite Feed',
      source: 'ESA SciHub / Copernicus Open Access Hub',
      category: 'Remote Sensing',
      status: 'OPERATIONAL',
      lastUpdate: '2 hours ago (Tile 44QKG)',
      coverage: '100% Mine Lease Boundary',
      qualityScore: 98.4,
      missingData: '0.0% Cloud Free',
      processingStatus: 'BOA Reflectance Calibrated',
      latency: '420ms',
      icon: Satellite,
    },
    {
      id: 'PIPE-LST',
      name: 'NASA Landsat-9 / MODIS Thermal Infrared LST',
      source: 'USGS EROS Earth Resources Observation',
      category: 'Thermal Sensing',
      status: 'OPERATIONAL',
      lastUpdate: '5 hours ago',
      coverage: '96% Spatial Grid',
      qualityScore: 94.2,
      missingData: '1.2% Cloud Masked',
      processingStatus: 'Split-Window Atmospheric Corrected',
      latency: '680ms',
      icon: Activity,
    },
    {
      id: 'PIPE-DRILL',
      name: 'Diamond Core Drillhole Assay Database',
      source: 'MOIL Geological Logging Office (Nagpur)',
      category: 'Subsurface Ground Truth',
      status: 'OPERATIONAL',
      lastUpdate: 'Yesterday 17:30 IST',
      coverage: '48 Verified Collars',
      qualityScore: 99.1,
      missingData: '0 Boreholes Missing QA/QC',
      processingStatus: '3D Ordinary Kriging Interpolated',
      latency: '35ms (Indexed)',
      icon: Drill,
    },
    {
      id: 'PIPE-SCADA',
      name: 'Open-Cast Fleet SCADA Telemetry',
      source: 'Modular Mining Dispatch System / CAN-bus',
      category: 'Equipment Fleet',
      status: 'OPERATIONAL',
      lastUpdate: '9 minutes ago',
      coverage: '14 Active Haul Trucks & Shovels',
      qualityScore: 91.5,
      missingData: '1 Telemetry Beacon (EX-04 intermittent)',
      processingStatus: 'Real-Time Cycle Time Stream',
      latency: '1.2s Event Stream',
      icon: Truck,
    },
    {
      id: 'PIPE-MET',
      name: 'Local Weather Station & IMD Doppler Radar',
      source: 'Open-Meteo & IMD Nagpur Doppler S-Band',
      category: 'Meteorological',
      status: 'OPERATIONAL',
      lastUpdate: '14 minutes ago',
      coverage: '15km Radius Radar Sweeps',
      qualityScore: 97.0,
      missingData: '0.0%',
      processingStatus: 'Precipitation Horizon Active',
      latency: '240ms',
      icon: CloudRain,
    },
    {
      id: 'PIPE-PROD',
      name: 'Weighbridge & Processing Plant Feed Telemetry',
      source: 'Gumgaon Dispatch ERP Database',
      category: 'Production Ground Truth',
      status: 'OPERATIONAL',
      lastUpdate: '18 minutes ago',
      coverage: '100% Outbound Ore Trucks',
      qualityScore: 99.8,
      missingData: '0 Tare Discrepancies',
      processingStatus: 'Time-Series Feature Store Synchronized',
      latency: '45ms',
      icon: TrendingUp,
    },
  ];

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto font-sans">
      {/* Console Header */}
      <div className="bg-[#0D111A] border border-[#243046] rounded-[14px] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold font-mono text-white tracking-tight">
              Data Pipeline Health & Provenance
            </h1>
            <StatusBadge status="healthy" label="ALL 6 INGESTION PIPELINES SYNCHRONIZED" size="xs" />
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time pipeline diagnostics, latency benchmarks, data completeness, and calibration provenance for {activeMineData.name || 'Gumgaon Mine'}.
          </p>
        </div>

        <Button
          size="sm"
          variant="secondary"
          icon={RefreshCw}
          loading={refreshing}
          onClick={handleRefresh}
        >
          Re-poll All Pipelines
        </Button>
      </div>

      {/* Aggregate Reliability KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <KPICard
          title="Overall Pipeline Uptime"
          value="99.9"
          unit="%"
          context="Zero data ingestion loss"
          variant="healthy"
          icon={CheckCircle2}
        />
        <KPICard
          title="Average Ingestion Latency"
          value="240"
          unit="ms"
          context="Edge-to-Dashboard telemetry"
          variant="intelligence"
          icon={Activity}
        />
        <KPICard
          title="Data Completeness"
          value="98.2"
          unit="%"
          context="Verified ground truth coverage"
          variant="mineral"
          icon={Database}
        />
        <KPICard
          title="Active Edge Nodes"
          value="6"
          unit="Pipelines"
          context="All nodes synchronized"
          icon={Server}
        />
      </div>

      {/* 6 Pipeline Health Cards (Section 39) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 font-mono">
        {pipelines.map((pipe) => {
          const Icon = pipe.icon;
          return (
            <div
              key={pipe.id}
              className="bg-[#0D111A] border border-[#243046] rounded-[16px] p-5 space-y-4 shadow-sm"
            >
              <div className="flex items-start justify-between pb-3 border-b border-[#1C2536]">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-[6px] bg-[#121824] border border-[#243046] text-amber-400">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase">{pipe.category}</span>
                    <h3 className="text-white font-bold text-xs leading-snug line-clamp-1">
                      {pipe.name}
                    </h3>
                  </div>
                </div>
                <StatusBadge status="healthy" label={pipe.status} size="xs" />
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between border-b border-[#1C2536] pb-1.5">
                  <span className="text-slate-400 text-[11px]">Last Sync:</span>
                  <span className="text-white font-semibold">{pipe.lastUpdate}</span>
                </div>
                <div className="flex justify-between border-b border-[#1C2536] pb-1.5">
                  <span className="text-slate-400 text-[11px]">Geographic Coverage:</span>
                  <span className="text-slate-200">{pipe.coverage}</span>
                </div>
                <div className="flex justify-between border-b border-[#1C2536] pb-1.5">
                  <span className="text-slate-400 text-[11px]">Data Quality Score:</span>
                  <span className="text-emerald-400 font-bold">{pipe.qualityScore}%</span>
                </div>
                <div className="flex justify-between border-b border-[#1C2536] pb-1.5">
                  <span className="text-slate-400 text-[11px]">Missing Frames/Data:</span>
                  <span className="text-slate-300">{pipe.missingData}</span>
                </div>
                <div className="flex justify-between border-b border-[#1C2536] pb-1.5">
                  <span className="text-slate-400 text-[11px]">Processing Status:</span>
                  <span className="text-sky-400">{pipe.processingStatus}</span>
                </div>
                <div className="flex justify-between pt-0.5">
                  <span className="text-slate-400 text-[11px]">Ingest Latency:</span>
                  <span className="text-amber-400 font-semibold">{pipe.latency}</span>
                </div>
              </div>

              <div className="pt-2 text-[10px] text-slate-500 truncate">
                Source: {pipe.source}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
