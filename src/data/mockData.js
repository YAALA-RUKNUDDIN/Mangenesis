// ============================================================
// MANGENESIS - Multi-Mine MOIL Enterprise Dataset
// Smart India Hackathon 2026 | Problem Statement: SIH26009
// Organization: Ministry of Steel — MOIL Ltd.
// ============================================================

export const mines = [
  {
    id: 'gumgaon',
    name: 'Gumgaon Manganese Mine',
    pilot: true,
    district: 'Nagpur',
    state: 'Maharashtra',
    center: [21.155, 79.090],
    zoom: 14,
    type: 'Underground & Opencast',
    capacity_tpd: 10000,
    elevation_m: 312,
    geological_formation: 'Sausar Group (Gondite Series)',
    mineralization_trend: 'ENE-WSW Dip 65° SE',
    description: 'Pilot reference site for AI model calibration and multi-spectral space telemetry.',
    zones: [
      {
        id: 'gum-A-12',
        name: 'Sector A-12 (North Ridge)',
        color: '#10B981',
        priority: 'HIGH',
        probability: 96,
        center: [21.158, 79.095],
        coordinates: [
          [21.160, 79.090], [21.165, 79.095], [21.162, 79.102], [21.156, 79.098]
        ],
        geological_formation: 'Mansar Schist & Gondite',
        indicators: [
          'High multispectral NDVI alteration signature',
          'Strong thermal inertia indicating dense gondite body',
          'Adjacent to productive exploratory core DP-G01'
        ],
        recommendation: 'Immediate priority: dispatch diamond core drilling rig for 120m depth assay.'
      },
      {
        id: 'gum-D-09',
        name: 'Sector D-09 (South Flank)',
        color: '#10B981',
        priority: 'HIGH',
        probability: 95,
        center: [21.148, 79.082],
        coordinates: [
          [21.152, 79.078], [21.155, 79.085], [21.147, 79.090], [21.143, 79.081]
        ],
        geological_formation: 'Chorbaoli Quartzite Contact',
        indicators: [
          'Sentinel-2 Band 11/12 shortwave infrared anomaly',
          'Structural shear zone parallel to main lode'
        ],
        recommendation: 'Conduct trench sampling and magnetic susceptibility survey.'
      },
      {
        id: 'gum-B-07',
        name: 'Sector B-07 (East Extension)',
        color: '#F59E0B',
        priority: 'MEDIUM',
        probability: 63,
        center: [21.151, 79.112],
        coordinates: [
          [21.156, 79.106], [21.159, 79.115], [21.150, 79.120], [21.145, 79.110]
        ],
        geological_formation: 'Lohangi Marble & Calciphyre',
        indicators: [
          'Moderate magnetic gradient',
          'Partial surface overburden masking spectral reflection'
        ],
        recommendation: 'Deep electrical resistivity tomography (ERT) profiling recommended.'
      },
      {
        id: 'gum-C-03',
        name: 'Sector C-03 (West Boundary)',
        color: '#64748B',
        priority: 'LOW',
        probability: 22,
        center: [21.162, 79.072],
        coordinates: [
          [21.167, 79.066], [21.171, 79.075], [21.164, 79.080], [21.158, 79.070]
        ],
        geological_formation: 'Tirodi Biotite Gneiss Basement',
        indicators: [
          'Barren granitic gneiss bedrock',
          'Negligible manganese mineralization signatures'
        ],
        recommendation: 'Deprioritize ground exploration; retain as mine infrastructure buffer.'
      }
    ],
    drill_points: [
      { id: 'DP-G01', lat: 21.159, lng: 79.096, status: 'completed', depth: 145, grade: '44.8% Mn' },
      { id: 'DP-G02', lat: 21.149, lng: 79.083, status: 'active', depth: 88, grade: '42.1% Mn' },
      { id: 'DP-G03', lat: 21.153, lng: 79.114, status: 'completed', depth: 160, grade: '38.4% Mn' },
      { id: 'DP-G04', lat: 21.155, lng: 79.088, status: 'completed', depth: 180, grade: '46.2% Mn' },
      { id: 'DP-G05', lat: 21.163, lng: 79.074, status: 'planned', depth: 120, grade: 'Targeting Reef' }
    ],
    roads: [
      [[21.145, 79.060], [21.150, 79.080], [21.158, 79.095], [21.165, 79.110]],
      [[21.140, 79.090], [21.148, 79.082], [21.155, 79.090]]
    ]
  },

  {
    id: 'balaghat',
    name: 'Balaghat Manganese Mine',
    pilot: false,
    district: 'Balaghat',
    state: 'Madhya Pradesh',
    center: [21.812, 80.188],
    zoom: 14,
    type: "Deep Underground (Asia's Deepest)",
    capacity_tpd: 14000,
    elevation_m: 330,
    geological_formation: 'Bharweli-Ukwa Ore Belt (Mansar Formation)',
    mineralization_trend: 'NE-SW Strike, Steep Dip 70° NW',
    description: "MOIL's flagship and largest producing manganese asset with ultra-deep shaft extraction.",
    zones: [
      {
        id: 'bal-North-01',
        name: 'Bharweli Deep Shaft Zone',
        color: '#10B981',
        priority: 'HIGH',
        probability: 98,
        center: [21.815, 80.192],
        coordinates: [
          [21.818, 80.186], [21.822, 80.194], [21.816, 80.200], [21.810, 80.190]
        ],
        geological_formation: 'Braunitic High-Grade Manganese Reef',
        indicators: [
          'High grade pyrolusite/braunite contact (>48% Mn assay)',
          'Subsurface seismic continuity to 650m depth',
          'Strong electromagnetic conductor along shear axis'
        ],
        recommendation: 'Expand Level 18 exploration cross-cuts and advance underground diamond drill.'
      },
      {
        id: 'bal-East-04',
        name: 'Hirapur Extension Target',
        color: '#10B981',
        priority: 'HIGH',
        probability: 89,
        center: [21.808, 80.205],
        coordinates: [
          [21.812, 80.200], [21.815, 80.210], [21.805, 80.215], [21.801, 80.204]
        ],
        geological_formation: 'Quartzite-Manganese Breccia Band',
        indicators: [
          'Landsat-9 SWIR hydrothermal alteration corridor',
          'Historical surface pit assay confirmed 41.5% Mn'
        ],
        recommendation: 'Surface incline drilling scheduled for Q3 FY27.'
      },
      {
        id: 'bal-West-02',
        name: 'Garra Sector Flank',
        color: '#F59E0B',
        priority: 'MEDIUM',
        probability: 58,
        center: [21.820, 80.175],
        coordinates: [
          [21.825, 80.170], [21.828, 80.180], [21.818, 80.185], [21.814, 80.174]
        ],
        geological_formation: 'Phyllite & Schist Host',
        indicators: [
          'Moderate magnetic signature',
          'Thick alluvium cover requiring deep probing'
        ],
        recommendation: 'Execute gravity-magnetic grid survey.'
      }
    ],
    drill_points: [
      { id: 'DP-B01', lat: 21.816, lng: 80.193, status: 'completed', depth: 420, grade: '49.2% Mn' },
      { id: 'DP-B02', lat: 21.809, lng: 80.206, status: 'active', depth: 210, grade: '45.1% Mn' },
      { id: 'DP-B03', lat: 21.821, lng: 80.176, status: 'planned', depth: 350, grade: 'Targeting Reef' },
      { id: 'DP-B04', lat: 21.813, lng: 80.185, status: 'completed', depth: 510, grade: '48.0% Mn' }
    ],
    roads: [
      [[21.805, 80.170], [21.812, 80.188], [21.822, 80.194]],
      [[21.812, 80.188], [21.808, 80.205]]
    ]
  },

  {
    id: 'dongri_buzurg',
    name: 'Dongri Buzurg Mine & EMD Plant',
    pilot: false,
    district: 'Bhandara',
    state: 'Maharashtra',
    center: [21.550, 79.700],
    zoom: 14,
    type: 'Opencast Pit & Chemical Plant',
    capacity_tpd: 12000,
    elevation_m: 290,
    geological_formation: 'Mansar Stage (Cryptomelane & Pyrolusite)',
    mineralization_trend: 'E-W Strike, Overturned Syncline',
    description: 'High-grade electrolytic manganese dioxide (EMD) grade ore source with massive opencast bench mining.',
    zones: [
      {
        id: 'dong-Pit-01',
        name: 'Central Opencast Bench Sector',
        color: '#10B981',
        priority: 'HIGH',
        probability: 94,
        center: [21.552, 79.702],
        coordinates: [
          [21.556, 79.696], [21.559, 79.706], [21.550, 79.712], [21.545, 79.700]
        ],
        geological_formation: 'Cryptomelane Supergene Ore Body',
        indicators: [
          'High-purity peroxide manganese oxide suitable for battery chemical EMD',
          'Direct pit bench exposure along southern wall'
        ],
        recommendation: 'Advance bench pushback toward eastern boundary.'
      },
      {
        id: 'dong-North-03',
        name: 'North Valley Prospect',
        color: '#F59E0B',
        priority: 'MEDIUM',
        probability: 68,
        center: [21.562, 79.715],
        coordinates: [
          [21.566, 79.710], [21.570, 79.720], [21.560, 79.725], [21.557, 79.714]
        ],
        geological_formation: 'Quartzite Contact Zone',
        indicators: [
          'Sentinel-2 multispectral iron-manganese index contrast',
          'Drainage sediment anomaly'
        ],
        recommendation: 'Detailed core drilling at 50m intervals.'
      }
    ],
    drill_points: [
      { id: 'DP-D01', lat: 21.553, lng: 79.703, status: 'completed', depth: 95, grade: '51.4% Mn (EMD Grade)' },
      { id: 'DP-D02', lat: 21.563, lng: 79.716, status: 'active', depth: 45, grade: '43.2% Mn' },
      { id: 'DP-D03', lat: 21.548, lng: 79.698, status: 'completed', depth: 110, grade: '47.8% Mn' },
      { id: 'DP-D04', lat: 21.558, lng: 79.708, status: 'completed', depth: 130, grade: '49.0% Mn' }
    ],
    roads: [
      [[21.545, 79.690], [21.552, 79.702], [21.562, 79.715]]
    ]
  },

  {
    id: 'kandri',
    name: 'Kandri Manganese Mine',
    pilot: false,
    district: 'Nagpur',
    state: 'Maharashtra',
    center: [21.417, 79.267],
    zoom: 14,
    type: 'Opencast & Underground',
    capacity_tpd: 8000,
    elevation_m: 305,
    geological_formation: 'Gondite Ore Band (Mansar Formation)',
    mineralization_trend: 'Arcuate Fold Belt',
    description: 'Historic high-grade manganese producer transitioning to deeper underground decline operations.',
    zones: [
      {
        id: 'kan-Main-01',
        name: 'Hilltop Synclinal Band',
        color: '#10B981',
        priority: 'HIGH',
        probability: 91,
        center: [21.419, 79.269],
        coordinates: [
          [21.422, 79.264], [21.425, 79.272], [21.417, 79.276], [21.413, 79.266]
        ],
        geological_formation: 'Braunitic Gondite Lode',
        indicators: [
          'High gravity positive anomaly',
          'Underground level 4 development confirmed ore continuity'
        ],
        recommendation: 'Accelerate shaft deepening and cross-cut development.'
      }
    ],
    drill_points: [
      { id: 'DP-K01', lat: 21.420, lng: 79.270, status: 'completed', depth: 160, grade: '46.5% Mn' },
      { id: 'DP-K02', lat: 21.416, lng: 79.263, status: 'completed', depth: 195, grade: '43.8% Mn' },
      { id: 'DP-K03', lat: 21.423, lng: 79.274, status: 'active', depth: 75, grade: '41.2% Mn' },
      { id: 'DP-K04', lat: 21.414, lng: 79.268, status: 'planned', depth: 140, grade: 'Targeting Gondite' }
    ],
    roads: [
      [[21.410, 79.260], [21.419, 79.269], [21.425, 79.272]]
    ]
  },

  {
    id: 'chikla',
    name: 'Chikla Manganese Mine',
    pilot: false,
    district: 'Bhandara',
    state: 'Maharashtra',
    center: [21.517, 79.750],
    zoom: 14,
    type: 'Underground Mine',
    capacity_tpd: 7500,
    elevation_m: 295,
    geological_formation: 'Sitasaongi & Mansar Formations',
    mineralization_trend: 'EW Strike, Dip 60-70° S',
    description: 'Continuous underground operation with high thermal and ground stability sensor monitoring.',
    zones: [
      {
        id: 'chk-West-01',
        name: 'Chikla-B Underground Block',
        color: '#10B981',
        priority: 'HIGH',
        probability: 88,
        center: [21.519, 79.752],
        coordinates: [
          [21.523, 79.747], [21.526, 79.755], [21.517, 79.759], [21.513, 79.749]
        ],
        geological_formation: 'Manganese Ore Reef & Mica Schist',
        indicators: [
          'High radiometric density contrast',
          'Direct underground sublevel tracking'
        ],
        recommendation: 'Install micro-seismic monitoring arrays.'
      }
    ],
    drill_points: [
      { id: 'DP-C01', lat: 21.520, lng: 79.753, status: 'completed', depth: 220, grade: '45.0% Mn' },
      { id: 'DP-C02', lat: 21.515, lng: 79.746, status: 'completed', depth: 185, grade: '42.6% Mn' },
      { id: 'DP-C03', lat: 21.524, lng: 79.757, status: 'active', depth: 90, grade: '39.8% Mn' }
    ],
    roads: [
      [[21.510, 79.740], [21.519, 79.752]]
    ]
  },

  {
    id: 'tirodi',
    name: 'Tirodi Manganese Mine',
    pilot: false,
    district: 'Balaghat',
    state: 'Madhya Pradesh',
    center: [21.685, 79.725],
    zoom: 14,
    type: 'Opencast Pit',
    capacity_tpd: 6000,
    elevation_m: 315,
    geological_formation: 'Tirodi Gneissic Complex & Gondite',
    mineralization_trend: 'NE-SW Fold Axis',
    description: 'Historic manganese center with major opencast expansion prospects.',
    zones: [
      {
        id: 'tir-North-01',
        name: 'North Tirodi Quarry Bench',
        color: '#10B981',
        priority: 'HIGH',
        probability: 90,
        center: [21.688, 79.728],
        coordinates: [
          [21.692, 79.722], [21.695, 79.732], [21.686, 79.736], [21.681, 79.725]
        ],
        geological_formation: 'Gonditic Manganese Band',
        indicators: [
          'Distinct Landsat-9 band ratio 6/7 anomaly',
          'Exposed gondite reef in existing bench face'
        ],
        recommendation: 'Proceed with blast-hole assay sampling.'
      }
    ],
    drill_points: [
      { id: 'DP-T01', lat: 21.689, lng: 79.729, status: 'completed', depth: 75, grade: '44.2% Mn' },
      { id: 'DP-T02', lat: 21.683, lng: 79.721, status: 'completed', depth: 110, grade: '41.5% Mn' },
      { id: 'DP-T03', lat: 21.693, lng: 79.734, status: 'active', depth: 40, grade: '38.0% Mn' }
    ],
    roads: [
      [[21.680, 79.715], [21.688, 79.728]]
    ]
  }
];

export const navItems = [
  { id: 'command-center', label: 'Command Center', path: '/' },
  { id: 'reserve-intelligence', label: 'Reserve Intelligence', path: '/reserve-intelligence' },
  { id: 'production-forecast', label: 'Production Forecast', path: '/production-forecast' },
  { id: 'risk-analysis', label: 'Risk Analysis', path: '/risk-analysis' },
  { id: 'action-center', label: 'Action Center', path: '/action-center' },
  { id: 'alert-center', label: 'Alert Center', path: '/alert-center' },
];

export const mapLayers = [
  { id: 'satellite', name: 'Satellite Imagery', active: true },
  { id: 'geology', name: 'Geological Strikes', active: true },
  { id: 'ndvi', name: 'NDVI Spectral Alteration', active: false },
  { id: 'soilMoisture', name: 'Soil Moisture (SMAP)', active: false },
  { id: 'lst', name: 'Surface Thermal (LST)', active: false },
  { id: 'drillData', name: 'Drill Core Assays', active: true },
];

export const historicalProduction = [
  { day: 1, date: 'Aug 04', actual: 9850, target: 10000 },
  { day: 2, date: 'Aug 05', actual: 10120, target: 10000 },
  { day: 3, date: 'Aug 06', actual: 9940, target: 10000 },
  { day: 4, date: 'Aug 07', actual: 10200, target: 10000 },
  { day: 5, date: 'Aug 08', actual: 9780, target: 10000 },
  { day: 6, date: 'Aug 09', actual: 10050, target: 10000 },
  { day: 7, date: 'Aug 10', actual: 9920, target: 10000 },
  { day: 8, date: 'Aug 11', actual: 10300, target: 10000 },
  { day: 9, date: 'Aug 12', actual: 10150, target: 10000 },
  { day: 10, date: 'Aug 13', actual: 9890, target: 10000 },
  { day: 11, date: 'Aug 14', actual: 10080, target: 10000 },
  { day: 12, date: 'Aug 15', actual: 9650, target: 10000 },
  { day: 13, date: 'Aug 16', actual: 10100, target: 10000 },
  { day: 14, date: 'Aug 17', actual: 9980, target: 10000 },
];

export const forecastProduction = [
  { day: 1, date: 'Aug 19', predicted: 10050, target: 10000, risk: 'low' },
  { day: 2, date: 'Aug 20', predicted: 9800, target: 10000, risk: 'low' },
  { day: 3, date: 'Aug 21', predicted: 9100, target: 10000, risk: 'medium' },
  { day: 4, date: 'Aug 22', predicted: 7200, target: 10000, risk: 'high' },
  { day: 5, date: 'Aug 23', predicted: 7400, target: 10000, risk: 'high' },
  { day: 6, date: 'Aug 24', predicted: 8100, target: 10000, risk: 'high' },
  { day: 7, date: 'Aug 25', predicted: 9400, target: 10000, risk: 'medium' },
];

export const timelineEvents = [
  { time: 'Day +1', label: 'Nominal Operations', detail: 'Throughput matches daily target capacity.', status: 'normal' },
  { time: 'Day +3', label: 'Telemetry Anomaly Detected', detail: 'Weather / equipment degradation flags onset.', status: 'warning' },
  { time: 'Day +4', label: 'Projected Peak Shortfall', detail: 'Maximum extraction deficit below planned target.', status: 'critical' },
  { time: 'Day +5', label: 'Secondary Bottleneck', detail: 'Haul cycle congestion and bench starving.', status: 'high' },
  { time: 'Day +7', label: 'Target Stabilization', detail: 'Post-intervention throughput normalization.', status: 'warning' },
];
