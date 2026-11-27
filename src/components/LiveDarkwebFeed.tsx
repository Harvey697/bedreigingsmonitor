import React, { useState } from 'react';
import {
  Skull,
  Search,
  Filter,
  Flame,
  Globe2,
  Clock,
  Coins,
  HardDrive,
  FileCode,
  ShieldCheck,
  ExternalLink,
  Sparkles,
  ChevronRight,
  AlertTriangle,
  Eye,
  Radio,
  RefreshCw,
} from 'lucide-react';
import { ThreatItem, ThreatOrigin, VitalSectorNL } from '../types/threat';
import { VITAL_SECTORS_NL } from '../data/threatData';

interface LiveDarkwebFeedProps {
  threats: ThreatItem[];
  selectedSector: VitalSectorNL | 'ALL';
  onSelectSector?: (sector: VitalSectorNL | 'ALL') => void;
  onSelectThreatForAi: (threat: ThreatItem) => void;
  onOpenDetailsModal: (threat: ThreatItem) => void;
  lastLiveSyncTime?: string;
  isSyncingLiveFeeds?: boolean;
  onSyncLiveFeeds?: () => void;
}

export const LiveDarkwebFeed: React.FC<LiveDarkwebFeedProps> = ({
  threats,
  selectedSector,
  onSelectSector,
  onSelectThreatForAi,
  onOpenDetailsModal,
  lastLiveSyncTime,
  isSyncingLiveFeeds = false,
  onSyncLiveFeeds,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [originFilter, setOriginFilter] = useState<'ALL' | 'ALBERT_HEIJN' | 'RUSLAND' | 'CHINA' | 'NOORD_KOREA' | 'IRAN' | 'DARKWEB_SYNDICAAT' | 'NL_ONLY'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'NIS2' | 'GENERAL'>('ALL');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(8);

  const isNis2Threat = (threat: ThreatItem): boolean => {
    return threat.isDutchVitalInfra || (threat.targetSector !== 'EUROPA_BREED' && threat.targetSector !== 'INTERNATIONAAL');
  };

  const getSectorLabel = (sector: string): string => {
    switch (sector) {
      case 'HAVEN_EN_LOGISTIEK':
        return 'Haven & Maritiem (Rotterdam)';
      case 'ENERGIE_EN_NETBEHEER':
        return 'Energie & Gas (TenneT)';
      case 'WATERBEHEER_EN_DIJKEN':
        return 'Waterkeringen & Dijken';
      case 'TELECOM_EN_INTERNET':
        return 'Telecom & Datacenters (AMS-IX)';
      case 'ZORG_EN_ZIEKENHUIZEN':
        return 'Zorg & Ziekenhuizen';
      case 'FINANCIELE_SECTOR':
        return 'Financiën & Betaalverkeer (iDEAL)';
      case 'RIJKSOVERHEID_EN_DEFENSIE':
        return 'Rijksoverheid & Defensie (DigiD)';
      case 'VOEDSEL_EN_AGRO':
        return 'Voedsel & Supermarkten (Albert Heijn)';
      case 'TRANSPORT_EN_LUCHTVAART':
        return 'Transport & Luchtvaart (Schiphol)';
      case 'HIGHTECH_EN_CHIPS':
        return 'High-Tech & Chips (ASML)';
      case 'CHEMIE_EN_INDUSTRIE':
        return 'Chemie & Petrochemie (Chemelot)';
      case 'ONDERWIJS_EN_WETENSCHAP':
        return 'Onderwijs & Universiteiten (SURF)';
      default:
        return sector.replace(/_/g, ' ');
    }
  };

  const getSectorEmoji = (sectorId: string): string => {
    switch (sectorId) {
      case 'HAVEN_EN_LOGISTIEK': return '⚓';
      case 'ENERGIE_EN_NETBEHEER': return '⚡';
      case 'WATERBEHEER_EN_DIJKEN': return '🌊';
      case 'TELECOM_EN_INTERNET': return '📡';
      case 'ZORG_EN_ZIEKENHUIZEN': return '🏥';
      case 'FINANCIELE_SECTOR': return '💳';
      case 'RIJKSOVERHEID_EN_DEFENSIE': return '🛡️';
      case 'VOEDSEL_EN_AGRO': return '🛒';
      case 'TRANSPORT_EN_LUCHTVAART': return '✈️';
      case 'HIGHTECH_EN_CHIPS': return '🔬';
      case 'CHEMIE_EN_INDUSTRIE': return '🧪';
      case 'ONDERWIJS_EN_WETENSCHAP': return '🎓';
      default: return '🏢';
    }
  };

  // Filter threats
  const filteredThreats = threats.filter((threat) => {
    // NIS2 vs Algemene Cyberaanvallen filter
    if (categoryFilter === 'NIS2' && !isNis2Threat(threat)) {
      return false;
    }
    if (categoryFilter === 'GENERAL' && isNis2Threat(threat)) {
      return false;
    }

    // Sector filter
    if (selectedSector !== 'ALL' && threat.targetSector !== selectedSector) {
      return false;
    }

    // Origin / Focus filter
    if (originFilter === 'ALBERT_HEIJN') {
      const matchAH =
        threat.targetVictim.toLowerCase().includes('albert heijn') ||
        threat.title.toLowerCase().includes('albert heijn') ||
        threat.description.toLowerCase().includes('albert heijn') ||
        threat.targetSector === 'VOEDSEL_EN_AGRO';
      if (!matchAH) return false;
    }
    if (originFilter === 'RUSLAND' && threat.origin !== 'RUSLAND') return false;
    if (originFilter === 'CHINA' && threat.origin !== 'CHINA') return false;
    if (originFilter === 'NOORD_KOREA' && threat.origin !== 'NOORD_KOREA') return false;
    if (originFilter === 'IRAN' && threat.origin !== 'IRAN') return false;
    if (originFilter === 'DARKWEB_SYNDICAAT' && threat.origin !== 'DARKWEB_SYNDICAAT') return false;
    if (originFilter === 'NL_ONLY' && !threat.isDutchVitalInfra) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = threat.title.toLowerCase().includes(q);
      const matchActor = threat.threatActor.toLowerCase().includes(q);
      const matchVictim = threat.targetVictim.toLowerCase().includes(q);
      const matchVector = threat.attackVector.toLowerCase().includes(q);
      const matchDesc = threat.description.toLowerCase().includes(q);
      const matchSector = threat.targetSector ? getSectorLabel(threat.targetSector).toLowerCase().includes(q) : false;
      return matchTitle || matchActor || matchVictim || matchVector || matchDesc || matchSector;
    }

    return true;
  });

  const dutchThreatsCount = threats.filter((t) => t.isDutchVitalInfra).length;
  const nis2ThreatsCount = threats.filter(isNis2Threat).length;
  const generalThreatsCount = threats.filter((t) => !isNis2Threat(t)).length;

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'KRITIEK':
        return 'bg-rose-50 text-rose-800 border-rose-200 font-bold';
      case 'HOOG':
        return 'bg-amber-50 text-amber-900 border-amber-200 font-bold';
      case 'VERHOOGD':
        return 'bg-yellow-50 text-yellow-900 border-yellow-200 font-semibold';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'AFTELLEN_PUBLICATIE':
        return 'bg-rose-50 text-rose-800 border-rose-200 font-semibold';
      case 'ACTIEF_LEK':
        return 'bg-orange-50 text-orange-800 border-orange-200 font-semibold';
      case 'IN_BEHANDELING_NCSC':
        return 'bg-amber-50 text-amber-900 border-amber-200 font-semibold';
      case 'GEPUBLICEERD':
        return 'bg-purple-50 text-purple-800 border-purple-200 font-semibold';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm">
      {/* Header with Search and Filter bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-200 gap-3 sm:gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-rose-50 text-rose-700 border border-rose-200">
              <Radio className="w-4 h-4 animate-pulse" />
            </span>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
              Live Dark Web Ransomware Feed &amp; Lek-Scanner
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Realtime ontdekking van .onion afpersingspagina&apos;s, slachtoffers en staatsgerichte cyberaanvallen
          </p>
        </div>

        {/* Search & Live Sync */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
          {onSyncLiveFeeds && (
            <button
              type="button"
              onClick={onSyncLiveFeeds}
              disabled={isSyncingLiveFeeds}
              className="flex items-center justify-center gap-1.5 min-h-[42px] sm:min-h-[38px] px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-xs sm:text-sm font-bold transition-colors shadow-xs cursor-pointer shrink-0"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncingLiveFeeds ? 'animate-spin' : ''}`} />
              <span>
                {isSyncingLiveFeeds
                  ? 'Live Ophalen...'
                  : `Live Sync${lastLiveSyncTime ? ` (${lastLiveSyncTime})` : ''}`}
              </span>
            </button>
          )}
          <div className="relative w-full md:w-auto md:min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Zoek sector, slachtoffer (ASML, AH, Schiphol)..."
              className="w-full min-h-[42px] sm:min-h-[38px] bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:border-emerald-600 focus:bg-white transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Primary Directive Filter: NIS2 vs Algemene Cyberaanvallen */}
      <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono-code font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5 mr-0.5">
            <Filter className="w-3.5 h-3.5 text-rose-600" />
            <span>Classificatie:</span>
          </span>

          <button
            onClick={() => setCategoryFilter('ALL')}
            className={`min-h-[38px] px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
              categoryFilter === 'ALL'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>Alle Aanvallen</span>
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full font-mono-code ${
                categoryFilter === 'ALL' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              {threats.length}
            </span>
          </button>

          <button
            onClick={() => {
              setCategoryFilter('NIS2');
            }}
            className={`min-h-[38px] px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
              categoryFilter === 'NIS2'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-emerald-800 hover:bg-emerald-50 border border-emerald-200'
            }`}
          >
            <ShieldCheck className={`w-4 h-4 ${categoryFilter === 'NIS2' ? 'text-white' : 'text-emerald-600'}`} />
            <span>NIS2 Vitale Sectoren</span>
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full font-mono-code ${
                categoryFilter === 'NIS2'
                  ? 'bg-white/20 text-white'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              }`}
            >
              {nis2ThreatsCount}
            </span>
          </button>

          <button
            onClick={() => {
              setCategoryFilter('GENERAL');
              if (onSelectSector) onSelectSector('ALL');
              if (originFilter === 'NL_ONLY') setOriginFilter('ALL');
            }}
            className={`min-h-[38px] px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
              categoryFilter === 'GENERAL'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-indigo-800 hover:bg-indigo-50 border border-indigo-200'
            }`}
          >
            <Globe2 className={`w-4 h-4 ${categoryFilter === 'GENERAL' ? 'text-white' : 'text-indigo-600'}`} />
            <span>Algemene Cyberaanvallen</span>
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full font-mono-code ${
                categoryFilter === 'GENERAL'
                  ? 'bg-white/20 text-white'
                  : 'bg-indigo-50 text-indigo-800 border border-indigo-200'
              }`}
            >
              {generalThreatsCount}
            </span>
          </button>
        </div>

        <div className="text-xs text-slate-600 font-mono-code flex items-center gap-1.5 ml-auto sm:ml-0">
          <span>Weergave:</span>
          <span className="text-slate-900 font-bold px-2.5 py-1 rounded-lg bg-white border border-slate-200">
            {filteredThreats.length} van {threats.length}
          </span>
        </div>
      </div>

      {/* Category Filter Active Banner */}
      {categoryFilter === 'GENERAL' && (
        <div className="mt-3 p-3 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-indigo-600 shrink-0" />
            <span className="text-indigo-950">
              Gefilterd op <strong>Algemene Cyberaanvallen</strong>: Commerciële datalekken, consumentenplatforms en internationale phishing-campagnes buiten vitale EU NIS2-richtlijn.
            </span>
          </div>
          <button
            onClick={() => setCategoryFilter('ALL')}
            className="px-2.5 py-1 rounded-lg bg-white hover:bg-indigo-100 text-indigo-800 border border-indigo-200 font-mono-code text-xs font-semibold shrink-0 cursor-pointer"
          >
            Reset
          </button>
        </div>
      )}

      {categoryFilter === 'NIS2' && (
        <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
            <span className="text-emerald-950">
              Gefilterd op <strong>NIS2 Richtlijn (Vitale Sectoren)</strong>: Uitsluitend beschermde essentiële en belangrijke sectoren conform NCSC-NL en EU NIS2.
            </span>
          </div>
          <button
            onClick={() => setCategoryFilter('ALL')}
            className="px-2.5 py-1 rounded-lg bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-mono-code text-xs font-semibold shrink-0 cursor-pointer"
          >
            Reset
          </button>
        </div>
      )}

      {/* Filter Tabs - Top Origin & Priority Level */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5 max-w-full sm:flex-wrap">
          <button
            onClick={() => {
              setOriginFilter('ALL');
              if (onSelectSector) onSelectSector('ALL');
            }}
            className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
              originFilter === 'ALL' && selectedSector === 'ALL'
                ? 'bg-rose-600 text-white shadow-2xs'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Alle Feeds ({threats.length})
          </button>
          <button
            onClick={() => {
              setOriginFilter('NL_ONLY');
              if (onSelectSector) onSelectSector('ALL');
            }}
            className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 ${
              originFilter === 'NL_ONLY' && selectedSector === 'ALL'
                ? 'bg-amber-600 text-white shadow-2xs font-bold'
                : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            <span>🇳🇱</span> Nederland Alle Sectoren ({dutchThreatsCount})
          </button>
          <button
            onClick={() => {
              setOriginFilter('ALBERT_HEIJN');
              if (onSelectSector) onSelectSector('ALL');
            }}
            className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 ${
              originFilter === 'ALBERT_HEIJN'
                ? 'bg-sky-600 text-white shadow-2xs font-bold'
                : 'bg-sky-50 text-sky-900 hover:bg-sky-100 border border-sky-200'
            }`}
          >
            <span>🛒</span> Albert Heijn &amp; Supermarkten
          </button>
          <button
            onClick={() => setOriginFilter('RUSLAND')}
            className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 ${
              originFilter === 'RUSLAND'
                ? 'bg-rose-600 text-white'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>🇷🇺</span> Rusland APT
          </button>
          <button
            onClick={() => setOriginFilter('CHINA')}
            className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 ${
              originFilter === 'CHINA'
                ? 'bg-amber-600 text-white'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>🇨🇳</span> China APT
          </button>
          <button
            onClick={() => setOriginFilter('NOORD_KOREA')}
            className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 ${
              originFilter === 'NOORD_KOREA'
                ? 'bg-red-600 text-white'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>🇰🇵</span> Noord-Korea APT
          </button>
          <button
            onClick={() => setOriginFilter('IRAN')}
            className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 ${
              originFilter === 'IRAN'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>🇮🇷</span> Iran APT
          </button>
          <button
            onClick={() => setOriginFilter('DARKWEB_SYNDICAAT')}
            className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 ${
              originFilter === 'DARKWEB_SYNDICAAT'
                ? 'bg-purple-600 text-white'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>🏴‍☠️</span> Dark Web RaaS
          </button>
        </div>

        <div className="text-xs text-slate-600 font-mono-code">
          Gevonden: <strong className="text-slate-900">{filteredThreats.length}</strong> incidenten
        </div>
      </div>

      {/* Expanded Dutch Vital Sectors Quick Filter Toolbar */}
      <div className="mt-3 pt-2 pb-3 border-b border-slate-200">
        <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono-code font-bold text-amber-800 flex items-center gap-1.5 uppercase tracking-wider">
              <span>🇳🇱</span> Nederland Sectoren Filter:
            </span>
            <span className="text-xs text-slate-500 font-mono-code">
              (12 NIS2 vitale categorieën)
            </span>
          </div>

          {(selectedSector !== 'ALL' || originFilter === 'NL_ONLY') && (
            <button
              onClick={() => {
                if (onSelectSector) onSelectSector('ALL');
                setOriginFilter('ALL');
              }}
              className="text-xs font-semibold text-rose-700 hover:text-rose-900 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>✕ Reset sectorfilter</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1 max-w-full sm:flex-wrap">
          <button
            onClick={() => {
              setOriginFilter('NL_ONLY');
              if (onSelectSector) onSelectSector('ALL');
            }}
            className={`min-h-[36px] px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer ${
              selectedSector === 'ALL' && originFilter === 'NL_ONLY'
                ? 'bg-amber-600 text-white font-bold'
                : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            <span>🇳🇱</span> Alle NL Sectoren
            <span className={`text-xs px-1.5 py-0.5 rounded font-mono-code ${
              selectedSector === 'ALL' && originFilter === 'NL_ONLY'
                ? 'bg-white/20 text-white'
                : 'bg-white text-amber-900 border border-amber-200'
            }`}>
              {dutchThreatsCount}
            </span>
          </button>

          {VITAL_SECTORS_NL.map((sector) => {
            const isSelected = selectedSector === sector.id;
            const count = threats.filter((t) => t.targetSector === sector.id).length;
            return (
              <button
                key={sector.id}
                onClick={() => {
                  if (onSelectSector) {
                    onSelectSector(isSelected ? 'ALL' : sector.id);
                  }
                  if (originFilter === 'NL_ONLY') {
                    setOriginFilter('ALL');
                  }
                }}
                className={`min-h-[36px] px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-rose-600 text-white font-bold'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span>{getSectorEmoji(sector.id)}</span>
                <span className="truncate max-w-[170px]">{sector.name.split('(')[0].trim()}</span>
                <span
                  className={`text-xs px-1.5 py-0.5 rounded font-mono-code ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : count > 0
                      ? 'bg-rose-50 text-rose-800 border border-rose-200'
                      : 'bg-white text-slate-500 border border-slate-200'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Sector Banner */}
      {selectedSector !== 'ALL' && (
        <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <span className="text-base">{getSectorEmoji(selectedSector)}</span>
            <span className="text-amber-950">
              Gefilterd op Nederlandse sector:{' '}
              <strong className="font-bold">{getSectorLabel(selectedSector)}</strong>{' '}
              ({filteredThreats.length} actieve dreigingen gevonden)
            </span>
          </div>
          <button
            onClick={() => onSelectSector && onSelectSector('ALL')}
            className="px-2.5 py-1 rounded-lg bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 font-mono-code text-xs font-semibold cursor-pointer"
          >
            Wis sectorfilter
          </button>
        </div>
      )}

      {/* Top Pagination & Page Size Bar */}
      {filteredThreats.length > 0 && (() => {
        const totalPages = Math.max(1, Math.ceil(filteredThreats.length / itemsPerPage));
        const safePage = Math.min(currentPage, totalPages);
        const startIdx = (safePage - 1) * itemsPerPage + 1;
        const endIdx = Math.min(safePage * itemsPerPage, filteredThreats.length);
        return (
          <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs sm:text-sm">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono-code font-bold text-rose-800 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-lg">
                Pagina {safePage} van {totalPages}
              </span>
              <span className="text-slate-600">
                Melding <strong className="text-slate-900">{startIdx}–{endIdx}</strong> van{' '}
                <strong className="text-slate-900">{filteredThreats.length}</strong> incidenten
              </span>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                disabled={safePage <= 1}
                onClick={() => setCurrentPage(Math.max(1, safePage - 1))}
                className="min-h-[38px] px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 disabled:opacity-40 text-slate-800 border border-slate-300 font-semibold cursor-pointer"
              >
                ← Vorige
              </button>
              {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  className={`min-w-[36px] min-h-[36px] rounded-lg font-mono-code font-bold transition-colors cursor-pointer ${
                    pageNum === safePage
                      ? 'bg-rose-600 text-white shadow-2xs'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  {pageNum}
                </button>
              ))}
              <button
                type="button"
                disabled={safePage >= totalPages}
                onClick={() => setCurrentPage(Math.min(totalPages, safePage + 1))}
                className="min-h-[38px] px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 disabled:opacity-40 text-slate-800 border border-slate-300 font-semibold cursor-pointer"
              >
                Volgende →
              </button>

              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="ml-1 min-h-[38px] bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-mono-code focus:outline-none"
                title="Aantal meldingen per pagina"
              >
                <option value={6}>6 / pagina</option>
                <option value={8}>8 / pagina</option>
                <option value={15}>15 / pagina</option>
                <option value={999}>Alles op 1 pagina</option>
              </select>
            </div>
          </div>
        );
      })()}

      {/* Threats Feed Cards List */}
      <div className="mt-4 space-y-4">
        {filteredThreats.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200 text-slate-600 text-sm">
            Geen dreigingen gevonden voor de geselecteerde sector(en). Probeer een andere sector of reset het filter.
          </div>
        ) : (
          filteredThreats
            .slice(
              (Math.min(currentPage, Math.max(1, Math.ceil(filteredThreats.length / itemsPerPage))) - 1) * itemsPerPage,
              Math.min(currentPage, Math.max(1, Math.ceil(filteredThreats.length / itemsPerPage))) * itemsPerPage
            )
            .map((threat) => (
            <div
              key={threat.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all shadow-2xs hover:shadow-sm ${
                threat.severity === 'KRITIEK'
                  ? 'bg-rose-50/30 border-rose-200 hover:border-rose-300'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Card top row */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`text-xs font-mono-code px-2.5 py-0.5 rounded-md border ${getSeverityBadge(
                      threat.severity
                    )}`}
                  >
                    {threat.severity}
                  </span>

                  <span className="text-xs sm:text-sm font-bold text-slate-700 flex items-center gap-1.5">
                    <span>{threat.originFlag}</span>
                    <span className="text-slate-900">{threat.threatActor}</span>
                  </span>

                  <span className="text-slate-300">·</span>

                  <span
                    className={`text-xs font-mono-code px-2 py-0.5 rounded-md border ${getStatusBadge(
                      threat.leakStatus
                    )}`}
                  >
                    {threat.leakStatus.replace(/_/g, ' ')}
                  </span>

                  {isNis2Threat(threat) ? (
                    <span className="text-xs font-mono-code font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>NIS2 VITAAL</span>
                    </span>
                  ) : (
                    <span className="text-xs font-mono-code font-bold bg-indigo-50 text-indigo-800 border border-indigo-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Globe2 className="w-3.5 h-3.5 text-indigo-600" />
                      <span>ALGEMENE AANVAL</span>
                    </span>
                  )}

                  {threat.isDutchVitalInfra && (
                    <span className="text-xs font-mono-code font-bold bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-md">
                      🇳🇱 VITALE INFRASTRUCTUUR
                    </span>
                  )}

                  {threat.targetSector && (
                    <button
                      onClick={() => onSelectSector && onSelectSector(threat.targetSector as VitalSectorNL)}
                      className="text-xs font-mono-code font-bold bg-slate-100 text-sky-900 border border-slate-200 hover:border-sky-400 hover:bg-sky-50 px-2.5 py-0.5 rounded-md flex items-center gap-1 transition-colors cursor-pointer"
                      title="Klik om te filteren op deze sector"
                    >
                      <span>{getSectorEmoji(threat.targetSector)}</span>
                      <span>{getSectorLabel(threat.targetSector)}</span>
                    </button>
                  )}

                  {(threat.targetVictim.toLowerCase().includes('albert heijn') || threat.title.toLowerCase().includes('albert heijn')) && (
                    <span className="text-xs font-mono-code font-bold bg-sky-50 text-sky-900 border border-sky-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                      🛒 ALBERT HEIJN SUPPLY CHAIN
                    </span>
                  )}

                  <span className="text-xs font-mono-code font-bold bg-rose-50 text-rose-800 border border-rose-200 px-2 py-0.5 rounded-md flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
                    </span>
                    {threat.realtimeStatus === 'AANVAL_NU_ACTIEF' ? 'LIVE AANVAL ACTIEF' :
                     threat.realtimeStatus === 'DATA_EXFILTRATIE_LIVE' ? 'EXFILTRATIE BEZIG' :
                     threat.realtimeStatus === 'ENCRYPTIE_IN_UITVOERING' ? 'ENCRYPTIE ACTIEF' : 'C2 LIVE'}
                  </span>
                </div>

                {/* Explicit Date and Time display */}
                <div className="flex items-center gap-2 text-xs font-mono-code text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                  <span className="text-amber-800 font-bold flex items-center gap-1">
                    📅 {threat.attackDate || 'Actueel'}
                  </span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-700 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    {threat.attackTime || threat.timestamp}
                  </span>
                </div>
              </div>

              {/* Title & Target Details */}
              <div className="mt-3">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="text-xs font-mono-code font-semibold px-2 py-0.5 rounded bg-rose-50 border border-rose-200 text-rose-800">
                    REALTIME DOELWIT
                  </span>
                  {threat.liveTelemetryMetrics?.packetsPerSec && (
                    <span className="text-xs font-mono-code text-sky-900 bg-sky-50 px-2 py-0.5 rounded border border-sky-200 font-semibold">
                      Telemetrie: {threat.liveTelemetryMetrics.packetsPerSec}
                    </span>
                  )}
                </div>
                <h3
                  className="text-base sm:text-lg font-extrabold text-slate-900 hover:text-rose-700 transition-colors cursor-pointer leading-snug"
                  onClick={() => onOpenDetailsModal(threat)}
                >
                  {threat.title}
                </h3>

                <p className="mt-2 text-sm text-slate-700 line-clamp-3 leading-relaxed">
                  {threat.description}
                </p>
              </div>

              {/* Technical indicators strip */}
              <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] text-slate-500 block font-mono-code uppercase font-semibold">DOELWIT / SECTOR</span>
                  <span className="font-bold text-slate-900 truncate block text-xs sm:text-sm mt-0.5">
                    {threat.targetVictim}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] text-slate-500 block font-mono-code uppercase font-semibold">AANVALSVECTOR</span>
                  <span className="font-mono-code text-rose-700 truncate block text-xs sm:text-sm font-semibold mt-0.5">
                    {threat.attackVector}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] text-slate-500 block font-mono-code uppercase font-semibold">DARKWEB .ONION ADRES</span>
                  <span className="font-mono-code text-purple-800 truncate block text-xs sm:text-sm font-semibold mt-0.5">
                    {threat.darkwebOnionSite || 'N.v.t. (Spionage/Wiper)'}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] text-slate-500 block font-mono-code uppercase font-semibold">LOSGELD / VOLUME</span>
                  <span className="font-mono-code text-amber-800 truncate block text-xs sm:text-sm font-semibold mt-0.5">
                    {threat.ransomDemanded || threat.dataVolume || 'Onbekend'}
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-4 pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="flex items-center gap-2 text-xs text-slate-600 font-mono-code flex-wrap">
                  <span>Locatie: <strong className="text-slate-900">{threat.targetLocation}</strong></span>
                  {threat.verifiedByCsirt && (
                    <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                      <ShieldCheck className="w-4 h-4" /> Geverifieerd CSIRT
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => onOpenDetailsModal(threat)}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 min-h-[42px] sm:min-h-[36px] px-3.5 py-2 sm:py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs sm:text-sm font-bold transition-colors border border-slate-300 cursor-pointer"
                  >
                    <Eye className="w-4 h-4 text-sky-700" />
                    <span>Details &amp; Dossier</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onSelectThreatForAi(threat)}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 min-h-[42px] sm:min-h-[36px] px-3.5 py-2 sm:py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold transition-colors shadow-xs cursor-pointer"
                    title="Genereer instant AI incident advies"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>NCSC AI Analyse</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bottom Pagination Bar */}
      {filteredThreats.length > itemsPerPage && (() => {
        const totalPages = Math.max(1, Math.ceil(filteredThreats.length / itemsPerPage));
        const safePage = Math.min(currentPage, totalPages);
        return (
          <div className="mt-4 pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs sm:text-sm">
            <span className="text-slate-600 font-mono-code">
              Pagina <strong className="text-slate-900">{safePage}</strong> van <strong className="text-slate-900">{totalPages}</strong> ({filteredThreats.length} incidenten totaal)
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                disabled={safePage <= 1}
                onClick={() => setCurrentPage(Math.max(1, safePage - 1))}
                className="min-h-[40px] sm:min-h-[36px] px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 disabled:opacity-40 text-slate-800 border border-slate-300 font-semibold cursor-pointer"
              >
                ← Vorige Pagina
              </button>
              {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  className={`min-w-[36px] min-h-[36px] rounded-xl font-mono-code font-bold transition-colors cursor-pointer ${
                    pageNum === safePage
                      ? 'bg-rose-600 text-white shadow-2xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  {pageNum}
                </button>
              ))}
              <button
                type="button"
                disabled={safePage >= totalPages}
                onClick={() => setCurrentPage(Math.min(totalPages, safePage + 1))}
                className="min-h-[40px] sm:min-h-[36px] px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 disabled:opacity-40 text-slate-800 border border-slate-300 font-semibold cursor-pointer"
              >
                Volgende Pagina →
              </button>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
