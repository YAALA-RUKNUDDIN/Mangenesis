import { useState } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  Clock,
  TrendingDown,
  Filter,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Wrench,
  CloudRain,
  Zap,
  Layers,
  Truck,
} from 'lucide-react';
import { useScenario } from '../context/ScenarioContext';
import KPICard from '../components/ui/KPICard';
import Drawer from '../components/ui/Drawer';
import StatusBadge from '../components/ui/StatusBadge';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';

export default function RiskIntelligence() {
  const { activeMineData } = useScenario();
  const [selectedRisk, setSelectedRisk] = useState(null);
  const [filterSeverity, setFilterSeverity] = useState('ALL');

  const riskRegistry = [
    {
      id: 'RSK-01',
      category: 'Equipment',
      title: 'Excavator EX-04 Hydraulic Pump Cavitation',
      affectedBlock: 'Block B Bench 3',
      probability: 88,
      impact: '3.8 kt Shortfall / Day',
      timeHorizon: '2–4 Days',
      status: 'CRITICAL',
      severity: 'HIGH',
      icon: Wrench,
      description: 'Secondary telemetry sensors show rapid vibration spike and hydraulic pressure loss in primary loading shovel.',
      contributingFactors: [
        'Exceeded scheduled 250hr fluid maintenance window by 36 hours.',
        'High ambient operating temperatures (41°C) on open pit floor.',
        'Abrasive quartzite rock loading accelerating cylinder seal wear.',
      ],
      predictedOutcome: 'Catastrophic hydraulic lockup causing full 18-hour bench shutdown within 48 hours.',
      recommendedMitigation: 'Reassign standby shovel EX-02 immediately from waste overburden; route EX-04 to workshop bay 2.',
      confidence: 93.4,
      owner: 'Maintenance Supt. K. Deshmukh',
    },
    {
      id: 'RSK-02',
      category: 'Weather',
      title: 'Monsoon Surcharge on Southern Haul Road Ramp',
      affectedBlock: 'South Portal Access Ramp',
      probability: 76,
      impact: '2.4 kt Extraction Drag',
      timeHorizon: '12–24 Hours',
      status: 'WARNING',
      severity: 'MEDIUM',
      icon: CloudRain,
      description: 'IMD doppler radar and local weather telemetry forecast 45mm rainfall over next 24 hours causing clay saturation.',
      contributingFactors: [
        'Drainage ditch culvert C-3 partially choked with silt.',
        'Haul road ramp gradient exceeds 8% at hairpin turn 2.',
        'Soil moisture sensor SMAP-01 reading 38% saturation.',
      ],
      predictedOutcome: 'Loaded haul trucks (40T) experience traction slip; haul cycle time increases from 14min to 26min.',
      recommendedMitigation: 'Deploy grader G-01 with aggregate roadbed dressing; activate auxiliary diesel sump pump P-2.',
      confidence: 89.0,
      owner: 'Civil & Drainage Eng. S. Patil',
    },
    {
      id: 'RSK-03',
      category: 'Blasting',
      title: 'DGMS Clearance Hold on Bench 4 Pre-split',
      affectedBlock: 'North Pit Bench 4',
      probability: 65,
      impact: '1.9 kt Muckpile Delay',
      timeHorizon: '3 Days',
      status: 'WARNING',
      severity: 'MEDIUM',
      icon: Zap,
      description: 'Statutory proximity alert triggered due to public road 280m buffer zone requiring specialized vibration damping.',
      contributingFactors: [
        'Seismograph monitoring requirement mandated by DGMS circular.',
        'Electronic detonator delivery delayed at regional magazine.',
      ],
      predictedOutcome: 'Primary ore face fragmentation postponed by 72 hours, depleting surge ore stockpile.',
      recommendedMitigation: 'Submit electronic wave-timing blast sequence simulation to DGMS area director for expedited waiver.',
      confidence: 91.2,
      owner: 'Blasting Officer R. Verma',
    },
    {
      id: 'RSK-04',
      category: 'Reserve',
      title: 'Localized Grade Thinning on Eastern Boundary',
      affectedBlock: 'Block C (Fault Contact)',
      probability: 45,
      impact: '1.2 kt Grade Dilution',
      timeHorizon: '7–14 Days',
      status: 'MONITORING',
      severity: 'LOW',
      icon: Layers,
      description: 'Core assay from infill hole DP-G06 indicates sudden pinching of braunite ore lens near regional transverse shear fault.',
      contributingFactors: [
        'Complex post-depositional Sausar folding.',
        'Drill spacing currently 80m (insufficient for complex structural displacement).',
      ],
      predictedOutcome: 'Run-of-mine ore grade drops from 42% to 33% Mn if blended without selective sorting.',
      recommendedMitigation: 'Execute 3 short reverse-circulation infill holes at 25m grid spacing to map fold hinge.',
      confidence: 84.5,
      owner: 'Chief Geologist A. Banerjee',
    },
    {
      id: 'RSK-05',
      category: 'Logistics',
      title: 'Railway Siding Rake Bottleneck at Tirodi Railhead',
      affectedBlock: 'Dispatch Siding 2',
      probability: 58,
      impact: '₹42 Lakh Demurrage Risk',
      timeHorizon: '5 Days',
      status: 'WARNING',
      severity: 'MEDIUM',
      icon: Truck,
      description: 'Indian Railways BOXN rake allocation delayed due to central freight corridor maintenance.',
      contributingFactors: [
        'Siding stockpile approaching 92% maximum volumetric capacity.',
        'Dust suppression mist cannons required full-time operation to meet pollution control guidelines.',
      ],
      predictedOutcome: 'Ore trucks forced to queue on mine access road, creating dispatch gridlock.',
      recommendedMitigation: 'Divert 8,000 tons of high-carbon ferromanganese grade ore to auxiliary siding yard B via road transport.',
      confidence: 88.0,
      owner: 'Dispatch Supt. M. Khan',
    },
  ];

  const filteredRisks = riskRegistry.filter((r) => {
    if (filterSeverity === 'ALL') return true;
    return r.severity === filterSeverity;
  });

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Console Header */}
      <div className="bg-[#0D111A] border border-[#243046] rounded-[14px] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold font-mono text-white tracking-tight">
              Operational Risk Intelligence
            </h1>
            <StatusBadge status="warning" label="DYNAMIC SEVERITY MATRIX" size="xs" />
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time risk radar mapping equipment downtime, monsoonal rainfall hazards, and blasting bottlenecks for {activeMineData.name || 'Gumgaon Mine'}.
          </p>
        </div>

        {/* Severity Filters */}
        <div className="flex items-center gap-1.5 font-mono text-xs bg-[#121824] p-1 rounded-[8px] border border-[#243046]">
          {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilterSeverity(lvl)}
              className={`px-3 py-1 rounded-[6px] transition-colors cursor-pointer ${
                filterSeverity === lvl
                  ? 'bg-[#161D2B] text-amber-400 border border-amber-500/40 font-semibold'
                  : 'text-slate-400 hover:text-white border border-transparent'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Top Risk KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Active Threat Index"
          value="5"
          unit="Incidents"
          trend={{ value: "1 Critical", positive: false }}
          context="Immediate operational focus"
          variant="danger"
          icon={AlertTriangle}
        />
        <KPICard
          title="Shortfall At Risk"
          value="4.2"
          unit="kt"
          trend={{ value: "-8.9% of target", positive: false }}
          context="Without proactive mitigation"
          variant="warning"
          icon={TrendingDown}
        />
        <KPICard
          title="Lead Time Horizon"
          value="2–4"
          unit="Days"
          trend={{ value: "Window to intervene", positive: true }}
          context="Sufficient for fleet rerouting"
          variant="intelligence"
          icon={Clock}
        />
        <KPICard
          title="Mitigation Readines"
          value="87"
          unit="%"
          trend={{ value: "Actions Available", positive: true }}
          context="5 prescriptive protocols ready"
          variant="healthy"
          icon={ShieldAlert}
        />
      </div>

      {/* Structured Risk Register Table (Section 34) */}
      <div className="bg-[#0D111A] border border-[#243046] rounded-[16px] overflow-hidden">
        <div className="p-3.5 bg-[#0A0D14] border-b border-[#1C2536] flex items-center justify-between text-xs font-mono">
          <span className="text-slate-200 font-bold uppercase tracking-wider">
            Operational Risk Matrix & Severity Registry
          </span>
          <span className="text-slate-500">Click any row to open detailed risk mitigation drawer</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono text-slate-300">
            <thead className="bg-[#121824] border-b border-[#243046] text-[11px] uppercase text-slate-400">
              <tr>
                <th className="py-3 px-4">Risk & Category</th>
                <th className="py-3 px-4">Affected Block / Area</th>
                <th className="py-3 px-4">Probability</th>
                <th className="py-3 px-4">Impact / Loss</th>
                <th className="py-3 px-4">Time Horizon</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1C2536]">
              {filteredRisks.map((risk) => {
                const Icon = risk.icon;
                return (
                  <tr
                    key={risk.id}
                    onClick={() => setSelectedRisk(risk)}
                    className="hover:bg-[#151D2C] cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-[6px] bg-[#121824] border border-[#243046] text-amber-400">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-white text-xs">{risk.title}</div>
                          <div className="text-[10px] text-slate-500">{risk.id} • {risk.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-300">{risk.affectedBlock}</td>
                    <td className="py-3 px-4">
                      <span className={`font-bold ${risk.probability >= 80 ? 'text-red-400' : 'text-amber-400'}`}>
                        {risk.probability}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-amber-300 font-semibold">{risk.impact}</td>
                    <td className="py-3 px-4 text-slate-400">{risk.timeHorizon}</td>
                    <td className="py-3 px-4">
                      <StatusBadge
                        status={risk.status === 'CRITICAL' ? 'critical' : risk.status === 'WARNING' ? 'warning' : 'neutral'}
                        label={risk.status}
                        size="xs"
                      />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-sky-400 hover:text-sky-300 text-xs font-semibold inline-flex items-center gap-1">
                        <span>Review</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Risk Drawer (Section 35) */}
      <Drawer
        isOpen={Boolean(selectedRisk)}
        onClose={() => setSelectedRisk(null)}
        title={selectedRisk ? selectedRisk.title : ''}
        subtitle={selectedRisk ? `${selectedRisk.id} • ${selectedRisk.affectedBlock}` : ''}
        badge={
          selectedRisk ? (
            <StatusBadge
              status={selectedRisk.status === 'CRITICAL' ? 'critical' : 'warning'}
              label={selectedRisk.status}
              size="xs"
            />
          ) : null
        }
        footer={
          <div className="flex items-center gap-2 w-full">
            <Button variant="secondary" size="sm" className="flex-1" onClick={() => setSelectedRisk(null)}>
              Dismiss
            </Button>
            <Link to="/app/recommendations" className="flex-1">
              <Button variant="primary" size="sm" className="w-full">
                Apply Mitigation
              </Button>
            </Link>
          </div>
        }
      >
        {selectedRisk && (
          <div className="space-y-4 font-mono text-xs">
            {/* Probability & Impact Grid */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-[#121824] p-3 rounded-[8px] border border-[#1C2536]">
                <span className="text-slate-400 text-[10px] block">PROBABILITY</span>
                <span className="text-red-400 font-bold text-sm">{selectedRisk.probability}%</span>
              </div>
              <div className="bg-[#121824] p-3 rounded-[8px] border border-[#1C2536]">
                <span className="text-slate-400 text-[10px] block">ESTIMATED IMPACT</span>
                <span className="text-amber-400 font-bold text-sm">{selectedRisk.impact}</span>
              </div>
              <div className="bg-[#121824] p-3 rounded-[8px] border border-[#1C2536]">
                <span className="text-slate-400 text-[10px] block">TIME HORIZON</span>
                <span className="text-slate-200 font-bold">{selectedRisk.timeHorizon}</span>
              </div>
              <div className="bg-[#121824] p-3 rounded-[8px] border border-[#1C2536]">
                <span className="text-slate-400 text-[10px] block">MODEL CONFIDENCE</span>
                <span className="text-emerald-400 font-bold">{selectedRisk.confidence}%</span>
              </div>
            </div>

            {/* Contributing Factors */}
            <div className="bg-[#121824] p-3.5 rounded-[8px] border border-[#1C2536] space-y-2">
              <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider block">
                Telemetry Contributing Factors
              </span>
              <ul className="space-y-1.5 text-slate-300 text-[11px]">
                {selectedRisk.contributingFactors.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-400 mt-0.5">•</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Predicted Outcome */}
            <div className="bg-red-500/10 border border-red-500/30 p-3.5 rounded-[8px] space-y-1">
              <span className="text-[10px] font-bold text-red-400 uppercase">
                Predicted Outcome Without Intervention
              </span>
              <p className="text-slate-300 text-xs leading-relaxed">
                {selectedRisk.predictedOutcome}
              </p>
            </div>

            {/* Recommended Mitigation */}
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-3.5 rounded-[8px] space-y-1">
              <span className="text-[10px] font-bold text-emerald-400 uppercase">
                Recommended Mitigation Strategy
              </span>
              <p className="text-slate-200 text-xs leading-relaxed">
                {selectedRisk.recommendedMitigation}
              </p>
            </div>

            <div className="text-[11px] text-slate-400 pt-1">
              <strong>Designated Owner:</strong> {selectedRisk.owner}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
