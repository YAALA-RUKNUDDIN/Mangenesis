import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Calendar,
  Code2,
  Bell,
  X,
  Satellite,
  AlertTriangle,
  Radio,
  ChevronDown,
  Check,
  Database,
  ShieldCheck,
  Zap,
  Sparkles,
  Menu,
  Activity,
  Sliders,
  UserCheck,
  Play,
  Pause,
  RotateCcw,
} from 'lucide-react';
import { useScenario } from '../../context/ScenarioContext';
import { fetchSupabaseStatus, seedSupabaseDatabase } from '../../services/api';

export default function TopBar() {
  const {
    minesList,
    activeMine,
    activeMineData,
    switchMine,
    activeScenario,
    switchScenario,
    availableScenarios,
    scenarioData,
    liveSatellite,
    setMobileMenuOpen,
    activeRole,
    switchRole,
    roleProfile,
    allRoleProfiles,
    simulationActive,
    simulationStep,
    simulationPaused,
    startSimulation,
    pauseSimulation,
    resumeSimulation,
    resetSimulation,
  } = useScenario();

  const [mineDropdownOpen, setMineDropdownOpen] = useState(false);
  const [scenarioDropdownOpen, setScenarioDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [supabaseModalOpen, setSupabaseModalOpen] = useState(false);
  const [supabaseInfo, setSupabaseInfo] = useState(null);
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState('');
  const [unreadCount, setUnreadCount] = useState(3);

  useEffect(() => {
    fetchSupabaseStatus().then((res) => {
      if (res) setSupabaseInfo(res);
    });
  }, []);

  const handleSeed = async () => {
    setIsSeeding(true);
    setSeedMessage('');
    const res = await seedSupabaseDatabase();
    setIsSeeding(false);
    if (res && res.message) {
      setSeedMessage(res.message);
    } else {
      setSeedMessage('Failed to trigger seeding.');
    }
  };

  const notifications = [
    {
      id: 1,
      title: 'NASA GPM Satellite Pass Completed',
      detail: `Precipitation logged at ${liveSatellite?.rainfall_mm || 48}mm for ${activeMineData.name} grid.`,
      time: '4 mins ago',
      icon: Satellite,
      type: 'info',
    },
    {
      id: 2,
      title: 'Excavator Telemetry Alert',
      detail: `Hydraulic line pressure dropped to 52% of rated capacity at ${activeMineData.name}.`,
      time: '18 mins ago',
      icon: AlertTriangle,
      type: 'warning',
    },
    {
      id: 3,
      title: 'XGBoost Reserve Model Calibrated',
      detail: 'Multispectral NDVI indices synchronized across target zones.',
      time: '42 mins ago',
      icon: Radio,
      type: 'info',
    },
  ];

  return (
    <header className="h-16 min-h-[64px] bg-[#131720]/90 backdrop-blur-xl border-b border-[#262F3D] flex items-center justify-between px-3 sm:px-6 z-[2000] relative">
      {/* Left: Mobile Hamburger + Interactive MOIL Mine Selector + Scenario Switcher */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Hamburger Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="lg:hidden p-2 rounded-xl bg-[#1A202C] hover:bg-[#262F3D] border border-[#262F3D] text-slate-300 hover:text-white transition-colors cursor-pointer"
          title="Open Menu"
        >
          <Menu size={18} />
        </button>

        {/* Mine Selector Dropdown */}
        <div className="relative z-[2100]">
          <button
            onClick={() => {
              setMineDropdownOpen(!mineDropdownOpen);
              setScenarioDropdownOpen(false);
            }}
            className="flex items-center gap-2 sm:gap-2.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-[#1A202C] hover:bg-[#262F3D] border border-[#262F3D] text-xs text-slate-100 transition-all duration-200 shadow-card cursor-pointer group max-w-[180px] sm:max-w-none"
          >
            <div className="w-6 h-6 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform shrink-0">
              <Building2 size={13} />
            </div>

            <div className="text-left truncate">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-100 tracking-tight truncate">{activeMineData.name}</span>
                {activeMineData.pilot && (
                  <span className="hidden xs:inline-block text-[9px] font-mono font-bold bg-[#C7B59F] text-[#1E1813] px-1.5 py-0.2 rounded shadow-sm shrink-0">
                    PILOT
                  </span>
                )}
              </div>
              <div className="text-[10px] text-slate-400 font-mono hidden sm:block truncate">
                {activeMineData.district}, {activeMineData.state}
              </div>
            </div>

            <ChevronDown size={14} className="text-slate-400 ml-0.5 group-hover:text-slate-200 transition-colors shrink-0" />
          </button>

          {/* Mine Dropdown Popover */}
          <AnimatePresence>
            {mineDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-[2150] bg-black/60 backdrop-blur-xs"
                  onClick={() => setMineDropdownOpen(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 mt-2 w-[calc(100vw-32px)] max-w-sm sm:w-96 bg-[#131720] border border-[#262F3D] rounded-2xl py-2.5 shadow-popover z-[2200] overflow-hidden"
                >
                  <div className="px-4 pb-2.5 mb-1.5 border-b border-[#262F3D] flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                      MOIL Manganese Mines Network
                    </span>
                    <span className="text-[10px] text-blue-400 font-mono font-semibold bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full">
                      {minesList.length} Sites Online
                    </span>
                  </div>

                  <div className="max-h-80 overflow-y-auto space-y-1 px-2">
                    {minesList.map((m) => {
                      const isSelected = activeMine === m.id;
                      const coords = m.center || [m.lat, m.lon];
                      return (
                        <button
                          key={m.id}
                          onClick={() => {
                            switchMine(m.id);
                            setMineDropdownOpen(false);
                          }}
                          className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-start justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-[#1A202C] text-white font-semibold border border-blue-500/30 shadow-sm'
                              : 'text-slate-300 hover:text-white hover:bg-[#1A202C]/60 border border-transparent'
                          }`}
                        >
                          <div className="space-y-0.5 pr-2">
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-slate-100">{m.name}</span>
                              {m.pilot && (
                                <span className="text-[8px] font-mono font-bold bg-[#C7B59F] text-[#1E1813] px-1.5 py-0.2 rounded">
                                  PILOT
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-400 flex items-center gap-2">
                              <span>{m.district}, {m.state}</span>
                              <span>&bull;</span>
                              <span className="font-mono text-[9px] text-slate-500">
                                {coords[0].toFixed(2)}°N, {coords[1].toFixed(2)}°E
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-400 italic">
                              {m.type} &bull; {m.capacity_tpd ? m.capacity_tpd.toLocaleString() : 10000} TPD
                            </div>
                          </div>

                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                              <Check size={11} />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Global Operational Scenario Switcher (Available on ALL pages) */}
        <div className="relative z-[2100]">
          <button
            onClick={() => {
              setScenarioDropdownOpen(!scenarioDropdownOpen);
              setMineDropdownOpen(false);
            }}
            className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-[#1A202C] hover:bg-[#262F3D] border border-[#262F3D] text-xs text-slate-100 transition-all duration-200 shadow-card cursor-pointer group"
          >
            <div className={`w-2 h-2 rounded-full ${
              scenarioData.riskLevel === 'CRITICAL' ? 'bg-rose-400 animate-pulse' :
              scenarioData.riskLevel === 'HIGH' ? 'bg-rose-400' :
              scenarioData.riskLevel === 'MEDIUM' ? 'bg-amber-400' : 'bg-emerald-400'
            }`} />
            
            <div className="text-left hidden md:block">
              <span className="text-[9px] uppercase font-mono font-bold text-slate-400 block -mb-0.5">Scenario</span>
              <span className="font-semibold text-slate-200 text-xs truncate max-w-[140px] block">
                {scenarioData.label}
              </span>
            </div>

            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded border ${
              scenarioData.riskLevel === 'CRITICAL' || scenarioData.riskLevel === 'HIGH'
                ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                : scenarioData.riskLevel === 'MEDIUM'
                ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
            }`}>
              {scenarioData.shortfallRisk}% Risk
            </span>

            <ChevronDown size={13} className="text-slate-400 group-hover:text-slate-200 transition-colors" />
          </button>

          {/* Scenario Popover */}
          <AnimatePresence>
            {scenarioDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-[2150] bg-black/60 backdrop-blur-xs"
                  onClick={() => setScenarioDropdownOpen(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 mt-2 w-[calc(100vw-32px)] max-w-sm sm:w-80 bg-[#131720] border border-[#262F3D] rounded-2xl py-2 shadow-popover z-[2200] overflow-hidden"
                >
                  <div className="px-4 py-2 border-b border-[#262F3D] mb-1">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                      Simulate Mine Operational Scenarios
                    </span>
                  </div>

                  <div className="space-y-1 px-2">
                    {availableScenarios.map((sc) => {
                      const isSelected = activeScenario === sc.id;
                      return (
                        <button
                          key={sc.id}
                          onClick={() => {
                            switchScenario(sc.id);
                            setScenarioDropdownOpen(false);
                          }}
                          className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-start justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-[#1A202C] text-white font-semibold border border-blue-500/30 shadow-sm'
                              : 'text-slate-300 hover:text-white hover:bg-[#1A202C]/60 border border-transparent'
                          }`}
                        >
                          <div className="space-y-0.5">
                            <div className="font-semibold text-slate-100">{sc.label}</div>
                            <div className="text-[10px] text-slate-400">{sc.description}</div>
                          </div>
                          {isSelected && (
                            <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0 mt-1.5" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Operational Role Switcher (Mine Manager / Safety / Maintenance / Operations) */}
        <div className="relative z-[2100]">
          <button
            onClick={() => {
              setRoleDropdownOpen(!roleDropdownOpen);
              setScenarioDropdownOpen(false);
              setMineDropdownOpen(false);
            }}
            className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-[#1A202C] hover:bg-[#262F3D] border border-[#262F3D] text-xs text-slate-100 transition-all duration-200 shadow-card cursor-pointer group"
            title="Switch Operational Role Perspective"
          >
            <UserCheck size={13} className="text-[#C7B59F]" />
            <div className="text-left hidden lg:block">
              <span className="text-[9px] uppercase font-mono font-bold text-slate-400 block -mb-0.5">Role View</span>
              <span className="font-semibold text-slate-200 text-xs truncate block">
                {roleProfile.label}
              </span>
            </div>
            <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-[#C7B59F]/15 text-[#D9CBBA] border border-[#C7B59F]/30 hidden sm:inline-block">
              {roleProfile.badge}
            </span>
            <ChevronDown size={13} className="text-slate-400 group-hover:text-slate-200 transition-colors" />
          </button>

          {/* Role Dropdown Popover */}
          <AnimatePresence>
            {roleDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-[2150] bg-black/60 backdrop-blur-xs"
                  onClick={() => setRoleDropdownOpen(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 mt-2 w-72 bg-[#131720] border border-[#262F3D] rounded-2xl py-2 shadow-popover z-[2200] overflow-hidden"
                >
                  <div className="px-3.5 pb-2 border-b border-[#262F3D] flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                      Operational Role Perspective
                    </span>
                    <span className="text-[9px] font-mono text-[#D9CBBA] bg-[#C7B59F]/10 px-1.5 py-0.5 rounded border border-[#C7B59F]/20">
                      Role Filter
                    </span>
                  </div>

                  <div className="p-1.5 space-y-1">
                    {Object.values(allRoleProfiles).map((role) => {
                      const isSelected = activeRole === role.id;
                      return (
                        <button
                          key={role.id}
                          onClick={() => {
                            switchRole(role.id);
                            setRoleDropdownOpen(false);
                          }}
                          className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-gradient-to-r from-[#C7B59F]/20 to-transparent border border-[#C7B59F]/40'
                              : 'hover:bg-white/[0.04] border border-transparent'
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-xs text-white">{role.label}</span>
                              <span className="text-[8.5px] font-mono px-1 py-0.2 rounded bg-white/10 text-slate-300">
                                {role.badge}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-400 mt-0.5">{role.subtitle}</div>
                          </div>
                          {isSelected && <Check size={13} className="text-[#C7B59F]" />}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Center: SIH Demo Simulation Control Cluster */}
      <div className="hidden md:flex items-center gap-2">
        {!simulationActive ? (
          <button
            onClick={startSimulation}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#C7B59F]/20 via-amber-500/15 to-[#C7B59F]/10 hover:from-[#C7B59F]/30 hover:to-amber-500/25 border border-[#C7B59F]/50 text-[#E8DFD1] hover:text-white text-xs font-semibold shadow-sm transition-all cursor-pointer group"
            title="Launch interactive 14-step closed-loop decision simulation for SIH Jury"
          >
            <Play size={13} className="text-amber-400 fill-amber-400 group-hover:scale-110 transition-transform" />
            <span>Run SIH Demo</span>
            <span className="text-[9px] font-mono font-bold bg-amber-500/25 text-amber-300 px-1.5 py-0.2 rounded border border-amber-500/40">
              JURY FLOW
            </span>
          </button>
        ) : (
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#1A202C] border border-amber-500/50 shadow-lg text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span className="text-amber-300 font-bold tracking-tight">
              DEMO SIMULATION ACTIVE &bull; STEP {simulationStep}/5
            </span>
            <div className="flex items-center gap-1 border-l border-[#262F3D] pl-2">
              <button
                onClick={simulationPaused ? resumeSimulation : pauseSimulation}
                className="p-1 rounded bg-black/40 hover:bg-black/60 text-amber-200 cursor-pointer"
                title={simulationPaused ? 'Resume Simulation' : 'Pause Simulation'}
              >
                {simulationPaused ? <Play size={11} className="fill-amber-300 text-amber-300" /> : <Pause size={11} />}
              </button>
              <button
                onClick={resetSimulation}
                className="p-1 rounded bg-black/40 hover:bg-black/60 text-slate-300 hover:text-rose-400 cursor-pointer"
                title="Reset to Ground Truth Baseline"
              >
                <RotateCcw size={11} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right: Actions & System Status */}
      <div className="flex items-center gap-1.5 sm:gap-3">
        {/* Date Display (Desktop only) */}
        <div className="hidden xl:flex items-center gap-2 text-xs text-slate-300 font-mono px-3 py-1.5 rounded-xl bg-[#1A202C] border border-[#262F3D] shadow-card">
          <Calendar size={13} className="text-slate-400" />
          <span>18 Aug 2026</span>
        </div>


        {/* Space Data Active Badge */}
        <div className="hidden sm:flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="hidden md:inline">Telemetry Active</span>
        </div>

        {/* Live Supabase DB Status Badge */}
        <div className="relative z-[2100]">
          <button
            onClick={() => setSupabaseModalOpen(!supabaseModalOpen)}
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#1A202C] hover:bg-[#262F3D] border border-[#262F3D] text-slate-200 text-xs font-mono transition-all cursor-pointer shadow-card"
            title="Supabase PostgreSQL + PostGIS Status"
          >
            <Database size={13} className="text-emerald-400 shrink-0" />
            <span className="font-semibold text-slate-200 hidden sm:inline">Supabase DB</span>
          </button>

          {/* Supabase Status Modal */}
          <AnimatePresence>
            {supabaseModalOpen && (
              <>
                <div
                  className="fixed inset-0 z-[2150] bg-black/60 backdrop-blur-xs"
                  onClick={() => setSupabaseModalOpen(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-[calc(100vw-32px)] max-w-sm sm:w-96 bg-[#131720] border border-[#262F3D] rounded-2xl p-4 sm:p-5 shadow-popover z-[2200]"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-[#262F3D]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <Database size={15} />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-100 flex items-center gap-1.5">
                          Supabase Cloud Database
                        </div>
                        <div className="text-[10px] font-mono text-slate-400">
                          PostgreSQL 15 + PostGIS Spatial
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setSupabaseModalOpen(false)}
                      className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  </div>

                  <div className="py-3 space-y-3">
                    <div className="p-3 rounded-xl bg-[#0B0D12] border border-[#262F3D] space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Connection Status:</span>
                        <span className="font-mono text-emerald-400 font-semibold flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          {supabaseInfo?.status || 'CONNECTED'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Database Engine:</span>
                        <span className="font-mono text-slate-200">PostgreSQL (Spatial)</span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                        Integrated Tables:
                      </span>
                      <div className="grid grid-cols-2 gap-1.5">
                        {['mines', 'drill_points', 'reserve_zones', 'production_logs', 'shortfall_alerts'].map((t) => (
                          <div key={t} className="px-2.5 py-1.5 rounded-lg bg-[#0B0D12] border border-[#262F3D] text-[11px] font-mono text-slate-300 flex items-center gap-1.5">
                            <Check size={11} className="text-emerald-400" />
                            {t}
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={handleSeed}
                      disabled={isSeeding}
                      className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-glow-blue"
                    >
                      <Zap size={14} />
                      {isSeeding ? 'Seeding Supabase DB...' : 'Sync & Seed MOIL Dataset'}
                    </button>

                    {seedMessage && (
                      <p className="text-[10.5px] font-mono text-emerald-400 text-center">
                        {seedMessage}
                      </p>
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Landing Portal Link */}
        <Link
          to="/"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1A202C] hover:bg-[#262F3D] border border-[#C7B59F]/30 text-[#E8DFD1] hover:text-white text-xs font-medium transition-all shadow-sm group"
          title="Back to Landing Portal"
        >
          <Sparkles size={13} className="text-[#C7B59F] group-hover:rotate-12 transition-transform" />
          <span className="hidden sm:inline">Landing Portal</span>
        </Link>

        {/* Live Swagger API Docs Link (Desktop) */}
        <a
          href="http://localhost:8000/docs"
          target="_blank"
          rel="noreferrer"
          className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1A202C] hover:bg-[#262F3D] border border-[#262F3D] text-slate-300 hover:text-white text-xs font-mono transition-colors shadow-card"
          title="Open FastAPI Swagger Docs"
        >
          <Code2 size={13} className="text-slate-400" />
          <span>API Docs</span>
        </a>

        {/* Notifications */}
        <div className="relative z-[2100]">
          <button
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              if (unreadCount > 0) setUnreadCount(0);
            }}
            className="p-2 rounded-xl bg-[#1A202C] hover:bg-[#262F3D] border border-[#262F3D] text-slate-400 hover:text-slate-100 transition-colors relative cursor-pointer shadow-card"
            title="Notifications"
          >
            <Bell size={15} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-500 text-white text-[9px] font-bold flex items-center justify-center shadow-glow-blue">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown Popover */}
          <AnimatePresence>
            {notificationsOpen && (
              <>
                <div
                  className="fixed inset-0 z-[2150] bg-black/60 backdrop-blur-xs"
                  onClick={() => setNotificationsOpen(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-[calc(100vw-32px)] max-w-sm sm:w-88 bg-[#131720] border border-[#262F3D] rounded-2xl p-4 shadow-popover z-[2200]"
                >
                  <div className="flex items-center justify-between pb-2.5 border-b border-[#262F3D]">
                    <div className="flex items-center gap-2">
                      <Bell size={14} className="text-blue-400" />
                      <span className="text-xs font-semibold text-slate-100">Live Mine Telemetry Alerts</span>
                    </div>
                    <button
                      onClick={() => setNotificationsOpen(false)}
                      className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <X size={13} />
                    </button>
                  </div>

                  <div className="py-2 space-y-2">
                    {notifications.map((n) => {
                      const Icon = n.icon;
                      return (
                        <div key={n.id} className="p-2.5 rounded-xl bg-[#0B0D12] border border-[#262F3D] text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Icon size={13} className={n.type === 'warning' ? 'text-amber-400' : 'text-blue-400'} />
                              <span className="font-semibold text-slate-200">{n.title}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono">{n.time}</span>
                          </div>
                          <p className="text-[11px] text-slate-300 leading-relaxed pl-5">{n.detail}</p>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
