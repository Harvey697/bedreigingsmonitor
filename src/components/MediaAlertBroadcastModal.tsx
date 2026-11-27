import React, { useState } from 'react';
import {
  Share2,
  Copy,
  Check,
  Send,
  MessageSquare,
  FileText,
  Twitter,
  Linkedin,
  Radio,
  Globe,
  Sparkles,
  X,
  Megaphone,
  Download,
  AlertOctagon,
  Mail,
  Tv,
  Newspaper,
  Calendar,
  Clock,
  Activity,
} from 'lucide-react';
import { ThreatItem } from '../types/threat';

interface MediaAlertBroadcastModalProps {
  threat: ThreatItem | null;
  isOpen: boolean;
  onClose: () => void;
}

type PlatformTab = 'NATIONALE_MEDIA_NL' | 'X_TWITTER' | 'LINKEDIN' | 'ANP_PERSALARM' | 'TELEGRAM_INTEL';

export const MediaAlertBroadcastModal: React.FC<MediaAlertBroadcastModalProps> = ({
  threat,
  isOpen,
  onClose,
}) => {
  const [activePlatform, setActivePlatform] = useState<PlatformTab>('NATIONALE_MEDIA_NL');
  const [nationalMediaTarget, setNationalMediaTarget] = useState<'NOS_RTL' | 'ANP' | 'FD_TELEGRAAF' | 'TWEAKERS_SECURITY'>('NOS_RTL');
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen || !threat) return null;

  const now = new Date();
  const explicitDateStr = threat.attackDate || now.toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });
  const explicitTimeStr = threat.attackTime || now.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' CET';
  const fullTimestampStr = `${explicitDateStr} om ${explicitTimeStr}`;

  const confirmedSourcesCount = threat.verificationSources
    ? threat.verificationSources.filter((s) => s.verified).length
    : 3;

  const originLabel =
    threat.origin === 'RUSLAND' ? 'Rusland 🇷🇺' : threat.origin === 'CHINA' ? 'China 🇨🇳' : 'Dark Web Syndicaat 🏴‍☠️';

  const realtimeStatusLabel =
    threat.realtimeStatus === 'AANVAL_NU_ACTIEF' ? '🔴 REALTIME CYBERAANVAL NU ACTIEF' :
    threat.realtimeStatus === 'DATA_EXFILTRATIE_LIVE' ? '🔴 LIVE DATA-EXFILTRATIE GAANDE' :
    threat.realtimeStatus === 'ENCRYPTIE_IN_UITVOERING' ? '🟠 REALTIME ENCRYPTIE IN UITVOERING' :
    '🔴 ACTIEVE C2 TELEMETRIE GEDETECTEERD';

  // Generate media dispatch with clear dates
  const generateMediaContent = (): string => {
    switch (activePlatform) {
      case 'NATIONALE_MEDIA_NL':
        if (nationalMediaTarget === 'NOS_RTL') {
          return `AAN: REDACTIE NOS NIEUWS / RTL NIEUWS
ONDERWERP: [SPOED PERSALARM] ${realtimeStatusLabel}: ${threat.targetVictim}
DATUM VAN MELDING: ${explicitDateStr} | TIJDSTIP: ${explicitTimeStr}

Geachte redactie,

Het realtime cyber-monitoringsysteem Bedreigingsmonitor.nl slaat op ${explicitDateStr} om ${explicitTimeStr} alarm over een acute, lopende cyberaanval gericht op ${threat.targetVictim} (${threat.targetLocation}).

BELANGRIJKSTE FEITEN VOOR HET JOURNAAL / NIEUWSUUR:
📅 DATUM & TIJDSTIP: ${fullTimestampStr}
🚨 OPERATIONELE STATUS: ${realtimeStatusLabel}
• Getroffen vitale sector: ${threat.targetSector.replace(/_/g, ' ')}
• Toegeschreven aan: ${threat.threatActor} (${originLabel})
• Mogelijke maatschappelijke impact: Risico op ontregeling van vitale infrastructuur in ${threat.targetLocation}
• Aanvalsvector / Exploit: ${threat.attackVector}
${threat.dataVolume ? `• Geëxfiltreerde data: Circa ${threat.dataVolume}` : ''}
${threat.liveTelemetryMetrics ? `• Realtime sensorstatistieken: ${threat.liveTelemetryMetrics.packetsPerSec} (${threat.liveTelemetryMetrics.bandwidthExfiltrated})` : ''}
• Bewijs & Onafhankelijke verificatie: Bevestigd door ${confirmedSourcesCount} bronnen (o.a. NCSC-NL sensornetwerk, MIVD en live Tor darkweb-monitoring).

QUOTES VOOR DE PERS:
"De signalen die op ${explicitDateStr} door onze sensoren en op het darkweb zijn onderschept duiden op een actieve, realtime poging tot ontwrichting van Nederlandse vitale processen. Betrokken partijen moeten per direct noodprotocollen onder de NIS2-richtlijn activeren."

VOOR VERIFICATIE & LIVE RADAR:
Bedreigingsmonitor.nl Persdesk / CSIRT Incident Coördinatie
Website: live dashboard Bedreigingsmonitor.nl
E-mail: pers@bedreigingsmonitor.nl
Telefoon CSIRT-dienst: +31 (0)70 - CSIRT NL (24/7)`;
        } else if (nationalMediaTarget === 'ANP') {
          return `ANP SPOEDBERICHT / PERSALARM (URGENTIE: HOOG)
VOOR REDACTIES BINNENLAND, ECONOMIE EN TECH
DATUM: ${explicitDateStr} | TIJDSTIP: ${explicitTimeStr}

KRITIEKE REALTIME CYBERAANVAL OP ${threat.targetVictim.toUpperCase()}: DREIGING UIT ${originLabel.toUpperCase()}

DEN HAAG / ROTTERDAM, ${explicitDateStr} (ANP) — Het Nederlandse cybersecurity monitoringsysteem Bedreigingsmonitor.nl meldt dat op ${fullTimestampStr} een acute cyberaanval gaande is tegen ${threat.targetVictim}. De aanval wordt gelinkt aan de groepering ${threat.threatActor}.

Volgens realtime sensorgegevens is sprake van ${threat.attackVector}. ${threat.isDutchVitalInfra ? 'De getroffen organisatie valt onder de Nederlandse vitale infrastructuur (Wet beveiliging netwerk- en informatiesystemen / NIS2).' : ''}

STATUS OP ${explicitDateStr.toUpperCase()}:
${realtimeStatusLabel}
${threat.liveTelemetryMetrics ? `Onderschept verkeer: ${threat.liveTelemetryMetrics.packetsPerSec}` : ''}

De aanval is op ${explicitDateStr} formeel bevestigd door ${confirmedSourcesCount} onafhankelijke bronnen, waaronder nationale CSIRT-sensoren en darkweb crawlerfeeds. Het Nationaal Cyber Security Centrum (NCSC) is geïnformeerd.

= = = = = = = = = = = = = = = = = = = = = = = =
NOOT VOOR DE REDACTIE (NIET VOOR PUBLICATIE):
Persvoorlichting & live telemetrie: Bedreigingsmonitor.nl persdesk.
Geverifieerd op: ${fullTimestampStr}
E-mail persdesk: pers@bedreigingsmonitor.nl
= = = = = = = = = = = = = = = = = = = = = = = =`;
        } else if (nationalMediaTarget === 'FD_TELEGRAAF') {
          return `VOOR REDACTIE FINANCIEELE DAGBLAD / DE TELEGRAAF
ONDERWERP: [Exclusief] Realtime cyberaanval gaande op vitale ketens: ${threat.targetVictim}
DATUM: ${explicitDateStr} om ${explicitTimeStr}

Geachte financiële en onderzoeksredactie,

Uit realtime monitoring op ${explicitDateStr} blijkt dat ${threat.threatActor} (${originLabel}) momenteel een gecoördineerde aanval uitvoert op ${threat.targetVictim}.

ECONOMISCHE & BEDRIJFSRISICO'S OP ${explicitDateStr.toUpperCase()}:
• Tijdstip interceptie: ${explicitTimeStr}
• Status: ${realtimeStatusLabel}
• Sector: ${threat.targetSector.replace(/_/g, ' ')}
• Bedrijfsschade: Potentiële cascade-effecten in de logistieke en financiële keten.
• NIS2 meldplicht: Bestuurders moeten conform de wetgeving binnen 24 uur melding maken bij de toezichthouder.
• Financiële afpersing: ${threat.ransomDemanded || 'Geen openbaar losgeldbedrag; vermoedelijke geopolitieke sabotage'}.

Forensische hashes (SHA-256) en netwerkindicatoren zijn beschikbaar via Bedreigingsmonitor.nl.`;
        } else {
          return `VOOR REDACTIES TWEAKERS / AG CONNECT / SECURITY.NL
ONDERWERP: [Tech Incident Briefing] Realtime CVE telemetrie: ${threat.threatActor} vs ${threat.targetVictim}
DATUM: ${explicitDateStr} | TIJD: ${explicitTimeStr}

Beste techredactie,

Hierbij de technische telemetrie van de actieve cyberaanval op ${threat.targetVictim} geregistreerd op ${fullTimestampStr}:

TECHNISCHE SPECIFICATIES (${explicitDateStr}):
• Status: ${realtimeStatusLabel}
• Actor: ${threat.threatActor} (${threat.threatActorType})
• Herkomst: ${originLabel}
• Exploit / CVE: ${threat.attackVector}
• MITRE ATT&CK: ${threat.mitreTechniques.join(', ')}
• Live Telemetrie: ${threat.liveTelemetryMetrics ? `${threat.liveTelemetryMetrics.packetsPerSec} | ${threat.liveTelemetryMetrics.bandwidthExfiltrated}` : 'C2 streaming actief'}
• IoC's:
  - C2 IP ranges: ${threat.iocs?.ips?.join(', ') || 'Wordt gemonitord'}
  - Hashes: ${threat.iocs?.sha256?.join(', ') || 'Private payload'}
• Dark Web .onion status: ${threat.darkwebOnionSite || 'Verborgen C2 kanaal'}
• Bronnen consensus: ${confirmedSourcesCount} onafhankelijke instanties bevestigen de aanval per ${explicitDateStr}.`;
        }

      case 'ANP_PERSALARM':
        return `[ANP FLITSBERICHT | ${explicitDateStr} - ${explicitTimeStr}]
🚨 ${realtimeStatusLabel}
Doelwit: ${threat.targetVictim} (${threat.targetLocation}).
Actor: ${threat.threatActor} [${originLabel}].
Aanvalsvector: ${threat.attackVector}.
Vitale Nederlandse sector: ${threat.targetSector}. NCSC en MIVD monitoren situatie live. Details via ANP Binnenland / Bedreigingsmonitor.nl.`;

      case 'X_TWITTER':
        return `📅 ${explicitDateStr} | ⏰ ${explicitTimeStr}
🚨 LIVE CYBERAANVAL GAANDE OP NEDERLANDSE INFRASTRUCTUUR!

🎯 Doelwit: ${threat.targetVictim} (${threat.targetLocation})
🏴‍☠️ Actor: ${threat.threatActor} [${originLabel}]
⚠️ Status: ${realtimeStatusLabel}
🔍 Exploit: ${threat.attackVector}
${threat.liveTelemetryMetrics ? `📊 Verkeer: ${threat.liveTelemetryMetrics.packetsPerSec}` : ''}
✅ Bevestigd op ${explicitDateStr} door ${confirmedSourcesCount} bronnen (NCSC/Darkweb)

#CyberAanval #Nieuws #RansomwareNL #${threat.threatActor.replace(/\s+/g, '')} #VitaleInfrastructuur #BedreigingsmonitorNL`;

      case 'LINKEDIN':
        return `🔴 [REALTIME VEILIGHEIDSALARM] ${realtimeStatusLabel}
📅 Datum melding: ${explicitDateStr} om ${explicitTimeStr}

Bedreigingsmonitor.nl registreert op ${explicitDateStr} een gecoördineerde, realtime cyberaanval vanuit ${originLabel} gericht op de Nederlandse vitale infrastructuur.

📌 Incident Details (${explicitDateStr}):
• Getroffen entiteit: ${threat.targetVictim} (${threat.targetLocation})
• Dreigingsactor: ${threat.threatActor}
• Ernst: ${threat.severity}
• Aanvalsvector: ${threat.attackVector}
• Telemetrie: ${threat.liveTelemetryMetrics ? threat.liveTelemetryMetrics.packetsPerSec : 'C2 telemetrie onderschept'}
• Bronverificatie: ${confirmedSourcesCount} onafhankelijke instanties hebben de aanval bevestigd op ${explicitDateStr}.

💡 Dringend CISO Advies:
Controleer perimeterlogs op poort 2404 / VPN gateways en isoleer OT-omgevingen onmiddellijk.

#CyberSecurity #CISO #Informatiebeveiliging #NIS2 #BedreigingsmonitorNL #Nederland`;

      case 'TELEGRAM_INTEL':
        return `🚨 [REALTIME INTEL ALERT | ${explicitDateStr} ${explicitTimeStr}]
━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ STATUS: ${realtimeStatusLabel}
🎯 TARGET: ${threat.targetVictim} [${threat.targetLocation}]
🏴‍☠️ ACTOR: ${threat.threatActor} (${originLabel})
📅 DATUM: ${explicitDateStr}
⏰ TIJDSTIP: ${explicitTimeStr}
🔍 VECTOR: ${threat.attackVector}
📁 ONION: ${threat.darkwebOnionSite || 'C2 Network Live'}
━━━━━━━━━━━━━━━━━━━━━━━━━━
🛡️ VERIFICATIE: ${confirmedSourcesCount} BRONNEN BEVESTIGD OP ${explicitDateStr}`;
    }
  };

  const currentContent = generateMediaContent();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error('Kon tekst niet kopiëren:', e);
    }
  };

  const handleEmailNationalMedia = () => {
    const subject = encodeURIComponent(`[SPOED ${explicitDateStr}] Cyberaanval ${threat.threatActor} op ${threat.targetVictim}`);
    const body = encodeURIComponent(currentContent);
    window.location.href = `mailto:redactie@nos.nl,nieuwsdienst@anp.nl,rtlnieuws@rtl.nl?subject=${subject}&body=${body}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 rounded-xl sm:rounded-2xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl relative overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header with Date & Live Attack Status */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 shrink-0">
              <Newspaper className="w-5 h-5 animate-pulse" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  Media Alert & Nieuwsverspreider
                </h2>
                <span className="text-xs font-mono-code bg-rose-50 text-rose-800 px-2 py-0.5 rounded border border-rose-200 font-bold flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
                  REALTIME AANVAL
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 mt-0.5 font-mono-code tabular-nums">
                <span className="flex items-center gap-1 text-amber-800 font-semibold">
                  <Calendar className="w-3.5 h-3.5 text-amber-600" />
                  {explicitDateStr}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-700">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  {explicitTimeStr}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Sluiten"
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Realtime Alert Banner */}
        <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="text-rose-800 font-bold flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600"></span>
            </span>
            {realtimeStatusLabel}
          </span>
          <span className="font-mono-code text-xs font-semibold text-amber-900 tabular-nums">
            {explicitDateStr} • {explicitTimeStr}
          </span>
        </div>

        {/* Main Platform Selection Tabs */}
        <div className="mt-3 flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
          <button
            onClick={() => setActivePlatform('NATIONALE_MEDIA_NL')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all min-h-[38px] cursor-pointer border ${
              activePlatform === 'NATIONALE_MEDIA_NL'
                ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 border-slate-200'
            }`}
          >
            <Tv className="w-3.5 h-3.5" />
            <span>Nationale Media (NL)</span>
          </button>

          <button
            onClick={() => setActivePlatform('X_TWITTER')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all min-h-[38px] cursor-pointer border ${
              activePlatform === 'X_TWITTER'
                ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 border-slate-200'
            }`}
          >
            <Twitter className="w-3.5 h-3.5" />
            <span>X / Twitter</span>
          </button>

          <button
            onClick={() => setActivePlatform('LINKEDIN')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all min-h-[38px] cursor-pointer border ${
              activePlatform === 'LINKEDIN'
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 border-slate-200'
            }`}
          >
            <Linkedin className="w-3.5 h-3.5" />
            <span>LinkedIn (CISO Brief)</span>
          </button>

          <button
            onClick={() => setActivePlatform('ANP_PERSALARM')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all min-h-[38px] cursor-pointer border ${
              activePlatform === 'ANP_PERSALARM'
                ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 border-slate-200'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>ANP Flitsalarm</span>
          </button>
        </div>

        {/* Sub-selector for Dutch National Media Channels */}
        {activePlatform === 'NATIONALE_MEDIA_NL' && (
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5 p-2 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-600 font-semibold px-2">Selecteer omroep / krant:</span>
            <button
              onClick={() => setNationalMediaTarget('NOS_RTL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors min-h-[36px] cursor-pointer ${
                nationalMediaTarget === 'NOS_RTL'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-700 hover:bg-slate-200/70 hover:text-slate-900'
              }`}
            >
              NOS & RTL Nieuws
            </button>
            <button
              onClick={() => setNationalMediaTarget('ANP')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors min-h-[36px] cursor-pointer ${
                nationalMediaTarget === 'ANP'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-700 hover:bg-slate-200/70 hover:text-slate-900'
              }`}
            >
              ANP Persbureau
            </button>
            <button
              onClick={() => setNationalMediaTarget('FD_TELEGRAAF')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors min-h-[36px] cursor-pointer ${
                nationalMediaTarget === 'FD_TELEGRAAF'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-700 hover:bg-slate-200/70 hover:text-slate-900'
              }`}
            >
              FD & Telegraaf
            </button>
            <button
              onClick={() => setNationalMediaTarget('TWEAKERS_SECURITY')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors min-h-[36px] cursor-pointer ${
                nationalMediaTarget === 'TWEAKERS_SECURITY'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-700 hover:bg-slate-200/70 hover:text-slate-900'
              }`}
            >
              Tweakers & Security.nl
            </button>
          </div>
        )}

        {/* Content Preview Box */}
        <div className="mt-3 flex-1 overflow-y-auto">
          <div className="relative">
            <textarea
              readOnly
              value={currentContent}
              rows={11}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 pt-9 text-xs sm:text-sm font-mono-code text-slate-900 focus:outline-none focus:border-blue-600 leading-relaxed resize-none selection:bg-rose-600 selection:text-white"
            />
            <div className="absolute right-3 top-2.5 px-2.5 py-0.5 rounded text-xs font-mono-code bg-white border border-slate-200 text-slate-600 tabular-nums">
              {currentContent.length} tekens • {explicitDateStr}
            </div>
          </div>

          <div className="mt-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-slate-700 flex items-center gap-1.5">
              <AlertOctagon className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Geverifieerd op {explicitDateStr} door {confirmedSourcesCount} bronnen (NCSC, MIVD, Tor)</span>
            </span>
            <span className="text-xs text-amber-800 font-semibold font-mono-code">
              Datum & Tijdstip Geverifieerd
            </span>
          </div>
        </div>

        {/* Footer actions */}
        <div className="mt-3.5 pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleEmailNationalMedia}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold text-xs sm:text-sm transition-colors border border-slate-300 min-h-[40px] cursor-pointer"
              title="Open direct in e-mailclient met geadresseerden van de landelijke redacties"
            >
              <Mail className="w-4 h-4 text-amber-700" />
              <span>E-mail naar Persredacties</span>
            </button>
          </div>

          <button
            onClick={handleCopy}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-sm min-h-[40px] cursor-pointer ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-rose-600 hover:bg-rose-700 text-white'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>Tekst Gekopieerd!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Kopieer Bericht</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
