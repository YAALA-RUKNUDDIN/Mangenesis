import { useState } from 'react';
import {
  History,
  ShieldCheck,
  Filter,
  FileDown,
  Search,
  CheckCircle2,
  AlertTriangle,
  Info,
} from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import { useScenario } from '../context/ScenarioContext';

export default function AuditLog() {
  const { auditLogList, activeMineData } = useScenario();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('ALL');

  const filteredLogs = auditLogList.filter((log) => {
    const matchesSearch =
      log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSeverity =
      selectedSeverity === 'ALL' || log.severity === selectedSeverity;

    return matchesSearch && matchesSeverity;
  });

  return (
    <PageLayout
      title="Immutable Operational Audit Trail"
      subtitle={`Chronological event ledger for automated AI detections and operator actions • ${activeMineData.name}`}
      badge="AUDIT LEDGER"
    >
      <div className="space-y-6">
        {/* Compliance Integrity Banner */}
        <div className="p-4 rounded-2xl bg-[#131720] border border-[#262F3D] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div>
              <div className="text-xs font-display font-bold text-white">CRYPTOGRAPHIC INTEGRITY GUARANTEED</div>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                DGMS & ISO-19011 compliant event tracking. Zero in-place edits permitted.
              </p>
            </div>
          </div>

          <div className="text-right font-mono text-xs text-slate-400">
            <span>Total Logged Events: </span>
            <span className="text-white font-bold">{auditLogList.length} Entries</span>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-xl bg-[#131720] border border-[#262F3D]">
          <div className="relative w-full sm:w-72">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search audit trail..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#0B0D12] border border-[#262F3D] text-xs text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-[#C7B59F]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-mono text-slate-400">Severity:</span>
            {['ALL', 'CRITICAL', 'HIGH', 'INFO', 'SUCCESS'].map((sev) => (
              <button
                key={sev}
                onClick={() => setSelectedSeverity(sev)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  selectedSeverity === sev
                    ? 'bg-[#C7B59F] text-[#1E1813] font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline Log Table */}
        <div className="space-y-3">
          {filteredLogs.map((log) => {
            const isCrit = log.severity === 'CRITICAL';
            const isHigh = log.severity === 'HIGH';
            const isSuccess = log.severity === 'SUCCESS';

            return (
              <div
                key={log.id}
                className="p-4 rounded-2xl bg-[#131720] border border-[#262F3D] hover:border-white/20 transition-all space-y-2"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs font-mono">
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-[#C7B59F]">{log.id}</span>
                    <span className="text-slate-400">&bull;</span>
                    <span className="text-slate-300 font-semibold">{log.eventType}</span>
                    <span className="text-slate-400">&bull;</span>
                    <span className="text-slate-400">{log.entity}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                        isCrit
                          ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                          : isHigh
                          ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                          : isSuccess
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                          : 'bg-blue-500/15 text-blue-300 border-blue-500/30'
                      }`}
                    >
                      {log.severity}
                    </span>
                    <span className="text-slate-500 text-[11px]">{log.timestamp}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-200 leading-relaxed pl-1">{log.description}</p>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 border-t border-[#262F3D]/60 text-[11px] font-mono text-slate-400 gap-1 pl-1">
                  <div>
                    <span className="text-slate-500">Evidence: </span>
                    <span className="text-slate-300">{log.evidence}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Actor: </span>
                    <span className="text-[#D9CBBA]">{log.actor}</span> &bull;{' '}
                    <span className="text-slate-500">Source: </span>
                    <span>{log.sourceSystem}</span>
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
