# MANGENESIS Technology Stack Table

| Layer / Domain | Technology / Tool | Role in MANGENESIS Platform | Key Metric / Detail |
| :--- | :--- | :--- | :--- |
| Space Observation | Copernicus Sentinel-2 (ESA) | Multi-spectral optical & SWIR imaging for mineral alteration | Multi-band NDVI & Alteration Index |
| Space Observation | NASA GPM (Precipitation) | Real-time space radar rainfall tracking for pit inundation risk | Live mm/24h precipitation grid |
| Space Observation | NASA SMAP (Soil Moisture) | Microwave radiometry for ground saturation & haul road traction | 0–100% soil moisture index |
| Space Observation | MODIS / Landsat-9 (LST) | Thermal inertia mapping to identify dense Gondite ore bodies | Land surface temperature (deg C) |
| Live API Feed | Open-Meteo Satellite API | Dynamic satellite telemetry ingestion by mine coordinates | Automated real-time telemetry |
| AI / Machine Learning | XGBoost Classifier | Spatial manganese reserve exploration probability mapping | Test AUC: 0.8825 |
| AI / Machine Learning | LightGBM Regressor | Time-series forecasting of 7-day extraction throughput | Test R-Squared: 0.9877 |
| Explainable AI (XAI) | TreeSHAP Attribution | Decomposes shortfall risk into exact operational root causes | Game-theoretic factor breakdown |
| Decision Optimization | PuLP (MILP Solver) | Mixed-integer linear programming for shovel/dumper fleet redeployment | Recovers 77% of deficit tonnage |
| Backend Framework | Python 3.13 + FastAPI | Asynchronous, high-throughput REST API microservices | Auto-generated OpenAPI / Swagger docs |
| Web Server & Database | Uvicorn + SQLite | ASGI async web server & local relational state storage | Multi-mine database schema |
| Frontend Framework | React 19 + Vite | High-performance Single Page Application (SPA) | Sub-second build & instant HMR |
| UI & Styling | Tailwind CSS | Minimal enterprise slate design system with high contrast | Responsive, clean dark theme |
| GIS Mapping | Leaflet + React-Leaflet | Interactive geospatial maps with multi-spectral polygon layers | Esri World Imagery + dynamic centering |
| Data Visualization | Recharts | Time-series area curves, trendlines & radial donut charts | 14-day history + 7-day forecasts |
| UI Motion & Icons | Framer Motion + Lucide | Smooth layout animations, KPI tickers & industrial icons | Modern enterprise UX |
| Cloud & Deployment | Vercel | Edge CDN deployment with Single Page App rewrites | Global low-latency hosting |
