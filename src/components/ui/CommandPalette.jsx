import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Layers,
  Compass,
  Drill,
  TrendingUp,
  AlertTriangle,
  CheckSquare,
  FileText,
  Activity,
  Settings,
  Building2,
  Play,
  X,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { useScenario } from '../../context/ScenarioContext';

export default function CommandPalette({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { setActiveMine, switchMine, startSimulation } = useScenario();
  const setMine = (id) => {
    if (typeof switchMine === 'function') switchMine(id);
    else if (typeof setActiveMine === 'function') setActiveMine(id);
  };

  // Command items
  const items = [
    // Workspaces
    {
      category: 'WORKSPACES',
      id: 'app-overview',
      title: 'Operational Command Center',
      description: 'Central multi-mine telemetry and production health overview',
      icon: Layers,
      action: () => navigate('/app'),
    },
    {
      category: 'WORKSPACES',
      id: 'app-reserve',
      title: 'Reserve Intelligence & UNFC Model',
      description: '3D Kriging block model, UNFC 111/122/333 grade mapping',
      icon: Layers,
      action: () => navigate('/app/reserve-intelligence'),
    },
    {
      category: 'WORKSPACES',
      id: 'app-geo',
      title: 'Geological Explorer & Strata',
      description: 'Sentinel-2 band ratio 11/12, iron-oxide alteration indices',
      icon: Compass,
      action: () => navigate('/app/geological-explorer'),
    },
    {
      category: 'WORKSPACES',
      id: 'app-drill',
      title: 'Drilling Analytics & Core Assays',
      description: 'Borehole collar coordinates, lithology logs, and grade assays',
      icon: Drill,
      action: () => navigate('/app/drilling-analytics'),
    },
    {
      category: 'WORKSPACES',
      id: 'app-forecast',
      title: 'Production Forecast & Shortfall Horizon',
      description: '30-day projection, Monte Carlo simulation, and parameter tuning',
      icon: TrendingUp,
      action: () => navigate('/app/production-forecast'),
    },
    {
      category: 'WORKSPACES',
      id: 'app-risk',
      title: 'Risk Intelligence Matrix',
      description: 'Geotechnical, equipment, and DGMS compliance risk telemetry',
      icon: AlertTriangle,
      action: () => navigate('/app/risk-intelligence'),
    },
    {
      category: 'WORKSPACES',
      id: 'app-action',
      title: 'Action Center & Prescriptions',
      description: 'Closed-loop operational interventions with quantified recovery %',
      icon: CheckSquare,
      action: () => navigate('/app/recommendations'),
    },
    {
      category: 'WORKSPACES',
      id: 'app-reports',
      title: 'Compliance & Production Reports',
      description: 'Executive JORC/UNFC compliance and DGMS shift summaries',
      icon: FileText,
      action: () => navigate('/app/reports'),
    },
    {
      category: 'WORKSPACES',
      id: 'app-data',
      title: 'Data Pipeline Health & Lineage',
      description: 'SCADA sync latency, drone imagery cache, and satellite feeds',
      icon: Activity,
      action: () => navigate('/app/data-health'),
    },
    {
      category: 'WORKSPACES',
      id: 'app-settings',
      title: 'Workspace & Platform Settings',
      description: 'Operational parameters, alert thresholds, and role perspectives',
      icon: Settings,
      action: () => navigate('/app/settings'),
    },

    // Mines
    {
      category: 'SELECT MINE',
      id: 'mine-gumgaon',
      title: 'Gumgaon Manganese Mine (Nagpur, MH)',
      description: 'Underground + open pit operation, Mansar Formation Braunite ore',
      icon: Building2,
      action: () => {
        setMine('gumgaon');
        navigate('/app');
      },
    },
    {
      category: 'SELECT MINE',
      id: 'mine-balaghat',
      title: 'Balaghat Manganese Mine (Balaghat, MP)',
      description: 'Deepest underground manganese mine in Asia, high-grade ore reef',
      icon: Building2,
      action: () => {
        setMine('balaghat');
        navigate('/app');
      },
    },
    {
      category: 'SELECT MINE',
      id: 'mine-dongri',
      title: 'Dongri Buzurg Mine & EMD Plant (Bhandara, MH)',
      description: 'Large opencast pit, peroxide and battery-grade electrolytic manganese ore',
      icon: Building2,
      action: () => {
        setMine('dongri_buzurg');
        navigate('/app');
      },
    },
    {
      category: 'SELECT MINE',
      id: 'mine-kandri',
      title: 'Kandri Manganese Mine (Nagpur, MH)',
      description: 'High-grade braunitic gondite ore deposit transitioning to underground decline',
      icon: Building2,
      action: () => {
        setMine('kandri');
        navigate('/app');
      },
    },
    {
      category: 'SELECT MINE',
      id: 'mine-chikla',
      title: 'Chikla Manganese Mine (Bhandara, MH)',
      description: 'Sausar Group synclinal limb, high phosphorus low silica facies',
      icon: Building2,
      action: () => {
        setMine('chikla');
        navigate('/app');
      },
    },
    {
      category: 'SELECT MINE',
      id: 'mine-mansar',
      title: 'Mansar Manganese Mine (Nagpur, MH)',
      description: 'Stratiform deposit, critical reserve replacement zone with open pit benches',
      icon: Building2,
      action: () => {
        setMine('mansar');
        navigate('/app');
      },
    },
    {
      category: 'SELECT MINE',
      id: 'mine-tirodi',
      title: 'Tirodi Manganese Mine (Balaghat, MP)',
      description: 'Historic open pit cluster, active satellite reconnaissance zone',
      icon: Building2,
      action: () => {
        setMine('tirodi');
        navigate('/app');
      },
    },

    // Operations & Quick Actions
    {
      category: 'OPERATIONAL ACTIONS',
      id: 'act-tour',
      title: 'Launch 3-Minute SIH Evaluation Tour',
      description: 'Automated 180s walkthrough of reserve, forecast, and risk workflows',
      icon: Play,
      action: () => {
        startSimulation();
        navigate('/app');
      },
    },
    {
      category: 'OPERATIONAL ACTIONS',
      id: 'act-methodology',
      title: 'Open Methodology Documentation',
      description: 'Technical specs on Ordinary Kriging, XGBoost, and SHAP explainability',
      icon: ExternalLink,
      action: () => navigate('/methodology'),
    },
  ];

  // Filter based on query
  const filtered = query.trim()
    ? items.filter(
        (it) =>
          it.title.toLowerCase().includes(query.toLowerCase()) ||
          it.description.toLowerCase().includes(query.toLowerCase()) ||
          it.category.toLowerCase().includes(query.toLowerCase())
      )
    : items;

  // Auto focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Key navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filtered.length - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          filtered[selectedIndex].action();
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filtered, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      {/* Backdrop click to close */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Palette Container */}
      <div className="relative w-full max-w-2xl bg-[#0D111A] border border-[#243046] rounded-[12px] shadow-2xl overflow-hidden z-10 font-sans">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#1C2536] bg-[#07090E]/60">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command, mine, drillhole, or workspace..."
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none font-mono"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-500 hover:text-slate-300 p-1 rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <kbd className="hidden sm:inline-block text-[10px] font-mono text-slate-400 bg-[#121824] px-1.5 py-0.5 rounded border border-[#243046]">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-xs font-mono text-slate-500">
              No matching commands or mining assets found.
            </div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    item.action();
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full text-left px-3 py-2.5 rounded-[8px] flex items-center justify-between transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#151D2C] border border-amber-500/35 text-white'
                      : 'text-slate-300 hover:bg-[#121824] border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-1.5 rounded-[6px] shrink-0 ${
                        isSelected
                          ? 'bg-amber-500/15 text-amber-400'
                          : 'bg-[#0E131E] text-slate-400 border border-[#1C2536]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-medium truncate flex items-center gap-2">
                        <span>{item.title}</span>
                        <span className="text-[9px] font-mono uppercase text-slate-500 bg-[#07090E] px-1.5 py-0.2 rounded border border-[#1C2536]">
                          {item.category}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        {item.description}
                      </div>
                    </div>
                  </div>
                  {isSelected && (
                    <ChevronRight className="w-4 h-4 text-amber-400 shrink-0 ml-2" />
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-[#1C2536] bg-[#07090E]/80 text-[10px] font-mono text-slate-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="bg-[#121824] px-1.5 py-0.5 rounded border border-[#243046]">↑↓</kbd> Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="bg-[#121824] px-1.5 py-0.5 rounded border border-[#243046]">↵</kbd> Select
            </span>
          </div>
          <span className="text-amber-400/80">SIH26009 Navigation System</span>
        </div>
      </div>
    </div>
  );
}
