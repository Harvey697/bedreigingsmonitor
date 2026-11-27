import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import worldAtlas from 'world-atlas/countries-110m.json';
import {
  ShieldAlert,
  Radio,
  Crosshair,
  MapPin,
  Activity,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Filter,
  Eye,
  AlertTriangle,
  Play,
  Pause,
  Zap,
  Globe2,
  Terminal,
  ShieldCheck,
  Building,
  Anchor,
  Flame,
} from 'lucide-react';

// Geographic types
export interface CyberHub {
  id: string;
  name: string;
  city: string;
  country: 'RUSLAND' | 'CHINA' | 'NOORD_KOREA' | 'IRAN';
  coordinates: [number, number]; // [longitude, latitude]
  aptUnit: string;
  militaryAffiliation: string;
  primaryTechnique: string;
  threatSeverity: 'KRITIEK' | 'HOOG';
  activeAttacks: number;
  blockedRate: string;
  c2NodesCount: number;
}

export interface DutchTarget {
  id: string;
  name: string;
  sector: string;
  city: string;
  coordinates: [number, number]; // [longitude, latitude]
  iconType: 'anchor' | 'supermarket' | 'power' | 'network' | 'airport' | 'defense' | 'semiconductor' | 'chemical';
  status: 'ONDER_AANVAL' | 'AANVAL_AFGEWEERD' | 'MONITORING';
  blockedAttempts: number;
  activeAttackers: string[];
  activeCve: string;
  criticality: 'VITALE_SECTOR_A' | 'VITALE_SECTOR_B';
  livePacketsPerSec: string;
}

export interface AttackTrajectory {
  id: string;
  hubId: string;
  targetId: string;
  threatActor: string;
  country: 'RUSLAND' | 'CHINA' | 'NOORD_KOREA' | 'IRAN';
  vector: string;
  bandwidth: string;
  intensity: number; // 1 - 5
  status: 'ACTIEF_INTERCEPT' | 'AFGEWEERD' | 'BLOCKED_FIREWALL';
  cveCode: string;
}

// Threat origin hubs
export const RUSSIAN_HUBS: CyberHub[] = [
  {
    id: 'hub-moscow',
    name: 'Moskou GRU Hoofdkwartier',
    city: 'Moskou',
    country: 'RUSLAND',
    coordinates: [37.6173, 55.7558],
    aptUnit: 'Sandworm (Eenheid 74455) & APT28 (Fancy Bear)',
    militaryAffiliation: 'Russische Militaire Inlichtingendienst (GRU)',
    primaryTechnique: 'Industroyer2 SCADA Wipe & NTLM Pass-the-Hash',
    threatSeverity: 'KRITIEK',
    activeAttacks: 28,
    blockedRate: '99.4%',
    c2NodesCount: 142,
  },
  {
    id: 'hub-spb',
    name: 'Sint-Petersburg Cyber Cluster',
    city: 'Sint-Petersburg',
    country: 'RUSLAND',
    coordinates: [30.3351, 59.9343],
    aptUnit: 'LockBit 3.0 Syndicate & Akira Ransomware Hub',
    militaryAffiliation: 'FSB Cyber Taskforce & RaaS Syndicaten',
    primaryTechnique: 'Citrix NetScaler RCE & WMS Warehousing Hijack',
    threatSeverity: 'KRITIEK',
    activeAttacks: 34,
    blockedRate: '98.8%',
    c2NodesCount: 210,
  },
  {
    id: 'hub-siberia',
    name: 'Novosibirsk Bulletproof Hosting',
    city: 'Novosibirsk',
    country: 'RUSLAND',
    coordinates: [82.9357, 55.0084],
    aptUnit: 'Black Basta C2 Infrastructure',
    militaryAffiliation: 'Rostov-Novosibirsk Deep Underground Net',
    primaryTechnique: 'Ivanti Connect Secure Zero-Day Exploit',
    threatSeverity: 'HOOG',
    activeAttacks: 19,
    blockedRate: '99.1%',
    c2NodesCount: 88,
  },
  {
    id: 'hub-yekaterinburg',
    name: 'Jekaterinenburg Ural C2 Relais',
    city: 'Jekaterinenburg',
    country: 'RUSLAND',
    coordinates: [60.6122, 56.8389],
    aptUnit: 'FIN7 / Carbanak & Conti Legacy Cells',
    militaryAffiliation: 'Russische Cybercrime Federatie',
    primaryTechnique: 'Cobalt Strike C2 Beaconing & Modbus TCP Scans',
    threatSeverity: 'HOOG',
    activeAttacks: 16,
    blockedRate: '99.6%',
    c2NodesCount: 64,
  },
];

export const CHINESE_HUBS: CyberHub[] = [
  {
    id: 'hub-beijing',
    name: 'Beijing MSS 3e Bureau',
    city: 'Beijing',
    country: 'CHINA',
    coordinates: [116.4074, 39.9042],
    aptUnit: 'Salt Typhoon (FamousSparrow / RedApollo)',
    militaryAffiliation: 'Ministerie van Staatsveiligheid (MSS)',
    primaryTechnique: 'Cisco IOS XE Web UI Backdoors & BGP Hijacks',
    threatSeverity: 'KRITIEK',
    activeAttacks: 31,
    blockedRate: '98.9%',
    c2NodesCount: 185,
  },
  {
    id: 'hub-chengdu',
    name: 'Chengdu 404 Technology Front',
    city: 'Chengdu',
    country: 'CHINA',
    coordinates: [104.0668, 30.5728],
    aptUnit: 'APT41 (Barium / Double Dragon) & Volt Typhoon',
    militaryAffiliation: 'MSS Sichuan Cyber Reconnaissance',
    primaryTechnique: 'Living-off-the-Land (LotL) & Supply Chain Injection',
    threatSeverity: 'KRITIEK',
    activeAttacks: 42,
    blockedRate: '99.2%',
    c2NodesCount: 240,
  },
  {
    id: 'hub-shanghai',
    name: 'Shanghai PLA Eenheid 61398 Basis',
    city: 'Shanghai',
    country: 'CHINA',
    coordinates: [121.4737, 31.2304],
    aptUnit: 'Volt Typhoon & APT1 Critical Infrastructure Wing',
    militaryAffiliation: 'Volksbevrijdingsleger (PLA Strategische Ondersteuning)',
    primaryTechnique: 'Fortinet FortiOS Auth Bypass & Haven SCADA Probing',
    threatSeverity: 'KRITIEK',
    activeAttacks: 29,
    blockedRate: '99.5%',
    c2NodesCount: 160,
  },
  {
    id: 'hub-wuhan',
    name: 'Wuhan Cyber Intel Cluster',
    city: 'Wuhan',
    country: 'CHINA',
    coordinates: [114.3055, 30.5928],
    aptUnit: 'APT31 (Zirconium / Judgement Panda)',
    militaryAffiliation: 'Hubei State Security Department',
    primaryTechnique: 'DNS Covert Tunnels & Routers Exploit Mesh',
    threatSeverity: 'HOOG',
    activeAttacks: 18,
    blockedRate: '99.3%',
    c2NodesCount: 95,
  },
];

export const NORTH_KOREAN_HUBS: CyberHub[] = [
  {
    id: 'hub-pyongyang',
    name: 'Pyongyang RGB Eenheid 121 Commando',
    city: 'Pyongyang',
    country: 'NOORD_KOREA',
    coordinates: [125.7543, 39.0392],
    aptUnit: 'Lazarus Group (Bureau 121) & Kimsuky (APT43)',
    militaryAffiliation: 'Reconnaissance General Bureau (RGB)',
    primaryTechnique: 'NPM Supply-Chain Poisoning & BLINDINGCAN Trojan',
    threatSeverity: 'KRITIEK',
    activeAttacks: 26,
    blockedRate: '99.1%',
    c2NodesCount: 115,
  },
];

export const IRANIAN_HUBS: CyberHub[] = [
  {
    id: 'hub-tehran',
    name: 'Teheran IRGC Cyber Command',
    city: 'Teheran',
    country: 'IRAN',
    coordinates: [51.3890, 35.6892],
    aptUnit: 'Charming Kitten (APT35) & MuddyWater (MOIS)',
    militaryAffiliation: 'Islamitische Revolutionaire Garde (IRGC) & MOIS',
    primaryTechnique: 'BellaCiao Web Shells & DNS Tunneling C2',
    threatSeverity: 'KRITIEK',
    activeAttacks: 22,
    blockedRate: '99.3%',
    c2NodesCount: 98,
  },
];

// Dutch targets
export const DUTCH_TARGETS: DutchTarget[] = [
  {
    id: 'target-rotterdam',
    name: 'Haven van Rotterdam (ECT Maasvlakte II)',
    sector: 'Maritieme Logistiek & SCADA',
    city: 'Rotterdam',
    coordinates: [4.4777, 51.9244],
    iconType: 'anchor',
    status: 'ONDER_AANVAL',
    blockedAttempts: 15480,
    activeAttackers: ['Volt Typhoon (Shanghai)', 'LockBit 3.0 (Sint-Petersburg)'],
    activeCve: 'CVE-2024-21762 (FortiOS)',
    criticality: 'VITALE_SECTOR_A',
    livePacketsPerSec: '28.400 pkts/s',
  },
  {
    id: 'target-albertheijn',
    name: 'Albert Heijn Distributiecentra (Zaandam, Tilburg, Zwolle)',
    sector: 'Voedselvoorziening & WMS Magazijnautomatisering',
    city: 'Zaandam / Tilburg',
    coordinates: [4.8286, 52.4420],
    iconType: 'supermarket',
    status: 'ONDER_AANVAL',
    blockedAttempts: 38920,
    activeAttackers: ['Akira Syndicate (Sint-Petersburg)', 'Sandworm (Moskou)'],
    activeCve: 'CVE-2023-4966 (Citrix NetScaler WMS)',
    criticality: 'VITALE_SECTOR_A',
    livePacketsPerSec: '34.200 pkts/s',
  },
  {
    id: 'target-tennet',
    name: 'TenneT TSO Hoogspanningsnetwerk 380kV',
    sector: 'Energie & Landelijk Elektriciteitsnet',
    city: 'Arnhem',
    coordinates: [5.8987, 51.9851],
    iconType: 'power',
    status: 'ONDER_AANVAL',
    blockedAttempts: 22400,
    activeAttackers: ['Sandworm (Moskou)', 'Volt Typhoon (Chengdu)'],
    activeCve: 'IEC 60870-5-104 Telemetrie Spoof',
    criticality: 'VITALE_SECTOR_A',
    livePacketsPerSec: '19.800 pkts/s',
  },
  {
    id: 'target-amsix',
    name: 'Amsterdam Internet Exchange (AMS-IX Science Park)',
    sector: 'Telecom, Glasvezel & BGP Core',
    city: 'Amsterdam',
    coordinates: [4.9041, 52.3676],
    iconType: 'network',
    status: 'ONDER_AANVAL',
    blockedAttempts: 33800,
    activeAttackers: ['Salt Typhoon (Beijing)', 'APT28 Fancy Bear (Moskou)'],
    activeCve: 'CVE-2023-20198 (Cisco IOS XE)',
    criticality: 'VITALE_SECTOR_A',
    livePacketsPerSec: '42.100 pkts/s',
  },
  {
    id: 'target-schiphol',
    name: 'Luchthaven Schiphol IT & Bagageafhandeling',
    sector: 'Luchtvaart & Kritieke Transport IT',
    city: 'Haarlemmermeer',
    coordinates: [4.7683, 52.3105],
    iconType: 'airport',
    status: 'ONDER_AANVAL',
    blockedAttempts: 11200,
    activeAttackers: ['Black Basta (Novosibirsk)', 'APT41 (Chengdu)'],
    activeCve: 'CVE-2024-21887 (Ivanti Connect)',
    criticality: 'VITALE_SECTOR_B',
    livePacketsPerSec: '14.500 pkts/s',
  },
  {
    id: 'target-asml',
    name: 'ASML Veldhoven & Brainport High-Tech Campus',
    sector: 'Semiconductor EUV & Nationale Kennisbeveiliging',
    city: 'Veldhoven',
    coordinates: [5.4050, 51.4184],
    iconType: 'semiconductor',
    status: 'ONDER_AANVAL',
    blockedAttempts: 43500,
    activeAttackers: ['APT41 (Chengdu)', 'Salt Typhoon (Beijing)'],
    activeCve: 'DNS Covert Tunnel C2 Exploit',
    criticality: 'VITALE_SECTOR_A',
    livePacketsPerSec: '51.300 pkts/s',
  },
  {
    id: 'target-chemelot',
    name: 'Chemelot Industriepark Geleen & Shell Pernis',
    sector: 'Chemie & Petrochemie Procesautomatisering',
    city: 'Geleen / Pernis',
    coordinates: [5.8286, 50.9680],
    iconType: 'chemical',
    status: 'AANVAL_AFGEWEERD',
    blockedAttempts: 25100,
    activeAttackers: ['Sandworm (Moskou)', 'LockBit 3.0 (Sint-Petersburg)'],
    activeCve: 'Modbus TCP Scanner / PLC Infiltratie',
    criticality: 'VITALE_SECTOR_A',
    livePacketsPerSec: '12.800 pkts/s',
  },
  {
    id: 'target-defensie',
    name: 'Ministerie van Defensie / MIVD & Justitie',
    sector: 'Rijksoverheid, Inlichtingen & C4I',
    city: 'Den Haag',
    coordinates: [4.3007, 52.0705],
    iconType: 'defense',
    status: 'MONITORING',
    blockedAttempts: 19800,
    activeAttackers: ['APT28 Fancy Bear (Moskou)', 'APT31 (Wuhan)'],
    activeCve: 'CVE-2023-23397 (Outlook NTLM)',
    criticality: 'VITALE_SECTOR_A',
    livePacketsPerSec: '16.200 pkts/s',
  },
];

// Active attack trajectories
export const INITIAL_TRAJECTORIES: AttackTrajectory[] = [
  // From Russia
  {
    id: 'traj-spb-ah',
    hubId: 'hub-spb',
    targetId: 'target-albertheijn',
    threatActor: 'LockBit 3.0 & Akira Syndicate (Sint-Petersburg)',
    country: 'RUSLAND',
    vector: 'Citrix NetScaler ADC WMS Warehouse Exploitation',
    bandwidth: '4.8 Gbps burst',
    intensity: 5,
    status: 'ACTIEF_INTERCEPT',
    cveCode: 'CVE-2023-4966',
  },
  {
    id: 'traj-moscow-tennet',
    hubId: 'hub-moscow',
    targetId: 'target-tennet',
    threatActor: 'GRU Sandworm Eenheid 74455 (Moskou)',
    country: 'RUSLAND',
    vector: 'Industroyer2 SCADA EMS Telemetrie Probe',
    bandwidth: '2.1 Gbps',
    intensity: 4,
    status: 'ACTIEF_INTERCEPT',
    cveCode: 'IEC 60870-5-104',
  },
  {
    id: 'traj-moscow-defensie',
    hubId: 'hub-moscow',
    targetId: 'target-defensie',
    threatActor: 'APT28 Fancy Bear (Moskou)',
    country: 'RUSLAND',
    vector: 'Outlook NTLM Hash Exfiltratie & Spear-phishing',
    bandwidth: '850 Mbps',
    intensity: 3,
    status: 'BLOCKED_FIREWALL',
    cveCode: 'CVE-2023-23397',
  },
  {
    id: 'traj-siberia-schiphol',
    hubId: 'hub-siberia',
    targetId: 'target-schiphol',
    threatActor: 'Black Basta Syndicate (Novosibirsk C2)',
    country: 'RUSLAND',
    vector: 'Ivanti Connect Secure Zero-Day Exploit',
    bandwidth: '1.9 Gbps',
    intensity: 4,
    status: 'ACTIEF_INTERCEPT',
    cveCode: 'CVE-2024-21887',
  },
  {
    id: 'traj-spb-rotterdam',
    hubId: 'hub-spb',
    targetId: 'target-rotterdam',
    threatActor: 'Akira RaaS (Sint-Petersburg)',
    country: 'RUSLAND',
    vector: 'Port Terminal Logistics API Exploit',
    bandwidth: '3.4 Gbps',
    intensity: 4,
    status: 'ACTIEF_INTERCEPT',
    cveCode: 'CVE-2024-21762',
  },
  {
    id: 'traj-yekat-chemelot',
    hubId: 'hub-yekaterinburg',
    targetId: 'target-chemelot',
    threatActor: 'FIN7 / Carbanak Cluster (Jekaterinenburg)',
    country: 'RUSLAND',
    vector: 'Modbus TCP Scanner & Chemical DCS Probing',
    bandwidth: '1.2 Gbps',
    intensity: 3,
    status: 'AFGEWEERD',
    cveCode: 'Modbus-484-OT',
  },

  // From China
  {
    id: 'traj-beijing-amsix',
    hubId: 'hub-beijing',
    targetId: 'target-amsix',
    threatActor: 'Salt Typhoon / FamousSparrow (Beijing MSS)',
    country: 'CHINA',
    vector: 'Cisco IOS XE BGP Core Router Implant',
    bandwidth: '6.2 Gbps',
    intensity: 5,
    status: 'ACTIEF_INTERCEPT',
    cveCode: 'CVE-2023-20198',
  },
  {
    id: 'traj-chengdu-asml',
    hubId: 'hub-chengdu',
    targetId: 'target-asml',
    threatActor: 'APT41 Barium & Double Dragon (Chengdu 404)',
    country: 'CHINA',
    vector: 'High-Tech EUV Lithografie CI/CD Infiltration',
    bandwidth: '5.1 Gbps',
    intensity: 5,
    status: 'ACTIEF_INTERCEPT',
    cveCode: 'DNS-Covert-C2',
  },
  {
    id: 'traj-shanghai-rotterdam',
    hubId: 'hub-shanghai',
    targetId: 'target-rotterdam',
    threatActor: 'Volt Typhoon PLA Eenheid 61398 (Shanghai)',
    country: 'CHINA',
    vector: 'Fortinet FortiOS SCADA Bypass & SOHO Proxy Mesh',
    bandwidth: '4.5 Gbps',
    intensity: 5,
    status: 'ACTIEF_INTERCEPT',
    cveCode: 'CVE-2024-21762',
  },
  {
    id: 'traj-wuhan-defensie',
    hubId: 'hub-wuhan',
    targetId: 'target-defensie',
    threatActor: 'APT31 Zirconium (Wuhan Intel)',
    country: 'CHINA',
    vector: 'Edge Device Mesh & Stealth DNS Exfiltration',
    bandwidth: '1.4 Gbps',
    intensity: 3,
    status: 'BLOCKED_FIREWALL',
    cveCode: 'EdgeRouter-Mesh',
  },
  {
    id: 'traj-chengdu-tennet',
    hubId: 'hub-chengdu',
    targetId: 'target-tennet',
    threatActor: 'Volt Typhoon Living-off-the-Land (Chengdu)',
    country: 'CHINA',
    vector: 'WMI & PowerShell Stille Netwerkverkenning',
    bandwidth: '980 Mbps',
    intensity: 4,
    status: 'ACTIEF_INTERCEPT',
    cveCode: 'LotL-WMI-Script',
  },
  {
    id: 'traj-beijing-asml',
    hubId: 'hub-beijing',
    targetId: 'target-asml',
    threatActor: 'RedApollo (Beijing MSS 3e Bureau)',
    country: 'CHINA',
    vector: 'Supply Chain Third-Party Vendor Exploit',
    bandwidth: '3.7 Gbps',
    intensity: 4,
    status: 'ACTIEF_INTERCEPT',
    cveCode: 'SupplyChain-0day',
  },

  // From North Korea
  {
    id: 'traj-pyongyang-asml',
    hubId: 'hub-pyongyang',
    targetId: 'target-asml',
    threatActor: 'Lazarus Group Bureau 121 (Pyongyang)',
    country: 'NOORD_KOREA',
    vector: 'NPM Supply-Chain Poisoning & BLINDINGCAN Trojan',
    bandwidth: '5.4 Gbps',
    intensity: 5,
    status: 'ACTIEF_INTERCEPT',
    cveCode: 'CVE-2023-4863',
  },
  {
    id: 'traj-pyongyang-amsix',
    hubId: 'hub-pyongyang',
    targetId: 'target-amsix',
    threatActor: 'Lazarus Group / Diamond Sleet (Pyongyang)',
    country: 'NOORD_KOREA',
    vector: 'Amsterdam Crypto Exchange Wallet Drainer & MATA C2',
    bandwidth: '3.9 Gbps',
    intensity: 4,
    status: 'ACTIEF_INTERCEPT',
    cveCode: 'CVE-2023-38831',
  },

  // From Iran
  {
    id: 'traj-tehran-rotterdam',
    hubId: 'hub-tehran',
    targetId: 'target-rotterdam',
    threatActor: 'Charming Kitten APT35 (Teheran IRGC)',
    country: 'IRAN',
    vector: 'Haven Pernis Olieopslag SCADA Modbus Exploit',
    bandwidth: '4.1 Gbps',
    intensity: 5,
    status: 'ACTIEF_INTERCEPT',
    cveCode: 'CVE-2024-21410',
  },
  {
    id: 'traj-tehran-defensie',
    hubId: 'hub-tehran',
    targetId: 'target-defensie',
    threatActor: 'MuddyWater MOIS (Teheran Cyber Intel)',
    country: 'IRAN',
    vector: 'DNS Tunneling C2 & Exchange Shell Deployment',
    bandwidth: '1.8 Gbps',
    intensity: 3,
    status: 'BLOCKED_FIREWALL',
    cveCode: 'CVE-2023-22515',
  },
];

export type HeatmapTimeRange = '1H' | '6H' | '24H' | '7D';

export interface CountryAttackFrequency {
  country: 'RUSLAND' | 'CHINA' | 'NOORD_KOREA' | 'IRAN';
  label: string;
  flag: string;
  isoIds: string[];
  nameMatchers: string[];
  attacksPerMin: number;
  baseAttacksPerMin: number;
  totalBlocked: number;
  frequencyScore: number; // 0 - 100 normalized for D3 color scale
  bandwidthGbps: number;
  activeAptCount: number;
  centroid: [number, number];
  dominantHubIds: string[];
  patternNote: string;
}

export interface TimeRangePatternConfig {
  id: HeatmapTimeRange;
  shortLabel: string;
  fullLabel: string;
  summary: string;
  contourBandwidth: number;
  contourThresholds: number;
  spreadFactor: number;
  countries: Record<'RUSLAND' | 'CHINA' | 'NOORD_KOREA' | 'IRAN', CountryAttackFrequency>;
}

export const TIME_RANGE_PATTERNS: Record<HeatmapTimeRange, TimeRangePatternConfig> = {
  '1H': {
    id: '1H',
    shortLabel: '1u',
    fullLabel: 'Laatste 1 uur',
    summary: 'Actuele tactische piek vanuit West-Rusland (Moskou/Sint-Petersburg LockBit & GRU) gericht op logistiek en energie.',
    contourBandwidth: 20,
    contourThresholds: 10,
    spreadFactor: 1.0,
    countries: {
      RUSLAND: {
        country: 'RUSLAND',
        label: 'Rusland (GRU / FSB)',
        flag: '🇷🇺',
        isoIds: ['643', '112'],
        nameMatchers: ['russia', 'belarus'],
        attacksPerMin: 284,
        baseAttacksPerMin: 284,
        totalBlocked: 17040,
        frequencyScore: 94,
        bandwidthGbps: 14.2,
        activeAptCount: 6,
        centroid: [90, 60],
        dominantHubIds: ['hub-moscow', 'hub-spb'],
        patternNote: '1u Piek: WMS & 380kV Probes',
      },
      CHINA: {
        country: 'CHINA',
        label: 'China (MSS / PLA)',
        flag: '🇨🇳',
        isoIds: ['156'],
        nameMatchers: ['china'],
        attacksPerMin: 238,
        baseAttacksPerMin: 238,
        totalBlocked: 14280,
        frequencyScore: 84,
        bandwidthGbps: 19.5,
        activeAptCount: 5,
        centroid: [105, 35],
        dominantHubIds: ['hub-beijing', 'hub-chengdu'],
        patternNote: '1u Actief: AMS-IX BGP & ASML',
      },
      NOORD_KOREA: {
        country: 'NOORD_KOREA',
        label: 'Noord-Korea (RGB 121)',
        flag: '🇰🇵',
        isoIds: ['408'],
        nameMatchers: ['dem. rep. korea', 'north korea'],
        attacksPerMin: 112,
        baseAttacksPerMin: 112,
        totalBlocked: 6720,
        frequencyScore: 64,
        bandwidthGbps: 9.3,
        activeAptCount: 2,
        centroid: [127, 40],
        dominantHubIds: ['hub-pyongyang'],
        patternNote: '1u Burst: Zuidas Crypto Gateways',
      },
      IRAN: {
        country: 'IRAN',
        label: 'Iran (IRGC / MOIS)',
        flag: '🇮🇷',
        isoIds: ['364'],
        nameMatchers: ['iran'],
        attacksPerMin: 89,
        baseAttacksPerMin: 89,
        totalBlocked: 5340,
        frequencyScore: 52,
        bandwidthGbps: 5.9,
        activeAptCount: 2,
        centroid: [53, 32],
        dominantHubIds: ['hub-tehran'],
        patternNote: '1u Probes: Pernis SCADA',
      },
    },
  },
  '6H': {
    id: '6H',
    shortLabel: '6u',
    fullLabel: 'Laatste 6 uur',
    summary: 'Oost-Aziatische operationele golf: China (Chengdu APT41 & Shanghai PLA 61398) domineert het 6-uurs venster.',
    contourBandwidth: 24,
    contourThresholds: 11,
    spreadFactor: 1.28,
    countries: {
      RUSLAND: {
        country: 'RUSLAND',
        label: 'Rusland (GRU / FSB)',
        flag: '🇷🇺',
        isoIds: ['643', '112'],
        nameMatchers: ['russia', 'belarus'],
        attacksPerMin: 246,
        baseAttacksPerMin: 246,
        totalBlocked: 88560,
        frequencyScore: 85,
        bandwidthGbps: 12.8,
        activeAptCount: 6,
        centroid: [90, 60],
        dominantHubIds: ['hub-spb', 'hub-siberia'],
        patternNote: '6u Golf: Siberische C2 Rotatie',
      },
      CHINA: {
        country: 'CHINA',
        label: 'China (MSS / PLA)',
        flag: '🇨🇳',
        isoIds: ['156'],
        nameMatchers: ['china'],
        attacksPerMin: 318,
        baseAttacksPerMin: 318,
        totalBlocked: 114480,
        frequencyScore: 97,
        bandwidthGbps: 24.6,
        activeAptCount: 5,
        centroid: [105, 35],
        dominantHubIds: ['hub-chengdu', 'hub-shanghai', 'hub-beijing'],
        patternNote: '6u Piek: EUV & Haven SCADA',
      },
      NOORD_KOREA: {
        country: 'NOORD_KOREA',
        label: 'Noord-Korea (RGB 121)',
        flag: '🇰🇵',
        isoIds: ['408'],
        nameMatchers: ['dem. rep. korea', 'north korea'],
        attacksPerMin: 134,
        baseAttacksPerMin: 134,
        totalBlocked: 48240,
        frequencyScore: 71,
        bandwidthGbps: 11.1,
        activeAptCount: 2,
        centroid: [127, 40],
        dominantHubIds: ['hub-pyongyang'],
        patternNote: '6u: NPM Supply-Chain Golf',
      },
      IRAN: {
        country: 'IRAN',
        label: 'Iran (IRGC / MOIS)',
        flag: '🇮🇷',
        isoIds: ['364'],
        nameMatchers: ['iran'],
        attacksPerMin: 126,
        baseAttacksPerMin: 126,
        totalBlocked: 45360,
        frequencyScore: 68,
        bandwidthGbps: 8.4,
        activeAptCount: 2,
        centroid: [53, 32],
        dominantHubIds: ['hub-tehran'],
        patternNote: '6u: Verhoogde Petrochemie Scans',
      },
    },
  },
  '24H': {
    id: '24H',
    shortLabel: '24u',
    fullLabel: 'Laatste 24 uur',
    summary: 'Volledige etmaalcyclus: Gecombineerde Russisch-Chinese druk met nachtelijke pieken vanuit Pyongyang en Teheran.',
    contourBandwidth: 28,
    contourThresholds: 12,
    spreadFactor: 1.55,
    countries: {
      RUSLAND: {
        country: 'RUSLAND',
        label: 'Rusland (GRU / FSB)',
        flag: '🇷🇺',
        isoIds: ['643', '112', '398'],
        nameMatchers: ['russia', 'belarus', 'kazakhstan'],
        attacksPerMin: 296,
        baseAttacksPerMin: 296,
        totalBlocked: 426240,
        frequencyScore: 95,
        bandwidthGbps: 16.4,
        activeAptCount: 6,
        centroid: [90, 60],
        dominantHubIds: ['hub-moscow', 'hub-spb', 'hub-siberia', 'hub-yekaterinburg'],
        patternNote: '24u: 4 Actieve Russische Clusters',
      },
      CHINA: {
        country: 'CHINA',
        label: 'China (MSS / PLA)',
        flag: '🇨🇳',
        isoIds: ['156'],
        nameMatchers: ['china'],
        attacksPerMin: 282,
        baseAttacksPerMin: 282,
        totalBlocked: 406080,
        frequencyScore: 92,
        bandwidthGbps: 22.1,
        activeAptCount: 5,
        centroid: [105, 35],
        dominantHubIds: ['hub-beijing', 'hub-chengdu', 'hub-shanghai', 'hub-wuhan'],
        patternNote: '24u: LotL & Router Mesh',
      },
      NOORD_KOREA: {
        country: 'NOORD_KOREA',
        label: 'Noord-Korea (RGB 121)',
        flag: '🇰🇵',
        isoIds: ['408'],
        nameMatchers: ['dem. rep. korea', 'north korea'],
        attacksPerMin: 148,
        baseAttacksPerMin: 148,
        totalBlocked: 213120,
        frequencyScore: 75,
        bandwidthGbps: 10.8,
        activeAptCount: 2,
        centroid: [127, 40],
        dominantHubIds: ['hub-pyongyang'],
        patternNote: '24u: Financiële Exfiltratie',
      },
      IRAN: {
        country: 'IRAN',
        label: 'Iran (IRGC / MOIS)',
        flag: '🇮🇷',
        isoIds: ['364'],
        nameMatchers: ['iran'],
        attacksPerMin: 119,
        baseAttacksPerMin: 119,
        totalBlocked: 171360,
        frequencyScore: 66,
        bandwidthGbps: 7.6,
        activeAptCount: 2,
        centroid: [53, 32],
        dominantHubIds: ['hub-tehran'],
        patternNote: '24u: Exchange & Modbus C2',
      },
    },
  },
  '7D': {
    id: '7D',
    shortLabel: '7d',
    fullLabel: 'Laatste 7 dagen',
    summary: 'Strategisch 7-daags patroon: Grootschalige aanhoudende APT-campagnes met Oost-Europese en Aziatische C2-relaiscorridors.',
    contourBandwidth: 32,
    contourThresholds: 14,
    spreadFactor: 1.85,
    countries: {
      RUSLAND: {
        country: 'RUSLAND',
        label: 'Rusland (GRU / FSB)',
        flag: '🇷🇺',
        isoIds: ['643', '112', '398'],
        nameMatchers: ['russia', 'belarus', 'kazakhstan'],
        attacksPerMin: 324,
        baseAttacksPerMin: 324,
        totalBlocked: 3265920,
        frequencyScore: 98,
        bandwidthGbps: 18.9,
        activeAptCount: 6,
        centroid: [90, 60],
        dominantHubIds: ['hub-moscow', 'hub-spb', 'hub-siberia', 'hub-yekaterinburg'],
        patternNote: '7d: 3,26M Geblokkeerde Aanvallen',
      },
      CHINA: {
        country: 'CHINA',
        label: 'China (MSS / PLA)',
        flag: '🇨🇳',
        isoIds: ['156', '704'],
        nameMatchers: ['china', 'vietnam'],
        attacksPerMin: 304,
        baseAttacksPerMin: 304,
        totalBlocked: 3064320,
        frequencyScore: 95,
        bandwidthGbps: 25.4,
        activeAptCount: 5,
        centroid: [105, 35],
        dominantHubIds: ['hub-beijing', 'hub-chengdu', 'hub-shanghai', 'hub-wuhan'],
        patternNote: '7d: 3,06M Strategische Probes',
      },
      NOORD_KOREA: {
        country: 'NOORD_KOREA',
        label: 'Noord-Korea (RGB 121)',
        flag: '🇰🇵',
        isoIds: ['408'],
        nameMatchers: ['dem. rep. korea', 'north korea'],
        attacksPerMin: 172,
        baseAttacksPerMin: 172,
        totalBlocked: 1733760,
        frequencyScore: 82,
        bandwidthGbps: 12.7,
        activeAptCount: 2,
        centroid: [127, 40],
        dominantHubIds: ['hub-pyongyang'],
        patternNote: '7d: 1,73M RGB 121 Aanvallen',
      },
      IRAN: {
        country: 'IRAN',
        label: 'Iran (IRGC / MOIS)',
        flag: '🇮🇷',
        isoIds: ['364', '760'],
        nameMatchers: ['iran', 'syria'],
        attacksPerMin: 146,
        baseAttacksPerMin: 146,
        totalBlocked: 1471680,
        frequencyScore: 76,
        bandwidthGbps: 9.8,
        activeAptCount: 2,
        centroid: [53, 32],
        dominantHubIds: ['hub-tehran'],
        patternNote: '7d: 1,47M IRGC / MOIS Pogingen',
      },
    },
  },
};

export const INITIAL_COUNTRY_FREQUENCIES = TIME_RANGE_PATTERNS['1H'].countries;

interface D3ThreatWorldMapProps {
  onSelectHub?: (hub: CyberHub) => void;
  onSelectTarget?: (target: DutchTarget) => void;
  timeRange?: HeatmapTimeRange;
  onTimeRangeChange?: (range: HeatmapTimeRange) => void;
  className?: string;
}

export const D3ThreatWorldMap: React.FC<D3ThreatWorldMapProps> = ({
  onSelectHub,
  onSelectTarget,
  timeRange: externalTimeRange,
  onTimeRangeChange,
  className = '',
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // States
  const [internalTimeRange, setInternalTimeRange] = useState<HeatmapTimeRange>('1H');
  const activeTimeRange = externalTimeRange || internalTimeRange;

  const handleSelectTimeRange = (range: HeatmapTimeRange) => {
    setInternalTimeRange(range);
    if (onTimeRangeChange) onTimeRangeChange(range);
  };

  const [selectedHub, setSelectedHub] = useState<CyberHub | null>(RUSSIAN_HUBS[0]);
  const [selectedTarget, setSelectedTarget] = useState<DutchTarget | null>(DUTCH_TARGETS[1]); // Default to Albert Heijn
  const [filterCountry, setFilterCountry] = useState<'ALL' | 'RUSLAND' | 'CHINA' | 'NOORD_KOREA' | 'IRAN'>('ALL');
  const [isLiveRunning, setIsLiveRunning] = useState<boolean>(true);
  const [showHeatmap, setShowHeatmap] = useState<boolean>(true);
  const [heatmapStyle, setHeatmapStyle] = useState<'COMBINED' | 'CHOROPLETH' | 'DENSITY'>('COMBINED');
  const [showArcs, setShowArcs] = useState<boolean>(true);
  const [showPulses, setShowPulses] = useState<boolean>(true);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [mapPreset, setMapPreset] = useState<'WORLD' | 'NL' | 'RUSSIA' | 'CHINA' | 'EURASIA'>('EURASIA');

  // Dynamic attack frequency by origin country (synced with selected timeRange)
  const [countryFrequencies, setCountryFrequencies] = useState<
    Record<'RUSLAND' | 'CHINA' | 'NOORD_KOREA' | 'IRAN', CountryAttackFrequency>
  >(TIME_RANGE_PATTERNS['1H'].countries);

  // Sync baseline country frequencies whenever activeTimeRange changes
  useEffect(() => {
    setCountryFrequencies(TIME_RANGE_PATTERNS[activeTimeRange].countries);
  }, [activeTimeRange]);

  // Live telemetry ticker metrics
  const [liveMetrics, setLiveMetrics] = useState({
    packetsPerSecond: 168420,
    attacksBlockedLastMinute: 723,
    activeC2Connections: 894,
    russiaTrafficShare: 40,
    chinaTrafficShare: 33,
  });

  // Recent intercepted events stream
  const [eventLogs, setEventLogs] = useState<Array<{
    id: string;
    timestamp: string;
    origin: string;
    flag: string;
    target: string;
    actor: string;
    vector: string;
    status: string;
  }>>([
    {
      id: 'log-1',
      timestamp: 'Zojuist',
      origin: 'Sint-Petersburg',
      flag: '🇷🇺',
      target: 'Albert Heijn Distributiecentrum Zaandam (WMS)',
      actor: 'LockBit 3.0 / Akira',
      vector: 'Citrix NetScaler RCE Exploit',
      status: 'GEBLOKKEERD [SOC-L1]',
    },
    {
      id: 'log-2',
      timestamp: '5s geleden',
      origin: 'Chengdu',
      flag: '🇨🇳',
      target: 'ASML Brainport High-Tech Campus',
      actor: 'APT41 (Barium)',
      vector: 'DNS Covert C2 Tunneling',
      status: 'ONDERSCHEPT [NCSC]',
    },
    {
      id: 'log-3',
      timestamp: '11s geleden',
      origin: 'Moskou',
      flag: '🇷🇺',
      target: 'TenneT 380kV Hoogspanningsnet Arnhem',
      actor: 'GRU Sandworm 74455',
      vector: 'IEC 60870-5-104 Telemetrie Probe',
      status: 'GEÏSOLEERD [EMS]',
    },
    {
      id: 'log-4',
      timestamp: '19s geleden',
      origin: 'Beijing',
      flag: '🇨🇳',
      target: 'AMS-IX Amsterdam Core BGP',
      actor: 'Salt Typhoon (MSS)',
      vector: 'Cisco IOS XE Web UI Backdoor',
      status: 'GEFILTERD [RPKI]',
    },
  ]);

  // Combined hub list
  const allHubs = useMemo(() => [...RUSSIAN_HUBS, ...CHINESE_HUBS, ...NORTH_KOREAN_HUBS, ...IRANIAN_HUBS], []);

  // Filtered trajectories
  const filteredTrajectories = useMemo(() => {
    return INITIAL_TRAJECTORIES.filter((t) => {
      if (filterCountry === 'ALL') return true;
      return t.country === filterCountry;
    });
  }, [filterCountry]);

  // Total live attacks per minute across all origins
  const totalAttacksPerMin = useMemo(() => {
    return (Object.values(countryFrequencies) as CountryAttackFrequency[]).reduce(
      (acc, item) => acc + item.attacksPerMin,
      0
    );
  }, [countryFrequencies]);

  // Total cumulative blocked attacks in selected time window
  const totalBlockedInWindow = useMemo(() => {
    return (Object.values(countryFrequencies) as CountryAttackFrequency[]).reduce(
      (acc, item) => acc + item.totalBlocked,
      0
    );
  }, [countryFrequencies]);

  const currentRangeConfig = TIME_RANGE_PATTERNS[activeTimeRange];

  // Live telemetry pulse & dynamic origin country frequency updates
  useEffect(() => {
    if (!isLiveRunning) return;

    const interval = setInterval(() => {
      // Dynamically update attack frequencies per origin country
      setCountryFrequencies((prev) => {
        const next = { ...prev };
        (Object.keys(next) as Array<'RUSLAND' | 'CHINA' | 'NOORD_KOREA' | 'IRAN'>).forEach((key) => {
          const item = next[key];
          // Realistic surge & wave oscillation per country
          const delta = Math.floor((Math.random() - 0.45) * 14);
          const minRate = Math.floor(item.baseAttacksPerMin * 0.84);
          const maxRate = Math.floor(item.baseAttacksPerMin * 1.24);
          const updatedRate = Math.max(minRate, Math.min(maxRate, item.attacksPerMin + delta));
          // Normalize score between 30 and 100 for the D3 thermal scale
          const normalizedScore = Math.min(100, Math.max(25, Math.round((updatedRate / 340) * 100)));
          const bwDelta = Number(((Math.random() - 0.48) * 0.7).toFixed(1));
          next[key] = {
            ...item,
            attacksPerMin: updatedRate,
            totalBlocked: item.totalBlocked + Math.floor(updatedRate / 10),
            frequencyScore: normalizedScore,
            bandwidthGbps: Math.max(2.1, Number((item.bandwidthGbps + bwDelta).toFixed(1))),
          };
        });
        return next;
      });

      // Jitter metrics
      setLiveMetrics((prev) => ({
        packetsPerSecond: Math.floor(160000 + Math.random() * 25000),
        attacksBlockedLastMinute: prev.attacksBlockedLastMinute + Math.floor(Math.random() * 4),
        activeC2Connections: Math.floor(880 + Math.random() * 30),
        russiaTrafficShare: 39 + Math.floor(Math.random() * 5),
        chinaTrafficShare: 32 + Math.floor(Math.random() * 4),
      }));

      // Add a fresh intercepted event to logs
      const randomTraj = INITIAL_TRAJECTORIES[Math.floor(Math.random() * INITIAL_TRAJECTORIES.length)];
      const hub = allHubs.find((h) => h.id === randomTraj.hubId);
      const target = DUTCH_TARGETS.find((t) => t.id === randomTraj.targetId);

      if (hub && target) {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const newLog = {
          id: `log-${Date.now()}`,
          timestamp: timeStr,
          origin: hub.city,
          flag: hub.country === 'RUSLAND' ? '🇷🇺' : hub.country === 'CHINA' ? '🇨🇳' : hub.country === 'NOORD_KOREA' ? '🇰🇵' : '🇮🇷',
          target: target.name,
          actor: randomTraj.threatActor.split('(')[0].trim(),
          vector: randomTraj.vector,
          status: 'ONDERSCHEPT [LIVE]',
        };

        setEventLogs((prev) => [newLog, ...prev.slice(0, 5)]);
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [isLiveRunning, allHubs]);

  // D3 Rendering & Zoom Management
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = 960;
    const height = 500;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clean redraw

    // D3 Sequential Thermal Color Scale for Attack Frequency (0 - 100)
    const heatColorScale = d3.scaleSequential(d3.interpolateYlOrRd).domain([10, 105]);
    const densityColorScale = d3.scaleSequential(d3.interpolateInferno).domain([0, 0.035]);

    // Defs for filters and glow gradients
    const defs = svg.append('defs');

    // Heatmap Gaussian Blur Filter for smooth thermal plumes
    const filterHeat = defs
      .append('filter')
      .attr('id', 'heatmap-blur')
      .attr('x', '-30%')
      .attr('y', '-30%')
      .attr('width', '160%')
      .attr('height', '160%');
    filterHeat.append('feGaussianBlur').attr('stdDeviation', '8').attr('result', 'blurOut');

    // Russia Glow Filter
    const filterRed = defs.append('filter').attr('id', 'glow-red').attr('x', '-50%').attr('y', '-50%').attr('width', '200%').attr('height', '200%');
    filterRed.append('feGaussianBlur').attr('stdDeviation', '3').attr('result', 'coloredBlur');
    const mergeRed = filterRed.append('feMerge');
    mergeRed.append('feMergeNode').attr('in', 'coloredBlur');
    mergeRed.append('feMergeNode').attr('in', 'SourceGraphic');

    // China Glow Filter
    const filterAmber = defs.append('filter').attr('id', 'glow-amber').attr('x', '-50%').attr('y', '-50%').attr('width', '200%').attr('height', '200%');
    filterAmber.append('feGaussianBlur').attr('stdDeviation', '3').attr('result', 'coloredBlur');
    const mergeAmber = filterAmber.append('feMerge');
    mergeAmber.append('feMergeNode').attr('in', 'coloredBlur');
    mergeAmber.append('feMergeNode').attr('in', 'SourceGraphic');

    // Netherlands Glow Filter
    const filterCyan = defs.append('filter').attr('id', 'glow-cyan').attr('x', '-50%').attr('y', '-50%').attr('width', '200%').attr('height', '200%');
    filterCyan.append('feGaussianBlur').attr('stdDeviation', '4').attr('result', 'coloredBlur');
    const mergeCyan = filterCyan.append('feMerge');
    mergeCyan.append('feMergeNode').attr('in', 'coloredBlur');
    mergeCyan.append('feMergeNode').attr('in', 'SourceGraphic');

    // Iran Glow Filter
    const filterGreen = defs.append('filter').attr('id', 'glow-green').attr('x', '-50%').attr('y', '-50%').attr('width', '200%').attr('height', '200%');
    filterGreen.append('feGaussianBlur').attr('stdDeviation', '3').attr('result', 'coloredBlur');
    const mergeGreen = filterGreen.append('feMerge');
    mergeGreen.append('feMergeNode').attr('in', 'coloredBlur');
    mergeGreen.append('feMergeNode').attr('in', 'SourceGraphic');

    // Radial Heatmap Gradients per Hub Intensity
    (Object.values(countryFrequencies) as CountryAttackFrequency[]).forEach((cf) => {
      const baseColor = heatColorScale(cf.frequencyScore);
      const coreColor = heatColorScale(Math.min(105, cf.frequencyScore + 12));
      const radGrad = defs
        .append('radialGradient')
        .attr('id', `heat-radial-${cf.country}`)
        .attr('cx', '50%')
        .attr('cy', '50%')
        .attr('r', '50%');
      radGrad.append('stop').attr('offset', '0%').attr('stop-color', coreColor).attr('stop-opacity', '0.78');
      radGrad.append('stop').attr('offset', '45%').attr('stop-color', baseColor).attr('stop-opacity', '0.38');
      radGrad.append('stop').attr('offset', '100%').attr('stop-color', baseColor).attr('stop-opacity', '0');
    });

    // Linear Gradients for Attack Arcs
    const gradRussia = defs.append('linearGradient').attr('id', 'grad-russia-arc').attr('gradientUnits', 'userSpaceOnUse');
    gradRussia.append('stop').attr('offset', '0%').attr('stop-color', '#ef4444').attr('stop-opacity', '0.9');
    gradRussia.append('stop').attr('offset', '100%').attr('stop-color', '#06b6d4').attr('stop-opacity', '0.6');

    const gradChina = defs.append('linearGradient').attr('id', 'grad-china-arc').attr('gradientUnits', 'userSpaceOnUse');
    gradChina.append('stop').attr('offset', '0%').attr('stop-color', '#f59e0b').attr('stop-opacity', '0.9');
    gradChina.append('stop').attr('offset', '100%').attr('stop-color', '#06b6d4').attr('stop-opacity', '0.6');

    // Radial Gradient for Background Radar Screen (Bright Daylight Cartographic Ocean)
    const radarBg = defs.append('radialGradient').attr('id', 'radar-vignette').attr('cx', '50%').attr('cy', '50%').attr('r', '50%');
    radarBg.append('stop').attr('offset', '0%').attr('stop-color', '#f8fafc');
    radarBg.append('stop').attr('offset', '100%').attr('stop-color', '#e0f2fe');

    // Root background rect
    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'url(#radar-vignette)');

    // Zoomable container group
    const g = svg.append('g').attr('class', 'zoom-layer');

    // D3 Projection: Natural Earth 1 gives a realistic, balanced Eurasian and global view
    const projection = d3.geoNaturalEarth1()
      .scale(175)
      .translate([width / 2, height / 2 + 10]);

    const pathGenerator = d3.geoPath().projection(projection);

    // Graticule (Tactical Coordinate Grid)
    const graticule = d3.geoGraticule10();
    g.append('path')
      .datum(graticule)
      .attr('class', 'graticule')
      .attr('d', (d: any) => pathGenerator(d) || '')
      .attr('fill', 'none')
      .attr('stroke', '#cbd5e1')
      .attr('stroke-width', 0.55)
      .attr('stroke-dasharray', '2 3')
      .attr('opacity', 0.65);

    // Helper to resolve origin country frequency data for a TopoJSON feature
    const resolveFeatureCountryFreq = (d: any): CountryAttackFrequency | null => {
      const id = String(d.id || '');
      const name = (d.properties?.name || '').toLowerCase();
      for (const cf of Object.values(countryFrequencies) as CountryAttackFrequency[]) {
        if (filterCountry !== 'ALL' && cf.country !== filterCountry) continue;
        if (cf.isoIds.includes(id) || cf.nameMatchers.some((m) => name.includes(m))) {
          return cf;
        }
      }
      return null;
    };

    // Render Countries from TopoJSON (with dynamic D3 Choropleth Heatmap fill when enabled)
    const countriesGeo = topojson.feature(worldAtlas as any, (worldAtlas as any).objects.countries) as any;

    const countryGroup = g.append('g').attr('class', 'countries-group');

    countryGroup
      .selectAll('path.country')
      .data(countriesGeo.features)
      .enter()
      .append('path')
      .attr('class', 'country')
      .attr('d', (d: any) => pathGenerator(d) || '')
      .attr('fill', (d: any) => {
        const id = String(d.id || '');
        const name = (d.properties?.name || '').toLowerCase();

        // Netherlands target country
        if (id === '528' || name.includes('netherlands')) {
          return '#0ea5e9';
        }

        const matchedFreq = resolveFeatureCountryFreq(d);
        if (matchedFreq) {
          if (showHeatmap && (heatmapStyle === 'COMBINED' || heatmapStyle === 'CHOROPLETH')) {
            const d3Color = d3.color(heatColorScale(matchedFreq.frequencyScore));
            if (d3Color) {
              d3Color.opacity = 0.55 + (matchedFreq.frequencyScore / 100) * 0.35;
              return d3Color.formatRgb();
            }
          }
          // Fallback non-heatmap tactical tint
          if (matchedFreq.country === 'RUSLAND') return 'rgba(225, 29, 72, 0.30)';
          if (matchedFreq.country === 'CHINA') return 'rgba(217, 119, 6, 0.30)';
          if (matchedFreq.country === 'NOORD_KOREA') return 'rgba(190, 18, 60, 0.35)';
          if (matchedFreq.country === 'IRAN') return 'rgba(5, 150, 105, 0.30)';
        }

        return '#e2e8f0';
      })
      .attr('stroke', (d: any) => {
        const id = String(d.id || '');
        const name = (d.properties?.name || '').toLowerCase();
        if (id === '528' || name.includes('netherlands')) {
          return '#0284c7';
        }
        const matchedFreq = resolveFeatureCountryFreq(d);
        if (matchedFreq) {
          if (showHeatmap && (heatmapStyle === 'COMBINED' || heatmapStyle === 'CHOROPLETH')) {
            return heatColorScale(Math.min(105, matchedFreq.frequencyScore + 10));
          }
          if (matchedFreq.country === 'RUSLAND') return '#e11d48';
          if (matchedFreq.country === 'CHINA') return '#d97706';
          if (matchedFreq.country === 'NOORD_KOREA') return '#be123c';
          if (matchedFreq.country === 'IRAN') return '#059669';
        }
        return '#94a3b8';
      })
      .attr('stroke-width', (d: any) => {
        const id = String(d.id || '');
        const matchedFreq = resolveFeatureCountryFreq(d);
        if (matchedFreq || id === '528') return showHeatmap ? 1.6 : 1.4;
        return 0.55;
      })
      .style('cursor', 'pointer')
      .on('mouseenter', function () {
        d3.select(this)
          .transition()
          .duration(150)
          .attr('opacity', 0.85);
      })
      .on('mouseleave', function () {
        d3.select(this)
          .transition()
          .duration(150)
          .attr('opacity', 1);
      });

    // LAYER: D3-Based Dynamic Attack Frequency Heatmap (d3.contourDensity + Radial Thermal Plumes)
    if (showHeatmap && (heatmapStyle === 'COMBINED' || heatmapStyle === 'DENSITY')) {
      const heatmapLayer = g.append('g').attr('class', 'd3-heatmap-layer').style('pointer-events', 'none');

      // Generate weighted spatial density sample points per active hub proportional to live country attack frequency & selected time range
      const densityPoints: Array<[number, number, number]> = [];
      const spread = currentRangeConfig.spreadFactor;

      allHubs.forEach((hub) => {
        if (filterCountry !== 'ALL' && hub.country !== filterCountry) return;
        const pt = projection(hub.coordinates);
        if (!pt) return;

        const countryStat = countryFrequencies[hub.country];
        const isDominantInWindow = countryStat?.dominantHubIds.includes(hub.id);
        const hubTimeBoost = isDominantInWindow ? 1.32 : 0.88;
        const dynamicWeight = ((hub.activeAttacks * (countryStat?.frequencyScore || 70)) / 100) * hubTimeBoost;

        // Deterministic cluster offsets scaled by time-range spreadFactor
        const offsets = [
          [0, 0, dynamicWeight * 1.6],
          [-6 * spread, -4 * spread, dynamicWeight * 1.1],
          [7 * spread, 5 * spread, dynamicWeight * 1.1],
          [-5 * spread, 6 * spread, dynamicWeight * 0.9],
          [6 * spread, -5 * spread, dynamicWeight * 0.9],
          [-12 * spread, 0, dynamicWeight * 0.65],
          [12 * spread, 0, dynamicWeight * 0.65],
          [0, -11 * spread, dynamicWeight * 0.65],
          [0, 11 * spread, dynamicWeight * 0.65],
        ];

        offsets.forEach(([dx, dy, w]) => {
          densityPoints.push([pt[0] + dx, pt[1] + dy, w]);
        });

        // Radial thermal plume glow directly centered on the origin hub
        const plumeRadius = Math.max(
          22,
          Math.min(68, (hub.activeAttacks / 42) * 44 * (countryStat.frequencyScore / 85) * (isDominantInWindow ? 1.18 : 0.92))
        );
        heatmapLayer
          .append('circle')
          .attr('cx', pt[0])
          .attr('cy', pt[1])
          .attr('r', plumeRadius)
          .attr('fill', `url(#heat-radial-${hub.country})`)
          .attr('filter', 'url(#heatmap-blur)');
      });

      // Compute D3 2D Kernel Density Estimation Contours across map space using time-range bandwidth & thresholds
      if (densityPoints.length > 0) {
        const contourGenerator = d3
          .contourDensity<[number, number, number]>()
          .x((d) => d[0])
          .y((d) => d[1])
          .weight((d) => d[2])
          .size([width, height])
          .bandwidth(currentRangeConfig.contourBandwidth)
          .thresholds(currentRangeConfig.contourThresholds);

        const contours = contourGenerator(densityPoints);
        const contourPath = d3.geoPath();

        heatmapLayer
          .selectAll('path.d3-density-contour')
          .data(contours)
          .enter()
          .append('path')
          .attr('class', 'd3-density-contour')
          .attr('d', (d: any) => contourPath(d) || '')
          .attr('fill', (d: any) => densityColorScale(d.value))
          .attr('fill-opacity', (_d: any, i: number) => Math.min(0.45, 0.12 + i * 0.04))
          .attr('stroke', (d: any) => densityColorScale(d.value * 1.25))
          .attr('stroke-width', 0.6)
          .attr('stroke-opacity', 0.45);
      }
    }

    // Country Labels & Dynamic Attack Frequency Callouts for Origin Countries
    (Object.values(countryFrequencies) as CountryAttackFrequency[]).forEach((cf) => {
      if (filterCountry !== 'ALL' && cf.country !== filterCountry) return;
      const centroidPt = projection(cf.centroid);
      if (!centroidPt) return;

      const metaG = g.append('g').attr('class', `country-freq-meta-${cf.country}`);
      const badgeColor =
        cf.country === 'RUSLAND'
          ? '#be123c'
          : cf.country === 'CHINA'
          ? '#b45309'
          : cf.country === 'NOORD_KOREA'
          ? '#9f1239'
          : '#047857';

      // Thermal aura ring scaled by dynamic attack frequency
      const auraRadius = 18 + (cf.frequencyScore / 100) * 18;
      metaG
        .append('circle')
        .attr('cx', centroidPt[0])
        .attr('cy', centroidPt[1])
        .attr('r', auraRadius)
        .attr('fill', showHeatmap ? `url(#heat-radial-${cf.country})` : 'rgba(225, 29, 72, 0.08)')
        .attr('stroke', badgeColor)
        .attr('stroke-dasharray', '3 2')
        .attr('stroke-width', 1.1)
        .attr('opacity', 0.85);

      metaG
        .append('rect')
        .attr('x', centroidPt[0] - 88)
        .attr('y', centroidPt[1] - 17)
        .attr('width', 176)
        .attr('height', 28)
        .attr('rx', 5)
        .attr('fill', 'rgba(255, 255, 255, 0.9)')
        .attr('stroke', badgeColor)
        .attr('stroke-width', 0.8);

      metaG
        .append('text')
        .attr('x', centroidPt[0])
        .attr('y', centroidPt[1] - 5.5)
        .attr('text-anchor', 'middle')
        .attr('fill', '#0f172a')
        .attr('font-size', '9px')
        .attr('font-weight', 'bold')
        .attr('font-family', 'monospace')
        .text(`${cf.flag} ${cf.label.toUpperCase()} [${currentRangeConfig.shortLabel}]`);

      const sharePct = totalAttacksPerMin > 0 ? Math.round((cf.attacksPerMin / totalAttacksPerMin) * 100) : 0;
      metaG
        .append('text')
        .attr('x', centroidPt[0])
        .attr('y', centroidPt[1] + 6)
        .attr('text-anchor', 'middle')
        .attr('fill', badgeColor)
        .attr('font-size', '7.8px')
        .attr('font-weight', 'bold')
        .attr('font-family', 'monospace')
        .text(`FREQ: ${cf.attacksPerMin}/M (${sharePct}%) • ${cf.totalBlocked.toLocaleString('nl-NL')}`);
    });

    // Netherlands Defense Shield Ring
    const nlCoords = projection([5.29, 52.13]);
    if (nlCoords) {
      const nlG = g.append('g').attr('class', 'nl-defense-shield');
      // Expanding radar wave
      nlG.append('circle')
        .attr('cx', nlCoords[0])
        .attr('cy', nlCoords[1])
        .attr('r', 18)
        .attr('fill', 'none')
        .attr('stroke', '#0284c7')
        .attr('stroke-width', 1.8)
        .attr('opacity', 0.85);

      nlG.append('circle')
        .attr('cx', nlCoords[0])
        .attr('cy', nlCoords[1])
        .attr('r', 28)
        .attr('fill', 'none')
        .attr('stroke', '#059669')
        .attr('stroke-width', 1.0)
        .attr('stroke-dasharray', '3 2')
        .attr('opacity', 0.7);

      nlG.append('rect')
        .attr('x', nlCoords[0] - 155)
        .attr('y', nlCoords[1] - 30)
        .attr('width', 142)
        .attr('height', 15)
        .attr('rx', 4)
        .attr('fill', 'rgba(255,255,255,0.92)')
        .attr('stroke', '#0284c7')
        .attr('stroke-width', 0.8);

      nlG.append('text')
        .attr('x', nlCoords[0] - 18)
        .attr('y', nlCoords[1] - 19.5)
        .attr('text-anchor', 'end')
        .attr('fill', '#0369a1')
        .attr('font-size', '9.5px')
        .attr('font-weight', 'bold')
        .attr('font-family', 'monospace')
        .text('🇳🇱 NEDERLAND (SOC DOELWIT)');
    }

    // LAYER: Attack Trajectory Arcs (D3 Curves)
    if (showArcs) {
      const arcsGroup = g.append('g').attr('class', 'trajectories-group');

      filteredTrajectories.forEach((traj) => {
        const hub = allHubs.find((h) => h.id === traj.hubId);
        const target = DUTCH_TARGETS.find((t) => t.id === traj.targetId);

        if (!hub || !target) return;

        const startPt = projection(hub.coordinates);
        const endPt = projection(target.coordinates);

        if (!startPt || !endPt) return;

        const color =
          traj.country === 'RUSLAND'
            ? '#e11d48'
            : traj.country === 'CHINA'
            ? '#d97706'
            : traj.country === 'NOORD_KOREA'
            ? '#be123c'
            : '#059669';
        const isSelected = (selectedHub && selectedHub.id === hub.id) || (selectedTarget && selectedTarget.id === target.id);

        // Calculate control point for curved ballistic trajectory
        const dx = endPt[0] - startPt[0];
        const dy = endPt[1] - startPt[1];
        const cx = (startPt[0] + endPt[0]) / 2 - dy * 0.22;
        const cy = (startPt[1] + endPt[1]) / 2 + Math.abs(dx) * 0.18;

        const pathD = `M ${startPt[0]} ${startPt[1]} Q ${cx} ${cy} ${endPt[0]} ${endPt[1]}`;

        // Base trajectory line
        arcsGroup.append('path')
          .attr('d', pathD)
          .attr('fill', 'none')
          .attr('stroke', color)
          .attr('stroke-width', isSelected ? 2.4 : 1.35)
          .attr('stroke-dasharray', isSelected ? '4 2' : '3 3')
          .attr('opacity', isSelected ? 0.95 : 0.55);

        // Animated traveling packet pulse along arc
        if (showPulses && isLiveRunning) {
          const pulseCircle = arcsGroup.append('circle')
            .attr('r', isSelected ? 3.5 : 2.3)
            .attr('fill', '#ffffff')
            .attr('stroke', color)
            .attr('stroke-width', 1.6);

          // Animate particle along path
          const pathNode = arcsGroup.append('path').attr('d', pathD).attr('display', 'none').node();
          if (pathNode) {
            const pathElement = pathNode as SVGPathElement;
            const totalLength = pathElement.getTotalLength();
            const duration = Math.max(1800, 3200 - traj.intensity * 250);

            function repeatPulse() {
              pulseCircle
                .transition()
                .duration(duration)
                .ease(d3.easeLinear)
                .attrTween('transform', function () {
                  return function (t: number) {
                    const p = pathElement.getPointAtLength(t * totalLength);
                    return `translate(${p.x},${p.y})`;
                  };
                })
                .on('end', repeatPulse);
            }
            repeatPulse();
          }
        }
      });
    }

    // LAYER: Russian & Chinese Cyber Origin Hubs (Circles & Icons)
    const hubsGroup = g.append('g').attr('class', 'hubs-group');
    allHubs.forEach((hub) => {
      if (filterCountry !== 'ALL' && hub.country !== filterCountry) return;

      const pt = projection(hub.coordinates);
      if (!pt) return;

      const color =
        hub.country === 'RUSLAND'
          ? '#e11d48'
          : hub.country === 'CHINA'
          ? '#d97706'
          : hub.country === 'NOORD_KOREA'
          ? '#be123c'
          : '#059669';
      const flag =
        hub.country === 'RUSLAND'
          ? '🇷🇺'
          : hub.country === 'CHINA'
          ? '🇨🇳'
          : hub.country === 'NOORD_KOREA'
          ? '🇰🇵'
          : '🇮🇷';
      const labelFill =
        hub.country === 'RUSLAND'
          ? '#9f1239'
          : hub.country === 'CHINA'
          ? '#92400e'
          : hub.country === 'NOORD_KOREA'
          ? '#881337'
          : '#065f46';
      const isSelected = selectedHub?.id === hub.id;

      const hubG = hubsGroup.append('g')
        .attr('class', 'hub-node')
        .attr('transform', `translate(${pt[0]},${pt[1]})`)
        .style('cursor', 'pointer')
        .on('click', () => {
          setSelectedHub(hub);
          if (onSelectHub) onSelectHub(hub);
        });

      // Outer radar pulse
      hubG.append('circle')
        .attr('r', isSelected ? 12 : 7)
        .attr('fill', 'none')
        .attr('stroke', color)
        .attr('stroke-width', 1.1)
        .attr('stroke-dasharray', '2 2')
        .attr('opacity', 0.7);

      // Inner solid point
      hubG.append('circle')
        .attr('r', isSelected ? 5.5 : 3.8)
        .attr('fill', color)
        .attr('stroke', '#ffffff')
        .attr('stroke-width', 1);

      hubG.append('circle')
        .attr('r', 1.6)
        .attr('fill', '#ffffff');

      // Label
      if (showLabels) {
        hubG.append('text')
          .attr('x', 7)
          .attr('y', 3)
          .attr('fill', labelFill)
          .attr('font-size', isSelected ? '9px' : '7.5px')
          .attr('font-weight', 'bold')
          .attr('font-family', 'monospace')
          .text(`${flag} ${hub.city}`);
      }
    });

    // LAYER: Dutch Vital Infrastructure Target Nodes
    const targetsGroup = g.append('g').attr('class', 'targets-group');
    DUTCH_TARGETS.forEach((target) => {
      const pt = projection(target.coordinates);
      if (!pt) return;

      const isSelected = selectedTarget?.id === target.id;
      const isAlbertHeijn = target.id === 'target-albertheijn';

      const targetG = targetsGroup.append('g')
        .attr('class', 'target-node')
        .attr('transform', `translate(${pt[0]},${pt[1]})`)
        .style('cursor', 'pointer')
        .on('click', () => {
          setSelectedTarget(target);
          if (onSelectTarget) onSelectTarget(target);
        });

      // Pulsing defense beacon
      targetG.append('circle')
        .attr('r', isSelected ? 10 : isAlbertHeijn ? 8 : 5.5)
        .attr('fill', isAlbertHeijn ? 'rgba(2, 132, 199, 0.2)' : 'rgba(14, 165, 233, 0.15)')
        .attr('stroke', isAlbertHeijn ? '#0284c7' : '#0ea5e9')
        .attr('stroke-width', isSelected ? 2 : 1.2);

      targetG.append('circle')
        .attr('r', isSelected ? 4 : 2.6)
        .attr('fill', isAlbertHeijn ? '#0284c7' : '#059669');

      if (showLabels && (isSelected || isAlbertHeijn)) {
        targetG.append('text')
          .attr('x', -8)
          .attr('y', -7)
          .attr('text-anchor', 'end')
          .attr('fill', isAlbertHeijn ? '#0369a1' : '#065f46')
          .attr('font-size', '8px')
          .attr('font-weight', 'bold')
          .attr('font-family', 'monospace')
          .text(isAlbertHeijn ? '🛒 Albert Heijn (WMS)' : target.name.split('(')[0].trim());
      }
    });

    // SETUP D3 ZOOM BEHAVIOR
    const zoomBehavior = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.8, 14])
      .translateExtent([[-200, -200], [width + 200, height + 200]])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoomBehavior);

    // Apply preset zoom transform based on mapPreset state
    let targetK = 1.6;
    let targetX = -120;
    let targetY = -40;

    if (mapPreset === 'WORLD') {
      targetK = 1.0;
      targetX = 0;
      targetY = 0;
    } else if (mapPreset === 'NL') {
      // High zoom into Netherlands
      targetK = 7.5;
      const nl = projection([5.29, 52.13]);
      if (nl) {
        targetX = width / 2 - nl[0] * targetK;
        targetY = height / 2 - nl[1] * targetK;
      }
    } else if (mapPreset === 'RUSSIA') {
      // Zoom into Russia / Eurasia
      targetK = 2.4;
      const ru = projection([60, 56]);
      if (ru) {
        targetX = width / 2 - ru[0] * targetK;
        targetY = height / 2 - ru[1] * targetK;
      }
    } else if (mapPreset === 'CHINA') {
      // Zoom into China
      targetK = 2.8;
      const cn = projection([108, 34]);
      if (cn) {
        targetX = width / 2 - cn[0] * targetK;
        targetY = height / 2 - cn[1] * targetK;
      }
    } else if (mapPreset === 'EURASIA') {
      // Default: Corridor between Western Europe and East Asia
      targetK = 1.65;
      const mid = projection([60, 48]);
      if (mid) {
        targetX = width / 2 - mid[0] * targetK;
        targetY = height / 2 - mid[1] * targetK;
      }
    }

    svg.transition().duration(650).call(
      zoomBehavior.transform,
      d3.zoomIdentity.translate(targetX, targetY).scale(targetK)
    );

  }, [filterCountry, showHeatmap, heatmapStyle, countryFrequencies, totalAttacksPerMin, currentRangeConfig, showArcs, showPulses, showLabels, mapPreset, selectedHub, selectedTarget, filteredTrajectories, allHubs, isLiveRunning]);

  // Handle manual zoom buttons
  const handleZoomIn = () => {
    if (!svgRef.current) return;
    d3.select(svgRef.current).transition().duration(350).call(d3.zoom().scaleBy as any, 1.4);
  };

  const handleZoomOut = () => {
    if (!svgRef.current) return;
    d3.select(svgRef.current).transition().duration(350).call(d3.zoom().scaleBy as any, 0.7);
  };

  const handleResetZoom = () => {
    setMapPreset('EURASIA');
  };

  // Helper to get D3 thermal color for UI cards
  const getThermalColor = (score: number) => d3.interpolateYlOrRd(Math.min(1, Math.max(0.25, score / 100)));

  return (
    <div className={`bg-white border border-slate-200 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-sm overflow-hidden ${className}`}>
      {/* Top Header & Tactical Telemetry Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-3 sm:pb-4 border-b border-slate-200 gap-3 sm:gap-4">
        <div className="flex items-start sm:items-center gap-2.5 sm:gap-3">
          <div className="p-2 sm:p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 shrink-0">
            <Globe2 className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-wide">
                D3.js Realtime Wereld Cyberradar & Aanvalsfrequentie Heatmap
              </h2>
              <span className="text-xs font-mono-code font-bold bg-rose-50 text-rose-800 border border-rose-200 px-2 py-0.5 rounded flex items-center gap-1 animate-pulse">
                <Flame className="w-3.5 h-3.5 text-amber-600" />
                D3 HEATMAP ({currentRangeConfig.shortLabel.toUpperCase()})
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5 leading-relaxed">
              Dynamische D3-choropleth & kerndichtheid-heatmap van historische en actuele aanvalspatronen per herkomstland.
            </p>
          </div>
        </div>

        {/* Real-time simulation control buttons & filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs overflow-x-auto scrollbar-none max-w-full">
            <button
              onClick={() => setFilterCountry('ALL')}
              className={`px-2.5 py-1.5 min-h-[36px] rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer ${
                filterCountry === 'ALL' ? 'bg-white text-slate-900 font-bold shadow-sm' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              Alle ({INITIAL_TRAJECTORIES.length})
            </button>
            <button
              onClick={() => setFilterCountry('RUSLAND')}
              className={`px-2.5 py-1.5 min-h-[36px] rounded-lg font-medium transition-all flex items-center gap-1 whitespace-nowrap cursor-pointer ${
                filterCountry === 'RUSLAND' ? 'bg-rose-50 text-rose-800 font-bold border border-rose-300 shadow-sm' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <span>🇷🇺</span> Rusland
            </button>
            <button
              onClick={() => setFilterCountry('CHINA')}
              className={`px-2.5 py-1.5 min-h-[36px] rounded-lg font-medium transition-all flex items-center gap-1 whitespace-nowrap cursor-pointer ${
                filterCountry === 'CHINA' ? 'bg-amber-50 text-amber-900 font-bold border border-amber-300 shadow-sm' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <span>🇨🇳</span> China
            </button>
            <button
              onClick={() => setFilterCountry('NOORD_KOREA')}
              className={`px-2.5 py-1.5 min-h-[36px] rounded-lg font-medium transition-all flex items-center gap-1 whitespace-nowrap cursor-pointer ${
                filterCountry === 'NOORD_KOREA' ? 'bg-rose-50 text-rose-800 font-bold border border-rose-300 shadow-sm' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <span>🇰🇵</span> Noord-Korea
            </button>
            <button
              onClick={() => setFilterCountry('IRAN')}
              className={`px-2.5 py-1.5 min-h-[36px] rounded-lg font-medium transition-all flex items-center gap-1 whitespace-nowrap cursor-pointer ${
                filterCountry === 'IRAN' ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-300 shadow-sm' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <span>🇮🇷</span> Iran
            </button>
          </div>

          <button
            onClick={() => setIsLiveRunning(!isLiveRunning)}
            className={`px-3 py-2 min-h-[38px] rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
              isLiveRunning
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
                : 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200'
            }`}
            title={isLiveRunning ? 'Pauzeer simulatie' : 'Hervat realtime stream'}
          >
            {isLiveRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isLiveRunning ? 'Live' : 'Gepauzeerd'}</span>
          </button>
        </div>
      </div>

      {/* Dynamic Origin Country Attack Frequency Heatmap Matrix with Time-Range Filter (1h, 6h, 24h, 7d) */}
      <div className="mt-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-2.5 pb-2.5 border-b border-slate-200">
          <div className="flex flex-wrap items-center gap-2">
            <Flame className="w-4 h-4 text-orange-600 shrink-0" />
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono-code">
              Historische & Dynamische Aanvalsfrequentie per Herkomstland
            </span>
            <span className="text-xs font-mono-code font-semibold text-amber-900 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
              Venster: {currentRangeConfig.fullLabel} ({totalBlockedInWindow.toLocaleString('nl-NL')} onderschept)
            </span>
          </div>

          {/* Time-Range Selector (1h, 6h, 24h, 7d) + Heatmap Mode Controls */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono-code">
            {/* Time-Range Filter Buttons */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200">
              <span className="text-xs text-slate-600 px-1.5 hidden sm:inline font-sans">Tijdsfilter:</span>
              {(['1H', '6H', '24H', '7D'] as HeatmapTimeRange[]).map((rangeKey) => {
                const cfg = TIME_RANGE_PATTERNS[rangeKey];
                const isActive = activeTimeRange === rangeKey;
                return (
                  <button
                    key={rangeKey}
                    onClick={() => handleSelectTimeRange(rangeKey)}
                    className={`px-2 py-1 min-h-[32px] rounded text-xs transition-all cursor-pointer ${
                      isActive
                        ? 'bg-rose-600 text-white font-bold shadow-sm'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                    title={cfg.fullLabel}
                  >
                    {rangeKey.toLowerCase()} ({cfg.shortLabel})
                  </button>
                );
              })}
            </div>

            {/* Heatmap Style Mode Buttons */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 flex-wrap">
              <button
                onClick={() => {
                  setShowHeatmap(true);
                  setHeatmapStyle('COMBINED');
                }}
                className={`px-2 py-1 min-h-[32px] rounded text-xs transition-colors cursor-pointer ${
                  showHeatmap && heatmapStyle === 'COMBINED'
                    ? 'bg-amber-600 text-white font-bold'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Gecombineerd
              </button>
              <button
                onClick={() => {
                  setShowHeatmap(true);
                  setHeatmapStyle('CHOROPLETH');
                }}
                className={`px-2 py-1 min-h-[32px] rounded text-xs transition-colors cursor-pointer ${
                  showHeatmap && heatmapStyle === 'CHOROPLETH'
                    ? 'bg-amber-600 text-white font-bold'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Choropleth
              </button>
              <button
                onClick={() => {
                  setShowHeatmap(true);
                  setHeatmapStyle('DENSITY');
                }}
                className={`px-2 py-1 min-h-[32px] rounded text-xs transition-colors cursor-pointer ${
                  showHeatmap && heatmapStyle === 'DENSITY'
                    ? 'bg-amber-600 text-white font-bold'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                D3 Dichtheid
              </button>
              <button
                onClick={() => setShowHeatmap(!showHeatmap)}
                className={`px-2 py-1 min-h-[32px] rounded text-xs transition-colors cursor-pointer ${
                  !showHeatmap ? 'bg-slate-700 text-white font-bold' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {showHeatmap ? 'Verberg' : 'Uit'}
              </button>
            </div>

            <div className="hidden 2xl:flex items-center gap-1.5 text-xs text-slate-600">
              <span>Laag</span>
              <div
                className="w-20 h-2.5 rounded-sm border border-slate-300"
                style={{
                  background: 'linear-gradient(90deg, #ffffcc 0%, #fed976 25%, #fd8d3c 55%, #e31a1c 80%, #800026 100%)',
                }}
              />
              <span className="text-rose-700 font-bold">Kritiek ({totalAttacksPerMin}/m)</span>
            </div>
          </div>
        </div>

        {/* Historical Pattern Insight Banner */}
        <div className="mt-2.5 px-3 py-2 rounded-lg bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs font-mono-code">
          <span className="text-slate-700 font-sans">
            <strong className="text-amber-800">Patroon ({currentRangeConfig.fullLabel}):</strong> {currentRangeConfig.summary}
          </span>
          <span className="text-slate-500 shrink-0">
            D3 Straal: {currentRangeConfig.contourBandwidth}px • {currentRangeConfig.contourThresholds} Lagen
          </span>
        </div>

        {/* 4 Origin Country Dynamic Frequency Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 mt-2.5">
          {(Object.values(countryFrequencies) as CountryAttackFrequency[]).map((cf) => {
            const sharePct = totalAttacksPerMin > 0 ? Math.round((cf.attacksPerMin / totalAttacksPerMin) * 100) : 0;
            const thermalHex = getThermalColor(cf.frequencyScore);
            const isFiltered = filterCountry === cf.country;
            return (
              <button
                key={cf.country}
                onClick={() => setFilterCountry(isFiltered ? 'ALL' : cf.country)}
                className={`text-left p-3 rounded-xl border transition-all relative overflow-hidden cursor-pointer ${
                  isFiltered
                    ? 'bg-amber-50 border-orange-400 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs gap-2">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5 truncate">
                    <span>{cf.flag}</span>
                    <span className="truncate">{cf.label}</span>
                  </span>
                  <span className="text-xs font-mono-code font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200 shrink-0">
                    HEAT {cf.frequencyScore}
                  </span>
                </div>

                <div className="mt-2 flex items-baseline justify-between font-mono-code">
                  <div>
                    <span className="text-base font-extrabold text-slate-900">
                      {cf.attacksPerMin}
                    </span>
                    <span className="text-xs text-slate-600 ml-1">aanv/min ({currentRangeConfig.shortLabel})</span>
                  </div>
                  <span className="text-xs font-bold text-rose-700">
                    {sharePct}% aandeel
                  </span>
                </div>

                {/* D3-scaled Thermal Progress Bar */}
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mt-1.5 border border-slate-200">
                  <div
                    className="h-full transition-all duration-500 rounded-full"
                    style={{
                      width: `${cf.frequencyScore}%`,
                      backgroundColor: thermalHex,
                    }}
                  />
                </div>

                <div className="mt-1.5 flex items-center justify-between text-xs font-mono-code text-slate-600">
                  <span>{currentRangeConfig.shortLabel} Totaal: {cf.totalBlocked.toLocaleString('nl-NL')}</span>
                  <span className="text-slate-800 font-semibold">{cf.bandwidthGbps} Gbps</span>
                </div>
                <div className="mt-1 text-xs font-mono-code text-amber-800 truncate">
                  {cf.patternNote}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Real-time Ticker Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-2.5 mt-3 pt-1 text-xs font-mono-code">
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-xs text-slate-600 font-sans">Verwerkte Pakketten:</div>
          <div className="text-xs sm:text-sm font-bold text-sky-800 mt-0.5 flex items-center gap-1 truncate">
            <Activity className="w-3.5 h-3.5 text-sky-600 animate-spin shrink-0" style={{ animationDuration: '6s' }} />
            <span>{liveMetrics.packetsPerSecond.toLocaleString('nl-NL')} pkts/s</span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-xs text-slate-600 font-sans">Totaal Frequentie (1m):</div>
          <div className="text-xs sm:text-sm font-bold text-emerald-800 mt-0.5 flex items-center gap-1 truncate">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>{totalAttacksPerMin} aanvallen/min</span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-xs text-slate-600 font-sans">🇷🇺 Frequentie Rusland:</div>
          <div className="text-xs sm:text-sm font-bold text-rose-700 mt-0.5 truncate">
            {countryFrequencies.RUSLAND.attacksPerMin}/min (LockBit / GRU)
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-xs text-slate-600 font-sans">🇨🇳 Frequentie China:</div>
          <div className="text-xs sm:text-sm font-bold text-amber-800 mt-0.5 truncate">
            {countryFrequencies.CHINA.attacksPerMin}/min (Volt / Salt)
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-xs text-slate-600 font-sans">C2 Relais Verbindingen:</div>
          <div className="text-xs sm:text-sm font-bold text-purple-800 mt-0.5">
            {liveMetrics.activeC2Connections} knooppunten
          </div>
        </div>
      </div>

      {/* Main Interactive Stage: D3 Map + Telemetry Inspector */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
        {/* D3 World Map Display (8 cols) */}
        <div className="lg:col-span-8 bg-sky-50/70 rounded-xl sm:rounded-2xl border border-slate-200 p-2.5 sm:p-3 relative overflow-hidden flex flex-col justify-between min-h-[320px] sm:min-h-[460px]">
          
          {/* MOBILE CONTROL BAR: Dedicated uncluttered controls on mobile phones */}
          <div className="flex sm:hidden flex-col gap-2 pb-2 border-b border-slate-200 z-20">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5 text-xs">
                <button
                  onClick={() => setMapPreset('EURASIA')}
                  className={`px-2.5 py-1.5 min-h-[36px] rounded-lg whitespace-nowrap font-semibold cursor-pointer ${mapPreset === 'EURASIA' ? 'bg-rose-600 text-white font-bold' : 'text-slate-700 bg-white border border-slate-200'}`}
                >
                  Corridor
                </button>
                <button
                  onClick={() => setMapPreset('NL')}
                  className={`px-2.5 py-1.5 min-h-[36px] rounded-lg whitespace-nowrap flex items-center gap-1 font-semibold cursor-pointer ${mapPreset === 'NL' ? 'bg-sky-700 text-white font-bold' : 'text-slate-700 bg-white border border-slate-200'}`}
                >
                  🇳🇱 NL
                </button>
                <button
                  onClick={() => setMapPreset('RUSSIA')}
                  className={`px-2.5 py-1.5 min-h-[36px] rounded-lg whitespace-nowrap flex items-center gap-1 font-semibold cursor-pointer ${mapPreset === 'RUSSIA' ? 'bg-rose-600 text-white font-bold' : 'text-slate-700 bg-white border border-slate-200'}`}
                >
                  🇷🇺 RU
                </button>
                <button
                  onClick={() => setMapPreset('CHINA')}
                  className={`px-2.5 py-1.5 min-h-[36px] rounded-lg whitespace-nowrap flex items-center gap-1 font-semibold cursor-pointer ${mapPreset === 'CHINA' ? 'bg-amber-600 text-white font-bold' : 'text-slate-700 bg-white border border-slate-200'}`}
                >
                  🇨🇳 CN
                </button>
                <button
                  onClick={() => setMapPreset('WORLD')}
                  className={`px-2.5 py-1.5 min-h-[36px] rounded-lg whitespace-nowrap font-semibold cursor-pointer ${mapPreset === 'WORLD' ? 'bg-slate-800 text-white font-bold' : 'text-slate-700 bg-white border border-slate-200'}`}
                >
                  Wereld
                </button>
              </div>

              {/* Mobile zoom buttons */}
              <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-200 shrink-0">
                <button onClick={handleZoomIn} className="p-2 rounded text-slate-700 hover:text-slate-900" title="Zoom In">
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button onClick={handleZoomOut} className="p-2 rounded text-slate-700 hover:text-slate-900" title="Zoom Out">
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button onClick={handleResetZoom} className="p-2 rounded text-slate-700 hover:text-slate-900" title="Reset">
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* TABLET / DESKTOP Map Overlay Controls (Top left) */}
          <div className="hidden sm:flex absolute top-5 left-5 z-20 flex-wrap items-center gap-1 bg-white/95 backdrop-blur-md p-1.5 rounded-xl border border-slate-200 shadow-md text-xs">
            <button
              onClick={() => setMapPreset('EURASIA')}
              className={`px-2.5 py-1.5 rounded-lg transition-colors font-medium cursor-pointer ${
                mapPreset === 'EURASIA' ? 'bg-rose-600 text-white font-bold' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Corridor NL - Eurazië
            </button>
            <button
              onClick={() => setMapPreset('NL')}
              className={`px-2.5 py-1.5 rounded-lg transition-colors font-medium flex items-center gap-1 cursor-pointer ${
                mapPreset === 'NL' ? 'bg-sky-700 text-white font-bold' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span>🇳🇱</span> Nederland
            </button>
            <button
              onClick={() => setMapPreset('RUSSIA')}
              className={`px-2.5 py-1.5 rounded-lg transition-colors font-medium flex items-center gap-1 cursor-pointer ${
                mapPreset === 'RUSSIA' ? 'bg-rose-600 text-white font-bold' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span>🇷🇺</span> Rusland
            </button>
            <button
              onClick={() => setMapPreset('CHINA')}
              className={`px-2.5 py-1.5 rounded-lg transition-colors font-medium flex items-center gap-1 cursor-pointer ${
                mapPreset === 'CHINA' ? 'bg-amber-600 text-white font-bold' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span>🇨🇳</span> China
            </button>
            <button
              onClick={() => setMapPreset('WORLD')}
              className={`px-2.5 py-1.5 rounded-lg transition-colors font-medium cursor-pointer ${
                mapPreset === 'WORLD' ? 'bg-slate-800 text-white font-bold' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Wereld
            </button>
          </div>

          {/* TABLET / DESKTOP Zoom & Viewport controls (Top right) */}
          <div className="hidden sm:flex absolute top-5 right-5 z-20 flex-col items-center gap-1 bg-white/95 backdrop-blur-md p-1 rounded-xl border border-slate-200 shadow-md">
            <button
              onClick={handleZoomIn}
              className="p-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Reset Kaartpositie"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* TABLET / DESKTOP Layer toggles (Bottom left) */}
          <div className="hidden sm:flex absolute bottom-12 left-5 z-20 items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm text-xs text-slate-700">
            <button
              onClick={() => setShowHeatmap(!showHeatmap)}
              className={`flex items-center gap-1.5 transition-colors cursor-pointer ${showHeatmap ? 'text-orange-700 font-bold' : 'text-slate-500'}`}
            >
              <span className={`w-2 h-2 rounded-full ${showHeatmap ? 'bg-orange-600 animate-pulse' : 'bg-slate-400'}`}></span>
              D3 Heatmap
            </button>
            <span className="text-slate-300">|</span>
            <button
              onClick={() => setShowArcs(!showArcs)}
              className={`flex items-center gap-1.5 transition-colors cursor-pointer ${showArcs ? 'text-rose-700 font-bold' : 'text-slate-500'}`}
            >
              <span className={`w-2 h-2 rounded-full ${showArcs ? 'bg-rose-600' : 'bg-slate-400'}`}></span>
              Aanvalslijnen
            </button>
            <span className="text-slate-300">|</span>
            <button
              onClick={() => setShowPulses(!showPulses)}
              className={`flex items-center gap-1.5 transition-colors cursor-pointer ${showPulses ? 'text-sky-700 font-bold' : 'text-slate-500'}`}
            >
              <span className={`w-2 h-2 rounded-full ${showPulses ? 'bg-sky-600' : 'bg-slate-400'}`}></span>
              Pakketpulsen
            </button>
            <span className="text-slate-300">|</span>
            <button
              onClick={() => setShowLabels(!showLabels)}
              className={`flex items-center gap-1.5 transition-colors cursor-pointer ${showLabels ? 'text-amber-800 font-bold' : 'text-slate-500'}`}
            >
              <span className={`w-2 h-2 rounded-full ${showLabels ? 'bg-amber-600' : 'bg-slate-400'}`}></span>
              Labels
            </button>
          </div>

          {/* D3 SVG Container */}
          <div ref={containerRef} className="w-full h-full flex items-center justify-center min-h-[260px] sm:min-h-[380px] my-1 sm:my-0">
            <svg
              ref={svgRef}
              viewBox="0 0 960 500"
              className="w-full h-full select-none"
              style={{ maxHeight: '480px' }}
            />
          </div>

          {/* Mobile Layer Toggles (Cleanly positioned below SVG on mobile) */}
          <div className="flex sm:hidden items-center justify-between gap-1 py-1.5 px-2 bg-white rounded-xl text-xs text-slate-700 border border-slate-200 mb-1.5">
            <button
              onClick={() => setShowHeatmap(!showHeatmap)}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg ${showHeatmap ? 'text-orange-800 font-bold bg-orange-50' : 'text-slate-500'}`}
            >
              <span className={`w-2 h-2 rounded-full ${showHeatmap ? 'bg-orange-600' : 'bg-slate-400'}`}></span>
              Heatmap
            </button>
            <button
              onClick={() => setShowArcs(!showArcs)}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg ${showArcs ? 'text-rose-800 font-bold bg-rose-50' : 'text-slate-500'}`}
            >
              <span className={`w-2 h-2 rounded-full ${showArcs ? 'bg-rose-600' : 'bg-slate-400'}`}></span>
              Lijnen
            </button>
            <button
              onClick={() => setShowPulses(!showPulses)}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg ${showPulses ? 'text-sky-800 font-bold bg-sky-50' : 'text-slate-500'}`}
            >
              <span className={`w-2 h-2 rounded-full ${showPulses ? 'bg-sky-600' : 'bg-slate-400'}`}></span>
              Pulsen
            </button>
            <button
              onClick={() => setShowLabels(!showLabels)}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg ${showLabels ? 'text-amber-800 font-bold bg-amber-50' : 'text-slate-500'}`}
            >
              <span className={`w-2 h-2 rounded-full ${showLabels ? 'bg-amber-600' : 'bg-slate-400'}`}></span>
              Labels
            </button>
          </div>

          {/* Bottom legend */}
          <div className="relative z-10 pt-2.5 border-t border-slate-200 bg-white/90 px-2.5 py-2 rounded-xl flex flex-wrap items-center justify-between text-xs font-mono-code text-slate-700 gap-2">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 font-semibold">
              <span className="flex items-center gap-1 text-rose-700">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
                🇷🇺 Rusland ({countryFrequencies.RUSLAND.attacksPerMin}/m)
              </span>
              <span className="flex items-center gap-1 text-amber-800">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
                🇨🇳 China ({countryFrequencies.CHINA.attacksPerMin}/m)
              </span>
              <span className="flex items-center gap-1 text-rose-800">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-700"></span>
                🇰🇵 Noord-Korea ({countryFrequencies.NOORD_KOREA.attacksPerMin}/m)
              </span>
              <span className="flex items-center gap-1 text-emerald-800">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                🇮🇷 Iran ({countryFrequencies.IRAN.attacksPerMin}/m)
              </span>
            </div>
            <span className="text-slate-500 text-xs font-sans hidden sm:inline">💡 Klik op een landkaart of knooppunt om te filteren</span>
          </div>
        </div>

        {/* Tactical Telemetry Dossier Panel (4 cols) */}
        <div className="lg:col-span-4 bg-slate-50 rounded-2xl border border-slate-200 p-4 flex flex-col justify-between space-y-4">
          <div>
            {/* Header info */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="text-xs font-mono-code font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1.5">
                <Crosshair className="w-4 h-4 text-rose-600" />
                Live Doelwit & Oorsprong Dossier
              </span>
              <span className="px-2 py-0.5 rounded text-xs font-mono-code font-bold bg-rose-50 text-rose-800 border border-rose-200 animate-pulse">
                {selectedTarget?.status || 'ONDER AANVAL'}
              </span>
            </div>

            {/* Selected Target Dossier */}
            {selectedTarget && (
              <div className="mt-3 p-3.5 rounded-xl bg-white border border-slate-200 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-mono-code text-sky-800 uppercase font-bold flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-sky-600" />
                    Nederlands Doelwit
                  </span>
                  <span className="text-xs font-mono-code bg-sky-50 text-sky-800 border border-sky-200 px-2 py-0.5 rounded font-semibold">
                    {selectedTarget.criticality}
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                  {selectedTarget.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  Sector: <strong className="text-sky-900">{selectedTarget.sector}</strong>
                </p>

                <div className="pt-2 border-t border-slate-200 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-xs text-slate-500 block">Geblokkeerd:</span>
                    <span className="font-mono-code font-bold text-emerald-700 text-sm">
                      {selectedTarget.blockedAttempts.toLocaleString('nl-NL')}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block">Live Telemetrie:</span>
                    <span className="font-mono-code font-bold text-rose-700 text-sm">
                      {selectedTarget.livePacketsPerSec}
                    </span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs font-mono-code text-amber-900">
                  Kwetsbaarheid / Vector: <strong>{selectedTarget.activeCve}</strong>
                </div>
              </div>
            )}

            {/* Selected Threat Origin Hub Dossier */}
            {selectedHub && (
              <div className="mt-3 p-3.5 rounded-xl bg-white border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono-code uppercase font-bold flex items-center gap-1 text-rose-700">
                    <span>
                      {selectedHub.country === 'RUSLAND'
                        ? '🇷🇺'
                        : selectedHub.country === 'CHINA'
                        ? '🇨🇳'
                        : selectedHub.country === 'NOORD_KOREA'
                        ? '🇰🇵'
                        : '🇮🇷'}
                    </span>
                    Aanvalsoorsprong
                  </span>
                  <span
                    className={`text-xs font-mono-code font-bold px-2 py-0.5 rounded border ${
                      selectedHub.country === 'RUSLAND'
                        ? 'bg-rose-50 text-rose-800 border-rose-200'
                        : selectedHub.country === 'CHINA'
                        ? 'bg-amber-50 text-amber-900 border-amber-200'
                        : selectedHub.country === 'NOORD_KOREA'
                        ? 'bg-rose-50 text-rose-800 border-rose-200'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    }`}
                  >
                    {selectedHub.threatSeverity}
                  </span>
                </div>
                <h4 className="text-sm sm:text-base font-extrabold text-slate-900">
                  {selectedHub.name} ({selectedHub.city})
                </h4>
                <div className="text-xs sm:text-sm text-slate-700 space-y-1">
                  <div>
                    <span className="text-slate-500">APT Eenheid:</span>{' '}
                    <strong
                      className={
                        selectedHub.country === 'RUSLAND'
                          ? 'text-rose-700'
                          : selectedHub.country === 'CHINA'
                          ? 'text-amber-800'
                          : selectedHub.country === 'NOORD_KOREA'
                          ? 'text-rose-800'
                          : 'text-emerald-800'
                      }
                    >
                      {selectedHub.aptUnit}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Dienst:</span>{' '}
                    <span className="text-slate-800">{selectedHub.militaryAffiliation}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Taktiek:</span>{' '}
                    <span className="font-mono-code text-slate-700 text-xs">{selectedHub.primaryTechnique}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs font-mono-code">
                  <span className="text-slate-500">Actieve C2 Relais:</span>
                  <span className="font-bold text-slate-900">{selectedHub.c2NodesCount} servers</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Selection of Dutch Vital Targets */}
          <div className="space-y-2">
            <span className="text-xs font-mono-code font-bold text-slate-600 uppercase tracking-wider block">
              Snelle Target Selectie (Klik om te inspecteren):
            </span>
            <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto pr-1 scrollbar-thin">
              {DUTCH_TARGETS.map((t) => {
                const isSelected = selectedTarget?.id === t.id;
                const isAlbertHeijn = t.id === 'target-albertheijn';
                return (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTarget(t)}
                    className={`p-2 min-h-[38px] rounded-lg text-left text-xs font-medium transition-all truncate border cursor-pointer ${
                      isSelected
                        ? 'bg-sky-50 text-sky-900 border-sky-400 font-bold shadow-sm'
                        : isAlbertHeijn
                        ? 'bg-blue-50 text-blue-900 border-blue-200 hover:bg-blue-100'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    {isAlbertHeijn ? '🛒 Albert Heijn' : t.name.split('(')[0].trim()}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Cyber Interception Event Stream (Live Ticker) */}
      <div className="mt-4 pt-3 border-t border-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2 text-xs font-mono-code text-slate-600">
            <Terminal className="w-4 h-4 text-rose-600" />
            <span className="text-slate-900 font-bold uppercase">Realtime Interceptie Logboek (Sensor Feed):</span>
          </div>
          <span className="text-xs font-mono-code font-bold text-emerald-700 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
            NCSC CSIRT SYNCHRONISATIE
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {eventLogs.map((log) => (
            <div
              key={log.id}
              className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono-code flex flex-col justify-between space-y-1.5 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs text-slate-700 flex items-center gap-1 font-bold">
                  <span>{log.flag}</span> {log.origin}
                </span>
                <span className="text-[11px] text-rose-800 font-bold bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                  {log.status}
                </span>
              </div>
              <div className="text-slate-900 font-semibold text-xs truncate font-sans" title={log.target}>
                🎯 {log.target}
              </div>
              <div className="text-xs text-slate-600 truncate">
                Actor: <span className="text-amber-800 font-semibold">{log.actor}</span>
              </div>
              <div className="text-xs text-slate-500 truncate">
                Vector: {log.vector}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
