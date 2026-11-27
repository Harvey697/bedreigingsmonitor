import React, { useState, useMemo, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Gauge,
  AlertTriangle,
  CheckCircle2,
  Radio,
  Lock,
  Activity,
  FileWarning,
  RefreshCw,
  ExternalLink,
  Copy,
  Check,
  Terminal,
  FolderGit2,
} from 'lucide-react';
import {
  NCSC_NL_GITHUB_REPOS,
  NcscGithubRepoItem,
  fetchLiveNcscGithubRepos,
} from '../utils/liveThreatFeedSync';

export interface NcscAdvisoryItem {
  id: string;
  advisoryCode: string;
  title: string;
  chanceLevel: 'LAAG' | 'MIDDEL' | 'HOOG';
  damageLevel: 'LAAG' | 'MIDDEL' | 'HOOG';
  gaugeScore: number; // 0 - 100
  statusLabel: string;
  targetSectors: string;
  cveRef: string;
  publishedAt: string;
  summary: string;
  mitigationSteps: string[];
}

const NCSC_ADVISORIES: NcscAdvisoryItem[] = [
  {
    id: 'ncsc-2026-0421-php2shell',
    advisoryCode: 'NCSC-2026-0421 (UPDATE 27 OKT)',
    title: 'UPDATE PHP2Shell (CVE-2026-109618 & 109619): BNR & IBD/VNG vinden nog ruim 50 kwetsbare Nederlandse gemeentewebsites; CISA plaatst lekken op KEV-lijst & Amazon onthult zero-day misbruik sinds 17 okt',
    chanceLevel: 'HOOG',
    damageLevel: 'HOOG',
    gaugeScore: 99,
    statusLabel: 'CISA KEV DEADLINE 29 OKT • 50+ GEMEENTEN NOG KWETSBAAR',
    targetSectors: '50+ Gemeentelijke Subdomeinen (IBD/VNG), Webhosters (Mijndomein), Rijksoverheid (Tweede Kamer / NCSC) & Ongepatchte PHP 5.4–8.x Servers',
    cveRef: 'CVE-2026-109618 (OOM) & CVE-2026-109619 (Stale State) • CVSS 9.2',
    publishedAt: '27 oktober 2026 (Update BNR / IBD-VNG & CISA KEV)',
    summary:
      'Laatste update 27 oktober 2026: (1) Uit een scan van BNR Nieuwsradio onder 900+ gemeentelijke websites en subdomeinen blijkt dat nog altijd ruim 50 Nederlandse gemeentewebsites (vooral subdomeinen voor toerisme, asielopvang en lokale subsidies) op kwetsbare PHP-versies draaien; de IBD (VNG) heeft deze gemeenten gewaarschuwd. (2) Op 26 oktober heeft CISA beide CVE\'s op de Known Exploited Vulnerabilities (KEV) lijst geplaatst (patch-deadline 29 okt) en onthulde Amazon Threat Intelligence dat zero-day misbruik al op 17 oktober 2026 begon — vier dagen vóór de noodpatch van 21 oktober. (3) Het NCSC bevestigde op 23 oktober succesvol misbruik waarbij aanvallers zowel RCE uitvoeren als API-sleutels en wachtwoorden uit het RAM-geheugen (stale global state) stelen.',
    mitigationSteps: [
      'Upgrade ONMIDDELLIJK naar PHP 8.5.12, PHP 8.4.27, PHP 8.3.36 of PHP 8.2.35 en HERSTART direct alle PHP-FPM / PHP-workers (zonder herstart blijft kwetsbare code én gelekte state in het RAM-geheugen actief!).',
      'Controleer specifiek alle gemeentelijke en zakelijke subdomeinen (campagnesites, subsidieportalen, testomgevingen) die buiten het centrale CMS-beheer vallen.',
      'Roteer alle API-sleutels, database-wachtwoorden en sessietokens op servers die tussen 17 oktober en het moment van patchen publiek bereikbaar waren.',
    ],
  },
  {
    id: 'ncsc-2026-0425-brotli-node2shell',
    advisoryCode: 'NCSC-2026-0425 (NIEUW)',
    title: 'Kritiek NCSC-NL Advies ("Node2Shell / HTTP2Shell" — CVE-2026-111497): Buffer-overflow & RCE in Google Brotli decompressie (CVSS 8.8) treft Node.js, Python, .NET en Windows PHP cURL',
    chanceLevel: 'HOOG',
    damageLevel: 'HOOG',
    gaugeScore: 95,
    statusLabel: 'HOGE KANS / HOGE SCHADE • PATCH NAAR BROTLI 1.2.1',
    targetSectors: 'Node.js, Python, .NET & Windows PHP cURL omgevingen, API-Gateways, Reverse Proxies & Cloud-Platformen',
    cveRef: 'CVE-2026-111497 (Google Brotli v1.0.3 t/m 1.2.0) • CVSS 8.8',
    publishedAt: '26 oktober 2026 (Officiële NCSC-NL Publicatie)',
    summary:
      'Op 26 oktober 2026 heeft het NCSC-NL een beveiligingsadvies met classificatie "Hoge kans / Hoge schade" uitgebracht voor CVE-2026-111497 ("Node2Shell" / "HTTP2Shell", CVSS 8.8). Een integer overflow en out-of-bounds write in de Google Brotli-decompressiebibliotheek (v1.0.3–1.2.0) stelt aanvallers in staat om via een kwaadaardig gecomprimeerd HTTP-request of response ("Content-Encoding: br") een applicatie-crash (DoS) of Remote Code Execution (RCE) te veroorzaken in Node.js, Python, .NET en Windows PHP cURL.',
    mitigationSteps: [
      'Update de Google Brotli-bibliotheek en afhankelijke runtimes (Node.js, Python brotli-module, .NET en Windows PHP libcurl) direct naar Brotli 1.2.1 (of backports 1.1.1 / 1.0.10).',
      'Blokkeer of strip als tijdelijke noodmaatregel op de loadbalancer, API-gateway of WAF inkomende HTTP-requests met de header "Content-Encoding: br".',
      'Herstart na het bijwerken van gedeelde systeembibliotheken (`libbrotlidec`) alle draaiende web- en applicatieprocessen.',
    ],
  },
  {
    id: 'eff-secnl-2026-13000-cves',
    advisoryCode: 'CTI-2026-AI-CVE',
    title: 'EFF & Security.NL Alarm: Explosie van ~13.000 nieuwe CVE-kwetsbaarheden in oktober 2026 alleen al (~3% van alle CVE\'s sinds 1999) door grootschalige AI-inzet',
    chanceLevel: 'HOOG',
    damageLevel: 'HOOG',
    gaugeScore: 93,
    statusLabel: 'HISTORISCHE AI ZERO-DAY GOLF • ~13.000 CVE\'S IN 1 MAAND',
    targetSectors: 'Alle NIS2-plichtige Sectoren, SOC/CSIRT-Teams, Softwareleveranciers & Beheerders van Edge-Apparatuur',
    cveRef: 'Oktober 2026 CVE-Explosie (~13.000 CVE\'s) • AI-Driven Vulnerability Discovery',
    publishedAt: '26 oktober 2026 (EFF & Security.NL Analyse)',
    summary:
      'Onderzoek van de Electronic Frontier Foundation (EFF) en Security.NL op 26 oktober 2026 toont aan dat er in oktober 2026 alleen al circa 13.000 nieuwe CVE-kwetsbaarheden zijn geregistreerd — ongeveer 3% van alle CVE\'s die ooit sinds 1999 zijn uitgegeven. Deze explosie wordt veroorzaakt door geavanceerde AI-modellen en autonome fuzzers die op grote schaal broncode doorzoeken, precies zoals de AIVD en MIVD op 24 oktober waarschuwden bij Chinese aanvallen op edge devices.',
    mitigationSteps: [
      'Automatiseer patch-management en kwetsbaarheidsscanning: handmatige maandelijkse patchcycli zijn niet langer bestand tegen AI-versnelde zero-day exploitatie.',
      'Pas het "Assume Breach" en Zero Trust principe toe op alle internetgerichte randapparatuur (firewalls, VPN\'s, API-gateways) en beperk blootgestelde services tot het absolute minimum.',
      'Prioriteer patches strikt op basis van actieve exploitatie (CISA KEV, NCSC-NL Hoge Kans/Hoge Schade en EPSS-scores).',
    ],
  },
  {
    id: 'aivd-nbv-2026-dossier',
    advisoryCode: 'AIVD-NBV-2026-01',
    title: 'AIVD & MIVD Cyberadvies (DG Simone Smit / Erik Akerboom): Explosieve stijging Chinese AI-aanvallen op Edge Devices, Russische "Laundry Bear" (Politie-hack) & Quantum ("Harvest Now, Decrypt Later")',
    chanceLevel: 'HOOG',
    damageLevel: 'HOOG',
    gaugeScore: 98,
    statusLabel: 'AIVD / NBV ALARM • CHINA AI EDGE, LAUNDRY BEAR & QUANTUM',
    targetSectors: 'Nederlandse Kroonjuwelen (ASML / NXP / Kwantum / Universiteiten), Nationale Politie & Rijksoverheid, Netwerk Edge Devices (Firewalls/VPN\'s)',
    cveRef: 'Edge Device AI Zero-Days • Pass-the-Cookie (Laundry Bear) • PQC (ML-KEM / ML-DSA)',
    publishedAt: '24 oktober 2026 (AIVD / Min. van BZK Publicatie)',
    summary:
      'Dreigingsbeeld van de Algemene Inlichtingen- en Veiligheidsdienst (AIVD, onder leiding van directeur-generaal Simone Smit, opvolger van Erik Akerboom) en het Nationaal Bureau voor Verbindingsbeveiliging (NBV): (1) AIVD en MIVD waarschuwen voor een sterke stijging van Chinese cyberaanvallen op "edge devices" (firewalls, VPN-gateways en routers), waarbij Chinese staatshackers westerse broncode bestuderen en AI inzetten om bliksemsnel zero-days te vinden; (2) De AIVD en MIVD ontmaskerden de Russische staatsgroep "Laundry Bear" (Void Blizzard) achter de hack op de Nederlandse Politie (~65.000 medewerkers) via Pass-the-Cookie sessiekaping; (3) Het AIVD/NBV waarschuwt ("Bescherm je nu tegen de dreiging van quantumcomputers") tegen "Harvest Now, Decrypt Later" onderschepping.',
    mitigationSteps: [
      'CHINESE AI-AANVALLEN OP EDGE DEVICES: Vervang End-of-Life firewalls, VPN-gateways en loadbalancers direct, schakel externe beheerinterfaces (WAN management) uit en activeer centrale EDR/SIEM-telemetrie op netwerkrandapparatuur.',
      'LAUNDRY BEAR (VOID BLIZZARD) & PASS-THE-COOKIE: Dwing phishing-resistente FIDO2/WebAuthn authenticatie en apparaatgebonden Conditional Access (Token Binding / Device Compliance) af zodat gestolen sessiecookies uit infostealers onbruikbaar zijn.',
      'POST-QUANTUM CRYPTOGRAFIE (AIVD NBV ADVIES): Inventariseer staats- en bedrijfsgeheimen met een lange geheimhoudingstermijn en start de migratie van RSA/ECC naar Post-Quantum Cryptografie (ML-KEM / Kyber en hybride TLS).',
    ],
  },
  {
    id: 'mivd-jscu-2026-dossier',
    advisoryCode: 'MIVD-JSCU-2026-01',
    title: 'MIVD & AIVD Inlichtingenbulletin (Viceadmiraal Peter Reesink): Russische AI-spionage via IP-camera\'s op NL militaire routes, Signal/WhatsApp-kapingen, Noordzee-sabotage & Kushner/GRU-operatie',
    chanceLevel: 'HOOG',
    damageLevel: 'HOOG',
    gaugeScore: 97,
    statusLabel: 'MIVD / JSCU ALERT • GRIJZE ZONE & CONTRASPIONAGE',
    targetSectors: 'Defensie & Militaire Logistiek (Havens/Spoor/Wegen), Noordzee-Infrastructuur (Kabels/Gas/Wind), Rijksoverheid & High-Tech (ASML/NXP)',
    cveRef: 'IP-Camera RTSP/ONVIF • Signal Linked Devices • CVE-2022-42475 (COATHANGER) • iOS Zero-Day',
    publishedAt: '23 oktober 2026 (MIVD Dossier & Defensie Reactie)',
    summary:
      'Gecombineerd dreigingsbeeld van de Militaire Inlichtingen- en Veiligheidsdienst (MIVD, directeur viceadmiraal Peter Reesink) en de Joint Sigint Cyber Unit (JSCU): (1) Russische inlichtingendiensten hacken in Nederland internet-gekoppelde IP-beveiligingscamera\'s langs militaire transportcorridors en gebruiken AI-beeldherkenning om Oekraïne-steun te volgen; (2) Russische hackers kapen Signal- en WhatsApp-accounts van Nederlandse militairen, diplomaten en ambtenaren via nep-"Signal Support" bots en "Gekoppelde Apparaten" QR-codes; (3) Permanente Russische voorbereidingen op Noordzee-sabotage onder de NAVO Artikel 5-drempel; (4) Vanity Fair-onthulling over de MIVD/JSCU counter-hack op de GRU en de iPhone X van Jared Kushner ($750M Dubai-rekening).',
    mitigationSteps: [
      'IP-CAMERA\'S LANGS LOGISTIEKE ROUTES & HAVENS: Haal beveiligings- en overzichtscamera\'s rondom havens, spoorwegen, kazernes en distributiecentra direct van het publieke internet (plaats achter VPN/VLAN) en wijzig standaardwachtwoorden.',
      'SIGNAL & WHATSAPP BEVEILIGING: Controleer in Signal en WhatsApp direct "Gekoppelde Apparaten" (Linked Devices) op onbekende sessies en deel NOOIT gerubriceerde of staatsgeheime informatie via consumenten-chatapps.',
      'FORTIGATE & EDGE-APPLIANCES (CHINESE COATHANGER RAT): Voer forensische integriteitscontroles uit op Fortinet FortiGate-firewalls en core-routers volgens het MIVD/NCSC herstelprotocol.',
    ],
  },
  {
    id: 'ncsc-2026-0420-philips',
    advisoryCode: 'NCSC-2026-0420',
    title: 'Cl0p Dark Web Publicatie Koninklijke Philips (13,5 GB) & Shell via PTC Windchill (CVE-2026-12569)',
    chanceLevel: 'HOOG',
    damageLevel: 'HOOG',
    gaugeScore: 92,
    statusLabel: 'KRITIEK • DARK WEB LEK BEVESTIGD (20 OKT)',
    targetSectors: 'Medische Technologie (Philips), Energiesector (Shell), High-Tech Maakindustrie & Zorgketen',
    cveRef: 'CVE-2026-12569 (PTC Windchill / FlexPLM)',
    publishedAt: '20 oktober 2026 (NCSC-NL & Z-CERT Verificatie)',
    summary:
      'De Russische afpersingsgroep Cl0p heeft op 20 oktober 2026 13,5 GB aan interne Philips-data (waaronder bouwtekeningen van MRI-scanners en IT-infrastructuur) én PLM-documentatie van Shell op het dark web gepubliceerd na exploitatie van CVE-2026-12569 in PTC Windchill/FlexPLM. Philips en Z-CERT bevestigen dat uitsluitend één geïsoleerde enterprise-server is geraakt en ziekenhuisnetwerken niet zijn gecompromitteerd.',
    mitigationSteps: [
      'Patch alle PTC Windchill en FlexPLM servers onmiddellijk tegen CVE-2026-12569 en isoleer PLM-systemen van het publieke internet.',
      'Controleer op verdachte gegevensuitvoer en ongeautoriseerde toegang vanaf augustus 2026 op PLM- en CAD-omgevingen.',
      'Wees alert op gerichte spear-phishing richting ziekenhuis-IT en biomedische technici op basis van de gelekte Philips IT-documentatie.',
    ],
  },
];

export const NcscStatusBoard: React.FC = () => {
  const [selectedAdvisoryId, setSelectedAdvisoryId] = useState<string>(NCSC_ADVISORIES[0].id);

  const activeAdvisory = useMemo(() => {
    return NCSC_ADVISORIES.find((a) => a.id === selectedAdvisoryId) || NCSC_ADVISORIES[0];
  }, [selectedAdvisoryId]);

  // SVG Gauge Math (Semi-circle from -90deg to +90deg)
  const score = activeAdvisory.gaugeScore;
  const clampedScore = Math.max(0, Math.min(100, score));
  const needleAngleDeg = -90 + (clampedScore / 100) * 180;

  // Helper to convert polar angle (-90 to +90 where 0 is top) to SVG cartesian coordinates
  const polarToCartesian = (cx: number, cy: number, r: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: cx + r * Math.cos(angleInRadians),
      y: cy + r * Math.sin(angleInRadians),
    };
  };

  const describeGaugeArc = (cx: number, cy: number, r: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(cx, cy, r, endAngle);
    const end = polarToCartesian(cx, cy, r, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    return ['M', start.x, start.y, 'A', r, r, 0, largeArcFlag, 0, end.x, end.y].join(' ');
  };

  const getScoreTheme = (val: number) => {
    if (val >= 80) {
      return {
        color: '#e11d48',
        textClass: 'text-rose-700',
        borderClass: 'border-rose-200',
        bgClass: 'bg-rose-50',
        levelName: 'KRITIEK (HOOG / HOOG)',
      };
    }
    if (val >= 65) {
      return {
        color: '#ea580c',
        textClass: 'text-orange-700',
        borderClass: 'border-orange-200',
        bgClass: 'bg-orange-50',
        levelName: 'ERNSTIG (MIDDEL / HOOG)',
      };
    }
    if (val >= 40) {
      return {
        color: '#d97706',
        textClass: 'text-amber-800',
        borderClass: 'border-amber-200',
        bgClass: 'bg-amber-50',
        levelName: 'VERHOOGD (MIDDEL / MIDDEL)',
      };
    }
    return {
      color: '#059669',
      textClass: 'text-emerald-700',
      borderClass: 'border-emerald-200',
      bgClass: 'bg-emerald-50',
      levelName: 'BASIS (LAAG / LAAG)',
    };
  };

  const [showGithubHub, setShowGithubHub] = useState<boolean>(true);
  const [githubRepos, setGithubRepos] = useState<NcscGithubRepoItem[]>(NCSC_NL_GITHUB_REPOS);
  const [githubFilter, setGithubFilter] = useState<'ALL' | 'IOC_SCANNER' | 'CRISIS_DOSSIER'>('ALL');
  const [copiedRepoId, setCopiedRepoId] = useState<string | null>(null);
  const [isSyncingGithub, setIsSyncingGithub] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;
    fetchLiveNcscGithubRepos().then((repos) => {
      if (mounted && repos.length > 0) {
        setGithubRepos(repos);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const handleSyncGithub = async () => {
    setIsSyncingGithub(true);
    const repos = await fetchLiveNcscGithubRepos();
    setGithubRepos(repos);
    setIsSyncingGithub(false);
  };

  const handleCopyClone = (repoId: string, cmd: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(cmd).catch(() => {});
    }
    setCopiedRepoId(repoId);
    setTimeout(() => setCopiedRepoId(null), 2000);
  };

  const filteredGithubRepos = useMemo(() => {
    if (githubFilter === 'ALL') return githubRepos;
    return githubRepos.filter((r) => r.category === githubFilter);
  }, [githubRepos, githubFilter]);

  const theme = getScoreTheme(clampedScore);

  return (
    <section
      aria-label="NCSC-NL Status Board"
      className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm"
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                NCSC-NL, AIVD &amp; MIVD Beveiligingsadviezen
              </h2>
              <span className="text-xs font-mono-code text-rose-700 font-semibold">
                · Actuele Dossiers &amp; Handelingsperspectief
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <button
            type="button"
            onClick={() => setShowGithubHub(!showGithubHub)}
            className="min-h-[38px] px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-sky-900 border border-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <FolderGit2 className="w-4 h-4 text-sky-600" />
            <span>{showGithubHub ? 'Verberg NCSC-NL GitHub' : 'NCSC-NL GitHub Repos'}</span>
          </button>

          <a
            href="https://github.com/NCSC-NL"
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[38px] px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
            title="Open de officiële GitHub-pagina van NCSC-NL (github.com/NCSC-NL)"
          >
            <span>github.com/NCSC-NL</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <div className="flex items-center gap-1.5 text-xs font-mono-code text-emerald-700 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>CSIRT-NL ACTIEF</span>
          </div>
        </div>
      </div>

      {/* Interactive NCSC-NL Advisories Selector */}
      <div className="mt-4 flex flex-col justify-between space-y-3.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {NCSC_ADVISORIES.map((item) => {
            const isSelected = item.id === activeAdvisory.id;
            const itemTheme = getScoreTheme(item.gaugeScore);
            return (
              <button
                key={item.id}
                onClick={() => setSelectedAdvisoryId(item.id)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-rose-50/50 border-rose-400 shadow-2xs ring-1 ring-rose-300'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono-code">
                  <span className="font-bold text-slate-900">{item.advisoryCode}</span>
                  <span className={`font-bold ${itemTheme.textClass}`}>
                    {item.chanceLevel}/{item.damageLevel}
                  </span>
                </div>
                <div className="text-xs sm:text-sm font-semibold text-slate-800 truncate mt-1">
                  {item.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Advisory Inspection Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-200">
            <div>
              <div className="text-xs font-mono-code text-rose-700 font-bold">
                {activeAdvisory.advisoryCode} · {activeAdvisory.statusLabel}
              </div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 mt-1 leading-snug">
                {activeAdvisory.title}
              </h3>
            </div>
            <span className="text-xs font-mono-code text-amber-900 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md font-semibold">
              {activeAdvisory.cveRef}
            </span>
          </div>

          <p className="text-sm text-slate-700 leading-relaxed">
            {activeAdvisory.summary}
          </p>

          <div className="pt-3 border-t border-slate-200">
            <div className="text-xs font-mono-code font-bold uppercase text-emerald-800 mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              NCSC-NL Mitigatie:
            </div>
            <ul className="space-y-1.5">
              {activeAdvisory.mitigationSteps.slice(0, 3).map((step, i) => (
                <li key={i} className="text-sm text-slate-800 flex items-start gap-2 leading-relaxed">
                  <span className="text-emerald-700 font-mono-code font-bold shrink-0">{i + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Officiële NCSC-NL op GitHub Sectie */}
      {showGithubHub && (
        <div className="mt-5 pt-4 border-t border-slate-200 space-y-3.5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-sky-50/70 border border-sky-200 rounded-2xl p-4">
            <div className="flex items-start sm:items-center gap-3 min-w-0">
              <div className="p-2 rounded-xl bg-white border border-sky-200 text-sky-700 shrink-0">
                <FolderGit2 className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-white text-sky-800 border border-sky-200 text-xs font-mono-code font-bold px-2.5 py-0.5 rounded-md uppercase">
                    OFFICIËLE GITHUB PAGINA · NCSC-NL
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 mt-1">
                  NCSC-NL op GitHub (github.com/NCSC-NL) — IoC-Scanners &amp; Scripts
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 mt-0.5 leading-relaxed">
                  Directe toegang tot publieke GitHub-repositories van het{' '}
                  <strong className="text-sky-900">Nationaal Cyber Security Centrum (NCSC-NL)</strong> met detectiescripts, IoC&apos;s, YARA-regels en CSAF-data.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap shrink-0">
              <button
                type="button"
                onClick={() => setGithubFilter('ALL')}
                className={`min-h-[36px] px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  githubFilter === 'ALL'
                    ? 'bg-sky-600 text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                Alle ({githubRepos.length})
              </button>
              <button
                type="button"
                onClick={() => setGithubFilter('IOC_SCANNER')}
                className={`min-h-[36px] px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  githubFilter === 'IOC_SCANNER'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white text-emerald-800 hover:bg-emerald-50 border border-emerald-200'
                }`}
              >
                🔍 Scanners
              </button>
              <button
                type="button"
                onClick={() => setGithubFilter('CRISIS_DOSSIER')}
                className={`min-h-[36px] px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  githubFilter === 'CRISIS_DOSSIER'
                    ? 'bg-rose-600 text-white'
                    : 'bg-white text-rose-800 hover:bg-rose-50 border border-rose-200'
                }`}
              >
                🚨 Crisis Dossiers
              </button>
              <button
                type="button"
                onClick={handleSyncGithub}
                disabled={isSyncingGithub}
                className="min-h-[36px] px-3 py-1 rounded-lg bg-white hover:bg-slate-100 text-sky-800 border border-sky-200 text-xs font-bold flex items-center gap-1 cursor-pointer"
                title="Synchroniseer live met de GitHub API van NCSC-NL"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncingGithub ? 'animate-spin' : ''}`} />
                <span>API Sync</span>
              </button>
              <a
                href="https://github.com/NCSC-NL"
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[36px] px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold flex items-center gap-1 shadow-2xs transition-colors"
              >
                <span>Open GitHub</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredGithubRepos.map((repo) => (
              <div
                key={repo.id}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-sky-300 transition-colors flex flex-col justify-between gap-2.5 min-w-0"
              >
                <div className="min-w-0 space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <a
                      href={repo.htmlUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs sm:text-sm font-mono-code font-bold text-sky-800 hover:text-sky-950 flex items-center gap-1 truncate"
                    >
                      <span>{repo.fullName}</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    </a>
                    <span className="text-xs font-mono-code px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 shrink-0">
                      {repo.language}
                    </span>
                  </div>

                  <div className="text-xs font-mono-code text-amber-800 font-semibold truncate">
                    {repo.cveOrTopic}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2">
                    {repo.description}
                  </p>
                </div>

                <div className="pt-2.5 border-t border-slate-200 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyClone(repo.id, repo.cloneCommand)}
                    className="min-h-[36px] px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-xs font-mono-code text-slate-800 flex items-center gap-1.5 truncate cursor-pointer"
                    title={`Kopieer: ${repo.cloneCommand}`}
                  >
                    {copiedRepoId === repo.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="text-emerald-700 font-bold">Gekopieerd!</span>
                      </>
                    ) : (
                      <>
                        <Terminal className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                        <span className="truncate">git clone {repo.name}</span>
                        <Copy className="w-3 h-3 text-slate-400 shrink-0" />
                      </>
                    )}
                  </button>

                  <a
                    href={repo.htmlUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[36px] px-3 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 text-xs font-bold flex items-center gap-1 shrink-0 transition-colors"
                  >
                    <span>Bekijk</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
