import { useState } from 'react';
import {
  FileText,
  Download,
  Share2,
  ExternalLink,
  CheckCircle2,
  Calendar,
  Layers,
  TrendingUp,
  AlertTriangle,
  Cpu,
  Eye,
  Loader2,
} from 'lucide-react';
import { useScenario } from '../context/ScenarioContext';
import KPICard from '../components/ui/KPICard';
import Button from '../components/ui/Button';
import StatusBadge from '../components/ui/StatusBadge';
import Modal from '../components/ui/Modal';
import { generateReportPDF } from '../utils/reportPdfGenerator';

export default function ReportsPage() {
  const { activeMineData } = useScenario();
  const [activePreviewReport, setActivePreviewReport] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);
  const [downloadSuccessId, setDownloadSuccessId] = useState(null);

  const handleDownload = async (report) => {
    if (!report || downloadingId) return;
    try {
      setDownloadingId(report.id);
      // Brief pause to allow UI spinner transition
      await new Promise((resolve) => setTimeout(resolve, 350));
      generateReportPDF(report, activeMineData);
      setDownloadSuccessId(report.id);
      setTimeout(() => setDownloadSuccessId(null), 3500);
    } catch (err) {
      console.error('PDF generation failed:', err);
      alert('Failed to generate report PDF. Please check your browser permissions.');
    } finally {
      setDownloadingId(null);
    }
  };

  const reports = [
    {
      id: 'REP-RES-01',
      title: 'Manganese Reserve Assessment & UNFC Classification',
      category: 'Geological Intelligence',
      mine: activeMineData.name || 'Gumgaon Mine',
      period: 'Q3 FY26 • 2026',
      generatedDate: '24 Sep 2026, 18:30 IST',
      status: 'VERIFIED',
      confidence: 91.4,
      summary: 'Ordinary Kriging spatial block estimation for Sausar Group beds. Categorizes 3.1 Mt as UNFC 111 (Measured) and 1.7 Mt as UNFC 122 (Indicated) with Var <= 10 variance thresholds.',
      icon: Layers,
      fileSize: '4.2 MB',
    },
    {
      id: 'REP-PROD-02',
      title: '30-Day Production Trajectory & Continuity Forecast',
      category: 'Operations Planning',
      mine: activeMineData.name || 'Gumgaon Mine',
      period: 'October 2026 Horizon',
      generatedDate: '25 Sep 2026, 08:00 IST',
      status: 'ACTION REQUIRED',
      confidence: 94.6,
      summary: 'Identifies 4.2 kt production gap triggered by Excavator EX-04 maintenance downtime and heavy monsoon haul road clay saturation. Details prescriptive recovery interventions.',
      icon: TrendingUp,
      fileSize: '2.8 MB',
    },
    {
      id: 'REP-RISK-03',
      title: 'Geotechnical & Operational Risk Audit',
      category: 'Risk Intelligence',
      mine: activeMineData.name || 'Gumgaon Mine',
      period: 'Weekly Shift Cycle 38',
      generatedDate: '25 Sep 2026, 12:45 IST',
      status: 'VERIFIED',
      confidence: 89.0,
      summary: 'Multi-horizon matrix evaluating DGMS blasting buffer limits, slope extensometer readings on North Ridge (FoS 1.18), and haul road saturation indices.',
      icon: AlertTriangle,
      fileSize: '3.1 MB',
    },
    {
      id: 'REP-PERF-04',
      title: 'Multi-Mine Fleet Performance & Cycle Time Review',
      category: 'Executive Summary',
      mine: 'MOIL Central Cluster (6 Mines)',
      period: 'Month-to-Date September 2026',
      generatedDate: '24 Sep 2026, 20:00 IST',
      status: 'PUBLISHED',
      confidence: 96.0,
      summary: 'Comparative analysis of extraction velocity across Gumgaon, Balaghat, Chikla, Dongri Buzurg, Mansar, and Tirodi operations.',
      icon: FileText,
      fileSize: '5.6 MB',
    },
    {
      id: 'REP-AI-05',
      title: 'AI Model Validation & Explainability Provenance',
      category: 'Scientific Compliance',
      mine: 'All MOIL Operational Models',
      period: 'Version 2.4 Baseline Audit',
      generatedDate: '20 Sep 2026, 10:15 IST',
      status: 'VERIFIED',
      confidence: 95.8,
      summary: 'Full architectural documentation of Sentinel-2 band ratio algorithms, variogram fitting parameters, and SHAP value feature importance matrices.',
      icon: Cpu,
      fileSize: '6.4 MB',
    },
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto font-sans">
      {/* Console Header */}
      <div className="bg-[#0D111A] border border-[#243046] rounded-[14px] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold font-mono text-white tracking-tight">
              Reports & Compliance Center
            </h1>
            <StatusBadge status="healthy" label="DGMS & UNFC COMPLIANT" size="xs" />
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Official operational dossiers, reserve assessments, and AI validation reports for {activeMineData.name || 'Gumgaon Mine'}.
          </p>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 font-mono">
        {reports.map((rep) => {
          const Icon = rep.icon;
          const isDownloading = downloadingId === rep.id;
          const isSuccess = downloadSuccessId === rep.id;

          return (
            <div
              key={rep.id}
              className="bg-[#0D111A] border border-[#243046] hover:border-amber-500/40 rounded-[16px] p-5 flex flex-col justify-between transition-all space-y-4 shadow-sm"
            >
              <div>
                <div className="flex items-start justify-between gap-2 pb-3 border-b border-[#1C2536]">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-[6px] bg-[#121824] border border-[#243046] text-amber-400">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase">{rep.category}</span>
                      <div className="text-white font-bold text-sm leading-snug line-clamp-1">
                        {rep.title}
                      </div>
                    </div>
                  </div>
                  <StatusBadge
                    status={rep.status === 'VERIFIED' ? 'healthy' : rep.status === 'ACTION REQUIRED' ? 'warning' : 'intelligence'}
                    label={rep.status}
                    size="xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 my-3 text-[11px] text-slate-400">
                  <div>
                    <span className="text-[10px] text-slate-500 block">MINE</span>
                    <span className="text-slate-200">{rep.mine}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">PERIOD</span>
                    <span className="text-slate-200">{rep.period}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">GENERATED</span>
                    <span className="text-slate-200">{rep.generatedDate}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">AI CONFIDENCE</span>
                    <span className="text-emerald-400 font-bold">{rep.confidence}%</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 font-sans leading-relaxed line-clamp-3 bg-[#07090E] p-2.5 rounded-[6px] border border-[#1C2536]">
                  {rep.summary}
                </p>
              </div>

              {/* Action Buttons: View, Download, Export PDF */}
              <div className="pt-3 border-t border-[#1C2536] flex items-center justify-between gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  icon={Eye}
                  onClick={() => setActivePreviewReport(rep)}
                >
                  View
                </Button>

                <div className="flex items-center gap-1.5">
                  <Button
                    size="sm"
                    variant="ghost"
                    icon={isDownloading ? Loader2 : isSuccess ? CheckCircle2 : Download}
                    className={
                      isDownloading
                        ? 'animate-spin text-amber-400'
                        : isSuccess
                        ? 'text-emerald-400'
                        : 'text-slate-400 hover:text-white'
                    }
                    disabled={isDownloading}
                    onClick={() => handleDownload(rep)}
                    title="Download Report PDF"
                  />
                  <Button
                    size="sm"
                    variant="primary"
                    disabled={isDownloading}
                    icon={isDownloading ? Loader2 : isSuccess ? CheckCircle2 : undefined}
                    className={isDownloading ? '[&_svg]:animate-spin' : ''}
                    onClick={() => handleDownload(rep)}
                  >
                    {isDownloading
                      ? 'Exporting...'
                      : isSuccess
                      ? 'Exported!'
                      : 'Export PDF'}
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Report Preview Modal */}
      {activePreviewReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setActivePreviewReport(null)}
          />
          <div className="relative bg-[#0D111A] border border-[#243046] rounded-[16px] max-w-2xl w-full p-6 space-y-5 font-mono text-xs z-10 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#1C2536]">
              <div>
                <span className="text-[10px] text-amber-400 uppercase font-bold">
                  {activePreviewReport.id} • OFFICIAL DOSSIER
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  {activePreviewReport.title}
                </h3>
              </div>
              <Button size="sm" variant="ghost" onClick={() => setActivePreviewReport(null)}>
                Close
              </Button>
            </div>

            <div className="space-y-3 font-sans text-slate-300 leading-relaxed text-sm">
              <div className="bg-[#121824] p-3 rounded-[8px] border border-[#1C2536] font-mono text-xs space-y-1">
                <div><strong>Target Mine:</strong> {activePreviewReport.mine}</div>
                <div><strong>Reporting Horizon:</strong> {activePreviewReport.period}</div>
                <div><strong>Algorithmic Confidence:</strong> {activePreviewReport.confidence}%</div>
                <div><strong>Status:</strong> {activePreviewReport.status}</div>
              </div>
              <p>{activePreviewReport.summary}</p>
              <p className="text-xs text-slate-400">
                This document conforms to statutory reporting requirements of the Ministry of Steel and MOIL Limited, incorporating verified Sentinel-2 multispectral reflectance and 3D Ordinary Kriging block data.
              </p>
            </div>

            <div className="pt-3 border-t border-[#1C2536] flex items-center justify-end gap-3 font-mono">
              <Button size="sm" variant="secondary" onClick={() => setActivePreviewReport(null)}>
                Close Preview
              </Button>
              <Button
                size="sm"
                variant="primary"
                disabled={downloadingId === activePreviewReport.id}
                icon={
                  downloadingId === activePreviewReport.id
                    ? Loader2
                    : downloadSuccessId === activePreviewReport.id
                    ? CheckCircle2
                    : Download
                }
                className={downloadingId === activePreviewReport.id ? '[&_svg]:animate-spin' : ''}
                onClick={() => handleDownload(activePreviewReport)}
              >
                {downloadingId === activePreviewReport.id
                  ? 'Generating PDF...'
                  : downloadSuccessId === activePreviewReport.id
                  ? 'PDF Downloaded!'
                  : 'Download Signed PDF'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

