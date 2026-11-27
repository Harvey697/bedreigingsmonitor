import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Radio,
  Radar,
  MessageSquare,
  Building2,
  Skull,
  FileCode,
  BellRing,
  Sparkles,
  ExternalLink,
  X,
  CheckCircle2,
  Tv,
  TrendingUp,
  ArrowUpRight,
  ArrowRight,
  Layers,
  Network,
  Pill,
  RefreshCw,
  Eye,
} from 'lucide-react';
import {
  DarkwebChatterItem,
  NotificationSettings,
  NotificationTier,
  ThreatActorProfile,
  ThreatItem,
  VitalSectorNL,
} from './types/threat';
import {
  INITIAL_THREATS,
  SIMULATION_THREAT_POOL,
  DARKWEB_FORUM_DISCUSSIONS,
  DARKWEB_LEAK_SITES,
} from './data/threatData';
import {
  getStoredSettings,
  saveStoredSettings,
  sendTieredThreatPushNotification,
  playTierSound,
} from './utils/notifications';
import {
  normalizeThreatsToCurrentDate,
  getCachedLiveThreats,
  syncLiveThreatFeeds,
  CONNECTED_THREAT_SOURCES,
  deduplicateThreats,
  getThreatTopicFingerprint,
} from './utils/liveThreatFeedSync';

// Components
import { Header } from './components/Header';
import { LiveDarkwebFeed } from './components/LiveDarkwebFeed';
import { DarkwebChatterMonitor } from './components/DarkwebChatterMonitor';
import { TieredNotificationConfig } from './components/TieredNotificationConfig';
import { PushNotificationManager } from './components/PushNotificationManager';
import { DutchVitalInfraTracker } from './components/DutchVitalInfraTracker';
import { ThreatActorDossier } from './components/ThreatActorDossier';
import { IoCTracker } from './components/IoCTracker';
import { MultiSourceVerificationModal } from './components/MultiSourceVerificationModal';
import { ThreatDetailModal } from './components/ThreatDetailModal';
import { AiThreatAnalystModal } from './components/AiThreatAnalystModal';
import { ThreatAnalysisSummary } from './components/ThreatAnalysisSummary';
import { ThreatReportPdfModal } from './components/ThreatReportPdfModal';
import { ThreatTrendsDashboard } from './components/ThreatTrendsDashboard';
import { CrimeNexusMatrix } from './components/CrimeNexusMatrix';
import { VisitorFeedbackManager } from './components/VisitorFeedbackManager';
import { VisitorFeedbackModal } from './components/VisitorFeedbackModal';
import { NcscStatusBoard } from './components/NcscStatusBoard';
import { AilNetherlandsIntegration } from './components/AilNetherlandsIntegration';
import { DutchCyberResilienceHub } from './components/DutchCyberResilienceHub';
import { GitHubPushModal } from './components/GitHubPushModal';
import { getDefaultExecutiveSummary } from './utils/pdfExport';

type ActiveViewTab =
  | 'HOME_OVERZICHT'
  | 'WEERBAARHEID_EN_CENTRA'
  | 'AIL_NL_ANALYZER'
  | 'CRIMINELE_NEXUS'
  | 'THREAT_TRENDS'
  | 'LIVE_FEED'
  | 'DARKWEB_FORUMS'
  | 'NL_VITALE_INFRA'
  | 'DREIGINGSACTOREN'
  | 'IOC_DATABASE'
  | 'NOTIFICATIE_TIERS'
  | 'VRAGEN_REACTIES';

function getPositivePreventionTipForThreat(threat: ThreatItem): string {
  const text = `${threat.title} ${threat.attackVector} ${threat.description}`.toLowerCase();
  if (text.includes('virtualine') || text.includes('bulletproof') || text.includes('hostingbedrijf')) {
    return '💡 Positieve Doorbraak & Tip (Politie NL & Abuse.ch): Door deze inbeslagname in Limburg zijn honderden criminele C2-/phishingservers direct op zwart gezet. Tip: blokkeer verdachte ASNs/bulletproof IP-ranges via Abuse.ch & Shadowserver blocklists.';
  }
  if (text.includes('edge') || text.includes('router') || text.includes('vpn') || text.includes('fortinet') || text.includes('citrix') || text.includes('ivanti')) {
    return '💡 Positieve Preventietip (Security Delta Den Haag & NCSC): Zet externe beheerinterfaces op routers/VPN’s uit, installeer beveiligingsupdates direct en gebruik FIDO2/Passkey MFA.';
  }
  if (text.includes('php') || text.includes('brotli') || text.includes('node') || text.includes('cve-')) {
    return '💡 Positieve Preventietip (DIVD & CVD Apeldoorn): Voer de nieuwste software-update door en activeer automatische patch-controles; hiermee is uw omgeving direct beschermd.';
  }
  if (text.includes('ransomware') || text.includes('cl0p') || text.includes('lockbit') || text.includes('windchill')) {
    return '💡 Positieve Preventietip (Brabant House of Cyber & DTC): Met een onwijzigbare (immutable) 3-2-1 back-up en netwerksegmentatie blijft uw bedrijfsvoering veilig en herstelbaar.';
  }
  if (text.includes('shinyhunters') || text.includes('odido') || text.includes('credential') || text.includes('phishing')) {
    return '💡 Positieve Preventietip (CVD Apeldoorn): Gebruik een wachtwoordkluis met unieke wachtwoorden en tweestapsverificatie (2FA) om misbruik van gelekte inloggegevens te voorkomen.';
  }
  return '💡 Positief Handelingsadvies (Samen Digitaal Weerbaar): Tijdige updates, sterke MFA en geteste back-ups houden ruim 95% van de cyberincidenten succesvol buiten de deur.';
}

export default function App() {
  const [threats, setThreats] = useState<ThreatItem[]>(() => {
    const normalizedBase = normalizeThreatsToCurrentDate(INITIAL_THREATS);
    const cached = getCachedLiveThreats();
    if (cached.threats.length > 0) {
      return deduplicateThreats([...normalizedBase, ...cached.threats]);
    }
    return normalizedBase;
  });
  const [liveOsintThreats, setLiveOsintThreats] = useState<ThreatItem[]>(() => getCachedLiveThreats().threats);
  const [lastLiveSyncTime, setLastLiveSyncTime] = useState<string>(() => {
    return (
      getCachedLiveThreats().lastSyncedAt ||
      new Date().toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    );
  });
  const [liveSyncSources, setLiveSyncSources] = useState<string[]>(() => {
    const s = getCachedLiveThreats().sourcesUsed;
    return s.length > 0
      ? s
      : ['Cl0p .onion Tor Crawler', 'Dark Web Intel (RAMP/XSS.is)', 'Security.NL Live Feed', 'NOS Tech & Cyber'];
  });
  const [isSyncingLiveFeeds, setIsSyncingLiveFeeds] = useState<boolean>(false);

  const [settings, setSettings] = useState<NotificationSettings>(getStoredSettings());
  const [activeTab, setActiveTab] = useState<ActiveViewTab>('HOME_OVERZICHT');
  const [selectedSector, setSelectedSector] = useState<VitalSectorNL | 'ALL'>('ALL');
  const [showFullFeedOnHome, setShowFullFeedOnHome] = useState<boolean>(false);
  const [homeSubPage, setHomeSubPage] = useState<
    'PAGE_1_DREIGINGEN_EN_WEERBAARHEID' | 'PAGE_2_DARKWEB_EN_LEKSITES' | 'PAGE_3_NCSC_STATUS_EN_AIL' | 'ALL_COMBINED'
  >('PAGE_1_DREIGINGEN_EN_WEERBAARHEID');
  const [criticalThreatsPage, setCriticalThreatsPage] = useState<number>(1);
  const [liveOsintPage, setLiveOsintPage] = useState<number>(1);
  const [darkwebHomePage, setDarkwebHomePage] = useState<number>(1);
  const [homeDarkwebFilter, setHomeDarkwebFilter] = useState<
    'ALL' | 'PHP2SHELL' | 'PEPIJN_SHINYHUNTERS' | 'PHILIPS_CL0P' | 'TIER_1'
  >('ALL');
  const [showAllDarkwebOnHome, setShowAllDarkwebOnHome] = useState<boolean>(false);
  const [showAllConnectedSources, setShowAllConnectedSources] = useState<boolean>(false);
  const [portalChatterDetail, setPortalChatterDetail] = useState<DarkwebChatterItem | null>(null);

  // Modals state
  const [isPushModalOpen, setIsPushModalOpen] = useState<boolean>(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState<boolean>(false);
  const [verificationThreat, setVerificationThreat] = useState<ThreatItem | null>(null);
  const [aiAnalysisThreat, setAiAnalysisThreat] = useState<ThreatItem | null>(null);
  const [aiChatterItem, setAiChatterItem] = useState<DarkwebChatterItem | null>(null);
  const [detailThreat, setDetailThreat] = useState<ThreatItem | null>(null);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState<boolean>(false);
  const [feedbackPreselectedThreat, setFeedbackPreselectedThreat] = useState<ThreatItem | null>(null);
  const [unreadFeedbackCount, setUnreadFeedbackCount] = useState<number>(1);
  const [isSeoModalOpen, setIsSeoModalOpen] = useState<boolean>(false);
  const [copiedSeoItem, setCopiedSeoItem] = useState<string | null>(null);

  // Live OSINT & NCSC-NL Real-time Synchronizer (houdt meldingen 24/7 actueel)
  const handleRunLiveOsintSync = async () => {
    setIsSyncingLiveFeeds(true);
    try {
      const result = await syncLiveThreatFeeds();
      const freshBase = normalizeThreatsToCurrentDate(INITIAL_THREATS);
      if (result.liveThreats.length > 0) {
        const freshRealtimeStreams = result.liveThreats.filter(
          (t) =>
            t.id.startsWith('live-osint-srv-') ||
            t.id.startsWith('live-osint-rss-') ||
            t.id.startsWith('live-osint-cisa-')
        );
        const curatedLiveHistory = result.liveThreats.filter(
          (t) =>
            !t.id.startsWith('live-osint-srv-') &&
            !t.id.startsWith('live-osint-rss-') &&
            !t.id.startsWith('live-osint-cisa-')
        );
        setLiveOsintThreats(deduplicateThreats(result.liveThreats));
        setThreats((prev) => {
          const simItems = prev.filter((p) => p.id.startsWith('sim-threat-'));
          return deduplicateThreats([
            ...freshRealtimeStreams,
            ...freshBase,
            ...curatedLiveHistory,
            ...simItems,
          ]);
        });
      } else {
        setThreats((prev) => {
          const simItems = prev.filter((p) => p.id.startsWith('sim-threat-'));
          const existingLive = prev.filter((p) => p.id.startsWith('live-osint-'));
          return deduplicateThreats([...freshBase, ...existingLive, ...simItems]);
        });
      }
      setLastLiveSyncTime(result.syncedAtFormatted);
      if (result.sourcesUsed.length > 0) {
        setLiveSyncSources(result.sourcesUsed);
      }
    } finally {
      setIsSyncingLiveFeeds(false);
    }
  };

  useEffect(() => {
    let lastTriggeredAt = 0;
    const triggerRealtimeSync = (force = false) => {
      const now = Date.now();
      if (!force && now - lastTriggeredAt < 10000) return;
      lastTriggeredAt = now;
      handleRunLiveOsintSync();
    };

    triggerRealtimeSync(true);

    // Mobiele browsers (iOS Safari / Chrome Android) pauzeren timers op de achtergrond;
    // ververs direct zodra het scherm ontgrendelt, het tabblad actief wordt of internet terugkeert.
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        triggerRealtimeSync();
      }
    };
    const handleWakeup = () => triggerRealtimeSync();

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', handleWakeup);
    window.addEventListener('pageshow', handleWakeup);
    window.addEventListener('online', handleWakeup);

    // Elke 60 seconden automatisch verversen vanuit live bronnen
    const syncInterval = setInterval(() => triggerRealtimeSync(), 60000);
    return () => {
      clearInterval(syncInterval);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('focus', handleWakeup);
      window.removeEventListener('pageshow', handleWakeup);
      window.removeEventListener('online', handleWakeup);
    };
  }, []);

  // Beheerdersmodus: bepaalt of beheerder-inbox en AI-bot configuratie getoond worden
  // Voor externe bezoekers: STANDAARD FALSE (bezoekersformulier actief)
  // Voor jou: actief in development of wisselbaar via de modusknop in header/footer
  const [isOwnerMode, setIsOwnerMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (
        params.get('admin') === '1' ||
        params.get('admin') === 'true' ||
        params.get('owner') === '1' ||
        params.get('owner') === 'true' ||
        params.get('beheerder') === '1' ||
        params.get('beheerder') === 'true'
      ) {
        localStorage.setItem('bedreigingsmonitor_is_owner', 'true');
        return true;
      }
      const saved = localStorage.getItem('bedreigingsmonitor_is_owner');
      if (saved !== null) {
        return saved === 'true';
      }
      const host = window.location.hostname;
      if (host.includes('run.app') || host === 'localhost' || host === '127.0.0.1') {
        return true;
      }
    }
    return false;
  });

  const handleToggleOwnerMode = () => {
    setIsOwnerMode((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('bedreigingsmonitor_is_owner', String(next));
      }
      return next;
    });
  };

  // Beheerdersmodus sneltoets Ctrl+Shift+B om snel tussen Beheerder en Bezoeker te wisselen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'B' || e.key === 'b')) {
        e.preventDefault();
        handleToggleOwnerMode();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleUpdateSettings = (newSettings: NotificationSettings) => {
    setSettings(newSettings);
    saveStoredSettings(newSettings);
  };

  // Sync unread feedback & questions count from backend
  useEffect(() => {
    const fetchFeedbackCount = async () => {
      try {
        const res = await fetch('/api/feedback');
        if (res.ok) {
          const data = await res.json();
          if (data.messages && Array.isArray(data.messages)) {
            const unread = data.messages.filter((m: any) => m.status === 'NIEUW').length;
            setUnreadFeedbackCount(unread);
          }
        }
      } catch (e) {
        // Fallback silently
      }
    };

    fetchFeedbackCount();
    const interval = setInterval(fetchFeedbackCount, 25000);
    return () => clearInterval(interval);
  }, []);

  // Deep-link URL support for Sitemap (?tab=...) and RSS Feed (?dossier=...)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab') as ActiveViewTab | null;
    const validTabs: ActiveViewTab[] = [
      'HOME_OVERZICHT',
      'WEERBAARHEID_EN_CENTRA',
      'AIL_NL_ANALYZER',
      'CRIMINELE_NEXUS',
      'THREAT_TRENDS',
      'LIVE_FEED',
      'DARKWEB_FORUMS',
      'NL_VITALE_INFRA',
      'DREIGINGSACTOREN',
      'IOC_DATABASE',
      'NOTIFICATIE_TIERS',
      'VRAGEN_REACTIES',
    ];
    if (tabParam && validTabs.includes(tabParam)) {
      setActiveTab(tabParam);
    }

    const dossierParam = params.get('dossier');
    if (dossierParam) {
      const matched = threats.find(
        (t) => t.id.toLowerCase().includes(dossierParam.toLowerCase()) || dossierParam.toLowerCase().includes(t.id.toLowerCase())
      );
      if (matched) {
        setDetailThreat(matched);
      }
    }
  }, []);

  // Dynamic Client-Side SEO Meta, Title, Canonical & OpenGraph Synchronization
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const tabSeoMap: Record<ActiveViewTab, { title: string; desc: string }> = {
      HOME_OVERZICHT: {
        title: 'Bedreigingsmonitor.nl - Cyberweerbaarheid, Tips, Kenniscentra & Actuele Monitor',
        desc: 'Bedreigingsmonitor.nl combineert positief handelingsadvies, praktische cybersecurity-tips en onderzoek van Security Delta (HSD) Den Haag, Brabant House of Cyber en CVD Apeldoorn met een actuele dreigingsmonitor.',
      },
      WEERBAARHEID_EN_CENTRA: {
        title: 'Security Delta Den Haag (HSD), Brabant House of Cyber & CVD Apeldoorn — Tips & Weerbaarheid | Bedreigingsmonitor.nl',
        desc: 'Onderzoek naar de 3 Nederlandse cyber-innovatiecentra (Security Delta Den Haag, Brabant House of Cyber en Centrum voor Veiligheid en Digitalisering Apeldoorn) plus praktische cybersecurity tips voor thuis, MKB en NIS2.',
      },
      AIL_NL_ANALYZER: {
        title: 'AIL-Project NL Leak Scanner — Dark Web & Paste-Site Monitor | Bedreigingsmonitor.nl',
        desc: 'CIRCL AIL-Framework integratie voor Nederland: realtime detectie van gelekte .nl en @rijksoverheid.nl credentials, KVK-nummers, IBANs en API-keys.',
      },
      CRIMINELE_NEXUS: {
        title: 'Criminele Nexus Matrix — Cybercrime & Ondermijning NL | Bedreigingsmonitor.nl',
        desc: 'Analyse van de operationele verwevenheid tussen ransomware-syndicaten, darknet markten, crypto-witwassen en Nederlandse vitale sectoren.',
      },
      THREAT_TRENDS: {
        title: '24-Uurs Cyberdreiging & Ransomware Trends Nederland | Bedreigingsmonitor.nl',
        desc: 'Actuele statistieken, aanvalsvectoren en zero-day exploitatie trends op Nederlandse NIS2 vitale infrastructuur.',
      },
      LIVE_FEED: {
        title: `Live Cyberdreigingen & NCSC Alerts (${threats.length} Meldingen) | Bedreigingsmonitor.nl`,
        desc: 'Volledige 24/7 live feed met geverifieerde cyberaanvallen, NCSC-NL noodpatches, AIVD/MIVD spionagedossiers en ransomware incidenten.',
      },
      DARKWEB_FORUMS: {
        title: 'Dark Web .Onion Lek-Sites & RAMP/XSS Forum Monitor | Bedreigingsmonitor.nl',
        desc: 'Realtime monitoring van Cl0p, LockBit, Akira, RansomHub en ShinyHunters .onion lek-sites en Russischtalige underground forums.',
      },
      NL_VITALE_INFRA: {
        title: 'NIS2 Vitale Infrastructuur Nederland — 10 Kritieke Sectoren | Bedreigingsmonitor.nl',
        desc: 'Overzicht van cyberdreigingen per Nederlandse vitale sector: Energie, Zorg, Financieel, Rijksoverheid, Telecom, Havens & Waterbeheer.',
      },
      DREIGINGSACTOREN: {
        title: 'APT & Ransomware Dreigingsactoren Dossier (RU/CN/IR) | Bedreigingsmonitor.nl',
        desc: 'Technische dossiers van statelijke groeperingen (Cozy Bear, Sandworm, Volt Typhoon, Charming Kitten) en ransomware-kartels.',
      },
      IOC_DATABASE: {
        title: 'IoC Database, CVE Exploits & SIEM Blokkeerlijsten | Bedreigingsmonitor.nl',
        desc: 'Direct toepasbare Indicators of Compromise (IoCs), C2 IP-adressen, SHA-256 hashes en YARA/Snort regels voor SOC- en CSIRT-teams.',
      },
      NOTIFICATIE_TIERS: {
        title: 'NCSC & CSIRT Alert Tiers Configuratie | Bedreigingsmonitor.nl',
        desc: 'Configureer realtime waarschuwingen voor Tier 1 kritieke zero-day kwetsbaarheden en Nederlandse vitale infrastructuur incidenten.',
      },
      VRAGEN_REACTIES: {
        title: 'SOC & CTI Desk — Vragen, Meldpunt & Reacties | Bedreigingsmonitor.nl',
        desc: 'Stel vragen over actuele cyberdreigingen, CVE-kwetsbaarheden of deel dreigingsinformatie met de redactie van Bedreigingsmonitor.nl.',
      },
    };

    const activeSeo = detailThreat
      ? {
          title: `${detailThreat.title} | Bedreigingsmonitor.nl`,
          desc: `${(detailThreat.description || '').slice(0, 155)}...`,
        }
      : selectedSector !== 'ALL'
        ? {
            title: `NIS2 Sector ${selectedSector} — Actuele Cyberdreigingen NL | Bedreigingsmonitor.nl`,
            desc: `Live overzicht van geverifieerde cyberaanvallen, NCSC-NL adviezen en ransomware-incidenten gericht op de Nederlandse sector ${selectedSector}.`,
          }
        : tabSeoMap[activeTab] || tabSeoMap.HOME_OVERZICHT;

    document.title = activeSeo.title;

    const setMeta = (selector: string, content: string) => {
      const el = document.querySelector(selector);
      if (el) el.setAttribute('content', content);
    };

    setMeta('meta[name="description"]', activeSeo.desc);
    setMeta('meta[property="og:title"]', activeSeo.title);
    setMeta('meta[property="og:description"]', activeSeo.desc);
    setMeta('meta[name="twitter:title"]', activeSeo.title);
    setMeta('meta[name="twitter:description"]', activeSeo.desc);

    const canonicalEl = document.getElementById('canonical-link');
    if (canonicalEl && typeof window !== 'undefined') {
      const base = window.location.origin.includes('localhost')
        ? 'https://bedreigingsmonitor.nl'
        : window.location.origin;
      const query =
        activeTab !== 'HOME_OVERZICHT' ? `?tab=${activeTab}` : '';
      canonicalEl.setAttribute('href', `${base}/${query}`);
    }
  }, [activeTab, selectedSector, detailThreat, threats.length]);

  const handleTriggerQuickTest = () => {
    // Push notification popups removed
  };

  const handleTriggerTestTierPush = (_tier: NotificationTier) => {
    // Push notification popups removed
  };

  const handleAnalyzeChatterWithAi = (chatter: DarkwebChatterItem) => {
    setAiChatterItem(chatter);
    setAiAnalysisThreat(null);
  };

  const dutchVitalCount = threats.filter((t) => t.isDutchVitalInfra).length;

  const [showDownloadBar, setShowDownloadBar] = useState<boolean>(() => {
    if (typeof document !== 'undefined' && typeof window !== 'undefined') {
      const isSingleFileBundle = Boolean(
        document.querySelector('script[src^="data:text/javascript;base64,"]')
      );
      const host = window.location.hostname;
      const isAiStudioOrLocal =
        host.includes('run.app') ||
        host.includes('usercontent.goog') ||
        host === 'localhost' ||
        host === '127.0.0.1';
      return !isSingleFileBundle && isAiStudioOrLocal;
    }
    return true;
  });
  const [isDownloadingHtml, setIsDownloadingHtml] = useState(false);
  const [isDownloadingSourceZip, setIsDownloadingSourceZip] = useState(false);
  const [isGitHubPushModalOpen, setIsGitHubPushModalOpen] = useState(false);

  const handleDownloadUpdatedSingleFile = async () => {
    setIsDownloadingHtml(true);
    try {
      const res = await fetch('/download/index.html');
      if (!res.ok) throw new Error('Download endpoint niet bereikbaar');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'index.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      window.location.href = '/download/index.html';
    } finally {
      setIsDownloadingHtml(false);
    }
  };

  const handleDownloadVercelJson = async () => {
    try {
      const res = await fetch('/download/vercel.json');
      if (!res.ok) throw new Error('vercel.json endpoint niet bereikbaar');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'vercel.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      window.location.href = '/download/vercel.json';
    }
  };

  const handleDownloadSourceZip = async () => {
    setIsDownloadingSourceZip(true);
    try {
      const res = await fetch('/download/source-code.zip');
      if (!res.ok) throw new Error('Broncode ZIP endpoint niet bereikbaar');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'bedreigingsmonitor-github.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      window.location.href = '/download/source-code.zip';
    } finally {
      setIsDownloadingSourceZip(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-600 selection:text-white">
      {/* Top Header */}
      <Header
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onOpenNotificationModal={() => setIsPushModalOpen(true)}
        onOpenPdfModal={() => setIsPdfModalOpen(true)}
        onTestNotification={handleTriggerQuickTest}
        activeThreatsCount={threats.length}
        dutchVitalCount={dutchVitalCount}
        isOwnerMode={isOwnerMode}
        onToggleOwnerMode={handleToggleOwnerMode}
        onOpenFeedbackModal={() => setIsFeedbackModalOpen(true)}
        unreadFeedbackCount={unreadFeedbackCount}
        lastLiveSyncTime={lastLiveSyncTime}
        isSyncingLiveFeeds={isSyncingLiveFeeds}
        onSyncLiveFeeds={handleRunLiveOsintSync}
      />

      {/* Vernieuwde Direct GitHub Push & Losse Bestanden Balk (Zichtbaar in AI Studio, verbergt zichzelf automatisch op uw live domein!) */}
      {showDownloadBar && (
        <div className="bg-emerald-50 border-b border-emerald-200 px-3 sm:px-6 lg:px-8 py-2.5">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm flex-wrap">
              <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white font-mono-code font-bold text-xs uppercase shrink-0">
                GITHUB ZONDER ZIP
              </span>
              <span className="text-emerald-950 leading-snug">
                GitHub accepteert geen .zip: <strong className="font-bold">push direct naar GitHub</strong> óf download losse bestanden die GitHub wél accepteert (
                <code className="px-1 bg-white rounded border border-emerald-200 text-xs">vercel.json</code> /{' '}
                <code className="px-1 bg-white rounded border border-emerald-200 text-xs">index.html</code>).
              </span>
            </div>

            <div className="flex items-center flex-wrap gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsGitHubPushModalOpen(true)}
                className="min-h-[40px] sm:min-h-[36px] px-3.5 py-2 sm:py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <span>🚀 Push Direct naar GitHub (Zonder ZIP)</span>
              </button>
              <button
                type="button"
                onClick={handleDownloadVercelJson}
                className="min-h-[40px] sm:min-h-[36px] px-3 py-2 sm:py-1.5 rounded-xl bg-white hover:bg-slate-100 text-sky-900 border border-sky-300 font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                title="Los vercel.json bestand dat GitHub direct accepteert om de Vercel vite build fout op te lossen"
              >
                <span>📄 vercel.json</span>
              </button>
              <button
                type="button"
                onClick={handleDownloadUpdatedSingleFile}
                disabled={isDownloadingHtml}
                className="min-h-[40px] sm:min-h-[36px] px-3.5 py-2 sm:py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <span>⬇️ {isDownloadingHtml ? 'Samenstellen...' : 'index.html (1 bestand)'}</span>
              </button>
              <button
                type="button"
                onClick={handleDownloadSourceZip}
                disabled={isDownloadingSourceZip}
                className="min-h-[40px] sm:min-h-[36px] px-3 py-2 sm:py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold text-xs flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                title="Volledige broncode als .zip voor lokaal uitpakken"
              >
                <span>📦 {isDownloadingSourceZip ? '...' : '.zip'}</span>
              </button>
              <button
                type="button"
                onClick={() => setShowDownloadBar(false)}
                className="min-h-[40px] min-w-[40px] sm:min-h-[36px] sm:min-w-[36px] flex items-center justify-center rounded-lg bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 cursor-pointer"
                title="Downloadbalk verbergen"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main navigation tabs - scroll-vriendelijk zonder overlap met Header op mobiel */}
      <div className="border-b border-slate-200 bg-white z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <nav className="flex space-x-1.5 sm:space-x-2 overflow-x-auto py-2.5 scrollbar-none text-xs sm:text-sm font-semibold overscroll-x-contain touch-pan-x">
            <button
              onClick={() => setActiveTab('HOME_OVERZICHT')}
              className={`flex items-center gap-1.5 min-h-[40px] sm:min-h-[36px] px-3.5 py-2 sm:py-1.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'HOME_OVERZICHT'
                  ? 'bg-emerald-600 text-white shadow-xs font-bold'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100 bg-slate-50 border border-slate-200'
              }`}
            >
              <Radar className="w-4 h-4" />
              <span>Overzicht &amp; Advies</span>
            </button>

            <button
              onClick={() => setActiveTab('WEERBAARHEID_EN_CENTRA')}
              className={`flex items-center gap-1.5 min-h-[40px] sm:min-h-[36px] px-3.5 py-2 sm:py-1.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'WEERBAARHEID_EN_CENTRA'
                  ? 'bg-emerald-600 text-white shadow-xs font-bold'
                  : 'text-emerald-800 hover:bg-emerald-50 bg-emerald-50/60 border border-emerald-200'
              }`}
            >
              <ShieldCheck className={`w-4 h-4 ${activeTab === 'WEERBAARHEID_EN_CENTRA' ? 'text-white' : 'text-emerald-600'}`} />
              <span>Weerbaarheid, Tips &amp; Kenniscentra</span>
              <span className={`text-xs px-1.5 py-0.5 rounded font-mono-code font-bold ${
                activeTab === 'WEERBAARHEID_EN_CENTRA'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-white text-emerald-800 border border-emerald-200'
              }`}>
                HSD · BHoC · CVD
              </span>
            </button>

            <button
              onClick={() => setActiveTab('CRIMINELE_NEXUS')}
              className={`flex items-center gap-1.5 min-h-[40px] sm:min-h-[36px] px-3.5 py-2 sm:py-1.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'CRIMINELE_NEXUS'
                  ? 'bg-emerald-600 text-white shadow-xs font-bold'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100 bg-slate-50 border border-slate-200'
              }`}
            >
              <Network className={`w-4 h-4 ${activeTab === 'CRIMINELE_NEXUS' ? 'text-white' : 'text-emerald-600'}`} />
              <span>Criminele Nexus</span>
            </button>

            <button
              onClick={() => setActiveTab('AIL_NL_ANALYZER')}
              className={`flex items-center gap-1.5 min-h-[40px] sm:min-h-[36px] px-3.5 py-2 sm:py-1.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'AIL_NL_ANALYZER'
                  ? 'bg-sky-600 text-white shadow-xs font-bold'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100 bg-slate-50 border border-slate-200'
              }`}
            >
              <FileCode className={`w-4 h-4 ${activeTab === 'AIL_NL_ANALYZER' ? 'text-white' : 'text-sky-600'}`} />
              <span>AIL-Project NL</span>
            </button>

            <button
              onClick={() => setActiveTab('THREAT_TRENDS')}
              className={`flex items-center gap-1.5 min-h-[40px] sm:min-h-[36px] px-3.5 py-2 sm:py-1.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'THREAT_TRENDS'
                  ? 'bg-amber-600 text-white shadow-xs font-bold'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100 bg-slate-50 border border-slate-200'
              }`}
            >
              <TrendingUp className={`w-4 h-4 ${activeTab === 'THREAT_TRENDS' ? 'text-white' : 'text-amber-600'}`} />
              <span>Threat Trends (24u)</span>
            </button>

            <button
              onClick={() => setActiveTab('LIVE_FEED')}
              className={`flex items-center gap-1.5 min-h-[40px] sm:min-h-[36px] px-3.5 py-2 sm:py-1.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'LIVE_FEED'
                  ? 'bg-rose-600 text-white shadow-xs font-bold'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100 bg-slate-50 border border-slate-200'
              }`}
            >
              <Radio className={`w-4 h-4 ${activeTab === 'LIVE_FEED' ? 'text-white' : 'text-rose-600'} animate-pulse`} />
              <span>Volledige Live Feed</span>
              <span className={`text-xs px-1.5 py-0.5 rounded font-mono-code font-bold ${
                activeTab === 'LIVE_FEED'
                  ? 'bg-rose-700 text-white'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}>
                {threats.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('DARKWEB_FORUMS')}
              className={`flex items-center gap-1.5 min-h-[40px] sm:min-h-[36px] px-3.5 py-2 sm:py-1.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'DARKWEB_FORUMS'
                  ? 'bg-purple-600 text-white shadow-xs font-bold'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100 bg-slate-50 border border-slate-200'
              }`}
            >
              <MessageSquare className={`w-4 h-4 ${activeTab === 'DARKWEB_FORUMS' ? 'text-white' : 'text-purple-600'}`} />
              <span>Dark Web Intelligence</span>
              <span className={`text-xs px-1.5 py-0.5 rounded font-bold ${
                activeTab === 'DARKWEB_FORUMS'
                  ? 'bg-purple-700 text-white'
                  : 'bg-purple-50 text-purple-800 border border-purple-200'
              }`}>
                {DARKWEB_FORUM_DISCUSSIONS.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('NL_VITALE_INFRA')}
              className={`flex items-center gap-1.5 min-h-[40px] sm:min-h-[36px] px-3.5 py-2 sm:py-1.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'NL_VITALE_INFRA'
                  ? 'bg-sky-600 text-white shadow-xs font-bold'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100 bg-slate-50 border border-slate-200'
              }`}
            >
              <Building2 className={`w-4 h-4 ${activeTab === 'NL_VITALE_INFRA' ? 'text-white' : 'text-sky-600'}`} />
              <span>Vitale Infra (NIS2)</span>
            </button>

            <button
              onClick={() => setActiveTab('DREIGINGSACTOREN')}
              className={`flex items-center gap-1.5 min-h-[40px] sm:min-h-[36px] px-3.5 py-2 sm:py-1.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'DREIGINGSACTOREN'
                  ? 'bg-slate-900 text-white shadow-xs font-bold'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100 bg-slate-50 border border-slate-200'
              }`}
            >
              <Skull className={`w-4 h-4 ${activeTab === 'DREIGINGSACTOREN' ? 'text-white' : 'text-rose-600'}`} />
              <span>Actorendossiers (RU/CN/KP/IR)</span>
            </button>

            <button
              onClick={() => setActiveTab('IOC_DATABASE')}
              className={`flex items-center gap-1.5 min-h-[40px] sm:min-h-[36px] px-3.5 py-2 sm:py-1.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'IOC_DATABASE'
                  ? 'bg-teal-600 text-white shadow-xs font-bold'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100 bg-slate-50 border border-slate-200'
              }`}
            >
              <FileCode className={`w-4 h-4 ${activeTab === 'IOC_DATABASE' ? 'text-white' : 'text-teal-600'}`} />
              <span>IoC &amp; CVE DB</span>
            </button>

            <button
              onClick={() => setActiveTab('VRAGEN_REACTIES')}
              className={`flex items-center gap-1.5 min-h-[40px] sm:min-h-[36px] px-3.5 py-2 sm:py-1.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'VRAGEN_REACTIES'
                  ? 'bg-amber-600 text-white shadow-xs font-bold'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100 bg-slate-50 border border-slate-200'
              }`}
            >
              <MessageSquare className={`w-4 h-4 ${activeTab === 'VRAGEN_REACTIES' ? 'text-white' : 'text-amber-600'}`} />
              <span>Vragen &amp; Reacties</span>
              {isOwnerMode && unreadFeedbackCount > 0 ? (
                <span className="bg-rose-600 text-white text-xs px-1.5 py-0.5 rounded-full font-mono-code font-bold">
                  {unreadFeedbackCount} nieuw
                </span>
              ) : (
                <span className={`text-xs px-1.5 py-0.5 rounded font-mono-code ${
                  activeTab === 'VRAGEN_REACTIES'
                    ? 'bg-amber-700 text-white'
                    : 'bg-amber-50 text-amber-900 border border-amber-200'
                }`}>
                  {isOwnerMode ? 'Inbox' : 'Contact'}
                </span>
              )}
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-5 sm:space-y-6">
        {/* Tab 1: Rustig Frontpage Overzicht - Nieuwste dreigingen direct bovenaan */}
        {activeTab === 'HOME_OVERZICHT' && (
          <div className="space-y-5 sm:space-y-6">
            {/* Volledige breedte Disclaimer balk */}
            <div className="w-full flex items-start sm:items-center gap-3 px-4 py-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-950 shadow-2xs">
              <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5 sm:mt-0" />
              <span className="leading-relaxed">
                <strong className="font-bold text-emerald-900">Positieve Missie &amp; Disclaimer:</strong> Dit platform bundelt openbare dreigingsinformatie met praktische preventietips en onderzoek van Nederlandse kenniscentra ter versterking van onze gezamenlijke digitale weerbaarheid.
              </span>
            </div>

            {/* OVERZICHTELIJKE SECTIE-NAVIGATIE BOVENAAN */}
            <div className="w-full bg-white border border-slate-200 rounded-2xl p-2.5 sm:p-3.5 shadow-sm">
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setHomeSubPage('PAGE_1_DREIGINGEN_EN_WEERBAARHEID')}
                  className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                    homeSubPage === 'PAGE_1_DREIGINGEN_EN_WEERBAARHEID'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-800 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span>🚨 Dreigingen &amp; Weerbaarheid</span>
                </button>

                <button
                  type="button"
                  onClick={() => setHomeSubPage('PAGE_2_DARKWEB_EN_LEKSITES')}
                  className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                    homeSubPage === 'PAGE_2_DARKWEB_EN_LEKSITES'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-800 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span>🕵️‍♂️ Dark Web &amp; Kenniscentra</span>
                </button>

                <button
                  type="button"
                  onClick={() => setHomeSubPage('PAGE_3_NCSC_STATUS_EN_AIL')}
                  className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                    homeSubPage === 'PAGE_3_NCSC_STATUS_EN_AIL'
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-800 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span>🏛️ NCSC Status, AIL &amp; Dossiers</span>
                </button>

                <button
                  type="button"
                  onClick={() => setHomeSubPage('ALL_COMBINED')}
                  className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                    homeSubPage === 'ALL_COMBINED'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-200'
                  }`}
                >
                  <span>📋 Alles op 1 pagina</span>
                </button>
              </div>
            </div>

            {/* ================= PAGINA 1: ACTUELE DREIGINGEN, LIVE OSINT & SAMEN DIGITAAL WEERBAAR ================= */}
            {(homeSubPage === 'PAGE_1_DREIGINGEN_EN_WEERBAARHEID' || homeSubPage === 'ALL_COMBINED') && (
              <>
            {/* 1. NIEUWSTE KRITIEKE DREIGINGEN & AANVALLEN (DIRECT BOVENAAN MET PAGINERING!) */}
            {(() => {
              const filteredCritical = threats.filter((t) =>
                selectedSector !== 'ALL'
                  ? t.targetSector === selectedSector
                  : t.severity === 'KRITIEK' && t.isDutchVitalInfra
              );
              const critPerPage = 6;
              const totalCritPages = Math.max(1, Math.ceil(filteredCritical.length / critPerPage));
              const safeCritPage = Math.min(criticalThreatsPage, totalCritPages);
              const pagedCritical = filteredCritical.slice(
                (safeCritPage - 1) * critPerPage,
                safeCritPage * critPerPage
              );

              return (
                <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse shrink-0" />
                        <span className="bg-rose-50 text-rose-800 text-xs font-bold px-2.5 py-0.5 rounded-md font-mono-code border border-rose-200 uppercase">
                          NIEUWSTE DREIGINGEN · PAGINA {safeCritPage}/{totalCritPages}
                        </span>
                        <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2.5 py-0.5 rounded-md font-mono-code border border-slate-200">
                          {filteredCritical.length} KRITIEKE MELDINGEN
                        </span>
                        {selectedSector !== 'ALL' && (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedSector('ALL');
                              setCriticalThreatsPage(1);
                            }}
                            className="text-xs bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-1 rounded-lg font-mono-code hover:bg-amber-100 cursor-pointer"
                          >
                            ✕ Filter: {selectedSector.replace(/_/g, ' ')} (Reset)
                          </button>
                        )}
                      </div>
                      <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight leading-snug">
                        Actuele Kritieke Aanvallen, Noodupdates &amp; Infiltraties
                      </h3>
                    </div>

                    {/* Top Pagination & Direct Live Sync Controls */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={handleRunLiveOsintSync}
                        disabled={isSyncingLiveFeeds}
                        className="flex items-center gap-1.5 min-h-[40px] sm:min-h-[36px] px-3 py-2 sm:py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-xs sm:text-sm font-bold transition-colors shadow-xs cursor-pointer"
                        title="Direct live feeds vernieuwen"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isSyncingLiveFeeds ? 'animate-spin' : ''}`} />
                        <span>{isSyncingLiveFeeds ? 'Syncing...' : `Live Sync (${lastLiveSyncTime})`}</span>
                      </button>
                      <button
                        type="button"
                        disabled={safeCritPage <= 1}
                        onClick={() => setCriticalThreatsPage(Math.max(1, safeCritPage - 1))}
                        className="min-h-[40px] sm:min-h-[36px] px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 disabled:opacity-40 text-slate-800 border border-slate-300 text-xs sm:text-sm font-semibold cursor-pointer"
                      >
                        ← Vorige
                      </button>
                      {Array.from({ length: totalCritPages }, (_, i) => i + 1).map((pNum) => (
                        <button
                          key={pNum}
                          type="button"
                          onClick={() => setCriticalThreatsPage(pNum)}
                          className={`min-w-[36px] min-h-[36px] rounded-xl text-xs sm:text-sm font-mono-code font-bold transition-colors cursor-pointer ${
                            pNum === safeCritPage
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {pNum}
                        </button>
                      ))}
                      <button
                        type="button"
                        disabled={safeCritPage >= totalCritPages}
                        onClick={() => setCriticalThreatsPage(Math.min(totalCritPages, safeCritPage + 1))}
                        className="min-h-[40px] sm:min-h-[36px] px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 disabled:opacity-40 text-slate-800 border border-slate-300 text-xs sm:text-sm font-semibold cursor-pointer"
                      >
                        Volgende →
                      </button>
                    </div>
                  </div>

                  {/* Grid met 6 kritieke dreigingen per pagina */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pagedCritical.map((threat, idx) => {
                      const isFirstOverall = safeCritPage === 1 && idx === 0;
                      return (
                        <div
                          key={threat.id}
                          onClick={() => setDetailThreat(threat)}
                          className={`border rounded-2xl p-4 sm:p-5 transition-all flex flex-col justify-between space-y-3.5 cursor-pointer group ${
                            isFirstOverall
                              ? 'bg-rose-50/40 border-rose-300 hover:border-rose-400 shadow-sm'
                              : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs hover:shadow-sm'
                          }`}
                        >
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2.5 min-w-0">
                                <span className="text-2xl shrink-0" title={threat.originCountry}>
                                  {threat.originFlag}
                                </span>
                                <div className="min-w-0">
                                  <div className="text-xs sm:text-sm font-mono-code text-rose-700 font-bold flex items-center gap-2 flex-wrap">
                                    <span className="truncate">{threat.threatActor}</span>
                                    {isFirstOverall && (
                                      <span className="bg-rose-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-md uppercase">
                                        NIEUWSTE MELDING
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-xs text-slate-600 mt-0.5">
                                    {threat.originCountry} · <span className="text-amber-800 font-mono-code font-medium">{threat.timestamp}</span>
                                  </div>
                                </div>
                              </div>

                              <span className="bg-rose-50 text-rose-800 text-xs font-mono-code font-bold px-2.5 py-0.5 rounded-md border border-rose-200 shrink-0">
                                {threat.severity}
                              </span>
                            </div>

                            <h4 className="text-base sm:text-lg font-extrabold text-slate-900 group-hover:text-rose-700 transition-colors mt-3 leading-snug">
                              {threat.title}
                            </h4>

                            <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs">
                              <span className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 font-semibold">
                                🎯 {threat.targetVictim}
                              </span>
                              <span className="bg-amber-50 text-amber-900 px-2.5 py-1 rounded-lg border border-amber-200 font-medium">
                                {threat.targetLocation}
                              </span>
                            </div>

                            <p className="text-sm text-slate-700 mt-3 line-clamp-3 leading-relaxed">
                              {threat.description}
                            </p>

                            <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-950 leading-relaxed">
                              {getPositivePreventionTipForThreat(threat)}
                            </div>
                          </div>

                          <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2 text-xs sm:text-sm">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDetailThreat(threat);
                              }}
                              className="inline-flex items-center gap-1.5 min-h-[40px] sm:min-h-[36px] px-3.5 py-2 sm:py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 font-bold text-rose-800 transition-colors cursor-pointer"
                            >
                              <span>Details &amp; Dossier</span>
                              <ArrowUpRight className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setAiAnalysisThreat(threat);
                                setAiChatterItem(null);
                              }}
                              className="inline-flex items-center gap-1.5 min-h-[40px] sm:min-h-[36px] px-3.5 py-2 sm:py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold transition-colors cursor-pointer"
                              title="Open NCSC AI Cyber-Bot analyse voor dit incident"
                            >
                              <span>🤖 AI Bot Analyse</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Bottom Pagination bar for Critical Threats */}
                  <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm">
                    <span className="text-slate-600 font-mono-code">
                      Kritieke dreigingen pagina <strong className="text-slate-900">{safeCritPage}</strong> van{' '}
                      <strong className="text-slate-900">{totalCritPages}</strong> ({filteredCritical.length} incidenten)
                    </span>
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        disabled={safeCritPage <= 1}
                        onClick={() => setCriticalThreatsPage(Math.max(1, safeCritPage - 1))}
                        className="min-h-[40px] sm:min-h-[36px] px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 disabled:opacity-40 text-slate-800 border border-slate-300 font-semibold cursor-pointer"
                      >
                        ← Vorige 6
                      </button>
                      {Array.from({ length: totalCritPages }, (_, i) => i + 1).map((pNum) => (
                        <button
                          key={pNum}
                          type="button"
                          onClick={() => setCriticalThreatsPage(pNum)}
                          className={`min-w-[36px] min-h-[36px] rounded-xl font-mono-code font-bold cursor-pointer ${
                            pNum === safeCritPage
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {pNum}
                        </button>
                      ))}
                      <button
                        type="button"
                        disabled={safeCritPage >= totalCritPages}
                        onClick={() => setCriticalThreatsPage(Math.min(totalCritPages, safeCritPage + 1))}
                        className="min-h-[40px] sm:min-h-[36px] px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 disabled:opacity-40 text-slate-800 border border-slate-300 font-semibold cursor-pointer"
                      >
                        Volgende 6 →
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('LIVE_FEED')}
                        className="ml-1 min-h-[40px] sm:min-h-[36px] px-2 text-rose-700 hover:text-rose-900 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <span>Alle {threats.length} incidenten</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* 2. Live OSINT & NCSC Auto-Sync Monitor (Met Paginering!) */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 shrink-0">
                    <Radio className="w-5 h-5 animate-pulse" />
                  </div>
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-mono-code font-bold px-2.5 py-0.5 rounded-md uppercase">
                        AUTO-SYNC ACTIEF · {CONNECTED_THREAT_SOURCES.length} BRONNEN
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug">
                      Live Ingehaalde Hack- &amp; Incidentmeldingen (NL Focus)
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Synchroniseert automatisch{' '}
                      <span className="text-emerald-800 font-semibold">
                        Security.NL · NCSC-NL Advisories &amp; GitHub · DIVD CSIRT · DTC · Z-CERT · CERT-WM · SURFcert · Politie.nl · AIVD · Tweakers · NOS Tech · Ransomware.live (NL) · CISA KEV
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                  <a
                    href="https://github.com/NCSC-NL"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[40px] sm:min-h-[36px] px-3 py-2 sm:py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors"
                    title="Open de officiële GitHub-pagina van het Nationaal Cyber Security Centrum (github.com/NCSC-NL)"
                  >
                    <span>NCSC-NL GitHub</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    type="button"
                    onClick={() => setShowAllConnectedSources(!showAllConnectedSources)}
                    className="min-h-[40px] sm:min-h-[36px] px-3 py-2 sm:py-1.5 rounded-xl bg-white hover:bg-slate-50 text-emerald-800 border border-emerald-300 text-xs sm:text-sm font-bold transition-colors cursor-pointer"
                  >
                    {showAllConnectedSources
                      ? `Verberg Bronnen (${CONNECTED_THREAT_SOURCES.length})`
                      : `Bekijk ${CONNECTED_THREAT_SOURCES.length} Bronnen`}
                  </button>
                  <span className="text-xs font-mono-code text-slate-600 bg-slate-100 px-3 py-2 sm:py-1.5 rounded-xl border border-slate-200">
                    Check: <strong className="text-emerald-700">{lastLiveSyncTime} CET</strong>
                  </span>
                  <button
                    onClick={handleRunLiveOsintSync}
                    disabled={isSyncingLiveFeeds}
                    className="flex items-center gap-1.5 min-h-[40px] sm:min-h-[36px] px-3.5 py-2 sm:py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-xs sm:text-sm font-bold transition-colors shadow-xs cursor-pointer"
                    title="Controleer direct op nieuwe hacks, storingen en kwetsbaarheden"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncingLiveFeeds ? 'animate-spin' : ''}`} />
                    <span>{isSyncingLiveFeeds ? 'Ophalen...' : 'Nu Verversen'}</span>
                  </button>
                </div>
              </div>

              {/* Overzicht van alle Gekoppelde Online Cybersecurity & CTI Bronnen */}
              {showAllConnectedSources && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-xs font-mono-code font-bold text-emerald-800 uppercase">
                      Gekoppelde Online Cybersecurity, CSIRT &amp; Dark Web Bronnen ({CONNECTED_THREAT_SOURCES.length} Actieve Feeds)
                    </span>
                    <span className="text-xs text-slate-600">
                      Klik op een bron om de officiële feed of website te openen
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                    {CONNECTED_THREAT_SOURCES.map((src) => (
                      <a
                        key={src.id}
                        href={src.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-xl bg-white hover:bg-emerald-50/40 border border-slate-200 hover:border-emerald-300 transition-colors flex flex-col justify-between gap-2 group min-w-0 shadow-2xs"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center justify-between gap-1.5">
                            <span className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors truncate">
                              {src.countryFlag} {src.name}
                            </span>
                            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 shrink-0" />
                          </div>
                          <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                            {src.description}
                          </p>
                        </div>
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1 text-xs font-mono-code">
                          <span className="text-emerald-700 font-semibold truncate">{src.syncMethod}</span>
                          <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded font-bold shrink-0">
                            ONLINE
                          </span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {liveOsintThreats.length > 0 && (() => {
                const topSectionFingerprints = new Set(
                  threats
                    .filter((t) =>
                      selectedSector !== 'ALL'
                        ? t.targetSector === selectedSector
                        : t.severity === 'KRITIEK' && t.isDutchVitalInfra
                    )
                    .slice(0, 6)
                    .map((t) => getThreatTopicFingerprint(t))
                );
                const uniqueLiveItems = liveOsintThreats.filter(
                  (item) => !topSectionFingerprints.has(getThreatTopicFingerprint(item))
                );
                const allLiveItems = uniqueLiveItems.length > 0 ? uniqueLiveItems : liveOsintThreats;
                const livePerPage = 8;
                const totalLivePages = Math.max(1, Math.ceil(allLiveItems.length / livePerPage));
                const safeLivePage = Math.min(liveOsintPage, totalLivePages);
                const itemsToShow = allLiveItems.slice(
                  (safeLivePage - 1) * livePerPage,
                  safeLivePage * livePerPage
                );

                return (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
                      {itemsToShow.map((liveItem) => (
                        <div
                          key={liveItem.id}
                          onClick={() => setDetailThreat(liveItem)}
                          className="bg-slate-50/70 hover:bg-white border border-slate-200 hover:border-emerald-400 rounded-2xl p-4 flex flex-col justify-between gap-3 transition-all cursor-pointer group min-w-0 shadow-2xs"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center justify-between gap-2 text-xs font-mono-code">
                              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md font-bold truncate">
                                {liveItem.liveTelemetryMetrics?.packetsPerSec || 'LIVE OSINT'}
                              </span>
                              <span className="text-slate-500 shrink-0">{liveItem.timestamp.split(',')[0]}</span>
                            </div>
                            <h4 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors mt-2 leading-snug line-clamp-2">
                              {liveItem.title.replace(/^\[LIVE[^\]]*\]\s*/i, '')}
                            </h4>
                            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 line-clamp-3 leading-relaxed">
                              {liveItem.description}
                            </p>
                          </div>

                          <div className="pt-2.5 border-t border-slate-200 flex items-center justify-between gap-2 text-xs">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDetailThreat(liveItem);
                              }}
                              className="min-h-[38px] sm:min-h-[34px] px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <span>Details &amp; Bron</span>
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setAiAnalysisThreat(liveItem);
                                setAiChatterItem(null);
                              }}
                              className="min-h-[38px] sm:min-h-[34px] px-2.5 py-1.5 rounded-lg bg-white hover:bg-amber-50 text-amber-900 border border-slate-200 hover:border-amber-300 font-semibold cursor-pointer"
                            >
                              🤖 AI
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {totalLivePages > 1 && (
                      <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs sm:text-sm">
                        <span className="text-slate-600 font-mono-code">
                          Live OSINT-meldingen pagina <strong className="text-slate-900">{safeLivePage}</strong> van{' '}
                          <strong className="text-slate-900">{totalLivePages}</strong> ({allLiveItems.length} meldingen)
                        </span>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <button
                            type="button"
                            disabled={safeLivePage <= 1}
                            onClick={() => setLiveOsintPage(Math.max(1, safeLivePage - 1))}
                            className="min-h-[40px] sm:min-h-[36px] px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 disabled:opacity-40 text-slate-800 border border-slate-300 font-semibold cursor-pointer"
                          >
                            ← Vorige 8
                          </button>
                          {Array.from({ length: totalLivePages }, (_, i) => i + 1).map((pNum) => (
                            <button
                              key={pNum}
                              type="button"
                              onClick={() => setLiveOsintPage(pNum)}
                              className={`min-w-[36px] min-h-[36px] rounded-xl font-mono-code font-bold cursor-pointer ${
                                pNum === safeLivePage
                                  ? 'bg-emerald-600 text-white shadow-xs'
                                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                              }`}
                            >
                              {pNum}
                            </button>
                          ))}
                          <button
                            type="button"
                            disabled={safeLivePage >= totalLivePages}
                            onClick={() => setLiveOsintPage(Math.min(totalLivePages, safeLivePage + 1))}
                            className="min-h-[40px] sm:min-h-[36px] px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 disabled:opacity-40 text-slate-800 border border-slate-300 font-semibold cursor-pointer"
                          >
                            Volgende 8 →
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* 3. ONDER DE DREIGINGEN: Samen Digitaal Weerbaar */}
            <div className="w-full bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col gap-4">
              <div className="w-full">
                <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 border border-emerald-200">
                      <ShieldCheck className="w-5 h-5" />
                    </span>
                    <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                      Samen Digitaal Weerbaar: Advies, Kenniscentra &amp; Overzicht
                    </h2>
                  </div>
                  <span className="bg-emerald-600 text-white text-xs font-mono-code font-bold px-2.5 py-1 rounded-md uppercase">
                    POSITIEF &amp; PRAKTISCH
                  </span>
                </div>
                <p className="text-sm sm:text-[15px] text-slate-700 w-full leading-relaxed">
                  Goede cyberbeveiliging draait om <strong className="text-emerald-800">preventie, kennisdeling en praktische tips</strong>. Ontdek hieronder de inzichten van{' '}
                  <strong className="text-slate-900">Security Delta Den Haag (HSD)</strong>,{' '}
                  <strong className="text-slate-900">Brabant House of Cyber</strong> en het{' '}
                  <strong className="text-slate-900">Centrum voor Veiligheid en Digitalisering (CVD) Apeldoorn</strong>, samen met direct handelingsadvies.
                </p>
              </div>

              <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 pt-3 border-t border-emerald-200">
                <button
                  onClick={() => setActiveTab('WEERBAARHEID_EN_CENTRA')}
                  className="w-full min-h-[44px] flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold transition-colors shadow-xs cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span className="truncate">Tips &amp; Kenniscentra</span>
                </button>
                <button
                  onClick={() => setActiveTab('AIL_NL_ANALYZER')}
                  className="w-full min-h-[44px] flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-bold transition-colors shadow-xs cursor-pointer"
                >
                  <FileCode className="w-4 h-4 shrink-0" />
                  <span className="truncate">AIL-Project NL</span>
                </button>
                <button
                  onClick={() => setActiveTab('DARKWEB_FORUMS')}
                  className="w-full min-h-[44px] flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm font-bold transition-colors shadow-xs cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 shrink-0" />
                  <span className="truncate">Dark Web ({DARKWEB_FORUM_DISCUSSIONS.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('CRIMINELE_NEXUS')}
                  className="w-full min-h-[44px] flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 text-xs sm:text-sm font-bold transition-colors shadow-2xs cursor-pointer"
                >
                  <Network className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="truncate">Criminele Nexus</span>
                </button>
                <button
                  onClick={() => setActiveTab('THREAT_TRENDS')}
                  className="w-full min-h-[44px] flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-bold transition-colors shadow-xs cursor-pointer sm:col-span-2 lg:col-span-1"
                >
                  <TrendingUp className="w-4 h-4 shrink-0" />
                  <span className="truncate">24u Threat Trends</span>
                </button>
              </div>
            </div>

            <DutchCyberResilienceHub
              compactOnHome={true}
              onOpenFullResilienceTab={() => setActiveTab('WEERBAARHEID_EN_CENTRA')}
            />
              </>
            )}

            {/* ================= PAGINA 2: DARK WEB INTELLIGENCE, .ONION LEKSITES & KENNISCENTRA ================= */}
            {(homeSubPage === 'PAGE_2_DARKWEB_EN_LEKSITES' || homeSubPage === 'ALL_COMBINED') && (
              <>
                {homeSubPage === 'PAGE_2_DARKWEB_EN_LEKSITES' && (
                  <DutchCyberResilienceHub
                    compactOnHome={false}
                    onOpenFullResilienceTab={() => setActiveTab('WEERBAARHEID_EN_CENTRA')}
                  />
                )}

            {/* 3. Dark Web Intelligence & .Onion Leksites Berichten */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm space-y-4 overflow-hidden">
              <div className="space-y-3 border-b border-slate-200 pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                    <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 shrink-0">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="bg-purple-50 text-purple-800 border border-purple-200 text-xs font-mono-code font-bold px-2.5 py-0.5 rounded-md uppercase shrink-0">
                          DARK WEB INTELLIGENCE
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug">
                        Onderschepte Dark Web Berichten &amp; .Onion Leksites
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        Dossiers: <strong className="text-rose-700">PHP2Shell (50+ Gemeenten / CISA KEV)</strong> ·{' '}
                        <strong className="text-sky-800">Node2Shell / Google Brotli (CVE-2026-111497)</strong> ·{' '}
                        <strong className="text-purple-800">Cl0p (Philips 13,5 GB)</strong>
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveTab('DARKWEB_FORUMS')}
                    className="min-h-[40px] sm:min-h-[36px] px-3.5 py-2 sm:py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 text-xs sm:text-sm font-bold border border-purple-200 flex items-center gap-1.5 transition-colors shrink-0 self-start sm:self-center cursor-pointer"
                  >
                    <span>Volledige Scanner</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Filter Bar */}
                <div className="flex items-center gap-2 flex-wrap pt-1">
                  <button
                    type="button"
                    onClick={() => setHomeDarkwebFilter('ALL')}
                    className={`min-h-[38px] px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
                      homeDarkwebFilter === 'ALL'
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    Alle ({DARKWEB_FORUM_DISCUSSIONS.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setHomeDarkwebFilter('PHP2SHELL')}
                    className={`min-h-[38px] px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                      homeDarkwebFilter === 'PHP2SHELL'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200'
                    }`}
                  >
                    <span>🚨 PHP2Shell &amp; Node2Shell/Brotli (2)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setHomeDarkwebFilter('PEPIJN_SHINYHUNTERS')}
                    className={`min-h-[38px] px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                      homeDarkwebFilter === 'PEPIJN_SHINYHUNTERS'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
                    }`}
                  >
                    <span>🇳🇱 Pepijn / ShinyHunters (1)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setHomeDarkwebFilter('PHILIPS_CL0P')}
                    className={`min-h-[38px] px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                      homeDarkwebFilter === 'PHILIPS_CL0P'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200'
                    }`}
                  >
                    <span>🔴 Philips &amp; Shell Cl0p (1)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setHomeDarkwebFilter('TIER_1')}
                    className={`min-h-[38px] px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                      homeDarkwebFilter === 'TIER_1'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                    }`}
                  >
                    <span>🛡️ NL Vitaal (Tier 1)</span>
                  </button>
                </div>
              </div>

              {/* Active .Onion Ransomware Portals Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {DARKWEB_LEAK_SITES.map((site) => (
                  <div
                    key={site.id}
                    onClick={() => setActiveTab('DARKWEB_FORUMS')}
                    className="p-3 rounded-xl bg-slate-50 hover:bg-white border border-slate-200 hover:border-purple-300 transition-all cursor-pointer flex items-center justify-between gap-2 min-w-0 shadow-2xs"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                            site.status === 'INBESLAGGENOMEN_JUSTITIE'
                              ? 'bg-amber-500'
                              : 'bg-rose-600 animate-pulse'
                          }`}
                        />
                        <div className="text-sm font-bold text-slate-900 truncate" title={site.name}>
                          {site.name}
                        </div>
                      </div>
                      <div className="text-xs font-mono-code text-purple-700 truncate mt-0.5">
                        {site.onionAddress}
                      </div>
                    </div>
                    <span className="text-xs font-mono-code text-rose-800 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200 font-bold shrink-0">
                      {site.activeVictimsCount}
                    </span>
                  </div>
                ))}
              </div>

              {/* Intercepted Dark Web Intelligence Messages Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {DARKWEB_FORUM_DISCUSSIONS.filter((item) => {
                  if (homeDarkwebFilter === 'PHP2SHELL') {
                    const text = `${item.topicTitle} ${item.excerpt} ${item.forumName}`.toLowerCase();
                    return (
                      text.includes('php2shell') ||
                      text.includes('109618') ||
                      text.includes('php-lek') ||
                      text.includes('brotli') ||
                      text.includes('111497') ||
                      text.includes('node2shell')
                    );
                  }
                  if (homeDarkwebFilter === 'PEPIJN_SHINYHUNTERS') {
                    const text = `${item.topicTitle} ${item.excerpt} ${item.forumName} ${item.actorAffiliation}`.toLowerCase();
                    return (
                      text.includes('pepijn') ||
                      text.includes('shinyhunters') ||
                      text.includes('umbreon') ||
                      text.includes('shinywire') ||
                      text.includes('krebsonsecurity')
                    );
                  }
                  if (homeDarkwebFilter === 'PHILIPS_CL0P') {
                    const text = `${item.topicTitle} ${item.excerpt} ${item.forumName}`.toLowerCase();
                    return text.includes('philips') || text.includes('cl0p') || text.includes('windchill');
                  }
                  if (homeDarkwebFilter === 'TIER_1') {
                    return item.threatTier === 'TIER_1_NL_VITAAL';
                  }
                  return true;
                })
                  .slice(0, showAllDarkwebOnHome ? DARKWEB_FORUM_DISCUSSIONS.length : 6)
                  .map((chatter) => (
                    <div
                      key={chatter.id}
                      onClick={() => setPortalChatterDetail(chatter)}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3.5 group min-w-0 overflow-hidden shadow-2xs hover:shadow-sm ${
                        chatter.id.includes('php2shell')
                          ? 'bg-rose-50/40 border-rose-300 hover:border-rose-400'
                          : chatter.id.includes('krebs')
                          ? 'bg-amber-50/40 border-amber-300 hover:border-amber-400'
                          : chatter.id.includes('philips')
                          ? 'bg-rose-50/30 border-rose-200 hover:border-rose-300'
                          : 'bg-white border-slate-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="space-y-3 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2 flex-wrap min-w-0">
                            <span className="text-base shrink-0">{chatter.originFlag}</span>
                            <span className="text-xs font-mono-code font-bold bg-purple-50 text-purple-900 px-2.5 py-0.5 rounded-md border border-purple-200 truncate max-w-[260px] sm:max-w-[320px]">
                              {chatter.forumName}
                            </span>
                            {chatter.status === 'GEVERIFIEERD_GEVAAR' && (
                              <span className="text-xs font-mono-code font-bold bg-rose-50 text-rose-800 px-2 py-0.5 rounded-md border border-rose-200 shrink-0">
                                GEVERIFIEERD
                              </span>
                            )}
                          </div>
                          <span className="text-xs font-mono-code text-amber-800 shrink-0 text-right font-medium">
                            {chatter.timestamp.split('(')[0].trim()}
                          </span>
                        </div>

                        <h4 className="text-base font-extrabold text-slate-900 group-hover:text-purple-800 transition-colors leading-snug break-words">
                          {chatter.topicTitle}
                        </h4>

                        <p className="text-xs sm:text-sm text-slate-700 font-mono-code bg-slate-50 p-3 rounded-xl border border-slate-200 line-clamp-3 leading-relaxed break-words">
                          "{chatter.excerpt}"
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 min-w-0">
                            <span className="text-slate-500 font-mono-code block text-[11px] uppercase font-semibold">DOELWIT / KETEN</span>
                            <span className="text-rose-800 font-bold truncate block mt-0.5" title={chatter.targetedSectorOrRegion}>
                              {chatter.targetedSectorOrRegion}
                            </span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 min-w-0">
                            <span className="text-slate-500 font-mono-code block text-[11px] uppercase font-semibold">STATUS / LEK ARCHIEF</span>
                            <span
                              className="text-emerald-800 font-mono-code font-bold truncate block mt-0.5"
                              title={chatter.priceListed || chatter.onionUrlMask}
                            >
                              {chatter.priceListed || chatter.onionUrlMask}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2 text-xs sm:text-sm">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPortalChatterDetail(chatter);
                          }}
                          className="min-h-[40px] sm:min-h-[36px] px-3.5 py-2 sm:py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4 text-purple-700 shrink-0" />
                          <span>Details &amp; Dossier</span>
                          <ArrowUpRight className="w-4 h-4 shrink-0" />
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAnalyzeChatterWithAi(chatter);
                          }}
                          className="min-h-[40px] sm:min-h-[36px] px-3 py-2 sm:py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold text-xs sm:text-sm transition-colors shrink-0 cursor-pointer"
                        >
                          🤖 AI Analyse
                        </button>
                      </div>
                    </div>
                  ))}
              </div>

              <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setShowAllDarkwebOnHome(!showAllDarkwebOnHome)}
                  className="min-h-[40px] px-2 text-sm text-purple-700 hover:text-purple-900 font-bold underline underline-offset-4 cursor-pointer"
                >
                  {showAllDarkwebOnHome
                    ? 'Toon compact overzicht (6 belangrijkste Dark Web berichten)'
                    : `Toon alle ${DARKWEB_FORUM_DISCUSSIONS.length} onderschepte Dark Web berichten op deze pagina`}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('DARKWEB_FORUMS')}
                  className="min-h-[40px] px-3 text-sm text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Open Volledige Dark Web Intelligence &amp; Scanner</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
              </>
            )}

            {/* ================= PAGINA 3: NCSC STATUS BOARD, CRIMINELE NEXUS & AIL LEAK SCANNER ================= */}
            {(homeSubPage === 'PAGE_3_NCSC_STATUS_EN_AIL' || homeSubPage === 'ALL_COMBINED') && (
              <>
            {/* 4. NCSC-NL Status Board */}
            <NcscStatusBoard />

            {/* 7. Criminologische Verbanden Spotlight Alert Card */}
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
              <div className="flex items-start gap-3">
                <span className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700 border border-emerald-200 shrink-0 mt-0.5">
                  <Network className="w-5 h-5" />
                </span>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono-code font-bold bg-white text-emerald-800 px-2.5 py-0.5 rounded-md border border-emerald-200">
                      ONDERMIJNING &amp; CTI INZICHT
                    </span>
                    <span className="text-sm font-bold text-slate-900">
                      Verbanden: Drugshandel × Darknetmarkten × Fraude × Cybercriminaliteit
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 max-w-2xl leading-relaxed">
                    Hoe haveninbraken (Portbase) fysieke cocaïnesmokkel mogelijk maken, hoe infostealer-data van darknetmarkten leidt tot bank helpdeskfraude, en hoe ransomware-miljoenen worden gewit via contante drugscash.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('CRIMINELE_NEXUS')}
                className="min-h-[44px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold transition-colors shadow-xs shrink-0 cursor-pointer"
              >
                <span>Verken de Verbanden &amp; Ketens</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Duidelijke Verwijzingen naar Verder Lezen & Diepgaande Secties */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <span>📖</span>
                  <span>Verder Lezen: Diepgaande Dashboards &amp; CTI Dossiers</span>
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  Klik op een van onderstaande onderdelen om rustig verder te lezen in het gewenste kennisgebied:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
                <button
                  onClick={() => setActiveTab('THREAT_TRENDS')}
                  className="bg-slate-50/70 hover:bg-white p-4 rounded-2xl border border-slate-200 hover:border-amber-300 transition-all text-left flex flex-col justify-between group shadow-2xs cursor-pointer"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="p-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
                        <TrendingUp className="w-4 h-4" />
                      </span>
                      <span className="text-xs bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-md font-mono-code font-bold">
                        Nieuw
                      </span>
                    </div>
                    <div className="font-bold text-slate-900 text-base group-hover:text-amber-700 transition-colors">
                      Threat Trends (24u)
                    </div>
                    <p className="text-slate-600 text-sm mt-1 leading-relaxed">
                      Interactieve Recharts uurgrafieken van aanvalsfrequenties per sector &amp; anomaliespieken.
                    </p>
                  </div>
                  <div className="mt-3.5 flex items-center gap-1 text-amber-700 text-sm font-bold">
                    <span>Bekijk trends &amp; pieken</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('LIVE_FEED')}
                  className="bg-slate-50/70 hover:bg-white p-4 rounded-2xl border border-slate-200 hover:border-rose-300 transition-all text-left flex flex-col justify-between group shadow-2xs cursor-pointer"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="p-2 rounded-xl bg-rose-50 text-rose-700 border border-rose-200">
                        <Radio className="w-4 h-4" />
                      </span>
                      <span className="text-xs bg-rose-50 text-rose-800 border border-rose-200 px-2 py-0.5 rounded-md font-mono-code font-bold">
                        {threats.length} feeds
                      </span>
                    </div>
                    <div className="font-bold text-slate-900 text-base group-hover:text-rose-700 transition-colors">
                      Volledige Live Feed
                    </div>
                    <p className="text-slate-600 text-sm mt-1 leading-relaxed">
                      Alle actieve incidenten met filters op sector, statelijke actoren, datum en NIS2.
                    </p>
                  </div>
                  <div className="mt-3.5 flex items-center gap-1 text-rose-700 text-sm font-bold">
                    <span>Naar live stream</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('DREIGINGSACTOREN')}
                  className="bg-slate-50/70 hover:bg-white p-4 rounded-2xl border border-slate-200 hover:border-purple-300 transition-all text-left flex flex-col justify-between group shadow-2xs cursor-pointer"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="p-2 rounded-xl bg-purple-50 text-purple-700 border border-purple-200">
                        <Skull className="w-4 h-4" />
                      </span>
                      <span className="text-xs text-slate-600 font-mono-code">
                        🇷🇺 🇨🇳 🇰🇵 🇮🇷
                      </span>
                    </div>
                    <div className="font-bold text-slate-900 text-base group-hover:text-purple-700 transition-colors">
                      Dreigingsactoren
                    </div>
                    <p className="text-slate-600 text-sm mt-1 leading-relaxed">
                      Dossiers over Sandworm (RU), Volt Typhoon (CN), Lazarus (KP) en MuddyWater (IR).
                    </p>
                  </div>
                  <div className="mt-3.5 flex items-center gap-1 text-purple-700 text-sm font-bold">
                    <span>Lees dossiers</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('NL_VITALE_INFRA')}
                  className="bg-slate-50/70 hover:bg-white p-4 rounded-2xl border border-slate-200 hover:border-sky-300 transition-all text-left flex flex-col justify-between group shadow-2xs cursor-pointer"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="p-2 rounded-xl bg-sky-50 text-sky-700 border border-sky-200">
                        <Building2 className="w-4 h-4" />
                      </span>
                      <span className="text-xs bg-sky-50 text-sky-800 border border-sky-200 px-2 py-0.5 rounded-md font-mono-code font-bold">
                        12 Sectoren
                      </span>
                    </div>
                    <div className="font-bold text-slate-900 text-base group-hover:text-sky-700 transition-colors">
                      Vitale Infra (NIS2)
                    </div>
                    <p className="text-slate-600 text-sm mt-1 leading-relaxed">
                      Havens, hoogspanning, dijken, drinkwater, telecom, banken en ziekenhuizen.
                    </p>
                  </div>
                  <div className="mt-3.5 flex items-center gap-1 text-sky-700 text-sm font-bold">
                    <span>Naar vitale sectoren</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('CRIMINELE_NEXUS')}
                  className="bg-slate-50/70 hover:bg-white p-4 rounded-2xl border border-slate-200 hover:border-emerald-300 transition-all text-left flex flex-col justify-between group shadow-2xs cursor-pointer sm:col-span-2 lg:col-span-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <Network className="w-4 h-4" />
                        </span>
                        <span className="text-xs bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-md font-mono-code font-bold border border-emerald-200">
                          DIEPTE-ONDERZOEK
                        </span>
                        <span className="text-sm sm:text-base font-bold text-slate-900">
                          Criminologische Nexus: Drugshandel, Darknetmarkten, Fraude &amp; Cybercrime
                        </span>
                      </div>
                      <p className="text-slate-600 text-sm leading-relaxed max-w-4xl">
                        Ontdek hoe terminalinbraken in de Rotterdamse haven cocaïnesmokkel aandrijven, hoe gestolen infostealer-data van darknet markten leidt tot grootschalige bank helpdeskfraude, en hoe ransomware-miljoenen worden gewit via ondergrondse cash-swaps.
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 text-emerald-800 text-sm font-bold shrink-0 bg-emerald-50 px-4 py-2.5 rounded-xl border border-emerald-200 group-hover:bg-emerald-100 transition-colors">
                      <span>Verken alle verbanden</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </button>
              </div>

              {/* Optional inline expander if user explicitly wants full stream on home */}
              <div className="pt-2 text-center">
                <button
                  onClick={() => setShowFullFeedOnHome(!showFullFeedOnHome)}
                  className="min-h-[40px] text-sm text-slate-600 hover:text-slate-900 underline underline-offset-4 cursor-pointer font-medium"
                >
                  {showFullFeedOnHome
                    ? 'Verberg de volledige live stream op deze hoofdpagina (houd het rustig)'
                    : 'Toch de volledige live feed hieronder uitklappen?'}
                </button>
              </div>

              {showFullFeedOnHome && (
                <div className="pt-4 border-t border-slate-200 space-y-4">
                  <LiveDarkwebFeed
                    threats={threats}
                    selectedSector={selectedSector}
                    onSelectSector={setSelectedSector}
                    onSelectThreatForAi={(threat) => {
                      setAiAnalysisThreat(threat);
                      setAiChatterItem(null);
                    }}
                    onOpenDetailsModal={(threat) => setDetailThreat(threat)}
                    lastLiveSyncTime={lastLiveSyncTime}
                    isSyncingLiveFeeds={isSyncingLiveFeeds}
                    onSyncLiveFeeds={handleRunLiveOsintSync}
                  />
                </div>
              )}
            </div>

            {/* 5. AIL-Project Nederland (Analysis of Information Leaks — CIRCL) Direct op Home */}
            <AilNetherlandsIntegration />
              </>
            )}

            {/* ONDERAAN SECTIE-NAVIGATOR */}
            <div className="w-full bg-white border border-slate-200 rounded-2xl p-2.5 sm:p-3.5 shadow-sm">
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setHomeSubPage('PAGE_1_DREIGINGEN_EN_WEERBAARHEID');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl text-sm font-bold transition-colors cursor-pointer ${
                    homeSubPage === 'PAGE_1_DREIGINGEN_EN_WEERBAARHEID'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-800 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  🚨 Dreigingen &amp; Weerbaarheid
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setHomeSubPage('PAGE_2_DARKWEB_EN_LEKSITES');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl text-sm font-bold transition-colors cursor-pointer ${
                    homeSubPage === 'PAGE_2_DARKWEB_EN_LEKSITES'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-800 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  🕵️‍♂️ Dark Web &amp; Kenniscentra
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setHomeSubPage('PAGE_3_NCSC_STATUS_EN_AIL');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl text-sm font-bold transition-colors cursor-pointer ${
                    homeSubPage === 'PAGE_3_NCSC_STATUS_EN_AIL'
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-800 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  🏛️ NCSC Status, AIL &amp; Dossiers
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setHomeSubPage('ALL_COMBINED');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl text-sm font-bold transition-colors cursor-pointer ${
                    homeSubPage === 'ALL_COMBINED'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-200'
                  }`}
                >
                  📋 Alles op 1 pagina
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Nederlandse Cyberweerbaarheid, Praktische Tips & Kenniscentra (Security Delta Den Haag, Brabant House of Cyber, CVD Apeldoorn) */}
        {activeTab === 'WEERBAARHEID_EN_CENTRA' && (
          <DutchCyberResilienceHub compactOnHome={false} />
        )}

        {/* Tab: AIL-Project Nederland (CIRCL Analysis of Information Leaks) */}
        {activeTab === 'AIL_NL_ANALYZER' && <AilNetherlandsIntegration />}

        {/* Tab: Criminologische Nexus (Drugshandel, Darknetmarkten, Fraude en Cybercriminaliteit) */}
        {activeTab === 'CRIMINELE_NEXUS' && (
          <CrimeNexusMatrix
            onNavigateToTab={(tab) => setActiveTab(tab as ActiveViewTab)}
          />
        )}

        {/* Tab 2: Threat Trends Dashboard (Recharts 24-uurs telemetrie & patronen per sector) */}
        {activeTab === 'THREAT_TRENDS' && (
          <ThreatTrendsDashboard
            threats={threats}
            selectedSector={selectedSector}
            onSelectSector={setSelectedSector}
            onSelectThreatForDetail={(threat) => setDetailThreat(threat)}
            onNavigateToTab={(tab) => setActiveTab(tab as ActiveViewTab)}
            onOpenPdfModal={() => setIsPdfModalOpen(true)}
          />
        )}

        {/* Tab 3: Dedicated Volledige Live Feed & CTI Stream */}
        {activeTab === 'LIVE_FEED' && (
          <div className="space-y-6">
            <ThreatAnalysisSummary
              threats={threats}
              selectedSector={selectedSector}
            />
            <LiveDarkwebFeed
              threats={threats}
              selectedSector={selectedSector}
              onSelectSector={setSelectedSector}
              onSelectThreatForAi={(threat) => {
                setAiAnalysisThreat(threat);
                setAiChatterItem(null);
              }}
              onOpenDetailsModal={(threat) => setDetailThreat(threat)}
              lastLiveSyncTime={lastLiveSyncTime}
              isSyncingLiveFeeds={isSyncingLiveFeeds}
              onSyncLiveFeeds={handleRunLiveOsintSync}
            />
          </div>
        )}

        {/* Tab 4: Dark Web Forums & Underground Chatter */}
        {activeTab === 'DARKWEB_FORUMS' && (
          <DarkwebChatterMonitor
            onAnalyzeChatterWithAi={handleAnalyzeChatterWithAi}
            onTestTierSound={(tier) => playTierSound(tier)}
          />
        )}

        {/* Tab 3: Dutch Vital Infrastructure granular overview */}
        {activeTab === 'NL_VITALE_INFRA' && (
          <div className="space-y-6">
            <NcscStatusBoard />
            <DutchVitalInfraTracker />
          </div>
        )}

        {/* Tab 4: Threat Actor Dossiers (Russia, China, Cartels) */}
        {activeTab === 'DREIGINGSACTOREN' && (
          <ThreatActorDossier
            onSelectActorForAi={(actor) => {
              const syntheticThreat: ThreatItem = {
                id: actor.id,
                title: `Diepte-analyse van ${actor.name} (${actor.originCountry})`,
                threatActor: actor.name,
                threatActorType: 'STAATSGESPONSORD_APT',
                origin: actor.origin,
                originCountry: actor.originCountry,
                originFlag:
                  actor.origin === 'RUSLAND'
                    ? '🇷🇺'
                    : actor.origin === 'CHINA'
                    ? '🇨🇳'
                    : actor.origin === 'NOORD_KOREA'
                    ? '🇰🇵'
                    : actor.origin === 'IRAN'
                    ? '🇮🇷'
                    : '🏴‍☠️',
                targetVictim: 'Europese & Nederlandse Vitale Infrastructuur',
                targetSector: 'HAVEN_EN_LOGISTIEK',
                targetLocation: 'Rotterdam / Amsterdam, Nederland',
                isDutchVitalInfra: true,
                severity: actor.threatLevel,
                notificationTier: 'TIER_1_NL_VITAAL',
                timestamp: 'Zojuist',
                attackVector: actor.cvesExploited.join(', '),
                mitreTechniques: actor.knownTTPs,
                description: actor.description + ' ' + actor.focusOnNetherlands,
                leakStatus: 'ACTIEF_LEK',
                verifiedByCsirt: true,
                verificationConfidenceScore: 98,
                verificationSources: [],
              };
              setAiAnalysisThreat(syntheticThreat);
              setAiChatterItem(null);
            }}
          />
        )}

        {/* Tab 5: IoCs database */}
        {activeTab === 'IOC_DATABASE' && <IoCTracker />}

        {/* Tab 6: Tiered Notification Config & Test Center */}
        {activeTab === 'NOTIFICATIE_TIERS' && (
          <TieredNotificationConfig
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onTriggerTestTierPush={handleTriggerTestTierPush}
          />
        )}

        {/* Tab 7: Vragen & Reactiecentrum */}
        {activeTab === 'VRAGEN_REACTIES' && (
          <VisitorFeedbackManager
            threats={threats}
            isOwnerMode={isOwnerMode}
            onNavigateToThreat={(id) => {
              const found = threats.find((t) => t.id === id);
              if (found) setDetailThreat(found);
            }}
          />
        )}
      </main>

      {/* Threat Detail Modal */}
      <ThreatDetailModal
        threat={detailThreat}
        isOpen={Boolean(detailThreat)}
        onClose={() => setDetailThreat(null)}
        onOpenAiAnalysis={(t) => {
          setDetailThreat(null);
          setAiAnalysisThreat(t);
          setAiChatterItem(null);
        }}
        onOpenVerification={(t) => setVerificationThreat(t)}
        onAskQuestion={(t) => {
          setDetailThreat(null);
          setFeedbackPreselectedThreat(t);
          setIsFeedbackModalOpen(true);
        }}
      />

      {/* Portal Dark Web Intelligence Dossier Modal */}
      {portalChatterDetail && (
        <div
          onClick={() => setPortalChatterDetail(null)}
          className="fixed inset-0 z-[70] flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl relative overflow-hidden flex flex-col max-h-[92vh]"
          >
            <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-200">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono-code font-bold bg-rose-50 text-rose-800 border border-rose-200 px-2.5 py-0.5 rounded-md">
                    DARK WEB INTELLIGENCE DOSSIER
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    <span>{portalChatterDetail.originFlag}</span>
                    <span>{portalChatterDetail.forumName}</span>
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug">
                  {portalChatterDetail.topicTitle}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setPortalChatterDetail(null)}
                className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 flex-1 overflow-y-auto space-y-4 pr-1 text-sm">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="text-xs font-mono-code text-purple-800 uppercase font-bold">
                  Onderschept Dark Web Bericht ({portalChatterDetail.onionUrlMask})
                </div>
                <p className="text-sm text-slate-800 font-mono-code leading-relaxed bg-white p-3.5 rounded-xl border border-slate-200">
                  "{portalChatterDetail.excerpt}"
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-xs font-mono-code text-slate-500 block font-semibold">AUTEUR &amp; ACTOR AFFILIATIE</span>
                  <span className="font-bold text-purple-800 mt-1 block">
                    {portalChatterDetail.authorHandle} ({portalChatterDetail.authorReputation})
                  </span>
                  <span className="text-xs sm:text-sm text-slate-700 mt-1 block">
                    Groepering: <strong className="text-slate-900">{portalChatterDetail.actorAffiliation}</strong>
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-xs font-mono-code text-slate-500 block font-semibold">DOELWIT &amp; GEDETECTEERDE TACTIEK</span>
                  <span className="font-bold text-rose-700 mt-1 block">
                    {portalChatterDetail.targetedSectorOrRegion}
                  </span>
                  <span className="text-xs sm:text-sm text-amber-800 font-mono-code mt-1 block">
                    {portalChatterDetail.detectedTactic}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-900 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>CSIRT-NL &amp; NCSC Handelingsperspectief</span>
                </div>
                <p className="text-slate-800 leading-relaxed text-sm">
                  Dit dark web bericht is geverifieerd door onze Tor- en CTI-sensoren ({portalChatterDetail.forumName}). Controleer direct of uw organisatie of ketenpartners gebruikmaken van de genoemde systemen (zoals PTC Windchill / FlexPLM CVE-2026-12569) en blokkeer bijbehorende exfiltratie-IP's in uw SIEM/SOAR.
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => {
                  const item = portalChatterDetail;
                  setPortalChatterDetail(null);
                  handleAnalyzeChatterWithAi(item);
                }}
                className="min-h-[42px] flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Open in NCSC AI Analyse</span>
              </button>

              <button
                type="button"
                onClick={() => setPortalChatterDetail(null)}
                className="min-h-[42px] px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 text-sm font-bold transition-colors cursor-pointer"
              >
                Sluiten
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Multi-Source Verification Modal (rendered after ThreatDetailModal so it stacks on top) */}
      <MultiSourceVerificationModal
        threat={verificationThreat}
        isOpen={Boolean(verificationThreat)}
        onClose={() => setVerificationThreat(null)}
      />

      {/* Visitor Feedback & Response Modal */}
      <VisitorFeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => {
          setIsFeedbackModalOpen(false);
          setFeedbackPreselectedThreat(null);
        }}
        isOwnerMode={isOwnerMode}
        preselectedThreat={feedbackPreselectedThreat}
        threats={threats}
      />

      {/* AI Threat Analyst Modal */}
      <AiThreatAnalystModal
        threat={aiAnalysisThreat}
        chatterItem={aiChatterItem}
        isOpen={Boolean(aiAnalysisThreat || aiChatterItem)}
        onClose={() => {
          setAiAnalysisThreat(null);
          setAiChatterItem(null);
        }}
      />

      {/* Global Executive Threat Intelligence PDF Report Modal */}
      <ThreatReportPdfModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        summaryData={getDefaultExecutiveSummary(threats, selectedSector)}
        threats={threats}
        selectedSector={selectedSector}
      />

      {/* Direct GitHub Push & Single-File Modal (Zonder ZIP) */}
      <GitHubPushModal
        isOpen={isGitHubPushModalOpen}
        onClose={() => setIsGitHubPushModalOpen(false)}
        onDownloadVercelJson={handleDownloadVercelJson}
        onDownloadSingleHtml={handleDownloadUpdatedSingleFile}
      />

      {/* SEO, Google Indexatie, Schema.org JSON-LD & RSS Syndicatie Modal */}
      {isSeoModalOpen && (
        <div
          onClick={() => setIsSeoModalOpen(false)}
          className="fixed inset-0 z-[75] flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white border border-slate-200 rounded-2xl max-w-3xl w-full p-4 sm:p-6 shadow-2xl relative overflow-hidden flex flex-col max-h-[92vh]"
          >
            <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-200">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono-code font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-md">
                    WEB-ZICHTBAARHEID &amp; SEO INDEXATIE ACTIEF
                  </span>
                  <span className="text-xs font-mono-code text-sky-800 bg-sky-50 border border-sky-200 px-2.5 py-0.5 rounded-md">
                    Schema.org JSON-LD + Sitemap + RSS 2.0
                  </span>
                </div>
                <h2 className="text-lg font-extrabold text-slate-900">
                  Zoekmachine-Optimalisatie (Google / Bing / OSINT Crawlers)
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Alle technische SEO-standaarden zijn actief op Bedreigingsmonitor.nl voor maximale vindbaarheid in Google Zoeken, Google News en CTI RSS-aggregators.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsSeoModalOpen(false)}
                className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 flex-1 overflow-y-auto space-y-4 pr-1 text-sm">
              {/* Live SEO Endpoints Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: 'sitemap',
                    title: 'XML Sitemap (Google/Bing)',
                    path: '/sitemap.xml',
                    desc: 'Indexeert alle secties, AIL-NL scanner en live dreigingsdossiers.',
                    badge: '200 OK · XML',
                  },
                  {
                    id: 'rss',
                    title: 'Live CTI RSS 2.0 Feed',
                    path: '/rss.xml',
                    desc: 'Syndicatie-feed voor Google News, Feedly, MISP & SOC-teams.',
                    badge: '200 OK · RSS',
                  },
                  {
                    id: 'robots',
                    title: 'Crawler Instructies',
                    path: '/robots.txt',
                    desc: 'Geeft Googlebot, Googlebot-News en Bingbot volledige toegang.',
                    badge: '200 OK · TXT',
                  },
                ].map((ep) => (
                  <div
                    key={ep.id}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1.5 mb-1.5">
                        <span className="font-bold text-slate-900 text-sm">{ep.title}</span>
                        <span className="text-xs font-mono-code px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                          {ep.badge}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{ep.desc}</p>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <a
                        href={ep.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 min-h-[38px] text-center px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-sky-700 border border-slate-300 font-mono-code text-xs flex items-center justify-center gap-1 font-semibold"
                      >
                        <span>Open {ep.path}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          const fullUrl = `${window.location.origin}${ep.path}`;
                          navigator.clipboard?.writeText(fullUrl);
                          setCopiedSeoItem(ep.id);
                          setTimeout(() => setCopiedSeoItem(null), 2000);
                        }}
                        className="min-h-[38px] px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-mono-code text-xs font-semibold cursor-pointer"
                      >
                        {copiedSeoItem === ep.id ? 'Gekopieerd!' : 'Kopieer'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actieve SEO Optimalisaties Checklist */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="text-xs font-mono-code font-bold text-emerald-800 uppercase">
                  Geïmplementeerde Zoekmachine- &amp; Rich Snippet Optimalisaties
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm text-slate-700">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-slate-900">Schema.org JSON-LD Graph:</strong> WebSite, Organization, SecurityApplication, Dataset &amp; FAQPage rich snippets.
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-slate-900">OpenGraph &amp; Twitter/X Cards:</strong> 1200×630 social preview kaart (<code>/og-banner.svg</code>) voor LinkedIn, X en WhatsApp.
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-slate-900">Dynamische Titel &amp; Canonical URL&apos;s:</strong> Automatische meta-synchronisatie per tabblad, NIS2-sector en dreigingsdossier.
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-slate-900">Nederlandse Trefwoord-Indexatie:</strong> Geoptimaliseerd voor NCSC-NL, AIVD, MIVD, NIS2, ransomware, darkweb en actuele CVE-nummers.
                    </span>
                  </div>
                </div>
              </div>

              {/* Social Preview Banner Weergave */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono-code font-bold text-slate-700 uppercase">
                    Live Social Share Card Preview (LinkedIn / X / WhatsApp / Slack)
                  </span>
                  <a
                    href="/og-banner.svg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-sky-700 hover:underline font-mono-code flex items-center gap-1 font-semibold"
                  >
                    <span>/og-banner.svg</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
                <img
                  src="/og-banner.svg"
                  alt="Bedreigingsmonitor.nl OpenGraph Preview"
                  className="w-full rounded-lg border border-slate-200 max-h-48 object-cover"
                />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between gap-2 flex-wrap">
              <span className="text-xs font-mono-code text-emerald-700 font-semibold">
                ✓ Meegeleverd in uw 1-bestand download (index.html) én hosting-pakket
              </span>
              <button
                type="button"
                onClick={() => setIsSeoModalOpen(false)}
                className="min-h-[40px] px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 text-sm font-bold transition-colors cursor-pointer"
              >
                Sluiten
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-xs sm:text-sm text-slate-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3.5">
          {/* Officiële Disclaimer Balk in Footer */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start sm:items-center gap-2.5 text-slate-700 text-xs sm:text-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 sm:mt-0" />
            <p className="leading-relaxed">
              <strong className="text-slate-900 font-bold">Disclaimer:</strong> Dit platform indexeert alleen openbaar zichtbare informatie. De dienst wordt aangeboden ter ondersteuning van publieke bewustwording, legitiem onderzoek en cyberweerbaarheid.
            </p>
          </div>

          {/* SEO & Publieke Indexatie Snelkoppelingen */}
          <div className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-emerald-700 font-mono-code font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                SEO &amp; Web-Indexatie:
              </span>
              <button
                type="button"
                onClick={() => setIsSeoModalOpen(true)}
                className="text-sky-700 hover:text-sky-900 underline font-mono-code font-semibold cursor-pointer"
              >
                SEO &amp; Rich Snippets Status
              </button>
              <span className="text-slate-300">·</span>
              <a
                href="/sitemap.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-600 hover:text-slate-900 font-mono-code transition-colors"
              >
                Sitemap.xml
              </a>
              <span className="text-slate-300">·</span>
              <a
                href="/rss.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-600 hover:text-slate-900 font-mono-code transition-colors"
              >
                Live RSS 2.0 Feed
              </a>
              <span className="text-slate-300">·</span>
              <a
                href="/robots.txt"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-600 hover:text-slate-900 font-mono-code transition-colors"
              >
                Robots.txt
              </a>
            </div>
            <div className="text-slate-500 font-mono-code text-xs">
              Schema.org JSON-LD · OpenGraph NL · NIS2 &amp; NCSC-NL
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2 text-slate-700 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <span>Bedreigingsmonitor.nl · Nationaal Cyber Threat Intelligence Systeem</span>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center sm:justify-end">
              <div className="font-mono-code text-xs text-slate-600">
                NCSC-NL / CSIRT · NIS2 Essentieel · V5.6
              </div>
              <span className="text-slate-300 hidden sm:inline">|</span>

              <button
                onClick={() => setIsFeedbackModalOpen(true)}
                className="min-h-[38px] px-2 text-slate-700 hover:text-amber-800 transition-colors flex items-center gap-1.5 font-mono-code text-xs font-semibold cursor-pointer"
                title="Stel een vraag of open het contactformulier"
              >
                <MessageSquare className="w-4 h-4 text-amber-600" />
                <span>Contact &amp; Vragen</span>
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
