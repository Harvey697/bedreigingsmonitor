export type ThreatSeverity = 'KRITIEK' | 'HOOG' | 'VERHOOGD' | 'MATIG';

export type NotificationTier = 'TIER_1_NL_VITAAL' | 'TIER_2_EUROPA' | 'TIER_3_DARKWEB_CHATTER';

export type ThreatOrigin = 'RUSLAND' | 'CHINA' | 'DARKWEB_SYNDICAAT' | 'NOORD_KOREA' | 'IRAN' | 'ONBEKEND';

export type VitalSectorNL =
  | 'HAVEN_EN_LOGISTIEK'
  | 'ENERGIE_EN_NETBEHEER'
  | 'WATERBEHEER_EN_DIJKEN'
  | 'TELECOM_EN_INTERNET'
  | 'ZORG_EN_ZIEKENHUIZEN'
  | 'FINANCIELE_SECTOR'
  | 'RIJKSOVERHEID_EN_DEFENSIE'
  | 'VOEDSEL_EN_AGRO'
  | 'TRANSPORT_EN_LUCHTVAART'
  | 'HIGHTECH_EN_CHIPS'
  | 'CHEMIE_EN_INDUSTRIE'
  | 'ONDERWIJS_EN_WETENSCHAP';

export interface VerificationSource {
  id: string;
  sourceName: string; // e.g. 'NCSC-NL (CSIRT)', 'MIVD / AIVD Taskforce', 'Darkweb Tor Scraper', 'CERT-EU', 'Mandiant Intel'
  type: 'OVERHEID_CSIRT' | 'INLICHTINGENDIENST' | 'DARKWEB_CRAWLER' | 'EUROPESE_UNIE' | 'COMMERCIEEL_THREAT_INTEL';
  verified: boolean;
  timestamp: string;
  confidence: 'ZEER_HOOG' | 'HOOG' | 'BEVESTIGD' | 'IN_ONDERZOEK';
  evidenceSummary: string;
}

export interface DarkwebChatterItem {
  id: string;
  forumName: string; // e.g. 'Exploit.in', 'XSS.is', 'BreachForums v2', 'Ramp Underground', 'Telegram RedHack Channel'
  authorHandle: string;
  authorReputation: string; // e.g. 'VIP Broker (5 jaar actief)', 'RaaS Affiliate'
  originFlag: string;
  originCountry: string;
  timestamp: string;
  topicTitle: string;
  excerpt: string;
  targetedSectorOrRegion: string; // e.g. 'Haven Rotterdam VPN', 'Europese energiesector', 'Fortinet Zero-Day'
  priceListed?: string; // e.g. '$15.000 in Monero', 'Privé veiling'
  threatTier: NotificationTier;
  actorAffiliation: string; // e.g. 'LockBit 3.0', 'Volt Typhoon', 'Initieel Toegangsmakelaar (IAB)'
  onionUrlMask: string;
  detectedTactic: string;
  status: 'NIEUWE_DISCUSSIE' | 'VERKOCHT' | 'GEVERIFIEERD_GEVAAR' | 'ONDER_ANALYSE' | 'ACTIEF_VERHANDELD';
}

export interface ThreatItem {
  id: string;
  title: string;
  threatActor: string;
  threatActorType: 'STAATSGESPONSORD_APT' | 'RANSOMWARE_CARTEL' | 'HACKTIVIST_SYNDICAAT' | 'HACKTIVIST_COLLECTIEF';
  origin: ThreatOrigin;
  originCountry: string;
  originFlag: string;
  targetVictim: string;
  targetSector: VitalSectorNL | 'EUROPA_BREED' | 'INTERNATIONAAL';
  targetLocation: string; // e.g. 'Rotterdam, Nederland'
  isDutchVitalInfra: boolean;
  severity: ThreatSeverity;
  notificationTier: NotificationTier;
  timestamp: string; // e.g. '13 oktober 2026, 18:42:15 CET'
  attackDate?: string; // e.g. '13 oktober 2026'
  attackTime?: string; // e.g. '18:42:15 CET'
  realtimeStatus?: 'AANVAL_NU_ACTIEF' | 'DATA_EXFILTRATIE_LIVE' | 'C2_VERBINDING_LIVE' | 'ENCRYPTIE_IN_UITVOERING' | 'MITIGATIE_GESTART' | 'ONDERZOEK_LOPENDE';
  liveTelemetryMetrics?: {
    packetsPerSec?: string;
    bandwidthExfiltrated?: string;
    activeC2Connections?: number;
  };
  darkwebOnionSite?: string;
  ransomDemanded?: string;
  deadlineTimestamp?: string;
  dataVolume?: string; // e.g. '450 GB SCADA/Klantdata'
  attackVector: string; // e.g. 'Citrix Bleed CVE-2023-4966'
  mitreTechniques: string[]; // e.g. ['T1190', 'T1059.001']
  description: string;
  leakStatus: 'ACTIEF_LEK' | 'ONDERHANDELING' | 'AFTELLEN_PUBLICATIE' | 'GEPUBLICEERD' | 'IN_BEHANDELING_NCSC';
  proofSampleUrl?: string;
  verifiedByCsirt: boolean;
  verificationSources: VerificationSource[];
  verificationConfidenceScore: number; // 0 - 100%
  iocs?: {
    sha256?: string[];
    ips?: string[];
    cves?: string[];
  };
}

export interface DarkwebLeakSite {
  id: string;
  name: string;
  onionAddress: string;
  status: 'ONLINE' | 'INTERMITTEREND' | 'INBESLAGGENOMEN_JUSTITIE';
  lastScraped: string;
  activeVictimsCount: number;
  originCountry: string;
  primaryTarget: string;
  cryptoWalletType: string; // 'Bitcoin' | 'Monero'
  affiliateModel: 'Ransomware-as-a-Service (RaaS)' | 'Gesloten Kartel' | 'Staatsgelieerd';
}

export interface ThreatActorProfile {
  id: string;
  name: string;
  aliases: string[];
  origin: ThreatOrigin;
  originCountry: string;
  sponsorship: string;
  activeSince: string;
  threatLevel: ThreatSeverity;
  primaryMotivation: 'Geopolitieke Sabotage & Spionage' | 'Financieel Gewin (Afpersing)' | 'Ontwrichting Infrastructuur';
  primaryTargets: string[];
  focusOnNetherlands: string;
  signatureMalware: string[];
  knownTTPs: string[];
  cvesExploited: string[];
  description: string;
}

export interface VitalSectorDetail {
  id: VitalSectorNL;
  name: string;
  description: string;
  iconName: string;
  threatLevel: ThreatSeverity;
  activeAttacksCount: number;
  keyEntities: string[];
  primaryVectors: string[];
  nis2Status: 'VERPLICHT_ESSENTIEEL' | 'VERPLICHT_BELANGRIJK';
  recommendedAction: string;
}

export interface NotificationSettings {
  pushEnabled: boolean;
  soundEnabled: boolean;
  // Tiered configuration
  enableTier1: boolean; // Directe acute dreiging Nederlandse Vitale Infrastructuur
  enableTier2: boolean; // Significante grootschalige ransomware in Europa
  enableTier3: boolean; // Dark web discussies & geopolitieke cyber-chatter (Rusland/China)
  tier1Sound: boolean;
  tier2Sound: boolean;
  tier3Sound: boolean;
  // Filters
  notifyOnRussia: boolean;
  notifyOnChina: boolean;
  notifyOnNorthKorea: boolean;
  notifyOnIran: boolean;
  notifyOnDarkweb: boolean;
  vitalInfraOnly: boolean;
  minSeverity: ThreatSeverity;
  requireMultiSourceVerification: boolean; // Alleen melding als meerdere onafhankelijke bronnen bevestigen
  liveSimulationActive: boolean;
}

export interface IoCEntry {
  id: string;
  type: 'SHA256' | 'IP_ADRES' | 'CVE' | 'DOMEIN' | 'EXTENSIE';
  value: string;
  associatedThreat: string;
  actor: string;
  origin: ThreatOrigin;
  dateAdded: string;
  severity: ThreatSeverity;
  context: string;
}

export type CrimeDomainId = 'DRUGSHANDEL' | 'DARKNETMARKTEN' | 'FRAUDE' | 'CYBERCRIME';

export interface CrimeDomainInfo {
  id: CrimeDomainId;
  name: string;
  subtitle: string;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  icon: string;
  estimatedVolumeNL: string;
  keyActors: string[];
  primaryTactics: string[];
  description: string;
}

export interface CrimeNexusLink {
  id: string;
  sourceDomain: CrimeDomainId;
  targetDomain: CrimeDomainId;
  title: string;
  shortSummary: string;
  mechanisms: string[];
  realWorldExample: string;
  dutchImpact: string;
  severity: ThreatSeverity;
  tags: string[];
  technicalVectors: string[];
  policeOperationRef?: string;
}

export interface CrimeCaseStudy {
  id: string;
  title: string;
  subtitle: string;
  dateOrYear: string;
  involvedAgencies: string[]; // e.g. ['Politie THTC', 'FIOD', 'Europol', 'FBI']
  domainsCovered: CrimeDomainId[];
  summary: string;
  keyFinding: string;
  tacticalLessons: string[];
  status: 'AFGEROND_VONNIS' | 'ACTIEF_MONITORING' | 'INTERNATIONALE_OPERATIE';
}

export interface CrimeChainStep {
  stepNumber: number;
  domain: CrimeDomainId;
  title: string;
  description: string;
  technicalDetails: string;
  evidenceArtifact: string;
}

export interface CrimeChainSimulation {
  id: string;
  title: string;
  threatScenario: string;
  estimatedFinancialDamage: string;
  steps: CrimeChainStep[];
}

