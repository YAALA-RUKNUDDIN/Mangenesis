import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers,
  Box,
  Sparkles,
  Activity,
  CheckCircle2,
  Sliders,
  Maximize2,
  Compass,
} from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import RealLifeGeological3D from '../components/3d/RealLifeGeological3D';
import OriginCard from '../components/ui/OriginCard';
import { useScenario } from '../context/ScenarioContext';

export default function ReserveIntelligence() {
  const { activeMineData } = useScenario();
  const [selectedZone, setSelectedZone] = useState(null);

  return (
    <PageLayout
      title="Subsurface Reserve Intelligence"
      subtitle={`Volumetric ore body modeling, diamond drill core lithology, and UNFC resource confidence for ${activeMineData.name}.`}
      className="p-6 lg:p-8 max-w-[1700px] mx-auto"
    >
      {/* Spacious High-Level Executive Metrics (OriginKit / Lightwind Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <OriginCard
          glowColor="rgba(199, 181, 159, 0.2)"
          borderColor="rgba(199, 181, 159, 0.3)"
          className="p-6"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
              Proven Reserves
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold">
              UNFC 111
            </span>
          </div>
          <div className="text-3xl font-extrabold font-mono text-white mt-3">
            4.82 <span className="text-lg font-normal text-slate-400">MT</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Confirmed via 6 diamond core stations
          </p>
        </OriginCard>

        <OriginCard
          glowColor="rgba(168, 85, 247, 0.2)"
          borderColor="rgba(168, 85, 247, 0.3)"
          className="p-6"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
              Mean Mn Grade
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30 font-bold">
              METALLURGICAL
            </span>
          </div>
          <div className="text-3xl font-extrabold font-mono text-purple-300 mt-3">
            44.8<span className="text-lg font-normal text-purple-400/80">%</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Braunite & Pyrolusite dominant ore
          </p>
        </OriginCard>

        <OriginCard
          glowColor="rgba(6, 182, 212, 0.2)"
          borderColor="rgba(6, 182, 212, 0.3)"
          className="p-6"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
              Strip Ratio
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-bold">
              OPTIMAL
            </span>
          </div>
          <div className="text-3xl font-extrabold font-mono text-white mt-3">
            1 : 4.2
          </div>
          <p className="text-xs text-slate-400 mt-2">
            m³ waste per tonne of extracted ore
          </p>
        </OriginCard>

        <OriginCard
          glowColor="rgba(245, 158, 11, 0.2)"
          borderColor="rgba(245, 158, 11, 0.3)"
          className="p-6"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
              Strike Extension
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold">
              EXPANDING
            </span>
          </div>
          <div className="text-3xl font-extrabold font-mono text-white mt-3">
            1,450 <span className="text-lg font-normal text-slate-400">m</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            +80m eastward extension at DH-106
          </p>
        </OriginCard>
      </div>

      {/* Expansive Real-Life 3D Geological Explorer Viewport */}
      <div className="w-full">
        <RealLifeGeological3D
          height="680px"
          selectedZone={selectedZone}
          onSelectZone={setSelectedZone}
        />
      </div>

      {/* Spacious Bottom Geological Details Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <OriginCard className="p-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-white/10 mb-4">
            <Box size={18} className="text-[#C7B59F]" />
            <h3 className="text-sm font-bold font-mono uppercase text-white tracking-wider">
              Geological Lithology
            </h3>
          </div>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-white/5 text-slate-300">
              <span className="text-slate-400">Regional Stratigraphy:</span>
              <span className="font-semibold text-white">{activeMineData.geological_formation}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-white/5 text-slate-300">
              <span className="text-slate-400">Major Host Rocks:</span>
              <span className="text-slate-200 font-mono">Muscovite-Biotite Schist, Quartzite</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-white/5 text-slate-300">
              <span className="text-slate-400">Basement Complex:</span>
              <span className="text-slate-200 font-mono">Tirodi Biotite Gneiss & Gondite</span>
            </div>
            <div className="flex justify-between pt-1.5 text-slate-300">
              <span className="text-slate-400">Deformation Phase:</span>
              <span className="text-emerald-400 font-mono font-bold">F2 Isoclinal Folding</span>
            </div>
          </div>
        </OriginCard>

        <OriginCard className="p-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-white/10 mb-4">
            <Layers size={18} className="text-cyan-400" />
            <h3 className="text-sm font-bold font-mono uppercase text-white tracking-wider">
              Multi-Band Remote Sensing
            </h3>
          </div>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-white/5 text-slate-300">
              <span className="text-slate-400">Sentinel-2 MSI:</span>
              <span className="text-cyan-300 font-mono">Ferrous Iron Ratio (B12/B8A)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-white/5 text-slate-300">
              <span className="text-slate-400">ISRO RISAT-1A:</span>
              <span className="text-cyan-300 font-mono">C-band Polarimetric SAR</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-white/5 text-slate-300">
              <span className="text-slate-400">NASA GPM Core:</span>
              <span className="text-cyan-300 font-mono">0.1° Gridded Precipitation</span>
            </div>
            <div className="flex justify-between pt-1.5 text-slate-300">
              <span className="text-slate-400">Geophysical Survey:</span>
              <span className="text-emerald-400 font-mono font-bold">Deep TEM Conductance</span>
            </div>
          </div>
        </OriginCard>

        <OriginCard className="p-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-white/10 mb-4">
            <Sparkles size={18} className="text-purple-400" />
            <h3 className="text-sm font-bold font-mono uppercase text-white tracking-wider">
              AI Prognosis & Target Extension
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Spatial regression of multispectral alteration indices paired with deep diamond drill assays indicates a <strong>14.2% prospective increase</strong> in mineable Braunite reserves in the eastern sector.
          </p>
          <div className="mt-4 p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-between text-xs">
            <span className="text-purple-300 font-mono">Exploration Target Status</span>
            <span className="font-mono font-bold text-white px-2 py-0.5 rounded bg-purple-500/20">
              DRILL READY
            </span>
          </div>
        </OriginCard>
      </div>
    </PageLayout>
  );
}
