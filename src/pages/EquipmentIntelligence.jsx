import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Truck,
  AlertTriangle,
  CheckCircle2,
  Wrench,
  Clock,
  Gauge,
  Thermometer,
  Activity,
  Fuel,
  ShieldCheck,
  X,
  Play,
  Zap,
} from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import { useScenario } from '../context/ScenarioContext';

export default function EquipmentIntelligence() {
  const {
    equipmentList,
    triggerManualAnomaly,
    executePrescriptiveAction,
    activeMineData,
    simulationActive,
  } = useScenario();

  const [selectedAsset, setSelectedAsset] = useState(null);
  const [filterType, setFilterType] = useState('ALL');

  const filteredAssets = equipmentList.filter((asset) => {
    if (filterType === 'ALL') return true;
    if (filterType === 'TRUCKS') return asset.type === 'Haul Truck';
    if (filterType === 'EXCAVATORS') return asset.type === 'Hydraulic Excavator';
    if (filterType === 'PLANT') return asset.type === 'Crushing Plant' || asset.type === 'Drill Rig';
    return true;
  });

  const criticalCount = equipmentList.filter((a) => a.status === 'CRITICAL').length;
  const warningCount = equipmentList.filter((a) => a.status === 'WARNING').length;
  const avgHealth = Math.round(
    equipmentList.reduce((acc, a) => acc + (a.healthScore || 80), 0) / equipmentList.length
  );

  return (
    <PageLayout
      title="Equipment Intelligence & Predictive Fleet Telemetry"
      subtitle={`Live CAN-bus asset diagnostics & wear monitoring • ${activeMineData.name}`}
      badge="PREDICTIVE MAINTENANCE"
    >
      <div className="space-y-6">
        {/* KPI Metric Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-[#131720] border border-[#262F3D] shadow-card">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">FLEET AVAILABILITY</span>
              <Truck size={16} className="text-[#C7B59F]" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-display font-bold text-white">88.4%</span>
              <span className="text-[11px] font-mono text-emerald-400">+1.2% Target</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">7 Heavy Mining Assets Active</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#131720] border border-[#262F3D] shadow-card">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">AVERAGE HEALTH</span>
              <Gauge size={16} className="text-emerald-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-display font-bold text-white">{avgHealth}%</span>
              <span className={`text-[11px] font-mono ${avgHealth < 75 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {avgHealth < 75 ? 'Degraded' : 'Nominal'}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Vibration & Temperature Weighted</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#131720] border border-[#262F3D] shadow-card">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">CRITICAL ANOMALIES</span>
              <AlertTriangle size={16} className="text-rose-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-display font-bold text-rose-400">{criticalCount}</span>
              <span className="text-[11px] font-mono text-amber-400">{warningCount} Warning</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Actionable Predictive Tickets</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#131720] border border-[#262F3D] shadow-card">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">DOWNTIME AVOIDED</span>
              <ShieldCheck size={16} className="text-[#C7B59F]" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-display font-bold text-[#E8DFD1]">₹79.8 L</span>
              <span className="text-[11px] font-mono text-emerald-400">Annual Est.</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">28 Major Overhauls Prevented</p>
          </div>
        </div>

        {/* Filter Controls & Anomaly Injection Demonstration Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-xl bg-[#131720] border border-[#262F3D]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400 mr-2">Filter Fleet:</span>
            {['ALL', 'TRUCKS', 'EXCAVATORS', 'PLANT'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterType(tab)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  filterType === tab
                    ? 'bg-[#C7B59F] text-[#1E1813] font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Quick Jury Demo Anomaly Button */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
              SIH Presentation Tool
            </span>
            <button
              onClick={() => triggerManualAnomaly('TRK-17')}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 text-xs font-semibold transition-all cursor-pointer"
              title="Inject sudden vibration and temperature anomaly on Haul Truck T-17"
            >
              <Zap size={12} />
              <span>Simulate Anomaly (T-17)</span>
            </button>
          </div>
        </div>

        {/* Fleet Asset Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAssets.map((asset) => {
            const isCritical = asset.status === 'CRITICAL';
            const isWarning = asset.status === 'WARNING';

            return (
              <motion.div
                key={asset.id}
                layout
                className={`p-5 rounded-2xl bg-[#131720] border transition-all duration-200 ${
                  isCritical
                    ? 'border-rose-500/50 shadow-lg shadow-rose-950/20'
                    : isWarning
                    ? 'border-amber-500/40'
                    : 'border-[#262F3D] hover:border-white/20'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-display font-bold text-white text-base">{asset.name}</span>
                      <span className="text-[10px] font-mono text-slate-400">({asset.id})</span>
                    </div>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">{asset.model}</p>
                  </div>

                  <span
                    className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-md border ${
                      isCritical
                        ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                        : isWarning
                        ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                        : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                    }`}
                  >
                    {asset.status}
                  </span>
                </div>

                {/* Health Score & Location */}
                <div className="mt-4 flex items-center justify-between pb-3 border-b border-[#262F3D]">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm font-display ${
                        asset.healthScore < 60
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : asset.healthScore < 80
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {asset.healthScore}%
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-slate-400">HEALTH SCORE</div>
                      <div className="text-xs font-semibold text-slate-200">{asset.zone}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[9px] font-mono text-slate-400">FAILURE WINDOW</span>
                    <div className={`text-xs font-mono font-bold ${isCritical ? 'text-rose-400' : 'text-slate-300'}`}>
                      {asset.predictedFailureWindow}
                    </div>
                  </div>
                </div>

                {/* Live Telemetry Sensor Channels */}
                <div className="grid grid-cols-2 gap-2.5 my-3 text-xs">
                  <div className="p-2 rounded-xl bg-[#0B0D12] border border-[#262F3D]">
                    <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-mono">
                      <Thermometer size={12} className={asset.engineTempC > 95 ? 'text-rose-400' : 'text-slate-400'} />
                      <span>ENGINE TEMP</span>
                    </div>
                    <div className="font-bold text-slate-200 mt-1 font-mono">
                      {asset.engineTempC}°C
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-[#0B0D12] border border-[#262F3D]">
                    <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-mono">
                      <Activity size={12} className={asset.vibrationMmS > 8.0 ? 'text-rose-400' : 'text-slate-400'} />
                      <span>VIBRATION</span>
                    </div>
                    <div className="font-bold text-slate-200 mt-1 font-mono">
                      {asset.vibrationMmS} mm/s
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-[#0B0D12] border border-[#262F3D]">
                    <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-mono">
                      <Gauge size={12} />
                      <span>PRESSURE</span>
                    </div>
                    <div className="font-bold text-slate-200 mt-1 font-mono">
                      {asset.hydraulicPressureBar} bar
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-[#0B0D12] border border-[#262F3D]">
                    <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-mono">
                      <Fuel size={12} />
                      <span>FUEL BURN</span>
                    </div>
                    <div className="font-bold text-slate-200 mt-1 font-mono">
                      {asset.fuelEfficiencyLph} L/hr
                    </div>
                  </div>
                </div>

                {/* Failure Risk Description */}
                <p className="text-[11px] text-slate-400 leading-relaxed bg-[#0E121D] p-2.5 rounded-xl border border-[#262F3D]/60 mb-3">
                  {asset.failureRiskDescription}
                </p>

                {/* Card Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-[#262F3D]">
                  <button
                    onClick={() => setSelectedAsset(asset)}
                    className="flex-1 py-1.5 rounded-xl bg-[#1A202C] hover:bg-[#262F3D] border border-[#262F3D] text-xs font-semibold text-slate-200 hover:text-white transition-all cursor-pointer text-center"
                  >
                    View Diagnostics
                  </button>
                  <button
                    onClick={() =>
                      executePrescriptiveAction({
                        priority: `WO-${asset.id}`,
                        urgency: asset.status,
                        title: `Maintenance Work Order for ${asset.name}`,
                        description: `Immediate field overhaul scheduled: ${asset.failureRiskDescription}`,
                        impact: 'Preventive Overhaul',
                      })
                    }
                    className="px-3 py-1.5 rounded-xl bg-[#C7B59F]/15 hover:bg-[#C7B59F]/25 border border-[#C7B59F]/40 text-[#D9CBBA] text-xs font-semibold transition-all cursor-pointer"
                    title="Generate Maintenance Ticket"
                  >
                    <Wrench size={13} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Asset Inspection Modal */}
      <AnimatePresence>
        {selectedAsset && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl bg-[#131720] border border-[#262F3D] rounded-3xl p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-start justify-between pb-3 border-b border-[#262F3D]">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-display font-bold text-white">{selectedAsset.name}</h3>
                    <span className="text-xs font-mono text-slate-400">({selectedAsset.id})</span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono">{selectedAsset.model} &bull; {selectedAsset.zone}</p>
                </div>
                <button
                  onClick={() => setSelectedAsset(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="p-3 rounded-xl bg-[#0B0D12] border border-[#262F3D] space-y-1">
                  <div className="font-mono text-slate-400 text-[10px]">AI PREDICTIVE FAILURE DIAGNOSTIC</div>
                  <p className="text-slate-200">{selectedAsset.failureRiskDescription}</p>
                  <div className="text-rose-400 font-mono text-[11px] font-bold mt-1">
                    Estimated Time to Failure: {selectedAsset.predictedFailureWindow}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-[#1A202C] border border-[#262F3D]">
                    <span className="text-slate-400 text-[10px]">OPERATOR ASSIGNED</span>
                    <div className="text-slate-200 font-semibold mt-0.5">{selectedAsset.operatorAssigned}</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#1A202C] border border-[#262F3D]">
                    <span className="text-slate-400 text-[10px]">MAINTENANCE TYPE</span>
                    <div className="text-[#D9CBBA] font-semibold mt-0.5">{selectedAsset.maintenanceType}</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#1A202C] border border-[#262F3D]">
                    <span className="text-slate-400 text-[10px]">LAST OVERHAUL</span>
                    <div className="text-slate-200 mt-0.5">{selectedAsset.lastServiceDate}</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#1A202C] border border-[#262F3D]">
                    <span className="text-slate-400 text-[10px]">NEXT SERVICE DUE</span>
                    <div className="text-slate-200 mt-0.5">{selectedAsset.nextServiceDue}</div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#262F3D] flex justify-end gap-2">
                <button
                  onClick={() => setSelectedAsset(null)}
                  className="px-4 py-2 rounded-xl bg-[#1A202C] hover:bg-[#262F3D] text-slate-300 text-xs font-semibold"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    executePrescriptiveAction({
                      priority: `WO-${selectedAsset.id}`,
                      urgency: selectedAsset.status,
                      title: `Maintenance Work Order for ${selectedAsset.name}`,
                      description: selectedAsset.failureRiskDescription,
                      impact: 'Overhaul Scheduled',
                    });
                    setSelectedAsset(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#C7B59F] hover:bg-[#D9CBBA] text-[#1E1813] text-xs font-bold shadow-md"
                >
                  Dispatch Maintenance Crew
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageLayout>
  );
}
