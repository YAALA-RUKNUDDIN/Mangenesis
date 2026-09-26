import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  Compass,
  Drill,
  TrendingUp,
  AlertTriangle,
  CheckSquare,
  FileText,
  Activity,
  Settings,
  HelpCircle,
  ChevronDown,
  Building2,
  Clock,
  Play,
  Menu,
  X,
  ExternalLink,
  User,
  Search,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react';
import { useScenario } from '../context/ScenarioContext';
import Button from '../components/ui/Button';
import CommandPalette from '../components/ui/CommandPalette';

export default function AppLayout({ children }) {
  const location = useLocation();
  const {
    activeMine,
    setActiveMine,
    switchMine,
    activeMineData,
    minesList,
    activeRole,
    setActiveRole,
    switchRole,
    startSimulation,
    simulationActive,
  } = useScenario();

  const handleMineSelect = (mineId) => {
    if (typeof switchMine === 'function') {
      switchMine(mineId);
    } else if (typeof setActiveMine === 'function') {
      setActiveMine(mineId);
    }
    setMineDropdownOpen(false);
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [mineDropdownOpen, setMineDropdownOpen] = useState(false);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navGroups = [
    {
      group: 'COMMAND',
      items: [{ label: 'Overview', path: '/app', icon: LayoutDashboard }],
    },
    {
      group: 'INTELLIGENCE',
      items: [
        { label: 'Reserve Intelligence', path: '/app/reserve-intelligence', icon: Layers },
        { label: 'Geological Explorer', path: '/app/geological-explorer', icon: Compass },
        { label: 'Drilling Analytics', path: '/app/drilling-analytics', icon: Drill },
      ],
    },
    {
      group: 'OPERATIONS',
      items: [
        { label: 'Production Forecast', path: '/app/production-forecast', icon: TrendingUp },
        { label: 'Risk Intelligence', path: '/app/risk-intelligence', icon: AlertTriangle },
        { label: 'Recommendations', path: '/app/recommendations', icon: CheckSquare },
      ],
    },
    {
      group: 'GOVERNANCE',
      items: [
        { label: 'Reports', path: '/app/reports', icon: FileText },
        { label: 'Data Health', path: '/app/data-health', icon: Activity },
      ],
    },
    {
      group: 'SYSTEM',
      items: [
        { label: 'Settings', path: '/app/settings', icon: Settings },
      ],
    },
  ];

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/app') return 'Operational Command Center';
    if (path === '/app/reserve-intelligence') return 'Reserve Intelligence & UNFC Model';
    if (path === '/app/geological-explorer') return 'Geological Explorer & Strata';
    if (path === '/app/drilling-analytics') return 'Drilling Analytics & Assay Logs';
    if (path === '/app/production-forecast') return 'Production Forecast & Shortfall';
    if (path === '/app/risk-intelligence') return 'Production Risk Intelligence';
    if (path === '/app/recommendations') return 'Action Center & Prescriptions';
    if (path === '/app/reports') return 'Executive Reports & Compliance';
    if (path === '/app/data-health') return 'Data Pipeline Health & Lineage';
    if (path === '/app/settings') return 'Platform & Workspace Settings';
    return 'Mangenesis Intelligence';
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#07090E] text-slate-100 font-sans selection:bg-amber-500/20 selection:text-amber-200">
      {/* Command Palette Modal */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />

      {/* ===================== SIDEBAR (DESKTOP) ===================== */}
      <aside
        className={`hidden lg:flex flex-col bg-[#0A0D14] border-r border-[#1C2536] shrink-0 select-none transition-[width] duration-200 ease-in-out ${
          isCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        {/* Workspace Brand Header */}
        <div className="p-3.5 border-b border-[#1C2536] bg-[#07090E]/60 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-7 h-7 rounded-[6px] bg-[#141924] border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold font-mono text-sm shrink-0 shadow-sm">
              M
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <span className="font-bold text-sm tracking-tight text-white font-mono block truncate">
                  MANGENESIS
                </span>
                <span className="block text-[9px] font-mono text-amber-400/90 tracking-wider truncate">
                  SIH26009 • MOIL
                </span>
              </div>
            )}
          </Link>

          {/* Sidebar Collapse Toggle Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded-[6px] text-slate-400 hover:text-white hover:bg-[#121824] transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
        </div>

        {/* Workspace selector (only in expanded mode) */}
        {!isCollapsed && (
          <div className="p-3 border-b border-[#1C2536]">
            <div className="bg-[#121824] border border-[#243046] rounded-[8px] p-2 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 truncate">
                <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate text-slate-200 font-medium">MOIL Central Cluster</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500 bg-[#0A0D14] px-1.5 py-0.5 rounded border border-[#1C2536]">
                6 Mines
              </span>
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
          {navGroups.map((group) => (
            <div key={group.group}>
              {!isCollapsed && (
                <div className="px-2 mb-1 text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-500">
                  {group.group}
                </div>
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.path === '/app'}
                      title={isCollapsed ? item.label : undefined}
                      className={({ isActive }) =>
                        `group relative flex items-center ${
                          isCollapsed ? 'justify-center p-2.5' : 'gap-2.5 px-2.5 py-2'
                        } text-xs rounded-[8px] transition-colors font-medium ${
                          isActive
                            ? 'bg-[#151D2C] text-amber-400 border border-amber-500/30 shadow-sm'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-[#121824] border border-transparent'
                        }`
                      }
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {!isCollapsed && <span className="truncate">{item.label}</span>}

                      {/* Tooltip in collapsed mode */}
                      {isCollapsed && (
                        <div className="absolute left-full ml-2 px-2 py-1 bg-[#0D111A] border border-[#243046] text-white text-[11px] font-mono rounded-[6px] shadow-xl whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                          {item.label}
                        </div>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}

          {/* External Methodology Doc Link */}
          <div className="pt-2 border-t border-[#1C2536]">
            <Link
              to="/methodology"
              title={isCollapsed ? 'Methodology Docs' : undefined}
              className={`group relative flex items-center ${
                isCollapsed ? 'justify-center p-2.5' : 'justify-between px-2.5 py-2'
              } text-xs text-slate-400 hover:text-white hover:bg-[#121824] rounded-[8px] transition-colors`}
            >
              <div className="flex items-center gap-2.5">
                <HelpCircle className="w-4 h-4 text-slate-400 shrink-0" />
                {!isCollapsed && <span>Methodology</span>}
              </div>
              {!isCollapsed && <ExternalLink className="w-3 h-3 text-slate-600" />}

              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-[#0D111A] border border-[#243046] text-white text-[11px] font-mono rounded-[6px] shadow-xl whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                  Methodology Docs
                </div>
              )}
            </Link>
          </div>
        </nav>

        {/* Bottom Sidebar Status & Profile */}
        <div className="p-2.5 border-t border-[#1C2536] bg-[#07090E]/80 space-y-2">
          {!isCollapsed && (
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 bg-[#121824] px-2.5 py-1.5 rounded-[6px] border border-[#1C2536]">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Telemetry: LIVE</span>
              </div>
              <span className="text-slate-500">Nagpur: 31°C</span>
            </div>
          )}

          {/* User Profile / Role Switcher */}
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-full bg-[#172030] border border-[#243046] flex items-center justify-center text-slate-300 shrink-0">
                <User className="w-3.5 h-3.5" />
              </div>
              {!isCollapsed && (
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-white leading-tight truncate">
                    Y. Ruknuddin
                  </div>
                  <div className="text-[10px] text-amber-400 font-mono capitalize truncate">
                    {activeRole} Perspective
                  </div>
                </div>
              )}
            </div>

            {!isCollapsed && (
              <select
                value={activeRole}
                onChange={(e) => setActiveRole(e.target.value)}
                className="text-[10px] bg-[#121824] border border-[#243046] text-slate-300 rounded px-1.5 py-1 cursor-pointer font-mono"
                title="Switch user perspective"
              >
                <option value="manager" className="bg-[#0D111A] text-slate-100 py-1">Manager</option>
                <option value="operations" className="bg-[#0D111A] text-slate-100 py-1">Operations</option>
                <option value="safety" className="bg-[#0D111A] text-slate-100 py-1">Safety</option>
                <option value="maintenance" className="bg-[#0D111A] text-slate-100 py-1">Maintenance</option>
              </select>
            )}
          </div>
        </div>
      </aside>

      {/* ===================== MAIN CONTENT WRAPPER ===================== */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* ===================== TOP APPLICATION BAR ===================== */}
        <header className="h-14 bg-[#0A0D14] border-b border-[#1C2536] px-4 sm:px-6 flex items-center justify-between gap-3 shrink-0 z-20">
          {/* Left: Mobile Menu Toggle + Breadcrumbs */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded-[6px] text-slate-400 hover:text-white hover:bg-[#121824]"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500 uppercase">
                <Link to="/app" className="hover:text-slate-300">MANGENESIS</Link>
                <span>/</span>
                <span className="text-slate-400 truncate">{activeMineData.name || 'Gumgaon Mine'}</span>
              </div>
              <h1 className="text-xs sm:text-sm font-semibold text-white truncate tracking-tight">
                {getPageTitle()}
              </h1>
            </div>
          </div>

          {/* Center / Right: Operational Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Search Trigger (Ctrl+K) */}
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="flex items-center gap-2 px-2.5 py-1.5 bg-[#121824] border border-[#243046] hover:border-[#334462] hover:bg-[#161D2B] rounded-[8px] text-xs font-mono text-slate-400 transition-colors cursor-pointer"
              title="Search workspaces, mines, and commands (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden md:inline text-slate-300">Quick search...</span>
              <kbd className="text-[10px] bg-[#0A0D14] text-slate-400 px-1.5 py-0.5 rounded border border-[#1C2536]">
                ⌘K
              </kbd>
            </button>

            {/* Demo Environment Tag */}
            <div className="hidden xl:flex items-center gap-1.5 px-2 py-1 rounded-[6px] bg-amber-500/10 border border-amber-500/25 text-[10px] font-mono text-amber-300">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>SIH26009 DEMO</span>
            </div>

            {/* 3-Minute SIH Demo Trigger */}
            <Button
              variant="primary"
              size="sm"
              icon={Play}
              onClick={startSimulation}
              className="hidden sm:inline-flex text-[11px]"
              title="Launch guided 3-minute SIH evaluation scenario"
            >
              {simulationActive ? 'Demo Running' : '3-Min SIH Tour'}
            </Button>

            {/* Mine Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setMineDropdownOpen(!mineDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#121824] border border-[#243046] hover:border-[#334462] rounded-[8px] text-xs font-mono text-slate-200 transition-colors cursor-pointer"
              >
                <span className="text-slate-400 text-[10px]">MINE:</span>
                <span className="font-semibold text-white truncate max-w-[120px] sm:max-w-none">
                  {activeMineData.name || 'Gumgaon'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {mineDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setMineDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-1.5 w-64 bg-[#0D111A] border border-[#243046] rounded-[8px] shadow-2xl py-1 z-50">
                    <div className="px-3 py-1.5 text-[10px] font-mono text-slate-400 uppercase tracking-wider border-b border-[#1C2536] flex items-center justify-between">
                      <span>Select MOIL Mine</span>
                      <span className="text-amber-400 text-[9px] font-bold">{minesList.length} MINES</span>
                    </div>
                    {minesList.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => handleMineSelect(m.id)}
                        className={`w-full text-left px-3 py-2 text-xs font-mono flex items-center justify-between transition-colors cursor-pointer ${
                          m.id === activeMine
                            ? 'bg-[#172030] text-amber-400 font-semibold'
                            : 'text-slate-300 hover:bg-[#121824] hover:text-white'
                        }`}
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">{m.name}</span>
                          <span className="text-[10px] text-slate-500">{m.district ? `${m.district}, ` : ''}{m.state}</span>
                        </div>
                        {m.id === activeMine && (
                          <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0 ml-2" />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Data Freshness Indicator */}
            <div className="hidden md:flex items-center gap-1.5 text-[11px] font-mono text-slate-400 bg-[#0D111A] px-2 py-1 rounded-[6px] border border-[#1C2536]">
              <Clock className="w-3 h-3 text-sky-400" />
              <span>LIVE • 14m ago</span>
            </div>
          </div>
        </header>

        {/* ===================== VIEWPORT BODY ===================== */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 bg-[#07090E]">
          {children}
        </main>
      </div>

      {/* ===================== MOBILE SLIDE-OUT DRAWER ===================== */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
          />
          <div className="relative w-72 bg-[#0A0D14] border-r border-[#1C2536] flex flex-col h-full z-10 p-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1C2536]">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-[6px] bg-[#141924] border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-xs font-mono">
                  M
                </div>
                <span className="font-bold text-white font-mono text-sm">MANGENESIS</span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Mine Selector */}
            <div className="py-3 border-b border-[#1C2536]">
              <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-1.5">
                Active MOIL Mine
              </label>
              <select
                value={activeMine}
                onChange={(e) => {
                  handleMineSelect(e.target.value);
                  setSidebarOpen(false);
                }}
                className="w-full bg-[#121824] border border-[#243046] text-white text-xs font-mono rounded-[6px] px-2.5 py-1.5 focus:outline-none focus:border-amber-500"
              >
                {minesList.map((m) => (
                  <option key={m.id} value={m.id} className="bg-[#0D111A] text-slate-100 py-1.5">
                    {m.name} ({m.state})
                  </option>
                ))}
              </select>
            </div>

            <nav className="flex-1 overflow-y-auto py-4 space-y-4">
              {navGroups.map((group) => (
                <div key={group.group}>
                  <div className="text-[10px] font-mono text-slate-500 uppercase mb-1">
                    {group.group}
                  </div>
                  <div className="space-y-0.5">
                    {group.items.map((item) => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/app'}
                        onClick={() => setSidebarOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-2.5 px-3 py-2 text-xs rounded-[6px] font-medium ${
                            isActive
                              ? 'bg-[#151D2C] text-amber-400 border border-amber-500/30'
                              : 'text-slate-400 hover:text-white'
                          }`
                        }
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </NavLink>
                    ))}
                  </div>
                </div>
              ))}
            </nav>

            <div className="pt-3 border-t border-[#1C2536]">
              <Link to="/" onClick={() => setSidebarOpen(false)}>
                <Button variant="secondary" size="sm" className="w-full">
                  Return to Public Website
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
