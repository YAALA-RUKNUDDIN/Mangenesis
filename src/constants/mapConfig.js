/**
 * Centralized Map Tile Providers Configuration
 *
 * Uses Esri World Dark Gray Canvas by default (zero watermark, no API key required, fast CDN).
 * If a CARTO API key is provided via VITE_CARTO_API_KEY, CARTO Dark Matter is used with auth.
 */

const cartoKey = import.meta.env.VITE_CARTO_API_KEY;

export const MAP_PROVIDERS = {
  dark: {
    url: cartoKey
      ? `https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png?key=${cartoKey}`
      : 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    referenceUrl: cartoKey
      ? null
      : 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}',
    attribution: cartoKey
      ? '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
      : '&copy; <a href="https://www.esri.com/">Esri</a> &mdash; Esri, DeLorme, NAVTEQ',
    maxZoom: 19,
    maxNativeZoom: cartoKey ? 19 : 16,
    subdomains: cartoKey ? 'abcd' : 'abc',
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; <a href="https://www.esri.com/">Esri</a> &mdash; High-Resolution Earth Imagery',
    maxZoom: 18,
    maxNativeZoom: 18,
    subdomains: 'abc',
  },
};
