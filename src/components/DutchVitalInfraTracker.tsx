import React, { useState } from 'react';
import {
  ShieldAlert,
  Anchor,
  Zap,
  Waves,
  Wifi,
  HeartPulse,
  CreditCard,
  Building2,
  Apple,
  Plane,
  Cpu,
  FlaskConical,
  GraduationCap,
  CheckCircle2,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
} from 'lucide-react';
import { VitalSectorNL } from '../types/threat';
import { VITAL_SECTORS_NL } from '../data/threatData';

export const DutchVitalInfraTracker: React.FC = () => {
  const [expandedSector, setExpandedSector] = useState<VitalSectorNL | null>('HAVEN_EN_LOGISTIEK');
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<'ALL' | 'KRITIEK' | 'HOOG'>('ALL');

  const toggleSector = (id: VitalSectorNL) => {
    setExpandedSector(expandedSector === id ? null : id);
  };

  const filteredSectors = VITAL_SECTORS_NL.filter((sector) => {
    if (levelFilter === 'KRITIEK' && sector.threatLevel !== 'KRITIEK') return false;
    if (levelFilter === 'HOOG' && sector.threatLevel !== 'KRITIEK' && sector.threatLevel !== 'HOOG') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = sector.name.toLowerCase().includes(q);
      const matchDesc = sector.description.toLowerCase().includes(q);
      const matchEntities = sector.keyEntities.some((e) => e.toLowerCase().includes(q));
      const matchVectors = sector.primaryVectors.some((v) => v.toLowerCase().includes(q));
      return matchName || matchDesc || matchEntities || matchVectors;
    }
    return true;
  });

  const getSectorIcon = (id: string) => {
    switch (id) {
      case 'HAVEN_EN_LOGISTIEK':
        return <Anchor className="w-4 h-4 text-sky-700" />;
      case 'ENERGIE_EN_NETBEHEER':
        return <Zap className="w-4 h-4 text-amber-600" />;
      case 'WATERBEHEER_EN_DIJKEN':
        return <Waves className="w-4 h-4 text-blue-700" />;
      case 'TELECOM_EN_INTERNET':
        return <Wifi className="w-4 h-4 text-purple-700" />;
      case 'ZORG_EN_ZIEKENHUIZEN':
        return <HeartPulse className="w-4 h-4 text-rose-600" />;
      case 'FINANCIELE_SECTOR':
        return <CreditCard className="w-4 h-4 text-emerald-700" />;
      case 'RIJKSOVERHEID_EN_DEFENSIE':
        return <ShieldAlert className="w-4 h-4 text-red-700" />;
      case 'VOEDSEL_EN_AGRO':
        return <Apple className="w-4 h-4 text-orange-600" />;
      case 'TRANSPORT_EN_LUCHTVAART':
        return <Plane className="w-4 h-4 text-sky-600" />;
      case 'HIGHTECH_EN_CHIPS':
        return <Cpu className="w-4 h-4 text-emerald-700" />;
      case 'CHEMIE_EN_INDUSTRIE':
        return <FlaskConical className="w-4 h-4 text-teal-700" />;
      case 'ONDERWIJS_EN_WETENSCHAP':
        return <GraduationCap className="w-4 h-4 text-indigo-700" />;
      default:
        return <Building2 className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
              <ShieldAlert className="w-4 h-4" />
            </span>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
              Nederlandse Vitale Infrastructuur (NCSC &amp; NIS2 Sector Monitor)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Gedetailleerd overzicht van alle beschermde vitale sectoren, sleutelorganisaties en NIS2 compliancestatus
          </p>
        </div>

        <span className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-mono-code text-xs font-bold whitespace-nowrap self-start sm:self-auto">
          🇳🇱 ALLE 12 VITALE &amp; ESSENTIËLE SECTOREN
        </span>
      </div>

      {/* Filter & Search Bar */}
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3.5">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5 max-w-full sm:flex-wrap">
          <button
            onClick={() => setLevelFilter('ALL')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors shrink-0 min-h-[38px] cursor-pointer ${
              levelFilter === 'ALL'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            Alle ({VITAL_SECTORS_NL.length})
          </button>
          <button
            onClick={() => setLevelFilter('KRITIEK')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0 min-h-[38px] cursor-pointer ${
              levelFilter === 'KRITIEK'
                ? 'bg-rose-600 text-white border border-rose-700'
                : 'bg-white text-rose-800 hover:bg-rose-50 border border-slate-300'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            Alleen Kritiek
          </button>
          <button
            onClick={() => setLevelFilter('HOOG')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors shrink-0 min-h-[38px] cursor-pointer ${
              levelFilter === 'HOOG'
                ? 'bg-amber-600 text-white border border-amber-700'
                : 'bg-white text-amber-900 hover:bg-amber-50 border border-slate-300'
            }`}
          >
            Kritiek + Hoog
          </button>
        </div>

        <div className="relative w-full sm:w-auto sm:min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Zoek sector, entiteit (ASML, AH)..."
            className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:bg-white focus:border-amber-600 transition-colors min-h-[42px]"
          />
        </div>
      </div>

      {/* Sector List Accordion */}
      <div className="mt-4 space-y-3">
        {filteredSectors.map((sector) => {
          const isExpanded = expandedSector === sector.id;
          return (
            <div
              key={sector.id}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isExpanded
                  ? 'bg-slate-50 border-slate-300 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <button
                onClick={() => toggleSector(sector.id)}
                className="w-full text-left p-3.5 sm:p-4 flex items-center justify-between gap-3 cursor-pointer min-h-[60px]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 shrink-0 shadow-xs">
                    {getSectorIcon(sector.id)}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm sm:text-base text-slate-900 truncate">{sector.name}</span>
                      <span
                        className={`text-[11px] font-mono-code font-bold px-2 py-0.5 rounded-md border ${
                          sector.threatLevel === 'KRITIEK'
                            ? 'bg-rose-100 text-rose-800 border-rose-300'
                            : 'bg-amber-100 text-amber-900 border-amber-300'
                        }`}
                      >
                        {sector.threatLevel}
                      </span>
                    </div>
                    <div className="text-xs sm:text-sm text-slate-600 line-clamp-1 mt-0.5">
                      {sector.description}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <div className="hidden sm:block">
                      <span className="text-[11px] text-slate-500 block font-mono-code font-semibold">AANVALSENERGIE</span>
                      <strong className="text-xs sm:text-sm text-rose-700 font-mono-code">{sector.activeAttacksCount} incidenten</strong>
                    </div>
                    <span className="sm:hidden text-xs font-mono-code font-bold bg-rose-50 text-rose-800 border border-rose-200 px-2 py-0.5 rounded-md">
                      {sector.activeAttacksCount}⚡
                    </span>
                  </div>
                  {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
                </div>
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 pt-3 border-t border-slate-200 text-xs sm:text-sm space-y-3.5 bg-white">
                  {/* Key Protected Entities */}
                  <div>
                    <span className="text-[11px] font-mono-code font-bold text-slate-500 block mb-1.5">
                      SLEUTELENTITEITEN &amp; VITALE BEDRIJVEN:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {sector.keyEntities.map((entity) => (
                        <span
                          key={entity}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 font-semibold text-xs"
                        >
                          {entity}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Primary Vectors */}
                  <div>
                    <span className="text-[11px] font-mono-code font-bold text-rose-700 block mb-1.5">
                      VOORNAAMSTE AANVALSVECTOREN (GEOBSERVEERD):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {sector.primaryVectors.map((vec) => (
                        <span
                          key={vec}
                          className="px-2.5 py-1 rounded-lg text-xs font-mono-code bg-rose-50 border border-rose-200 text-rose-800 font-semibold"
                        >
                          {vec}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* NCSC Recommended Action */}
                  <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 flex items-start gap-2.5">
                    <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-amber-950 text-xs sm:text-sm block">
                        Dringend Beveiligingsadvies (NCSC / NIS2 Protocol):
                      </span>
                      <p className="text-slate-700 mt-1 text-xs sm:text-sm leading-relaxed">
                        {sector.recommendedAction}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
