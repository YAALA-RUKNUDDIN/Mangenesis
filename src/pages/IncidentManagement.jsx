import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileCheck2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  UserCheck,
  Zap,
  ArrowRight,
} from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import { useScenario } from '../context/ScenarioContext';

export default function IncidentManagement() {
  const {
    incidentsList,
    acknowledgeIncident,
    startWorkOrder,
    resolveIncident,
    activeMineData,
  } = useScenario();

  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredIncidents = incidentsList.filter((inc) => {
    if (statusFilter === 'ALL') return true;
    return inc.status === statusFilter;
  });

  return (
    <PageLayout
      title="Closed-Loop Incident & Work Order Lifecycle"
      subtitle={`End-to-end incident management: Detect → Assign → Progress → Resolve • ${activeMineData.name}`}
      badge="CLOSED-LOOP DECISION"
    >
      <div className="space-y-6">
        {/* Lifecycle Flow Header Bar */}
        <div className="p-4 rounded-2xl bg-[#131720] border border-[#262F3D] shadow-card">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3 font-bold">
            CLOSED-LOOP OPERATIONAL LIFECYCLE
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { step: '1. DETECTED', count: incidentsList.filter((i) => i.status === 'DETECTED').length, color: 'text-rose-400' },
              { step: '2. ACKNOWLEDGED', count: incidentsList.filter((i) => i.status === 'ACKNOWLEDGED').length, color: 'text-amber-400' },
              { step: '3. IN PROGRESS', count: incidentsList.filter((i) => i.status === 'IN_PROGRESS').length, color: 'text-blue-400' },
              { step: '4. RESOLVED', count: incidentsList.filter((i) => i.status === 'RESOLVED').length, color: 'text-emerald-400' },
            ].map((st) => (
              <div key={st.step} className="p-3 rounded-xl bg-[#0B0D12] border border-[#262F3D] text-center">
                <div className="text-[10px] font-mono text-slate-400">{st.step}</div>
                <div className={`text-xl font-display font-bold ${st.color} mt-1`}>{st.count}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-2 p-2 rounded-xl bg-[#131720] border border-[#262F3D]">
          <span className="text-xs font-mono text-slate-400 px-2">Filter State:</span>
          {['ALL', 'DETECTED', 'ACKNOWLEDGED', 'IN_PROGRESS', 'RESOLVED'].map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                statusFilter === f
                  ? 'bg-[#C7B59F] text-[#1E1813] font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Incidents Table / Cards */}
        <div className="space-y-3">
          {filteredIncidents.map((inc) => {
            const isCrit = inc.severity === 'CRITICAL';
            const isHigh = inc.severity === 'HIGH';

            return (
              <div
                key={inc.id}
                className={`p-5 rounded-2xl bg-[#131720] border transition-all ${
                  isCrit
                    ? 'border-rose-500/40 shadow-lg shadow-rose-950/20'
                    : isHigh
                    ? 'border-amber-500/30'
                    : 'border-[#262F3D]'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#262F3D]">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-[#C7B59F]">{inc.id}</span>
                    <span className="text-sm font-display font-bold text-white">{inc.title}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${
                        isCrit ? 'bg-rose-500/15 text-rose-300 border-rose-500/30' : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                      }`}
                    >
                      {inc.severity}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-slate-200">
                      {inc.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-3 text-xs">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400">ROOT CAUSE</span>
                    <p className="text-slate-300 mt-0.5">{inc.rootCause}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-400">RECOMMENDED ACTION</span>
                    <p className="text-slate-300 mt-0.5">{inc.recommendedAction}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-400">ASSIGNED TEAM</span>
                    <p className="text-slate-200 font-semibold mt-0.5">{inc.assignedTeam}</p>
                    <span className="text-[10px] text-slate-500 font-mono">Lead: {inc.assignedLead}</span>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-3 border-t border-[#262F3D] text-xs font-mono text-slate-400 gap-2">
                  <div className="flex items-center gap-3">
                    <span>Audit Ref: {inc.auditId}</span>
                    {inc.impactRecoveredTonnes > 0 && (
                      <span className="text-emerald-400 font-semibold">
                        Impact Recovered: +{inc.impactRecoveredTonnes} T
                      </span>
                    )}
                  </div>

                  {/* Lifecycle Transitions */}
                  <div className="flex items-center gap-2">
                    {inc.status === 'DETECTED' && (
                      <button
                        onClick={() => acknowledgeIncident(inc.id)}
                        className="px-3 py-1.5 rounded-xl bg-[#C7B59F]/20 hover:bg-[#C7B59F]/30 border border-[#C7B59F]/40 text-[#E8DFD1] font-semibold cursor-pointer"
                      >
                        Acknowledge Ticket
                      </button>
                    )}
                    {inc.status === 'ACKNOWLEDGED' && (
                      <button
                        onClick={() => startWorkOrder(inc.id)}
                        className="px-3 py-1.5 rounded-xl bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/50 text-blue-200 font-semibold cursor-pointer"
                      >
                        Start Work Order
                      </button>
                    )}
                    {inc.status === 'IN_PROGRESS' && (
                      <button
                        onClick={() => resolveIncident(inc.id, 'Repair completed and verified by shift engineer.')}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/50 text-emerald-200 font-semibold cursor-pointer"
                      >
                        Mark Resolved & Verify
                      </button>
                    )}
                    {inc.status === 'RESOLVED' && (
                      <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                        <CheckCircle2 size={13} />
                        Resolution Logged in Audit Trail
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </PageLayout>
  );
}
