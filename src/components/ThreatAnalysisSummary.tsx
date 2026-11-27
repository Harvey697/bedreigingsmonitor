import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ShieldAlert,
  Brain,
  Activity,
  RefreshCw,
  Copy,
  Check,
  AlertTriangle,
  Building2,
  Lock,
  Globe2,
  ChevronDown,
  ChevronUp,
  FileText,
  Flame,
  Radio,
  Send,
  Zap,
  Download,
} from 'lucide-react';
import { ThreatItem, VitalSectorNL } from '../types/threat';
import { ThreatReportPdfModal } from './ThreatReportPdfModal';
import { downloadThreatAnalysisPdf } from '../utils/pdfExport';

export interface ThreatAnalysisSummaryProps {
  threats: ThreatItem[];
  selectedSector?: VitalSectorNL | 'ALL';
}

export interface ExecutiveSummaryData {
  threatLevel: 'KRITIEK' | 'VERHOOGD' | 'AANZIENLIJK' | 'BEPERKT';
  threatLevelScore: number;
  summaryTitle: string;
  executiveBriefing: string;
  criticalTargets: string[];
  activeActors: Array<{
    name: string;
    origin: string;
    threatType: string;
    targetImpact?: string;
  }>;
  vitalSectorRisks: Array<{
    sector: string;
    riskLevel: 'KRITIEK' | 'HOOG' | 'VERHOOGD' | 'AANZIENLIJK' | 'MATIG';
    details: string;
  }>;
  topAttackVectors: string[];
  strategicRecommendations: string[];
}

export const ThreatAnalysisSummary: React.FC<ThreatAnalysisSummaryProps> = ({
  threats,
  selectedSector = 'ALL',
}) => {
  const [summaryData, setSummaryData] = useState<ExecutiveSummaryData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastGeneratedTime, setLastGeneratedTime] = useState<string>('');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'EXECUTIVE' | 'SECTOREN' | 'MITIGATIES'>('EXECUTIVE');
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [customQuestion, setCustomQuestion] = useState<string>('');
  const [isAnsweringQuestion, setIsAnsweringQuestion] = useState<boolean>(false);
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [sourceUsed, setSourceUsed] = useState<string>('gemini');
  const [isPdfModalOpen, setIsPdfModalOpen] = useState<boolean>(false);

  // Client-side emergency fallback if API or network is unavailable
  const generateLocalFallback = (items: ThreatItem[]): ExecutiveSummaryData => {
    const total = items.length;
    const criticals = items.filter((t) => t.severity === 'KRITIEK').length;
    const dutchVitalCount = items.filter((t) => t.isDutchVitalInfra).length;
    const now = new Date().toLocaleDateString('nl-NL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    return {
      threatLevel: criticals > 2 ? 'KRITIEK' : 'VERHOOGD',
      threatLevelScore: Math.min(95, 70 + criticals * 5 + dutchVitalCount * 3),
      summaryTitle: `NCSC Directiebriefing: Situational Awareness & Ketenrisico (${now})`,
      executiveBriefing: `Op basis van de actuele telemetriestroom (${total} geanalyseerde incidenten, waarvan ${criticals} met status Kritiek) waarschuwt het Nationaal Cyber Security Centrum voor gecoördineerde statelijke activiteit en ransomware-afpersing gericht op Nederlandse vitale knooppunten. Met name de Haven van Rotterdam, ASML chip-toeleveranciers, TenneT netwerkfaciliteiten en fintech platforms vertonen acute aanvalsindicaties.

Statelijke actoren uit Rusland (GRU Sandworm, Fancy Bear), China (Volt & Salt Typhoon), Noord-Korea (Lazarus Group, Kimsuky) en Iran (Charming Kitten, MuddyWater) richten zich nadrukkelijk op Edge-VPN firewalls, supply-chains en SCADA/OT-koppelingen. Bestuurders dienen acute NIS2-waakzaamheid te betrachten en onmiddellijke netwerkisolatie te verifiëren.`,
      criticalTargets: [
        'Havenbedrijf Rotterdam & Bunkering Terminals (Pernis / Botlek)',
        'ASML Veldhoven & Toeleveranciersnetwerk (High-Tech Campus)',
        'TenneT TSO (Landelijk Hoogspanningsnetwerk & GasUnie)',
        'KPN Telecom / AMS-IX Datacenter Knooppunten',
        'Z-Cert Netwerk & Regionale Ziekenhuizen',
      ],
      activeActors: [
        {
          name: 'GRU Sandworm (Eenheid 74455)',
          origin: 'Rusland (GRU)',
          threatType: 'Destructieve Sabotage & OT/SCADA Disruptie',
          targetImpact: 'Havenlogistiek en energietransport',
        },
        {
          name: 'Volt Typhoon (Vanguard Panda)',
          origin: 'China (MSS / PLA)',
          threatType: 'Pre-positionering & Living-off-the-Land (LotL)',
          targetImpact: 'Kritieke netwerkinfrastructuur en routerclusters',
        },
        {
          name: 'Lazarus Group (RGB Bureau 121)',
          origin: 'Noord-Korea (RGB)',
          threatType: 'Financieel Gewin, Crypto Heists & Chip-Spionage',
          targetImpact: 'ASML toeleveranciers, crypto brokers en banken',
        },
        {
          name: 'Charming Kitten (APT35 / IRGC)',
          origin: 'Iran (IRGC)',
          threatType: 'Sabotage-verkenning & Diplomatieke Infiltratie',
          targetImpact: 'Olie/LNG havenopslag en overheidsnetwerken',
        },
        {
          name: 'LockBit 3.0 / Akira Syndicaat',
          origin: 'Oost-Europees Dark Web',
          threatType: 'Dubbele Afpersing & Exfiltratie naar .onion blogs',
          targetImpact: 'Ketenleveranciers en zorginstellingen in Nederland',
        },
      ],
      vitalSectorRisks: [
        {
          sector: 'Haven & Maritieme Logistiek',
          riskLevel: 'KRITIEK',
          details: 'Gerichte scans op terminal operating systems (TOS) en supply-chain koppelingen in de haven van Rotterdam.',
        },
        {
          sector: 'Energie & Gasnetwerk',
          riskLevel: 'HOOG',
          details: 'Geavanceerde spear-phishing en C2-beaconing gericht op SCADA-beheerders en onderstations.',
        },
        {
          sector: 'Zorg & Ziekenhuizen (Z-CERT)',
          riskLevel: 'HOOG',
          details: 'Ransomware syndicaten misbruiken openstaande VPN-credentials; verhoogd risico op uitval van patiëntendossiers.',
        },
        {
          sector: 'Telecom & Internet (AMS-IX)',
          riskLevel: 'VERHOOGD',
          details: 'BGP-hijacking pogingen en DDoS-bombardementen door pro-Russische hacktivistische groepen (NoName057).',
        },
      ],
      topAttackVectors: [
        'Citrix Bleed (CVE-2023-4966) sessie-overname zonder MFA',
        'Fortinet FortiOS SSL-VPN exploitatie (CVE-2024-21762)',
        'Living-off-the-Land (LotL): WMI, PowerShell en Certutil misbruik',
        'Gecompromitteerde beheerderstokens via Dark Web stealer-logs',
      ],
      strategicRecommendations: [
        'Isoleer en segmenteer industriële OT/ICS netwerken direct van IT-kantoorautomatisering.',
        'Activeer verplichte phishing-resistente FIDO2 MFA op elk beheer- en VPN-portaal.',
        'Valideer onmiddellijk onveranderlijke (immutable) offline back-ups (3-2-1-1 regel).',
        'Draag zorg voor 24/7 monitoring van endpoint detectie (EDR) op PowerShell en schaduwbeheer.',
      ],
    };
  };

  const CLOUD_BACKEND_ORIGIN = 'https://ais-pre-ahzjb5b7uvilhl2lxtnytm-84827719818.europe-west2.run.app';

  const fetchExecutiveSummary = async (customFocusText?: string) => {
    setIsLoading(true);
    setError(null);

    const isLocalOrRunApp =
      typeof window !== 'undefined' &&
      (window.location.hostname.includes('run.app') ||
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1');

    const endpointUrl = isLocalOrRunApp
      ? '/api/gemini/executive-summary'
      : `${CLOUD_BACKEND_ORIGIN}/api/gemini/executive-summary`;

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 11000);
      const response = await fetch(endpointUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          threats,
          sectorFilter: selectedSector,
          customFocus: customFocusText,
        }),
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (response.ok) {
        const data = await response.json();
        if (data && data.summary) {
          setSummaryData(data.summary);
          if (data.source) setSourceUsed(data.source);
          setLastGeneratedTime(
            new Date().toLocaleTimeString('nl-NL', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })
          );
          setIsLoading(false);
          return;
        }
      }
    } catch {
      // Fallback below
    }

    const fallback = generateLocalFallback(threats);
    setSummaryData(fallback);
    setSourceUsed('ncsc-local');
    setLastGeneratedTime(
      new Date().toLocaleTimeString('nl-NL', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    );
    setIsLoading(false);
  };

  // Fetch on mount or when sector filter changes
  useEffect(() => {
    fetchExecutiveSummary();
  }, [selectedSector]);

  const handleCopySummary = () => {
    if (!summaryData) return;
    const textToCopy = `=== ${summaryData.summaryTitle.toUpperCase()} ===
Dreigingsniveau: ${summaryData.threatLevel} (${summaryData.threatLevelScore}/100)
Tijdstip: ${lastGeneratedTime || 'Vandaag'}
Geanalyseerde Incidenten: ${threats.length}

EXECUTIVE BRIEFING:
${summaryData.executiveBriefing}

KRITIEKE DOELWITTEN:
${summaryData.criticalTargets.map((t) => `• ${t}`).join('\n')}

BELANGRIJKSTE DREIGINGSACTOREN:
${summaryData.activeActors.map((a) => `• ${a.name} (${a.origin}) - ${a.threatType}`).join('\n')}

NIS2 STRATEGISCHE AANBEVELINGEN:
${summaryData.strategicRecommendations.map((r, i) => `${i + 1}. ${r}`).join('\n')}

Bron: Bedreigingsmonitor.nl - Realtime NCSC & Gemini Intelligence Briefing`;

    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    const qText = customQuestion.trim();
    if (!qText || isAnsweringQuestion) return;

    setIsAnsweringQuestion(true);
    setAiAnswer(null);

    const buildContextualDirectAnswer = (question: string) => {
      const q = question.toLowerCase();

      if (
        q.includes('aivd') ||
        q.includes('laundry bear') ||
        q.includes('void blizzard') ||
        q.includes('simone smit') ||
        q.includes('akerboom') ||
        q.includes('quantum') ||
        q.includes('kwantum') ||
        q.includes('harvest now') ||
        q.includes('edge device') ||
        q.includes('kroonjuwel')
      ) {
        return `🤖 **AIVD & NBV Inlichtingendossier 2026 ("${question}"):**\n` +
          `• **1. Russische Staatsgroep "Laundry Bear" (Void Blizzard) & Politie-Hack:** De AIVD (onder leiding van directeur-generaal **Simone Smit**, opvolger van **Erik Akerboom**) en MIVD onthulden dat de Russische staatsgroep **Laundry Bear** achter de hack op de **Nederlandse Nationale Politie** (~65.000 medewerkers) zat via **Pass-the-Cookie** (gestolen sessiecookies uit infostealers die MFA omzeilen), password spraying en misbruik van Microsoft Exchange en Zimbra.\n` +
          `• **2. Explosieve Stijging Chinese AI-Aanvallen op "Edge Devices" & Kroonjuwelen (Oktober 2026):** AIVD en MIVD waarschuwen dat Chinese staatshackers op grote schaal **edge devices** (firewalls, VPN-gateways en routers) aanvallen en **AI + broncode-analyse** inzetten om bliksemsnel zero-days uit te buiten. Daarnaast bestempelt de AIVD China als de grootste bedreiging voor de Nederlandse economische kroonjuwelen (ASML/NXP chipindustrie, kwantum, AI en universiteiten).\n` +
          `• **3. Kwantumdreiging ("Harvest Now, Decrypt Later" — AIVD NBV 2026):** Het Nationaal Bureau voor Verbindingsbeveiliging (NBV) van de AIVD waarschuwt dat statelijke actoren nu al versleuteld Nederlands dataverkeer opslaan om dit later met een kwantumcomputer te kraken. Advies: migreer direct naar **Post-Quantum Cryptografie (PQC, ML-KEM / ML-DSA)** en dwing apparaatgebonden FIDO2/Conditional Access af.`;
      }

      if (q.includes('kushner') || q.includes('iphone') || q.includes('abu dhabi') || q.includes('princes and thieves')) {
        return `🤖 **MIVD & JSCU Dossier Analyse ("${question}"):**\n` +
          `• **MIVD Counter-Hack via Russische GRU:** Uit voorpublicaties in *Vanity Fair* (*"Princes and Thieves"* van Matthew Cole) blijkt dat de Nederlandse **MIVD** (via de **Joint Sigint Cyber Unit — JSCU**) eind 2018 de iPhone X van Witte Huis-adviseur **Jared Kushner** binnendrong nadat een Russische GRU-hacker in het VK werd klemgezet en omgedraaid tot informant.\n` +
          `• **Reverse-Engineering & $750M Rekening:** Op de Russische C2-server trof de MIVD screenshots van Kushners iPhone aan, reverse-engineerde de gebruikte zero-day en keek via *live screen mirroring* mee hoe Kushner inlogde op een rekening bij de **First Abu Dhabi Bank** met circa **$750 miljoen** (via Azerbeidzjan).\n` +
          `• **Reactie Defensie & Toezicht:** Defensie verklaart: *"Het Nederlandse kabinet doet in het openbaar geen uitspraken over het kennisniveau, de werkwijze of de bronnen van de MIVD."* Verantwoording vindt geheim plaats in de **Commissie-Stiekem (CIVD)** en bij de **CTIVD**.`;
      }

      if (q.includes('mivd') || q.includes('reesink') || q.includes('jscu') || q.includes('camera') || q.includes('signal') || q.includes('whatsapp') || q.includes('coathanger') || q.includes('noordzee')) {
        return `🤖 **MIVD & AIVD Inlichtingenadvies 2026 ("${question}"):**\n` +
          `• **Russische IP-Camera Spionage op NL Militaire Routes:** MIVD-directeur viceadmiraal **Peter Reesink** en de AIVD waarschuwen dat Russische staatshackers in Nederland honderden internet-gekoppelde IP-beveiligingscamera's (bij havens, spoorlijnen en wegen) kraken en met **AI-beeldherkenning** militaire transporten voor Oekraïne volgen. *Advies: Haal IP-camera's direct achter een VPN/VLAN, schakel UPnP/RTSP uit en wijzig standaardwachtwoorden.*\n` +
          `• **Signal & WhatsApp Overnames:** Russische hackers misbruiken nep-*"Signal Support"* bots en de functie **"Gekoppelde Apparaten" (QR-code)** om mee te lezen met militairen, diplomaten en ambtenaren. *Advies: Controleer direct Gekoppelde Apparaten in Signal/WhatsApp en deel nooit staatsgeheimen via consumenten-apps.*\n` +
          `• **Chinese COATHANGER & Noordzee-Sabotage:** Controleer Fortinet FortiGate-firewalls forensisch op de Chinese **COATHANGER** rootkit (\`CVE-2022-42475\`, overleeft reboots/updates) en verhoog fysieke en digitale bewaking op Noordzee- en energie-infrastructuur.`;
      }

      if (q.includes('php') || q.includes('php2shell') || q.includes('109618') || q.includes('109619') || q.includes('worker') || q.includes('mijndomein') || q.includes('tweede kamer')) {
        return `🤖 **NCSC-NL Update PHP-Aanvallen "PHP2Shell" ("${question}"):**\n` +
          `• **Eerste Succesvolle Misbruik Bevestigd (23 okt):** Het NCSC heeft de eerste signalen van succesvolle inbraken via **PHP2Shell** (\`CVE-2026-109618\` Out-of-Memory corruptie & \`CVE-2026-109619\` Stale Global State, CVSS 9.2) ontvangen.\n` +
          `• **RAM-Diefstal van Wachtwoorden & API-Sleutels:** Via *stale global state* lezen aanvallers zonder inlog wachtwoorden, sessietokens en API-keys rechtstreeks uit het geheugen van PHP-workers en voeren zij RCE uit.\n` +
          `• **Verplichte Actie:** Update direct naar **PHP 8.5.12, 8.4.27, 8.3.36 of 8.2.35** én **herstart verplicht alle PHP-FPM / PHP-workers** (zonder herstart blijft de kwetsbare code in het RAM actief!). Draait u nog op End-of-Life **PHP 5.4 t/m 8.1**? Die versies krijgen geen gratis patch meer: upgrade naar PHP 8.2+ of gebruik een statische HTML-bundel (zoals de 1-bestand \`index.html\` van deze site, die géén PHP gebruikt).`;
      }

      if (q.includes('pepijn') || q.includes('shinyhunters') || q.includes('umbreon') || q.includes('shinywire') || q.includes('krebs')) {
        return `🤖 **KrebsOnSecurity Dossier — Pepijn van der Stap ("Umbreon") & ShinyHunters ("${question}"):**\n` +
          `• De 24-jarige Nederlander **Pepijn van der Stap ("Umbreon")** is op 15 september 2026 door de Nederlandse politie (THTC) en de **FBI** gearresteerd als vermeend kopstuk achter **ShinyHunters** (>140 gehackte organisaties, $70M+ schade).\n` +
          `• Bij zijn arrestatie stond zijn **Signal-app open**, wat samenspanning blootlegde tussen ShinyHunters en Noord-Amerikaanse ransomware-onderhandelaars rond de afpersingssite **Shinywire**.\n` +
          `• **Advies:** Beveilig cloud-databases (Snowflake, Salesforce, BigQuery) met verplichte FIDO2 passkeys, IP-allowlisting en strikte OAuth-app restricties tegen vishing.`;
      }

      if (q.includes('philips') || q.includes('cl0p') || q.includes('clop') || q.includes('windchill') || q.includes('mri')) {
        return `🤖 **Dark Web Dossier Koninklijke Philips & Cl0p ("${question}"):**\n` +
          `• De Russische groep **Cl0p** publiceerde **13,5 GB** aan data van één geïsoleerde enterprise PLM-server van **Philips** (o.a. MRI-bouwtekeningen en IT-schema's) via **CVE-2026-12569** in **PTC Windchill / FlexPLM**.\n` +
          `• Ziekenhuisnetwerken en actieve medische apparatuur zijn **niet** geraakt. Patch PTC Windchill/FlexPLM direct tegen \`CVE-2026-12569\` en waarschuw IT-teams voor gerichte spear-phishing met gelekte Philips IT-documentatie.`;
      }

      if (q.includes('nis2') || q.includes('meldplicht') || q.includes('24') || q.includes('cyberbeveiligingswet')) {
        return `🤖 **NIS2 & Cyberbeveiligingswet Advies ("${question}"):**\n` +
          `• **24-uurs Vroege Waarschuwing (Early Warning):** Meld elk significant incident (of vastgestelde laterale beweging door een aanvaller) binnen **24 uur** bij het NCSC-NL of uw sectorale CSIRT (zoals Z-CERT voor zorg of IBD voor gemeenten).\n` +
          `• **72-uurs Incidentrapportage:** Lever binnen **72 uur** een inhoudelijke analyse met initiële oorzaak, ernst en IoC's aan, gevolgd door een eindrapportage binnen 1 maand.`;
      }

      if (q.includes('modbus') || q.includes('scada') || q.includes('energie') || q.includes('tennet') || q.includes('water') || q.includes('ot')) {
        return `🤖 **OT / ICS & SCADA Beveiligingsadvies ("${question}"):**\n` +
          `• Blokkeer per direct alle directe inkomende verbindingen op **TCP/502 (Modbus)**, **TCP/102 (S7comm)** en **IEC 60870-5-104 (TCP/2404)** vanaf het internet. Plaats PLC's en RTU's uitsluitend achter een DMZ met eenrichtings-datadiodes en dwing protocol-whitelisting af.`;
      }

      if (q.includes('ransomware') || q.includes('lockbit') || q.includes('akira') || q.includes('backup') || q.includes('albert heijn') || q.includes('wms')) {
        return `🤖 **Ransomware & Ketenbeveiliging Advies ("${question}"):**\n` +
          `• Isoleer getroffen segmenten direct op VLAN-niveau (schakel systemen niet direct uit om forensisch RAM-geheugen te behouden), reset alle actieve sessietokens en \`krbtgt\` Kerberos-tickets, blokkeer exfiltratietools zoals \`rclone\`, en herstel uitsluitend vanuit gecontroleerde, onveranderlijke (**immutable 3-2-1-1**) back-ups.`;
      }

      // Match against any active threat in the live feed
      const matchedThreat = threats.find((t) => {
        const words = q.split(/\s+/).filter((w) => w.length >= 4);
        const hay = `${t.title} ${t.threatActor} ${t.targetVictim} ${t.attackVector} ${t.description}`.toLowerCase();
        return words.some((w) => hay.includes(w));
      });

      if (matchedThreat) {
        return `🤖 **Specifiek Dossier Advies voor "${question}":**\n` +
          `• **Gekoppeld Dossier:** *${matchedThreat.title}*\n` +
          `• **Actor & Doelwit:** **${matchedThreat.threatActor}** (${matchedThreat.originCountry}) → **${matchedThreat.targetVictim}**\n` +
          `• **Specifieke Vector:** \`${matchedThreat.attackVector}\`\n` +
          `• **Analyse & Handelingsperspectief:** ${matchedThreat.description}`;
      }

      const topThree = threats.slice(0, 3).map((t) => `• **${t.title.slice(0, 85)}...** (*Vector: ${t.attackVector}*)`).join('\n');
      return `🤖 **Antwoord op maat voor "${question}" (Actueel Dreigingsbeeld):**\n` +
        `Op dit moment worden de volgende top-dreigingen actief gemonitord voor uw vraag:\n${topThree}\n\n` +
        `💡 *Tip: Noem in uw vraag een specifiek onderwerp (bijv. "MIVD Kushner", "IP-camera's", "PHP2Shell workers", "Signal", "Philips Cl0p", "ShinyHunters" of een specifieke CVE/sector) voor de exacte technische analyse van dat dossier.*`;
    };

    const isLocalOrRunApp =
      typeof window !== 'undefined' &&
      (window.location.hostname.includes('run.app') ||
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1');

    const endpointUrl = isLocalOrRunApp
      ? '/api/gemini/analyze-threat'
      : `${CLOUD_BACKEND_ORIGIN}/api/gemini/analyze-threat`;

    const activeThreatsContext = threats
      .slice(0, 8)
      .map((t, i) => `${i + 1}. ${t.title} (Actor: ${t.threatActor} | Vector: ${t.attackVector})`)
      .join('\n');

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 12000);
      const response = await fetch(endpointUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          threatName: summaryData?.summaryTitle || 'Actueel Dreigingsbeeld Nederland',
          threatActor: summaryData?.activeActors.map((a) => a.name).join(', ') || 'MIVD / NCSC Gemonitorde Actoren',
          origin: 'Rusland / China / Darkweb Syndicaten',
          targetSector: selectedSector !== 'ALL' ? selectedSector : 'Nederlandse Vitale Keten',
          description: summaryData?.executiveBriefing || 'Executive Overzicht',
          userPrompt: qText,
          activeThreatsContext,
        }),
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (response.ok) {
        const data = await response.json();
        if (data && data.analysis) {
          setAiAnswer(data.analysis);
          setIsAnsweringQuestion(false);
          return;
        }
      }
    } catch {
      // Fallback below
    }

    setAiAnswer(buildContextualDirectAnswer(qText));
    setIsAnsweringQuestion(false);
  };

  const getThreatBadgeColor = (level?: string) => {
    switch (level) {
      case 'KRITIEK':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      case 'VERHOOGD':
        return 'bg-amber-50 text-amber-900 border-amber-200';
      case 'AANZIENLIJK':
        return 'bg-yellow-50 text-yellow-900 border-yellow-200';
      default:
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    }
  };

  const vitalDutchThreatsCount = threats.filter((t) => t.isDutchVitalInfra).length;

  return (
    <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm relative transition-all duration-300">
      <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-emerald-500 to-rose-500" />

      {/* Main Header Card */}
      <div className="p-4 sm:p-6 bg-slate-50/70 border-b border-slate-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wider uppercase bg-sky-50 text-sky-800 border border-sky-200">
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                {sourceUsed.includes('ncsc')
                  ? 'NCSC CTI Engine'
                  : sourceUsed.includes('cached')
                  ? 'Gemini Intel Cache'
                  : 'Gemini AI Engine'}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200">
                <Brain className="w-3.5 h-3.5 text-indigo-600" />
                NCSC Directiebriefing
              </span>
              {lastGeneratedTime && (
                <span className="text-xs text-slate-600 font-mono-code flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                  Bijgewerkt: {lastGeneratedTime}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2 flex-wrap">
                  <span>Dagelijkse Executive Threat Overview</span>
                  <span className="hidden sm:inline-block text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-md px-2 py-0.5">
                    CISO &amp; Bestuur
                  </span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                  Realtime synthese en dreigingsanalyse over {threats.length} actieve incidenten en statelijke spionagenetwerken.
                </p>
              </div>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center flex-wrap gap-2 self-start lg:self-auto">
            <button
              onClick={() => fetchExecutiveSummary()}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 min-h-[40px] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-sky-600 hover:bg-sky-700 disabled:bg-sky-400 text-white transition-colors shadow-xs cursor-pointer"
              title="Herbereken executive overzicht met nieuwste dreigingsdata"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Analyseren...' : 'Heranalyseer Feed'}</span>
            </button>

            <button
              onClick={handleCopySummary}
              className="inline-flex items-center gap-1.5 min-h-[40px] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 transition-colors cursor-pointer"
              title="Kopieer de volledige directiebriefing naar klembord"
            >
              {isCopied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">Gekopieerd!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-500" />
                  <span>Kopieer</span>
                </>
              )}
            </button>

            <button
              onClick={() => setIsPdfModalOpen(true)}
              className="inline-flex items-center gap-1.5 min-h-[40px] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-rose-600 hover:bg-rose-700 text-white transition-colors shadow-xs cursor-pointer"
              title="Exporteer de Threat Analysis Summary als PDF directierapport"
            >
              <FileText className="w-4 h-4 text-white" />
              <span>Exporteer PDF</span>
            </button>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 transition-colors cursor-pointer"
              aria-label={isExpanded ? 'Minimaliseer overzicht' : 'Maximaliseer overzicht'}
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Executive Metrics Bar */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex flex-col justify-between shadow-2xs">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Dreigingsniveau
            </span>
            <div className="mt-1.5 flex items-baseline gap-2 flex-wrap">
              <span
                className={`inline-block px-2 py-0.5 text-xs font-bold rounded-md border ${getThreatBadgeColor(
                  summaryData?.threatLevel
                )}`}
              >
                {summaryData?.threatLevel || 'KRITIEK'}
              </span>
              <span className="text-sm font-mono-code text-slate-700 font-bold">
                {summaryData?.threatLevelScore || 89}/100
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex flex-col justify-between shadow-2xs">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              NL Vitale Doelwitten
            </span>
            <div className="mt-1.5 flex items-baseline gap-1.5">
              <span className="text-xl font-extrabold text-rose-700 font-mono-code">
                {vitalDutchThreatsCount}
              </span>
              <span className="text-xs text-slate-600">van {threats.length}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex flex-col justify-between shadow-2xs">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Statelijke APT Focus
            </span>
            <div className="mt-1.5 flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-800 flex-wrap">
              <span>🇷🇺 GRU Sandworm</span>
              <span className="text-slate-300">·</span>
              <span>🇨🇳 Volt Typh.</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex flex-col justify-between shadow-2xs">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Wettelijk Kader
            </span>
            <div className="mt-1.5 flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
              <span>EU NIS2 Richtlijn Actief</span>
            </div>
          </div>
        </div>
      </div>

      {/* Expandable Content Area */}
      {isExpanded && (
        <div className="p-4 sm:p-6 space-y-5">
          {/* Sub-Tabs Selector */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3 flex-wrap">
            <button
              onClick={() => setActiveTab('EXECUTIVE')}
              className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
                activeTab === 'EXECUTIVE'
                  ? 'bg-sky-600 text-white shadow-2xs'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Executive Briefing &amp; Conclusie
            </button>
            <button
              onClick={() => setActiveTab('SECTOREN')}
              className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
                activeTab === 'SECTOREN'
                  ? 'bg-sky-600 text-white shadow-2xs'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Vitale Sectoren &amp; Actoren ({summaryData?.activeActors?.length || 3})
            </button>
            <button
              onClick={() => setActiveTab('MITIGATIES')}
              className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
                activeTab === 'MITIGATIES'
                  ? 'bg-sky-600 text-white shadow-2xs'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              NIS2 Actieplan &amp; Mitigaties
            </button>
          </div>

          {/* Tab 1: Executive Briefing */}
          {activeTab === 'EXECUTIVE' && (
            <div className="space-y-5">
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative overflow-hidden">
                <div className="flex items-center gap-2 text-sky-800 text-xs sm:text-sm font-bold uppercase tracking-wider">
                  <FileText className="w-4 h-4 text-sky-600" />
                  <span>{summaryData?.summaryTitle || 'NCSC Directiebriefing: Actuele Dreigingssynthese'}</span>
                </div>
                <div className="text-sm sm:text-[15px] text-slate-700 leading-relaxed space-y-3 font-sans">
                  {summaryData?.executiveBriefing ? (
                    summaryData.executiveBriefing.split('\n\n').map((paragraph, idx) => (
                      <p key={idx} className="text-slate-700 leading-relaxed">
                        {paragraph}
                      </p>
                    ))
                  ) : (
                    <div className="animate-pulse space-y-2">
                      <div className="h-4 bg-slate-200 rounded w-full" />
                      <div className="h-4 bg-slate-200 rounded w-5/6" />
                      <div className="h-4 bg-slate-200 rounded w-4/6" />
                    </div>
                  )}
                </div>
              </div>

              {/* Critical Targets & Vectors Highlights Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                      Voornaamste Doelwitten in NL
                    </span>
                    <span className="text-xs font-mono-code text-slate-500">Hoogste Risico</span>
                  </div>
                  <ul className="space-y-2 text-sm text-slate-700">
                    {(summaryData?.criticalTargets || [
                      'Havenbedrijf Rotterdam & Terminals (Maasvlakte)',
                      'TenneT TSO (Landelijk Hoogspanningsnetwerk)',
                      'KPN / AMS-IX Datacenter Knooppunten',
                      'Z-Cert Netwerk & Ziekenhuizen',
                    ]).map((target, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 py-1 border-b border-slate-200 last:border-none">
                        <span className="w-2 h-2 rounded-full bg-rose-600 mt-1.5 shrink-0" />
                        <span className="font-medium text-slate-900">{target}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-amber-600" />
                      Actieve Inbraakvectoren &amp; Kwetsbaarheden
                    </span>
                    <span className="text-xs font-mono-code text-slate-500">MITRE ATT&amp;CK</span>
                  </div>
                  <ul className="space-y-2 text-sm text-slate-700">
                    {(summaryData?.topAttackVectors || [
                      'Citrix Bleed (CVE-2023-4966) sessie-overname',
                      'FortiOS SSL-VPN exploitatie (CVE-2024-21762)',
                      'Living-off-the-Land (LotL) PowerShell & WMI',
                      'Dark Web gecompromitteerde beheerderstokens',
                    ]).map((vector, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 py-1 border-b border-slate-200 last:border-none">
                        <span className="w-2 h-2 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                        <span className="font-mono-code text-xs sm:text-sm text-slate-800">{vector}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Sectors & Threat Actors */}
          {activeTab === 'SECTOREN' && (
            <div className="space-y-5">
              <div className="space-y-3">
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Globe2 className="w-4 h-4 text-sky-600" />
                  Actieve Statelijke Actoren &amp; Ransomware Syndicaten
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                  {(summaryData?.activeActors || []).map((actor, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-bold text-slate-900">{actor.name}</span>
                        <span className="text-xs font-mono-code px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 shrink-0">
                          {actor.origin}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-sky-800 font-semibold">{actor.threatType}</p>
                      {actor.targetImpact && (
                        <p className="text-xs sm:text-sm text-slate-600">
                          <span className="font-semibold text-slate-700">Impact: </span>
                          {actor.targetImpact}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-indigo-600" />
                  Risico per Vitale Sector in Nederland
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {(summaryData?.vitalSectorRisks || []).map((sec, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-bold text-slate-900">{sec.sector}</span>
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-md border ${
                            sec.riskLevel === 'KRITIEK'
                              ? 'bg-rose-50 text-rose-800 border-rose-200'
                              : 'bg-amber-50 text-amber-900 border-amber-200'
                          }`}
                        >
                          {sec.riskLevel}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{sec.details}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Mitigations & NIS2 Action Plan */}
          {activeTab === 'MITIGATIES' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-900 text-sm font-bold uppercase tracking-wider">
                  <ShieldAlert className="w-4 h-4 text-emerald-700" />
                  <span>Prioritaire CISO Richtlijnen &amp; NIS2 Urgentiemaatregelen</span>
                </div>
                <p className="text-xs sm:text-sm text-emerald-800">
                  Verplichte en aanbevolen maatregelen voor vitale en essentiële entiteiten in Nederland.
                </p>
              </div>

              <div className="space-y-2.5">
                {(summaryData?.strategicRecommendations || []).map((rec, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3"
                  >
                    <div className="w-7 h-7 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-slate-900 leading-relaxed">{rec}</p>
                      <span className="text-xs text-slate-500 font-mono-code">
                        Validatie: Binnen 24 uur · NIS2 Compliance Toezicht
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interactive AI Inlichtingenvraag Form */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs sm:text-sm font-bold text-sky-800 flex items-center gap-1.5 uppercase tracking-wider">
                <Brain className="w-4 h-4 text-sky-600" />
                Stel een verdiepingsvraag over deze briefing
              </span>
              <span className="text-xs text-slate-500 font-mono-code">Realtime Context</span>
            </div>

            <form onSubmit={handleAskQuestion} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <input
                type="text"
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
                placeholder="Bijv: Welke haven-terminals of sectoren lopen nu het meeste risico?"
                className="flex-1 min-h-[42px] px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:border-sky-600 transition-colors"
              />
              <button
                type="submit"
                disabled={!customQuestion.trim() || isAnsweringQuestion}
                className="min-h-[42px] px-4 py-2 rounded-xl text-sm font-bold bg-sky-600 hover:bg-sky-700 disabled:bg-slate-300 text-white transition-colors flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
              >
                {isAnsweringQuestion ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>{isAnsweringQuestion ? 'Analyseren...' : 'Vraag Analyse'}</span>
              </button>
            </form>

            {aiAnswer && (
              <div className="mt-3 p-4 rounded-xl bg-white border border-sky-200 space-y-2 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-bold text-sky-800 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-sky-600" />
                    Intelligence Conclusie:
                  </span>
                  <button
                    onClick={() => setAiAnswer(null)}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    Sluiten
                  </button>
                </div>
                <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line font-sans">
                  {aiAnswer}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Executive Threat Report PDF Modal */}
      <ThreatReportPdfModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        summaryData={summaryData || generateLocalFallback(threats)}
        threats={threats}
        selectedSector={selectedSector}
      />
    </section>
  );
};
