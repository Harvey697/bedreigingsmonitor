import React, { useState } from 'react';
import {
  Skull,
  Radio,
  Flame,
  Search,
  ExternalLink,
  MessageSquare,
  AlertTriangle,
  Coins,
  ShieldAlert,
  Sparkles,
  Layers,
  ChevronRight,
  Eye,
  X,
  CheckCircle2,
} from 'lucide-react';
import { DarkwebChatterItem, NotificationTier } from '../types/threat';
import { DARKWEB_FORUM_DISCUSSIONS, DARKWEB_LEAK_SITES } from '../data/threatData';

interface DarkwebChatterMonitorProps {
  onAnalyzeChatterWithAi: (chatter: DarkwebChatterItem) => void;
  onTestTierSound: (tier: NotificationTier) => void;
}

export const DarkwebChatterMonitor: React.FC<DarkwebChatterMonitorProps> = ({
  onAnalyzeChatterWithAi,
  onTestTierSound,
}) => {
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState<'ALL' | NotificationTier>('ALL');
  const [selectedChatterDetail, setSelectedChatterDetail] = useState<DarkwebChatterItem | null>(null);

  const filteredChatter = DARKWEB_FORUM_DISCUSSIONS.filter((item) => {
    if (tierFilter !== 'ALL' && item.threatTier !== tierFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        item.topicTitle.toLowerCase().includes(q) ||
        item.authorHandle.toLowerCase().includes(q) ||
        item.forumName.toLowerCase().includes(q) ||
        item.targetedSectorOrRegion.toLowerCase().includes(q) ||
        item.detectedTactic.toLowerCase().includes(q) ||
        item.excerpt.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getTierBadge = (tier: NotificationTier) => {
    switch (tier) {
      case 'TIER_1_NL_VITAAL':
        return 'bg-rose-100 text-rose-800 border-rose-300 font-extrabold';
      case 'TIER_2_EUROPA':
        return 'bg-amber-100 text-amber-900 border-amber-300 font-bold';
      case 'TIER_3_DARKWEB_CHATTER':
        return 'bg-sky-100 text-sky-900 border-sky-300 font-semibold';
    }
  };

  const getTierLabel = (tier: NotificationTier) => {
    switch (tier) {
      case 'TIER_1_NL_VITAAL':
        return '🔴 TIER 1: NL VITAAL ACCUUT';
      case 'TIER_2_EUROPA':
        return '🟠 TIER 2: EUROPA RANSOMWARE';
      case 'TIER_3_DARKWEB_CHATTER':
        return '🟡 TIER 3: DARKWEB CHATTER';
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-200 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-purple-50 text-purple-700 border border-purple-200">
              <MessageSquare className="w-4 h-4" />
            </span>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
              Dark Web Discussie &amp; Forum Scanner (Ondergrondse Inlichtingen)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Geverifieerde en ontdubbelde monitoring van Exploit.in, XSS.is, RAMP en Telegram op daadwerkelijke publicatiedatum
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-auto md:min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Zoek forum post, exploit, broker..."
            className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:bg-white focus:border-purple-600 transition-colors min-h-[42px]"
          />
        </div>
      </div>

      {/* Active .Onion Leak Portals Telemetry Bar */}
      <div className="mt-4 p-3.5 rounded-xl bg-purple-50/60 border border-purple-200 space-y-2.5">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="text-xs font-mono-code font-bold text-purple-900 uppercase flex items-center gap-1.5">
            <Radio className="w-4 h-4 text-rose-600" />
            <span>Gemonitorde .Onion Ransomware &amp; Afpersingsportalen (Tor Netwerk)</span>
          </span>
          <span className="text-xs font-mono-code font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
            {DARKWEB_LEAK_SITES.length} Actieve Tor-leksites online
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {DARKWEB_LEAK_SITES.map((site) => (
            <button
              key={site.id}
              type="button"
              onClick={() => setSearch(site.name.split(' ')[0])}
              className="text-left p-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-purple-400 transition-all flex items-center justify-between gap-2 cursor-pointer min-h-[56px]"
              title={`Filter berichten op ${site.name}`}
            >
              <div className="min-w-0">
                <div className="text-xs sm:text-sm font-bold text-slate-900 truncate">{site.name}</div>
                <div className="text-[11px] font-mono-code text-purple-700 truncate">{site.onionAddress}</div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[11px] font-mono-code font-bold bg-rose-50 text-rose-800 border border-rose-200 px-2 py-0.5 rounded block">
                  {site.activeVictimsCount} doelwitten
                </span>
                <span className="text-[11px] text-slate-500 font-mono-code block mt-0.5">{site.lastScraped}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Filter Tabs & Tier shortcuts */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2.5 border-b border-slate-200 pb-3.5">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1 max-w-full sm:flex-wrap">
          <button
            type="button"
            onClick={() => {
              setTierFilter('ALL');
              setSearch('');
            }}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors shrink-0 cursor-pointer min-h-[38px] ${
              tierFilter === 'ALL' && !search
                ? 'bg-purple-700 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            Alle Berichten ({DARKWEB_FORUM_DISCUSSIONS.length})
          </button>
          <button
            type="button"
            onClick={() => {
              setTierFilter('ALL');
              setSearch(search.toLowerCase() === 'php2shell' ? '' : 'php2shell');
            }}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer min-h-[38px] ${
              search.toLowerCase() === 'php2shell'
                ? 'bg-rose-600 text-white border border-rose-700 shadow-sm'
                : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200'
            }`}
          >
            <span>🚨</span> PHP2Shell (50+ Gemeenten / CISA KEV)
          </button>
          <button
            type="button"
            onClick={() => {
              setTierFilter('ALL');
              setSearch(search.toLowerCase() === 'brotli' ? '' : 'brotli');
            }}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer min-h-[38px] ${
              search.toLowerCase() === 'brotli'
                ? 'bg-sky-700 text-white border border-sky-800 shadow-sm'
                : 'bg-sky-50 text-sky-900 hover:bg-sky-100 border border-sky-200'
            }`}
          >
            <span>⚡</span> Node2Shell / Google Brotli (CVE-2026-111497)
          </button>
          <button
            type="button"
            onClick={() => {
              setTierFilter('ALL');
              setSearch(search.toLowerCase() === 'pepijn' ? '' : 'pepijn');
            }}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer min-h-[38px] ${
              search.toLowerCase() === 'pepijn'
                ? 'bg-amber-600 text-white border border-amber-700 shadow-sm'
                : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            <span>🇳🇱</span> Pepijn van der Stap / ShinyHunters
          </button>
          <button
            type="button"
            onClick={() => {
              setTierFilter('ALL');
              setSearch(search.toLowerCase() === 'philips' ? '' : 'philips');
            }}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer min-h-[38px] ${
              search.toLowerCase() === 'philips'
                ? 'bg-rose-600 text-white border border-rose-700 shadow-sm'
                : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200'
            }`}
          >
            <span>🕵️‍♂️</span> Philips &amp; Shell Cl0p Dossier
          </button>
          <button
            type="button"
            onClick={() => setTierFilter('TIER_1_NL_VITAAL')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer min-h-[38px] ${
              tierFilter === 'TIER_1_NL_VITAAL'
                ? 'bg-rose-600 text-white border border-rose-700'
                : 'bg-white text-rose-700 hover:bg-rose-50 border border-slate-300'
            }`}
          >
            <span>🚨</span> Tier 1 (NL Vitaal)
          </button>
          <button
            type="button"
            onClick={() => setTierFilter('TIER_2_EUROPA')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer min-h-[38px] ${
              tierFilter === 'TIER_2_EUROPA'
                ? 'bg-amber-600 text-white border border-amber-700'
                : 'bg-white text-amber-800 hover:bg-amber-50 border border-slate-300'
            }`}
          >
            <span>⚠️</span> Tier 2 (Europa)
          </button>
          <button
            type="button"
            onClick={() => setTierFilter('TIER_3_DARKWEB_CHATTER')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer min-h-[38px] ${
              tierFilter === 'TIER_3_DARKWEB_CHATTER'
                ? 'bg-sky-700 text-white border border-sky-800'
                : 'bg-white text-sky-800 hover:bg-sky-50 border border-slate-300'
            }`}
          >
            <span>📡</span> Tier 3 (Ondergronds Chatter)
          </button>
        </div>

        <div className="text-xs text-slate-600 font-mono-code">
          Tor Scraper: <strong className="text-emerald-700">{DARKWEB_LEAK_SITES.length} .onion portals &amp; fora (0 duplicaten)</strong>
        </div>
      </div>

      {/* Chatter cards feed */}
      <div className="mt-4 space-y-4">
        {filteredChatter.map((item) => (
          <div
            key={item.id}
            className={`p-4 rounded-2xl border transition-all ${
              item.threatTier === 'TIER_1_NL_VITAAL'
                ? 'bg-rose-50/40 border-rose-200'
                : item.threatTier === 'TIER_2_EUROPA'
                ? 'bg-amber-50/30 border-amber-200'
                : 'bg-slate-50 border-slate-200'
            }`}
          >
            {/* Card top row */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-[11px] font-mono-code px-2.5 py-0.5 rounded-md border ${getTierBadge(item.threatTier)}`}>
                  {getTierLabel(item.threatTier)}
                </span>

                <span className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1">
                  <span>{item.originFlag}</span>
                  <span>{item.forumName}</span>
                </span>

                <span className="text-slate-400">•</span>

                <span className="text-xs text-purple-800 font-mono-code">
                  Auteur: <strong className="text-purple-950">{item.authorHandle}</strong> ({item.authorReputation})
                </span>
              </div>

              <div className="text-xs font-mono-code text-amber-900 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                📅 {item.timestamp}
              </div>
            </div>

            {/* Title & Post Excerpt */}
            <div className="mt-3">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                {item.topicTitle}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-800 bg-white p-3.5 rounded-xl border border-slate-200 font-mono-code leading-relaxed">
                "{item.excerpt}"
              </p>
            </div>

            {/* Metadata Pills */}
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
              <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                <span className="text-[11px] text-slate-500 block font-mono-code font-semibold">BEOOGD DOELWIT</span>
                <span className="font-bold text-rose-800 truncate block text-xs sm:text-sm mt-0.5">
                  {item.targetedSectorOrRegion}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                <span className="text-[11px] text-slate-500 block font-mono-code font-semibold">GEDETECTEERDE TACTIEK</span>
                <span className="font-mono-code font-semibold text-amber-900 truncate block text-xs mt-0.5">
                  {item.detectedTactic}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                <span className="text-[11px] text-slate-500 block font-mono-code font-semibold">ACTOR AFFILIATIE</span>
                <span className="font-bold text-purple-800 truncate block text-xs sm:text-sm mt-0.5">
                  {item.actorAffiliation}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                <span className="text-[11px] text-slate-500 block font-mono-code font-semibold">PRIJS / FORUM LINK</span>
                <span className="font-mono-code font-semibold text-emerald-800 truncate block text-xs mt-0.5">
                  {item.priceListed || item.onionUrlMask}
                </span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-3.5 pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedChatterDetail(item)}
                  className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 text-xs sm:text-sm font-bold border border-slate-300 transition-colors flex items-center justify-center gap-1.5 min-h-[40px] cursor-pointer"
                >
                  <Eye className="w-4 h-4 text-sky-600" />
                  <span>Details &amp; Forum Dossier</span>
                </button>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => onAnalyzeChatterWithAi(item)}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-700 to-rose-600 hover:from-purple-800 hover:to-rose-700 text-white text-xs sm:text-sm font-bold transition-all shadow-sm min-h-[40px] cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>AI Analyse</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dark Web Chatter Detail Modal */}
      {selectedChatterDetail && (
        <div
          onClick={() => setSelectedChatterDetail(null)}
          className="fixed inset-0 z-[70] flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl relative overflow-hidden flex flex-col max-h-[92vh]"
          >
            <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-200">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[11px] font-mono-code px-2.5 py-0.5 rounded-md border ${getTierBadge(selectedChatterDetail.threatTier)}`}>
                    {getTierLabel(selectedChatterDetail.threatTier)}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1">
                    <span>{selectedChatterDetail.originFlag}</span>
                    <span>{selectedChatterDetail.forumName}</span>
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                  {selectedChatterDetail.topicTitle}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedChatterDetail(null)}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 flex-1 overflow-y-auto space-y-4 pr-1 text-xs sm:text-sm">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="text-xs font-mono-code text-purple-800 uppercase font-bold">
                  Onderschept Dark Web Bericht ({selectedChatterDetail.onionUrlMask})
                </div>
                <p className="text-xs sm:text-sm text-slate-800 font-mono-code leading-relaxed bg-white p-3.5 rounded-lg border border-slate-200">
                  "{selectedChatterDetail.excerpt}"
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] font-mono-code text-slate-500 font-semibold block">AUTEUR &amp; REPUTATIE</span>
                  <span className="font-bold text-purple-900 mt-1 block">
                    {selectedChatterDetail.authorHandle} ({selectedChatterDetail.authorReputation})
                  </span>
                  <span className="text-xs text-slate-600 mt-0.5 block">
                    Affiliatie: {selectedChatterDetail.actorAffiliation}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] font-mono-code text-slate-500 font-semibold block">BEOOGD DOELWIT &amp; TACTIEK</span>
                  <span className="font-bold text-rose-800 mt-1 block">
                    {selectedChatterDetail.targetedSectorOrRegion}
                  </span>
                  <span className="text-xs text-amber-900 font-mono-code mt-0.5 block">
                    {selectedChatterDetail.detectedTactic}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1.5">
                <div className="flex items-center gap-1.5 text-emerald-900 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>CSIRT-NL &amp; NCSC Handelingsperspectief</span>
                </div>
                <p className="text-slate-700 leading-relaxed text-xs sm:text-sm">
                  Dit bericht is geautomatiseerd onderschept op {selectedChatterDetail.forumName}. Controleer direct of uw organisatie gebruikmaakt van de genoemde randapparatuur of voorkomt in gelekte stealer-logs, en verifieer FIDO2-MFA op alle externe toegangen.
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between gap-2.5 flex-wrap">
              <button
                type="button"
                onClick={() => {
                  const item = selectedChatterDetail;
                  setSelectedChatterDetail(null);
                  onAnalyzeChatterWithAi(item);
                }}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-700 to-rose-600 hover:from-purple-800 hover:to-rose-700 text-white text-xs sm:text-sm font-bold transition-all cursor-pointer min-h-[42px]"
              >
                <Sparkles className="w-4 h-4" />
                <span>Open in NCSC AI Analyse</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedChatterDetail(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs sm:text-sm font-bold transition-colors cursor-pointer min-h-[42px]"
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
