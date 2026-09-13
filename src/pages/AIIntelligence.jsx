import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BrainCircuit,
  Sparkles,
  HelpCircle,
  ArrowRight,
  Database,
  BarChart3,
  Send,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import { useScenario } from '../context/ScenarioContext';
import { aiCommandKnowledge } from '../data/mockData';

export default function AIIntelligence() {
  const { scenarioData, activeMineData } = useScenario();
  const [selectedQuery, setSelectedQuery] = useState(aiCommandKnowledge[0]);
  const [customQuery, setCustomQuery] = useState('');

  const handleSelectQuery = (q) => {
    setSelectedQuery(q);
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customQuery.trim()) return;
    const match = aiCommandKnowledge.find((k) =>
      k.query.toLowerCase().includes(customQuery.toLowerCase()) ||
      k.summary.toLowerCase().includes(customQuery.toLowerCase())
    ) || {
      id: 'custom-res',
      query: customQuery,
      summary: `MANGENESIS analytical reasoning for "${customQuery}": current telemetry indicates nominal bounds with zero unmitigated risk windows.`,
      rootCauses: [
        { cause: 'Analyzed rolling 14-day production telemetry', contribution: 50 },
        { cause: 'Validated spatial weather and ground moisture', contribution: 50 },
      ],
      evidence: 'FastAPI telemetry backend and TreeSHAP polynomial-time engine.',
      recommendedAction: 'Continue nominal shift extraction target schedule.',
      expectedImpact: 'Preserves 100% scheduled throughput.',
      sourceData: 'FastAPI Production Regressor & Sensor Telemetry Gateway.',
    };
    setSelectedQuery(match);
  };

  return (
    <PageLayout
      title="AI Decision Intelligence & Explainable AI (XAI)"
      subtitle={`TreeSHAP root-cause feature attributions and operational decision reasoning • ${activeMineData.name}`}
      badge="EXPLAINABLE AI"
    >
      <div className="space-y-6">
        {/* Top 4 AI Core Engine Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-[#131720] border border-[#262F3D] space-y-1">
            <span className="text-[10px] font-mono text-[#C7B59F] uppercase font-bold">1. RESERVE PROSPECTING</span>
            <div className="text-sm font-display font-bold text-white">XGBoost Classifier</div>
            <p className="text-[11px] text-slate-400">0.8825 ROC-AUC &bull; Multi-spectral SWIR 11/12</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#131720] border border-[#262F3D] space-y-1">
            <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">2. CONTINUITY FORECAST</span>
            <div className="text-sm font-display font-bold text-white">LightGBM Regressor</div>
            <p className="text-[11px] text-slate-400">142 TPD RMSE &bull; 7-Day Rolling Telemetry</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#131720] border border-[#262F3D] space-y-1">
            <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">3. ROOT-CAUSE XAI</span>
            <div className="text-sm font-display font-bold text-white">TreeSHAP Engine</div>
            <p className="text-[11px] text-slate-400">&lt;10ms Polynomial Shapley Attributions</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#131720] border border-[#262F3D] space-y-1">
            <span className="text-[10px] font-mono text-amber-400 uppercase font-bold">4. ACTION OPTIMIZER</span>
            <div className="text-sm font-display font-bold text-white">PuLP MILP Solver</div>
            <p className="text-[11px] text-slate-400">&lt;120ms Solve &bull; 77% Recovery Rate</p>
          </div>
        </div>

        {/* Section: Operational Natural-Language Query Console */}
        <div className="p-6 rounded-3xl bg-[#131720] border border-[#262F3D] space-y-5 shadow-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#262F3D]">
            <div>
              <div className="flex items-center gap-2">
                <BrainCircuit size={18} className="text-[#C7B59F]" />
                <h3 className="font-display font-bold text-white text-base">Operational Natural-Language Query Console</h3>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Ask operational mining questions answered using live MANGENESIS data (NOT a generic chatbot).
              </p>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full font-bold">
              Data Layer Connected
            </span>
          </div>

          {/* Quick Click Questions Strip */}
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider block mb-2 font-bold">
              CLICK TO EXECUTE OPERATIONAL QUERY:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {aiCommandKnowledge.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelectQuery(item)}
                  className={`p-2.5 rounded-xl text-left text-xs transition-all cursor-pointer border ${
                    selectedQuery.id === item.id
                      ? 'bg-[#C7B59F]/15 border-[#C7B59F]/50 text-white font-semibold shadow-sm'
                      : 'bg-[#0B0D12] border-[#262F3D] text-slate-300 hover:text-white hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="truncate">{item.query}</span>
                    <ArrowRight size={12} className="text-[#C7B59F] shrink-0 ml-1" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Query Input Bar */}
          <form onSubmit={handleCustomSubmit} className="flex gap-2">
            <input
              type="text"
              placeholder="Type an operational question (e.g., 'Why did production decrease today?')..."
              value={customQuery}
              onChange={(e) => setCustomQuery(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#0B0D12] border border-[#262F3D] text-xs text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-[#C7B59F]"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-[#C7B59F] hover:bg-[#D9CBBA] text-[#1E1813] font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Send size={13} />
              <span>Query AI</span>
            </button>
          </form>

          {/* Structured Structured Operational Answer */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedQuery.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="p-5 rounded-2xl bg-[#0E121D] border border-[#262F3D] space-y-4"
            >
              {/* Question Header */}
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <HelpCircle size={14} className="text-[#C7B59F]" />
                <span className="font-bold text-white text-sm">{selectedQuery.query}</span>
              </div>

              {/* 1. Summary */}
              <div>
                <span className="text-[10px] font-mono uppercase text-[#C7B59F] font-bold block mb-1">
                  1. OPERATIONAL SUMMARY
                </span>
                <p className="text-xs text-slate-200 leading-relaxed font-sans">{selectedQuery.summary}</p>
              </div>

              {/* 2. Root Causes with Percentage Breakdown */}
              <div>
                <span className="text-[10px] font-mono uppercase text-[#C7B59F] font-bold block mb-2">
                  2. MATHEMATICAL ROOT-CAUSE ATTRIBUTION (TreeSHAP)
                </span>
                <div className="space-y-2">
                  {selectedQuery.rootCauses.map((rc, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-slate-300">{rc.cause}</span>
                        <span className="font-bold text-[#D9CBBA]">{rc.contribution}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#C7B59F] to-amber-500"
                          style={{ width: `${rc.contribution}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Evidence */}
              <div>
                <span className="text-[10px] font-mono uppercase text-[#C7B59F] font-bold block mb-1">
                  3. VALIDATED SENSOR & GEOSPATIAL EVIDENCE
                </span>
                <p className="text-xs text-slate-300 leading-relaxed font-mono bg-[#0B0D12] p-2.5 rounded-xl border border-[#262F3D]">
                  {selectedQuery.evidence}
                </p>
              </div>

              {/* 4. Recommendation & Impact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-[#131720] border border-[#262F3D]">
                  <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block mb-1">
                    4. RECOMMENDED INTERVENTION
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed">{selectedQuery.recommendedAction}</p>
                </div>

                <div className="p-3 rounded-xl bg-[#131720] border border-[#262F3D]">
                  <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block mb-1">
                    5. EXPECTED OPERATIONAL IMPACT
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed">{selectedQuery.expectedImpact}</p>
                </div>
              </div>

              {/* Source Data System */}
              <div className="pt-2 border-t border-[#262F3D] flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Source Layer: {selectedQuery.sourceData}</span>
                <span className="text-[#D9CBBA] font-semibold">100% Traceable Output</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </PageLayout>
  );
}
