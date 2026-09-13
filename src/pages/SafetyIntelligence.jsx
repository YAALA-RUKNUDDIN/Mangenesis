import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Radio,
  Clock,
  UserCheck,
  CheckCircle2,
  FileText,
  MapPin,
} from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import { useScenario } from '../context/ScenarioContext';

export default function SafetyIntelligence() {
  const { safetyList, activeMineData, addAuditEntry } = useScenario();
  const [hazards, setHazards] = useState(safetyList);

  const handleAcknowledgeHazard = (hazardId) => {
    setHazards((prev) =>
      prev.map((h) =>
        h.id === hazardId ? { ...h, status: 'UNDER_INSPECTION' } : h
      )
    );
    const target = hazards.find((h) => h.id === hazardId);
    addAuditEntry({
      eventType: 'SAFETY_HAZARD_ACKNOWLEDGED',
      severity: 'HIGH',
      actor: 'Safety Officer Dr. R. K. Singh',
      entity: `Hazard ${hazardId}`,
      description: `Safety hazard acknowledged: ${target?.title}. Field inspection dispatched under ${target?.complianceStandard}.`,
      evidence: target?.metricValue || 'Threshold exceeded',
      sourceSystem: 'DGMS Safety Module',
    });
  };

  return (
    <PageLayout
      title="Safety Intelligence & DGMS Compliance Monitoring"
      subtitle={`Continuous slope stability, blast exclusion zones, and hazard mitigation • ${activeMineData.name}`}
      badge="DGMS COMPLIANCE"
    >
      <div className="space-y-6">
        {/* Top Safety Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-[#131720] border border-[#262F3D] shadow-card">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">DGMS COMPLIANCE</span>
              <ShieldCheck size={16} className="text-emerald-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-display font-bold text-white">100%</span>
              <span className="text-[11px] font-mono text-emerald-400">Audit Ready</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">MMR 1961 Bench Safety Standards</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#131720] border border-[#262F3D] shadow-card">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">ACTIVE HAZARDS</span>
              <AlertTriangle size={16} className="text-amber-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-display font-bold text-amber-300">
                {hazards.filter((h) => h.status === 'ACTIVE').length}
              </span>
              <span className="text-[11px] font-mono text-slate-400">Total 4</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Under Real-Time Radar Extensometer</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#131720] border border-[#262F3D] shadow-card">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">BLAST EXCLUSION</span>
              <Radio size={16} className="text-rose-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-display font-bold text-rose-400">500m</span>
              <span className="text-[11px] font-mono text-emerald-400">Geofence Clear</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Sector D-09 Blast Scheduled 13:00</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#131720] border border-[#262F3D] shadow-card">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">MAX DISPLACEMENT</span>
              <Clock size={16} className="text-slate-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-display font-bold text-white">4.8 mm/d</span>
              <span className="text-[11px] font-mono text-amber-400">Warning Limit</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">North Ridge Bench Level +12m</p>
          </div>
        </div>

        {/* Active Safety Hazards Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-white text-base">Active Geotechnical & Safety Advisories</h3>
            <span className="text-xs font-mono text-slate-400">Automated Sensor Polling &bull; 10s Rate</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hazards.map((hazard) => {
              const isCritical = hazard.severity === 'CRITICAL';
              const isHigh = hazard.severity === 'HIGH';

              return (
                <div
                  key={hazard.id}
                  className={`p-5 rounded-2xl bg-[#131720] border space-y-3 ${
                    isCritical
                      ? 'border-rose-500/50 shadow-lg shadow-rose-950/20'
                      : isHigh
                      ? 'border-amber-500/40'
                      : 'border-[#262F3D]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-white text-sm">{hazard.title}</span>
                        <span className="text-[10px] font-mono text-slate-400">({hazard.id})</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono mt-0.5">
                        <MapPin size={12} className="text-[#C7B59F]" />
                        <span>{hazard.zone}</span>
                      </div>
                    </div>

                    <span
                      className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-md border ${
                        isCritical
                          ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                          : isHigh
                          ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                          : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                      }`}
                    >
                      {hazard.severity}
                    </span>
                  </div>

                  {/* Sensor Reading vs Threshold */}
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-2.5 rounded-xl bg-[#0B0D12] border border-[#262F3D]">
                      <span className="text-[10px] text-slate-400">SENSOR READING</span>
                      <div className="text-slate-100 font-bold mt-0.5">{hazard.metricValue}</div>
                      <span className="text-[9px] text-slate-500 truncate block">{hazard.sensorType}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#0B0D12] border border-[#262F3D]">
                      <span className="text-[10px] text-slate-400">DGMS LIMIT</span>
                      <div className="text-[#D9CBBA] font-bold mt-0.5">{hazard.thresholdLimit}</div>
                      <span className="text-[9px] text-slate-500">Statutory Cutoff</span>
                    </div>
                  </div>

                  {/* Recommended Action */}
                  <div className="p-3 rounded-xl bg-[#0E121D] border border-[#262F3D]/80 text-xs">
                    <span className="font-mono text-[10px] text-slate-400 uppercase">MANDATORY INTERVENTION</span>
                    <p className="text-slate-200 mt-0.5 leading-relaxed">{hazard.recommendedAction}</p>
                  </div>

                  {/* Compliance Standard & Officer */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-[#262F3D] gap-2">
                    <div className="flex items-center gap-1.5">
                      <UserCheck size={13} className="text-emerald-400" />
                      <span>{hazard.assignedOfficer}</span>
                    </div>

                    {hazard.status === 'ACTIVE' ? (
                      <button
                        onClick={() => handleAcknowledgeHazard(hazard.id)}
                        className="px-3 py-1 rounded-lg bg-[#C7B59F]/20 hover:bg-[#C7B59F]/30 border border-[#C7B59F]/40 text-[#E8DFD1] text-xs font-semibold transition-all cursor-pointer"
                      >
                        Acknowledge Advisory
                      </button>
                    ) : (
                      <span className="flex items-center gap-1 text-emerald-400 text-xs font-semibold">
                        <CheckCircle2 size={13} />
                        Under Inspection
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
