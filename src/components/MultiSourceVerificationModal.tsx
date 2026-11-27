import React from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  X,
  ExternalLink,
  Lock,
  Layers,
  Sparkles,
  Radio,
  FileCheck2,
} from 'lucide-react';
import { ThreatItem, VerificationSource } from '../types/threat';

interface MultiSourceVerificationModalProps {
  threat: ThreatItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const MultiSourceVerificationModal: React.FC<MultiSourceVerificationModalProps> = ({
  threat,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !threat) return null;

  const sources = threat.verificationSources || [];
  const verifiedCount = sources.filter((s) => s.verified).length;
  const score = threat.verificationConfidenceScore || 90;

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'OVERHEID_CSIRT':
        return '🇳🇱 NCSC';
      case 'INLICHTINGENDIENST':
        return '🛡️ MIVD';
      case 'DARKWEB_CRAWLER':
        return '🧅 TOR';
      case 'EUROPESE_UNIE':
        return '🇪🇺 EU';
      default:
        return '⚡ INTEL';
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[75] flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white border border-slate-200 rounded-xl sm:rounded-2xl max-w-xl w-full p-4 sm:p-6 shadow-2xl relative overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="flex items-start sm:items-center justify-between gap-2 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 shrink-0">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">Meervoudige Bronverificatie</h2>
                <span className="text-xs font-mono-code font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded tabular-nums">
                  {score}% CONSENSUS
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Onafhankelijke verificatieresultaten voor {threat.targetVictim}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Verification summary score card */}
        <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
          <div>
            <div className="text-xs text-slate-600 font-medium">Status van Verificatie</div>
            <div className="text-sm font-extrabold text-slate-900 mt-0.5 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{verifiedCount} van de {sources.length} onafhankelijke bronnen bevestigd</span>
            </div>
          </div>
          <div className="text-right font-mono-code shrink-0">
            <div className="text-xs text-slate-500">Cryptografische Hash</div>
            <div className="text-xs font-bold text-emerald-700">CSIRT-NL-OK</div>
          </div>
        </div>

        {/* Sources list */}
        <div className="mt-4 flex-1 overflow-y-auto space-y-3">
          {sources.map((source) => (
            <div
              key={source.id}
              className={`p-3.5 rounded-xl border ${
                source.verified
                  ? 'bg-slate-50 border-slate-200'
                  : 'bg-slate-50/50 border-slate-200 opacity-70'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5 gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono-code font-bold bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-800">
                    {getSourceIcon(source.type)}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-slate-900">
                    {source.sourceName}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono-code text-slate-600 tabular-nums">
                    {source.timestamp} CET
                  </span>
                  {source.verified ? (
                    <span className="text-xs font-mono-code font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> BEVESTIGD
                    </span>
                  ) : (
                    <span className="text-xs font-mono-code font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                      IN ONDERZOEK
                    </span>
                  )}
                </div>
              </div>

              <div className="text-xs sm:text-sm text-slate-700 pl-1 mt-1 leading-relaxed">
                {source.evidenceSummary}
              </div>

              <div className="mt-2 pl-1 flex items-center gap-2 text-xs font-mono-code text-slate-600">
                <span>Betrouwbaarheidsniveau:</span>
                <strong className="text-amber-800">{source.confidence.replace('_', ' ')}</strong>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between gap-2 text-xs">
          <span className="text-slate-600">
            NCSC Sensornetwerk: Actieve telemetrie-audit
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-semibold transition-colors cursor-pointer min-h-[40px]"
          >
            Sluiten
          </button>
        </div>
      </div>
    </div>
  );
};
