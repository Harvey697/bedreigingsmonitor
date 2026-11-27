import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  TrendingUp,
  AlertTriangle,
  Zap,
  Anchor,
  Building2,
  HeartPulse,
  Wifi,
  CreditCard,
  Apple,
  Cpu,
  Layers,
  Clock,
  Filter,
  ArrowUpRight,
  ShieldAlert,
  Flame,
  FileText,
  Activity,
  Radio,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { ThreatItem, VitalSectorNL } from '../types/threat';

interface ThreatTrendsDashboardProps {
  threats: ThreatItem[];
  selectedSector: VitalSectorNL | 'ALL';
  onSelectSector: (sector: VitalSectorNL | 'ALL') => void;
  onSelectThreatForDetail: (threat: ThreatItem) => void;
  onNavigateToTab: (tab: string) => void;
  onOpenPdfModal?: () => void;
}

// 24 hourly time slices modeling realistic attack telemetry across sectors
interface HourlyTrendData {
  hour: string;
  timestamp: string;
  haven: number;
  energie: number;
  overheid: number;
  telecom: number;
  zorg: number;
  financieel: number;
  voedsel: number;
  hightech: number;
  total: number;
  topActor: string;
  notableEvent?: string;
}

export const HOURLY_24H_DATA: HourlyTrendData[] = [
  { hour: '04:00', timestamp: '04:00 CET', haven: 2, energie: 3, overheid: 1, telecom: 4, zorg: 1, financieel: 2, voedsel: 1, hightech: 1, total: 15, topActor: 'Volt Typhoon' },
  { hour: '05:00', timestamp: '05:00 CET', haven: 3, energie: 4, overheid: 2, telecom: 5, zorg: 2, financieel: 2, voedsel: 2, hightech: 2, total: 22, topActor: 'Sandworm GRU' },
  { hour: '06:00', timestamp: '06:00 CET', haven: 4, energie: 5, overheid: 2, telecom: 5, zorg: 1, financieel: 3, voedsel: 3, hightech: 2, total: 25, topActor: 'Sandworm GRU', notableEvent: 'Modbus SCADA scan op Maasvlakte' },
  { hour: '07:00', timestamp: '07:00 CET', haven: 5, energie: 6, overheid: 3, telecom: 6, zorg: 2, financieel: 4, voedsel: 4, hightech: 3, total: 33, topActor: 'Black Basta' },
  { hour: '08:00', timestamp: '08:00 CET', haven: 7, energie: 8, overheid: 5, telecom: 7, zorg: 3, financieel: 5, voedsel: 5, hightech: 4, total: 44, topActor: 'NoName057(16)', notableEvent: 'DDoS golf op TenneT en RWS portals' },
  { hour: '09:00', timestamp: '09:00 CET', haven: 8, energie: 9, overheid: 6, telecom: 8, zorg: 4, financieel: 6, voedsel: 6, hightech: 5, total: 52, topActor: 'Salt Typhoon' },
  { hour: '10:00', timestamp: '10:00 CET', haven: 9, energie: 10, overheid: 7, telecom: 9, zorg: 3, financieel: 6, voedsel: 5, hightech: 6, total: 55, topActor: 'Lazarus Group', notableEvent: 'Spear-phishing op ASML toeleveranciers' },
  { hour: '11:00', timestamp: '11:00 CET', haven: 7, energie: 9, overheid: 6, telecom: 8, zorg: 4, financieel: 5, voedsel: 5, hightech: 5, total: 49, topActor: 'MuddyWater' },
  { hour: '12:00', timestamp: '12:00 CET', haven: 6, energie: 7, overheid: 5, telecom: 7, zorg: 3, financieel: 4, voedsel: 4, hightech: 4, total: 40, topActor: 'Volt Typhoon' },
  { hour: '13:00', timestamp: '13:00 CET', haven: 8, energie: 8, overheid: 6, telecom: 8, zorg: 4, financieel: 5, voedsel: 6, hightech: 5, total: 50, topActor: 'Black Basta', notableEvent: 'Ransomware verkenning Albert Heijn DC Tilburg' },
  { hour: '14:00', timestamp: '14:00 CET', haven: 9, energie: 11, overheid: 7, telecom: 9, zorg: 5, financieel: 6, voedsel: 6, hightech: 6, total: 59, topActor: 'Sandworm GRU' },
  { hour: '15:00', timestamp: '15:00 CET', haven: 11, energie: 12, overheid: 8, telecom: 10, zorg: 6, financieel: 7, voedsel: 7, hightech: 7, total: 68, topActor: 'NoName057(16)', notableEvent: 'Piek DDoS op Nederlandse banken & iDEAL' },
  { hour: '16:00', timestamp: '16:00 CET', haven: 10, energie: 10, overheid: 7, telecom: 9, zorg: 5, financieel: 6, voedsel: 6, hightech: 6, total: 59, topActor: 'MuddyWater' },
  { hour: '17:00', timestamp: '17:00 CET', haven: 8, energie: 9, overheid: 6, telecom: 8, zorg: 4, financieel: 5, voedsel: 5, hightech: 5, total: 50, topActor: 'Lazarus Group' },
  { hour: '18:00', timestamp: '18:00 CET', haven: 7, energie: 8, overheid: 5, telecom: 7, zorg: 3, financieel: 4, voedsel: 5, hightech: 4, total: 43, topActor: 'Volt Typhoon' },
  { hour: '19:00', timestamp: '19:00 CET', haven: 6, energie: 7, overheid: 4, telecom: 6, zorg: 3, financieel: 3, voedsel: 4, hightech: 4, total: 37, topActor: 'LockBit 3.0' },
  { hour: '20:00', timestamp: '20:00 CET', haven: 7, energie: 8, overheid: 5, telecom: 7, zorg: 4, financieel: 4, voedsel: 4, hightech: 5, total: 44, topActor: 'Sandworm GRU' },
  { hour: '21:00', timestamp: '21:00 CET', haven: 8, energie: 10, overheid: 6, telecom: 8, zorg: 4, financieel: 5, voedsel: 5, hightech: 6, total: 52, topActor: 'Salt Typhoon', notableEvent: 'Cisco IOS XE backdoor probing' },
  { hour: '22:00', timestamp: '22:00 CET', haven: 10, energie: 12, overheid: 7, telecom: 9, zorg: 5, financieel: 6, voedsel: 6, hightech: 7, total: 62, topActor: 'Sandworm GRU' },
  { hour: '23:00', timestamp: '23:00 CET', haven: 12, energie: 14, overheid: 9, telecom: 11, zorg: 6, financieel: 7, voedsel: 7, hightech: 8, total: 74, topActor: 'Sandworm GRU', notableEvent: 'Nachtelijke storm op energieverdeelstations' },
  { hour: '00:00', timestamp: '00:00 CET', haven: 14, energie: 16, overheid: 10, telecom: 12, zorg: 7, financieel: 8, voedsel: 8, hightech: 9, total: 84, topActor: 'Volt Typhoon' },
  { hour: '01:00', timestamp: '01:00 CET', haven: 15, energie: 17, overheid: 11, telecom: 13, zorg: 7, financieel: 8, voedsel: 8, hightech: 10, total: 89, topActor: 'Lazarus Group', notableEvent: 'Kwantitatieve brute-force golf' },
  { hour: '02:00', timestamp: '02:00 CET', haven: 16, energie: 18, overheid: 12, telecom: 14, zorg: 8, financieel: 9, voedsel: 9, hightech: 11, total: 97, topActor: 'Sandworm GRU' },
  { hour: '03:00 (Nu)', timestamp: '03:00 CET (Actueel)', haven: 18, energie: 19, overheid: 13, telecom: 15, zorg: 8, financieel: 9, voedsel: 9, hightech: 12, total: 103, topActor: 'Sandworm & MuddyWater', notableEvent: 'Absolute 24-uurs piek: gecoördineerde hybride golf' },
];

// Sector aggregate breakdown
export const SECTOR_24H_AGGREGATE = [
  { name: 'Haven & Logistiek', id: 'HAVEN_EN_LOGISTIEK', total: 184, critical: 68, high: 74, medium: 42, color: '#06b6d4', icon: 'Anchor' },
  { name: 'Energie & Netbeheer', id: 'ENERGIE_EN_NETBEHEER', total: 215, critical: 92, high: 86, medium: 37, color: '#f59e0b', icon: 'Zap' },
  { name: 'Overheid & Defensie', id: 'RIJKSOVERHEID_EN_DEFENSIE', total: 148, critical: 54, high: 62, medium: 32, color: '#f43f5e', icon: 'Building2' },
  { name: 'Telecom & AMS-IX', id: 'TELECOM_EN_INTERNET', total: 192, critical: 61, high: 88, medium: 43, color: '#6366f1', icon: 'Wifi' },
  { name: 'Zorg & Ziekenhuizen', id: 'ZORG_EN_ZIEKENHUIZEN', total: 96, critical: 32, high: 45, medium: 19, color: '#10b981', icon: 'HeartPulse' },
  { name: 'Financiële Sector', id: 'FINANCIELE_SECTOR', total: 124, critical: 41, high: 57, medium: 26, color: '#3b82f6', icon: 'CreditCard' },
  { name: 'Voedsel & Retail (AH)', id: 'VOEDSEL_EN_AGRO', total: 118, critical: 38, high: 52, medium: 28, color: '#ea580c', icon: 'Apple' },
  { name: 'Hightech & Chips', id: 'HIGHTECH_EN_CHIPS', total: 135, critical: 58, high: 51, medium: 26, color: '#a855f7', icon: 'Cpu' },
];

// Threat origin distribution
export const ORIGIN_DISTRIBUTION = [
  { name: 'Rusland (GRU / FSB / NoName)', value: 38, color: '#ef4444', flag: '🇷🇺' },
  { name: 'China (Volt / Salt Typhoon)', value: 26, color: '#eab308', flag: '🇨🇳' },
  { name: 'Noord-Korea (Lazarus / Bureau 121)', value: 15, color: '#ec4899', flag: '🇰🇵' },
  { name: 'Iran (MuddyWater / Charming Kitten)', value: 12, color: '#10b981', flag: '🇮🇷' },
  { name: 'Dark Web RaaS Syndicaten', value: 9, color: '#8b5cf6', flag: '🏴‍☠️' },
];

// Attack vector distribution
export const VECTOR_DISTRIBUTION = [
  { name: 'DDoS & Netwerkaanvallen', value: 34, color: '#38bdf8' },
  { name: 'Ransomware & Afpersing', value: 28, color: '#f87171' },
  { name: 'Zero-Day / N-Day Exploits', value: 21, color: '#fbbf24' },
  { name: 'Credential Stuffing & LotL', value: 17, color: '#a78bfa' },
];

export const ThreatTrendsDashboard: React.FC<ThreatTrendsDashboardProps> = ({
  threats,
  selectedSector,
  onSelectSector,
  onSelectThreatForDetail,
  onNavigateToTab,
  onOpenPdfModal,
}) => {
  const [timeRange, setTimeRange] = useState<'24H' | '12H' | '6H'>('24H');
  const [metricView, setMetricView] = useState<'STACKED' | 'INDIVIDUAL' | 'CRITICAL_ONLY'>('STACKED');
  const [activeSectorFilter, setActiveSectorFilter] = useState<string>('ALL');
  const [hoveredPoint, setHoveredPoint] = useState<HourlyTrendData | null>(null);

  // Filter time range data
  const filteredHourlyData = useMemo(() => {
    if (timeRange === '6H') {
      return HOURLY_24H_DATA.slice(-6);
    }
    if (timeRange === '12H') {
      return HOURLY_24H_DATA.slice(-12);
    }
    return HOURLY_24H_DATA;
  }, [timeRange]);

  // Find top emerging pattern alerts
  const emergingPatterns = useMemo(() => [
    {
      id: 'pattern-haven',
      title: 'Acute Versnelling: Haven & Maritieme Logistiek',
      velocity: '+280% in 4 uur',
      severity: 'KRITIEK' as const,
      sectorId: 'HAVEN_EN_LOGISTIEK' as VitalSectorNL,
      actor: 'Sandworm GRU & NoName057(16)',
      origin: '🇷🇺 Rusland',
      vector: 'Citrix Bleed (CVE-2023-4966) & Modbus TCP scans',
      target: 'Havenbedrijf Rotterdam, ECT Delta Terminal, Portbase',
      description: 'Gecoördineerde storm van ICS-scans en API-gateway overbelasting gedetecteerd tussen 00:00 en 03:00 CET.',
      threatRefId: 'THREAT-RU-001',
    },
    {
      id: 'pattern-energie',
      title: 'Gerichte Verkenning Hoogspanningsnetten',
      velocity: '+190% in 6 uur',
      severity: 'KRITIEK' as const,
      sectorId: 'ENERGIE_EN_NETBEHEER' as VitalSectorNL,
      actor: 'Volt Typhoon & Sandworm',
      origin: '🇨🇳 China / 🇷🇺 Rusland',
      vector: 'Living-off-the-Land (LotL) & Fortinet zero-day verkenning',
      target: 'TenneT TSO 380kV & Gasunie SCADA dispatchers',
      description: 'Actieve persistente pogingen tot het omzeilen van EDR-sensoren op perimeter firewalls bij hoogspanningsstations.',
      threatRefId: 'THREAT-CN-002',
    },
    {
      id: 'pattern-voedsel',
      title: 'Distributieketen Afpersing (Albert Heijn Logistiek)',
      velocity: '+140% in 8 uur',
      severity: 'HOOG' as const,
      sectorId: 'VOEDSEL_EN_AGRO' as VitalSectorNL,
      actor: 'Black Basta & LockBit affiliates',
      origin: '🏴‍☠️ RaaS Syndicaat / 🇷🇺',
      vector: 'RDP brute-force & kwetsbare warehouse API endpoints',
      target: 'Distributiecentra Zaandam, Tilburg & Pijnacker',
      description: 'Gerichte ransomware verkenning op geautomatiseerde orderpickingsystemen van nationale supermarktketen.',
      threatRefId: 'THREAT-AH-001',
    },
    {
      id: 'pattern-hightech',
      title: 'IP Spionage & Supply Chain Probing Semiconductor',
      velocity: '+165% in 12 uur',
      severity: 'HOOG' as const,
      sectorId: 'HIGHTECH_EN_CHIPS' as VitalSectorNL,
      actor: 'Lazarus Group (Bureau 121) & Salt Typhoon',
      origin: '🇰🇵 Noord-Korea / 🇨🇳 China',
      vector: 'Geavanceerde spear-phishing & gecompromitteerde software dependencies',
      target: 'ASML toeleveringsketen, Brainport Eindhoven R&D',
      description: 'Verdachte code-injectiepogingen in firmware repositories van Nederlandse precisie-engineering toeleveranciers.',
      threatRefId: 'THREAT-KP-001',
    },
  ], []);

  // Custom Tooltip for Recharts
  const CustomChartTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const current = payload[0].payload as HourlyTrendData;
      return (
        <div className="bg-white border border-slate-300 rounded-xl p-3.5 shadow-xl text-xs max-w-xs space-y-2">
          <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
            <span className="font-mono-code font-bold text-amber-800 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              {current.timestamp}
            </span>
            <span className="bg-rose-50 text-rose-800 font-bold px-2 py-0.5 rounded text-xs border border-rose-200">
              {current.total} incidenten/uur
            </span>
          </div>

          <div className="space-y-1 font-mono-code text-xs">
            <div className="flex justify-between items-center text-sky-800">
              <span className="flex items-center gap-1">⚓ Haven & Logistiek:</span>
              <span className="font-bold">{current.haven}</span>
            </div>
            <div className="flex justify-between items-center text-amber-800">
              <span className="flex items-center gap-1">⚡ Energie & Netbeheer:</span>
              <span className="font-bold">{current.energie}</span>
            </div>
            <div className="flex justify-between items-center text-rose-800">
              <span className="flex items-center gap-1">🏛️ Overheid & Defensie:</span>
              <span className="font-bold">{current.overheid}</span>
            </div>
            <div className="flex justify-between items-center text-indigo-800">
              <span className="flex items-center gap-1">📡 Telecom & AMS-IX:</span>
              <span className="font-bold">{current.telecom}</span>
            </div>
            <div className="flex justify-between items-center text-orange-800">
              <span className="flex items-center gap-1">🛒 Voedsel & AH Retail:</span>
              <span className="font-bold">{current.voedsel}</span>
            </div>
            <div className="flex justify-between items-center text-purple-800">
              <span className="flex items-center gap-1">🔬 Hightech & Chips:</span>
              <span className="font-bold">{current.hightech}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 text-xs text-slate-600">
            <div>Dominante Actor: <strong className="text-slate-900">{current.topActor}</strong></div>
            {current.notableEvent && (
              <div className="text-rose-700 font-semibold mt-0.5 flex items-start gap-1">
                <span>⚠️</span>
                <span>{current.notableEvent}</span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Trend KPIs */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center flex-wrap gap-2 mb-1.5">
              <span className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-600">
                <TrendingUp className="w-5 h-5" />
              </span>
              <h2 className="text-lg sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Threat Trends: 24-Uurs Incidentfrequentie
              </h2>
              <span className="bg-rose-50 text-rose-800 border border-rose-200 text-xs px-2.5 py-0.5 rounded-md font-mono-code font-bold uppercase tracking-wider">
                Recharts Telemetrie
              </span>
            </div>
            <p className="text-sm text-slate-700 max-w-3xl leading-relaxed">
              Realtime visualisatie van aanvalsfrequenties over de afgelopen 24 uur gecategoriseerd per vitale NIS2-sector.
              Herken direct opkomende piekmomenten, gecoördineerde statelijke aanvallen en afwijkende patronen in Nederlandse infrastructuren.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onOpenPdfModal && (
              <button
                onClick={onOpenPdfModal}
                className="flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] rounded-xl bg-white border border-slate-300 hover:border-rose-400 hover:bg-rose-50 text-slate-800 text-xs sm:text-sm font-semibold transition-all shadow-sm cursor-pointer"
              >
                <FileText className="w-4 h-4 text-rose-600" />
                <span>Exporteer Trends PDF</span>
              </button>
            )}
            <button
              onClick={() => onNavigateToTab('LIVE_FEED_RADAR')}
              className="flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-semibold transition-all shadow-sm cursor-pointer"
            >
              <Radio className="w-4 h-4 animate-pulse" />
              <span>Naar Live Feed</span>
            </button>
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-5">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
            <div className="flex items-center justify-between text-slate-600 text-xs font-medium">
              <span>Totaal 24u Volume</span>
              <Activity className="w-4 h-4 text-rose-600" />
            </div>
            <div className="mt-1.5 flex items-baseline flex-wrap gap-2">
              <span className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono-code">1.114</span>
              <span className="text-xs text-rose-700 font-semibold font-mono-code">+42% t.o.v. gisteren</span>
            </div>
            <div className="text-xs text-slate-600 mt-1">Geaggregeerde CTI sensoren</div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
            <div className="flex items-center justify-between text-slate-600 text-xs font-medium">
              <span>Piekuur Telemetrie</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="mt-1.5 flex items-baseline flex-wrap gap-2">
              <span className="text-xl sm:text-2xl font-extrabold text-amber-800 font-mono-code">03:00 CET</span>
              <span className="text-xs bg-rose-50 text-rose-800 border border-rose-200 px-1.5 py-0.5 rounded font-bold">103/u</span>
            </div>
            <div className="text-xs text-slate-600 mt-1">Nachtelijke gecoördineerde storm</div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
            <div className="flex items-center justify-between text-slate-600 text-xs font-medium">
              <span>Grootste Sector Stijger</span>
              <Anchor className="w-4 h-4 text-sky-600" />
            </div>
            <div className="mt-1.5 flex items-baseline flex-wrap gap-2">
              <span className="text-base sm:text-lg font-bold text-sky-900 truncate">Haven Rotterdam</span>
              <span className="text-xs text-rose-700 font-bold font-mono-code">+280%</span>
            </div>
            <div className="text-xs text-slate-600 mt-1">Citrix Bleed & Modbus scans</div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
            <div className="flex items-center justify-between text-slate-600 text-xs font-medium">
              <span>Statelijke Aanvalsaandeel</span>
              <Flame className="w-4 h-4 text-rose-600" />
            </div>
            <div className="mt-1.5 flex items-baseline flex-wrap gap-2">
              <span className="text-xl sm:text-2xl font-extrabold text-rose-700 font-mono-code">91%</span>
              <span className="text-xs text-slate-700">🇷🇺 🇨🇳 🇰🇵 🇮🇷</span>
            </div>
            <div className="text-xs text-slate-600 mt-1">Staatssponsoring bevestigd</div>
          </div>
        </div>
      </div>

      {/* Main Interactive Recharts Area Chart */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse" />
            <h3 className="font-bold text-slate-900 text-base sm:text-lg">
              Aanvalsfrequentie over de Afgelopen 24 Uur per Sector
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Time range toggle */}
            <div className="inline-flex rounded-xl border border-slate-200 bg-slate-100 p-1 text-xs font-semibold">
              <button
                onClick={() => setTimeRange('24H')}
                className={`px-3 py-1.5 min-h-[36px] rounded-lg transition-all cursor-pointer ${
                  timeRange === '24H' ? 'bg-rose-600 text-white font-bold shadow-sm' : 'text-slate-700 hover:text-slate-900 hover:bg-white'
                }`}
              >
                24 Uur
              </button>
              <button
                onClick={() => setTimeRange('12H')}
                className={`px-3 py-1.5 min-h-[36px] rounded-lg transition-all cursor-pointer ${
                  timeRange === '12H' ? 'bg-rose-600 text-white font-bold shadow-sm' : 'text-slate-700 hover:text-slate-900 hover:bg-white'
                }`}
              >
                12 Uur
              </button>
              <button
                onClick={() => setTimeRange('6H')}
                className={`px-3 py-1.5 min-h-[36px] rounded-lg transition-all cursor-pointer ${
                  timeRange === '6H' ? 'bg-rose-600 text-white font-bold shadow-sm' : 'text-slate-700 hover:text-slate-900 hover:bg-white'
                }`}
              >
                Laatste 6u Piek
              </button>
            </div>

            {/* View style toggle */}
            <div className="inline-flex rounded-xl border border-slate-200 bg-slate-100 p-1 text-xs font-semibold">
              <button
                onClick={() => setMetricView('STACKED')}
                className={`px-3 py-1.5 min-h-[36px] rounded-lg transition-all cursor-pointer ${
                  metricView === 'STACKED' ? 'bg-white text-slate-900 font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Gestapeld Volume
              </button>
              <button
                onClick={() => setMetricView('INDIVIDUAL')}
                className={`px-3 py-1.5 min-h-[36px] rounded-lg transition-all cursor-pointer ${
                  metricView === 'INDIVIDUAL' ? 'bg-white text-slate-900 font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sector Lijnen
              </button>
            </div>
          </div>
        </div>

        {/* Sector Quick Filter Tags */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1 text-xs">
          <span className="text-slate-600 font-mono-code text-xs shrink-0 mr-1 flex items-center gap-1 font-semibold">
            <Filter className="w-3.5 h-3.5" /> Focus Sector:
          </span>
          <button
            onClick={() => setActiveSectorFilter('ALL')}
            className={`px-3 py-1.5 min-h-[38px] rounded-xl shrink-0 transition-all cursor-pointer font-semibold ${
              activeSectorFilter === 'ALL'
                ? 'bg-rose-600 text-white font-bold shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            Alle 8 Sectoren
          </button>
          <button
            onClick={() => setActiveSectorFilter('HAVEN')}
            className={`px-3 py-1.5 min-h-[38px] rounded-xl shrink-0 transition-all cursor-pointer font-semibold ${
              activeSectorFilter === 'HAVEN'
                ? 'bg-sky-700 text-white font-bold shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:text-sky-900 hover:bg-sky-50 border border-slate-200'
            }`}
          >
            ⚓ Haven Rotterdam
          </button>
          <button
            onClick={() => setActiveSectorFilter('ENERGIE')}
            className={`px-3 py-1.5 min-h-[38px] rounded-xl shrink-0 transition-all cursor-pointer font-semibold ${
              activeSectorFilter === 'ENERGIE'
                ? 'bg-amber-600 text-white font-bold shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:text-amber-900 hover:bg-amber-50 border border-slate-200'
            }`}
          >
            ⚡ Energie & Netbeheer
          </button>
          <button
            onClick={() => setActiveSectorFilter('OVERHEID')}
            className={`px-3 py-1.5 min-h-[38px] rounded-xl shrink-0 transition-all cursor-pointer font-semibold ${
              activeSectorFilter === 'OVERHEID'
                ? 'bg-rose-600 text-white font-bold shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:text-rose-900 hover:bg-rose-50 border border-slate-200'
            }`}
          >
            🏛️ Overheid & Defensie
          </button>
          <button
            onClick={() => setActiveSectorFilter('VOEDSEL')}
            className={`px-3 py-1.5 min-h-[38px] rounded-xl shrink-0 transition-all cursor-pointer font-semibold ${
              activeSectorFilter === 'VOEDSEL'
                ? 'bg-orange-600 text-white font-bold shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:text-orange-900 hover:bg-orange-50 border border-slate-200'
            }`}
          >
            🛒 Voedsel / Albert Heijn
          </button>
          <button
            onClick={() => setActiveSectorFilter('HIGHTECH')}
            className={`px-3 py-1.5 min-h-[38px] rounded-xl shrink-0 transition-all cursor-pointer font-semibold ${
              activeSectorFilter === 'HIGHTECH'
                ? 'bg-purple-700 text-white font-bold shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:text-purple-900 hover:bg-purple-50 border border-slate-200'
            }`}
          >
            🔬 Hightech & Chips
          </button>
        </div>

        {/* Recharts Area Chart */}
        <div className="h-[340px] sm:h-[400px] w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={filteredHourlyData}
              margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorHaven" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284c7" stopOpacity={0.55} />
                  <stop offset="95%" stopColor="#0284c7" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="colorEnergie" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d97706" stopOpacity={0.55} />
                  <stop offset="95%" stopColor="#d97706" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="colorOverheid" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e11d48" stopOpacity={0.55} />
                  <stop offset="95%" stopColor="#e11d48" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="colorTelecom" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="colorVoedsel" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ea580c" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#ea580c" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="colorHightech" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e11d48" stopOpacity={0.7} />
                  <stop offset="95%" stopColor="#e11d48" stopOpacity={0.1} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />

              <XAxis
                dataKey="hour"
                stroke="#94a3b8"
                tick={{ fill: '#475569', fontSize: 12 }}
                tickLine={{ stroke: '#cbd5e1' }}
              />

              <YAxis
                stroke="#94a3b8"
                tick={{ fill: '#475569', fontSize: 12 }}
                tickLine={{ stroke: '#cbd5e1' }}
              />

              <Tooltip content={<CustomChartTooltip />} />

              <Legend
                wrapperStyle={{ paddingTop: '14px', fontSize: '12px', color: '#334155' }}
              />

              {/* Render either single focused sector or all layers */}
              {activeSectorFilter === 'ALL' || activeSectorFilter === 'HAVEN' ? (
                <Area
                  type="monotone"
                  dataKey="haven"
                  name="Haven & Maritiem"
                  stroke="#0284c7"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorHaven)"
                  stackId={metricView === 'STACKED' ? '1' : undefined}
                />
              ) : null}

              {activeSectorFilter === 'ALL' || activeSectorFilter === 'ENERGIE' ? (
                <Area
                  type="monotone"
                  dataKey="energie"
                  name="Energie & Netbeheer"
                  stroke="#d97706"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorEnergie)"
                  stackId={metricView === 'STACKED' ? '1' : undefined}
                />
              ) : null}

              {activeSectorFilter === 'ALL' || activeSectorFilter === 'OVERHEID' ? (
                <Area
                  type="monotone"
                  dataKey="overheid"
                  name="Overheid & Defensie"
                  stroke="#e11d48"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorOverheid)"
                  stackId={metricView === 'STACKED' ? '1' : undefined}
                />
              ) : null}

              {activeSectorFilter === 'ALL' ? (
                <Area
                  type="monotone"
                  dataKey="telecom"
                  name="Telecom & AMS-IX"
                  stroke="#4f46e5"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorTelecom)"
                  stackId={metricView === 'STACKED' ? '1' : undefined}
                />
              ) : null}

              {activeSectorFilter === 'ALL' || activeSectorFilter === 'VOEDSEL' ? (
                <Area
                  type="monotone"
                  dataKey="voedsel"
                  name="Voedsel & Retail (AH)"
                  stroke="#ea580c"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorVoedsel)"
                  stackId={metricView === 'STACKED' ? '1' : undefined}
                />
              ) : null}

              {activeSectorFilter === 'ALL' || activeSectorFilter === 'HIGHTECH' ? (
                <Area
                  type="monotone"
                  dataKey="hightech"
                  name="Hightech & Chips"
                  stroke="#7c3aed"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorHightech)"
                  stackId={metricView === 'STACKED' ? '1' : undefined}
                />
              ) : null}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Emerging Attack Patterns Section - Proactive CTI Alerts */}
      <div className="space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-700">
              <AlertTriangle className="w-4 h-4" />
            </span>
            <h3 className="font-extrabold text-slate-900 text-base sm:text-lg tracking-tight">
              Gedetecteerde Opkomende Aanvalspatronen & Anomalieën
            </h3>
          </div>
          <span className="text-xs text-slate-600 hidden sm:inline">
            Geanalyseerd door NCSC-NL / CSIRT correlatie-engines
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {emergingPatterns.map((pat) => (
            <div
              key={pat.id}
              className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-4 sm:p-5 transition-all shadow-sm flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="inline-block bg-rose-50 text-rose-800 text-xs font-mono-code font-bold px-2.5 py-0.5 rounded border border-rose-200 mb-1.5">
                      {pat.velocity}
                    </span>
                    <h4 className="font-bold text-slate-900 text-base leading-snug">
                      {pat.title}
                    </h4>
                  </div>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded uppercase font-mono-code shrink-0 ${
                      pat.severity === 'KRITIEK'
                        ? 'bg-rose-600 text-white'
                        : 'bg-amber-600 text-white'
                    }`}
                  >
                    {pat.severity}
                  </span>
                </div>

                <p className="text-sm text-slate-700 mt-2 leading-relaxed">
                  {pat.description}
                </p>

                <div className="mt-3 space-y-1.5 text-xs border-t border-slate-200 pt-2.5 text-slate-600">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-slate-500">Statelijke Oorsprong:</span>
                    <span className="font-semibold text-slate-900 text-right">{pat.origin} • {pat.actor}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-slate-500">Aanvalsvector:</span>
                    <span className="font-mono-code text-xs text-amber-800 font-semibold truncate max-w-[230px]">
                      {pat.vector}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-slate-500">Doelwitten:</span>
                    <span className="text-slate-800 font-medium truncate max-w-[230px]">
                      {pat.target}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2.5 flex items-center justify-between border-t border-slate-200 text-xs">
                <button
                  onClick={() => {
                    const found = threats.find((t) => t.id === pat.threatRefId) || threats[0];
                    if (found) onSelectThreatForDetail(found);
                  }}
                  className="inline-flex items-center gap-1 min-h-[38px] px-2 -ml-2 text-rose-700 hover:text-rose-900 font-bold transition-colors cursor-pointer"
                >
                  <span>Lees volledig dossier & TTPs</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onSelectSector(pat.sectorId)}
                  className="min-h-[38px] px-2 text-slate-600 hover:text-slate-900 font-semibold transition-colors cursor-pointer text-xs"
                >
                  Filter op sector →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Secondary Visualizations: Sector Comparison & Threat Actor Attribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* BarChart: 24h Attack Volume by Sector */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-600" />
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                24u Incidenten per Vitale Sector (Kritiek vs Hoog)
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-mono-code font-semibold">NIS2 NL</span>
          </div>

          <div className="h-[290px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={SECTOR_24H_AGGREGATE}
                layout="vertical"
                margin={{ top: 5, right: 15, left: 35, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" stroke="#94a3b8" tick={{ fill: '#475569', fontSize: 12 }} />
                <YAxis
                  dataKey="name"
                  type="category"
                  stroke="#94a3b8"
                  tick={{ fill: '#334155', fontSize: 11, fontWeight: 500 }}
                  width={120}
                />
                <Tooltip
                  formatter={(value: any, name: any) => [
                    `${value} incidenten`,
                    name === 'critical' ? 'Kritiek Ernst' : name === 'high' ? 'Hoog Risico' : 'Totaal',
                  ]}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#cbd5e1',
                    color: '#0f172a',
                    borderRadius: '10px',
                    fontSize: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                  }}
                />
                <Bar dataKey="critical" name="Kritiek Ernst" fill="#e11d48" stackId="a" radius={[0, 0, 0, 0]} />
                <Bar dataKey="high" name="Hoog Risico" fill="#d97706" stackId="a" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PieChart: Origin Breakdown & Attack Vectors */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-600" />
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Statelijke Attributie & Aanvalsvectoren (24u)
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-mono-code font-semibold">CSIRT Intel</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-2">
            {/* Donut Chart */}
            <div className="h-[210px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ORIGIN_DISTRIBUTION}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {ORIGIN_DISTRIBUTION.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any, name: any) => [`${value}% aandeel`, name]}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#cbd5e1',
                      color: '#0f172a',
                      borderRadius: '10px',
                      fontSize: '12px',
                      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Origin List breakdown */}
            <div className="space-y-2 text-xs">
              {ORIGIN_DISTRIBUTION.map((orig) => (
                <div key={orig.name} className="flex items-center justify-between text-slate-700">
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: orig.color }} />
                    <span className="truncate font-medium">{orig.flag} {orig.name.split(' (')[0]}</span>
                  </div>
                  <span className="font-mono-code font-bold text-slate-900 shrink-0">{orig.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Primary Vectors Strip */}
          <div className="pt-3 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            {VECTOR_DISTRIBUTION.map((vec) => (
              <div key={vec.name} className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <div className="font-mono-code font-bold text-sm text-slate-900">{vec.value}%</div>
                <div className="text-xs text-slate-600 truncate mt-0.5" title={vec.name}>
                  {vec.name.split(' & ')[0]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Further Reading & Navigation Cards */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <h4 className="text-sm sm:text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
          <span>📚</span>
          <span>Verder Lezen & Directe Acties per Dossier</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <button
            onClick={() => onNavigateToTab('NL_VITALE_INFRA')}
            className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-amber-400 text-left transition-all hover:bg-amber-50/60 group cursor-pointer"
          >
            <div className="font-bold text-amber-800 group-hover:text-amber-900 flex items-center justify-between text-sm">
              <span>Nederlandse Vitale Infra</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
            <p className="text-slate-600 text-xs mt-1 leading-relaxed">
              Bekijk alle 12 NIS2-sectoren, actuele incidentstatussen en operationele mitigatieplannen.
            </p>
          </button>

          <button
            onClick={() => onNavigateToTab('DREIGINGSACTOREN')}
            className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-rose-400 text-left transition-all hover:bg-rose-50/60 group cursor-pointer"
          >
            <div className="font-bold text-rose-800 group-hover:text-rose-900 flex items-center justify-between text-sm">
              <span>Statelijke Actoren Dossiers</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
            <p className="text-slate-600 text-xs mt-1 leading-relaxed">
              Diepgaande inlichtingenprofielen over Rusland (Sandworm), China (Volt Typhoon), Noord-Korea en Iran.
            </p>
          </button>

          <button
            onClick={() => onNavigateToTab('IOC_DATABASE')}
            className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-sky-400 text-left transition-all hover:bg-sky-50/60 group cursor-pointer"
          >
            <div className="font-bold text-sky-800 group-hover:text-sky-900 flex items-center justify-between text-sm">
              <span>IoC & CVE Database</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
            <p className="text-slate-600 text-xs mt-1 leading-relaxed">
              Download Yara regels, SHA256 hashes, C2 IP-adressen en actieve CVE-exploits voor uw SIEM/SOC.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};
