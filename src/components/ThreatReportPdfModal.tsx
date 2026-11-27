import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  X,
  ShieldAlert,
  Building2,
  Lock,
  CheckCircle2,
  Sliders,
  Eye,
  Sparkles,
} from 'lucide-react';
import { ThreatItem, VitalSectorNL } from '../types/threat';
import { ExecutiveSummaryData } from './ThreatAnalysisSummary';
import { downloadThreatAnalysisPdf, generateThreatAnalysisPdf, PdfExportOptions } from '../utils/pdfExport';

export interface ThreatReportPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  summaryData: ExecutiveSummaryData;
  threats: ThreatItem[];
  selectedSector?: VitalSectorNL | 'ALL';
}

export const ThreatReportPdfModal: React.FC<ThreatReportPdfModalProps> = ({
  isOpen,
  onClose,
  summaryData,
  threats,
  selectedSector = 'ALL',
}) => {
  const [orgName, setOrgName] = useState<string>('NCSC Veiligheidsregio & Vitale Infrastructuur');
  const [classification, setClassification] = useState<'TLP:CLEAR' | 'TLP:GREEN' | 'TLP:AMBER' | 'TLP:RED'>('TLP:AMBER');
  const [authorName, setAuthorName] = useState<string>('Nationale CTI Threat Desk');
  const [includeSectorBreakdown, setIncludeSectorBreakdown] = useState<boolean>(true);
  const [includeRecommendations, setIncludeRecommendations] = useState<boolean>(true);
  const [includeLiveIncidents, setIncludeLiveIncidents] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'CONFIG' | 'PREVIEW'>('CONFIG');

  if (!isOpen) return null;

  const currentOptions: PdfExportOptions = {
    organizationName: orgName,
    classification,
    authorName,
    includeSectorBreakdown,
    includeRecommendations,
    includeLiveIncidents,
    filterSector: selectedSector,
  };

  const handleDownload = () => {
    setIsExporting(true);
    try {
      downloadThreatAnalysisPdf(summaryData, threats, currentOptions);
    } catch (err) {
      console.error('Fout bij exporteren PDF:', err);
    } finally {
      setTimeout(() => setIsExporting(false), 500);
    }
  };

  const handlePrint = () => {
    try {
      const doc = generateThreatAnalysisPdf(summaryData, threats, currentOptions);
      doc.autoPrint();
      const blobUrl = doc.output('bloburl');
      const printWindow = window.open(blobUrl as unknown as string, '_blank');
      if (printWindow) {
        printWindow.focus();
      }
    } catch (err) {
      console.error('Fout bij printen PDF:', err);
    }
  };

  const tlpBadges = [
    { id: 'TLP:CLEAR', label: 'TLP:CLEAR', desc: 'Openbaar / Ongelimiteerd', color: 'border-slate-400 text-slate-900 bg-slate-100' },
    { id: 'TLP:GREEN', label: 'TLP:GREEN', desc: 'Brede sector & partners', color: 'border-emerald-400 text-emerald-900 bg-emerald-50' },
    { id: 'TLP:AMBER', label: 'TLP:AMBER', desc: 'Beperkt tot organisatie & vitale keten', color: 'border-amber-400 text-amber-900 bg-amber-50' },
    { id: 'TLP:RED', label: 'TLP:RED', desc: 'Strikt vertrouwelijk (alleen directie)', color: 'border-rose-400 text-rose-900 bg-rose-50' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex flex-wrap items-center gap-2">
                <span>Exporteer Threat Briefing (PDF)</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200">
                  CTI-REPORT
                </span>
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Genereer een directierapport voor verantwoording, CISO en toezichthouders.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-200 bg-slate-50/70 px-4 pt-2">
          <button
            onClick={() => setActiveTab('CONFIG')}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer min-h-[40px] ${
              activeTab === 'CONFIG'
                ? 'border-rose-600 text-slate-900'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Rapport Instellingen</span>
          </button>
          <button
            onClick={() => setActiveTab('PREVIEW')}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer min-h-[40px] ${
              activeTab === 'PREVIEW'
                ? 'border-rose-600 text-slate-900'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Document Preview</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {activeTab === 'CONFIG' ? (
            <>
              {/* Organization name */}
              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-slate-500" />
                  Organisatie / Ministerie / Veiligheidsregio
                </label>
                <input
                  type="text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="Bijv. Havenbedrijf Rotterdam N.V. / CISO Office"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:bg-white focus:border-rose-600 min-h-[42px]"
                />
              </div>

              {/* TLP Classification */}
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-amber-600" />
                  TLP Classificatie (FIRST Standards)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {tlpBadges.map((badge) => (
                    <button
                      key={badge.id}
                      type="button"
                      onClick={() => setClassification(badge.id as any)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer min-h-[44px] ${
                        classification === badge.id
                          ? `${badge.color} ring-2 ring-rose-500/25 shadow-xs`
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="font-bold font-mono text-xs">{badge.label}</div>
                      <div className="text-xs text-slate-600 truncate mt-0.5">{badge.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Author name */}
              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-semibold text-slate-800">
                  Opgesteld door (Rapporteur / Analist)
                </label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Bijv. Cyber Threat Intelligence Officer"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:bg-white focus:border-rose-600 min-h-[42px]"
                />
              </div>

              {/* Included Sections */}
              <div className="space-y-2.5 pt-3 border-t border-slate-200">
                <div className="text-xs sm:text-sm font-semibold text-slate-800">Onderdelen in het PDF-rapport:</div>
                <div className="space-y-2.5">
                  <label className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeSectorBreakdown}
                      onChange={(e) => setIncludeSectorBreakdown(e.target.checked)}
                      className="rounded border-slate-300 text-rose-600 focus:ring-rose-500 w-4 h-4"
                    />
                    <span>Sectoranalyse Vitale Infrastructuur Nederland (Haven, Energie, Telecom, etc.)</span>
                  </label>
                  <label className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeRecommendations}
                      onChange={(e) => setIncludeRecommendations(e.target.checked)}
                      className="rounded border-slate-300 text-rose-600 focus:ring-rose-500 w-4 h-4"
                    />
                    <span>Strategische & Directie Maatregelen (Prioriteiten NCSC-NL)</span>
                  </label>
                  <label className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeLiveIncidents}
                      onChange={(e) => setIncludeLiveIncidents(e.target.checked)}
                      className="rounded border-slate-300 text-rose-600 focus:ring-rose-500 w-4 h-4"
                    />
                    <span>Selectie actieve live dreigingen en forensische IoCs</span>
                  </label>
                </div>
              </div>
            </>
          ) : (
            /* PREVIEW TAB */
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 font-sans text-xs sm:text-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded font-mono font-bold text-xs bg-amber-50 text-amber-900 border border-amber-200">
                    {classification}
                  </span>
                  <span className="font-bold text-slate-900 uppercase text-xs tracking-wide">
                    {orgName}
                  </span>
                </div>
                <span className="text-xs text-slate-600 font-medium">2 Pagina's A4</span>
              </div>

              <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200">
                <div className="text-xs font-bold text-rose-800 tabular-nums">
                  DREIGINGSNIVEAU: {summaryData.threatLevel} (Score: {summaryData.threatLevelScore}/100)
                </div>
                <div className="text-sm font-semibold text-slate-900 mt-0.5">{summaryData.summaryTitle}</div>
              </div>

              <div>
                <span className="font-bold text-slate-900">Directiesamenvatting:</span>
                <p className="text-slate-700 text-xs sm:text-sm mt-1 leading-relaxed line-clamp-4">
                  {summaryData.executiveBriefing}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200 text-xs">
                <div>
                  <span className="font-bold text-slate-900">Geraakte Doelwitten:</span>
                  <ul className="text-slate-700 mt-1 space-y-0.5">
                    {summaryData.criticalTargets.slice(0, 3).map((t, i) => (
                      <li key={i}>• {t}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="font-bold text-slate-900">Actieve Actoren:</span>
                  <ul className="text-slate-700 mt-1 space-y-0.5">
                    {summaryData.activeActors.slice(0, 3).map((a, i) => (
                      <li key={i}>• {a.name} ({a.origin})</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-2 text-xs text-slate-600 italic">
                * Het gedownloade PDF-bestand bevat professionele vector-opmaak met NCSC watermerken en authenticatienummer.
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer actions */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <button
            onClick={handlePrint}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 text-xs sm:text-sm font-semibold border border-slate-300 transition-colors min-h-[40px] cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Printoverzicht</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs sm:text-sm font-semibold transition-colors min-h-[40px] cursor-pointer"
            >
              Annuleren
            </button>
            <button
              onClick={handleDownload}
              disabled={isExporting}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold transition-all shadow-sm active:scale-95 disabled:opacity-60 cursor-pointer min-h-[40px]"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'Genereren...' : 'Download PDF Rapport'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
