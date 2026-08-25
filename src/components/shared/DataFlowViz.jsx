import { CloudRain, Droplets, ScanLine, Thermometer, Cpu, Map, TrendingUp } from 'lucide-react';

export default function DataFlowViz({ className = '' }) {
  const sources = [
    { name: 'Rainfall (48mm)', tag: 'NASA GPM', icon: CloudRain },
    { name: 'Soil Moisture (71%)', tag: 'Sentinel-2', icon: Droplets },
    { name: 'NDVI Index (0.34)', tag: 'Landsat-9', icon: ScanLine },
    { name: 'Surface Temp (35.2°C)', tag: 'MODIS LST', icon: Thermometer },
  ];

  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-xl p-5 ${className}`}>
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Planetary Observation & Intelligence Pipeline
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">Real-time space telemetry synchronized</p>
        </div>
        <span className="text-[11px] text-status-success bg-status-success-bg border border-status-success-border px-2 py-0.5 rounded-full font-medium flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-status-success" />
          Live Ingestion
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-11 items-center gap-4">
        {/* Left Inputs */}
        <div className="md:col-span-4 space-y-2">
          {sources.map((src) => {
            const Icon = src.icon;
            return (
              <div
                key={src.name}
                className="flex items-center justify-between bg-slate-850 border border-slate-750 rounded-lg px-3 py-2 text-xs"
              >
                <div className="flex items-center gap-2 text-slate-300">
                  <Icon size={14} className="text-accent" />
                  <span>{src.name}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">
                  {src.tag}
                </span>
              </div>
            );
          })}
        </div>

        {/* Center: AI Engine */}
        <div className="md:col-span-3 flex flex-col items-center justify-center p-2 text-center">
          <div className="w-full bg-slate-850 border border-accent/40 rounded-xl p-3.5 shadow-subtle">
            <div className="w-8 h-8 rounded-lg bg-accent/15 border border-accent/30 mx-auto flex items-center justify-center text-accent mb-2">
              <Cpu size={16} />
            </div>
            <div className="text-xs font-semibold text-slate-200 uppercase tracking-wide">
              ML Fusion Engine
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
              XGBoost + LightGBM
            </div>
          </div>
        </div>

        {/* Right: Outputs */}
        <div className="md:col-span-4 space-y-2">
          <div className="bg-slate-850 border border-slate-750 rounded-lg p-2.5 flex items-center gap-2.5">
            <div className="p-1.5 rounded bg-slate-800 text-accent shrink-0">
              <Map size={15} />
            </div>
            <div>
              <div className="text-xs font-medium text-slate-200">Reserve Probability</div>
              <div className="text-[10px] text-slate-500">Exploration zones & lithology</div>
            </div>
          </div>

          <div className="bg-slate-850 border border-slate-750 rounded-lg p-2.5 flex items-center gap-2.5">
            <div className="p-1.5 rounded bg-slate-800 text-accent shrink-0">
              <TrendingUp size={15} />
            </div>
            <div>
              <div className="text-xs font-medium text-slate-200">Production Continuity</div>
              <div className="text-[10px] text-slate-500">7-day shortfall predictions</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
