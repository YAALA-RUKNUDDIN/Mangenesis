import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  Layers,
  TrendingUp,
  AlertTriangle,
  CheckSquare,
  ShieldCheck,
  Compass,
  ArrowRight,
  Clock,
  Play,
  RotateCcw,
  Zap,
  CheckCircle2,
  Calendar,
  ChevronRight,
} from 'lucide-react';
import { useScenario } from '../context/ScenarioContext';
import KPICard from '../components/ui/KPICard';
import Button from '../components/ui/Button';
import StatusBadge from '../components/ui/StatusBadge';
import MineMap from '../components/maps/MineMap';

export default function CommandCenter() {
  const {
    activeMineData,
    activeScenario,
    switchScenario,
    availableScenarios,
    simulationActive,
    startSimulation,
    resetSimulation,
    simulationStep,
  } = useScenario();

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto font-sans">
      {/* ===================== PRIORITY 1: CRITICAL OPERATIONAL THREAT BANNER ===================== */}
      <div className="bg-red-500/10 border-2 border-red-500/30 rounded-[14px] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-[8px] bg-red-500/20 text-red-400 shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-white font-bold text-sm uppercase tracking-wide">
                Critical Threat: Excavator EX-04 Cavitation on Block B Bench 3
              </span>
              <StatusBadge status="critical" label="IMMEDIATE ATTENTION" size="xs" />
            </div>
            <p className="text-xs text-slate-300 font-sans mt-0.5 max-w-2xl leading-relaxed">
              Hydraulic pump pressure drop combined with 38mm monsoonal rainfall risks a <strong>4.2 kt monthly output shortfall</strong> within 48 hours.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link to="/app/recommendations">
            <Button variant="primary" size="sm" iconRight={ArrowRight}>
              Execute Prescribed Action (+3.9 kt Recovery)
            </Button>
          </Link>
        </div>
      </div>

      {/* ===================== CORE KPI ROW (DECISION > INSIGHT > DATA) ===================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <KPICard
          title="Total Proved Reserve"
          value="4.82"
          unit="Mt"
          trend={{ value: "+4.2% YTD", positive: true }}
          context="UNFC 111 (Measured) + 122"
          timestamp="Ordinary Kriging"
          variant="mineral"
          icon={Layers}
        />
        <KPICard
          title="Monthly Output Trajectory"
          value="42.8"
          unit="kt"
          trend={{ value: "-4.2 kt vs 47.0 kt Quota", positive: false }}
          context="Shortfall projected in 4 days"
          variant="warning"
          icon={TrendingUp}
        />
        <KPICard
          title="Active Operational Risk"
          value="High"
          trend={{ value: "1 Critical • 2 Warnings", positive: false }}
          context="Fleet uptime at 82%"
          variant="danger"
          icon={AlertTriangle}
        />
        <KPICard
          title="Actionable Recovery"
          value="+3.9"
          unit="kt"
          trend={{ value: "78% Deficit Recovery", positive: true }}
          context="Via Excavator EX-02 dispatch"
          variant="healthy"
          icon={CheckSquare}
        />
      </div>

      {/* ===================== PRIMARY DUAL INTELLIGENCE SECTIONS ===================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Geospatial Reserve Status (7 cols) */}
        <div className="lg:col-span-7 bg-[#0D111A] border border-[#243046] rounded-[16px] overflow-hidden flex flex-col justify-between">
          <div className="p-3.5 bg-[#0A0D14] border-b border-[#1C2536] flex items-center justify-between font-mono text-xs">
            <div className="flex items-center gap-2 text-white font-bold uppercase tracking-wider">
              <Compass className="w-4 h-4 text-amber-400" />
              <span>Geospatial Reserve Intelligence • {activeMineData.name || 'Gumgaon Mine'}</span>
            </div>
            <Link
              to="/app/reserve-intelligence"
              className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold"
            >
              <span>Full Console</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="h-[360px] w-full relative">
            <MineMap height="100%" className="w-full h-full" />
          </div>

          <div className="p-3 bg-[#0A0E16] border-t border-[#1C2536] flex items-center justify-between font-mono text-xs text-slate-400">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> 111 Measured (3.1 Mt)
              </span>
              <span className="flex items-center gap-1 text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> 122 Indicated (1.7 Mt)
              </span>
            </div>
            <span className="text-slate-500">Sentinel-2 MSI Synced</span>
          </div>
        </div>

        {/* Right: 30-Day Production Trajectory Outlook (5 cols) */}
        <div className="lg:col-span-5 bg-[#0D111A] border border-[#243046] rounded-[16px] p-5 space-y-4 flex flex-col justify-between font-mono">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#1C2536]">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-sky-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  30-Day Extraction Trajectory
                </h3>
              </div>
              <Link
                to="/app/production-forecast"
                className="text-sky-400 hover:text-sky-300 text-xs font-semibold flex items-center gap-1"
              >
                <span>Simulator</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 my-4">
              <div className="bg-[#121824] p-3 rounded-[8px] border border-[#1C2536]">
                <span className="text-[10px] text-slate-500 block uppercase">Monthly Quota</span>
                <span className="text-white font-bold text-base">47.0 kt</span>
              </div>
              <div className="bg-[#121824] p-3 rounded-[8px] border border-[#1C2536]">
                <span className="text-[10px] text-slate-500 block uppercase">AI Forecast Output</span>
                <span className="text-amber-400 font-bold text-base">42.8 kt</span>
              </div>
            </div>

            {/* Visual Progress Bar comparing Output to Target */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Target Achievement:</span>
                <span className="text-amber-400 font-bold">91.1% (Gap: -4.2 kt)</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-[#1C2536] overflow-hidden flex">
                <div className="bg-emerald-400 h-full" style={{ width: '91.1%' }} />
                <div className="bg-red-400 h-full" style={{ width: '8.9%' }} />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 pt-0.5">
                <span>Current Extraction Velocity</span>
                <span className="text-red-400 font-semibold">Deficit Window: Days 4–12</span>
              </div>
            </div>
          </div>

          {/* Quick Action Callout */}
          <div className="bg-amber-500/10 border border-amber-500/25 p-3.5 rounded-[10px] space-y-2">
            <div className="flex items-center gap-1.5 text-xs text-amber-300 font-bold">
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Recommended Operational Prescription</span>
            </div>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              Reassign Excavator EX-02 from waste stripping to Block B high-grade bench to recover +3.9 kt before deadline.
            </p>
            <Link to="/app/recommendations" className="block pt-1">
              <Button variant="primary" size="sm" className="w-full text-xs" iconRight={ArrowRight}>
                Review & Accept Action
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* ===================== SIH 3-MINUTE GUIDED EVALUATION WALKTHROUGH ===================== */}
      <div className="bg-[#0A0D14] border border-[#243046] rounded-[16px] p-5 font-mono">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1C2536]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-[6px] bg-amber-500/20 text-amber-400">
              <Play className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                SIH26009 3-Minute Grand Finale Guided Evaluation Flow
              </h3>
              <p className="text-[11px] text-slate-400 font-sans">
                A structured walkthrough demonstrating the full end-to-end decision journey for jury review.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              icon={Play}
              onClick={startSimulation}
            >
              {simulationActive ? `Step ${simulationStep + 1} of 5 Active` : 'Start 3-Min Walkthrough'}
            </Button>
            {simulationActive && (
              <Button variant="secondary" size="sm" icon={RotateCcw} onClick={resetSimulation}>
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* 5 Walkthrough Nodes */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-4 text-xs">
          {[
            { step: '1. Observe', title: 'Gumgaon Reserve', desc: 'UNFC 111/122 ore block mapping', link: '/app/reserve-intelligence' },
            { step: '2. Explain', title: 'AI Drivers', desc: 'SHAP value feature attribution', link: '/app/reserve-intelligence' },
            { step: '3. Forecast', title: '30-Day Outlook', desc: 'Predicting -4.2 kt production gap', link: '/app/production-forecast' },
            { step: '4. Risk', title: 'Root Cause', desc: 'EX-04 downtime + rainfall', link: '/app/risk-intelligence' },
            { step: '5. Act', title: 'Prescription', desc: 'Closed-loop fleet reallocation', link: '/app/recommendations' },
          ].map((item, idx) => (
            <Link
              key={item.step}
              to={item.link}
              className={`p-3 rounded-[8px] border transition-all ${
                simulationActive && simulationStep === idx
                  ? 'bg-amber-500/20 border-amber-400 text-white shadow-md'
                  : 'bg-[#121824] border-[#1C2536] text-slate-400 hover:text-white hover:border-[#243046]'
              }`}
            >
              <span className="text-[10px] text-amber-400 font-bold block">{item.step}</span>
              <div className="font-bold text-white text-xs mt-0.5">{item.title}</div>
              <p className="text-[10px] text-slate-400 font-sans mt-0.5">{item.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
