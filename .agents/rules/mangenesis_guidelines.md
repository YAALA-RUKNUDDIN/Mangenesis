# MANGENESIS Project Invariants & Behavioral Guidelines

## 1. Visual Theme & UI Aesthetic Invariant
- **Palette**: Mineral Beige (`#C7B59F`, `#E8DFD1`, `#D9CBBA`), Warm Sand, and Industrial Graphite Slate / Charcoal Gray (`#0B0D12`, `#131720`, `#1A202C`, `#262F3D`).
- **Strict Prohibition**: Strictly **NO purple, indigo, or violet** themes, gradients, badges, borders, or accents across the codebase.
- **Scope**: All frontend pages, components, charts, popovers, and presentation artifacts.

## 2. Grounded Real-Mine Data Invariant (Zero Dummy Data)
- All data across the project must be grounded in real-world assets:
  1. **6 Real MOIL Mines**: Gumgaon Nagpur (pilot calibration site), Balaghat, Dongri Buzurg, Kandri, Chikla, Tirodi with real geographic coordinates.
  2. **Real Stratigraphy & Assays**: Sausar Group / Mansar Formation / Gondite lithology with physical core drill assay benchmarks (e.g. DP-G01 44.8% Mn grade matching 96% AI confidence).
  3. **Real Space & Environmental Telemetry**: Sentinel-2 SWIR band ratios (11/12), Landsat-9 thermal inertia, NASA GPM precipitation, and SMAP ground soil moisture.
  4. **Real Cost Economics**: Indian Bureau of Mines (IBM) and MOIL FY25 Annual Reports (₹12,500/T Mn ore, ₹94/L industrial diesel, ₹8,500/m diamond core drilling) substantiating ₹15–25 Cr/mine annual savings.
- **Strict Prohibition**: Never use synthetic or placeholder dummy data when real domain physics, models, or formulas apply.

## 3. Plain-English Operational Communication
- When explaining components, architectures, or features, use a simple, structured 4-part framework:
  1. *What is this component?*
  2. *Why is it used?*
  3. *How does it help?*
  4. *Why is it 10x better than doing it manually?*
- Avoid excessive, dense academic jargon to keep explanations accessible for both field engineers and hackathon judges.

## 4. Non-Invasive Documentation Posture
- When preparing cheat sheets, viva Q&A, or presentation materials, do not modify existing, functional website code unless explicitly instructed by the user.
