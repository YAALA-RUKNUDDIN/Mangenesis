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
  UserCheck,
  Play,
  Pause,
  RotateCcw,
  ExternalLink,
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
    simulationStatus,
    simulationStep,
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
  const [backendOnline, setBackendOnline] = useState(true);

  useEffect(() => {
    fetchSupabaseStatus().then((res) => {
      if (res) setSupabaseInfo(res);
    });

    // Check backend health
    fetch('http://localhost:8000/docs', { method: 'HEAD', mode: 'no-cors' })
      .then(() => setBackendOnline(true))
      .catch(() => setBackendOnline(false));
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
      detail: `Precipitation logged at ${liveSatellite?.rainfall_mm || 4.2}mm for ${activeMineData.name} grid.`,
      time: '4 mins ago',
      icon: Satellite,
      type: 'info',
    },
    {
      id: 2,
      title: 'Excavator Telemetry Alert',
      detail: `Hydraulic pressure dropped to 142 bar on EXC-04 at ${activeMineData.name}.`,
      time: '18 mins ago',
      icon: AlertTriangle,
      type: 'warning',
    },
    {
      id: 3,
      title: 'XGBoost Reserve Model Calibrated',
      detail: 'Multispectral SWIR 11/12 indices synchronized across target zones.',
      time: '42 mins ago',
      icon: Radio,
      type: 'info',
    },
  ];

  return (
    <header className="h-16 min-h-[64px] bg-[#0E1322]/95 backdrop-blur-xl border-b border-[#262F3D] flex items-center justify-between px-3 sm:px-5 z-[2000] relative select-none">
      {/* LEFT: Mobile Menu + Unified Operational Context Cluster (Mine • Scenario • Role) */}
      <div className="flex items-center gap-2">
        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="lg:hidden p-2 rounded-xl bg-[#131720] hover:bg-[#1A202C] border border-[#262F3D] text-slate-300 hover:text-white transition-colors cursor-pointer"
          title="Open Menu"
        >
          <Menu size={18} />
        </button>

        {/* 1. Mine Selector Dropdown */}
        <div className="relative z-[2100]">
          <button
            onClick={() => {
              setMineDropdownOpen(!mineDropdownOpen);
              setScenarioDropdownOpen(false);
              setRoleDropdownOpen(false);
            }}
            className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#131720] hover:bg-[#1A202C] border border-[#262F3D] hover:border-[#C7B59F]/40 text-xs text-slate-100 transition-all cursor-pointer shadow-sm"
          >
            <Building2 size={13} className="text-[#C7B59F] shrink-0" />
            <span className="font-semibold truncate max-w-[130px] sm:max-w-[170px]">{activeMineData.name}</span>
            <span className="hidden xl:inline text-[9px] font-mono font-bold bg-[#C7B59F]/20 text-[#E8DFD1] px-1 rounded">
              PILOT
            </span>
            <ChevronDown size={12} className="text-slate-400 shrink-0" />
          </button>

          <AnimatePresence>
            {mineDropdownOpen && (
              <>
                <div className="fixed inset-0 z-[2150] bg-black/60" onClick={() => setMineDropdownOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="absolute left-0 mt-2 w-80 bg-[#131720] border border-[#262F3D] rounded-2xl py-2.5 shadow-2xl z-[2200] overflow-hidden"
                >
                  <div className="px-3.5 pb-2 border-b border-[#262F3D] flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-400 font-bold uppercase">MOIL Mines Network</span>
                    <span className="text-emerald-400">{minesList.length} Sites Online</span>
                  </div>
                  <div className="max-h-72 overflow-y-auto p-1.5 space-y-1">
                    {minesList.map((m) => {
                      const isSelected = activeMine === m.id;
                      return (
                        <button
                          key={m.id}
                          onClick={() => {
                            switchMine(m.id);
                            setMineDropdownOpen(false);
                          }}
                          className={`w-full text-left p-2 rounded-xl text-xs flex items-center justify-between cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-[#1A202C] text-white font-bold border border-[#C7B59F]/50'
                              : 'text-slate-300 hover:bg-white/[0.04]'
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span>{m.name}</span>
                              {m.pilot && <span className="text-[8px] font-mono px-1 rounded bg-[#C7B59F] text-black font-bold">PILOT</span>}
                            </div>
                            <div className="text-[10px] text-slate-400">{m.district}, {m.state} &bull; {m.capacity_tpd || 10000} TPD</div>
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

        {/* 2. Scenario Switcher Dropdown */}
        <div className="relative z-[2100]">
          <button
            onClick={() => {
              setScenarioDropdownOpen(!scenarioDropdownOpen);
              setMineDropdownOpen(false);
              setRoleDropdownOpen(false);
            }}
            className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#131720] hover:bg-[#1A202C] border border-[#262F3D] hover:border-[#C7B59F]/40 text-xs text-slate-100 transition-all cursor-pointer shadow-sm"
          >
            <span className={`w-2 h-2 rounded-full ${
              scenarioData.riskLevel === 'CRITICAL' || scenarioData.riskLevel === 'HIGH' ? 'bg-rose-400 animate-ping' :
              scenarioData.riskLevel === 'MEDIUM' ? 'bg-amber-400' : 'bg-emerald-400'
            }`} />
            <span className="hidden md:inline text-slate-400 text-[10px] uppercase font-mono font-bold">SCENARIO:</span>
            <span className="font-semibold text-slate-200 truncate max-w-[120px]">{scenarioData.label}</span>
            <span className={`text-[9.5px] font-mono font-bold px-1.5 py-0.2 rounded border ${
              scenarioData.shortfallRisk > 50 ? 'bg-rose-500/10 text-rose-300 border-rose-500/30' : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
            }`}>
              {scenarioData.shortfallRisk}%
            </span>
            <ChevronDown size={12} className="text-slate-400 shrink-0" />
          </button>

          <AnimatePresence>
            {scenarioDropdownOpen && (
              <>
                <div className="fixed inset-0 z-[2150] bg-black/60" onClick={() => setScenarioDropdownOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="absolute left-0 mt-2 w-80 bg-[#131720] border border-[#262F3D] rounded-2xl p-2 shadow-2xl z-[2200]"
                >
                  <div className="px-3 pb-2 border-b border-[#262F3D] text-[10px] font-mono text-slate-400 uppercase font-bold">
                    Simulate Operational Scenarios
                  </div>
                  <div className="space-y-1 p-1">
                    {availableScenarios.map((sc) => {
                      const isSelected = activeScenario === sc.id;
                      return (
                        <button
                          key={sc.id}
                          onClick={() => {
                            switchScenario(sc.id);
                            setScenarioDropdownOpen(false);
                          }}
                          className={`w-full text-left p-2 rounded-xl text-xs transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-[#1A202C] text-white font-bold border border-[#C7B59F]/40'
                              : 'text-slate-300 hover:bg-white/[0.04]'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{sc.label}</span>
                            {isSelected && <Check size={12} className="text-[#C7B59F]" />}
                          </div>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">{sc.description}</p>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* 3. Role Perspective Switcher */}
        <div className="relative z-[2100]">
          <button
            onClick={() => {
              setRoleDropdownOpen(!roleDropdownOpen);
              setMineDropdownOpen(false);
              setScenarioDropdownOpen(false);
            }}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#131720] hover:bg-[#1A202C] border border-[#262F3D] hover:border-[#C7B59F]/40 text-xs text-slate-100 transition-all cursor-pointer shadow-sm"
          >
            <UserCheck size={13} className="text-[#C7B59F] shrink-0" />
            <span className="hidden xl:inline text-slate-400 text-[10px] uppercase font-mono font-bold">ROLE:</span>
            <span className="font-semibold text-slate-200 truncate max-w-[110px]">{roleProfile.label}</span>
            <span className="text-[9px] font-mono px-1 rounded bg-[#C7B59F]/20 text-[#E8DFD1] font-bold">
              {roleProfile.badge}
            </span>
            <ChevronDown size={12} className="text-slate-400 shrink-0" />
          </button>

          <AnimatePresence>
            {roleDropdownOpen && (
              <>
                <div className="fixed inset-0 z-[2150] bg-black/60" onClick={() => setRoleDropdownOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="absolute left-0 mt-2 w-72 bg-[#131720] border border-[#262F3D] rounded-2xl p-2 shadow-2xl z-[2200]"
                >
                  <div className="px-3 pb-2 border-b border-[#262F3D] text-[10px] font-mono text-slate-400 uppercase font-bold">
                    Filter View by Stakeholder Role
                  </div>
                  <div className="space-y-1 p-1">
                    {Object.values(allRoleProfiles).map((role) => {
                      const isSelected = activeRole === role.id;
                      return (
                        <button
                          key={role.id}
                          onClick={() => {
                            switchRole(role.id);
                            setRoleDropdownOpen(false);
                          }}
                          className={`w-full text-left p-2 rounded-xl text-xs transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-[#1A202C] text-white font-bold border border-[#C7B59F]/40'
                              : 'text-slate-300 hover:bg-white/[0.04]'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold">{role.label}</span>
                            <span className="text-[9px] font-mono px-1 rounded bg-white/10">{role.badge}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">{role.subtitle}</div>
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

      {/* CENTER: Compact, State-Harmonized SIH Demo Control */}
      <div className="flex items-center gap-2">
        {simulationStatus === 'IDLE' && (
          <button
            onClick={startSimulation}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#C7B59F] hover:bg-[#E8DFD1] text-[#0B0D12] text-xs font-bold font-mono transition-all shadow-md cursor-pointer group"
            title="Launch interactive 5-stage automated closed-loop decision tour"
          >
            <Play size={12} className="fill-[#0B0D12]" />
            <span>Run SIH Demo</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-black/20 text-[#0B0D12] font-bold">
              5 STAGES
            </span>
          </button>
        )}

        {simulationStatus === 'RUNNING' && (
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-amber-500/15 border border-amber-500/40 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span className="text-amber-300 font-bold">TOUR STEP {simulationStep}/5</span>
            <button
              onClick={pauseSimulation}
              className="px-1.5 py-0.5 rounded bg-amber-500/30 hover:bg-amber-500/40 text-amber-200 text-[10px] cursor-pointer"
            >
              <Pause size={10} />
            </button>
            <button
              onClick={resetSimulation}
              className="p-1 rounded text-slate-400 hover:text-rose-400 cursor-pointer"
            >
              <RotateCcw size={10} />
            </button>
          </div>
        )}

        {simulationStatus === 'PAUSED' && (
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-mono">
            <span className="text-amber-200 font-bold">PAUSED ({simulationStep}/5)</span>
            <button
              onClick={resumeSimulation}
              className="px-1.5 py-0.5 rounded bg-emerald-500/30 hover:bg-emerald-500/40 text-emerald-200 text-[10px] cursor-pointer flex items-center gap-1"
            >
              <Play size={10} className="fill-emerald-200" />
              <span>Resume</span>
            </button>
            <button
              onClick={resetSimulation}
              className="p-1 rounded text-slate-400 hover:text-rose-400 cursor-pointer"
            >
              <RotateCcw size={10} />
            </button>
          </div>
        )}

        {simulationStatus === 'COMPLETED' && (
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-xs font-mono">
            <span className="text-emerald-300 font-bold">DEMO COMPLETE (5/5)</span>
            <button
              onClick={startSimulation}
              className="px-1.5 py-0.5 rounded bg-[#C7B59F]/30 hover:bg-[#C7B59F]/40 text-[#E8DFD1] text-[10px] cursor-pointer"
            >
              Replay
            </button>
            <button
              onClick={resetSimulation}
              className="p-1 rounded text-slate-400 hover:text-rose-400 cursor-pointer"
            >
              <RotateCcw size={10} />
            </button>
          </div>
        )}
      </div>

      {/* RIGHT: Compact System Tools (Provenance, Swagger Docs, Supabase, Alerts) */}
      <div className="flex items-center gap-2">
        {/* Date Provenance Pill */}
        <div className="hidden 2xl:flex items-center gap-1.5 text-xs text-slate-400 font-mono px-2.5 py-1 rounded-xl bg-[#131720] border border-[#262F3D]">
          <Calendar size={12} />
          <span>18 Aug 2026 (Shift A)</span>
        </div>

        {/* Live Telemetry Dot */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10.5px]">Telemetry Live</span>
        </div>

        {/* Live FastAPI Swagger Documentation Link */}
        <a
          href="http://localhost:8000/docs"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#131720] hover:bg-[#1A202C] border border-[#262F3D] hover:border-[#C7B59F]/40 text-xs font-mono text-slate-200 transition-colors cursor-pointer shadow-sm"
          title="Interactive FastAPI Swagger API Docs (Port 8000)"
        >
          <Code2 size={13} className="text-[#C7B59F]" />
          <span className="hidden md:inline text-[11px]">API Docs</span>
          <span className={`w-1.5 h-1.5 rounded-full ${backendOnline ? 'bg-emerald-400' : 'bg-amber-400'}`} />
        </a>

        {/* Supabase Database Modal Trigger */}
        <div className="relative z-[2100]">
          <button
            onClick={() => setSupabaseModalOpen(!supabaseModalOpen)}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-[#131720] hover:bg-[#1A202C] border border-[#262F3D] text-slate-300 text-xs font-mono transition-colors cursor-pointer"
            title="PostgreSQL + PostGIS Cloud Database"
          >
            <Database size={13} className="text-emerald-400 shrink-0" />
            <span className="hidden xl:inline ml-1 text-[11px]">Supabase</span>
          </button>

          <AnimatePresence>
            {supabaseModalOpen && (
              <>
                <div className="fixed inset-0 z-[2150] bg-black/60" onClick={() => setSupabaseModalOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="absolute right-0 mt-2 w-84 bg-[#131720] border border-[#262F3D] rounded-2xl p-4 shadow-2xl z-[2200] space-y-3"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-[#262F3D]">
                    <span className="font-bold text-xs text-white font-mono flex items-center gap-1.5">
                      <Database size={13} className="text-emerald-400" />
                      Supabase Cloud Database
                    </span>
                    <button onClick={() => setSupabaseModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                      <X size={14} />
                    </button>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#0B0D12] border border-[#262F3D] text-xs font-mono space-y-1.5 text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-400">PostGIS Engine:</span>
                      <span className="text-emerald-400 font-bold">ONLINE (Postgres 15)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Local Cache:</span>
                      <span className="text-white">Active (100% Fallback)</span>
                    </div>
                  </div>
                  <button
                    onClick={handleSeed}
                    disabled={isSeeding}
                    className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold cursor-pointer transition-colors"
                  >
                    {isSeeding ? 'Syncing...' : 'Sync & Seed MOIL Tables'}
                  </button>
                  {seedMessage && <p className="text-[10px] font-mono text-emerald-400 text-center">{seedMessage}</p>}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Notification Bell */}
        <div className="relative z-[2100]">
          <button
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              if (unreadCount > 0) setUnreadCount(0);
            }}
            className="p-2 rounded-xl bg-[#131720] hover:bg-[#1A202C] border border-[#262F3D] text-slate-300 transition-colors relative cursor-pointer"
            title="Notifications"
          >
            <Bell size={14} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-blue-500 text-white text-[8px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {notificationsOpen && (
              <>
                <div className="fixed inset-0 z-[2150] bg-black/60" onClick={() => setNotificationsOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="absolute right-0 mt-2 w-80 bg-[#131720] border border-[#262F3D] rounded-2xl p-3 shadow-2xl z-[2200] space-y-2"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-[#262F3D]">
                    <span className="font-bold text-xs text-white font-mono">Live Telemetry Alerts</span>
                    <button onClick={() => setNotificationsOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                      <X size={13} />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {notifications.map((n) => (
                      <div key={n.id} className="p-2 rounded-xl bg-[#0B0D12] border border-[#262F3D] text-xs font-mono space-y-0.5">
                        <div className="flex items-center justify-between text-slate-200 font-bold">
                          <span>{n.title}</span>
                          <span className="text-[9px] text-slate-500">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-400">{n.detail}</p>
                      </div>
                    ))}
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
