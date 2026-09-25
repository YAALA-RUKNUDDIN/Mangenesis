import { Polygon, Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';

export default function ZoneOverlay({ zone, isSelected, onSelect }) {
  const customDivIcon = L.divIcon({
    className: 'custom-zone-label',
    html: `
      <div style="
        background: #0F121A;
        border: 1.5px solid ${zone.color};
        color: #F1F5F9;
        padding: 4px 9px;
        border-radius: 6px;
        font-family: 'Inter', sans-serif;
        font-size: 10px;
        font-weight: 600;
        white-space: nowrap;
        text-align: center;
        box-shadow: 0 4px 14px rgba(0,0,0,0.85);
        pointer-events: auto;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
      ">
        <span style="color: ${zone.color}; font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700;">${zone.name}</span>
        <span style="font-size: 9px; opacity: 0.9; color: #CBD5E1;">${zone.probability}% Mn Reserve Prob</span>
      </div>
    `,
    iconSize: [120, 34],
    iconAnchor: [60, 17],
  });

  return (
    <>
      <Polygon
        positions={zone.coordinates}
        pathOptions={{
          fillColor: zone.color,
          fillOpacity: isSelected ? 0.35 : 0.18,
          color: zone.color,
          weight: isSelected ? 2 : 1.2,
          dashArray: isSelected ? undefined : '3, 3',
        }}
        eventHandlers={{
          click: () => onSelect(zone),
        }}
      >
        <Tooltip sticky className="dark-map-tooltip">
          <div className="font-mono text-[11px] p-0.5 space-y-1 min-w-[170px]">
            <div className="flex items-center justify-between gap-3 border-b border-[#243046] pb-1">
              <span className="font-bold text-white text-xs">{zone.name}</span>
              <span
                className="text-[10px] px-1.5 py-0.2 rounded font-semibold"
                style={{ color: zone.color, backgroundColor: `${zone.color}20` }}
              >
                {zone.unfcCode || zone.status || 'UNFC 111'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[10px] text-slate-300">
              <span className="text-slate-400">Reserve Prob:</span>
              <span className="font-bold text-right" style={{ color: zone.color }}>
                {zone.probability}%
              </span>
              <span className="text-slate-400">Mn Grade:</span>
              <span className="font-bold text-white text-right">
                {zone.grade || '41.8% Mn'}
              </span>
              <span className="text-slate-400">Confidence:</span>
              <span className="font-bold text-emerald-400 text-right">
                {zone.confidence || 'High'}
              </span>
            </div>
          </div>
        </Tooltip>
      </Polygon>

      <Marker
        position={zone.center}
        icon={customDivIcon}
        eventHandlers={{
          click: () => onSelect(zone),
        }}
      />
    </>
  );
}
