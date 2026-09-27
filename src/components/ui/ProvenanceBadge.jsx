import { ShieldCheck, Satellite, Cpu, Calculator, Activity, HelpCircle } from 'lucide-react';

/**
 * Universal Scientific Data Provenance Badge
 * Classifies every metric on Mangenesis into one of 5 verified tiers:
 * - government: Verified Government Data (IBM, MOIL, GSI NGDR) -> Green
 * - satellite: Satellite Derived (Sentinel-2, Landsat-9, NASA GPM, SMAP) -> Blue
 * - prediction: AI Model Prediction (LightGBM, 3D Kriging, TreeSHAP) -> Purple
 * - simulation: Scenario Simulation (Economic Model, MILP Dispatch) -> Orange
 * - observed: In-Pit Field Telemetry (CAN-bus, IoT sensors, core logs) -> Slate/Cyan
 */
export default function ProvenanceBadge({
  type = 'government',
  source = '',
  model = '',
  uncertainty = '',
  size = 'sm',
  className = '',
}) {
  const configs = {
    government: {
      label: 'Verified Government',
      defaultSource: 'IBM / MOIL / GSI',
      badgeClass: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
      dotClass: 'bg-emerald-400',
      icon: ShieldCheck,
    },
    satellite: {
      label: 'Satellite Derived',
      defaultSource: 'ESA Sentinel-2 / NASA GPM',
      badgeClass: 'bg-sky-500/15 border-sky-500/30 text-sky-400',
      dotClass: 'bg-sky-400',
      icon: Satellite,
    },
    prediction: {
      label: 'AI Prediction',
      defaultSource: model ? `Model: ${model}` : 'LightGBM / 3D Kriging',
      badgeClass: 'bg-purple-500/15 border-purple-500/30 text-purple-300',
      dotClass: 'bg-purple-400',
      icon: Cpu,
    },
    simulation: {
      label: 'Scenario Simulation',
      defaultSource: 'Economic / What-If Model',
      badgeClass: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
      dotClass: 'bg-amber-400',
      icon: Calculator,
    },
    observed: {
      label: 'Field Telemetry',
      defaultSource: 'In-Pit IoT / DGMS Log',
      badgeClass: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300',
      dotClass: 'bg-cyan-400',
      icon: Activity,
    },
  };

  const cfg = configs[type] || configs.government;
  const Icon = cfg.icon;
  const displaySource = source || cfg.defaultSource;

  const sizeClasses = {
    xs: 'text-[9px] px-1.5 py-0.5 gap-1',
    sm: 'text-[10px] px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-1.5',
  };

  return (
    <div
      className={`inline-flex items-center font-mono font-medium rounded-[5px] border ${cfg.badgeClass} ${sizeClasses[size]} ${className}`}
      title={`${cfg.label}: ${displaySource}${uncertainty ? ` (Uncertainty: ${uncertainty})` : ''}`}
    >
      <Icon className="w-3 h-3 shrink-0" />
      <span className="font-bold uppercase tracking-wider">{cfg.label}</span>
      <span className="opacity-40">•</span>
      <span className="truncate max-w-[150px] font-sans opacity-90">{displaySource}</span>
      {uncertainty && (
        <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-black/30 text-amber-300 ml-0.5">
          {uncertainty}
        </span>
      )}
    </div>
  );
}
