import { useState, useMemo } from 'react';
import {
  TrendingUp,
  Sliders,
  AlertTriangle,
  Calendar,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { useScenario } from '../context/ScenarioContext';
import KPICard from '../components/ui/KPICard';
import Button from '../components/ui/Button';
import StatusBadge from '../components/ui/StatusBadge';
import { Link } from 'react-router-dom';

export default function ProductionForecast() {
  const { activeMineData } = useScenario();

  // Console filters
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedModel, setSelectedModel] = useState('prophet_lstm');

  // Scenario Simulator Inputs (Section 33)
  const [equipmentAvailability, setEquipmentAvailability] = useState(82); // 60% to 100%
  const [weatherSeverity, setWeatherSeverity] = useState('moderate'); // 'dry' | 'moderate' | 'heavy'
  const [blastingDelayDays, setBlastingDelayDays] = useState(2); // 0 to 7 days
  const [oreAvailability, setOreAvailability] = useState(88); // 60% to 100%
  const [shiftCapacity, setShiftCapacity] = useState(3); // 1, 2, 3 shifts

  // Calculate dynamic outputs based on simulator inputs
  const simulationResults = useMemo(() => {
    // Dynamic monthly quota based on mine capacity (e.g. Gumgaon 47kt, Balaghat 65.8kt)
    const baseTarget = parseFloat((((activeMineData.capacity_tpd || 10000) * 0.0047)).toFixed(1));
    // Weather impact penalty
    const weatherPenalty =
      weatherSeverity === 'heavy' ? 4.2 : weatherSeverity === 'moderate' ? 1.8 : 0.0;
    // Equipment penalty
    const equipPenalty = ((100 - equipmentAvailability) / 100) * 8.5;
    // Blasting penalty
    const blastPenalty = blastingDelayDays * 0.9;
    // Ore availability penalty
    const orePenalty = ((100 - oreAvailability) / 100) * 6.0;
    // Shift factor
    const shiftFactor = shiftCapacity === 3 ? 1.0 : shiftCapacity === 2 ? 0.78 : 0.48;

    const projected = Math.max(
      15.0,
      parseFloat(((baseTarget - equipPenalty - weatherPenalty - blastPenalty - orePenalty) * shiftFactor).toFixed(1))
    );
    const shortfall = parseFloat((baseTarget - projected).toFixed(1));
    const shortfallProb = Math.min(98, Math.max(5, Math.round((shortfall / baseTarget) * 120)));
    const recoveryPotential = parseFloat((shortfall * 0.72).toFixed(1));

    let action = 'Maintain standard shift rotation. Operating within safe production envelope.';
    if (shortfall > 6.0) {
      action = 'Critical shortfall alert: Mobilize auxiliary Excavator EX-04 to Block A and activate 3rd overtime stripping shift.';
    } else if (shortfall > 2.0) {
      action = 'Moderate risk: Reassign Haul Trucks HT-11 & HT-12 to bypass saturated southern ramp; pre-split blast bench 4.';
    }

    return {
      projected,
      shortfall: shortfall > 0 ? shortfall : 0,
      shortfallProb,
      recoveryPotential,
      action,
    };
  }, [equipmentAvailability, weatherSeverity, blastingDelayDays, oreAvailability, shiftCapacity]);

  // Generate 30-day forecast chart data with dynamic slider sensitivity
  const chartData = useMemo(() => {
    const data = [];
    // 8 points historical actuals
    const histDays = [
      { day: 'Day -14', actual: 1520, target: 1550 },
      { day: 'Day -12', actual: 1540, target: 1550 },
      { day: 'Day -10', actual: 1510, target: 1550 },
      { day: 'Day -8', actual: 1490, target: 1550 },
      { day: 'Day -6', actual: 1470, target: 1550 },
      { day: 'Day -4', actual: 1430, target: 1550 },
      { day: 'Day -2', actual: 1400, target: 1550 },
      { day: 'Day 0 (Today)', actual: 1380, target: 1550, forecast: 1380, upper: 1420, lower: 1340 },
    ];

    histDays.forEach((h) => data.push(h));

    // Dynamic forward scaling based on simulated projected extraction rate
    const scale = simulationResults.projected / 47.0;
    const forwardRatios = [0.98, 0.95, 0.92, 0.90, 0.88, 0.87, 0.91, 0.96];
    const forwardLabels = [
      'Day +2',
      'Day +4',
      'Day +6',
      'Day +8',
      'Day +10',
      'Day +12',
      'Day +14',
      'Day +16',
    ];

    forwardLabels.forEach((day, i) => {
      const baseVal = 1550 * scale * forwardRatios[i];
      const forecastVal = Math.round(baseVal);
      const upperVal = Math.round(forecastVal * 1.06);
      const lowerVal = Math.round(forecastVal * 0.92);
      data.push({
        day,
        target: 1550,
        forecast: forecastVal,
        upper: upperVal,
        lower: lowerVal,
      });
    });

    return data;
  }, [simulationResults.projected]);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Console Header & Filters */}
      <div className="bg-[#0D111A] border border-[#243046] rounded-[14px] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold font-mono text-white tracking-tight">
              Production Forecast & Continuity Planning
            </h1>
            <StatusBadge status="warning" label="SHORTFALL HORIZON DETECTED" size="xs" />
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Ensemble AI forecasting combining haul-fleet telematics, weather saturation models, and bench ore availability for {activeMineData.name || 'Gumgaon Mine'}.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <div className="flex items-center gap-1.5 bg-[#121824] px-2.5 py-1.5 rounded-[8px] border border-[#243046]">
            <span className="text-slate-500 text-[10px]">HORIZON:</span>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="bg-[#121824] text-slate-100 focus:outline-none cursor-pointer text-xs font-mono"
            >
              <option value="14d" className="bg-[#0D111A] text-slate-100 py-1.5">14 Days Forward</option>
              <option value="30d" className="bg-[#0D111A] text-slate-100 py-1.5">30 Days (Monthly Quota)</option>
              <option value="90d" className="bg-[#0D111A] text-slate-100 py-1.5">Quarterly Horizon</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-[#121824] px-2.5 py-1.5 rounded-[8px] border border-[#243046]">
            <span className="text-slate-500 text-[10px]">MODEL:</span>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="bg-[#121824] text-slate-100 focus:outline-none cursor-pointer text-xs font-mono"
            >
              <option value="prophet_lstm" className="bg-[#0D111A] text-slate-100 py-1.5">Prophet + LightGBM Ensemble</option>
              <option value="sarimax" className="bg-[#0D111A] text-slate-100 py-1.5">SARIMAX with Weather Covariates</option>
              <option value="lstm" className="bg-[#0D111A] text-slate-100 py-1.5">Deep LSTM Sequence Model</option>
            </select>
          </div>
        </div>
      </div>

      {/* KPI Row (Section 32) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Monthly Target Quota"
          value="47.0"
          unit="kt"
          context="MOIL Statutory Production Plan"
          timestamp="Fiscal Year 2026"
          icon={Calendar}
        />
        <KPICard
          title="AI Forecast Production"
          value={simulationResults.projected.toString()}
          unit="kt"
          trend={{ value: `${simulationResults.shortfall > 0 ? '-' : '+'}${simulationResults.shortfall} kt gap`, positive: simulationResults.shortfall === 0 }}
          context="Projected 30-day extraction"
          variant={simulationResults.shortfall > 3.0 ? 'warning' : 'default'}
          icon={TrendingUp}
        />
        <KPICard
          title="Expected Shortfall"
          value={simulationResults.shortfall.toString()}
          unit="kt"
          trend={{ value: `${simulationResults.shortfallProb}% Probability`, positive: false }}
          context="Bottlenecks: EX-04 & rainfall"
          variant="danger"
          icon={AlertTriangle}
        />
        <KPICard
          title="Forecast Confidence"
          value="94.6"
          unit="%"
          trend={{ value: "R² = 0.946", positive: true }}
          context="Calibrated across 180 past shifts"
          variant="intelligence"
          icon={ShieldCheck}
        />
      </div>

      {/* Primary Forecast Graph (Section 32) */}
      <div className="bg-[#0D111A] border border-[#243046] rounded-[16px] p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#1C2536]">
          <div>
            <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              <span>30-Day Production Trajectory & Shortfall Gap Horizon</span>
            </h3>
            <span className="text-xs text-slate-400">
              Solid line: Historical actual extraction (Tons/day) • Dashed amber: Predicted rate • Shaded band: 95% Confidence interval
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-slate-400" />
              <span className="text-slate-300">Target (1,550 T/d)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-sky-400" />
              <span className="text-sky-300">Actual</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-amber-400" />
              <span className="text-amber-300">Forecast</span>
            </div>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1C2536" />
              <XAxis dataKey="day" stroke="#64748B" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
              <YAxis domain={[800, 1800]} stroke="#64748B" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0D111A',
                  borderColor: '#243046',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontFamily: 'monospace',
                  color: '#F8FAFC',
                }}
              />
              <ReferenceLine y={1550} stroke="#EF4444" strokeDasharray="4 4" label={{ value: 'Target 1,550 T/d', fill: '#EF4444', fontSize: 10, position: 'insideTopRight' }} />
              
              {/* Upper and lower 95% confidence interval shaded band */}
              <Area type="monotone" dataKey="upper" stroke="none" fill="#F59E0B" fillOpacity={0.08} />
              <Area type="monotone" dataKey="lower" stroke="none" fill="#07090E" fillOpacity={1.0} />

              {/* Historical actual line */}
              <Line type="monotone" dataKey="actual" stroke="#0EA5E9" strokeWidth={2.5} dot={{ r: 3, fill: '#0EA5E9' }} />

              {/* Forecast line */}
              <Line type="monotone" dataKey="forecast" stroke="#F59E0B" strokeWidth={2.5} strokeDasharray="4 4" dot={{ r: 4, fill: '#F59E0B' }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div
          className={`p-3 rounded-[8px] flex items-center justify-between text-xs font-mono transition-colors ${
            simulationResults.shortfall > 0
              ? 'bg-rose-950/30 border border-rose-800/40 text-rose-300'
              : 'bg-emerald-950/30 border border-emerald-800/40 text-emerald-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {simulationResults.shortfall > 0 ? (
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            ) : (
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            <span>
              {simulationResults.shortfall > 0
                ? `Projected extraction shortfall: -${simulationResults.shortfall} kt against monthly quota. Risk Probability: ${simulationResults.shortfallProb}%.`
                : 'Projected extraction meets or exceeds statutory quota. Production continuity nominal.'}
            </span>
          </div>
          {simulationResults.shortfall > 0 && (
            <Link
              to="/app/recommendations"
              className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 shrink-0 ml-2"
            >
              <span>View Mitigations</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>

      {/* ===================== SCENARIO SIMULATOR (SECTION 33 - SIH DEMO MOMENT) ===================== */}
      <div className="bg-[#0D111A] border-2 border-amber-500/40 rounded-[16px] p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#1C2536]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-[6px] bg-amber-500/20 text-amber-400">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-mono uppercase tracking-wide">
                Interactive Operational Scenario Simulator
              </h3>
              <p className="text-xs text-slate-400">
                Adjust operational constraints in real-time to simulate extraction throughput, shortfall probability, and mitigation ROI.
              </p>
            </div>
          </div>
          <StatusBadge status="warning" label="INTERACTIVE SIH DEMO ENGINE" size="sm" />
        </div>

        {/* 5 Input Parameters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 font-mono text-xs">
          {/* 1. Equipment Availability */}
          <div className="bg-[#121824] p-3.5 rounded-[10px] border border-[#1C2536] space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Equipment Uptime</span>
              <span className="text-white font-bold">{equipmentAvailability}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="100"
              value={equipmentAvailability}
              onChange={(e) => setEquipmentAvailability(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 block">Fleet availability index</span>
          </div>

          {/* 2. Weather Impact */}
          <div className="bg-[#121824] p-3.5 rounded-[10px] border border-[#1C2536] space-y-2">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Weather Severity</span>
            <select
              value={weatherSeverity}
              onChange={(e) => setWeatherSeverity(e.target.value)}
              className="w-full bg-[#0D111A] border border-[#243046] text-white rounded p-1.5 text-xs font-mono cursor-pointer"
            >
              <option value="dry" className="bg-[#0D111A] text-slate-100 py-1.5">Dry / Fair Weather (0 mm)</option>
              <option value="moderate" className="bg-[#0D111A] text-slate-100 py-1.5">Moderate Rain (15-35 mm)</option>
              <option value="heavy" className="bg-[#0D111A] text-slate-100 py-1.5">Monsoon Downpour (&gt; 50 mm)</option>
            </select>
            <span className="text-[10px] text-slate-500 block">Haul road friction penalty</span>
          </div>

          {/* 3. Blasting Delay */}
          <div className="bg-[#121824] p-3.5 rounded-[10px] border border-[#1C2536] space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Blasting Delay</span>
              <span className="text-white font-bold">{blastingDelayDays} Days</span>
            </div>
            <input
              type="range"
              min="0"
              max="6"
              value={blastingDelayDays}
              onChange={(e) => setBlastingDelayDays(Number(e.target.value))}
              className="w-full accent-sky-400 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 block">DGMS clearance latency</span>
          </div>

          {/* 4. Ore Availability */}
          <div className="bg-[#121824] p-3.5 rounded-[10px] border border-[#1C2536] space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Ore Face Access</span>
              <span className="text-white font-bold">{oreAvailability}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="100"
              value={oreAvailability}
              onChange={(e) => setOreAvailability(Number(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 block">Uncovered bench ore stocks</span>
          </div>

          {/* 5. Shift Capacity */}
          <div className="bg-[#121824] p-3.5 rounded-[10px] border border-[#1C2536] space-y-2">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Daily Shift Count</span>
            <div className="grid grid-cols-3 gap-1">
              {[1, 2, 3].map((s) => (
                <button
                  key={s}
                  onClick={() => setShiftCapacity(s)}
                  className={`py-1 rounded text-center font-bold transition-colors cursor-pointer ${
                    shiftCapacity === s
                      ? 'bg-amber-400 text-[#07090E]'
                      : 'bg-[#0D111A] text-slate-400 hover:text-white border border-[#243046]'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <span className="text-[10px] text-slate-500 block">Active 8-hour rotations</span>
          </div>
        </div>

        {/* Real-Time Calculated Outputs (Section 33) */}
        <div className="bg-[#07090E] border border-[#243046] rounded-[12px] p-5 grid grid-cols-1 md:grid-cols-4 gap-4 font-mono items-center">
          <div className="border-b md:border-b-0 md:border-r border-[#1C2536] pb-3 md:pb-0 md:pr-4">
            <span className="text-[10px] text-slate-400 uppercase block">Projected 30D Output</span>
            <div className="text-2xl font-bold text-white mt-0.5">
              {simulationResults.projected} <span className="text-xs font-normal text-slate-400">kt</span>
            </div>
            <span className="text-[10px] text-slate-500">Target: 47.0 kt quota</span>
          </div>

          <div className="border-b md:border-b-0 md:border-r border-[#1C2536] pb-3 md:pb-0 md:pr-4">
            <span className="text-[10px] text-slate-400 uppercase block">Shortfall Probability</span>
            <div className={`text-2xl font-bold mt-0.5 ${simulationResults.shortfallProb > 50 ? 'text-red-400' : 'text-emerald-400'}`}>
              {simulationResults.shortfallProb}%
            </div>
            <span className="text-[10px] text-slate-500">
              {simulationResults.shortfall > 0 ? `Expected Gap: -${simulationResults.shortfall} kt` : 'No deficit projected'}
            </span>
          </div>

          <div className="border-b md:border-b-0 md:border-r border-[#1C2536] pb-3 md:pb-0 md:pr-4">
            <span className="text-[10px] text-slate-400 uppercase block">Recovery from Mitigation</span>
            <div className="text-2xl font-bold text-emerald-400 mt-0.5">
              +{simulationResults.recoveryPotential} <span className="text-xs font-normal text-slate-400">kt</span>
            </div>
            <span className="text-[10px] text-slate-500">Via dynamic fleet reallocation</span>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] text-amber-400 uppercase font-bold block">
              Prescribed Operational Action:
            </span>
            <p className="text-xs text-slate-300 leading-snug">
              {simulationResults.action}
            </p>
            <Link to="/app/recommendations" className="block pt-1">
              <Button variant="primary" size="sm" className="w-full text-[11px]" iconRight={ArrowRight}>
                Execute In Action Center
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
