"""
MANGENESIS - MOIL Enterprise Configuration
SIH26009: AI/ML and Space Technology to Identify Manganese Reserves & Overcome Production Shortfalls
Ministry of Steel | MOIL Ltd.
"""

from typing import Dict, Any, List

# Full MOIL Mines Network Registry (Maharashtra & Madhya Pradesh)
MINES: Dict[str, Dict[str, Any]] = {
    "gumgaon": {
        "id": "gumgaon",
        "name": "Gumgaon Manganese Mine",
        "pilot": True,
        "district": "Nagpur",
        "state": "Maharashtra",
        "lat": 21.1550,
        "lon": 79.0900,
        "type": "Underground & Opencast",
        "capacity_tpd": 10000,
        "elevation_m": 312,
        "geological_formation": "Sausar Group (Gondite Series)",
        "mineralization_trend": "ENE-WSW Dip 65° SE",
        "description": "Pilot reference site for AI model calibration and multi-spectral space telemetry.",
        "zones": [
            {
                "id": "gum-A-12",
                "name": "Sector A-12 (North Ridge)",
                "color": "#10B981",
                "priority": "HIGH",
                "probability": 96,
                "center": [21.158, 79.095],
                "coordinates": [
                    [21.160, 79.090], [21.165, 79.095], [21.162, 79.102], [21.156, 79.098]
                ],
                "geological_formation": "Mansar Schist & Gondite",
                "elevation_m": 315,
                "slope_deg": 14.5,
                "distance_to_known_deposit_km": 0.4,
                "drill_proximity_score": 0.94,
                "indicators": [
                    "High multispectral NDVI alteration signature",
                    "Strong thermal inertia indicating dense gondite body",
                    "Adjacent to productive exploratory core DP-G01"
                ],
                "recommendation": "Immediate priority: dispatch diamond core drilling rig for 120m depth assay."
            },
            {
                "id": "gum-D-09",
                "name": "Sector D-09 (South Flank)",
                "color": "#10B981",
                "priority": "HIGH",
                "probability": 95,
                "center": [21.148, 79.082],
                "coordinates": [
                    [21.152, 79.078], [21.155, 79.085], [21.147, 79.090], [21.143, 79.081]
                ],
                "geological_formation": "Chorbaoli Quartzite Contact",
                "elevation_m": 298,
                "slope_deg": 18.2,
                "distance_to_known_deposit_km": 0.6,
                "drill_proximity_score": 0.88,
                "indicators": [
                    "Sentinel-2 Band 11/12 shortwave infrared anomaly",
                    "Structural shear zone parallel to main lode"
                ],
                "recommendation": "Conduct trench sampling and magnetic susceptibility survey."
            },
            {
                "id": "gum-B-07",
                "name": "Sector B-07 (East Extension)",
                "color": "#F59E0B",
                "priority": "MEDIUM",
                "probability": 63,
                "center": [21.151, 79.112],
                "coordinates": [
                    [21.156, 79.106], [21.159, 79.115], [21.150, 79.120], [21.145, 79.110]
                ],
                "geological_formation": "Lohangi Marble & Calciphyre",
                "elevation_m": 305,
                "slope_deg": 8.0,
                "distance_to_known_deposit_km": 1.2,
                "drill_proximity_score": 0.61,
                "indicators": [
                    "Moderate magnetic gradient",
                    "Partial surface overburden masking spectral reflection"
                ],
                "recommendation": "Deep electrical resistivity tomography (ERT) profiling recommended."
            },
            {
                "id": "gum-C-03",
                "name": "Sector C-03 (West Boundary)",
                "color": "#64748B",
                "priority": "LOW",
                "probability": 22,
                "center": [21.162, 79.072],
                "coordinates": [
                    [21.167, 79.066], [21.171, 79.075], [21.164, 79.080], [21.158, 79.070]
                ],
                "geological_formation": "Tirodi Biotite Gneiss Basement",
                "elevation_m": 285,
                "slope_deg": 5.5,
                "distance_to_known_deposit_km": 2.8,
                "drill_proximity_score": 0.22,
                "indicators": [
                    "Barren granitic gneiss bedrock",
                    "Negligible manganese mineralization signatures"
                ],
                "recommendation": "Deprioritize ground exploration; retain as mine infrastructure buffer."
            }
        ],
        "drill_points": [
            {"id": "DP-G01", "lat": 21.159, "lng": 79.096, "status": "completed", "depth": 145, "grade": "44.8% Mn"},
            {"id": "DP-G02", "lat": 21.149, "lng": 79.083, "status": "active", "depth": 88, "grade": "42.1% Mn"},
            {"id": "DP-G03", "lat": 21.153, "lng": 79.114, "status": "completed", "depth": 160, "grade": "38.4% Mn"},
            {"id": "DP-G04", "lat": 21.155, "lng": 79.088, "status": "completed", "depth": 180, "grade": "46.2% Mn"},
            {"id": "DP-G05", "lat": 21.163, "lng": 79.074, "status": "planned", "depth": 120, "grade": "Targeting Reef"}
        ],
        "roads": [
            [[21.145, 79.060], [21.150, 79.080], [21.158, 79.095], [21.165, 79.110]],
            [[21.140, 79.090], [21.148, 79.082], [21.155, 79.090]]
        ]
    },

    "balaghat": {
        "id": "balaghat",
        "name": "Balaghat Manganese Mine",
        "pilot": False,
        "district": "Balaghat",
        "state": "Madhya Pradesh",
        "lat": 21.8120,
        "lon": 80.1880,
        "type": "Deep Underground (Asia's Deepest)",
        "capacity_tpd": 14000,
        "elevation_m": 330,
        "geological_formation": "Bharweli-Ukwa Ore Belt (Mansar Formation)",
        "mineralization_trend": "NE-SW Strike, Steep Dip 70° NW",
        "description": "MOIL's flagship and largest producing manganese asset with ultra-deep shaft extraction.",
        "zones": [
            {
                "id": "bal-North-01",
                "name": "Bharweli Deep Shaft Zone",
                "color": "#10B981",
                "priority": "HIGH",
                "probability": 98,
                "center": [21.815, 80.192],
                "coordinates": [
                    [21.818, 80.186], [21.822, 80.194], [21.816, 80.200], [21.810, 80.190]
                ],
                "geological_formation": "Braunitic High-Grade Manganese Reef",
                "elevation_m": 335,
                "slope_deg": 12.0,
                "distance_to_known_deposit_km": 0.2,
                "drill_proximity_score": 0.98,
                "indicators": [
                    "High grade pyrolusite/braunite contact (>48% Mn assay)",
                    "Subsurface seismic continuity to 650m depth",
                    "Strong electromagnetic conductor along shear axis"
                ],
                "recommendation": "Expand Level 18 exploration cross-cuts and advance underground diamond drill."
            },
            {
                "id": "bal-East-04",
                "name": "Hirapur Extension Target",
                "color": "#10B981",
                "priority": "HIGH",
                "probability": 89,
                "center": [21.808, 80.205],
                "coordinates": [
                    [21.812, 80.200], [21.815, 80.210], [21.805, 80.215], [21.801, 80.204]
                ],
                "geological_formation": "Quartzite-Manganese Breccia Band",
                "elevation_m": 322,
                "slope_deg": 15.0,
                "distance_to_known_deposit_km": 0.8,
                "drill_proximity_score": 0.85,
                "indicators": [
                    "Landsat-9 SWIR hydrothermal alteration corridor",
                    "Historical surface pit assay confirmed 41.5% Mn"
                ],
                "recommendation": "Surface incline drilling scheduled for Q3 FY27."
            },
            {
                "id": "bal-West-02",
                "name": "Garra Sector Flank",
                "color": "#F59E0B",
                "priority": "MEDIUM",
                "probability": 58,
                "center": [21.820, 80.175],
                "coordinates": [
                    [21.825, 80.170], [21.828, 80.180], [21.818, 80.185], [21.814, 80.174]
                ],
                "geological_formation": "Phyllite & Schist Host",
                "elevation_m": 310,
                "slope_deg": 9.5,
                "distance_to_known_deposit_km": 1.5,
                "drill_proximity_score": 0.54,
                "indicators": [
                    "Moderate magnetic signature",
                    "Thick alluvium cover requiring deep probing"
                ],
                "recommendation": "Execute gravity-magnetic grid survey."
            }
        ],
        "drill_points": [
            {"id": "DP-B01", "lat": 21.816, "lng": 80.193, "status": "completed", "depth": 420, "grade": "49.2% Mn"},
            {"id": "DP-B02", "lat": 21.809, "lng": 80.206, "status": "active", "depth": 210, "grade": "45.1% Mn"},
            {"id": "DP-B03", "lat": 21.821, "lng": 80.176, "status": "planned", "depth": 350, "grade": "Targeting Reef"},
            {"id": "DP-B04", "lat": 21.813, "lng": 80.185, "status": "completed", "depth": 510, "grade": "48.0% Mn"}
        ],
        "roads": [
            [[21.805, 80.170], [21.812, 80.188], [21.822, 80.194]],
            [[21.812, 80.188], [21.808, 80.205]]
        ]
    },

    "dongri_buzurg": {
        "id": "dongri_buzurg",
        "name": "Dongri Buzurg Mine & EMD Plant",
        "pilot": False,
        "district": "Bhandara",
        "state": "Maharashtra",
        "lat": 21.5500,
        "lon": 79.7000,
        "type": "Opencast Pit & Chemical Plant",
        "capacity_tpd": 12000,
        "elevation_m": 290,
        "geological_formation": "Mansar Stage (Cryptomelane & Pyrolusite)",
        "mineralization_trend": "E-W Strike, Overturned Syncline",
        "description": "High-grade electrolytic manganese dioxide (EMD) grade ore source with massive opencast bench mining.",
        "zones": [
            {
                "id": "dong-Pit-01",
                "name": "Central Opencast Bench Sector",
                "color": "#10B981",
                "priority": "HIGH",
                "probability": 94,
                "center": [21.552, 79.702],
                "coordinates": [
                    [21.556, 79.696], [21.559, 79.706], [21.550, 79.712], [21.545, 79.700]
                ],
                "geological_formation": "Cryptomelane Supergene Ore Body",
                "elevation_m": 295,
                "slope_deg": 22.0,
                "distance_to_known_deposit_km": 0.1,
                "drill_proximity_score": 0.95,
                "indicators": [
                    "High-purity peroxide manganese oxide suitable for battery chemical EMD",
                    "Direct pit bench exposure along southern wall"
                ],
                "recommendation": "Advance bench pushback toward eastern boundary."
            },
            {
                "id": "dong-North-03",
                "name": "North Valley Prospect",
                "color": "#F59E0B",
                "priority": "MEDIUM",
                "probability": 68,
                "center": [21.562, 79.715],
                "coordinates": [
                    [21.566, 79.710], [21.570, 79.720], [21.560, 79.725], [21.557, 79.714]
                ],
                "geological_formation": "Quartzite Contact Zone",
                "elevation_m": 280,
                "slope_deg": 11.0,
                "distance_to_known_deposit_km": 1.1,
                "drill_proximity_score": 0.65,
                "indicators": [
                    "Sentinel-2 multispectral iron-manganese index contrast",
                    "Drainage sediment anomaly"
                ],
                "recommendation": "Detailed core drilling at 50m intervals."
            }
        ],
        "drill_points": [
            {"id": "DP-D01", "lat": 21.553, "lng": 79.703, "status": "completed", "depth": 95, "grade": "51.4% Mn (EMD Grade)"},
            {"id": "DP-D02", "lat": 21.563, "lng": 79.716, "status": "active", "depth": 45, "grade": "43.2% Mn"},
            {"id": "DP-D03", "lat": 21.548, "lng": 79.698, "status": "completed", "depth": 110, "grade": "47.8% Mn"},
            {"id": "DP-D04", "lat": 21.558, "lng": 79.708, "status": "completed", "depth": 130, "grade": "49.0% Mn"}
        ],
        "roads": [
            [[21.545, 79.690], [21.552, 79.702], [21.562, 79.715]]
        ]
    },

    "kandri": {
        "id": "kandri",
        "name": "Kandri Manganese Mine",
        "pilot": False,
        "district": "Nagpur",
        "state": "Maharashtra",
        "lat": 21.4170,
        "lon": 79.2670,
        "type": "Opencast & Underground",
        "capacity_tpd": 8000,
        "elevation_m": 305,
        "geological_formation": "Gondite Ore Band (Mansar Formation)",
        "mineralization_trend": "Arcuate Fold Belt",
        "description": "Historic high-grade manganese producer transitioning to deeper underground decline operations.",
        "zones": [
            {
                "id": "kan-Main-01",
                "name": "Hilltop Synclinal Band",
                "color": "#10B981",
                "priority": "HIGH",
                "probability": 91,
                "center": [21.419, 79.269],
                "coordinates": [
                    [21.422, 79.264], [21.425, 79.272], [21.417, 79.276], [21.413, 79.266]
                ],
                "geological_formation": "Braunitic Gondite Lode",
                "elevation_m": 310,
                "slope_deg": 16.0,
                "distance_to_known_deposit_km": 0.3,
                "drill_proximity_score": 0.90,
                "indicators": [
                    "High gravity positive anomaly",
                    "Underground level 4 development confirmed ore continuity"
                ],
                "recommendation": "Accelerate shaft deepening and cross-cut development."
            }
        ],
        "drill_points": [
            {"id": "DP-K01", "lat": 21.420, "lng": 79.270, "status": "completed", "depth": 160, "grade": "46.5% Mn"},
            {"id": "DP-K02", "lat": 21.416, "lng": 79.263, "status": "completed", "depth": 195, "grade": "43.8% Mn"},
            {"id": "DP-K03", "lat": 21.423, "lng": 79.274, "status": "active", "depth": 75, "grade": "41.2% Mn"},
            {"id": "DP-K04", "lat": 21.414, "lng": 79.268, "status": "planned", "depth": 140, "grade": "Targeting Gondite"}
        ],
        "roads": [
            [[21.410, 79.260], [21.419, 79.269], [21.425, 79.272]]
        ]
    },

    "chikla": {
        "id": "chikla",
        "name": "Chikla Manganese Mine",
        "pilot": False,
        "district": "Bhandara",
        "state": "Maharashtra",
        "lat": 21.5170,
        "lon": 79.7500,
        "type": "Underground Mine",
        "capacity_tpd": 7500,
        "elevation_m": 295,
        "geological_formation": "Sitasaongi & Mansar Formations",
        "mineralization_trend": "EW Strike, Dip 60-70° S",
        "description": "Continuous underground operation with high thermal and ground stability sensor monitoring.",
        "zones": [
            {
                "id": "chk-West-01",
                "name": "Chikla-B Underground Block",
                "color": "#10B981",
                "priority": "HIGH",
                "probability": 88,
                "center": [21.519, 79.752],
                "coordinates": [
                    [21.523, 79.747], [21.526, 79.755], [21.517, 79.759], [21.513, 79.749]
                ],
                "geological_formation": "Manganese Ore Reef & Mica Schist",
                "elevation_m": 298,
                "slope_deg": 13.0,
                "distance_to_known_deposit_km": 0.4,
                "drill_proximity_score": 0.86,
                "indicators": [
                    "High radiometric density contrast",
                    "Direct underground sublevel tracking"
                ],
                "recommendation": "Install micro-seismic monitoring arrays."
            }
        ],
        "drill_points": [
            {"id": "DP-C01", "lat": 21.520, "lng": 79.753, "status": "completed", "depth": 220, "grade": "45.0% Mn"},
            {"id": "DP-C02", "lat": 21.515, "lng": 79.746, "status": "completed", "depth": 185, "grade": "42.6% Mn"},
            {"id": "DP-C03", "lat": 21.524, "lng": 79.757, "status": "active", "depth": 90, "grade": "39.8% Mn"}
        ],
        "roads": [
            [[21.510, 79.740], [21.519, 79.752]]
        ]
    },

    "tirodi": {
        "id": "tirodi",
        "name": "Tirodi Manganese Mine",
        "pilot": False,
        "district": "Balaghat",
        "state": "Madhya Pradesh",
        "lat": 21.6850,
        "lon": 79.7250,
        "type": "Opencast Pit",
        "capacity_tpd": 6000,
        "elevation_m": 315,
        "geological_formation": "Tirodi Gneissic Complex & Gondite",
        "mineralization_trend": "NE-SW Fold Axis",
        "description": "Historic manganese center with major opencast expansion prospects.",
        "zones": [
            {
                "id": "tir-North-01",
                "name": "North Tirodi Quarry Bench",
                "color": "#10B981",
                "priority": "HIGH",
                "probability": 90,
                "center": [21.688, 79.728],
                "coordinates": [
                    [21.692, 79.722], [21.695, 79.732], [21.686, 79.736], [21.681, 79.725]
                ],
                "geological_formation": "Gonditic Manganese Band",
                "elevation_m": 320,
                "slope_deg": 17.5,
                "distance_to_known_deposit_km": 0.3,
                "drill_proximity_score": 0.89,
                "indicators": [
                    "Distinct Landsat-9 band ratio 6/7 anomaly",
                    "Exposed gondite reef in existing bench face"
                ],
                "recommendation": "Proceed with blast-hole assay sampling."
            }
        ],
        "drill_points": [
            {"id": "DP-T01", "lat": 21.689, "lng": 79.729, "status": "completed", "depth": 75, "grade": "44.2% Mn"},
            {"id": "DP-T02", "lat": 21.683, "lng": 79.721, "status": "completed", "depth": 110, "grade": "41.5% Mn"},
            {"id": "DP-T03", "lat": 21.693, "lng": 79.734, "status": "active", "depth": 40, "grade": "38.0% Mn"}
        ],
        "roads": [
            [[21.680, 79.715], [21.688, 79.728]]
        ]
    }
}

DEFAULT_MINE_ID = "gumgaon"

# Equipment Fleets by Mine
EQUIPMENT_FLEETS: Dict[str, List[Dict[str, Any]]] = {
    "gumgaon": [
        {"id": "EXC-04", "type": "Hydraulic Excavator (3.5m³)", "capacity_tph": 450, "zone": "gum-A-12", "status": "DEGRADED", "health": 58},
        {"id": "EXC-07", "type": "Hydraulic Excavator (2.8m³)", "capacity_tph": 380, "zone": "gum-B-07", "status": "OPERATIONAL", "health": 92},
        {"id": "DMP-02", "type": "Haul Dumper (45T)", "capacity_tph": 200, "zone": "gum-A-12", "status": "OPERATIONAL", "health": 88},
        {"id": "DMP-05", "type": "Haul Dumper (45T)", "capacity_tph": 200, "zone": "gum-B-07", "status": "OPERATIONAL", "health": 85},
        {"id": "DRL-01", "type": "Rotary Blast Hole Drill", "capacity_tph": 150, "zone": "gum-A-12", "status": "OPERATIONAL", "health": 94},
        {"id": "BLD-03", "type": "Track Dozer (240HP)", "capacity_tph": 300, "zone": "gum-C-03", "status": "OPERATIONAL", "health": 90}
    ],
    "balaghat": [
        {"id": "WND-01", "type": "Mine Hoist Winder (10T Skip)", "capacity_tph": 600, "zone": "bal-North-01", "status": "OPERATIONAL", "health": 95},
        {"id": "LHD-03", "type": "Underground LHD Loader", "capacity_tph": 320, "zone": "bal-North-01", "status": "OPERATIONAL", "health": 89},
        {"id": "JUM-02", "type": "Electro-Hydraulic Drill Jumbo", "capacity_tph": 220, "zone": "bal-East-04", "status": "OPERATIONAL", "health": 91}
    ],
    "dongri_buzurg": [
        {"id": "EXC-11", "type": "Heavy Pit Excavator (5.0m³)", "capacity_tph": 580, "zone": "dong-Pit-01", "status": "OPERATIONAL", "health": 93},
        {"id": "DMP-14", "type": "Articulated Dumper (60T)", "capacity_tph": 280, "zone": "dong-Pit-01", "status": "OPERATIONAL", "health": 87}
    ],
    "kandri": [
        {"id": "EXC-02", "type": "Excavator (2.5m³)", "capacity_tph": 350, "zone": "kan-Main-01", "status": "OPERATIONAL", "health": 90}
    ],
    "chikla": [
        {"id": "LHD-01", "type": "Underground Loader", "capacity_tph": 300, "zone": "chk-West-01", "status": "OPERATIONAL", "health": 94}
    ],
    "tirodi": [
        {"id": "EXC-09", "type": "Pit Excavator (3.0m³)", "capacity_tph": 400, "zone": "tir-North-01", "status": "OPERATIONAL", "health": 88}
    ]
}

# Operational Scenarios
SCENARIOS: Dict[str, Dict[str, Any]] = {
    "normal": {
        "id": "normal",
        "label": "Normal Operations",
        "description": "Optimal operational telemetry under nominal conditions.",
        "shortfall_risk": 18.0,
        "risk_level": "LOW",
        "production_factor": 1.02,
        "expected_gap_factor": 0.0,
        "primary_cause": "None (Nominal Performance)",
        "weather_override": {"rainfall_mm": 2.5, "soil_moisture_pct": 32.0},
        "equipment_downtime_hours": 0.5,
        "blasting_delay_hours": 0.0,
        "risk_drivers": [
            {"name": "Routine Wear", "percentage": 42, "color": "#64748B"},
            {"name": "Minor Traffic Delay", "percentage": 30, "color": "#3B82F6"},
            {"name": "Weather Variability", "percentage": 28, "color": "#10B981"}
        ]
    },
    "equipment_failure": {
        "id": "equipment_failure",
        "label": "Equipment Failure (Excavator Down)",
        "description": "Primary bench extraction machine hydraulic failure causing throughput bottleneck.",
        "shortfall_risk": 84.0,
        "risk_level": "HIGH",
        "production_factor": 0.78,
        "expected_gap_factor": 0.22,
        "primary_cause": "Primary Excavator Hydraulic Breakdown",
        "weather_override": {"rainfall_mm": 5.0, "soil_moisture_pct": 36.0},
        "equipment_downtime_hours": 6.5,
        "blasting_delay_hours": 0.5,
        "risk_drivers": [
            {"name": "Equipment Downtime", "percentage": 58, "color": "#EF4444"},
            {"name": "Haul Queue Congestion", "percentage": 24, "color": "#F59E0B"},
            {"name": "Weather Factors", "percentage": 18, "color": "#3B82F6"}
        ]
    },
    "heavy_rainfall": {
        "id": "heavy_rainfall",
        "label": "Heavy Monsoon Precipitation",
        "description": "Intense monsoon downpour saturating haul roads and pit floor.",
        "shortfall_risk": 91.0,
        "risk_level": "CRITICAL",
        "production_factor": 0.65,
        "expected_gap_factor": 0.35,
        "primary_cause": "Road Saturation & Inundation Risk",
        "weather_override": {"rainfall_mm": 68.4, "soil_moisture_pct": 82.5},
        "equipment_downtime_hours": 2.0,
        "blasting_delay_hours": 3.0,
        "risk_drivers": [
            {"name": "Haul Road Saturation", "percentage": 64, "color": "#EF4444"},
            {"name": "Pit Floor Inundation", "percentage": 26, "color": "#F59E0B"},
            {"name": "Equipment Slippage", "percentage": 10, "color": "#3B82F6"}
        ]
    },
    "blasting_delay": {
        "id": "blasting_delay",
        "label": "Explosive Clearance Delay",
        "description": "Delayed DGMS magazine clearance and weather safety holding blast.",
        "shortfall_risk": 68.0,
        "risk_level": "MEDIUM",
        "production_factor": 0.84,
        "expected_gap_factor": 0.16,
        "primary_cause": "Bench Blasting & Fragment Clearance Delay",
        "weather_override": {"rainfall_mm": 12.0, "soil_moisture_pct": 44.0},
        "equipment_downtime_hours": 1.0,
        "blasting_delay_hours": 4.5,
        "risk_drivers": [
            {"name": "Blasting Clearance", "percentage": 52, "color": "#F59E0B"},
            {"name": "Shovel Idling", "percentage": 30, "color": "#EF4444"},
            {"name": "Haul Redirection", "percentage": 18, "color": "#3B82F6"}
        ]
    }
}
