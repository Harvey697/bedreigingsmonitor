import React, { useState } from 'react';
import {
  Skull,
  Globe2,
  ShieldAlert,
  Terminal,
  ExternalLink,
  ChevronRight,
  Flame,
  Search,
  Filter,
} from 'lucide-react';
import { ThreatActorProfile, ThreatOrigin } from '../types/threat';
import { THREAT_ACTORS } from '../data/threatData';

interface ThreatActorDossierProps {
  onSelectActorForAi: (actor: ThreatActorProfile) => void;
}

export const ThreatActorDossier: React.FC<ThreatActorDossierProps> = ({
  onSelectActorForAi,
}) => {
  const [selectedActor, setSelectedActor] = useState<ThreatActorProfile>(THREAT_ACTORS[0]);
  const [filterOrigin, setFilterOrigin] = useState<'ALL' | ThreatOrigin>('ALL');

  const filteredActors = THREAT_ACTORS.filter((actor) => {
    if (filterOrigin === 'ALL') return true;
    return actor.origin === filterOrigin;
  });

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <span className="p-2 rounded-lg bg-rose-50 text-rose-700 border border-rose-200">
              <Skull className="w-4 h-4" />
            </span>
            Dreigingsactoren Dossiers (Rusland, China, Noord-Korea, Iran &amp; Dark Web)
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Profielen van staatsgesponsorde APT-commando&apos;s en ransomware-syndicaten gericht op westerse infrastructuur
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 rounded-xl border border-slate-200 text-xs overflow-x-auto scrollbar-none max-w-full">
          <button
            onClick={() => setFilterOrigin('ALL')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors shrink-0 min-h-[36px] cursor-pointer ${
              filterOrigin === 'ALL' ? 'bg-white text-slate-900 font-bold shadow-xs border border-slate-200' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Alle ({THREAT_ACTORS.length})
          </button>
          <button
            onClick={() => setFilterOrigin('RUSLAND')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1 shrink-0 min-h-[36px] cursor-pointer ${
              filterOrigin === 'RUSLAND' ? 'bg-rose-600 text-white font-bold shadow-xs' : 'text-slate-700 hover:bg-white'
            }`}
          >
            <span>🇷🇺</span> Rusland
          </button>
          <button
            onClick={() => setFilterOrigin('CHINA')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1 shrink-0 min-h-[36px] cursor-pointer ${
              filterOrigin === 'CHINA' ? 'bg-amber-600 text-white font-bold shadow-xs' : 'text-slate-700 hover:bg-white'
            }`}
          >
            <span>🇨🇳</span> China
          </button>
          <button
            onClick={() => setFilterOrigin('NOORD_KOREA')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1 shrink-0 min-h-[36px] cursor-pointer ${
              filterOrigin === 'NOORD_KOREA' ? 'bg-red-600 text-white font-bold shadow-xs' : 'text-slate-700 hover:bg-white'
            }`}
          >
            <span>🇰🇵</span> Noord-Korea
          </button>
          <button
            onClick={() => setFilterOrigin('IRAN')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1 shrink-0 min-h-[36px] cursor-pointer ${
              filterOrigin === 'IRAN' ? 'bg-emerald-600 text-white font-bold shadow-xs' : 'text-slate-700 hover:bg-white'
            }`}
          >
            <span>🇮🇷</span> Iran
          </button>
        </div>
      </div>

      {/* Main Grid: Actor Selection List (5 cols) & Detail Card (7 cols) */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Actors list */}
        <div className="lg:col-span-5 space-y-2.5 max-h-[540px] overflow-y-auto pr-1">
          {filteredActors.map((actor) => {
            const isSelected = selectedActor.id === actor.id;
            return (
              <button
                key={actor.id}
                onClick={() => setSelectedActor(actor)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer min-h-[64px] ${
                  isSelected
                    ? 'bg-rose-50 border-rose-500 ring-1 ring-rose-400 shadow-xs'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base">
                      {actor.origin === 'RUSLAND' ? '🇷🇺' : actor.origin === 'CHINA' ? '🇨🇳' : actor.origin === 'NOORD_KOREA' ? '🇰🇵' : actor.origin === 'IRAN' ? '🇮🇷' : '🏴‍☠️'}
                    </span>
                    <span className="font-bold text-sm text-slate-900">{actor.name}</span>
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5 line-clamp-1">
                    {actor.sponsorship}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-[11px] font-mono-code font-bold px-2 py-0.5 rounded border ${
                      actor.threatLevel === 'KRITIEK'
                        ? 'bg-rose-100 text-rose-800 border-rose-300'
                        : 'bg-amber-100 text-amber-900 border-amber-300'
                    }`}
                  >
                    {actor.threatLevel}
                  </span>
                  <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-rose-600' : 'text-slate-400'}`} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Actor Detail Dossier */}
        <div className="lg:col-span-7 bg-slate-50 rounded-2xl border border-slate-200 p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 gap-2">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">
                  {selectedActor.origin === 'RUSLAND' ? '🇷🇺' : selectedActor.origin === 'CHINA' ? '🇨🇳' : selectedActor.origin === 'NOORD_KOREA' ? '🇰🇵' : selectedActor.origin === 'IRAN' ? '🇮🇷' : '🏴‍☠️'}
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                    {selectedActor.name}
                  </h3>
                  <div className="text-xs text-slate-600">
                    Aliassen: {selectedActor.aliases.join(', ')}
                  </div>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-md text-xs font-mono-code font-bold bg-rose-100 text-rose-800 border border-rose-300 shrink-0">
                {selectedActor.threatLevel}
              </span>
            </div>

            <p className="mt-3 text-sm text-slate-700 leading-relaxed">
              {selectedActor.description}
            </p>

            {/* Granular details grid */}
            <div className="mt-4 space-y-2.5 text-xs sm:text-sm">
              <div className="p-3 rounded-xl bg-white border border-slate-200">
                <span className="text-[11px] font-mono-code font-bold text-slate-500 block">STAATSSPORING &amp; OPDRACHTGEVER</span>
                <span className="font-bold text-slate-900 mt-0.5 block">{selectedActor.sponsorship}</span>
              </div>

              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200">
                <span className="text-[11px] font-mono-code font-bold text-amber-900 block">FOCUS OP NEDERLANDSE INFRASTRUCTUUR</span>
                <span className="text-slate-800 mt-0.5 block leading-relaxed">{selectedActor.focusOnNetherlands}</span>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200">
                <span className="text-[11px] font-mono-code font-bold text-slate-500 block">KENMERKENDE MALWARE &amp; IMPLANTS</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {selectedActor.signatureMalware.map((mal) => (
                    <span key={mal} className="px-2.5 py-1 rounded-md text-xs font-mono-code bg-rose-50 border border-rose-200 text-rose-800 font-semibold">
                      {mal}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200">
                <span className="text-[11px] font-mono-code font-bold text-slate-500 block">GEËXPLOITEERDE KWETSBAARHEDEN (CVE&apos;S)</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {selectedActor.cvesExploited.map((cve) => (
                    <span key={cve} className="px-2.5 py-1 rounded-md text-xs font-mono-code bg-amber-50 border border-amber-200 text-amber-900 font-semibold">
                      {cve}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-200 flex items-center justify-between gap-2 flex-wrap">
            <span className="text-xs text-slate-600 font-medium">Actief sinds: <strong className="text-slate-900">{selectedActor.activeSince}</strong></span>
            <button
              onClick={() => onSelectActorForAi(selectedActor)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white font-bold text-xs sm:text-sm transition-all shadow-sm min-h-[40px] cursor-pointer"
            >
              Analyseer met AI
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
