import os
import shutil
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
from reportlab.pdfgen import canvas

pdf_path = r'C:\Users\musad\.gemini\antigravity\scratch\mangenesis\MANGENESIS_Hackathon_Explainer.pdf'
artifact_path = r'C:\Users\musad\.gemini\antigravity\brain\5b4999f5-ffd0-4b8d-96f7-0b31c8b8bcef\MANGENESIS_Hackathon_Explainer.pdf'

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super(NumberedCanvas, self).showPage()
        super(NumberedCanvas, self).save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont('Helvetica', 8)
        self.setFillColor(colors.HexColor('#71717a'))
        
        # Header (pages > 1)
        if self._pageNumber > 1:
            self.drawString(40, 760, 'MANGENESIS — Hackathon Presentation Guide & 6-Student Pitch Strategy')
            self.drawRightString(572, 760, 'MOIL Ltd. | Ministry of Steel (SIH26009)')
            self.setStrokeColor(colors.HexColor('#e4e4e7'))
            self.setLineWidth(0.5)
            self.line(40, 752, 572, 752)
            
        # Footer
        self.drawString(40, 25, 'Confidential — For Smart India Hackathon Presentation')
        self.drawRightString(572, 25, f'Page {self._pageNumber} of {page_count}')
        self.setStrokeColor(colors.HexColor('#e4e4e7'))
        self.setLineWidth(0.5)
        self.line(40, 36, 572, 36)
        self.restoreState()

doc = SimpleDocTemplate(
    pdf_path,
    pagesize=letter,
    leftMargin=36,
    rightMargin=36,
    topMargin=40,
    bottomMargin=40
)

styles = getSampleStyleSheet()

# Custom styles
primary_color = colors.HexColor('#09090b')
accent_color = colors.HexColor('#2563eb')
text_dark = colors.HexColor('#18181b')
text_muted = colors.HexColor('#52525b')

title_style = ParagraphStyle(
    'DocTitle',
    fontName='Helvetica-Bold',
    fontSize=18,
    leading=22,
    textColor=colors.HexColor('#09090b'),
    spaceAfter=3
)

subtitle_style = ParagraphStyle(
    'DocSubtitle',
    fontName='Helvetica-Bold',
    fontSize=9.5,
    leading=13,
    textColor=colors.HexColor('#2563eb'),
    spaceAfter=8
)

h1_style = ParagraphStyle(
    'Heading1_Custom',
    fontName='Helvetica-Bold',
    fontSize=11,
    leading=14,
    textColor=colors.HexColor('#09090b'),
    spaceBefore=8,
    spaceAfter=4,
    keepWithNext=True
)

body_style = ParagraphStyle(
    'Body_Custom',
    fontName='Helvetica',
    fontSize=8.5,
    leading=11.5,
    textColor=text_dark,
    spaceAfter=4
)

bullet_style = ParagraphStyle(
    'Bullet_Custom',
    fontName='Helvetica',
    fontSize=8,
    leading=11,
    textColor=text_dark,
    leftIndent=8,
    spaceAfter=2
)

callout_style = ParagraphStyle(
    'Callout_Text',
    fontName='Helvetica',
    fontSize=8,
    leading=11,
    textColor=colors.HexColor('#1e3a8a')
)

table_header_style = ParagraphStyle(
    'TableHeader',
    fontName='Helvetica-Bold',
    fontSize=8,
    leading=10,
    textColor=colors.white
)

table_cell_style = ParagraphStyle(
    'TableCell',
    fontName='Helvetica',
    fontSize=7.5,
    leading=10,
    textColor=text_dark
)

table_cell_bold = ParagraphStyle(
    'TableCellBold',
    fontName='Helvetica-Bold',
    fontSize=7.5,
    leading=10,
    textColor=text_dark
)

story = []

# Title Section
story.append(Paragraph('MANGENESIS — Hackathon Presentation Guide & 6-Student Pitch Strategy', title_style))
story.append(Paragraph('Problem Statement SIH26009 | Ministry of Steel — MOIL Ltd. | AI Space Intelligence for Manganese Reserves', subtitle_style))
story.append(HRFlowable(width='100%', thickness=1, color=colors.HexColor('#09090b'), spaceBefore=0, spaceAfter=8))

# 1. Overview & Problem Statement
story.append(Paragraph('1. Executive Overview & Problem Definition', h1_style))
story.append(Paragraph('<b>MANGENESIS</b> is an AI-powered space intelligence platform engineered for <b>MOIL Ltd.</b> to simultaneously solve two major industry challenges:', body_style))
story.append(Paragraph('&bull; <b>Challenge 1: Slow & Expensive Ore Exploration:</b> Traditional mineral prospecting relies on blind field surveys and exploratory drill holes costing crores. MANGENESIS uses 6 multi-spectral satellite streams and XGBoost AI to locate manganese deposit zones with <b>88.25% ROC-AUC accuracy</b> before breaking ground.', bullet_style))
story.append(Paragraph('&bull; <b>Challenge 2: Surprise Production Shortfalls:</b> Flooded haul roads, machine hydraulic degradation, and blasting delays lead to sudden production deficits. MANGENESIS predicts output deficits <b>7 days in advance</b> using LightGBM, isolates root causes with TreeSHAP, and optimizes fleet recovery with MILP.', bullet_style))
story.append(Spacer(1, 4))

# 2. Key Terms Table
story.append(Paragraph('2. Technical Terminology in Simple Words (Cheatsheet)', h1_style))

terms_data = [
    [Paragraph('Term', table_header_style), Paragraph('What It Means in Simple Plain English', table_header_style), Paragraph('Project Metric / Context', table_header_style)],
    [Paragraph('<b>XGBoost</b>', table_cell_bold), Paragraph('A machine learning classifier that learns underground manganese signatures from multi-spectral satellite imagery and historical drill assays.', table_cell_style), Paragraph('<b>0.8825 ROC-AUC</b> target confidence', table_cell_style)],
    [Paragraph('<b>LightGBM</b>', table_cell_bold), Paragraph('A fast gradient-boosted time-series regressor forecasting daily production 7 days ahead based on weather, shifts, and equipment telemetry.', table_cell_style), Paragraph('Predicts output up to <b>7 days ahead</b> (94% conf)', table_cell_style)],
    [Paragraph('<b>TreeSHAP</b>', table_cell_bold), Paragraph('Game-theoretic Explainable AI (XAI) that decomposes exactly <i>WHY</i> production drops (e.g., 58% Equipment + 24% Rain + 18% Blasting).', table_cell_style), Paragraph('Eliminates AI black-box for mine managers', table_cell_style)],
    [Paragraph('<b>MILP</b>', table_cell_bold), Paragraph('<b>Mixed Integer Linear Programming:</b> An optimization math solver that calculates the highest-yield tactical actions (e.g., redeploying standby loaders).', table_cell_style), Paragraph('Recovers <b>up to 77%</b> of projected shortfall tonnage', table_cell_style)],
    [Paragraph('<b>Sentinel-2</b>', table_cell_bold), Paragraph('European Space Agency (ESA) multi-spectral satellite capturing 13 spectral bands including SWIR to map manganese alteration.', table_cell_style), Paragraph('10m resolution, 5-day revisit cycle (100% Free)', table_cell_style)],
    [Paragraph('<b>NASA GPM & SMAP</b>', table_cell_bold), Paragraph('NASA radar satellites measuring precipitation and ground soil moisture to detect haul road waterlogging and pit inundation.', table_cell_style), Paragraph('Daily rainfall (mm) & soil moisture (%) live ingestion', table_cell_style)],
    [Paragraph('<b>PostGIS + Supabase</b>', table_cell_bold), Paragraph('Cloud PostgreSQL spatial database holding polygonal zone boundaries, diamond core drill pins, and real-time alert logs.', table_cell_style), Paragraph('Enterprise RLS security & WebSockets real-time sync', table_cell_style)],
]

t_terms = Table(terms_data, colWidths=[90, 290, 160])
t_terms.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#18181b')),
    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
    ('TOPPADDING', (0, 0), (-1, -1), 3),
    ('LEFTPADDING', (0, 0), (-1, -1), 5),
    ('RIGHTPADDING', (0, 0), (-1, -1), 5),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#d4d4d8')),
    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.HexColor('#ffffff'), colors.HexColor('#f8fafc')]),
]))
story.append(t_terms)
story.append(Spacer(1, 6))

# 3. Decision Framework
story.append(Paragraph('3. The Core Three-Step Innovation: Predict &rarr; Explain &rarr; Act', h1_style))

stages_data = [
    [Paragraph('Stage 1: PREDICT (7 Days Ahead)', table_header_style), Paragraph('Stage 2: EXPLAIN (Root Causes)', table_header_style), Paragraph('Stage 3: ACT (MILP Optimizer)', table_header_style)],
    [
        Paragraph('<b>LightGBM Regressor</b><br/>Forecasts daily output vs 10,000 TPD target. Flags Day 4&ndash;6 high-risk deficit (e.g. -2,200 T shortfall projected).', table_cell_style),
        Paragraph('<b>TreeSHAP Feature Attribution</b><br/>Isolates exact root causes: 58% Primary Shovel Breakdown, 24% Road Mud Inundation, 18% Blasting Delay.', table_cell_style),
        Paragraph('<b>MILP Solver Execution</b><br/>Generates prioritized recovery actions: 1. Redeploy Standby Shovel (+1,100T), 2. Reroute Haul Ramp (+520T) &rarr; Restores 77% deficit.', table_cell_style)
    ]
]
t_stages = Table(stages_data, colWidths=[180, 180, 180])
t_stages.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#2563eb')),
    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ('TOPPADDING', (0, 0), (-1, -1), 4),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ('LEFTPADDING', (0, 0), (-1, -1), 5),
    ('RIGHTPADDING', (0, 0), (-1, -1), 5),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#93c5fd')),
    ('BACKGROUND', (0, 1), (-1, 1), colors.HexColor('#eff6ff')),
]))
story.append(t_stages)
story.append(Spacer(1, 6))

# 4. 6-Student Division
story.append(Paragraph('4. 6-Student Presentation Division & Speaking Roles', h1_style))

roles_data = [
    [Paragraph('Member & Role', table_header_style), Paragraph('Screen to Demo', table_header_style), Paragraph('Key Talking Points (30&ndash;45 Secs)', table_header_style), Paragraph('Judge Q&A Defense', table_header_style)],
    
    [Paragraph('<b>Student 1</b><br/>Team Lead & Architect', table_cell_bold),
     Paragraph('<b>Command Center</b><br/>(MOIL Mine Selector)', table_cell_style),
     Paragraph('&bull; Problem statement (SIH26009, MOIL).<br/>&bull; Multi-mine switch across 6 sites.<br/>&bull; Live KPI cards (Output, Target, Risk %).', table_cell_style),
     Paragraph('<i>Q: Scalability?</i><br/>A: Works for all 6 MOIL mines & any global mine with zero code changes.', table_cell_style)],
     
    [Paragraph('<b>Student 2</b><br/>Satellite GIS Engineer', table_cell_bold),
     Paragraph('<b>Reserve Intelligence</b><br/>(Data Fusion Panel)', table_cell_style),
     Paragraph('&bull; Ingestion of 6 free NASA/ESA satellites.<br/>&bull; Multi-band stacking (Sentinel-2 NDVI, GPM rain, SMAP moisture, MODIS thermal).', table_cell_style),
     Paragraph('<i>Q: Satellite data cost?</i><br/>A: 100% Free & open access from Copernicus & NASA Earthdata.', table_cell_style)],

    [Paragraph('<b>Student 3</b><br/>AI Exploration Lead', table_cell_bold),
     Paragraph('<b>Reserve Intelligence</b><br/>(Leaflet GIS Map)', table_cell_style),
     Paragraph('&bull; XGBoost model trained on historical assays.<br/>&bull; <b>0.8825 ROC-AUC</b> target identification.<br/>&bull; Inspect Mn grade & recoverable tonnes.', table_cell_style),
     Paragraph('<i>Q: How to detect Mn from orbit?</i><br/>A: Hydrothermal alteration exhibits unique SWIR spectral absorption bands.', table_cell_style)],

    [Paragraph('<b>Student 4</b><br/>Production Forecaster', table_cell_bold),
     Paragraph('<b>Production Forecast</b><br/>(14-Day & 7-Day Chart)', table_cell_style),
     Paragraph('&bull; 14-day historical actuals &rarr; 7-day AI forecast.<br/>&bull; Early warning 7 days before shortfall hits feed.<br/>&bull; Low, Medium, High risk period windows.', table_cell_style),
     Paragraph('<i>Q: Why LightGBM over LSTM?</i><br/>A: 10x faster training on tabular telemetry, robust to missing rows, native TreeSHAP.', table_cell_style)],

    [Paragraph('<b>Student 5</b><br/>Explainable AI (XAI)', table_cell_bold),
     Paragraph('<b>Risk Analysis</b><br/>(Root Cause Donut)', table_cell_style),
     Paragraph('&bull; TreeSHAP game-theoretic feature attribution.<br/>&bull; Decomposes risk into exact percentages.<br/>&bull; Live telemetry signal monitoring stream.', table_cell_style),
     Paragraph('<i>Q: Why is TreeSHAP needed?</i><br/>A: Mine managers need mathematical accountability, not black-box predictions.', table_cell_style)],

    [Paragraph('<b>Student 6</b><br/>Optimization & Alerts', table_cell_bold),
     Paragraph('<b>Action Center & Alert Center</b><br/>(Virtual Phone Demo)', table_cell_style),
     Paragraph('&bull; MILP solves optimal shovel redeployment.<br/>&bull; Restores 77% deficit tonnage.<br/>&bull; Live SMS trigger on virtual mobile simulator + desktop push chime.', table_cell_style),
     Paragraph('<i>Q: How are actions chosen?</i><br/>A: MILP optimizes Impact Score constrained by shovel fleet & haul cycle times.', table_cell_style)],
]

t_roles = Table(roles_data, colWidths=[90, 100, 180, 170])
t_roles.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#09090b')),
    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ('TOPPADDING', (0, 0), (-1, -1), 3),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
    ('LEFTPADDING', (0, 0), (-1, -1), 4),
    ('RIGHTPADDING', (0, 0), (-1, -1), 4),
    ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#d4d4d8')),
    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.HexColor('#ffffff'), colors.HexColor('#f8fafc')]),
]))
story.append(t_roles)
story.append(Spacer(1, 6))

# 5. Presentation Pitch Script
story.append(Paragraph('5. Complete 2-Minute Master Presentation Pitch Script', h1_style))
pitch_box = [
    [Paragraph(
        '<b>[0:00 &ndash; Student 1]:</b> &ldquo;Respected judges, we are Team MANGENESIS. MOIL produces over 45% of India\'s manganese, but faces two crippling challenges: exploratory drilling takes months and costs crores, while surprise production shortfalls cost lakhs daily. MANGENESIS solves both using space intelligence.&rdquo;<br/>'
        '<b>[0:30 &ndash; Student 2 & 3]:</b> &ldquo;We ingest 6 free NASA and ESA satellite streams &mdash; including Sentinel-2 multispectral imagery and NASA soil moisture. Our XGBoost model maps manganese alteration zones underground with 88.25% ROC-AUC accuracy, saving millions in exploratory drilling.&rdquo;<br/>'
        '<b>[1:00 &ndash; Student 4 & 5]:</b> &ldquo;For operational continuity, our LightGBM model predicts production shortfalls 7 days in advance. TreeSHAP explains the exact root causes &mdash; like 58% excavator pressure drop and 24% haul road mud saturation &mdash; eliminating the AI black box.&rdquo;<br/>'
        '<b>[1:30 &ndash; Student 6]:</b> &ldquo;Finally, our MILP optimizer computes the highest-yield recovery actions to restore up to 77% of lost tonnage, while our multi-channel escalation system dispatches instant SMS, email, and desktop push alerts to mine controllers. We are now ready for your questions.&rdquo;',
        callout_style
    )]
]
t_pitch = Table(pitch_box, colWidths=[540])
t_pitch.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f0fdf4')),
    ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#86efac')),
    ('TOPPADDING', (0, 0), (-1, -1), 5),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ('LEFTPADDING', (0, 0), (-1, -1), 8),
    ('RIGHTPADDING', (0, 0), (-1, -1), 8),
]))
story.append(t_pitch)

doc.build(story, canvasmaker=NumberedCanvas)

# Copy to brain artifact directory as well
shutil.copyfile(pdf_path, artifact_path)

print(f'SUCCESS: Generated PDF at {pdf_path} and copied to {artifact_path}')
