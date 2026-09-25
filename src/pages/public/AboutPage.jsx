import { Link } from 'react-router-dom';
import { Shield, Award, Users, CheckCircle2, ArrowRight } from 'lucide-react';
import Button from '../../components/ui/Button';

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[6px] bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-mono">
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span>SMART INDIA HACKATHON 2026 • SIH26009</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-mono">
          About MANGENESIS
        </h1>
        <p className="text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Developed to solve problem statement SIH26009 for the Ministry of Steel and MOIL Limited.
        </p>
      </div>

      <div className="bg-[#0D111A] border border-[#243046] rounded-[16px] p-8 space-y-6">
        <h2 className="text-2xl font-bold text-white font-mono">The SIH26009 Mandate</h2>
        <div className="text-sm text-slate-300 leading-relaxed space-y-4">
          <p>
            Manganese is an indispensable critical mineral for India’s steel manufacturing and electric vehicle battery supply chains. MOIL Limited, a Schedule-A Miniratna CPSE, meets a major portion of India’s domestic manganese requirements through its open-cast and underground mines in Maharashtra and Madhya Pradesh.
          </p>
          <p>
            However, operational challenges including complex structural folding, fragmented drillhole records, unpredictable monsoonal disruptions, and equipment bottlenecks often lead to production shortfalls.
          </p>
          <p>
            <strong>MANGENESIS</strong> addresses this by uniting space technology (Copernicus Sentinel-2, SAR, LST), 3D geostatistical Ordinary Kriging, predictive machine learning, and prescriptive operational workflows into a single executive dashboard.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#1C2536]">
          <div className="bg-[#121824] p-4 rounded-[8px] border border-[#1C2536]">
            <div className="text-xs text-amber-400 font-mono font-semibold mb-1">Target Beneficiary</div>
            <div className="text-white text-sm font-bold">MOIL Limited & Ministry of Steel</div>
          </div>
          <div className="bg-[#121824] p-4 rounded-[8px] border border-[#1C2536]">
            <div className="text-xs text-sky-400 font-mono font-semibold mb-1">Standard Implemented</div>
            <div className="text-white text-sm font-bold">UNFC 1997 / 2009 Classification</div>
          </div>
        </div>
      </div>

      <div className="text-center pt-4">
        <Link to="/app">
          <Button variant="primary" size="lg" iconRight={ArrowRight}>
            Enter MANGENESIS Intelligence Platform
          </Button>
        </Link>
      </div>
    </div>
  );
}
