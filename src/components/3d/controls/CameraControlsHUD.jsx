import { Globe, Mountain, Layers, Truck, Target, Sun, Moon, Flame, Radar, RotateCw, Maximize2, Minimize2 } from 'lucide-react';

/**
 * Floating Sci-Fi HUD Control overlay for the 3D Digital Twin Canvas.
 * Allows instant camera bookmark jumps, multi-spectral filter switching,
 * auto-orbit toggle, and immersion modes.
 */
export default function CameraControlsHUD({
  activePreset = 'pit',
  onSelectPreset,
  activeMode = 'day',
  onSelectMode,
  isAutoRotate = false,
  onToggleAutoRotate,
  isExpanded = false,
  onToggleExpanded,
}) {
  const cameraPresets = [
    { id: 'orbital', label: 'Orbital Sat', icon: Globe, desc: 'Space perspective & scanning beams' },
    { id: 'pit', label: 'Pit Overview', icon: Mountain, desc: 'Terraced open-pit bench overview' },
    { id: 'subsurface', label: 'Subsurface X-Ray', icon: Layers, desc: 'Underground manganese ore veins' },
    { id: 'haulroad', label: 'Haul Road', icon: Truck, desc: 'Fleet telematics & spiral ramp' },
    { id: 'drillsite', label: 'Drill Sector', icon: Target, desc: 'Exploration boreholes & cores' },
  ];

  const modeFilters = [
    { id: 'day', label: 'Daylight', icon: Sun },
    { id: 'night', label: 'Night Ops', icon: Moon },
    { id: 'thermal', label: 'Thermal IR', icon: Flame },
    { id: 'radar', label: 'SAR Radar', icon: Radar },
  ];

  return (
    <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
      {/* Camera View Presets */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-[#0B0F19]/85 backdrop-blur-xl border border-slate-750/70 shadow-2xl pointer-events-auto">
        <div className="px-2 py-1 text-[10px] font-mono font-semibold tracking-wider text-slate-400 uppercase hidden sm:block border-r border-slate-750/80 mr-1">
          3D VIEW
        </div>
        {cameraPresets.map((preset) => {
          const Icon = preset.icon;
          const isActive = activePreset === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => onSelectPreset?.(preset.id)}
              title={preset.desc}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-blue-600/90 text-white shadow-lg shadow-blue-500/25 border border-blue-400/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Icon size={14} className={isActive ? 'text-white' : 'text-slate-400'} />
              <span className="hidden md:inline">{preset.label}</span>
            </button>
          );
        })}
      </div>

      {/* Right Controls: Filters, Auto-Orbit, Fullscreen */}
      <div className="flex items-center gap-2 pointer-events-auto ml-auto">
        {/* Spectral Filter Toggle */}
        <div className="flex items-center gap-1 p-1.5 rounded-xl bg-[#0B0F19]/85 backdrop-blur-xl border border-slate-750/70 shadow-2xl">
          {modeFilters.map((filter) => {
            const Icon = filter.icon;
            const isActive = activeMode === filter.id;
            return (
              <button
                key={filter.id}
                onClick={() => onSelectMode?.(filter.id)}
                title={`Filter: ${filter.label}`}
                className={`p-1.5 rounded-lg text-xs transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#C7B59F] text-[#0B0D12] font-bold shadow-md border border-[#E8DFD1]/50'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon size={14} />
              </button>
            );
          })}
        </div>

        {/* Auto Orbit */}
        <button
          onClick={onToggleAutoRotate}
          title={isAutoRotate ? 'Stop Auto-Orbit' : 'Start Cinematic Auto-Orbit'}
          className={`p-2 rounded-xl backdrop-blur-xl border transition-all duration-200 shadow-2xl cursor-pointer ${
            isAutoRotate
              ? 'bg-emerald-600/80 text-white border-emerald-400/40 shadow-emerald-500/20'
              : 'bg-[#0B0F19]/85 text-slate-400 hover:text-white border-slate-750/70 hover:bg-slate-800/60'
          }`}
        >
          <RotateCw size={15} className={isAutoRotate ? 'animate-spin' : ''} />
        </button>

        {/* Expand / Minimize Full Viewport */}
        {onToggleExpanded && (
          <button
            onClick={onToggleExpanded}
            title={isExpanded ? 'Exit Immersive 3D' : 'Enter Immersive 3D Mode'}
            className="p-2 rounded-xl bg-[#0B0F19]/85 hover:bg-slate-800/80 backdrop-blur-xl border border-slate-750/70 text-slate-300 hover:text-white transition-colors shadow-2xl cursor-pointer"
          >
            {isExpanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
        )}
      </div>
    </div>
  );
}
