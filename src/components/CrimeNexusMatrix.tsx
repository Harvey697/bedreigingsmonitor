import React, { useState, useMemo } from 'react';
import {
  Pill,
  Layers,
  CreditCard,
  Terminal,
  Network,
  GitBranch,
  ShieldAlert,
  Anchor,
  Coins,
  ArrowRight,
  Search,
  ExternalLink,
  Lock,
  AlertTriangle,
  CheckCircle2,
  Workflow,
  FileText,
  ChevronRight,
  Info,
  SlidersHorizontal,
  Scale,
  RefreshCw,
  Eye,
  Key,
  Flame,
  Radio,
  X,
} from 'lucide-react';
import {
  CrimeCaseStudy,
  CrimeChainSimulation,
  CrimeDomainId,
  CrimeNexusLink,
} from '../types/threat';
import {
  CRIME_DOMAINS,
  CRIME_NEXUS_LINKS,
  CRIME_CASE_STUDIES,
  CRIME_CHAIN_SIMULATIONS,
} from '../data/crimeNexusData';

interface CrimeNexusMatrixProps {
  onNavigateToTab?: (tab: string) => void;
  onOpenAiAnalysis?: (topic: string) => void;
}

export const CrimeNexusMatrix: React.FC<CrimeNexusMatrixProps> = ({
  onNavigateToTab,
}) => {
  const [activeDomainFilter, setActiveDomainFilter] = useState<CrimeDomainId | 'ALL'>('ALL');
  const [selectedLink, setSelectedLink] = useState<CrimeNexusLink | null>(CRIME_NEXUS_LINKS[0]);
  const [detailModalLink, setDetailModalLink] = useState<CrimeNexusLink | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'VERBANDEN' | 'KETEN_SIMULATOR' | 'CASE_STUDIES' | 'MITIGATIE'>('VERBANDEN');

  // Simulation state
  const [activeSimIndex, setActiveSimIndex] = useState<number>(0);
  const [activeSimStep, setActiveSimStep] = useState<number>(0);

  // Selected Case Study state
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<CrimeCaseStudy | null>(CRIME_CASE_STUDIES[0]);

  // Filter links
  const filteredLinks = useMemo(() => {
    return CRIME_NEXUS_LINKS.filter((link) => {
      const matchesDomain =
        activeDomainFilter === 'ALL' ||
        link.sourceDomain === activeDomainFilter ||
        link.targetDomain === activeDomainFilter;

      if (!matchesDomain) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      return (
        link.title.toLowerCase().includes(q) ||
        link.shortSummary.toLowerCase().includes(q) ||
        link.realWorldExample.toLowerCase().includes(q) ||
        link.tags.some((t) => t.toLowerCase().includes(q)) ||
        link.technicalVectors.some((v) => v.toLowerCase().includes(q))
      );
    });
  }, [activeDomainFilter, searchQuery]);

  const currentSimulation = CRIME_CHAIN_SIMULATIONS[activeSimIndex];

  const getDomainIcon = (domain: CrimeDomainId) => {
    switch (domain) {
      case 'DRUGSHANDEL':
        return <Pill className="w-5 h-5 text-white" />;
      case 'DARKNETMARKTEN':
        return <Layers className="w-5 h-5 text-white" />;
      case 'FRAUDE':
        return <CreditCard className="w-5 h-5 text-white" />;
      case 'CYBERCRIME':
        return <Terminal className="w-5 h-5 text-white" />;
    }
  };

  const getDomainBadge = (domain: CrimeDomainId) => {
    switch (domain) {
      case 'DRUGSHANDEL':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <Pill className="w-3 h-3 text-emerald-600" />
            Drugshandel
          </span>
        );
      case 'DARKNETMARKTEN':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-800 border border-purple-200">
            <Layers className="w-3 h-3 text-purple-600" />
            Darknetmarkten
          </span>
        );
      case 'FRAUDE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <CreditCard className="w-3 h-3 text-amber-600" />
            Fraude
          </span>
        );
      case 'CYBERCRIME':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200">
            <Terminal className="w-3 h-3 text-rose-600" />
            Cybercrime
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Executive Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-emerald-500/5 via-purple-500/5 to-transparent blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2.5 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-mono font-bold flex items-center gap-1.5">
                <Network className="w-3.5 h-3.5 text-emerald-600" />
                CRIMINOLOGISCHE NEXUS MATRIX
              </span>
              <span className="px-2.5 py-1 rounded-md bg-purple-50 text-purple-800 border border-purple-200 text-xs font-mono font-bold">
                THTC × FIOD × NCSC ANALYSE
              </span>
              <span className="px-2.5 py-1 rounded-md text-xs font-mono font-semibold bg-rose-50 text-rose-800 border border-rose-200">
                ONDERMIJNING & HYBRIDE CRIMINALITEIT
              </span>
            </div>

            <h1 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
              Het Verweven Web: <span className="text-emerald-700">Drugshandel</span>,{' '}
              <span className="text-purple-700">Darknetmarkten</span>,{' '}
              <span className="text-amber-700">Fraude</span> &{' '}
              <span className="text-rose-700">Cybercriminaliteit</span>
            </h1>

            <p className="text-sm text-slate-700 leading-relaxed">
              In de georganiseerde misdaad bestaan geen geïsoleerde silo's meer. Criminelen opereren in een
              syndicaat-ecosysteem waarin fysieke narcotica-invoer in de <strong className="text-slate-900">Rotterdamse haven</strong> leunt
              op <strong className="text-rose-700">cyberinbraken</strong> bij terminals, <strong className="text-amber-700">fraudesyndicaten</strong> rekeningen
              plunderen met infostealer-data van <strong className="text-purple-700">darknetmarkten</strong>, en ransomware-miljoenen worden gewit via
              ondergrondse cash-swaps met drugskartels.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-2.5 shrink-0">
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3 text-center">
              <div className="text-lg sm:text-2xl font-black text-emerald-700 font-mono tabular-nums">4 Hubs</div>
              <div className="text-xs text-slate-600 font-medium">Verbonden Pijlers</div>
            </div>
            <div className="bg-purple-50/70 border border-purple-200 rounded-xl p-3 text-center">
              <div className="text-lg sm:text-2xl font-black text-purple-700 font-mono tabular-nums">{CRIME_NEXUS_LINKS.length} Chokepoints</div>
              <div className="text-xs text-slate-600 font-medium">Geverifieerde Verbanden</div>
            </div>
            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 text-center">
              <div className="text-lg sm:text-2xl font-black text-amber-800 font-mono tabular-nums">€4.8 Mld+</div>
              <div className="text-xs text-slate-600 font-medium">NL Witwas- en Schadevolume</div>
            </div>
            <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-3 text-center">
              <div className="text-lg sm:text-2xl font-black text-rose-700 font-mono tabular-nums">{CRIME_CASE_STUDIES.length} Operaties</div>
              <div className="text-xs text-slate-600 font-medium">Politie & Justitie Zaken</div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Core Pillars Interactive Hub Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {CRIME_DOMAINS.map((domain) => {
          const isSelected = activeDomainFilter === domain.id;
          return (
            <div
              key={domain.id}
              onClick={() => setActiveDomainFilter(isSelected ? 'ALL' : domain.id)}
              className={`rounded-2xl p-4 sm:p-5 border transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden group shadow-sm ${
                isSelected
                  ? `${domain.bgColor} ${domain.borderColor} ring-2 ring-offset-2 ring-offset-slate-50 ring-slate-900/15 shadow-md`
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-md'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-sm ${
                      domain.id === 'DRUGSHANDEL'
                        ? 'bg-emerald-600'
                        : domain.id === 'DARKNETMARKTEN'
                        ? 'bg-purple-600'
                        : domain.id === 'FRAUDE'
                        ? 'bg-amber-600'
                        : 'bg-rose-600'
                    }`}
                  >
                    {getDomainIcon(domain.id)}
                  </div>

                  <span
                    className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-md border ${
                      isSelected
                        ? 'bg-white text-slate-900 border-slate-300'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    {isSelected ? 'Geselecteerd' : 'Klik om te focussen'}
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-slate-900 text-base tracking-tight group-hover:text-slate-950 transition-colors">
                    {domain.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-0.5 line-clamp-2 leading-relaxed">
                    {domain.subtitle}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 space-y-1">
                  <div className="text-xs text-slate-500 uppercase font-mono tracking-wider font-semibold">
                    Volume & Omvang NL
                  </div>
                  <div className={`text-xs sm:text-sm font-bold font-mono tabular-nums ${domain.textColor}`}>
                    {domain.estimatedVolumeNL}
                  </div>
                </div>

                <div className="space-y-1.5 pt-1">
                  <div className="text-xs uppercase font-mono text-slate-500 font-semibold">
                    Sleutelactoren & methoden:
                  </div>
                  <ul className="text-xs text-slate-700 space-y-1 leading-relaxed">
                    {domain.keyActors.slice(0, 2).map((actor, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-slate-400 mt-0.5">•</span>
                        <span>{actor}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs font-bold">
                <span className={domain.textColor}>
                  {CRIME_NEXUS_LINKS.filter(
                    (l) => l.sourceDomain === domain.id || l.targetDomain === domain.id
                  ).length}{' '}
                  actieve dwarsverbanden
                </span>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Relational Nexus Diagram (Interactive SVG Map) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Workflow className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                Interactief Verbanden-Diagram (Nexus Map)
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Visualiseert de realtime kruisbestuiving en geldstromen tussen de 4 criminele domeinen
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeDomainFilter !== 'ALL' && (
              <button
                onClick={() => setActiveDomainFilter('ALL')}
                className="text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-lg border border-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer min-h-[38px]"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Toon alle verbindingen</span>
              </button>
            )}
          </div>
        </div>

        {/* Visual Network Schematic with clickable connection links */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left / Center Diagram Canvas */}
          <div className="lg:col-span-7 bg-slate-50 rounded-2xl border border-slate-200 p-4 sm:p-6 relative overflow-hidden flex flex-col items-center justify-center min-h-[380px]">
            {/* Ambient Background Grid */}
            <div
              className="absolute inset-0 opacity-30 pointer-events-none"
              style={{
                backgroundImage:
                  'radial-gradient(#cbd5e1 1px, transparent 1px), radial-gradient(#e2e8f0 1px, transparent 1px)',
                backgroundSize: '24px 24px',
                backgroundPosition: '0 0, 12px 12px',
              }}
            />

            {/* Central Convergence Badge */}
            <div className="relative z-10 text-center my-4">
              <div className="inline-flex flex-col items-center px-4 py-3 rounded-2xl bg-white border border-slate-200 shadow-md">
                <span className="text-xs uppercase font-mono tracking-wider text-slate-500 font-bold">
                  Centrale Criminelen Hub
                </span>
                <span className="text-sm font-black text-slate-900 flex items-center gap-1.5 mt-0.5">
                  <ShieldAlert className="w-4 h-4 text-rose-600 animate-pulse" />
                  Syndicaat Convergentie
                </span>
                <span className="text-xs text-emerald-700 font-mono font-semibold mt-0.5">
                  Haven RTM × Tor × SEPA × RaaS
                </span>
              </div>
            </div>

            {/* 4 Quadrants Interactive Network */}
            <div className="w-full max-w-lg grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 relative z-10">
              {/* Node 1: Drugshandel */}
              <div
                onClick={() => setActiveDomainFilter('DRUGSHANDEL')}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left ${
                  activeDomainFilter === 'DRUGSHANDEL' || activeDomainFilter === 'ALL'
                    ? 'bg-emerald-50 border-emerald-300 shadow-xs hover:shadow-md'
                    : 'bg-white/60 border-slate-200 opacity-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-emerald-600 text-white">
                    <Pill className="w-4 h-4" />
                  </span>
                  <div>
                    <div className="text-xs font-black text-emerald-900">DRUGSHANDEL</div>
                    <div className="text-xs text-slate-600">Haven & Containers</div>
                  </div>
                </div>
                <div className="mt-2 text-xs text-slate-700 leading-relaxed">
                  Behoefte: Terminal uitrijcodes, witwassen van miljarden contanten, stealth drops.
                </div>
              </div>

              {/* Node 2: Darknetmarkten */}
              <div
                onClick={() => setActiveDomainFilter('DARKNETMARKTEN')}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left ${
                  activeDomainFilter === 'DARKNETMARKTEN' || activeDomainFilter === 'ALL'
                    ? 'bg-purple-50 border-purple-300 shadow-xs hover:shadow-md'
                    : 'bg-white/60 border-slate-200 opacity-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-purple-600 text-white">
                    <Layers className="w-4 h-4" />
                  </span>
                  <div>
                    <div className="text-xs font-black text-purple-900">DARKNETMARKTEN</div>
                    <div className="text-xs text-slate-600">Tor & Escrow Shops</div>
                  </div>
                </div>
                <div className="mt-2 text-xs text-slate-700 leading-relaxed">
                  Behoefte: Monero betalingen, verkoop van infostealer logs, drugsretail via PostNL.
                </div>
              </div>

              {/* Node 3: Fraude */}
              <div
                onClick={() => setActiveDomainFilter('FRAUDE')}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left ${
                  activeDomainFilter === 'FRAUDE' || activeDomainFilter === 'ALL'
                    ? 'bg-amber-50 border-amber-300 shadow-xs hover:shadow-md'
                    : 'bg-white/60 border-slate-200 opacity-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-amber-600 text-white">
                    <CreditCard className="w-4 h-4" />
                  </span>
                  <div>
                    <div className="text-xs font-black text-amber-900">FINANCIËLE FRAUDE</div>
                    <div className="text-xs text-slate-600">Geldezels & Helpdesk</div>
                  </div>
                </div>
                <div className="mt-2 text-xs text-slate-700 leading-relaxed">
                  Behoefte: Gestolen banktokens, Telegram jongeren-ronseling, SEPA cash-out.
                </div>
              </div>

              {/* Node 4: Cybercrime */}
              <div
                onClick={() => setActiveDomainFilter('CYBERCRIME')}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left ${
                  activeDomainFilter === 'CYBERCRIME' || activeDomainFilter === 'ALL'
                    ? 'bg-rose-50 border-rose-300 shadow-xs hover:shadow-md'
                    : 'bg-white/60 border-slate-200 opacity-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-rose-600 text-white">
                    <Terminal className="w-4 h-4" />
                  </span>
                  <div>
                    <div className="text-xs font-black text-rose-900">CYBERCRIMINALITEIT</div>
                    <div className="text-xs text-slate-600">Ransomware & IAB</div>
                  </div>
                </div>
                <div className="mt-2 text-xs text-slate-700 leading-relaxed">
                  Behoefte: Toegang verkopen, losgeld witwassen via drugscash, offshore hosting.
                </div>
              </div>
            </div>

            {/* Direct Connectors list */}
            <div className="mt-4 pt-3 border-t border-slate-200 w-full flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="text-slate-600 font-mono font-semibold">Selecteer een kruisverband:</span>
              {CRIME_NEXUS_LINKS.slice(0, 4).map((link) => (
                <button
                  key={link.id}
                  onClick={() => setSelectedLink(link)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer min-h-[36px] ${
                    selectedLink?.id === link.id
                      ? 'bg-rose-600 border-rose-600 text-white shadow-xs'
                      : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {link.title.split('&')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Right Selected Nexus Detail View */}
          <div className="lg:col-span-5 bg-slate-50 rounded-2xl border border-slate-200 p-4 sm:p-5 space-y-4">
            {selectedLink ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {getDomainBadge(selectedLink.sourceDomain)}
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                    {getDomainBadge(selectedLink.targetDomain)}
                  </div>
                  <span
                    className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded border ${
                      selectedLink.severity === 'KRITIEK'
                        ? 'bg-rose-50 text-rose-800 border-rose-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}
                  >
                    {selectedLink.severity}
                  </span>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    {selectedLink.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-700 mt-1 leading-relaxed">
                    {selectedLink.shortSummary}
                  </p>
                </div>

                {/* Real-world Example Box */}
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1.5 shadow-xs">
                  <div className="flex items-center gap-1.5 text-emerald-800 text-xs font-bold">
                    <Scale className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Praktijkcase uit Nederland & Politiedossiers</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {selectedLink.realWorldExample}
                  </p>
                  {selectedLink.policeOperationRef && (
                    <div className="text-xs font-mono text-slate-600 pt-1.5 border-t border-slate-200">
                      Opsporingsonderzoek:{' '}
                      <strong className="text-slate-900">{selectedLink.policeOperationRef}</strong>
                    </div>
                  )}
                </div>

                {/* Key Technical Vectors */}
                <div className="space-y-1.5">
                  <div className="text-xs uppercase font-mono text-slate-600 font-semibold">
                    Gebruikte Technische Vectoren:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedLink.technicalVectors.map((v, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 bg-white border border-slate-200 text-slate-800 rounded text-xs font-mono"
                      >
                        {v}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setActiveTab('KETEN_SIMULATOR')}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer min-h-[42px]"
                  >
                    <Workflow className="w-4 h-4" />
                    <span>Bekijk in Keten-Simulator (Stap-voor-stap)</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 mx-auto flex items-center justify-center text-emerald-600 shadow-xs">
                  <Network className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Selecteer een Verband</h4>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-xs mx-auto mt-1 leading-relaxed">
                    Klik op een van de knoppen of domeinen links om het specifieke criminologische verband te ontleden.
                  </p>
                </div>
                <button
                  onClick={() => setSelectedLink(CRIME_NEXUS_LINKS[0])}
                  className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-xs font-semibold text-slate-800 border border-slate-300 cursor-pointer min-h-[40px]"
                >
                  Toon Haven Infiltratie & Container PIN-Diefstal
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex border-b border-slate-200 space-x-2 overflow-x-auto pb-2 text-xs sm:text-sm font-semibold scrollbar-none">
        <button
          onClick={() => setActiveTab('VERBANDEN')}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap min-h-[40px] ${
            activeTab === 'VERBANDEN'
              ? 'bg-emerald-600 text-white shadow-sm font-bold'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Network className="w-4 h-4" />
          <span>Alle Geverifieerde Verbanden ({filteredLinks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('KETEN_SIMULATOR')}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap min-h-[40px] ${
            activeTab === 'KETEN_SIMULATOR'
              ? 'bg-purple-700 text-white shadow-sm font-bold'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Workflow className="w-4 h-4" />
          <span>Keten-Simulator ({CRIME_CHAIN_SIMULATIONS.length} Scenario's)</span>
        </button>

        <button
          onClick={() => setActiveTab('CASE_STUDIES')}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap min-h-[40px] ${
            activeTab === 'CASE_STUDIES'
              ? 'bg-amber-600 text-white shadow-sm font-bold'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>Politie & Justitie Dossiers ({CRIME_CASE_STUDIES.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('MITIGATIE')}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap min-h-[40px] ${
            activeTab === 'MITIGATIE'
              ? 'bg-rose-600 text-white shadow-sm font-bold'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Handreikingen & NIS2 Mitigatie</span>
        </button>
      </div>

      {/* TAB 1: Alle Geverifieerde Verbanden Grid */}
      {activeTab === 'VERBANDEN' && (
        <div className="space-y-4">
          {/* Search & Domain Filter Bar */}
          <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Zoek op haven, geldezel, Monero, Lumma, PostNL..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:bg-white focus:border-emerald-600 min-h-[42px]"
              />
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <span className="text-xs text-slate-600 font-mono font-semibold shrink-0">Filter Pijler:</span>
              <button
                onClick={() => setActiveDomainFilter('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer min-h-[36px] whitespace-nowrap ${
                  activeDomainFilter === 'ALL'
                    ? 'bg-slate-900 text-white border border-slate-900'
                    : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                Alles
              </button>
              <button
                onClick={() => setActiveDomainFilter('DRUGSHANDEL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer min-h-[36px] whitespace-nowrap ${
                  activeDomainFilter === 'DRUGSHANDEL'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                    : 'bg-slate-50 text-slate-700 border border-slate-200 hover:text-emerald-800'
                }`}
              >
                Drugshandel
              </button>
              <button
                onClick={() => setActiveDomainFilter('DARKNETMARKTEN')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer min-h-[36px] whitespace-nowrap ${
                  activeDomainFilter === 'DARKNETMARKTEN'
                    ? 'bg-purple-50 text-purple-800 border border-purple-300'
                    : 'bg-slate-50 text-slate-700 border border-slate-200 hover:text-purple-800'
                }`}
              >
                Darknet
              </button>
              <button
                onClick={() => setActiveDomainFilter('FRAUDE')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer min-h-[36px] whitespace-nowrap ${
                  activeDomainFilter === 'FRAUDE'
                    ? 'bg-amber-50 text-amber-800 border border-amber-300'
                    : 'bg-slate-50 text-slate-700 border border-slate-200 hover:text-amber-800'
                }`}
              >
                Fraude
              </button>
              <button
                onClick={() => setActiveDomainFilter('CYBERCRIME')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer min-h-[36px] whitespace-nowrap ${
                  activeDomainFilter === 'CYBERCRIME'
                    ? 'bg-rose-50 text-rose-800 border border-rose-300'
                    : 'bg-slate-50 text-slate-700 border border-slate-200 hover:text-rose-800'
                }`}
              >
                Cybercrime
              </button>
            </div>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredLinks.map((link) => (
              <div
                key={link.id}
                onClick={() => {
                  setSelectedLink(link);
                  setDetailModalLink(link);
                }}
                className={`bg-white border rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col justify-between space-y-4 transition-all cursor-pointer group ${
                  selectedLink?.id === link.id
                    ? 'border-emerald-600 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:border-emerald-400 hover:shadow-md'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {getDomainBadge(link.sourceDomain)}
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                      {getDomainBadge(link.targetDomain)}
                    </div>
                    <span
                      className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-md border shrink-0 ${
                        link.severity === 'KRITIEK'
                          ? 'bg-rose-50 text-rose-800 border-rose-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      {link.severity}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base group-hover:text-emerald-700 transition-colors leading-snug">
                      {link.title}
                    </h3>
                    <p className="text-sm text-slate-700 mt-1.5 leading-relaxed">
                      {link.shortSummary}
                    </p>
                  </div>

                  {/* Bullet Mechanisms */}
                  <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <div className="text-xs font-mono uppercase text-slate-600 font-bold">
                      Hoe grijpen ze in elkaar:
                    </div>
                    <ul className="text-xs sm:text-sm text-slate-700 space-y-1.5 leading-relaxed">
                      {link.mechanisms.slice(0, 2).map((m, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{m}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Real World Snippet */}
                  <div className="text-xs text-slate-700 italic bg-slate-50 p-3 rounded-lg border border-slate-200 leading-relaxed">
                    <strong className="text-slate-900 not-italic">Zaak: </strong>
                    {link.realWorldExample.slice(0, 160)}...
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2 text-xs">
                  <div className="flex flex-wrap gap-1.5">
                    {link.tags.slice(0, 3).map((t, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded text-xs font-mono bg-slate-100 text-slate-700 border border-slate-200"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedLink(link);
                      setDetailModalLink(link);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-600 text-emerald-800 hover:text-white border border-emerald-300 font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer shrink-0 min-h-[38px]"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Keten Simulator (Interactive Stepper) */}
      {activeTab === 'KETEN_SIMULATOR' && (
        <div className="space-y-6">
          {/* Scenario Selector */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {CRIME_CHAIN_SIMULATIONS.map((sim, idx) => (
              <button
                key={sim.id}
                onClick={() => {
                  setActiveSimIndex(idx);
                  setActiveSimStep(0);
                }}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[44px] ${
                  activeSimIndex === idx
                    ? 'bg-purple-50 border-purple-400 shadow-sm ring-2 ring-purple-500/20'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                <div>
                  <span className="text-xs font-mono text-purple-700 uppercase font-bold">
                    Scenario {idx + 1}
                  </span>
                  <div className="font-extrabold text-slate-900 text-sm sm:text-base mt-0.5">{sim.title}</div>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 line-clamp-2 leading-relaxed">{sim.threatScenario}</p>
                </div>
                <div className="mt-3 text-xs font-mono text-amber-800 font-bold tabular-nums">
                  Schade: {sim.estimatedFinancialDamage.split('+')[0]}
                </div>
              </button>
            ))}
          </div>

          {/* Active Simulation Walkthrough */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-7 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-purple-700">
                  INTERACTIEVE CRIMINELE KETEN ANALYSE
                </span>
                <h3 className="text-lg sm:text-2xl font-black text-slate-900 mt-0.5">
                  {currentSimulation.title}
                </h3>
                <p className="text-sm text-slate-700 mt-1 leading-relaxed">
                  {currentSimulation.threatScenario}
                </p>
              </div>

              <div className="bg-amber-50 px-4 py-2.5 rounded-xl border border-amber-200 text-center shrink-0">
                <div className="text-xs uppercase font-mono text-amber-800 font-semibold">Geraamde Schade / Opbrengst</div>
                <div className="text-sm font-black font-mono text-amber-900 tabular-nums mt-0.5">
                  {currentSimulation.estimatedFinancialDamage}
                </div>
              </div>
            </div>

            {/* Stepper Progress Bar */}
            <div className="relative">
              <div className="flex items-center justify-between relative z-10">
                {currentSimulation.steps.map((step, idx) => {
                  const isCurrent = activeSimStep === idx;
                  const isPast = activeSimStep > idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveSimStep(idx)}
                      className="flex flex-col items-center gap-1.5 group cursor-pointer focus:outline-none min-w-[44px]"
                    >
                      <div
                        className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center font-bold text-sm transition-all shadow-sm ${
                          isCurrent
                            ? 'bg-purple-700 text-white ring-4 ring-purple-100 border border-purple-500 scale-105'
                            : isPast
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 text-slate-700 border border-slate-300 hover:bg-slate-200'
                        }`}
                      >
                        {isPast ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                      </div>
                      <span
                        className={`text-xs font-mono max-w-[84px] sm:max-w-[130px] text-center truncate ${
                          isCurrent ? 'text-purple-800 font-bold' : 'text-slate-600'
                        }`}
                      >
                        {step.domain}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Connecting Bar */}
              <div className="absolute top-5 left-6 right-6 h-0.5 bg-slate-200 -z-0" />
            </div>

            {/* Current Step Detailed Card */}
            {currentSimulation.steps[activeSimStep] && (
              <div className="bg-slate-50 rounded-2xl border border-purple-200 p-4 sm:p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-purple-100 text-purple-800 border border-purple-200 font-mono font-bold flex items-center justify-center text-xs tabular-nums">
                      #{currentSimulation.steps[activeSimStep].stepNumber}
                    </span>
                    <h4 className="text-base sm:text-lg font-black text-slate-900">
                      {currentSimulation.steps[activeSimStep].title}
                    </h4>
                  </div>

                  <div>{getDomainBadge(currentSimulation.steps[activeSimStep].domain)}</div>
                </div>

                <p className="text-sm text-slate-700 leading-relaxed">
                  {currentSimulation.steps[activeSimStep].description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  <div className="bg-white rounded-xl p-3.5 border border-slate-200 space-y-1.5 shadow-xs">
                    <div className="text-xs font-mono uppercase text-slate-600 font-bold flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-purple-600" />
                      <span>Technische Uitvoering & Vectoren</span>
                    </div>
                    <div className="text-xs sm:text-sm font-mono text-slate-800 leading-relaxed">
                      {currentSimulation.steps[activeSimStep].technicalDetails}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-3.5 border border-slate-200 space-y-1.5 shadow-xs">
                    <div className="text-xs font-mono uppercase text-slate-600 font-bold flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Bewijsstuk / Onderschept Artefact</span>
                    </div>
                    <div className="text-xs sm:text-sm font-mono text-emerald-800 font-medium leading-relaxed">
                      {currentSimulation.steps[activeSimStep].evidenceArtifact}
                    </div>
                  </div>
                </div>

                {/* Step Navigation Controls */}
                <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-200">
                  <button
                    onClick={() => setActiveSimStep(Math.max(0, activeSimStep - 1))}
                    disabled={activeSimStep === 0}
                    className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-xs sm:text-sm font-semibold text-slate-800 border border-slate-300 transition-all cursor-pointer min-h-[40px]"
                  >
                    Vorige stap
                  </button>

                  <div className="text-xs sm:text-sm font-mono text-slate-600 tabular-nums">
                    Stap {activeSimStep + 1} van {currentSimulation.steps.length}
                  </div>

                  <button
                    onClick={() =>
                      setActiveSimStep(
                        Math.min(currentSimulation.steps.length - 1, activeSimStep + 1)
                      )
                    }
                    disabled={activeSimStep === currentSimulation.steps.length - 1}
                    className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 disabled:opacity-40 disabled:cursor-not-allowed text-xs sm:text-sm font-semibold text-white transition-all cursor-pointer flex items-center gap-1.5 shadow-sm min-h-[40px]"
                  >
                    <span>Volgende stap</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: Politie & Justitie Case Studies */}
      {activeTab === 'CASE_STUDIES' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* List of Case Studies */}
          <div className="lg:col-span-5 space-y-3">
            {CRIME_CASE_STUDIES.map((study) => (
              <div
                key={study.id}
                onClick={() => setSelectedCaseStudy(study)}
                className={`p-4 sm:p-4.5 rounded-2xl border transition-all cursor-pointer text-left ${
                  selectedCaseStudy?.id === study.id
                    ? 'bg-amber-50 border-amber-400 shadow-sm ring-2 ring-amber-500/20'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5 gap-2">
                  <span className="text-xs font-mono text-amber-800 font-bold">
                    {study.dateOrYear}
                  </span>
                  <span
                    className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded border ${
                      study.status === 'AFGEROND_VONNIS'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-rose-50 text-rose-800 border-rose-200'
                    }`}
                  >
                    {study.status.replace('_', ' ')}
                  </span>
                </div>

                <h4 className="font-extrabold text-slate-900 text-base">{study.title}</h4>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 line-clamp-2 leading-relaxed">{study.subtitle}</p>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {study.domainsCovered.map((d) => (
                    <span key={d}>{getDomainBadge(d)}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Case Study Details View */}
          <div className="lg:col-span-7">
            {selectedCaseStudy && (
              <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 shadow-sm space-y-5">
                <div className="space-y-2 border-b border-slate-200 pb-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-1 rounded bg-amber-50 text-amber-800 border border-amber-200 text-xs font-mono font-bold">
                      {selectedCaseStudy.dateOrYear}
                    </span>
                    <span className="text-xs text-slate-600 font-mono">
                      Betrokken diensten:{' '}
                      <strong className="text-slate-900">
                        {selectedCaseStudy.involvedAgencies.join(' • ')}
                      </strong>
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                    {selectedCaseStudy.title}
                  </h3>
                  <p className="text-sm text-slate-700 font-medium leading-relaxed">
                    {selectedCaseStudy.subtitle}
                  </p>
                </div>

                {/* Domains Covered */}
                <div className="space-y-1.5">
                  <div className="text-xs font-mono uppercase text-slate-600 font-bold">
                    Onderzochte Domeinen in dit Dossier:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedCaseStudy.domainsCovered.map((d) => (
                      <span key={d}>{getDomainBadge(d)}</span>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                <div className="space-y-1.5">
                  <h4 className="text-xs font-mono uppercase text-slate-600 font-bold">
                    Samenvatting van het Opsporingsonderzoek
                  </h4>
                  <p className="text-sm text-slate-800 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                    {selectedCaseStudy.summary}
                  </p>
                </div>

                {/* Key Finding */}
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-1.5">
                  <div className="flex items-center gap-2 text-amber-900 text-xs sm:text-sm font-bold">
                    <Scale className="w-4 h-4 text-amber-700" />
                    <span>Cruciale Criminologische Ontdekking</span>
                  </div>
                  <p className="text-sm text-slate-800 leading-relaxed font-medium">
                    {selectedCaseStudy.keyFinding}
                  </p>
                </div>

                {/* Tactical Lessons */}
                <div className="space-y-2">
                  <h4 className="text-xs font-mono uppercase text-slate-600 font-bold">
                    Lessen voor Cybersecurity & Rechtshandhaving
                  </h4>
                  <ul className="space-y-2">
                    {selectedCaseStudy.tacticalLessons.map((lesson, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 bg-slate-50 p-3.5 rounded-lg border border-slate-200 leading-relaxed"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{lesson}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: Handreikingen & NIS2 Mitigatie */}
      {activeTab === 'MITIGATIE' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-rose-50 text-rose-600 border border-rose-200">
                <ShieldAlert className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900">
                  Mitigatie & Ketenaanpak voor Vitale Sectoren (NIS2 & NCSC)
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                  Concrete maatregelen om de synergie tussen fysieke misdaad en cybercriminaliteit te doorbreken
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Haven & Maritieme Logistiek */}
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <Anchor className="w-4 h-4 text-emerald-600" />
                  <span>Havenbedrijven, Rederijen & Terminals</span>
                </div>
                <ul className="text-xs sm:text-sm text-slate-700 space-y-2 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>
                      <strong className="text-slate-900">Vertrouwensketen Implementeren:</strong> Vervang statische containercodes (pincodes) door cryptografisch getekende digitale autorisaties gekoppeld aan geverifieerde chauffeurs.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>
                      <strong className="text-slate-900">Hardware MFA (FIDO2/YubiKey):</strong> Geen wachtwoorden of SMS-2FA meer voor toegang tot havenapplicaties (Portbase, TOS).
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>
                      <strong className="text-slate-900">Fysieke Poortcontrole & USB-blokkades:</strong> Blokkeer ongeautoriseerde hardware keyloggers en mini-routers op kantoorwerkstations.
                    </span>
                  </li>
                </ul>
              </div>

              {/* Financiële Instellingen & Banken */}
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
                  <CreditCard className="w-4 h-4 text-amber-600" />
                  <span>Banken & Betalingsverkeer</span>
                </div>
                <ul className="text-xs sm:text-sm text-slate-700 space-y-2 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>
                      <strong className="text-slate-900">Detectie Anti-Detect Browsers:</strong> Detecteer afwijkende sessies waarin gekloonde cookies (Dolphin Anty) worden ingeladen zonder hardware-consistentie.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>
                      <strong className="text-slate-900">Geldezel Monitoring & AI Patroonherkenning:</strong> Vroegtijdige bevriezing van rekeningen van jongeren die plotseling hoge SEPA-overschrijvingen ontvangen.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>
                      <strong className="text-slate-900">Spoofing-filter Telecom Providers:</strong> Strikte handhaving tegen ongeautoriseerde Call Line Identification (CLI) spoofing van banknummers.
                    </span>
                  </li>
                </ul>
              </div>

              {/* Post & Logistieke Koeriers */}
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-purple-800 font-bold text-sm">
                  <Layers className="w-4 h-4 text-purple-600" />
                  <span>Post- & Pakketdiensten (PostNL, DHL)</span>
                </div>
                <ul className="text-xs sm:text-sm text-slate-700 space-y-2 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">•</span>
                    <span>
                      <strong className="text-slate-900">Cameratoezicht op Drop-boxes:</strong> Slimme monitoring bij brievenbussen in verdachte regio's (Brabant/Limburg) waar vendors massaal postorders dumpen.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">•</span>
                    <span>
                      <strong className="text-slate-900">Geavanceerde Gas- en Röntgenscanners:</strong> Snelle detectie van vacuümverpakte verdovende middelen bestemd voor het buitenland.
                    </span>
                  </li>
                </ul>
              </div>

              {/* MKB & Zorg (Ransomware Protectie) */}
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
                  <Terminal className="w-4 h-4 text-rose-600" />
                  <span>MKB, Zorg & Industrie</span>
                </div>
                <ul className="text-xs sm:text-sm text-slate-700 space-y-2 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-rose-600 font-bold">•</span>
                    <span>
                      <strong className="text-slate-900">Patchbeleid Externe Gateways:</strong> Dicht Citrix Bleed, Fortinet en Ivanti kwetsbaarheden binnen 24 uur na openbaarmaking.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-600 font-bold">•</span>
                    <span>
                      <strong className="text-slate-900">Geen Losgeld Betalen:</strong> Betaling financiert direct drugskartels en terrorisme; overleg altijd direct met politie en verzekeraar.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-600 font-bold">•</span>
                    <span>
                      <strong className="text-slate-900">Onveranderbare (Immutable) Offline Back-ups:</strong> Garandeer herstel binnen 12 uur zonder losgeld te overwegen.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dedicated Crime Nexus Detail Dossier Modal */}
      {detailModalLink && (
        <div
          onClick={() => setDetailModalLink(null)}
          className="fixed inset-0 z-[70] flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl relative overflow-hidden flex flex-col max-h-[92vh]"
          >
            <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-200">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  {getDomainBadge(detailModalLink.sourceDomain)}
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                  {getDomainBadge(detailModalLink.targetDomain)}
                  <span
                    className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded border ${
                      detailModalLink.severity === 'KRITIEK'
                        ? 'bg-rose-50 text-rose-800 border-rose-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}
                  >
                    {detailModalLink.severity}
                  </span>
                </div>
                <h2 className="text-base sm:text-xl font-black text-slate-900">
                  {detailModalLink.title}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setDetailModalLink(null)}
                className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 flex-1 overflow-y-auto space-y-4 pr-1 text-xs sm:text-sm">
              {/* Summary */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-xs font-mono uppercase text-emerald-700 font-bold mb-1">
                  Samenvatting Criminologisch Verband
                </div>
                <p className="text-slate-800 leading-relaxed text-sm">
                  {detailModalLink.shortSummary}
                </p>
              </div>

              {/* All Mechanisms */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="text-xs font-mono uppercase text-slate-600 font-bold">
                  Volledige Modus Operandi & Schakels ({detailModalLink.mechanisms.length} Stappen)
                </div>
                <ul className="space-y-2">
                  {detailModalLink.mechanisms.map((m, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-800 leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Real World Example & Police Operation */}
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="flex items-center gap-1.5 text-emerald-900 font-bold">
                    <Scale className="w-4 h-4 text-emerald-700" />
                    <span>Geverifieerde Praktijkzaak (Politie / THTC / FIOD)</span>
                  </span>
                  {detailModalLink.policeOperationRef && (
                    <span className="text-xs font-mono bg-white text-emerald-800 px-2.5 py-0.5 rounded border border-emerald-200 font-bold">
                      {detailModalLink.policeOperationRef}
                    </span>
                  )}
                </div>
                <p className="text-slate-800 leading-relaxed">
                  {detailModalLink.realWorldExample}
                </p>
              </div>

              {/* Impact on Netherlands */}
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 space-y-1">
                <div className="text-xs font-mono uppercase text-rose-800 font-bold">
                  Impact op Nederland & Vitale Infrastructuur
                </div>
                <p className="text-slate-800 leading-relaxed font-medium">
                  {detailModalLink.dutchImpact}
                </p>
              </div>

              {/* Technical Vectors & Tags */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div>
                  <div className="text-xs font-mono uppercase text-slate-600 font-bold mb-1.5">
                    Gebruikte Technische Vectoren & TTP's
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {detailModalLink.technicalVectors.map((v, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded bg-white border border-rose-200 text-rose-800 font-mono text-xs"
                      >
                        {v}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex flex-wrap gap-1.5">
                  {detailModalLink.tags.map((t, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded text-xs font-mono bg-white text-slate-700 border border-slate-200"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setDetailModalLink(null);
                  setActiveTab('KETEN_SIMULATOR');
                }}
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs sm:text-sm font-bold transition-colors cursor-pointer min-h-[42px]"
              >
                <Workflow className="w-4 h-4" />
                <span>Open in Keten-Simulator (Stap-voor-stap)</span>
              </button>

              <button
                type="button"
                onClick={() => setDetailModalLink(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs sm:text-sm font-bold transition-colors cursor-pointer min-h-[42px]"
              >
                Sluiten
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
