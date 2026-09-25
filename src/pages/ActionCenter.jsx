import { useState } from 'react';
import {
  CheckSquare,
  AlertTriangle,
  ArrowRight,
  Clock,
  CheckCircle2,
  TrendingUp,
  UserCheck,
  RotateCcw,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { useScenario } from '../context/ScenarioContext';
import KPICard from '../components/ui/KPICard';
import Button from '../components/ui/Button';
import StatusBadge from '../components/ui/StatusBadge';
import Drawer from '../components/ui/Drawer';

export default function ActionCenter() {
  const { activeMineData, executedActionIds, executePrescriptiveAction } = useScenario();
  const [selectedAction, setSelectedAction] = useState(null);

  // Recommendations with dynamic operational workflow state (Section 36 & 37)
  const [recommendations, setRecommendations] = useState([
    {
      id: 'REC-01',
      title: 'Excavator Reallocation to Avert Block B Shortfall',
      category: 'Equipment & Bench Dispatch',
      cause: 'Primary loading shovel EX-04 experienced hydraulic pressure drop.',
      secondaryFactor: 'Monsoon rainfall (38mm) saturated southern haul road.',
      recommendedAction: 'Reassign auxiliary Excavator EX-02 from waste stripping to high-grade Bench 3. Reroute haul traffic via eastern all-weather bypass.',
      expectedImprovement: '+8.4% Recovery (+3.9 kt)',
      confidence: 91.2,
      impact: 'Mitigates 78% of projected monthly production gap',
      status: 'Pending', // 'Pending' | 'Accepted' | 'Assigned' | 'In Progress' | 'Completed'
      assignee: 'Mining Ops Lead: V. Deshpande',
      priority: 'CRITICAL',
      timestamp: 'Generated 18m ago',
      timeline: [
        { state: 'Generated', time: '14:20 IST', note: 'AI shortfall horizon model triggered alert.' },
      ],
    },
    {
      id: 'REC-02',
      title: 'Infill Diamond Drilling on Northeast Strike (G-01)',
      category: 'Reserve Classification Expansion',
      cause: '42.8% Mn grade continuity indicated along eastern fault strike.',
      secondaryFactor: 'Current drill density is 80m (insufficient for UNFC 111 Measured category).',
      recommendedAction: 'Execute 3 inclined core holes (DP-G07, G08, G09) at 35m spacing to convert 1.7 Mt Inferred ore into Measured reserve.',
      expectedImprovement: '+1.7 Mt Proved Reserve',
      confidence: 88.5,
      impact: 'Upgrades JORC/UNFC compliance and secures FY27 mine plan',
      status: 'Accepted',
      assignee: 'Chief Geologist: A. Banerjee',
      priority: 'HIGH',
      timestamp: 'Generated 1h ago',
      timeline: [
        { state: 'Generated', time: '13:10 IST', note: 'Sentinel-2 Band 11/12 ratio anomaly confirmed.' },
        { state: 'Accepted', time: '13:45 IST', note: 'Accepted by Chief Geologist for execution.' },
      ],
    },
    {
      id: 'REC-03',
      title: 'Electronic Timing Optimization for Pit 4 Blast',
      category: 'Blasting & Fragmentation',
      cause: 'DGMS 300m public highway vibration buffer limit reached.',
      secondaryFactor: 'Secondary rock breaking costs increased by 22% due to coarse fragmentation.',
      recommendedAction: 'Shift to 25ms electronic delay wave sequence with deck charging to reduce peak particle velocity (PPV) below 5 mm/s.',
      expectedImprovement: '+14% Muckpile Diggability',
      confidence: 94.0,
      impact: 'Saves 2.4 hrs per day in excavator cycle times',
      status: 'In Progress',
      assignee: 'Blasting Officer: R. Verma',
      priority: 'MEDIUM',
      timestamp: 'Generated 3h ago',
      timeline: [
        { state: 'Generated', time: '11:00 IST', note: 'Vibration simulation completed.' },
        { state: 'Accepted', time: '11:30 IST', note: 'Approved by DGMS Safety Liaison.' },
        { state: 'Assigned', time: '12:00 IST', note: 'Assigned to Magazine Crew.' },
        { state: 'In Progress', time: '13:30 IST', note: 'Blast pattern drilled and primed.' },
      ],
    },
    {
      id: 'REC-04',
      title: 'Low-Grade Ore Ferromanganese Sinter Blending',
      category: 'Grade Optimization',
      cause: 'Stockpile 3 accumulated 12,000 tons of 28% Mn sub-grade ore.',
      secondaryFactor: 'High-grade ore pit faces delayed by water clearing.',
      recommendedAction: 'Blend 30% of Stockpile 3 with 70% high-grade (44% Mn) ore from Block A to achieve required 38.5% plant feed spec.',
      expectedImprovement: '+₹54 Lakh Saved Waste',
      confidence: 96.5,
      impact: 'Eliminates 12 kt of sub-grade stock while maintaining blend',
      status: 'Completed',
      assignee: 'Processing Plant Mgr: T. Nambiar',
      priority: 'LOW',
      timestamp: 'Generated 6h ago',
      timeline: [
        { state: 'Generated', time: '08:30 IST', note: 'Stockpile assay check logged.' },
        { state: 'Accepted', time: '09:00 IST', note: 'Plant blend ratio confirmed.' },
        { state: 'Assigned', time: '09:30 IST', note: 'Loader crew dispatched.' },
        { state: 'In Progress', time: '10:00 IST', note: 'Feed blend running smoothly.' },
        { state: 'Completed', time: '14:00 IST', note: 'Full batch blended without grade penalty.' },
      ],
    },
  ]);

  // Handle workflow state transitions (Section 37: Pending -> Accepted -> Assigned -> In Progress -> Completed)
  const advanceStatus = (recId) => {
    setRecommendations((prev) =>
      prev.map((r) => {
        if (r.id !== recId) return r;
        let nextStatus = r.status;
        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        if (r.status === 'Pending') nextStatus = 'Accepted';
        else if (r.status === 'Accepted') nextStatus = 'Assigned';
        else if (r.status === 'Assigned') nextStatus = 'In Progress';
        else if (r.status === 'In Progress') nextStatus = 'Completed';

        return {
          ...r,
          status: nextStatus,
          timeline: [
            ...r.timeline,
            { state: nextStatus, time: now, note: `Status updated to ${nextStatus}.` },
          ],
        };
      })
    );
  };

  const activeRecDetail = selectedAction || recommendations[0];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto font-sans">
      {/* Console Header */}
      <div className="bg-[#0D111A] border border-[#243046] rounded-[14px] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold font-mono text-white tracking-tight">
              Action Center & Prescriptive Interventions
            </h1>
            <StatusBadge status="healthy" label="CLOSED-LOOP PROTOCOL" size="xs" />
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Turn predictions into verifiable operational actions with quantified recovery potential and state progression tracking for {activeMineData.name || 'Gumgaon Mine'}.
          </p>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <KPICard
          title="Active Interventions"
          value={recommendations.length.toString()}
          unit="Actions"
          context="AI-Generated Recommendations"
          timestamp="Live dispatch"
          icon={CheckSquare}
        />
        <KPICard
          title="Pending Approval"
          value={recommendations.filter((r) => r.status === 'Pending').length.toString()}
          unit="Protocols"
          trend={{ value: "Action Required", positive: false }}
          context="Awaiting superintendent signoff"
          variant="warning"
          icon={AlertTriangle}
        />
        <KPICard
          title="In Execution"
          value={recommendations.filter((r) => r.status === 'In Progress' || r.status === 'Assigned').length.toString()}
          unit="Active Rigs"
          context="Under field implementation"
          variant="intelligence"
          icon={Clock}
        />
        <KPICard
          title="Total Recovery Potential"
          value="+8.4%"
          unit="Output"
          trend={{ value: "+3.9 kt Ore", positive: true }}
          context="Across all open prescriptions"
          variant="mineral"
          icon={TrendingUp}
        />
      </div>

      {/* Recommendations Cards Grid (Section 36 & 37) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1 font-mono">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Operational Action Backlog & State Progression
          </h3>
          <span className="text-[11px] text-slate-400">
            Pending → Accepted → Assigned → In Progress → Completed
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 font-mono">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className="bg-[#0D111A] border border-[#243046] hover:border-amber-500/40 rounded-[16px] p-5 sm:p-6 transition-all space-y-4 shadow-sm"
            >
              {/* Header row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1C2536]">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      rec.priority === 'CRITICAL'
                        ? 'bg-red-400'
                        : rec.priority === 'HIGH'
                        ? 'bg-amber-400'
                        : 'bg-sky-400'
                    }`}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold text-base">{rec.title}</span>
                      <StatusBadge
                        status={
                          rec.status === 'Completed'
                            ? 'healthy'
                            : rec.status === 'In Progress'
                            ? 'intelligence'
                            : rec.status === 'Pending'
                            ? 'warning'
                            : 'neutral'
                        }
                        label={rec.status}
                        size="xs"
                      />
                    </div>
                    <span className="text-[11px] text-slate-500 font-normal">
                      {rec.id} • {rec.category} • {rec.timestamp}
                    </span>
                  </div>
                </div>

                {/* State Transition Button */}
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setSelectedAction(rec)}
                  >
                    View Details
                  </Button>
                  {rec.status !== 'Completed' && (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => advanceStatus(rec.id)}
                      iconRight={ArrowRight}
                    >
                      {rec.status === 'Pending'
                        ? 'Accept Protocol'
                        : rec.status === 'Accepted'
                        ? 'Assign Crew'
                        : rec.status === 'Assigned'
                        ? 'Start Work'
                        : 'Mark Complete'}
                    </Button>
                  )}
                </div>
              </div>

              {/* Cause, Secondary Factor, and Action Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="bg-[#121824] p-3 rounded-[8px] border border-[#1C2536] space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Root Cause:
                  </span>
                  <p className="text-slate-300 leading-snug">{rec.cause}</p>
                </div>

                <div className="bg-[#121824] p-3 rounded-[8px] border border-[#1C2536] space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Secondary Factor:
                  </span>
                  <p className="text-slate-300 leading-snug">{rec.secondaryFactor}</p>
                </div>

                <div className="bg-amber-500/10 p-3 rounded-[8px] border border-amber-500/25 space-y-1">
                  <span className="text-[10px] text-amber-400 uppercase font-bold block">
                    Expected Operational Impact:
                  </span>
                  <p className="text-amber-200 font-bold text-sm leading-snug">
                    {rec.expectedImprovement}
                  </p>
                  <span className="text-[10px] text-slate-400 block font-normal">{rec.impact}</span>
                </div>
              </div>

              {/* Prescribed Action Block */}
              <div className="bg-[#07090E] p-3.5 rounded-[10px] border border-[#1C2536] text-xs">
                <span className="text-[10px] text-sky-400 uppercase font-bold block mb-1">
                  Recommended Operational Action:
                </span>
                <p className="text-slate-200 leading-relaxed">{rec.recommendedAction}</p>
              </div>

              {/* Workflow Timeline Strip (Section 37) */}
              <div className="pt-2 flex flex-wrap items-center gap-3 text-[11px] text-slate-400 border-t border-[#1C2536]">
                <span className="text-slate-500">Timeline:</span>
                {rec.timeline.map((t, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="text-white font-semibold">{t.state}</span>
                    <span className="text-slate-500 text-[10px]">({t.time})</span>
                    {idx < rec.timeline.length - 1 && <span className="text-slate-600">→</span>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Details & Audit Drawer */}
      <Drawer
        isOpen={Boolean(selectedAction)}
        onClose={() => setSelectedAction(null)}
        title={selectedAction ? selectedAction.title : ''}
        subtitle={selectedAction ? selectedAction.id : ''}
        badge={
          selectedAction ? (
            <StatusBadge
              status={selectedAction.status === 'Completed' ? 'healthy' : 'warning'}
              label={selectedAction.status}
              size="xs"
            />
          ) : null
        }
        footer={
          <div className="flex items-center gap-2 w-full font-mono">
            <Button variant="secondary" size="sm" className="flex-1" onClick={() => setSelectedAction(null)}>
              Close
            </Button>
            {selectedAction && selectedAction.status !== 'Completed' && (
              <Button
                variant="primary"
                size="sm"
                className="flex-1"
                onClick={() => {
                  advanceStatus(selectedAction.id);
                  setSelectedAction(null);
                }}
              >
                Advance Status
              </Button>
            )}
          </div>
        }
      >
        {selectedAction && (
          <div className="space-y-4 font-mono text-xs">
            <div className="bg-[#121824] p-3.5 rounded-[8px] border border-[#1C2536] space-y-2">
              <span className="text-[10px] text-amber-400 uppercase font-bold block">
                Prescription Intelligence Summary
              </span>
              <div className="space-y-2 text-slate-300">
                <div>
                  <span className="text-slate-500 text-[10px] block">PRIMARY ROOT CAUSE</span>
                  <p className="text-white">{selectedAction.cause}</p>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">SECONDARY FACTOR</span>
                  <p className="text-slate-300">{selectedAction.secondaryFactor}</p>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">ASSIGNED OPERATIONAL OWNER</span>
                  <p className="text-sky-400 font-semibold">{selectedAction.assignee}</p>
                </div>
              </div>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/30 p-3.5 rounded-[8px] space-y-1">
              <span className="text-[10px] text-emerald-400 uppercase font-bold">
                Quantified Improvement Potential
              </span>
              <p className="text-emerald-200 text-sm font-bold">
                {selectedAction.expectedImprovement}
              </p>
              <p className="text-[11px] text-slate-300 font-normal">{selectedAction.impact}</p>
            </div>

            <div className="bg-[#121824] p-3.5 rounded-[8px] border border-[#1C2536] space-y-2">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                Execution State Audit Log
              </span>
              <div className="space-y-2 text-[11px]">
                {selectedAction.timeline.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2 border-l border-slate-700 pl-3 py-1">
                    <div>
                      <div className="text-white font-bold">{step.state} • {step.time}</div>
                      <div className="text-slate-400 text-[10px]">{step.note}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
