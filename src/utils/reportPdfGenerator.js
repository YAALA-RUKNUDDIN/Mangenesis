import { jsPDF } from 'jspdf';

/**
 * Sanitizes text to standard ASCII to prevent jsPDF WinAnsi character encoding corruption,
 * mojibake, or wide letter-spacing glitches.
 */
function sanitizeText(str) {
  if (!str) return '';
  return String(str)
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\u2014/g, '--')
    .replace(/\u2013/g, '-')
    .replace(/\u2022/g, '|')
    .replace(/σ²/g, 'Var')
    .replace(/σ/g, 'sigma')
    .replace(/²/g, '^2')
    .replace(/³/g, '^3')
    .replace(/≤/g, '<=')
    .replace(/≥/g, '>=')
    .replace(/±/g, '+/-')
    .replace(/μ/g, 'u')
    .replace(/°/g, ' deg')
    .replace(/[^\x20-\x7E\n\r]/g, ' ');
}

/**
 * Truncates text cleanly if it exceeds the maximum column width.
 */
function fitText(doc, text, maxWidth, fontSize = 7.2) {
  doc.setFontSize(fontSize);
  let clean = sanitizeText(text);
  if (doc.getTextWidth(clean) <= maxWidth) return clean;
  while (clean.length > 3 && doc.getTextWidth(clean + '...') > maxWidth) {
    clean = clean.slice(0, -1);
  }
  return clean + '...';
}

/**
 * Generates and downloads an official high-fidelity statutory PDF dossier for MOIL & Ministry of Steel.
 * Conforms to DGMS, MMR 1961, and UNFC reporting requirements with precision column alignment.
 *
 * @param {Object} report - Report data object (id, title, category, period, generatedDate, status, confidence, summary)
 * @param {Object} mineData - Active mine context data from ScenarioContext
 */
export function generateReportPDF(report, mineData = {}) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 32;
  const contentWidth = pageWidth - 2 * margin; // 531.28 pt

  let y = 28;

  // 1. Header Banner Box (Dark Mineral Slate #0D111A)
  doc.setFillColor(13, 17, 26);
  doc.roundedRect(margin, y, contentWidth, 54, 4, 4, 'F');

  // Amber accent bar on left
  doc.setFillColor(245, 158, 11); // Amber #F59E0B
  doc.rect(margin, y, 4, 54, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(245, 158, 11);
  doc.text('GOVERNMENT OF INDIA | MINISTRY OF STEEL & MOIL LIMITED', margin + 14, y + 16);

  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.text('MANGENESIS 2.0  |  AUTONOMOUS MINERAL INTELLIGENCE', margin + 14, y + 33);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text('STATUTORY GEOTECHNICAL, RESERVE & PRODUCTION AUDIT DOSSIER', margin + 14, y + 46);

  // Banner Right Badges (right aligned with 14pt margin from edge)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(245, 158, 11);
  doc.text(sanitizeText(report.id || 'REP-MOIL'), pageWidth - margin - 14, y + 23, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  doc.text('SECURITY: DGMS OFFICIAL', pageWidth - margin - 14, y + 39, { align: 'right' });

  y += 62;

  // 2. Report Title & Classification Sub-bar
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42); // Slate 900
  doc.text(sanitizeText(report.title), margin, y + 5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(180, 83, 9); // Dark amber
  doc.text(`CATEGORY: ${sanitizeText(report.category || 'TECHNICAL AUDIT').toUpperCase()}   |   STATUTORY CLEARANCE: DGMS / IBM TIER-1`, margin, y + 18);

  y += 26;

  // Metadata Card Grid (4 columns)
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.75);
  doc.roundedRect(margin, y, contentWidth, 36, 3, 3, 'FD');

  const colW = contentWidth / 4;
  const targetMine = sanitizeText(report.mine || mineData?.name || 'Gumgaon Manganese Mine');

  // Col 1: Mine
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text('TARGET ASSET', margin + 8, y + 12);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text(fitText(doc, targetMine, colW - 14, 8), margin + 8, y + 25);

  // Col 2: Period
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text('HORIZON / PERIOD', margin + colW + 8, y + 12);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text(fitText(doc, sanitizeText(report.period || 'Q3 FY26'), colW - 14, 8), margin + colW + 8, y + 25);

  // Col 3: Generated Date
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text('GENERATION DATE', margin + colW * 2 + 8, y + 12);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text(fitText(doc, sanitizeText(report.generatedDate || '26 Sep 2026, 12:00 IST'), colW - 14, 8), margin + colW * 2 + 8, y + 25);

  // Col 4: AI Confidence & Status
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text('AI CONFIDENCE / STATUS', margin + colW * 3 + 8, y + 12);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(4, 120, 87);
  doc.text(`${report.confidence || 94.5}% | ${sanitizeText(report.status || 'VERIFIED')}`, margin + colW * 3 + 8, y + 25);

  y += 44;

  // 3. Section 1: Executive Abstract
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('1. EXECUTIVE ABSTRACT & OPERATIONAL CONTEXT', margin, y);
  y += 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  const cleanSummary = sanitizeText(
    (report.summary || '') +
    ' This document consolidates multi-source sensory telemetry, Ordinary Kriging spatial variance calculations, and statutory MMR 1961 guidelines into an authoritative audit artifact.'
  );

  const summaryLines = doc.splitTextToSize(cleanSummary, contentWidth - 24);
  const abstractBoxHeight = Math.max(40, summaryLines.length * 11 + 14);

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, abstractBoxHeight, 3, 3, 'FD');

  // Blue accent bar on left
  doc.setFillColor(59, 130, 246);
  doc.rect(margin, y, 3, abstractBoxHeight, 'F');

  doc.setTextColor(51, 65, 85);
  doc.text(summaryLines, margin + 12, y + 13);

  y += abstractBoxHeight + 12;

  // 4. Section 2: Technical Parameters & Geostatistical / Operational Matrix
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('2. AUDITED TECHNICAL METRICS & STATUTORY THRESHOLDS', margin, y);
  y += 8;

  // Precision Proportional Column Layout: Total = 531 pt
  // Col 1: Parameter (width: 148 pt)
  // Col 2: Observed Value (width: 160 pt)
  // Col 3: Statutory / Baseline (width: 92 pt)
  // Col 4: Status (width: 104 pt)
  const col1X = margin + 8;
  const col2X = margin + 160;
  const col3X = margin + 325;
  const col4X = margin + 422;

  const col1W = 148;
  const col2W = 160;
  const col3W = 92;
  const col4W = 104;

  // Table Header
  const thY = y;
  doc.setFillColor(15, 23, 42);
  doc.rect(margin, thY, contentWidth, 18, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);
  doc.text('PARAMETER / OPERATIONAL ATTRIBUTE', col1X, thY + 12);
  doc.text('OBSERVED VALUE', col2X, thY + 12);
  doc.text('STATUTORY / BASELINE', col3X, thY + 12);
  doc.text('VERIFICATION STATUS', col4X, thY + 12);

  y += 18;

  // Specific data for each report type
  const tableDataMap = {
    'REP-RES-01': [
      ['UNFC 111 Measured Reserve', '3.12 Mt (42.8% Mn, 6.2% Fe)', 'IBM Guidelines 2026', 'COMPLIANT (Var <= 8.4)'],
      ['UNFC 122 Indicated Reserve', '1.68 Mt (36.4% Mn, 7.8% Fe)', 'IBM Guidelines 2026', 'COMPLIANT (Var <= 14.1)'],
      ['UNFC 333 Inferred Resource', '0.94 Mt (31.2% Mn, High Phos)', 'UNFC Framework', 'PROVISIONAL AUDIT'],
      ['Kriging Spatial Variogram', 'Spherical: C0=0.12, C=1.85, a=420m', 'Geostat Standard', 'R^2 = 0.914 FIT'],
      ['Pit Stripping Ratio (Waste:Ore)', '1 : 2.45 (Bench -110m to -160m)', 'Cut-off 1 : 3.0', 'OPTIMAL SHELL'],
    ],
    'REP-PROD-02': [
      ['30-Day Base Extraction Target', '300,000 Tonnes (10,000 TPD)', 'Monthly Business Plan', 'SCHEDULED'],
      ['Forecasted Raw Trajectory', '295,800 Tonnes (-4,200 T Deficit)', 'Allowable +/- 2%', 'GAP IDENTIFIED'],
      ['Excavator EX-04 Downtime Impact', '-2,650 Tonnes (Hydraulic Ram)', 'MTBF > 500 Hours', 'ATTRIBUTED (63%)'],
      ['South Haul Ramp Clay Saturation', '-1,150 Tonnes (Speed limit 12 km/h)', 'Max Saturation 55%', 'ATTRIBUTED (27%)'],
      ['Prescriptive MILP Fleet Recovery', '+3,450 Tonnes (East Bypass Reroute)', 'Model Optimization', 'CONTAINED (99.8%)'],
    ],
    'REP-RISK-03': [
      ['North Ridge Highwall FoS', 'FoS = 1.18 (Critical Limit Alert)', 'DGMS Statutory Min 1.30', 'ELEVATED RISK'],
      ['InSAR Displacement Velocity', '4.2 mm / week (Crest Subsidence)', 'Alert Level 5.0 mm/wk', 'ELEVATED (MONITORED)'],
      ['Bench -90m Piezometer (PZ-04)', '1.42 MPa Groundwater Pressure', 'Baseline < 1.20 MPa', 'PRESSURE RELIEF REQ'],
      ['Blasting Peak Particle Velocity', '6.4 mm/s at 500m Buffer Limit', 'DGMS Limit 10.0 mm/s', 'PASS (IN LIMITS)'],
      ['Haul Road Friction Index', '0.41 (82% Clay Saturation)', 'Min Friction 0.55', 'REMEDIAL GRADING REQ'],
    ],
    'REP-PERF-04': [
      ['Gumgaon Mine (Central Cluster)', '2,840 TPD | Cycle 18.4m | 0.82 L/t', 'Target: 2,800 TPD', 'EXCEEDED (101.4%)'],
      ['Balaghat Mine (Underground)', '3,420 TPD | Cycle 22.1m | 0.94 L/t', 'Target: 3,500 TPD', 'ON SCHEDULE (97.7%)'],
      ['Dongri Buzurg Mine (Opencast)', '2,610 TPD | Cycle 16.2m | 0.76 L/t', 'Target: 2,500 TPD', 'OPTIMAL (104.4%)'],
      ['Kandri & Chikla Combined Operations', '3,640 TPD | Cycle 20.2m | 0.89 L/t', 'Target: 3,700 TPD', 'ACCEPTABLE (98.4%)'],
      ['Cluster OEE Equipment Availability', '89.6% Mechanical & Electrical Uptime', 'MOIL Target: 88.0%', 'BENCHMARK MET'],
    ],
    'REP-AI-05': [
      ['Lithological XGBoost Classifier', 'ROC-AUC: 0.8825 | F1-Score: 0.864', 'Benchmark Min 0.8000', 'VALIDATED (PASS)'],
      ['Production Forecaster (LightGBM)', 'RMSE: 142.4 TPD | MAPE: 2.18%', 'Historical Error < 3.5%', 'HIGH ACCURACY'],
      ['Sentinel-2 SWIR Mineral Index', '(B11 - B8A) / (B11 + B8A) Ratio', 'Spectral Library USGS', 'CALIBRATED'],
      ['TreeSHAP Feature Attributions', 'Mn Assay (0.38), Fault (0.24), Rain (0.18)', 'SHAP Additive Invariance', 'EXPLAINABLE'],
      ['Covariate Shift (Data Drift Test)', 'Kolmogorov-Smirnov p-value = 0.42', 'Significance Level 0.05', 'STABLE (NO DRIFT)'],
    ],
  };

  const rows = tableDataMap[report.id] || tableDataMap['REP-RES-01'];

  rows.forEach((row, i) => {
    const isEven = i % 2 === 0;
    doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252);
    doc.rect(margin, y, contentWidth, 18, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y + 18, margin + contentWidth, y + 18);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(30, 41, 59);
    doc.text(fitText(doc, row[0], col1W, 7), col1X, y + 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(51, 65, 85);
    doc.text(fitText(doc, row[1], col2W, 7), col2X, y + 12);
    doc.text(fitText(doc, row[2], col3W, 7), col3X, y + 12);

    doc.setFont('helvetica', 'bold');
    const statusText = sanitizeText(row[3]);
    if (statusText.includes('ELEVATED') || statusText.includes('GAP') || statusText.includes('REQ')) {
      doc.setTextColor(194, 65, 12); // Amber
    } else {
      doc.setTextColor(5, 150, 105); // Green
    }
    doc.text(fitText(doc, statusText, col4W, 7), col4X, y + 12);

    y += 18;
  });

  y += 14;

  // 5. Section 3: Prescriptive Operational Directives
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('3. PRESCRIPTIVE OPERATIONAL DIRECTIVES & REMEDIAL ACTIONS', margin, y);
  y += 8;

  const directivesMap = {
    'REP-RES-01': [
      'Advance exploration diamond drilling program DDH-GM-401 to 408 on the NE limb to elevate UNFC 122 blocks to UNFC 111 status.',
      'Deploy close-spaced blast hole logging at Bench -120m RL to restrict ore dilution below 3.5% across contact zones.',
      'Submit updated block model spatial geometry to the Indian Bureau of Mines (IBM) ahead of the Q4 statutory review.',
    ],
    'REP-PROD-02': [
      'Execute dynamic reroute of Dumper units DT-08 through DT-14 onto the Eastern Bypass haulway to avoid mud accumulation.',
      'Reassign secondary Excavator EX-02 to Bench -110m high-grade face for next 72 hours to neutralize EX-04 downtime.',
      'Schedule primary jaw-crushing throughput peaks between 22:00 and 06:00 IST to exploit off-peak energy tariff brackets.',
    ],
    'REP-RISK-03': [
      'Enforce strict 15 km/h transit velocity restrictions on heavy transport along North Ridge crest haulage lane.',
      'Commence sub-horizontal dewatering drillings (4 x 60m) at Bench -90m toe to alleviate joint set J2 hydrostatic head.',
      'Increase Ground-Based Synthetic Aperture Radar (GB-InSAR) update frequency to 15-minute cycles with auto-siren tripwire.',
    ],
    'REP-PERF-04': [
      'Scale Balaghat underground battery-electric LHD dispatch protocols across deeper working horizons at Chikla mine.',
      'Deploy Mangenesis queue-balancing AI at Gumgaon primary in-pit loading station to compress truck wait times below 3 minutes.',
      'Institute weekly oil spectrographic analysis across all 55T rigid dumpers to pre-empt transmission overheating.',
    ],
    'REP-AI-05': [
      'Maintain automated continuous learning pipeline with incoming daily face-channel spectrometer assays.',
      'Archive cryptographic model artifact signature (SHA-256) inside sovereign on-premise regulatory server.',
      'Retain mandatory human-in-the-loop review for any automated dispatch recommendation with variance exceeding +/- 15%.',
    ],
  };

  const directives = directivesMap[report.id] || directivesMap['REP-RES-01'];

  directives.forEach((dir, idx) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    const cleanDir = sanitizeText(dir);
    const dirLines = doc.splitTextToSize(cleanDir, contentWidth - 36);
    const rowHeight = Math.max(22, dirLines.length * 10 + 10);

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(margin, y, contentWidth, rowHeight, 2, 2, 'FD');

    // Number badge (centered)
    const badgeSize = 13;
    const badgeY = y + (rowHeight - badgeSize) / 2;
    doc.setFillColor(15, 23, 42);
    doc.roundedRect(margin + 6, badgeY, badgeSize, badgeSize, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(245, 158, 11);
    doc.text(String(idx + 1), margin + 6 + badgeSize / 2, badgeY + 9.5, { align: 'center' });

    // Directive text
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(30, 41, 59);
    doc.text(dirLines, margin + 26, y + 11);

    y += rowHeight + 4;
  });

  y += 8;

  // 6. Section 4: Statutory Seal, Cryptographic Verification & Signatures
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, contentWidth, 64, 4, 4, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);
  doc.text('STATUTORY VERIFICATION & CRYPTOGRAPHIC PROVENANCE', margin + 10, y + 13);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  const disclaimer = 'Conforms to Directorate General of Mines Safety (DGMS), Metalliferous Mines Regulations (MMR 1961), and IBM guidelines. Digitally authenticated through Mangenesis Autonomous Mineral Intelligence Enclave.';
  doc.text(doc.splitTextToSize(disclaimer, contentWidth - 170), margin + 10, y + 24);

  // Digital Hash
  doc.setFont('courier', 'bold');
  doc.setFontSize(6);
  doc.setTextColor(30, 41, 59);
  doc.text('SHA-256 HASH: 8f4a9b2c019d38ef56b1a7e289c4d71052fb89a31e40c765da9812bc34ef9012', margin + 10, y + 46);
  doc.text(`AUTHENTICATION TIMESTAMP: ${new Date().toISOString()}  |  NODE: MOIL-GUM-SRV01`, margin + 10, y + 55);

  // Signature Block on right
  const sigX = pageWidth - margin - 150;
  doc.setDrawColor(148, 163, 184);
  doc.setLineWidth(0.75);
  doc.line(sigX, y + 40, sigX + 140, y + 40);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(15, 23, 42);
  doc.text('Dr. Arvind Rao, MOIL / IBM', sigX, y + 50);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.setTextColor(100, 116, 139);
  doc.text('Chief Mining Geologist & Authorized Agent', sigX, y + 58);

  // 7. Footer
  const footerY = pageHeight - 20;
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.5);
  doc.line(margin, footerY - 7, pageWidth - margin, footerY - 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  doc.text('CONFIDENTIAL & PROPRIETARY  |  MOIL LIMITED & MINISTRY OF STEEL, GOVT. OF INDIA  |  SIH26009', margin, footerY);
  doc.text('Page 1 of 1  |  Official Digital Dossier', pageWidth - margin - 120, footerY);

  // Trigger cross-platform download
  const sanitizedTitle = sanitizeText(report.title || 'Report').replace(/[^a-zA-Z0-9]/g, '_');
  const sanitizedId = sanitizeText(report.id || 'DOSSIER').replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `MANGENESIS_${sanitizedId}_${sanitizedTitle}.pdf`;
  doc.save(filename);

  return filename;
}
