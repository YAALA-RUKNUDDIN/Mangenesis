import { ShieldCheck, Satellite, Cpu, Calculator, Activity } from 'lucide-react';

/**
 * Universal Scientific Data Provenance Badge
 * Classifies every metric on Mangenesis into one of 5 verified tiers:
 * - government: Verified Government Data (IBM, MOIL, GSI NGDR) -> Green
 * - satellite: Satellite Derived (Sentinel-2, Landsat-9, NASA GPM, SMAP) -> Blue
 * - prediction / ai: AI Model Prediction (LightGBM, 3D Kriging, TreeSHAP) -> Purple
 * - simulation: Scenario Simulation (Economic Model, MILP Dispatch) -> Orange
 * - observed / telemetry: In-Pit Field Telemetry (CAN-bus, IoT sensors, core logs) -> Cyan
 */
export default function ProvenanceBadge({
  tier,
  type,
  source = '',
  model = '',
  uncertainty = '',
  size = 'sm',
  showSource = true,
  showTooltip = true,
  className = '',
}) {
  const shouldShowSource = showSource && showTooltip !== false;
  const configs = {
    government: {
      label: 'Govt Verified',
      defaultSource: 'IBM / MOIL / GSI',
      badgeClass: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
      icon: ShieldCheck,
    },
    satellite: {
      label: 'Satellite Data',
      defaultSource: 'Sentinel-2 / GPM',
      badgeClass: 'bg-sky-500/10 border-sky-500/30 text-sky-400',
      icon: Satellite,
    },
    prediction: {
      label: 'AI Prediction',
      defaultSource: model ? `Model: ${model}` : 'LightGBM / 3D Kriging',
      badgeClass: 'bg-purple-500/10 border-purple-500/30 text-purple-300',
      icon: Cpu,
    },
    simulation: {
      label: 'Scenario Sim',
      defaultSource: 'Economic / What-If',
      badgeClass: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
      icon: Calculator,
    },
    observed: {
      label: 'Field Telemetry',
      defaultSource: 'CAN-bus / IoT Sensor',
      badgeClass: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300',
      icon: Activity,
    },
  };

  const raw = (tier || type || 'government').toLowerCase();
  const key =
    raw === 'ai' || raw === 'prediction' ? 'prediction' :
    raw === 'telemetry' || raw === 'observed' ? 'observed' :
    raw === 'satellite' ? 'satellite' :
    raw === 'simulation' ? 'simulation' :
    'government';

  const cfg = configs[key] || configs.government;
  const Icon = cfg.icon;
  const displaySource = source || cfg.defaultSource;

  const sizeClasses = {
    xs: 'text-[9px] px-1.5 py-0.5 gap-1',
    sm: 'text-[10px] px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-1.5',
  };

  return (
    <div
      className={`flex items-center gap-1.5 w-full min-w-0 overflow-hidden ${className}`}
      title={`${cfg.label}: ${displaySource}${uncertainty ? ` (${uncertainty})` : ''}`}
    >
      <span className={`inline-flex items-center shrink-0 font-mono font-bold uppercase tracking-wider rounded-[4px] border ${cfg.badgeClass} ${sizeClasses[size]}`}>
        <Icon className="w-3 h-3 shrink-0" />
        <span>{cfg.label}</span>
      </span>
      {shouldShowSource && displaySource && (
        <span className="text-[10px] text-slate-400 font-mono truncate min-w-0 flex-1 opacity-80">
          • {displaySource}
        </span>
      )}
      {uncertainty && (
        <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-black/40 text-amber-300 shrink-0 border border-amber-500/20">
          {uncertainty}
        </span>
      )}
    </div>
  );
}
