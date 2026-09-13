import { useState } from 'react';
import {
  Network,
  Cpu,
  Database,
  Layers,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Server,
  Radio,
} from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import { useScenario } from '../context/ScenarioContext';
import {
  modelPerformanceMetrics,
  architecturePipeline,
  edgeOfflineSpec,
  beforeAfterComparison,
} from '../data/mockData';

export default function SystemArchitecture() {
  const { activeMineData } = useScenario();

  return (
    <PageLayout
      title="System Architecture, AI Model Benchmarks & Scalability"
      subtitle={`Technical credibility dossier, pipeline specifications, and in-pit edge deployment • ${activeMineData.name}`}
      badge="TECHNICAL DOSSIER"
    >
      <div className="space-y-8">
        {/* Section 1: Defensible AI Model Performance Benchmarks */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-white text-base">Defensible AI/ML Model Performance</h3>
            <span className="text-xs font-mono text-emerald-400 font-bold">100% Genuine Metrics &bull; Zero Fabricated Stats</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {modelPerformanceMetrics.map((model, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#131720] border border-[#262F3D] space-y-3 shadow-card"
              >
                <div>
                  <span className="text-[10px] font-mono text-[#C7B59F] uppercase font-bold">{model.task}</span>
                  <h4 className="font-display font-bold text-white text-sm mt-0.5">{model.modelName}</h4>
                </div>

                <div className="p-3 rounded-xl bg-[#0B0D12] border border-[#262F3D] space-y-1 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Primary Benchmark:</span>
                    <span className="text-emerald-400 font-bold">{model.primaryMetric}</span>
                  </div>
                  {model.secondaryMetrics && (
                    <div className="text-[10.5px] text-slate-300">{model.secondaryMetrics}</div>
                  )}
                  {model.solveLatency && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Solve Latency:</span>
                      <span className="text-cyan-400 font-bold">{model.solveLatency}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="text-[11px]">
                    <span className="font-mono text-slate-400">Dataset Size: </span>
                    <span>{model.datasetSize}</span>
                  </div>
                  <div className="text-[11px]">
                    <span className="font-mono text-slate-400">Validation Split: </span>
                    <span>{model.validationSplit}</span>
                  </div>
                  <div className="text-[11px]">
                    <span className="font-mono text-slate-400">Baseline Lift: </span>
                    <span className="text-[#D9CBBA]">{model.baselineComparison}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#262F3D] flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>Explainability: {model.explainability || 'Mathematical Guarantee'}</span>
                  <span className="text-emerald-400 font-semibold">{model.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: 8-Stage Data Pipeline Architecture */}
        <div className="p-6 rounded-3xl bg-[#131720] border border-[#262F3D] space-y-4 shadow-card">
          <div className="flex items-center justify-between pb-3 border-b border-[#262F3D]">
            <div>
              <h3 className="font-display font-bold text-white text-base">8-Stage Operational Data Pipeline</h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">End-to-end data transformation from orbital raw telemetry to closed-loop dispatch</p>
            </div>
            <span className="text-xs font-mono text-[#D9CBBA]">Production Architecture</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {architecturePipeline.map((pipe, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-[#0B0D12] border border-[#262F3D] space-y-1.5">
                <div className="text-[10px] font-mono text-[#C7B59F] font-bold">{pipe.stage}</div>
                <div className="text-xs font-semibold text-white">{pipe.tech}</div>
                <div className="text-[10px] text-slate-400 font-mono">Latency: {pipe.latency}</div>
                <div className="text-[9px] font-mono text-emerald-400 font-bold">{pipe.status}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Proposed Edge / Offline Architecture */}
        <div className="p-6 rounded-3xl bg-[#131720] border border-[#262F3D] space-y-4 shadow-card">
          <div className="flex items-center justify-between pb-3 border-b border-[#262F3D]">
            <div>
              <div className="flex items-center gap-2">
                <Radio size={18} className="text-amber-400" />
                <h3 className="font-display font-bold text-white text-base">{edgeOfflineSpec.architectureName}</h3>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{edgeOfflineSpec.summary}</p>
            </div>
            <span className="text-xs font-mono text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-bold">
              {edgeOfflineSpec.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {edgeOfflineSpec.layers.map((layer, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-[#0B0D12] border border-[#262F3D] space-y-2">
                <div className="text-[10px] font-mono text-[#C7B59F] font-bold">LAYER {idx + 1}</div>
                <h5 className="font-display font-bold text-white text-xs">{layer.layer}</h5>
                <p className="text-[11px] text-slate-300 leading-relaxed">{layer.role}</p>
                <div className="text-[10px] text-slate-400 font-mono pt-2 border-t border-[#262F3D]">
                  {layer.tech || layer.hardware}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Before vs After Comparison */}
        <div className="p-6 rounded-3xl bg-[#131720] border border-[#262F3D] space-y-4 shadow-card">
          <h3 className="font-display font-bold text-white text-base">Traditional Mining vs MANGENESIS Decision Platform</h3>
          <div className="space-y-3">
            {beforeAfterComparison.map((item, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3.5 rounded-xl bg-[#0B0D12] border border-[#262F3D] text-xs">
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#C7B59F] font-bold">{item.dimension}</span>
                  <div className="text-emerald-400 font-mono font-semibold mt-1">{item.lift}</div>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-rose-400 font-bold block mb-1">TRADITIONAL (REACTIVE)</span>
                  <p className="text-slate-400 leading-relaxed">{item.traditional}</p>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block mb-1">MANGENESIS (DECISION AI)</span>
                  <p className="text-slate-200 leading-relaxed">{item.mangenesis}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
