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
          <div className="p-1">
            <div className="font-bold text-xs" style={{ color: zone.color }}>
              {zone.name}
            </div>
            <div className="text-[11px] text-slate-200 mt-0.5">
              Manganese Ore Reserve Probability: <span className="font-mono font-bold" style={{ color: zone.color }}>{zone.probability}%</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Formation: {zone.geological_formation || 'Sausar Group'}
            </div>
            <div className="text-[9px] text-blue-400 mt-1">Click to view geological features & schedule drilling</div>
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
