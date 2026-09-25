import { useState } from 'react';
import {
  Settings,
  Shield,
  Sliders,
  Bell,
  Database,
  Satellite,
  CheckCircle2,
  Save,
  RotateCcw,
} from 'lucide-react';
import { useScenario } from '../context/ScenarioContext';
import Button from '../components/ui/Button';
import StatusBadge from '../components/ui/StatusBadge';

export default function SettingsPage() {
  const { activeMineData } = useScenario();
  const [cutoffGrade, setCutoffGrade] = useState(25);
  const [dgmsBuffer, setDgmsBuffer] = useState(300);
  const [alertThreshold, setAlertThreshold] = useState('moderate');
  const [satelliteAutoSync, setSatelliteAutoSync] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans">
      {/* Header */}
      <div className="bg-[#0D111A] border border-[#243046] rounded-[14px] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">
              Platform & Operational Settings
            </h1>
            <StatusBadge status="healthy" label="SAVED CONFIG" size="xs" />
          </div>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Calibrate geostatistical grade cutoffs, DGMS safety buffer thresholds, and multi-spectral satellite ingestion intervals for {activeMineData.name || 'Gumgaon Mine'}.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6 font-mono text-xs">
        {/* Section 1: Geostatistical Parameters */}
        <div className="bg-[#0D111A] border border-[#243046] rounded-[16px] p-6 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#1C2536] text-sm font-bold text-white uppercase">
            <Sliders className="w-4 h-4 text-amber-400" />
            <span>Geostatistical & UNFC Thresholds</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold block">Economic Ore Cutoff Grade</label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="15"
                  max="35"
                  value={cutoffGrade}
                  onChange={(e) => setCutoffGrade(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <span className="text-amber-400 font-bold w-16">{cutoffGrade}% Mn</span>
              </div>
              <span className="text-[10px] text-slate-500 font-sans block">
                Blocks below this grade threshold will be categorized as marginal or waste stripping.
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold block">DGMS Blasting Buffer Zone</label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="150"
                  max="500"
                  step="25"
                  value={dgmsBuffer}
                  onChange={(e) => setDgmsBuffer(Number(e.target.value))}
                  className="w-full accent-sky-400 cursor-pointer"
                />
                <span className="text-sky-400 font-bold w-16">{dgmsBuffer}m</span>
              </div>
              <span className="text-[10px] text-slate-500 font-sans block">
                Automatic statutory proximity alert radius around public infrastructure and mine boundaries.
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Space Data & Pipeline Sync */}
        <div className="bg-[#0D111A] border border-[#243046] rounded-[16px] p-6 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#1C2536] text-sm font-bold text-white uppercase">
            <Satellite className="w-4 h-4 text-sky-400" />
            <span>Earth Observation Ingestion Policy</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-[#121824] rounded-[8px] border border-[#1C2536]">
              <div>
                <span className="text-white font-bold block">Copernicus Sentinel-2 Automatic Re-polling</span>
                <span className="text-[11px] text-slate-400 font-sans block">
                  Automatically download and process level-2A surface reflectance tiles on 5-day orbital cadence.
                </span>
              </div>
              <input
                type="checkbox"
                checked={satelliteAutoSync}
                onChange={(e) => setSatelliteAutoSync(e.target.checked)}
                className="w-4 h-4 accent-amber-400 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between pt-2">
          {saved ? (
            <span className="text-xs text-emerald-400 flex items-center gap-1.5 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              Operational parameters saved successfully
            </span>
          ) : (
            <span className="text-xs text-slate-500 font-sans">
              All modifications apply immediately to spatial kriging calculations.
            </span>
          )}

          <Button type="submit" variant="primary" size="md" icon={Save}>
            Save Configuration
          </Button>
        </div>
      </form>
    </div>
  );
}
