const { jsPDF } = require('jspdf');
const fs = require('fs');
const path = require('path');

/**
 * Enterprise Architecture Blueprint PDF Generator for MANGENESIS
 * Generates an executive, publication-grade multi-page architectural report.
 */
function generateBlueprintPDF() {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;

  // Color Palette (Executive Deep Navy & Mineral Gold / Cyan)
  const colors = {
    darkBg: [10, 14, 23],
    headerNavy: [15, 23, 42],
    primaryGold: [199, 181, 159],
    accentCyan: [6, 182, 212],
    accentPurple: [168, 85, 247],
    textMain: [30, 41, 59],
    textMuted: [100, 116, 139],
    lightBg: [248, 250, 252],
    cardBorder: [226, 232, 240],
    white: [255, 255, 255],
  };

  let pageNum = 1;

  function addHeaderFooter() {
    // Header
    doc.setFillColor(...colors.headerNavy);
    doc.rect(0, 0, pageWidth, 12, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...colors.primaryGold);
    doc.text('MANGENESIS 2.0', margin, 7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(200, 210, 225);
    doc.text('|  Autonomous Subsurface Mineral Intelligence & 4D Digital Twin', margin + 28, 7.5);
    doc.setTextColor(148, 163, 184);
    doc.text('CONFIDENTIAL / ENGINEERING SPECIFICATION', pageWidth - margin, 7.5, { align: 'right' });

    // Footer
    doc.setDrawColor(...colors.cardBorder);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...colors.textMuted);
    doc.text('MOIL Multi-Mine Modernization Initiative  |  Ministry of Steel', margin, pageHeight - 7);
    doc.text(`Page ${pageNum}`, pageWidth - margin, pageHeight - 7, { align: 'right' });
  }

  // ==========================================
  // PAGE 1: COVER PAGE
  // ==========================================
  doc.setFillColor(10, 14, 24);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Decorative Accent Grids & Lines
  doc.setDrawColor(30, 41, 59);
  doc.setLineWidth(0.5);
  for (let y = 30; y < 270; y += 30) {
    doc.line(margin, y, pageWidth - margin, y);
  }

  // Geometric Gold Border Frame
  doc.setDrawColor(...colors.primaryGold);
  doc.setLineWidth(1.2);
  doc.rect(margin - 4, margin - 4, contentWidth + 8, pageHeight - (margin * 2) + 8);

  // Top Badge
  doc.setFillColor(30, 41, 59);
  doc.roundedRect(margin + 5, 42, 68, 8, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...colors.accentCyan);
  doc.text('ENTERPRISE RE-ENGINEERING', margin + 8, 47.5);

  // Main Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.setTextColor(255, 255, 255);
  doc.text('MANGENESIS', margin + 5, 68);

  doc.setFontSize(14);
  doc.setTextColor(...colors.primaryGold);
  doc.text('AUTONOMOUS MINERAL INTELLIGENCE & 4D DIGITAL TWIN', margin + 5, 78);

  // Subtitle / Abstract Block
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(203, 213, 225);
  const coverIntro = [
    'Comprehensive Architectural Re-Engineering Blueprint specifying the next-generation',
    'distributed platform for multi-mine operations, spaceborne InSAR and multispectral analytics,',
    'volumetric ore body modeling, real-time IoT fleet telematics, and predictive production continuity.',
  ];
  doc.text(coverIntro, margin + 5, 92);

  // Architecture Pillars Card on Cover
  doc.setFillColor(19, 27, 46);
  doc.roundedRect(margin + 5, 120, contentWidth - 10, 95, 4, 4, 'F');
  doc.setDrawColor(45, 60, 90);
  doc.roundedRect(margin + 5, 120, contentWidth - 10, 95, 4, 4, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...colors.accentCyan);
  doc.text('CORE ARCHITECTURAL PILLARS', margin + 12, 132);

  const pillars = [
    { title: '1. WebGPU & 4D Spatial Visualization Engine', desc: 'Hardware-accelerated subterranean voxel rendering, PBR strata shaders, and 60 FPS multi-mine digital twins.' },
    { title: '2. Real-Time High-Throughput Ingestion (Go / Rust)', desc: '50k+ events/sec streaming CAN-bus fleet telemetry, seismographs, and ISRO/NASA satellite passes.' },
    { title: '3. Spatial & Time-Series Data Lakehouse', desc: 'PostgreSQL 17 + PostGIS 3.5, TimescaleDB, and Apache Sedona for distributed multi-spectral raster queries.' },
    { title: '4. AI Volumetric Grade Modeling & Kriging', desc: 'Sparse 3D-CNNs + Ordinary Kriging for UNFC 111 drill assay interpolation & LightGBM production forecast.' },
  ];

  let pillarY = 142;
  pillars.forEach((p) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text(p.title, margin + 14, pillarY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(p.desc, margin + 14, pillarY + 4.5);
    pillarY += 14;
  });

  // Metadata Footer on Cover
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...colors.primaryGold);
  doc.text('DOCUMENT METADATA', margin + 5, 235);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('Client: MOIL Limited (Min. of Steel, Govt of India)', margin + 5, 242);
  doc.text('Target Platform: Multi-Mine Autonomous Fleet & Reserve System', margin + 5, 247);
  doc.text('Architecture Version: 2.0-Enterprise (Q3 2026)', margin + 5, 252);
  doc.text('Classification: Highly Confidential / Technical Specification', margin + 5, 257);

  // ==========================================
  // PAGE 2: EXECUTIVE SUMMARY & SYSTEM OVERVIEW
  // ==========================================
  doc.addPage();
  pageNum++;
  addHeaderFooter();

  let curY = 22;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...colors.headerNavy);
  doc.text('1. Executive Summary & Problem Diagnosis', margin, curY);
  curY += 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...colors.textMain);
  const execText = [
    'The existing mining operations at MOIL open-pit and underground locations (Gumgaon, Dongri Buzurg,',
    'Mansar, Ukwa, and Balaghat) rely on fragmented legacy systems: 2D desktop GIS applications, offline spreadsheets,',
    'infrequent manual survey cross-sections, and reactive equipment maintenance. This operational fragmentation leads',
    'to 12-18% preventable production shortfalls, suboptimal grade blending, and delayed slope instability detection.',
    '',
    'MANGENESIS 2.0 re-engineers the operational lifecycle into a unified, event-driven, 4D Geospatial Intelligence',
    'Platform that bridges orbital remote sensing, subsurface geostatistics, and autonomous haulage dispatch.',
  ];
  doc.text(execText, margin, curY);
  curY += 34;

  // Comparison Matrix Card (Current vs Next-Gen)
  doc.setFillColor(...colors.lightBg);
  doc.roundedRect(margin, curY, contentWidth, 54, 3, 3, 'F');
  doc.setDrawColor(...colors.cardBorder);
  doc.roundedRect(margin, curY, contentWidth, 54, 3, 3, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(...colors.headerNavy);
  doc.text('ARCHITECTURAL PARADIGM SHIFT', margin + 6, curY + 8);

  const matrixCols = [
    { label: 'Domain', x: margin + 6 },
    { label: 'Legacy Paradigm', x: margin + 45 },
    { label: 'MANGENESIS 2.0 Next-Gen Architecture', x: margin + 105 },
  ];

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...colors.textMuted);
  matrixCols.forEach((col) => doc.text(col.label, col.x, curY + 16));

  doc.setDrawColor(...colors.cardBorder);
  doc.line(margin + 6, curY + 18, margin + contentWidth - 6, curY + 18);

  const rows = [
    ['Geospatial Rendering', 'Static 2D Leaflet maps / raster tiles', 'WebGPU 4D volumetric terrain + PBR strata'],
    ['Subsurface Modeling', '2D drill hole log spreadsheets', 'Sparse 3D-CNN + Kriging Voxel Block Models'],
    ['Fleet Telematics', 'End-of-shift operator tally sheets', 'Kafka streaming CAN-bus telemetry @ 10Hz'],
    ['Shortfall Prediction', 'Reactive manual scheduling', 'LightGBM + InSAR & NASA GPM auto-calibration'],
  ];

  let rowY = curY + 24;
  rows.forEach((row) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...colors.textMain);
    doc.text(row[0], margin + 6, rowY);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(220, 38, 38);
    doc.text(row[1], margin + 45, rowY);

    doc.setTextColor(16, 185, 129);
    doc.text(row[2], margin + 105, rowY);
    rowY += 7.5;
  });

  curY += 64;

  // High-Level System Architecture Diagram (Conceptual Box Flow)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...colors.headerNavy);
  doc.text('2. End-to-End System Topology', margin, curY);
  curY += 7;

  // Draw Architecture Tiers
  const tiers = [
    { name: '1. Ingestion Tier', sub: 'ISRO RISAT / Sentinel-2 / NASA GPM / CAT 785D IoT / Seismographs', color: [241, 245, 249] },
    { name: '2. Streaming & Event Bus', sub: 'Apache Kafka / Redpanda Cluster + NATS JetStream (50k msgs/sec)', color: [238, 242, 255] },
    { name: '3. Data Lakehouse & GIS', sub: 'PostgreSQL 17 (PostGIS 3.5) + TimescaleDB + MinIO GeoTIFF S3', color: [240, 253, 250] },
    { name: '4. AI & Analytical Microservices', sub: 'Ray Cluster + 3D Kriging Voxel Engine + LightGBM Yield Predictor', color: [250, 245, 255] },
    { name: '5. Executive Frontend Tier', sub: 'Next.js 15.2 (React 19) + WebGPU / Three.js r186 + Deck.gl GIS Engine', color: [254, 252, 232] },
  ];

  tiers.forEach((t) => {
    doc.setFillColor(...t.color);
    doc.roundedRect(margin, curY, contentWidth, 14, 2.5, 2.5, 'F');
    doc.setDrawColor(...colors.cardBorder);
    doc.roundedRect(margin, curY, contentWidth, 14, 2.5, 2.5, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(...colors.headerNavy);
    doc.text(t.name, margin + 6, curY + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...colors.textMuted);
    doc.text(t.sub, margin + 6, curY + 10.5);

    curY += 17;
  });

  // ==========================================
  // PAGE 3: FRONTEND ARCHITECTURE
  // ==========================================
  doc.addPage();
  pageNum++;
  addHeaderFooter();

  curY = 22;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...colors.headerNavy);
  doc.text('3. Next-Generation Frontend Architecture', margin, curY);
  curY += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...colors.textMain);
  doc.text(
    'The client-side architecture is re-engineered around React 19, Next.js 15.2 App Router, and a dedicated WebGPU/Three.js spatial pipeline.',
    margin,
    curY
  );
  curY += 10;

  // Frontend Component Stack Cards
  const feComponents = [
    {
      title: '3.1 WebGPU / Three.js 4D Spatial Viewport',
      tech: 'Three.js r186+ / WebGPU / React Three Fiber / Drei',
      bullets: [
        'Hardware-accelerated procedural open-pit quarry with terraced bench geometry & normal bump mapping.',
        'Volumetric Subsurface Core Slicer: Real-time depth clipping planes down to -250m depth without CPU stall.',
        'Ore Voxel Block Model: GPU instance rendering of 250,000+ mineral grade blocks at consistent 60 FPS.',
        'Dynamic PBR lighting rig: Physical directional sun, atmospheric fog, and specular ore glint shaders.',
      ],
    },
    {
      title: '3.2 Multi-Scale Geospatial GIS Engine',
      tech: 'Deck.gl v9 + MapLibre GL v4 + CesiumJS 3D Tiles',
      bullets: [
        'Massive vector overlay rendering: Displays 50,000+ drill collar locations, survey stations, and lease boundaries.',
        'InSAR Deformation Heatmap Layer: Millimeter-scale surface displacement contour visualizer.',
        'Continuous LOD (Level of Detail) tile streaming directly from Cloud-Optimized GeoTIFF (COG) endpoints.',
      ],
    },
    {
      title: '3.3 State Management & Sub-15ms Telemetry Streaming',
      tech: 'Zustand v5 + TanStack Query v5 + WebSockets / WebTransport',
      bullets: [
        'Zustand for transient 3D camera matrices, layer visibility filters, and active zone inspection state.',
        'TanStack Query v5 for optimistic updates, background refetching, and offline cache warming.',
        'Binary Protobuf decoding over WebSockets for zero-lag CAT 785D haul truck positioning in 3D.',
      ],
    },
    {
      title: '3.4 De-Congested Executive UI & Cyber-Luxury Design System',
      tech: 'Tailwind CSS v4 + Radix UI + Framer Motion (OriginKit / Lightwind Style)',
      bullets: [
        'Uncluttered, expansive layouts with generous breathing room (max-w-[1700px], 24px+ card padding).',
        '3D Perspective Tilt Cards: Interactive cursor-following spotlight shaders and subtle metallic bevels.',
        'Minimalist floating frosted-glass pill controls (backdrop-blur-xl) over the 3D canvas instead of bulky black boxes.',
      ],
    },
  ];

  feComponents.forEach((c) => {
    doc.setFillColor(...colors.lightBg);
    doc.roundedRect(margin, curY, contentWidth, 48, 3, 3, 'F');
    doc.setDrawColor(...colors.cardBorder);
    doc.roundedRect(margin, curY, contentWidth, 48, 3, 3, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(...colors.headerNavy);
    doc.text(c.title, margin + 6, curY + 7);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...colors.accentCyan);
    doc.text(`Stack: ${c.tech}`, margin + 6, curY + 12);

    let bY = curY + 18;
    c.bullets.forEach((b) => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(...colors.textMain);
      doc.text(`•  ${b}`, margin + 8, bY);
      bY += 6.5;
    });

    curY += 54;
  });

  // ==========================================
  // PAGE 4: BACKEND & DISTRIBUTED SYSTEMS ARCHITECTURE
  // ==========================================
  doc.addPage();
  pageNum++;
  addHeaderFooter();

  curY = 22;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...colors.headerNavy);
  doc.text('4. Next-Generation Backend & Distributed Systems', margin, curY);
  curY += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...colors.textMain);
  doc.text(
    'The backend infrastructure leverages a modular microservices topology engineered for high-throughput spatial and telemetry ingestion.',
    margin,
    curY
  );
  curY += 10;

  // Backend Microservices Architecture Table
  const beServices = [
    {
      name: 'Telemetry Ingestion Gateway',
      lang: 'Rust / Actix-Web',
      desc: 'Ingests CAN-bus J1939 logs from CAT 785D trucks, excavator hydraulic sensors, and seismographs @ 50k events/sec. Emits to Kafka.',
    },
    {
      name: 'Spatial Data Engine',
      lang: 'Go / Fiber + GDAL',
      desc: 'Processes satellite imagery (Sentinel-2, ISRO RISAT-1A), generates Cloud-Optimized GeoTIFFs (COGs), and serves PostGIS spatial queries.',
    },
    {
      name: 'Geostatistical AI Service',
      lang: 'Python 3.12 / FastAPI + Ray',
      desc: 'Executes Ordinary Kriging and 3D Sparse-CNN voxel interpolation for UNFC 111 reserve estimation and grade isosurfaces.',
    },
    {
      name: 'Predictive Production Engine',
      lang: 'Python 3.12 / LightGBM',
      desc: 'Predicts 7-day and 14-day production deficits calibrated continuously against radar precipitation, blast cycles, and haul delays.',
    },
    {
      name: 'Core Operations GraphQL API',
      lang: 'TypeScript / Node.js 22 (NestJS)',
      desc: 'Federated GraphQL & REST gateway providing RBAC-governed domain models, shift rosters, audit trails, and reporting.',
    },
  ];

  beServices.forEach((s) => {
    doc.setFillColor(...colors.lightBg);
    doc.roundedRect(margin, curY, contentWidth, 24, 2.5, 2.5, 'F');
    doc.setDrawColor(...colors.cardBorder);
    doc.roundedRect(margin, curY, contentWidth, 24, 2.5, 2.5, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...colors.headerNavy);
    doc.text(s.name, margin + 6, curY + 6.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...colors.accentPurple);
    doc.text(`[ ${s.lang} ]`, margin + contentWidth - 6, curY + 6.5, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...colors.textMain);
    const descLines = doc.splitTextToSize(s.desc, contentWidth - 12);
    doc.text(descLines, margin + 6, curY + 12.5);

    curY += 28;
  });

  curY += 4;

  // Database Topology Section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...colors.headerNavy);
  doc.text('4.2 Polyglot Persistence & Data Topology', margin, curY);
  curY += 6;

  const dbTopology = [
    { db: 'PostgreSQL 17 + PostGIS 3.5', role: 'Canonical Spatial & Relational Store', specs: 'Mine leases, drill collars, assay logs, user entitlements, asset registry' },
    { db: 'TimescaleDB / ClickHouse', role: 'High-Velocity Time-Series Lake', specs: '100M+ sensor events, truck GPS tracks, vibration spectra, seismic monitors' },
    { db: 'MinIO / Cloud S3', role: 'Geospatial Object Storage', specs: 'Cloud-Optimized GeoTIFFs (COG), 3D Tiles Next, satellite multi-spectral bands' },
    { db: 'Redis 7.4 Cluster', role: 'In-Memory State & Pub/Sub', specs: 'Real-time truck coordinates, active alerts, distributed rate limiting' },
  ];

  dbTopology.forEach((d) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...colors.headerNavy);
    doc.text(`• ${d.db}: `, margin + 4, curY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...colors.textMain);
    doc.text(`${d.role} — ${d.specs}`, margin + 50, curY);
    curY += 6.5;
  });

  // ==========================================
  // PAGE 5: AI & GEOTECHNICAL PIPELINE
  // ==========================================
  doc.addPage();
  pageNum++;
  addHeaderFooter();

  curY = 22;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...colors.headerNavy);
  doc.text('5. AI, Geostatistical & Geotechnical Pipeline', margin, curY);
  curY += 8;

  const aiPillars = [
    {
      title: '5.1 3D Subsurface Volumetric Grade Modeling',
      bullets: [
        'Combines Variogram Modeling & 3D Ordinary Kriging with deep Sparse Convolutional Networks (Minkowski Engine).',
        'Interpolates continuous Mn grade, Fe impurities, and SiO2 concentrations across 5m x 5m x 5m selective mining units (SMUs).',
        'Assigns JORC / UNFC 111, 121, and 122 confidence tiers based on geostatistical kriging variance.',
      ],
    },
    {
      title: '5.2 Production Shortfall Forecasting (LightGBM + TFT)',
      bullets: [
        'Ensemble model combining LightGBM gradient boosting with Temporal Fusion Transformers (TFT).',
        'Exogenous features: NASA GPM radar rainfall (mm/hr), excavator hydraulic pressure drops, haul road slickness indices.',
        'Generates probabilistic shortfall risk distributions (P10, P50, P90) up to 14 days ahead of processing plant feed.',
      ],
    },
    {
      title: '5.3 Geotechnical Hazard & Slope Stability AI',
      bullets: [
        'Persistent Scatterer InSAR (PSI) interferometry processing detects pit wall slope subsidence with millimeter precision.',
        'Continuous Factor of Safety (FoS) computation based on bishop simplified slice method integrated with groundwater piezometers.',
        'Automated alert dispatch to DGMS compliance dashboards when bench displacement rate exceeds 2.5 mm/day.',
      ],
    },
    {
      title: '5.4 Optimal Ore Blending & Dispatch Optimization',
      bullets: [
        'Mixed-Integer Linear Programming (MILP) solver optimizing daily pit extraction targets.',
        'Maintains uniform 44-46% Mn feed to the ferro-alloy plant while minimizing haul truck transit fuel by 8.4%.',
      ],
    },
  ];

  aiPillars.forEach((a) => {
    doc.setFillColor(...colors.lightBg);
    doc.roundedRect(margin, curY, contentWidth, 48, 3, 3, 'F');
    doc.setDrawColor(...colors.cardBorder);
    doc.roundedRect(margin, curY, contentWidth, 48, 3, 3, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(...colors.headerNavy);
    doc.text(a.title, margin + 6, curY + 7);

    let bY = curY + 15;
    a.bullets.forEach((b) => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(...colors.textMain);
      const wrapped = doc.splitTextToSize(`•  ${b}`, contentWidth - 14);
      doc.text(wrapped, margin + 8, bY);
      bY += 9;
    });

    curY += 56;
  });

  // ==========================================
  // PAGE 6: SECURITY, SOVEREIGN COMPLIANCE & ROADMAP
  // ==========================================
  doc.addPage();
  pageNum++;
  addHeaderFooter();

  curY = 22;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...colors.headerNavy);
  doc.text('6. Sovereign Security, Governance & Implementation Roadmap', margin, curY);
  curY += 8;

  // Security & Compliance
  doc.setFillColor(...colors.lightBg);
  doc.roundedRect(margin, curY, contentWidth, 55, 3, 3, 'F');
  doc.setDrawColor(...colors.cardBorder);
  doc.roundedRect(margin, curY, contentWidth, 55, 3, 3, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(...colors.headerNavy);
  doc.text('6.1 Security & Sovereign Compliance Framework', margin + 6, curY + 7);

  const secItems = [
    'Zero-Trust Architecture: Mutual TLS (mTLS) across all inter-service communication via Istio Service Mesh.',
    'Sovereign Data Governance: All strategic mineral reserve data encrypted at rest (AES-256) and held in domestic Indian GovCloud.',
    'Indian Mines Act 1952 & DGMS Guidelines: Automated shift logging, statutory accident registers, and gas telemetry audits.',
    'UNFC 1997 / CRIRSCO Compliance: International standard geostatistical reserve reporting with audit logs.',
  ];

  let secY = curY + 15;
  secItems.forEach((s) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...colors.textMain);
    doc.text(`•  ${s}`, margin + 8, secY);
    secY += 8.5;
  });

  curY += 65;

  // Implementation Roadmap
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...colors.headerNavy);
  doc.text('6.2 Phased Engineering Execution Roadmap', margin, curY);
  curY += 7;

  const phases = [
    {
      phase: 'Phase 1: Foundation & Spatial Core (Weeks 1 - 4)',
      scope: 'Deploy PostgreSQL/PostGIS + TimescaleDB cluster; implement WebGPU 3D terrain viewer & drill-hole core visualizer.',
      milestone: 'Deliverable: Interactive 3D Digital Twin with real geological PBR lithology & drill assay inspection.',
    },
    {
      phase: 'Phase 2: Telematics & InSAR Pipeline (Weeks 5 - 8)',
      scope: 'Deploy Rust/Go ingestion gateway, Kafka broker, and ISRO RISAT-1A / Sentinel-2 automated COG raster pipelines.',
      milestone: 'Deliverable: Real-time 10Hz truck telemetry tracking in 3D + satellite multi-spectral alteration maps.',
    },
    {
      phase: 'Phase 3: AI Volumetric Kriging & Yield Prediction (Weeks 9 - 12)',
      scope: 'Implement Ray-backed 3D Kriging voxel model, LightGBM 7-day shortfall predictor, and DGMS hazard alerts.',
      milestone: 'Deliverable: Autonomous operational recommendations & UNFC 111 reserve estimation with 94%+ accuracy.',
    },
    {
      phase: 'Phase 4: Multi-Mine Scaling & Hardening (Weeks 13 - 16)',
      scope: 'Roll out across all 5 MOIL mines (Gumgaon, Dongri Buzurg, Mansar, Ukwa, Balaghat) with offline PWA field sync.',
      milestone: 'Deliverable: Enterprise production sign-off, DGMS security audit clearance, and executive training.',
    },
  ];

  phases.forEach((p) => {
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(margin, curY, contentWidth, 27, 2, 2, 'F');
    doc.setDrawColor(...colors.cardBorder);
    doc.roundedRect(margin, curY, contentWidth, 27, 2, 2, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(...colors.headerNavy);
    doc.text(p.phase, margin + 5, curY + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...colors.textMain);
    doc.text(p.scope, margin + 5, curY + 12);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(16, 185, 129);
    doc.text(`✓ ${p.milestone}`, margin + 5, curY + 19);

    curY += 31;
  });

  // Output file
  const outputPath = path.resolve(__dirname, '..', 'MANGENESIS_NextGen_Architecture_Blueprint.pdf');
  const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
  fs.writeFileSync(outputPath, pdfBuffer);
  console.log(`[SUCCESS] Master Architecture Blueprint PDF generated at: ${outputPath}`);
}

generateBlueprintPDF();
