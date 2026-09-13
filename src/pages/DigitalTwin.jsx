import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers,
  Truck,
  AlertTriangle,
  CheckCircle2,
  Maximize2,
  Activity,
  Gauge,
  Thermometer,
  Radio,
  MapPin,
  X,
  Compass,
  Zap,
  Droplets,
  CloudRain,
  ShieldAlert,
} from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import MineMap from '../components/maps/MineMap';
import { useScenario } from '../context/ScenarioContext';

export default function DigitalTwin() {
  const { equipmentList, activeMineData, scenarioData, simulationActive } = useScenario();
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [activeView, setActiveView] = useState('OPERATIONAL'); // 'OPERATIONAL' | 'SENSORS'

  // Geotechnical and IoT pit sensors
  const telemetrySensors = [
    {
      id: 'EXT-01',
      name: 'Slope Extensometer A-12',
      category: 'Geotechnical Slope Radar',
      zone: 'Sector A-12 (North Ridge)',
      reading: '4.8 mm / day',
      limit: '3.0 mm / day (DGMS Limit)',
      status: 'CRITICAL',
      fos: '1.18 Marginal',
      details: 'Active tension crack deformation. 30m geofenced exclusion buffer activated around North Ridge.',
      icon: AlertTriangle,
    },
    {
      id: 'PIZ-04',
      name: 'Piezometer Transducer P-4',
      category: 'Pore Water Pressure',
      zone: 'Ramp Bench 3 Sub-drain',
      reading: '184 kPa',
      limit: '250 kPa Safe Max',
      status: 'NORMAL',
      fos: '1.48 (Pit Avg)',
      details: 'Subsurface drainage functioning nominal. Pore water pressure within safe operational gradient.',
      icon: Gauge,
    },
    {
      id: 'SMAP-01',
      name: 'NASA SMAP Soil Moisture',
      category: 'Orbital L-Band Radar',
      zone: 'Pit Floor & Main Ramp',
      reading: '68.2% Saturation',
      limit: '75.0% Inundation Threshold',
      status: 'WARNING',
      frictionIndex: '0.72 (Reduced Traction)',
      details: 'Monsoon saturation index. Wet haulage speed advisory active: maximum 20 km/h on switchbacks.',
      icon: Droplets,
    },
    {
      id: 'SSM-03',
      name: 'Blast Seismograph Geo-3',
      category: 'Ground Vibration Monitor',
      zone: 'Lease Boundary Perimeter',
      reading: '4.2 mm/s PPV',
      limit: '10.0 mm/s (DGMS Circular 7)',
      status: 'NORMAL',
      details: 'Peak Particle Velocity compliant with residential structure safety distances.',
      icon: Activity,
    },
    {
      id: 'WXR-01',
      name: 'Ultrasonic Micro-Station',
      category: 'Pit Meteorology',
      zone: 'North Ridge Lookout',
      reading: '4.2 mm / hr Rain',
      limit: 'Wind 12 km/h • 28.4°C',
      status: 'NORMAL',
      details: 'Local acoustic anemometer and optical rain gauge live feed.',
      icon: CloudRain,
    },
    {
      id: 'CAN-EXC04',
      name: 'Excavator EX-04 CAN-Bus',
      category: 'Asset IoT Gateway',
      zone: 'Sector D-04 Bench',
      reading: '142 bar Pressure',
      limit: '280 bar Nominal Target',
      status: 'CRITICAL',
      details: 'Primary hydraulic manifold pressure loss detected. Immediate workshop triage recommended.',
      icon: ShieldAlert,
    },
  ];

  return (
    <PageLayout
      title="In-Pit Digital Twin & Fleet Telematics Map"
      subtitle={`Geospatial digital twin of pit extraction benches, haul routes, and live telemetry • ${activeMineData.name}`}
      badge="DIGITAL TWIN"
    >
      <div className="space-y-4">
        {/* Top Control Bar with Functional Mode Switching */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-2xl bg-[#131720] border border-[#262F3D] gap-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-400">Display Perspective:</span>
            <div className="flex items-center bg-[#0B0D12] p-1 rounded-xl border border-[#262F3D]">
              <button
                onClick={() => setActiveView('OPERATIONAL')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeView === 'OPERATIONAL'
                    ? 'bg-[#C7B59F] text-[#0B0D12] shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Truck size={13} />
                <span>OPERATIONAL (Fleet & Roads)</span>
              </button>
              <button
                onClick={() => setActiveView('SENSORS')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeView === 'SENSORS'
                    ? 'bg-amber-500 text-[#0B0D12] shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Radio size={13} />
                <span>SENSORS (IoT & Geotech Radar)</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Nominal</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Advisory</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
              <span>Critical Action</span>
            </span>
          </div>
        </div>

        {/* Main Map + Right Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Map View (3 Cols) — Now takes activeMode */}
          <div className="lg:col-span-3 rounded-2xl overflow-hidden border border-[#262F3D] h-[580px] relative bg-[#0B0D12]">
            <MineMap height="580px" activeMode={activeView} />

            {/* In-Map Telemetry Status Pill */}
            <div className="absolute top-3 left-3 z-[1000] p-3 rounded-xl bg-[#0E121D]/90 backdrop-blur-md border border-[#262F3D] text-xs space-y-1.5 pointer-events-auto shadow-2xl">
              <div className="text-[10px] font-mono text-slate-400 uppercase font-bold flex items-center justify-between gap-4">
                <span>DIGITAL TWIN STATUS</span>
                <span className="text-emerald-400 font-bold">142/142 ONLINE</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${activeView === 'SENSORS' ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400 animate-pulse'}`} />
                <span className="font-semibold text-white font-mono">
                  {activeView === 'OPERATIONAL' ? '7 Mobile Fleet GPS Transponders' : '6 In-Pit Geotechnical & IoT Stations Active'}
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                {activeMineData.name} &bull; Lat: {activeMineData.center?.[0] || 21.155}°N &bull; Lon: {activeMineData.center?.[1] || 79.090}°E
              </div>
            </div>
          </div>

          {/* Right Sidebar (1 Col) — Switches between FLEET and SENSORS */}
          <div className="space-y-3 overflow-y-auto max-h-[580px] pr-1">
            {activeView === 'OPERATIONAL' ? (
              <>
                <div className="px-2 py-1 flex items-center justify-between text-xs font-mono text-slate-400 border-b border-[#262F3D] pb-2">
                  <span className="font-bold text-white uppercase">ACTIVE FLEET UNITS</span>
                  <span className="text-[#C7B59F] font-bold">{equipmentList.length} In-Pit</span>
                </div>

                {equipmentList.map((asset) => {
                  const isCrit = asset.status === 'CRITICAL';
                  const isWarn = asset.status === 'WARNING';

                  return (
                    <div
                      key={asset.id}
                      onClick={() => setSelectedAsset(asset)}
                      className={`p-3 rounded-xl bg-[#131720] border transition-all cursor-pointer ${
                        isCrit
                          ? 'border-rose-500/50 hover:bg-rose-950/20'
                          : isWarn
                          ? 'border-amber-500/40 hover:bg-amber-950/20'
                          : 'border-[#262F3D] hover:border-[#C7B59F]/40'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-white font-mono">{asset.name}</span>
                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold ${
                            isCrit ? 'bg-rose-500/20 text-rose-300' : isWarn ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                          }`}
                        >
                          {asset.status}
                        </span>
                      </div>

                      <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-slate-400">
                        <span>{asset.zone}</span>
                        <span className="font-bold text-slate-200">{asset.healthScore}% Health</span>
                      </div>

                      <div className="mt-2 pt-2 border-t border-[#262F3D]/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                        <span>Temp: {asset.engineTempC}°C</span>
                        <span>Vib: {asset.vibrationMmS} mm/s</span>
                      </div>
                    </div>
                  );
                })}
              </>
            ) : (
              <>
                <div className="px-2 py-1 flex items-center justify-between text-xs font-mono text-slate-400 border-b border-[#262F3D] pb-2">
                  <span className="font-bold text-amber-300 uppercase">GEOTECH & IOT SENSORS</span>
                  <span className="text-amber-400 font-bold">{telemetrySensors.length} Stations</span>
                </div>

                {telemetrySensors.map((sensor) => {
                  const Icon = sensor.icon;
                  const isCrit = sensor.status === 'CRITICAL';
                  const isWarn = sensor.status === 'WARNING';

                  return (
                    <div
                      key={sensor.id}
                      onClick={() => setSelectedSensor(sensor)}
                      className={`p-3 rounded-xl bg-[#131720] border transition-all cursor-pointer ${
                        isCrit
                          ? 'border-rose-500/50 hover:bg-rose-950/20'
                          : isWarn
                          ? 'border-amber-500/40 hover:bg-amber-950/20'
                          : 'border-[#262F3D] hover:border-[#C7B59F]/40'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Icon size={13} className={isCrit ? 'text-rose-400' : isWarn ? 'text-amber-400' : 'text-emerald-400'} />
                          <span className="font-bold text-xs text-white font-mono">{sensor.name}</span>
                        </div>
                        <span
                          className={`text-[8.5px] font-mono px-1.5 py-0.2 rounded font-bold ${
                            isCrit ? 'bg-rose-500/20 text-rose-300' : isWarn ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                          }`}
                        >
                          {sensor.status}
                        </span>
                      </div>

                      <div className="mt-2 flex items-center justify-between text-[11px] font-mono">
                        <span className="text-slate-400 truncate max-w-[140px]">{sensor.zone}</span>
                        <span className={`font-bold ${isCrit ? 'text-rose-400' : isWarn ? 'text-amber-300' : 'text-emerald-400'}`}>
                          {sensor.reading}
                        </span>
                      </div>

                      <div className="mt-1.5 text-[10px] text-slate-400 font-mono border-t border-[#262F3D]/80 pt-1.5 truncate">
                        {sensor.limit}
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
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
              className="w-full max-w-md bg-[#131720] border border-[#262F3D] rounded-3xl p-5 shadow-2xl space-y-3"
            >
              <div className="flex items-start justify-between pb-2 border-b border-[#262F3D]">
                <div>
                  <h3 className="font-display font-bold text-white text-base">{selectedAsset.name}</h3>
                  <p className="text-xs text-slate-400 font-mono">{selectedAsset.model} &bull; {selectedAsset.zone}</p>
                </div>
                <button
                  onClick={() => setSelectedAsset(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-[#0B0D12] border border-[#262F3D]">
                  <span className="text-[10px] text-slate-400">HEALTH SCORE</span>
                  <div className="text-slate-100 font-bold text-sm">{selectedAsset.healthScore}%</div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#0B0D12] border border-[#262F3D]">
                  <span className="text-[10px] text-slate-400">STATUS</span>
                  <div className="text-amber-300 font-bold text-sm">{selectedAsset.status}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#0B0D12] border border-[#262F3D]">
                  <span className="text-[10px] text-slate-400">RUL FAILURE WINDOW</span>
                  <div className="text-rose-400 font-bold text-sm">{selectedAsset.predictedFailureWindow}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#0B0D12] border border-[#262F3D]">
                  <span className="text-[10px] text-slate-400">HYDRAULIC PRESSURE</span>
                  <div className="text-slate-100 font-bold text-sm">{selectedAsset.hydraulicPressureBar} bar</div>
                </div>
              </div>

              <p className="text-xs text-slate-300 p-3 rounded-xl bg-[#0B0D12] border border-[#262F3D]/60 font-mono leading-relaxed">
                {selectedAsset.failureRiskDescription}
              </p>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedAsset(null)}
                  className="px-4 py-2 rounded-xl bg-[#C7B59F] text-[#0B0D12] text-xs font-bold cursor-pointer hover:bg-[#E8DFD1]"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Sensor Inspection Modal */}
      <AnimatePresence>
        {selectedSensor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#131720] border border-amber-500/40 rounded-3xl p-5 shadow-2xl space-y-3"
            >
              <div className="flex items-start justify-between pb-2 border-b border-[#262F3D]">
                <div>
                  <h3 className="font-display font-bold text-white text-base">{selectedSensor.name}</h3>
                  <p className="text-xs text-amber-300 font-mono">{selectedSensor.category} &bull; {selectedSensor.zone}</p>
                </div>
                <button
                  onClick={() => setSelectedSensor(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-[#0B0D12] border border-[#262F3D]">
                  <span className="text-[10px] text-slate-400">LIVE READING</span>
                  <div className="text-white font-bold text-sm">{selectedSensor.reading}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#0B0D12] border border-[#262F3D]">
                  <span className="text-[10px] text-slate-400">DGMS STATUTORY LIMIT</span>
                  <div className="text-slate-300 font-bold text-xs">{selectedSensor.limit}</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#0B0D12] border border-[#262F3D]/60 text-xs font-mono text-slate-300 leading-relaxed">
                {selectedSensor.details}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedSensor(null)}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageLayout>
  );
}
