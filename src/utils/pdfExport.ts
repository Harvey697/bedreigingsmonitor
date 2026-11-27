import { jsPDF } from 'jspdf';
import { ThreatItem, VitalSectorNL } from '../types/threat';
import { ExecutiveSummaryData } from '../components/ThreatAnalysisSummary';

export interface PdfExportOptions {
  organizationName?: string;
  classification?: 'TLP:CLEAR' | 'TLP:GREEN' | 'TLP:AMBER' | 'TLP:RED';
  authorName?: string;
  includeSectorBreakdown?: boolean;
  includeThreatActorDossiers?: boolean;
  includeRecommendations?: boolean;
  includeLiveIncidents?: boolean;
  filterSector?: VitalSectorNL | 'ALL';
}

/**
 * Generates an executive-grade CTI Briefing PDF Document using jsPDF
 */
export function generateThreatAnalysisPdf(
  summaryData: ExecutiveSummaryData,
  threats: ThreatItem[],
  options: PdfExportOptions = {}
): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
  const margin = 14;
  const contentWidth = pageWidth - margin * 2; // 182mm

  const orgName = options.organizationName?.trim() || 'NATIONALE VEILIGHEID & CTI COMMISSIE';
  const classification = options.classification || 'TLP:AMBER';
  const author = options.authorName?.trim() || 'NCSC Cyber Threat Intelligence Monitor';
  const dateFormatted = new Date().toLocaleDateString('nl-NL', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  const timeFormatted = new Date().toLocaleTimeString('nl-NL', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // TLP Colors
  const tlpColors: Record<string, { bg: [number, number, number]; text: [number, number, number] }> = {
    'TLP:CLEAR': { bg: [241, 245, 249], text: [30, 41, 59] },
    'TLP:GREEN': { bg: [220, 252, 231], text: [22, 101, 52] },
    'TLP:AMBER': { bg: [254, 243, 199], text: [146, 64, 14] },
    'TLP:RED': { bg: [254, 226, 226], text: [153, 27, 27] },
  };

  const threatLevelColors: Record<string, [number, number, number]> = {
    KRITIEK: [225, 29, 72],     // Rose-600
    VERHOOGD: [234, 88, 12],    // Orange-600
    AANZIENLIJK: [217, 119, 6], // Amber-600
    BEPERKT: [16, 185, 129],    // Emerald-500
  };

  let cursorY = margin;

  const renderHeader = (pageNumber: number, totalPages: number) => {
    // Header bar background
    doc.setFillColor(15, 23, 42); // Slate-900
    doc.rect(0, 0, pageWidth, 12, 'F');

    // Classification banner badge
    const tlp = tlpColors[classification] || tlpColors['TLP:AMBER'];
    doc.setFillColor(tlp.bg[0], tlp.bg[1], tlp.bg[2]);
    doc.roundedRect(margin, 2.5, 34, 7, 1.5, 1.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(tlp.text[0], tlp.text[1], tlp.text[2]);
    doc.text(classification, margin + 4, 7);

    // Document Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(248, 250, 252);
    doc.text('DIRECTIE BRIEFING | BEDREIGINGSMONITOR NL', margin + 38, 7);

    // Date & Page in header
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text(`${dateFormatted} ${timeFormatted}`, pageWidth - margin - 35, 7);
  };

  const renderFooter = (pageNumber: number, totalPages: number) => {
    // Bottom border line
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 11, pageWidth - margin, pageHeight - 11);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(
      `Vertrouwelijk CTI Document • ${orgName} • Opgesteld door ${author}`,
      margin,
      pageHeight - 6
    );

    const pageStr = `Pagina ${pageNumber} van ${totalPages}`;
    const pageStrWidth = doc.getTextWidth(pageStr);
    doc.text(pageStr, pageWidth - margin - pageStrWidth, pageHeight - 6);
  };

  // --- PAGE 1: EXECUTIVE OVERVIEW ---
  renderHeader(1, 2);
  cursorY = 20;

  // Title block
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text('Cyber Threat Intelligence Executive Briefing', margin, cursorY);
  cursorY += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Situatieoverzicht vitale infrastructuur & digitale soevereiniteit Nederland`, margin, cursorY);
  cursorY += 8;

  // Threat Level Alert Box
  const tlColor = threatLevelColors[summaryData.threatLevel] || threatLevelColors.KRITIEK;
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, cursorY, contentWidth, 26, 2, 2, 'FD');

  // Threat Level left accent bar
  doc.setFillColor(tlColor[0], tlColor[1], tlColor[2]);
  doc.rect(margin, cursorY, 4, 26, 'F');

  // Badge in Box
  doc.setFillColor(tlColor[0], tlColor[1], tlColor[2]);
  doc.roundedRect(margin + 8, cursorY + 4, 52, 6, 1, 1, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text(`DREIGINGSNIVEAU: ${summaryData.threatLevel}`, margin + 11, cursorY + 8.2);

  // Score text
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(`Score: ${summaryData.threatLevelScore}/100`, margin + 64, cursorY + 8.5);

  // Subtitle
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(30, 41, 59);
  doc.text(summaryData.summaryTitle, margin + 8, cursorY + 16);

  // Target count & vitale infra metric
  const vitalCount = threats.filter((t) => t.isDutchVitalInfra).length;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(
    `Actieve dreigingen geanalyseerd: ${threats.length} | Directe impact vitale infra NL: ${vitalCount} entiteiten`,
    margin + 8,
    cursorY + 22
  );

  cursorY += 32;

  // SECTION: Executive Briefing Text
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('1. Directiesamenvatting & Dreigingsanalyse', margin, cursorY);
  cursorY += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);

  const splitBriefing = doc.splitTextToSize(summaryData.executiveBriefing, contentWidth);
  doc.text(splitBriefing, margin, cursorY);
  cursorY += splitBriefing.length * 4.2 + 6;

  // SECTION: Kritieke Doelwitten & Actoren
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('2. Kritieke Doelwitten & Dreigingsactoren', margin, cursorY);
  cursorY += 5;

  // Render 2 columns
  const colW = (contentWidth - 6) / 2;

  // Column Left: Targets
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, cursorY, colW, 40, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Geraakte Doelwitten & Systemen:', margin + 4, cursorY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  let targetY = cursorY + 12;
  summaryData.criticalTargets.slice(0, 5).forEach((target) => {
    doc.text(`• ${target}`, margin + 5, targetY);
    targetY += 5;
  });

  // Column Right: Threat Actors
  doc.setFillColor(241, 245, 249);
  doc.rect(margin + colW + 6, cursorY, colW, 40, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Geobserveerde Actoren:', margin + colW + 10, cursorY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  let actorY = cursorY + 12;
  summaryData.activeActors.slice(0, 4).forEach((actor) => {
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.text(`• ${actor.name}`, margin + colW + 10, actorY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(` (${actor.origin} - ${actor.threatType})`, margin + colW + 10 + doc.getTextWidth(`• ${actor.name} `), actorY);
    actorY += 5.5;
  });

  cursorY += 46;

  // SECTION: Top Aanvalsvectoren
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('3. Waargenomen Aanvalsvectoren & TTPs', margin, cursorY);
  cursorY += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  summaryData.topAttackVectors.slice(0, 4).forEach((vector) => {
    doc.text(`▸ ${vector}`, margin + 3, cursorY);
    cursorY += 4.5;
  });

  cursorY += 6;

  // Strategic Recommendations box on page 1
  doc.setFillColor(238, 242, 255); // Indigo-50
  doc.setDrawColor(199, 210, 254);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, cursorY, contentWidth, 38, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(49, 46, 129); // Indigo-900
  doc.text('4. Strategische & Directie Maatregelen (Prioriteit NCSC-NL):', margin + 5, cursorY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);
  let recY = cursorY + 12;
  summaryData.strategicRecommendations.slice(0, 4).forEach((rec) => {
    const splitRec = doc.splitTextToSize(`✓  ${rec}`, contentWidth - 10);
    doc.text(splitRec, margin + 5, recY);
    recY += splitRec.length * 4 + 1.5;
  });

  renderFooter(1, 2);

  // --- PAGE 2: SECTOR MATRIX & ACTIEVE INCIDENTEN ---
  doc.addPage();
  renderHeader(2, 2);
  cursorY = 20;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text('5. Sectoranalyse Vitale Infrastructuur Nederland', margin, cursorY);
  cursorY += 6;

  // Table header
  doc.setFillColor(30, 41, 59); // Slate-800
  doc.rect(margin, cursorY, contentWidth, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text('SECTOR / DOMEIN', margin + 4, cursorY + 5);
  doc.text('RISICONIVEAU', margin + 65, cursorY + 5);
  doc.text('DETAILS & DREIGINGSMANIFESTATIE', margin + 98, cursorY + 5);
  cursorY += 7;

  // Sector Rows
  summaryData.vitalSectorRisks.slice(0, 8).forEach((sec, idx) => {
    const rowBg = idx % 2 === 0 ? 255 : 248;
    doc.setFillColor(rowBg, rowBg, rowBg);
    doc.rect(margin, cursorY, contentWidth, 9, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(15, 23, 42);
    doc.text(sec.sector, margin + 4, cursorY + 6);

    // Risk badge
    const badgeColor =
      sec.riskLevel === 'KRITIEK'
        ? [225, 29, 72]
        : sec.riskLevel === 'HOOG'
        ? [234, 88, 12]
        : [217, 119, 6];
    doc.setFillColor(badgeColor[0], badgeColor[1], badgeColor[2]);
    doc.roundedRect(margin + 65, cursorY + 2, 26, 5, 1, 1, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.text(sec.riskLevel, margin + 67, cursorY + 5.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(51, 65, 85);
    const detailTruncated = doc.splitTextToSize(sec.details, contentWidth - 102);
    doc.text(detailTruncated[0] || '', margin + 98, cursorY + 6);

    cursorY += 9;
  });

  cursorY += 8;

  // SECTION: Live Incidenten Snapshot
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('6. Live Dreigingslogboek & Forensische Details (Selectie)', margin, cursorY);
  cursorY += 5;

  // Incident list
  threats.slice(0, 4).forEach((threat) => {
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, cursorY, contentWidth, 18, 1.5, 1.5, 'FD');

    // Title & Actor
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text(threat.title, margin + 4, cursorY + 5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(225, 29, 72);
    doc.text(threat.severity, pageWidth - margin - 25, cursorY + 5);

    // Sub info
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(71, 85, 105);
    doc.text(
      `Actor: ${threat.threatActor} (${threat.originCountry}) • Doel: ${threat.targetVictim} • Locatie: ${threat.targetLocation}`,
      margin + 4,
      cursorY + 10
    );

    // Description
    const descShort = doc.splitTextToSize(threat.description, contentWidth - 8);
    doc.setFontSize(6.8);
    doc.setTextColor(100, 116, 139);
    doc.text(descShort[0] || '', margin + 4, cursorY + 15);

    cursorY += 21;
  });

  // Verification & Sign-off stamp box
  cursorY += 2;
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, cursorY, contentWidth, 22, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);
  doc.text('Authenticatie & Verificatie:', margin + 4, cursorY + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);
  doc.text(
    `Gegenereerd via NCSC-NL Bedreigingsmonitor Realtime Intelligence Engine.\nDocument ID: CTI-NL-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)} | TLP-classificatie strikt handhaven volgens beleid.`,
    margin + 4,
    cursorY + 10
  );

  renderFooter(2, 2);

  return doc;
}

/**
 * Downloads the PDF directly in the user browser
 */
export function downloadThreatAnalysisPdf(
  summaryData: ExecutiveSummaryData,
  threats: ThreatItem[],
  options: PdfExportOptions = {}
): void {
  const doc = generateThreatAnalysisPdf(summaryData, threats, options);
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const filename = `Bedreigingsmonitor-Executive-Briefing-${dateStr}.pdf`;
  doc.save(filename);
}

/**
 * Generates an executive summary based on the current threat array
 */
export function getDefaultExecutiveSummary(
  threats: ThreatItem[],
  selectedSector?: VitalSectorNL | 'ALL'
): ExecutiveSummaryData {
  const criticalCount = threats.filter((t) => t.severity === 'KRITIEK').length;
  const vitalCount = threats.filter((t) => t.isDutchVitalInfra).length;

  let threatLevel: 'KRITIEK' | 'VERHOOGD' | 'AANZIENLIJK' | 'BEPERKT' = 'KRITIEK';
  let threatLevelScore = 88;

  if (criticalCount >= 4 || vitalCount >= 5) {
    threatLevel = 'KRITIEK';
    threatLevelScore = 92;
  } else if (criticalCount >= 2 || vitalCount >= 3) {
    threatLevel = 'VERHOOGD';
    threatLevelScore = 78;
  } else {
    threatLevel = 'AANZIENLIJK';
    threatLevelScore = 65;
  }

  const targets = Array.from(new Set(threats.map((t) => t.targetVictim))).slice(0, 6);
  const actors = Array.from(
    new Map(
      threats.map((t) => [
        t.threatActor,
        {
          name: t.threatActor,
          origin: t.originCountry,
          threatType: t.threatActorType === 'STAATSGESPONSORD_APT' ? 'Staatsgesponsorde APT' : 'Ransomware Kartel',
          targetImpact: t.targetVictim,
        },
      ])
    ).values()
  ).slice(0, 5);

  const vitalSectorRisks: ExecutiveSummaryData['vitalSectorRisks'] = [
    {
      sector: 'Haven & Logistiek (Rotterdam)',
      riskLevel: 'KRITIEK',
      details: 'Actieve ransomware-campagnes gericht op OT-netwerken van containerterminals en ketenleveranciers.',
    },
    {
      sector: 'Energie & Netbeheer (TenneT, Gasunie)',
      riskLevel: 'KRITIEK',
      details: 'Spionageactiviteiten en voorverkenning van SCADA/ICS-systemen door APT28 en Sandworm.',
    },
    {
      sector: 'Telecom & Internet (AMS-IX, KPN)',
      riskLevel: 'VERHOOGD',
      details: 'DDoS-campagnes van pro-Russische groepen en pogingen tot BGP-route-manipulatie.',
    },
    {
      sector: 'Zorg & Ziekenhuizen',
      riskLevel: 'VERHOOGD',
      details: 'Exploitatie van kwetsbaarheden in medische portalen en VPN-gateways (Ivanti / Citrix).',
    },
    {
      sector: 'Waterbeheer & Dijkbewaking (Rijkswaterstaat)',
      riskLevel: 'VERHOOGD',
      details: 'Doelgerichte scans op geautomatiseerde sluizen- en gemalenbesturingssystemen.',
    },
    {
      sector: 'Financiële Sector & Betalingsverkeer',
      riskLevel: 'AANZIENLIJK',
      details: 'Credential stuffing en gerichte social engineering gericht op SWIFT- en bancaire medewerkers.',
    },
    {
      sector: 'Hightech & Halfgeleiders (ASML-ecosysteem)',
      riskLevel: 'KRITIEK',
      details: 'Intellectueel eigendomsdiefstal via leveranciersketens door geavanceerde staatsactoren.',
    },
  ];

  return {
    threatLevel,
    threatLevelScore,
    summaryTitle: `Coördinaat Veiligheidsbeeld: ${vitalCount} Vitale NL Entiteiten Onder Verhoogde Dreiging`,
    executiveBriefing: `Op basis van actuele CTI-data en meldingen van CSIRT/NCSC-NL bevindt de nationale vitale infrastructuur zich in een ${threatLevel.toLowerCase()}e fase. Er is sprake van gecoördineerde aanvallen door geopolitieke staatsactoren (Sandworm/APT28 uit Rusland, Volt Typhoon uit China, Lazarus Group uit Noord-Korea, en Charming Kitten/MuddyWater uit Iran) alsmede financieel gedreven ransomware-syndicaten (LockBit 3.0, Black Basta). Primaire doelwitten betreffen de Rotterdamse haven, chiptechnologie in Veldhoven (ASML ecosysteem), energieknooppunten en fintech platforms. Organisaties dienen onmiddellijk over te gaan tot fase 2 paraatheid.`,
    criticalTargets: targets.length > 0 ? targets : ['Haven Rotterdam Containerterminals', 'TenneT Hoogspanningsnet', 'ASML Toeleveranciers Veldhoven', 'AMS-IX Internet Knooppunt', 'KPN Core Datacenters', 'Rijkswaterstaat Sluizen'],
    activeActors: actors.length > 0 ? actors : [
      { name: 'APT28 & Sandworm', origin: 'Rusland', threatType: 'Staatsgesponsorde APT', targetImpact: 'Overheid & Energie' },
      { name: 'Volt & Salt Typhoon', origin: 'China', threatType: 'Staatsgesponsorde APT', targetImpact: 'Vitale Knooppunten & Telecom' },
      { name: 'Lazarus Group (Bureau 121)', origin: 'Noord-Korea', threatType: 'Staatsgesponsorde APT', targetImpact: 'Halfgeleiders & Fintech' },
      { name: 'Charming Kitten (IRGC)', origin: 'Iran', threatType: 'Staatsgesponsorde APT', targetImpact: 'Haven & Petrochemie' },
      { name: 'LockBit 3.0 Syndicate', origin: 'Oost-Europa', threatType: 'Ransomware Kartel', targetImpact: 'Logistiek & Retail' },
    ],
    vitalSectorRisks,
    topAttackVectors: [
      'Exploitatie van publiek toegankelijke VPN/Edge-apparatuur (Ivanti, Citrix Bleed, Fortinet)',
      'Spear-phishing met kwaadaardige macro-loze documenten gericht op bevoegd personeel',
      'Keteninbraken via IT-serviceproviders (Managed Service Providers)',
      'Geavanceerde BGP hijacking en volumetrische layer-7 DDoS aanvallen',
    ],
    strategicRecommendations: [
      'Isoleer en segmenteer operationele technologie (OT/ICS) direct van kantoornetwerken.',
      'Activeer phishing-resistente FIDO2/WebAuthn MFA op álle remote access diensten.',
      'Controleer immutable en offline back-ups van kritieke infrastructuursystemen.',
      'Deel Indicators of Compromise (IoCs) direct via NCSC NDN en Nationaal Detectienetwerk.',
    ],
  };
}
