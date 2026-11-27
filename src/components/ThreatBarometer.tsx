import React from 'react';
import {
  ShieldAlert,
  Zap,
  Anchor,
  Waves,
  Wifi,
  HeartPulse,
  CreditCard,
  Building2,
  Apple,
  AlertOctagon,
  ChevronRight,
  Info,
  Plane,
  Cpu,
  FlaskConical,
  GraduationCap,
} from 'lucide-react';
import { VitalSectorDetail, VitalSectorNL } from '../types/threat';
import { VITAL_SECTORS_NL } from '../data/threatData';

interface ThreatBarometerProps {
  selectedSector: VitalSectorNL | 'ALL';
  onSelectSector: (sector: VitalSectorNL | 'ALL') => void;
}

export const ThreatBarometer: React.FC<ThreatBarometerProps> = ({
  selectedSector,
  onSelectSector,
}) => {
  const getSectorIcon = (iconName: string) => {
    switch (iconName) {
      case 'Anchor':
        return <Anchor className="w-4 h-4 text-sky-600" />;
      case 'Zap':
        return <Zap className="w-4 h-4 text-amber-600" />;
      case 'Waves':
        return <Waves className="w-4 h-4 text-blue-600" />;
      case 'Wifi':
        return <Wifi className="w-4 h-4 text-purple-600" />;
      case 'HeartPulse':
        return <HeartPulse className="w-4 h-4 text-rose-600" />;
      case 'CreditCard':
        return <CreditCard className="w-4 h-4 text-emerald-600" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-4 h-4 text-red-600" />;
      case 'Apple':
        return <Apple className="w-4 h-4 text-orange-600" />;
      case 'Plane':
        return <Plane className="w-4 h-4 text-sky-600" />;
      case 'Cpu':
        return <Cpu className="w-4 h-4 text-emerald-700" />;
      case 'FlaskConical':
        return <FlaskConical className="w-4 h-4 text-teal-600" />;
      case 'GraduationCap':
        return <GraduationCap className="w-4 h-4 text-indigo-600" />;
      default:
        return <Building2 className="w-4 h-4 text-slate-600" />;
    }
  };

  const getSeverityBadge = (level: string) => {
    switch (level) {
      case 'KRITIEK':
        return 'bg-rose-50 text-rose-800 border-rose-200 font-bold';
      case 'HOOG':
        return 'bg-amber-50 text-amber-900 border-amber-200 font-semibold';
      case 'VERHOOGD':
        return 'bg-yellow-50 text-yellow-900 border-yellow-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-2.5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700">
              <AlertOctagon className="w-4 h-4" />
            </span>
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
              Nationaal Dreigingsbeeld Vitale Infrastructuur (NCSC Barometer)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Realtime status van alle 12 beschermde vitale sectoren van Nederland (NIS2 Essentieel &amp; Belangrijk)
          </p>
        </div>

        <div className="grid grid-cols-4 sm:flex items-center gap-1 p-1 bg-slate-50 rounded-xl border border-slate-200 text-[11px] font-mono-code text-center shrink-0">
          <div className="px-2 py-1 rounded-lg text-slate-600">1. Normaal</div>
          <div className="px-2 py-1 rounded-lg text-yellow-900 bg-yellow-50">2. Verhoogd</div>
          <div className="px-2 py-1 rounded-lg font-bold text-amber-900 bg-amber-50 border border-amber-200">
            3. Ernstig
          </div>
          <div className="px-2 py-1 rounded-lg font-bold text-rose-800 bg-rose-50 border border-rose-200">
            4. KRITIEK
          </div>
        </div>
      </div>

      <div className="mt-3">
        {selectedSector !== 'ALL' && (
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <span className="text-xs font-semibold text-slate-600">
              Gefilterd op sector:
            </span>
            <button
              onClick={() => onSelectSector('ALL')}
              className="text-xs text-rose-700 hover:text-rose-900 font-semibold transition-colors cursor-pointer"
            >
              ✕ Reset filter
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
          {VITAL_SECTORS_NL.map((sector) => {
            const isSelected = selectedSector === sector.id;
            return (
              <button
                key={sector.id}
                onClick={() => onSelectSector(isSelected ? 'ALL' : sector.id)}
                className={`text-left p-2.5 rounded-xl border transition-all relative overflow-hidden group flex flex-col justify-between cursor-pointer min-h-[82px] ${
                  isSelected
                    ? 'bg-rose-50 border-rose-400 shadow-xs ring-1 ring-rose-400'
                    : 'bg-slate-50/70 border-slate-200 hover:border-slate-300 hover:bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="p-1.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
                      {getSectorIcon(sector.iconName)}
                    </div>
                    <span
                      className={`text-xs font-mono-code font-bold px-2 py-0.5 rounded border ${getSeverityBadge(
                        sector.threatLevel
                      )}`}
                    >
                      {sector.threatLevel}
                    </span>
                  </div>

                  <div className="font-bold text-xs sm:text-sm text-slate-900 truncate" title={sector.name}>
                    {sector.name}
                  </div>
                </div>

                <div className="mt-2 pt-1.5 border-t border-slate-200 flex items-center justify-between text-[11px]">
                  <span className="text-slate-600">
                    Aanvallen: <strong className="text-rose-700 font-mono-code">{sector.activeAttacksCount}</strong>
                  </span>
                  <span className="text-amber-800 font-mono-code font-semibold truncate">
                    NIS2
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
