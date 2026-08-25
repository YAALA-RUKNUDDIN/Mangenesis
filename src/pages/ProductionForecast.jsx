import {
  TrendingUp,
  Clock,
  Radio,
  AlertTriangle,
  Zap,
} from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import ProductionForecastChart from '../components/charts/ProductionForecastChart';
import StatusBadge from '../components/shared/StatusBadge';
import AnimatedNumber from '../components/shared/AnimatedNumber';
import DataFlowViz from '../components/shared/DataFlowViz';
import { useScenario } from '../context/ScenarioContext';
import { historicalProduction, timelineEvents } from '../data/mockData';

export default function ProductionForecast() {
  const { scenarioData, forecastData } = useScenario();

  return (
    <PageLayout
      title="Production Continuity Forecast"
      subtitle="Predicting potential production shortfalls up to 7 days in advance before they impact plant feed rate."
    >
      {/* Hero Chart Section */}
      <div className="rounded-2xl border border-slate-800/90 bg-[#0E131F]/85 text-slate-100 shadow-card backdrop-blur-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-blue-400" />
              <h2 className="text-sm font-bold font-display text-white">
                14-Day Historical Extraction & 7-Day Shortfall Prediction
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Calibrated continuously via satellite soil moisture, radar precipitation, and equipment logs
            </p>
          </div>

          {/* Chart Legend */}
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-slate-500 border-b border-dashed" />
              <span className="text-slate-400 text-[11px] font-mono">10k Target</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
              <span className="text-slate-300 text-[11px]">Actual</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-glow-blue" />
              <span className="text-blue-400 text-[11px] font-bold">AI Forecast</span>
            </div>
          </div>
        </div>

        {/* Big Chart */}
        <ProductionForecastChart
          historicalData={historicalProduction}
          forecastData={forecastData}
          height={300}
          showHistorical={true}
        />

        {/* Subtitle Divider */}
        <div className="mt-4 pt-3.5 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2 text-[11px]">
            <span className="text-sky-400 font-medium">Aug 4 &ndash; Aug 17 (Actual)</span>
            <span className="text-slate-600">&rarr;</span>
            <span className="text-blue-400 font-bold">Aug 19 &ndash; Aug 25 (AI Forecast)</span>
          </div>
          <span className="text-[11px] text-rose-400 font-bold flex items-center gap-1.5 bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
            Projected Gap: Days +4 to +6
          </span>
        </div>
      </div>

      {/* Three Risk Period Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
        <div className="rounded-2xl border border-emerald-500/30 bg-[#0E131F]/80 p-5 flex items-center justify-between shadow-card">
          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-emerald-400">
              Low Risk Window
            </span>
            <div className="text-lg font-bold font-display text-white mt-0.5">Days 1 &ndash; 2</div>
            <div className="text-xs text-slate-400 mt-0.5">Nominal extraction throughput</div>
          </div>
          <StatusBadge level="LOW" size="md" />
        </div>

        <div className="rounded-2xl border border-amber-500/30 bg-[#0E131F]/80 p-5 flex items-center justify-between shadow-card">
          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-amber-400">
              Medium Risk Window
            </span>
            <div className="text-lg font-bold font-display text-white mt-0.5">Days 3 & 5</div>
            <div className="text-xs text-slate-400 mt-0.5">Weather & maintenance onset</div>
          </div>
          <StatusBadge level="MEDIUM" size="md" />
        </div>

        <div className="rounded-2xl border border-rose-500/30 bg-[#0E131F]/80 p-5 flex items-center justify-between shadow-card">
          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-rose-400">
              High Risk Window
            </span>
            <div className="text-lg font-bold font-display text-white mt-0.5">Days 4 & 6</div>
            <div className="text-xs text-slate-400 mt-0.5">Projected -28% output deficit</div>
          </div>
          <StatusBadge level="HIGH" size="md" />
        </div>
      </div>

      {/* Two-Column Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-5">
        {/* Left: AI Prediction Metrics & Data Flow */}
        <div className="lg:col-span-7 space-y-5">
          <div className="rounded-2xl border border-slate-800/90 bg-[#0E131F]/85 p-6 shadow-card">
            <h3 className="text-xs uppercase tracking-wider font-mono font-bold text-slate-400 mb-4">
              Forecast Metrics & Model Attributes
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="p-4 bg-[#080B11] rounded-xl border border-slate-800">
                <div className="text-[11px] text-slate-400 font-medium">
                  Predicted Shortfall
                </div>
                <div className="text-2xl font-bold font-mono text-rose-400 mt-1">
                  <AnimatedNumber value={scenarioData.expectedGap} suffix=" T" />
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 font-mono">Below planned target</div>
              </div>

              <div className="p-4 bg-[#080B11] rounded-xl border border-slate-800">
                <div className="text-[11px] text-slate-400 font-medium">
                  Shortfall Probability
                </div>
                <div className="text-2xl font-bold font-mono text-rose-400 mt-1">
                  <AnimatedNumber value={scenarioData.shortfallRisk} suffix="%" />
                </div>
                <div className="text-[10px] text-rose-400 mt-0.5 font-bold font-mono">
                  {scenarioData.riskLevel} Severity
                </div>
              </div>

              <div className="p-4 bg-[#080B11] rounded-xl border border-slate-800">
                <div className="text-[11px] text-slate-400 font-medium">
                  Primary Cause
                </div>
                <div className="text-xs font-bold text-slate-100 mt-1.5 truncate">
                  {scenarioData.primaryCause}
                </div>
                <div className="text-[10px] text-blue-400 mt-0.5 font-mono">Root driver identified</div>
              </div>

              <div className="p-4 bg-[#080B11] rounded-xl border border-slate-800">
                <div className="text-[11px] text-slate-400 font-medium">
                  Model Confidence
                </div>
                <div className="text-2xl font-bold font-mono text-blue-400 mt-1">
                  {scenarioData.forecastConfidence}%
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 font-mono">LightGBM Regressor</div>
              </div>
            </div>
          </div>

          {/* Data Flow */}
          <DataFlowViz />
        </div>

        {/* Right: Operational Progression Timeline */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl border border-slate-800/90 bg-[#0E131F]/85 p-6 shadow-card h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
                <Clock size={15} className="text-blue-400" />
                <h3 className="text-xs uppercase tracking-wider font-semibold text-slate-200 font-mono">
                  Operational Progression Timeline
                </h3>
              </div>

              <div className="space-y-4 relative before:absolute before:left-[9px] before:top-2 before:bottom-2 before:w-px before:bg-slate-800">
                {timelineEvents.map((ev, i) => {
                  const isCritical = ev.status === 'critical';
                  const isHigh = ev.status === 'high';
                  const isWarning = ev.status === 'warning';

                  const dotColor = isCritical
                    ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]'
                    : isHigh
                    ? 'bg-rose-400'
                    : isWarning
                    ? 'bg-amber-400'
                    : 'bg-emerald-400';

                  return (
                    <div key={i} className="relative flex items-start gap-3 pl-6">
                      <div className={`absolute left-1.5 top-1.5 w-2 h-2 rounded-full ${dotColor}`} />
                      <div>
                        <div className="text-[10px] font-mono text-slate-400 font-medium">
                          {ev.time}
                        </div>
                        <div className="text-xs font-bold text-slate-100 mt-0.5">
                          {ev.label}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5 leading-relaxed">{ev.detail}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-5 pt-3.5 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-2 font-mono">
              <Radio size={13} className="text-blue-400" />
              <span>Time-series calibrated with live satellite telemetry</span>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
