import { useState, useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Polygon,
  Tooltip,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import { Plus, Minus, LocateFixed } from 'lucide-react';
import { mapLayers as initialLayers } from '../../data/mockData';
import { useScenario } from '../../context/ScenarioContext';
import ZoneOverlay from './ZoneOverlay';
import MapControls from './MapControls';
import MapLegend from './MapLegend';
import ZoneInfoPanel from './ZoneInfoPanel';
import { MAP_PROVIDERS } from '../../constants/mapConfig';

// Programmatic zoom control & re-centering helper
function ZoomAndCenterControls({ targetCenter, targetZoom = 14 }) {
  const map = useMap();

  useEffect(() => {
    if (targetCenter && targetCenter[0] && targetCenter[1]) {
      map.flyTo([targetCenter[0], targetCenter[1]], targetZoom, { duration: 1.2 });
    }
  }, [targetCenter?.[0], targetCenter?.[1], targetZoom, map]);

  return (
    <div className="absolute bottom-4 right-4 z-[1000] flex flex-col gap-1 pointer-events-auto">
      <button
        onClick={() => map.zoomIn()}
        className="w-7 h-7 rounded-md bg-[#0F121A] border border-[#303A50] hover:border-slate-500 text-slate-200 flex items-center justify-center hover:bg-[#151923] transition-colors shadow-2xl cursor-pointer"
        title="Zoom In"
      >
        <Plus size={14} />
      </button>
      <button
        onClick={() => map.zoomOut()}
        className="w-7 h-7 rounded-md bg-[#0F121A] border border-[#303A50] hover:border-slate-500 text-slate-200 flex items-center justify-center hover:bg-[#151923] transition-colors shadow-2xl cursor-pointer"
        title="Zoom Out"
      >
        <Minus size={14} />
      </button>
      <button
        onClick={() => map.flyTo([targetCenter[0], targetCenter[1]] || [21.155, 79.090], targetZoom, { duration: 1.0 })}
        className="w-7 h-7 rounded-md bg-[#0F121A] border border-[#303A50] hover:border-slate-500 text-slate-400 hover:text-slate-200 flex items-center justify-center hover:bg-[#151923] transition-colors shadow-2xl cursor-pointer mt-0.5"
        title="Reset Mine View"
      >
        <LocateFixed size={13} />
      </button>
    </div>
  );
}

// Custom High-Visibility Drill Core Marker Icon generator
function createDrillIcon(dp) {
  const isCompleted = dp.status === 'completed';
  const isActive = dp.status === 'active';
  const color = isCompleted ? '#3B82F6' : isActive ? '#F59E0B' : '#0EA5E9';
  const statusLabel = isCompleted ? 'Assay Done' : isActive ? 'Drilling' : 'Planned';

  return L.divIcon({
    className: 'custom-drill-marker',
    html: `
      <div style="
        display: flex;
        align-items: center;
        gap: 4px;
        background: #0F121A;
        border: 1.5px solid ${color};
        padding: 3px 7px;
        border-radius: 6px;
        box-shadow: 0 4px 14px rgba(0,0,0,0.85);
        color: #FFFFFF;
        font-family: 'Inter', sans-serif;
        font-size: 10px;
        font-weight: 600;
        white-space: nowrap;
        pointer-events: auto;
        cursor: pointer;
      ">
        <span style="
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: ${color};
          display: inline-block;
          box-shadow: 0 0 8px ${color};
        "></span>
        <span style="font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700; color: #F1F5F9;">${dp.id}</span>
        <span style="font-size: 9px; color: ${color}; font-family: 'JetBrains Mono', monospace;">${dp.depth > 0 ? `${dp.depth}m` : 'Plan'}</span>
      </div>
    `,
    iconSize: [85, 26],
    iconAnchor: [42, 13],
  });
}

// Custom High-Visibility Sensor Station Marker Icon
function createSensorIcon(station) {
  const isCrit = station.status === 'CRITICAL';
  const isWarn = station.status === 'WARNING';
  const color = isCrit ? '#EF4444' : isWarn ? '#F59E0B' : '#10B981';

  return L.divIcon({
    className: 'custom-sensor-marker',
    html: `
      <div style="
        display: flex;
        align-items: center;
        gap: 5px;
        background: #0B0D12;
        border: 2px solid ${color};
        padding: 3px 8px;
        border-radius: 8px;
        box-shadow: 0 4px 14px rgba(0,0,0,0.9);
        color: #FFFFFF;
        font-family: 'JetBrains Mono', monospace;
        font-size: 10px;
        font-weight: 700;
        white-space: nowrap;
        pointer-events: auto;
        cursor: pointer;
      ">
        <span style="
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: ${color};
          display: inline-block;
          box-shadow: 0 0 8px ${color};
          animation: pulse 1.5s infinite;
        "></span>
        <span style="color: #F1F5F9;">${station.id}</span>
        <span style="color: ${color}; font-size: 9px;">${station.metric}</span>
      </div>
    `,
    iconSize: [110, 26],
    iconAnchor: [55, 13],
  });
}

export default function MineMap({
  height = '480px',
  activeMode = 'OPERATIONAL',
  showControls = true,
  showLegend = true,
  showZonePanel = true,
  zones: propZones,
  selectedZone: propSelectedZone,
  onZoneSelect,
  className = '',
  layerMode = 'all',
  selectedFormation = null,
  depthFilter = null,
  minGradeFilter = null,
}) {
  const { activeMineData, liveZones } = useScenario();
  const mapCenter = activeMineData.center || [activeMineData.lat || 21.155, activeMineData.lon || 79.090];
  const [layers, setLayers] = useState(initialLayers);
  const [internalSelectedZone, setInternalSelectedZone] = useState(null);

  const activeZones = propZones || liveZones || activeMineData.zones || [];
  const selectedZone = propSelectedZone !== undefined ? propSelectedZone : internalSelectedZone;

  // Sync default layers with activeMode
  useEffect(() => {
    if (activeMode === 'SENSORS') {
      setLayers((prev) =>
        prev.map((l) =>
          l.id === 'soilMoisture' || l.id === 'hazards' || l.id === 'satellite'
            ? { ...l, active: true }
            : l
        )
      );
    }
  }, [activeMode]);

  // Geotechnical & In-Pit IoT Sensors for SENSORS mode
  const sensorStations = [
    {
      id: 'EXT-01',
      name: 'Extensometer EXT-01',
      type: 'Slope Extensometer',
      zone: 'Sector A-12 (North Ridge)',
      coords: [mapCenter[0] + 0.007, mapCenter[1] + 0.009],
      metric: '4.8 mm/day',
      status: 'CRITICAL',
      subtext: 'Exceeds DGMS limit (3.0 mm/day) • FoS 1.18 Marginal',
      color: '#EF4444',
    },
    {
      id: 'PIZ-04',
      name: 'Piezometer PIZ-04',
      type: 'Pore Pressure Transducer',
      zone: 'Ramp Bench 3',
      coords: [mapCenter[0] - 0.004, mapCenter[1] - 0.005],
      metric: '184 kPa',
      status: 'NORMAL',
      subtext: 'Hydrostatic pore pressure stable',
      color: '#10B981',
    },
    {
      id: 'SSM-03',
      name: 'Seismograph SSM-03',
      type: 'Triaxial Blast Monitor',
      zone: 'Buffer Perimeter',
      coords: [mapCenter[0] - 0.008, mapCenter[1] + 0.012],
      metric: '4.2 mm/s PPV',
      status: 'NORMAL',
      subtext: 'Compliant with DGMS Circular 7 of 1997',
      color: '#10B981',
    },
    {
      id: 'WXR-01',
      name: 'Weather Station WXR-01',
      type: 'Ultrasonic Meteorological',
      zone: 'Pit Crest Vantage',
      coords: [mapCenter[0] + 0.011, mapCenter[1] - 0.008],
      metric: '4.2 mm / hr',
      status: 'NORMAL',
      subtext: 'Wind 12 km/h NE • Amb 28.4°C',
      color: '#38BDF8',
    },
    {
      id: 'CAN-EXC04',
      name: 'Excavator EX-04 Telemetry',
      type: 'CAN-bus Edge Gateway',
      zone: 'Sector D-04 Bench',
      coords: [mapCenter[0] + 0.002, mapCenter[1] + 0.004],
      metric: '142 bar Pressure',
      status: 'CRITICAL',
      subtext: 'Hydraulic gradient drop • Breakdown window <12h',
      color: '#EF4444',
    },
    {
      id: 'CAN-TRK17',
      name: 'Dumper T-17 Telemetry',
      type: 'CAN-bus Edge Gateway',
      zone: 'Main Haul Ramp',
      coords: [mapCenter[0] - 0.002, mapCenter[1] - 0.002],
      metric: '106.8°C Turbo',
      status: 'WARNING',
      subtext: 'Vibration 15.4 mm/s • Bearing thermal spike',
      color: '#F59E0B',
    },
  ];

  const handleZoneSelect = (zone) => {
    setInternalSelectedZone(zone);
    if (onZoneSelect) onZoneSelect(zone);
  };

  const handleToggleLayer = (layerId) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === layerId ? { ...l, active: !l.active } : l))
    );
  };

  const isLayerActive = (id) => layers.find((l) => l.id === id)?.active;

  const showSatellite = isLayerActive('satellite');
  const activeBasemap = showSatellite ? MAP_PROVIDERS.satellite : MAP_PROVIDERS.dark;

  const drillPoints = activeMineData.drill_points || [];
  const mineRoads = activeMineData.roads || [];

  // Filter drill points by depth bench and minimum cutoff grade
  const filteredDrillPoints = drillPoints.filter((dp) => {
    if (depthFilter && dp.depth && dp.depth > depthFilter) return false;
    if (minGradeFilter && dp.grade) {
      const g = parseFloat(dp.grade);
      if (!isNaN(g) && g < minGradeFilter) return false;
    }
    return true;
  });

  // Highlight or style zones based on selected stratigraphic formation
  const displayZones = activeZones.map((z) => {
    if (!selectedFormation) return z;
    const formText = `${z.name} ${z.geological_formation || ''}`.toLowerCase();
    let isMatch = false;
    let customColor = z.color;

    if (
      selectedFormation === 'mansar' &&
      (formText.includes('mansar') || formText.includes('gondite') || formText.includes('schist') || formText.includes('a-12'))
    ) {
      isMatch = true;
      customColor = '#10B981'; // Vibrant emerald ore horizon
    } else if (
      selectedFormation === 'chorbaoli' &&
      (formText.includes('chorbaoli') || formText.includes('quartzite') || formText.includes('d-09'))
    ) {
      isMatch = true;
      customColor = '#38BDF8'; // Sky blue hanging wall cap
    } else if (
      selectedFormation === 'tirodi' &&
      (formText.includes('tirodi') || formText.includes('gneiss') || formText.includes('basement') || formText.includes('c-03'))
    ) {
      isMatch = true;
      customColor = '#94A3B8'; // Slate footwall
    }

    return {
      ...z,
      color: isMatch ? customColor : '#475569',
      weight: isMatch ? 2.5 : 1,
      fillOpacity: isMatch ? 0.55 : 0.12,
      isFormationMatch: isMatch,
    };
  });

  return (
    <div
      className={`relative w-full rounded-xl overflow-hidden border border-[#242C3E] bg-[#080A0F] ${className}`}
      style={{ height }}
    >
      <MapContainer
        key={`${activeMineData.id || 'gumgaon'}-${mapCenter[0]}-${mapCenter[1]}`}
        center={mapCenter}
        zoom={activeMineData.zoom || 14}
        minZoom={11}
        maxZoom={18}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        touchZoom={true}
        dragging={true}
        className="w-full h-full"
        zoomControl={false}
      >
        <TileLayer
          url={activeBasemap.url}
          attribution={activeBasemap.attribution}
          maxZoom={activeBasemap.maxZoom}
          maxNativeZoom={activeBasemap.maxNativeZoom}
          subdomains={activeBasemap.subdomains || 'abc'}
          opacity={showSatellite ? 0.9 : 1}
        />
        {!showSatellite && activeBasemap.referenceUrl && (
          <TileLayer
            url={activeBasemap.referenceUrl}
            attribution=""
            maxZoom={activeBasemap.maxZoom}
            maxNativeZoom={activeBasemap.maxNativeZoom}
            opacity={0.85}
          />
        )}

        <ZoomAndCenterControls targetCenter={mapCenter} targetZoom={activeMineData.zoom || 14} />

        {/* 1. NDVI Layer */}
        {(isLayerActive('ndvi') || layerMode === 'ndvi') && (
          <Polygon
            positions={[
              [mapCenter[0] + 0.008, mapCenter[1] - 0.015],
              [mapCenter[0] + 0.018, mapCenter[1] - 0.005],
              [mapCenter[0] + 0.012, mapCenter[1] + 0.018],
              [mapCenter[0] - 0.005, mapCenter[1] + 0.008]
            ]}
            pathOptions={{
              fillColor: '#10B981',
              fillOpacity: 0.32,
              color: '#10B981',
              weight: 1.8,
              dashArray: '2, 4',
            }}
          >
            <Tooltip sticky className="dark-map-tooltip">
              <div className="text-xs text-slate-200">
                <div className="font-semibold text-emerald-400">Sentinel-2 NDVI Alteration Layer</div>
                <div className="text-[11px] text-slate-300">Vegetation Stress Proxy: <strong className="text-emerald-300">0.34 NDVI</strong></div>
                <div className="text-[10px] text-slate-400">Surface metal toxicity outcrop indicator</div>
              </div>
            </Tooltip>
          </Polygon>
        )}

        {/* 1B. SWIR 11/12 Manganese Oxide Alteration Anomaly Layer */}
        {(isLayerActive('swir') || layerMode === 'alteration') && (
          <Polygon
            positions={[
              [mapCenter[0] + 0.006, mapCenter[1] - 0.016],
              [mapCenter[0] + 0.018, mapCenter[1] - 0.002],
              [mapCenter[0] + 0.012, mapCenter[1] + 0.021],
              [mapCenter[0] - 0.004, mapCenter[1] + 0.007],
            ]}
            pathOptions={{
              fillColor: '#F59E0B',
              fillOpacity: 0.45,
              color: '#F59E0B',
              weight: 2.5,
              dashArray: '6, 6',
            }}
          >
            <Tooltip sticky className="dark-map-tooltip">
              <div className="text-xs text-slate-200 p-1">
                <div className="font-bold text-amber-400">Sentinel-2 SWIR 11/12 Alteration Anomaly</div>
                <div className="text-[11px] text-slate-300">Absorption Ratio: <strong className="text-amber-300">2.18x background</strong></div>
                <div className="text-[10px] text-emerald-400 font-mono mt-0.5">High Manganese Pyrolusite / Braunite Bed Correlation</div>
              </div>
            </Tooltip>
          </Polygon>
        )}

        {/* 2. Soil Moisture Layer */}
        {isLayerActive('soilMoisture') && (
          <Polygon
            positions={[
              [mapCenter[0] - 0.010, mapCenter[1] - 0.020],
              [mapCenter[0] + 0.010, mapCenter[1] - 0.008],
              [mapCenter[0] + 0.005, mapCenter[1] + 0.022],
              [mapCenter[0] - 0.018, mapCenter[1] + 0.015]
            ]}
            pathOptions={{
              fillColor: '#0EA5E9',
              fillOpacity: 0.22,
              color: '#0EA5E9',
              weight: 1.5,
              dashArray: '4, 4',
            }}
          >
            <Tooltip sticky className="dark-map-tooltip">
              <div className="text-xs text-slate-200">
                <div className="font-semibold text-sky-400">NASA SMAP Ground Saturation</div>
                <div className="text-[11px] text-slate-400">Soil Moisture: 68.2%</div>
              </div>
            </Tooltip>
          </Polygon>
        )}

        {/* 3. LST Layer */}
        {isLayerActive('lst') && (
          <Polygon
            positions={[
              [mapCenter[0] - 0.005, mapCenter[1] - 0.010],
              [mapCenter[0] + 0.008, mapCenter[1] + 0.002],
              [mapCenter[0] + 0.002, mapCenter[1] + 0.015],
              [mapCenter[0] - 0.012, mapCenter[1] + 0.005]
            ]}
            pathOptions={{
              fillColor: '#F59E0B',
              fillOpacity: 0.22,
              color: '#F59E0B',
              weight: 1.5,
            }}
          >
            <Tooltip sticky className="dark-map-tooltip">
              <div className="text-xs text-slate-200">
                <div className="font-semibold text-amber-400">MODIS Surface Thermal</div>
                <div className="text-[11px] text-slate-400">Temperature: 34.8&deg;C</div>
              </div>
            </Tooltip>
          </Polygon>
        )}

        {/* 4. Geological Fault Lines */}
        {isLayerActive('geology') && (
          <Polyline
            positions={[
              [mapCenter[0] + 0.018, mapCenter[1] - 0.022],
              [mapCenter[0] + 0.005, mapCenter[1] - 0.005],
              [mapCenter[0] - 0.008, mapCenter[1] + 0.015],
              [mapCenter[0] - 0.022, mapCenter[1] + 0.035],
            ]}
            pathOptions={{
              color: '#3B82F6',
              weight: 2,
              dashArray: '4, 4',
              opacity: 0.75,
            }}
          >
            <Tooltip sticky className="dark-map-tooltip">
              <div className="text-xs text-slate-200">
                <div className="font-semibold text-blue-400">{activeMineData.geological_formation}</div>
                <div className="text-[11px] text-slate-400">{activeMineData.mineralization_trend}</div>
              </div>
            </Tooltip>
          </Polyline>
        )}

        {/* 5. Haulage Roads */}
        {mineRoads.map((road, idx) => (
          <Polyline
            key={`road-${idx}`}
            positions={road}
            pathOptions={{
              color: 'rgba(255, 255, 255, 0.35)',
              weight: 1.5,
              dashArray: '3, 3',
            }}
          />
        ))}

        {/* 6. Drill Hole Core Assay Markers */}
        {(isLayerActive('drillData') || layerMode === 'drilling' || layerMode === 'all') &&
          filteredDrillPoints.map((dp) => (
            <Marker
              key={dp.id}
              position={[dp.lat, dp.lng]}
              icon={createDrillIcon(dp)}
              zIndexOffset={900}
            >
              <Tooltip sticky className="dark-map-tooltip">
                <div className="text-xs text-slate-200 p-0.5">
                  <div className="flex items-center justify-between gap-3 border-b border-[#242C3E] pb-1 mb-1">
                    <span className="font-bold text-blue-400 font-mono">{dp.id}</span>
                    <span className="text-[10px] font-semibold uppercase text-emerald-400 bg-emerald-500/15 px-1.5 py-0.5 rounded">
                      {dp.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300">
                    Drill Depth: <span className="font-mono font-semibold text-white">{dp.depth}m</span>
                  </div>
                  {dp.grade && (
                    <div className="text-[11px] text-emerald-400 font-mono mt-0.5">
                      Assay: {dp.grade}
                    </div>
                  )}
                </div>
              </Tooltip>
            </Marker>
          ))}

        {/* 6B. Dedicated IoT Sensor Stations (Rendered in SENSORS mode) */}
        {activeMode === 'SENSORS' &&
          sensorStations.map((station) => (
            <Marker
              key={station.id}
              position={station.coords}
              icon={createSensorIcon(station)}
              zIndexOffset={950}
            >
              <Tooltip sticky className="dark-map-tooltip">
                <div className="text-xs text-slate-200 p-1 min-w-[200px]">
                  <div className="flex items-center justify-between gap-2 border-b border-[#242C3E] pb-1 mb-1">
                    <span className="font-bold text-white font-mono">{station.name}</span>
                    <span className={`text-[9px] font-bold font-mono px-1.5 py-0.2 rounded ${
                      station.status === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300' :
                      station.status === 'WARNING' ? 'bg-amber-500/20 text-amber-300' :
                      'bg-emerald-500/20 text-emerald-300'
                    }`}>
                      {station.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300 font-mono">
                    Zone: <span className="text-slate-100">{station.zone}</span>
                  </div>
                  <div className="text-[11px] font-mono mt-0.5 text-white font-bold">
                    Reading: <span style={{ color: station.color }}>{station.metric}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 italic border-t border-[#242C3E]/60 pt-1">
                    {station.subtext}
                  </div>
                </div>
              </Tooltip>
            </Marker>
          ))}

        {/* 7. Reserve Zones */}
        {layerMode !== 'drilling' &&
          displayZones.map((zone) => (
            <ZoneOverlay
              key={zone.id}
              zone={zone}
              isSelected={selectedZone?.id === zone.id || zone.isFormationMatch}
              onSelect={handleZoneSelect}
            />
          ))}
      </MapContainer>

      {/* Dynamic Exploration Filter HUD Overlay */}
      {(layerMode !== 'all' || selectedFormation || depthFilter || minGradeFilter) && (
        <div className="absolute top-3 left-3 z-[1000] bg-[#0A0D14]/92 backdrop-blur-md border border-[#243046] px-3 py-1.5 rounded-[8px] text-[11px] font-mono text-slate-300 shadow-2xl flex flex-wrap items-center gap-2 pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="font-bold text-white uppercase">
            {layerMode === 'alteration'
              ? 'SWIR 11/12 Alteration Active'
              : layerMode === 'ndvi'
              ? 'Sentinel-2 NDVI Stress Active'
              : layerMode === 'drilling'
              ? `Drill Collars (${filteredDrillPoints.length} Visible)`
              : 'All Horizons'}
          </span>
          {selectedFormation && (
            <>
              <span className="text-slate-600">|</span>
              <span className="text-amber-400 capitalize font-semibold">{selectedFormation} Formation</span>
            </>
          )}
          {depthFilter && (
            <>
              <span className="text-slate-600">|</span>
              <span className="text-sky-400">Bench: 0 to -{depthFilter}m</span>
            </>
          )}
          {minGradeFilter && (
            <>
              <span className="text-slate-600">|</span>
              <span className="text-emerald-400">≥{minGradeFilter}% Mn</span>
            </>
          )}
        </div>
      )}

      {/* Floating Controls */}
      {showControls && (
        <MapControls layers={layers} onToggleLayer={handleToggleLayer} />
      )}

      {/* Legend */}
      {showLegend && <MapLegend />}

      {/* Zone Details Drawer */}
      {showZonePanel && selectedZone && (
        <ZoneInfoPanel
          zone={selectedZone}
          onClose={() => handleZoneSelect(null)}
        />
      )}
    </div>
  );
}
