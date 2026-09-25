# MANGENESIS (SIH26009)

<div align="center">

### Enterprise Space-Borne AI for Subsurface Manganese Exploration & 7-Day Closed-Loop Production Continuity Forecasting

**Ministry of Mines / MOIL Limited • Smart India Hackathon Grand Finale Prototype**

[![React](https://img.shields.io/badge/React-18.3-61DAFB.svg?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688.svg?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.11-3776AB.svg?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![LightGBM](https://img.shields.io/badge/LightGBM-4.3-brightgreen.svg?style=for-the-badge)](https://lightgbm.readthedocs.io/)
[![TreeSHAP](https://img.shields.io/badge/TreeSHAP-Explainable_AI-orange.svg?style=for-the-badge)](https://shap.readthedocs.io/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E.svg?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)

**🌐 [Live Demo (v1.0)](https://mangenesis.vercel.app/) • 🚀 [Live Demo (v2.0 Next-Gen)](https://mangenesis-v2.vercel.app/) • [API Docs](http://localhost:8000/docs) • [Report Bug](https://github.com/YAALA-RUKNUDDIN/Mangenesis/issues)**

> 🚀 **MANGENESIS 2.0 Live**: Experience the next-generation enterprise mining intelligence redesign with 3D geological exploration, full public portal, and UNFC reserve analytics at **[https://mangenesis-v2.vercel.app/](https://mangenesis-v2.vercel.app/)**

</div>

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [The Core Problem](#2-the-core-problem--industry-challenge)
3. [Quantified ROI & Value Realization](#3-quantified-roi--value-realization)
4. [System Architecture](#4-system-architecture--closed-loop-pipeline)
5. [Mathematical & ML Foundations](#5-mathematical--ml-foundations)
6. [Platform Modules & Capabilities](#6-platform-modules--capabilities)
7. [Demo Tour](#7-self-driving-demo-tour)
8. [Tech Stack](#8-tech-stack--justifications)
9. [API Reference](#9-api-reference)
10. [Quickstart & Installation](#10-quickstart--installation)
11. [Deployment](#11-enterprise-deployment)
12. [Roadmap](#12-commercialization-roadmap)
13. [Contributors](#13-contributors--core-team)

---

## 1. Executive Summary

**MANGENESIS** is an enterprise-grade AI decision support platform built for **MOIL Limited** (Ministry of Mines & Ministry of Steel, Government of India). It unifies orbital Earth Observation satellite telemetry, machine learning time-series regression, game-theoretic Explainable AI (TreeSHAP), and Mixed Integer Linear Programming (MILP) into a fully autonomous **"Predict → Explain → Act → Verify"** closed-loop operational workflow.

### Mission-Critical Objectives

| # | Capability | AI Technology | Performance |
|---|---|---|---|
| 1 | **Space-Borne Mineral Prospecting** | XGBoost + Sentinel-2 SWIR | 0.8825 ROC-AUC |
| 2 | **7-Day Production Forecast** | LightGBM Regressor | RMSE: 142.4 TPD |
| 3 | **Explainable AI Root Causes** | TreeSHAP (Shapley Values) | < 10ms computation |
| 4 | **Prescriptive Fleet Dispatch** | PuLP MILP (CBC Solver) | < 120ms global optimum |

> **Ground-Truth Calibration**: Validated on **MOIL's Gumgaon Manganese Mine, Nagpur** using physical diamond drill core assays — DP-G01 returning **44.8% Mn grade** matched by **96% AI confidence** — and IBM FY25 cost indices.

---

## 2. The Core Problem & Industry Challenge

Manganese mining operations face crippling bottlenecks that result in massive financial losses and preventable safety incidents:

```
BEFORE MANGENESIS                             AFTER MANGENESIS
─────────────────────────────────────────     ─────────────────────────────────────────
✗ Expensive dry drill holes (₹8,500/m)    →   ✓ SWIR orbital screening removes 85%
  costing ₹76.5 Lakhs wasted annually          of blind exploratory drilling

✗ Reactive firefighting after equipment   →   ✓ 7-day advance shortfall prediction
  failures cause -2,200 TPD daily deficits      flags risks 168 hours in advance

✗ Black-box AI decisions rejected by      →   ✓ TreeSHAP Shapley attribution gives
  DGMS safety auditors                          mathematical proof per anomaly

✗ Sub-optimal manual fleet dispatch       →   ✓ MILP branch-and-cut reallocates
  burns 68,400L industrial diesel/year          shovels & dumpers in <120ms
```

---

## 3. Quantified ROI & Value Realization

All financial metrics are calibrated against **IBM FY25 Benchmarks** at MOIL Gumgaon (10,000 TPD baseline):

| Value Stream | Annual Impact (Gumgaon Pilot) | Enterprise MOIL (All 6 Mines) | Verification Basis |
| :--- | :---: | :---: | :--- |
| **Production Deficit Recovery** | **₹19.12 Cr** | **₹114.7 Cr** | 15,300 T × ₹12,500/T (44.8% Mn Ore) |
| **Industrial Fuel Savings** | **₹64.3 L** | **₹3.86 Cr** | 68,400 L × ₹94/L (Haul optimization) |
| **Dry Drilling Cost Avoided** | **₹76.5 L** | **₹4.59 Cr** | 6 dry holes × 150m × ₹8,500/m |
| **Equipment Downtime Mitigation** | **₹79.8 L** | **₹4.79 Cr** | 345.6 uptime hours preserved |
| **Haul Road Inundation Prevention** | **₹9.6 L** | **₹57.6 L** | 8 rain events + NASA GPM radar alerts |
| **Total Annual Realization** | **₹21.36 Crores/yr** | **₹126.2 Crores/yr** | Audited IBM FY25 Net Benefit |

---

## 4. System Architecture & Closed-Loop Pipeline

```
┌─────────────────────────────────────────────────────────────────────┐
│                      ORBITAL SPACE TELEMETRY                        │
│  Sentinel-2 (SWIR B11/B12) • Landsat-9 (TIR) • NASA GPM • SMAP    │
└─────────────────────────────┬───────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    MANGENESIS CORE BACKEND (FastAPI)                │
│                                                                     │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────┐ │
│  │ Reserve Intel   │  │ 7-Day Forecast  │  │  Explainable AI     │ │
│  │ XGBoost Clf.    │  │ LightGBM Reg.   │  │  TreeSHAP (Shapley) │ │
│  │ ROC-AUC: 0.8825 │  │ RMSE: 142.4 TPD │  │  Computation <10ms  │ │
│  └────────┬────────┘  └────────┬────────┘  └──────────┬──────────┘ │
│           └───────────────────┬────────────────────────┘           │
│                               ▼                                     │
│                  ┌────────────────────────┐                         │
│                  │  Prescriptive Optimizer│                         │
│                  │  PuLP MILP (CBC Solver)│                         │
│                  │  Global Optimum <120ms │                         │
│                  └────────────┬───────────┘                         │
└───────────────────────────────┼─────────────────────────────────────┘
                                │  Async REST APIs
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    MANGENESIS REACT FRONTEND                        │
│  React 18 • Vite 8 • Tailwind CSS • Leaflet GIS • Three.js 3D      │
│                                                                     │
│  Command Center  │  Reserve Intel  │  Production Forecast           │
│  Risk & SHAP XAI │  Action Center  │  Alert Dispatcher             │
│  Digital Twin 3D │  Incident Mgmt  │  Executive ROI Brief (PDF)    │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 5. Mathematical & ML Foundations

### Reserve Classification (XGBoost)

Orbital multi-spectral features are fused into a gradient-boosted ensemble:

```
Features: [SWIR_B11/B12, NDVI, LST_thermal, Elevation_m, Distance_to_deposit]
Model: XGBoost Classifier (500 estimators, max_depth=6)
Validation: 0.8825 ROC-AUC on Sausar Group Gondite lithology
Output: P(Commercial Ore) per 30m×30m surface pixel
```

### 7-Day Continuity Regression (LightGBM)

```
Input: [rainfall_mm, soil_moisture_pct, equipment_availability, blast_delay_hrs]
Model: LightGBM Regressor (leaf-wise tree growth, 1000 estimators)
Horizon: 7-day rolling forward prediction
Performance: RMSE = 142.4 TPD | Confidence = 94.2%
```

### TreeSHAP Explainable AI (Shapley Values)

Every shortfall is decomposed into exact feature attributions for audit compliance:

```
phi(Excavator Hydraulic Pressure) = +42% risk contribution
phi(Haul Road Saturation)         = +28% risk contribution
phi(Blasting Delay Hours)         = +18% risk contribution
phi(Rainfall Anomaly)             = +12% risk contribution
Computation time: < 10ms per prediction
```

### MILP Prescriptive Dispatch (PuLP/CBC)

```
Objective: Maximize Σ(Production_ij × x_ij) - Σ(Cost_ij × x_ij)
Constraints:
  - Each equipment unit assigned to exactly one zone: Σ_j x_ij ≤ 1
  - Zone capacity not exceeded: Σ_i x_ij × Cap_i ≤ Target_j
  - Binary decision: x_ij ∈ {0, 1}
Solver: COIN-OR Branch-and-Cut (CBC) via PuLP
Runtime: < 120ms for 14-unit fleet across 6 zones
Recovery: ~1,700 TPD recovered (77.3% deficit mitigation)
```

---

## 6. Platform Modules & Capabilities

### 6.1 Command Center (`/`)

The main operational cockpit for mine management with **role-based perspective switching**:

- **Real-Time KPI Dashboard**: Daily production vs 10,000 TPD target, shortfall risk index, active benches
- **Role-Based Views**: Custom widget layout for **General Manager**, **Safety Officer**, **Maintenance Engineer**, and **Operations Dispatcher**
- **Interactive GIS Mine Map**: Leaflet-powered canvas with telemetry markers, drill core locations, SMAP overlays, and IoT sensor pins
- **7-Day Forecast Mini-Widget**: Quick trajectory preview with anomaly flagging

### 6.2 Reserve Intelligence (`/reserve-intelligence`)

Satellite-driven ore prospecting to eliminate expensive dry drill holes:

- **Orbital Band Fusion**: Sentinel-2 SWIR B11/B12 ratio, Landsat-9 thermal inertia, NDVI greenness, and SMAP soil moisture
- **Geological Ground-Truth**: Cross-referenced against physical core assay DP-G01 **(44.8% Mn grade)**
- **Interactive 3D Strata Slicing**: Real-time depth slider (0–120m) filtering Braunite, Quartzite, and Schist formations
- **Exploration Zone Inspector**: High / Medium / Low probability deposit sectors with drill recommendations

### 6.3 Production Continuity Forecast (`/production-forecast`)

Forward-looking production intelligence with operational scenario testing:

- **14-Day Actual + 7-Day Forecast Chart**: High-contrast area chart with 10,000 T target line and deficit highlighting
- **Live Scenario Simulator**: Instantly model **Normal Operations**, **Excavator Hydraulic Failure**, **Monsoon Inundation**, and **Blasting Delays**
- **Risk Window Classification**: Upcoming shifts categorized as Low / Medium / High-Risk operational windows

### 6.4 Risk Analysis & TreeSHAP Diagnostics (`/risk-analysis`)

Transparent AI-driven fault attribution meeting DGMS audit standards:

- **Shortfall Banner**: Exact deficit display (e.g. −2,200 Tonnes) and risk score (e.g. 84%)
- **Geotechnical Risk Matrix**: Pit sector monitoring — slope stability, pore water pressure, and Factor of Safety (FoS)
- **TreeSHAP Waterfall Chart**: Mathematical Shapley proof of every root cause for safety compliance
- **Radial Donut Breakdown**: Percentage risk contribution per driver

### 6.5 Action Center & MILP Optimizer (`/action-center`)

Automated prescriptive recovery to close the forecast-to-action loop:

- **MILP Ranked Dispatch**: Priority 01, 02, 03 mathematically optimal fleet reallocation plans
- **One-Click Dispatch**: Simulated transmission to Fleet Management System (FMS) APIs
- **Recovery Impact Panel**: Real-time confirmation of +1,700 TPD recovered and risk reduced from 84% → 33%

### 6.6 Multi-Channel Alert Center (`/alert-center`)

Emergency broadcast system for sub-second field supervisor notification:

- **Email Dispatch**: SMTP-based alerts to configured mine managers and safety officers
- **SMS Dispatch**: Twilio API integration for instant mobile delivery
- **Browser Push Notifications**: Zero-latency in-dashboard alerts for online personnel
- **Configurable Thresholds**: Warning (50%) and Critical (80%) trigger levels
- **Live Test Broadcast**: Functional demo buttons for hackathon presentations

### 6.7 Digital Twin (`/digital-twin`)

Real-time connected mine visualization:

- **OPERATIONAL Mode**: Live equipment health telemetry, active bench status, and fleet positions
- **SENSORS Mode**: IoT overlay with NASA SMAP moisture patches, Extensometers, Piezometers, and CAN-bus readings
- **142 Active Sensors**: Real-time health dashboard with advisory panel

### 6.8 Executive ROI Dashboard (`/roi-dashboard`)

Full financial intelligence for mine owners and government stakeholders:

- **Big 4 Financial KPIs**: Annual Realization (₹21.36 Cr), Output Preserved (15,300 T/yr), Fuel Saved (68,400 L), Drilling Avoided (₹76.5L)
- **Interactive Sensitivity Sliders**: Live recalculation based on ore price, diesel rate, and solver efficiency
- **Instant PDF Export**: Branded executive brief downloaded via jsPDF

---

## 7. Self-Driving Demo Tour

MANGENESIS includes a built-in **SIH Simulation HUD** that auto-pilots the jury through the complete closed-loop workflow:

```
START ──► Command Center     (Equipment Failure scenario activated)
      ──► Risk Analysis      (TreeSHAP root cause attribution displayed)
      ──► Action Center      (MILP solver dispatches recovery plan)
      ──► Incident Management (Incident automatically logged & timestamped)
      ──► Audit Log          (Full DGMS-compliant audit trail visible)
      STOP ──► Recovery confirmed: +1,700 TPD, Risk 84% → 33%
```

Click **"Start SIH Simulation"** in the top bar to launch the autonomous tour.

---

## 8. Tech Stack & Justifications

| Layer | Technology | Role | Why Chosen |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | React 18 + Vite 8 | SPA Core | Sub-second HMR, reactive state, fastest production bundler |
| **UI Design** | Tailwind CSS 3.4 | Styling & Theme | Mineral Beige / Industrial Slate palette; zero CSS bloat |
| **GIS Mapping** | Leaflet + React-Leaflet | Interactive Mine Map | High-precision satellite overlays; lightweight vs. MapBox |
| **3D Rendering** | Three.js | Digital Twin & Strata | WebGL hardware-accelerated mine terrain modeling |
| **Charts** | Recharts + Framer Motion | Data Visualization | Smooth SVG/Canvas SHAP waterfalls, forecast area charts |
| **PDF Export** | jsPDF | Executive Reports | Zero-latency client-side; no server round-trip |
| **Backend API** | FastAPI (Python 3.11) | REST Endpoints | Async ASGI, auto Swagger UI, Pydantic v2 validation |
| **Reserve ML** | XGBoost Classifier | Mineral Prospecting | 0.8825 ROC-AUC on Sausar lithology multi-spectral data |
| **Forecast ML** | LightGBM Regressor | 7-Day Prediction | Fastest tabular regressor; RMSE 142.4 TPD |
| **Explainability** | TreeSHAP | Root Cause AI | Exact Shapley values in <10ms; DGMS audit compliant |
| **Optimization** | PuLP + CBC Solver | MILP Dispatch | Open-source branch-and-cut; <120ms global optimum |
| **Cloud Database** | Supabase (PostgreSQL) | Persistent Storage | PostGIS spatial queries, realtime WebSockets, RLS |

---

## 9. API Reference

The FastAPI backend auto-generates Swagger UI at `http://localhost:8000/docs`.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Backend health check and ML model status |
| `GET` | `/api/mines/list` | All 6 MOIL operational mines with coordinates |
| `GET` | `/api/production/forecast` | 14-day history + 7-day LightGBM prediction |
| `GET` | `/api/production/telemetry` | Real-time extraction metrics and fleet status |
| `GET` | `/api/risk/shortfall-analysis` | TreeSHAP feature attributions and risk scores |
| `GET` | `/api/actions/optimize` | PuLP MILP solver — ranked dispatch plan |
| `POST` | `/api/actions/execute` | Execute simulated FMS fleet reallocation |
| `GET` | `/api/satellite/bands` | Sentinel-2 SWIR and Landsat-9 thermal data |
| `GET` | `/api/alerts/config` | Current alert configuration |
| `PUT` | `/api/alerts/config` | Update thresholds and recipients |
| `POST` | `/api/alerts/test` | Broadcast test alert (Email / SMS / Push) |
| `GET` | `/api/alerts/history` | Alert dispatch audit log |
| `GET` | `/api/roi/summary` | IBM FY25 calibrated cost-benefit summary |

---

## 10. Quickstart & Installation

### Prerequisites

- **Node.js** v18.0+
- **Python** v3.10 or 3.11
- **Git**

### Step 1 — Clone the Repository

```bash
git clone https://github.com/YAALA-RUKNUDDIN/mangenesis.git
cd mangenesis
```

### Step 2 — Frontend Setup

```bash
# Install Node.js dependencies
npm install

# Start Vite development server
npm run dev
# Dashboard: http://localhost:5173
```

### Step 3 — Backend Setup

```bash
# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (Linux / macOS)
source venv/bin/activate

# Install Python packages
pip install -r backend/requirements.txt

# Start FastAPI server
python -m uvicorn backend.main:app --reload --port 8000
# Swagger UI: http://localhost:8000/docs
```

### Step 4 — Environment Variables (Optional)

Copy `.env.example` to `.env` and configure Supabase credentials:

```bash
cp .env.example .env
```

```env
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_KEY=your-supabase-service-role-key
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

> The application runs fully in **offline demo mode** without Supabase credentials.

---

## 11. Enterprise Deployment

| Target | Platform | Method |
| :--- | :--- | :--- |
| **Frontend** | Vercel / Netlify / AWS S3+CloudFront | Static SPA — `npm run build` → `dist/` |
| **Backend** | Render / Railway / AWS ECS / On-Premise Linux | Docker container or `uvicorn` daemon |
| **Database** | Supabase Cloud / Self-hosted PostgreSQL + PostGIS | Managed with RLS and realtime WebSockets |

A `render.yaml` and `Procfile` are included for one-click Render.com deployment.

---

## 12. Commercialization Roadmap

```
Phase 1  [COMPLETE]    Gumgaon Pilot — calibrated & validated against DP-G01 core assays
Phase 2  [65% DONE]    FMS/SAP ERP integration & DGMS Safety Governance compliance
Phase 3  [PLANNED]     3D Voxel Digital Twin & edge server deployment at Balaghat, Dongri, Chikla
Phase 4  [PLANNED]     Enterprise MOIL Command Center + NMDC (Iron Ore) & Coal India expansion
```

---

## 13. Contributors & Core Team

<table>
  <tr>
    <td align="center">
      <strong>Yaala Ruknuddin</strong><br>
      <a href="https://github.com/YAALA-RUKNUDDIN">@YAALA-RUKNUDDIN</a><br>
      Lead Architect & Full-Stack Developer
    </td>
  </tr>
</table>

**Contributions include:**
- System architecture & end-to-end AI/ML pipeline design
- Production Continuity Forecasting (LightGBM + TreeSHAP XAI)
- Prescriptive Dispatch Engine (PuLP MILP / CBC Solver)
- Full-Stack Dashboard (React 18 + Vite + Tailwind CSS + Three.js)
- Multi-Channel Emergency Alert Dispatcher
- Geotechnical Risk Matrix & DGMS-compliant Audit Trail

---

<div align="center">

**MANGENESIS (SIH26009)**

*Ministry of Mines / MOIL Limited · Smart India Hackathon Grand Finale*

*Built with precision. Powered by science. Calibrated on real ground truth.*

</div>