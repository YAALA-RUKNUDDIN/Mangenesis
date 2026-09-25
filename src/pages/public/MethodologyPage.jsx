import { Link } from 'react-router-dom';
import {
  Database,
  Filter,
  Cpu,
  Layers,
  TrendingUp,
  AlertTriangle,
  CheckSquare,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import Button from '../../components/ui/Button';

export default function MethodologyPage() {
  const sections = [
    {
      step: '01',
      title: 'Multi-Source Data Ingestion',
      icon: Database,
      summary: 'Aggregating structured and unstructured subsurface & space telemetry.',
      details: [
        'Drilling core assay databases (depth, lithology, composite % Mn, Fe, SiO2, P2O5).',
        'Copernicus Sentinel-2 Level-2A surface reflectance (10m & 20m bands B2, B3, B4, B8, B11, B12).',
        'NASA SRTM digital elevation models for slope, aspect, and hydrological drainage flow paths.',
        'Real-time SCADA equipment telemetry (haul truck dispatch, excavator cycle time, engine load).',
        'Open-Meteo & IMD localized meteorological feeds (cumulative precipitation, soil moisture %).',
      ],
    },
    {
      step: '02',
      title: 'Geochemical & Spectral Feature Engineering',
      icon: Filter,
      summary: 'Deriving physical indicators directly linked to manganese mineralization.',
      details: [
        'Manganese spectral response proxy using SWIR band ratios (Band 11 / Band 12).',
        'Iron oxide & gossan index (Band 4 / Band 2) to identify manganiferous cap weathering.',
        'Normalized Difference Vegetation Index (NDVI) anomaly masking for mineral alteration zones.',
        'Thermal inertia & Land Surface Temperature (LST) mapping for subsurface rock density differentials.',
      ],
    },
    {
      step: '03',
      title: '3D Ordinary Kriging & UNFC Classification',
      icon: Layers,
      summary: 'Geostatistical spatial interpolation with quantified estimation variance.',
      details: [
        'Experimental variogram modeling (spherical & exponential models) fitted to directional continuity.',
        'Spatial interpolation into discrete 50m x 50m x 15m extraction blocks.',
        'Kriging variance (σ²) mapping to establish resource confidence thresholds.',
        'Automated categorization: UNFC 111 (Measured, σ² ≤ 10), UNFC 122 (Indicated, σ² ≤ 30), UNFC 333 (Inferred, σ² > 30).',
      ],
    },
    {
      step: '04',
      title: 'Time-Series Forecasting & Shortfall Horizon',
      icon: TrendingUp,
      summary: 'Hybrid ensemble forecasting extraction output across a 30-day horizon.',
      details: [
        'Multi-factor forecasting accounting for bench availability, ore blend constraints, and shift capacity.',
        'Dynamic rainfall risk penalties based on haul road clay plasticity and drainage velocity.',
        'Upper and lower 95% confidence intervals reflecting geological and operational uncertainty.',
        'Automated trigger when forecasted output drops below monthly statutory MOIL quota.',
      ],
    },
    {
      step: '05',
      title: 'Prescriptive Decision & Closed-Loop Action Protocol',
      icon: CheckSquare,
      summary: 'Translating predictive warnings into verified operational interventions.',
      details: [
        'Targeted equipment reallocation recommendations (e.g., shifting excavators from waste to high-grade faces).',
        'Infill drilling proposals with optimal coordinate pinning to convert Inferred (333) into Measured (111) reserves.',
        'Lifecycle state tracking (Pending → Accepted → Assigned → In Progress → Completed) with full audit logging.',
      ],
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[6px] bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
          <span>SCIENTIFIC ARCHITECTURE & VERIFICATION</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-mono">
          The MANGENESIS Methodology
        </h1>
        <p className="text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          How Mangenesis connects earth observation, geostatistical kriging, time-series machine learning, and closed-loop operational decision support.
        </p>
      </div>

      {/* Sections List */}
      <div className="space-y-8">
        {sections.map((sec) => {
          const Icon = sec.icon;
          return (
            <div
              key={sec.step}
              className="bg-[#0D111A] border border-[#243046] rounded-[16px] p-6 sm:p-8 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[#1C2536] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[8px] bg-[#121824] border border-[#243046] flex items-center justify-center text-amber-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-amber-400 uppercase font-bold">
                      STAGE {sec.step}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-white font-mono">
                      {sec.title}
                    </h2>
                  </div>
                </div>
              </div>

              <p className="text-sm text-slate-300 font-medium">{sec.summary}</p>

              <div className="bg-[#07090E] p-4 rounded-[10px] border border-[#1C2536] space-y-2">
                <div className="text-[11px] font-mono uppercase text-slate-500 tracking-wider mb-2">
                  Technical Specifications & Algorithms:
                </div>
                {sec.details.map((d, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed font-mono">
                    <span className="text-amber-400 mt-0.5">•</span>
                    <span>{d}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="text-center pt-8 border-t border-[#1C2536]">
        <h3 className="text-2xl font-bold text-white font-mono mb-4">
          Experience the pipeline in the live command environment
        </h3>
        <Link to="/app/reserve-intelligence">
          <Button variant="primary" size="lg" iconRight={ArrowRight}>
            Launch Reserve Intelligence Console
          </Button>
        </Link>
      </div>
    </div>
  );
}
