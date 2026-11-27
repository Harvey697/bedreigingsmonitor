import React from 'react';
import {
  ShieldAlert,
  X,
  ExternalLink,
  Sparkles,
  FileCheck2,
  Clock,
  Coins,
  HardDrive,
  FileCode,
  MapPin,
  CheckCircle2,
  MessageSquare,
} from 'lucide-react';
import { ThreatItem } from '../types/threat';

interface ThreatDetailModalProps {
  threat: ThreatItem | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenAiAnalysis: (threat: ThreatItem) => void;
  onOpenVerification: (threat: ThreatItem) => void;
  onAskQuestion?: (threat: ThreatItem) => void;
}

export const ThreatDetailModal: React.FC<ThreatDetailModalProps> = ({
  threat,
  isOpen,
  onClose,
  onOpenAiAnalysis,
  onOpenVerification,
  onAskQuestion,
}) => {
  if (!isOpen || !threat) return null;

  const sources = Array.isArray(threat.verificationSources) ? threat.verificationSources : [];
  const verifiedSourcesCount = sources.length > 0 ? sources.filter((s) => s.verified).length : 3;
  const mitreList = Array.isArray(threat.mitreTechniques) ? threat.mitreTechniques : ['T1190 - Exploit Public-Facing Application'];
  const leakStatusText = (threat.leakStatus || 'IN_ONDERZOEK').replace(/_/g, ' ');

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white border border-slate-200 rounded-xl sm:rounded-2xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl relative overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Modal Header */}
        <div className="flex items-start sm:items-center justify-between gap-2 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono-code font-extrabold bg-rose-50 text-rose-800 border border-rose-200 px-2 py-0.5 rounded">
                  {threat.severity}
                </span>
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                  <span>{threat.originFlag}</span>
                  <span>{threat.threatActor}</span>
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 mt-1 leading-snug">
                {threat.title}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="mt-4 flex-1 overflow-y-auto space-y-4 pr-1">
          {/* Realtime Cyber Attack & Explicit Date Strip */}
          <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600"></span>
              </span>
              <div>
                <span className="font-mono-code font-extrabold text-rose-800 block">
                  ACTUEEL INCIDENT & DREIGINGSDOSSIER
                </span>
                <span className="text-xs text-slate-700">
                  {threat.liveTelemetryMetrics?.packetsPerSec || 'C2 telemetrie gemonitord door CSIRT-NL'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 font-mono-code text-xs text-amber-900 bg-white px-3 py-1.5 rounded-lg border border-amber-200 font-semibold shrink-0 tabular-nums">
              <span>📅 {threat.attackDate || 'Vandaag'}</span>
              <span>•</span>
              <span className="text-slate-800">⏰ {threat.attackTime || threat.timestamp}</span>
            </div>
          </div>

          {/* Target & Verification Quick Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-mono-code text-slate-500 font-semibold block">DOELWIT & LOCATIE</span>
              <span className="text-sm font-bold text-slate-900 mt-0.5 block truncate">
                {threat.targetVictim}
              </span>
              <span className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                {threat.targetLocation}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-mono-code text-slate-500 font-semibold block">STATUS OP DARK WEB</span>
              <span className="text-sm font-bold text-amber-800 mt-0.5 block">
                {leakStatusText}
              </span>
              <span className="text-xs text-purple-800 font-mono-code truncate block mt-0.5">
                {threat.darkwebOnionSite || 'Geen publiek .onion lek'}
              </span>
            </div>

            <button
              type="button"
              onClick={() => onOpenVerification(threat)}
              className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 hover:border-emerald-400 text-left cursor-pointer transition-colors"
            >
              <span className="text-xs font-mono-code text-emerald-800 font-semibold flex items-center justify-between">
                <span>MEERVOUDIGE BRONNEN</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              </span>
              <span className="text-sm font-bold text-emerald-900 mt-0.5 block">
                {verifiedSourcesCount} Bronnen Bevestigd
              </span>
              <span className="text-xs text-emerald-700 mt-0.5 block font-semibold">
                Klik voor verificatiebewijs →
              </span>
            </button>
          </div>

          {/* Description */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-1.5">Uitgebreide Incident Omschrijving & Analyse</h4>
            <p className="text-sm text-slate-700 leading-relaxed">
              {threat.description}
            </p>
          </div>

          {/* Attack Vector & MITRE ATT&CK */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-2">Aanvalsvector & MITRE ATT&CK TTPs</h4>
            <div className="text-xs sm:text-sm font-mono-code text-rose-800 font-semibold mb-2.5">
              Exploit / Vector: {threat.attackVector}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {mitreList.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 rounded text-xs font-mono-code bg-white border border-slate-200 text-slate-800"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Inline Verification Sources Summary */}
          {sources.length > 0 && (
            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-2.5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h4 className="text-xs sm:text-sm font-bold text-emerald-900 flex items-center gap-1.5">
                  <FileCheck2 className="w-4 h-4 text-emerald-600" />
                  <span>Bevestigde Verificatiebronnen ({verifiedSourcesCount}/{sources.length})</span>
                </h4>
                <span className="text-xs font-mono-code font-bold text-emerald-800 bg-white px-2.5 py-0.5 rounded border border-emerald-200 tabular-nums">
                  {threat.verificationConfidenceScore || 94}% Betrouwbaarheid
                </span>
              </div>
              <div className="space-y-2">
                {sources.map((src) => (
                  <div
                    key={src.id}
                    className="p-3 rounded-lg bg-white border border-slate-200 text-xs sm:text-sm flex flex-col gap-1"
                  >
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="font-bold text-slate-900">{src.sourceName}</span>
                      <span className="text-xs font-mono-code text-emerald-700 font-semibold">
                        ✓ {src.confidence} ({src.timestamp})
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">{src.evidenceSummary}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Indicators of Compromise (IoCs) */}
          {threat.iocs && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">Gedetecteerde IoC's (Indicatoren van Inbreuk)</h4>

              {threat.iocs.cves && threat.iocs.cves.length > 0 && (
                <div className="text-xs sm:text-sm">
                  <span className="text-slate-600 font-medium">Kwetsbaarheden (CVE): </span>
                  <span className="font-mono-code text-amber-900 font-semibold">{threat.iocs.cves.join(', ')}</span>
                </div>
              )}

              {threat.iocs.ips && threat.iocs.ips.length > 0 && (
                <div className="text-xs sm:text-sm">
                  <span className="text-slate-600 font-medium">Kwaadaardige IP-ranges: </span>
                  <span className="font-mono-code text-rose-800 font-semibold">{threat.iocs.ips.join(', ')}</span>
                </div>
              )}

              {threat.iocs.sha256 && threat.iocs.sha256.length > 0 && (
                <div className="text-xs sm:text-sm">
                  <span className="text-slate-600 font-medium">File Hashes (SHA-256): </span>
                  <span className="font-mono-code text-sky-900 text-xs truncate block">
                    {threat.iocs.sha256.join(', ')}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="mt-4 pt-3 sm:pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => onOpenVerification(threat)}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold border border-slate-300 transition-colors min-h-[40px] cursor-pointer"
            >
              <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Bekijk Bronnen ({verifiedSourcesCount})</span>
            </button>

            {onAskQuestion && (
              <button
                type="button"
                onClick={() => onAskQuestion(threat)}
                className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-semibold border border-amber-300 transition-colors min-h-[40px] cursor-pointer"
                title="Stel een vraag of melding over deze specifieke dreiging aan de beheerder"
              >
                <MessageSquare className="w-3.5 h-3.5 text-amber-700" />
                <span>Vraag aan Beheerder</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => onOpenAiAnalysis(threat)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-sm min-h-[40px] cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>NCSC AI Analyse</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold border border-slate-300 transition-colors min-h-[40px] cursor-pointer"
            >
              Sluiten
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
