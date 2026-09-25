import { Link } from 'react-router-dom';
import { Cpu, Server, Globe, Database, Shield, Zap, ArrowRight, Code } from 'lucide-react';
import Button from '../../components/ui/Button';

export default function TechnologyPage() {
  const stack = [
    {
      category: 'Geospatial & Remote Sensing',
      tech: 'Sentinel-2 MSI, NASA SRTM, Leaflet GIS, Esri World Dark Gray CDN',
      desc: 'High-precision multi-spectral earth observation processing surface reflectance, NDVI alteration, and topographic slope models.',
    },
    {
      category: 'Geostatistics & Block Modeling',
      tech: 'Python Scipy, PyKrige, 3D Ordinary Kriging, UNFC 1997/2009 Standards',
      desc: 'Discrete volumetric estimation interpolating manganese grade percentages with variogram estimation variance gates.',
    },
    {
      category: 'Predictive & Time-Series AI',
      tech: 'FastAPI, XGBoost, Prophet, Scikit-Learn, SHAP Explainability',
      desc: 'Ensemble models calculating production trajectories, shortfall risk probabilities, and feature contribution drivers.',
    },
    {
      category: 'Frontend & Operational UI',
      tech: 'React 19, Vite, Tailwind CSS, Lucide Icons, Recharts',
      desc: 'High information-density dark-mode enterprise cockpit engineered for zero cognitive fatigue and scannable decisions.',
    },
    {
      category: 'Data Persistence & Audit Log',
      tech: 'Supabase PostgreSQL, PostGIS, Immutable State Transition Log',
      desc: 'Enterprise relational store managing multi-mine metadata, drillhole databases, equipment SCADA, and action audit records.',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[6px] bg-sky-500/10 border border-sky-500/25 text-sky-300 text-xs font-mono">
          <Cpu className="w-3.5 h-3.5 text-sky-400" />
          <span>FULL-STACK ENTERPRISE ARCHITECTURE</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-mono">
          Technology & Systems Architecture
        </h1>
        <p className="text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Built for low-latency inference, zero-watermark geospatial rendering, and fault-tolerant multi-mine deployment across MOIL extraction clusters.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stack.map((item, idx) => (
          <div
            key={item.category}
            className="bg-[#0D111A] border border-[#243046] rounded-[16px] p-6 space-y-3"
          >
            <span className="text-[10px] font-mono text-amber-400 uppercase font-bold">
              MODULE 0{idx + 1}
            </span>
            <h3 className="text-lg font-bold text-white font-mono">{item.category}</h3>
            <div className="text-xs font-mono text-sky-400 bg-[#121824] px-3 py-1.5 rounded-[6px] border border-[#1C2536]">
              {item.tech}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#0A0D14] border border-[#1C2536] rounded-[16px] p-8 text-center space-y-4">
        <h3 className="text-xl font-bold text-white font-mono">
          Verify Live Pipeline Health & Latency
        </h3>
        <p className="text-xs text-slate-400 max-w-xl mx-auto">
          Our Data Health console provides transparent latency metrics, coverage statistics, and data quality scoring for every active pipeline.
        </p>
        <Link to="/app/data-health">
          <Button variant="primary" size="md" iconRight={ArrowRight}>
            Inspect Data Health Console
          </Button>
        </Link>
      </div>
    </div>
  );
}
