import React, { useState } from 'react';
import {
  FileCode,
  Search,
  Download,
  Copy,
  Check,
  ShieldAlert,
  Hash,
  Globe2,
  AlertTriangle,
} from 'lucide-react';
import { IoCEntry } from '../types/threat';
import { INITIAL_IOCS } from '../data/threatData';

export const IoCTracker: React.FC = () => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'SHA256' | 'IP_ADRES' | 'CVE' | 'EXTENSIE'>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredIocs = INITIAL_IOCS.filter((ioc) => {
    if (typeFilter !== 'ALL' && ioc.type !== typeFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        ioc.value.toLowerCase().includes(q) ||
        ioc.associatedThreat.toLowerCase().includes(q) ||
        ioc.actor.toLowerCase().includes(q) ||
        ioc.context.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadCsv = () => {
    const headers = 'ID,Type,Value,Actor,Threat,Severity,Context\n';
    const rows = filteredIocs
      .map(
        (i) =>
          `"${i.id}","${i.type}","${i.value}","${i.actor}","${i.associatedThreat}","${i.severity}","${i.context.replace(/"/g, '""')}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bedreigingsmonitor-nl-iocs-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadJson = () => {
    const jsonStr = JSON.stringify(filteredIocs, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bedreigingsmonitor-nl-iocs-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-sky-50 text-sky-700 border border-sky-200">
              <FileCode className="w-4 h-4" />
            </span>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
              Indicatoren van Inbreuk (IoC Database)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Geverifieerde SHA-256 hashes, kwaadaardige C2 IP-adressen en actieve zero-day CVE&apos;s
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleDownloadCsv}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-semibold border border-slate-300 transition-colors min-h-[40px] cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Exporteer CSV</span>
          </button>
          <button
            onClick={handleDownloadJson}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-semibold border border-slate-300 transition-colors min-h-[40px] cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Exporteer JSON</span>
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3.5">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5 max-w-full sm:flex-wrap">
          <button
            onClick={() => setTypeFilter('ALL')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors shrink-0 min-h-[38px] cursor-pointer ${
              typeFilter === 'ALL'
                ? 'bg-sky-700 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            Alles ({INITIAL_IOCS.length})
          </button>
          <button
            onClick={() => setTypeFilter('CVE')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors shrink-0 min-h-[38px] cursor-pointer ${
              typeFilter === 'CVE'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-white text-amber-900 hover:bg-amber-50 border border-slate-300'
            }`}
          >
            CVE Kwetsbaarheden
          </button>
          <button
            onClick={() => setTypeFilter('SHA256')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors shrink-0 min-h-[38px] cursor-pointer ${
              typeFilter === 'SHA256'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-white text-rose-800 hover:bg-rose-50 border border-slate-300'
            }`}
          >
            Hashes (SHA-256)
          </button>
          <button
            onClick={() => setTypeFilter('IP_ADRES')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors shrink-0 min-h-[38px] cursor-pointer ${
              typeFilter === 'IP_ADRES'
                ? 'bg-purple-700 text-white shadow-sm'
                : 'bg-white text-purple-800 hover:bg-purple-50 border border-slate-300'
            }`}
          >
            C2 IP-Adressen
          </button>
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter IoC waarde..."
            className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:bg-white focus:border-sky-600 transition-colors min-h-[42px]"
          />
        </div>
      </div>

      {/* IoCs List */}
      <div className="mt-4 space-y-2.5">
        {filteredIocs.map((ioc) => (
          <div
            key={ioc.id}
            className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm"
          >
            <div className="space-y-1.5 min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded-md text-[11px] font-mono-code font-bold bg-sky-50 border border-sky-200 text-sky-900">
                  {ioc.type}
                </span>
                <span className="font-mono-code font-bold text-slate-900 text-xs sm:text-sm break-all">
                  {ioc.value}
                </span>
                <span className="text-[11px] font-mono-code font-bold text-rose-800 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md">
                  {ioc.actor}
                </span>
              </div>
              <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                {ioc.context}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <button
                onClick={() => handleCopy(ioc.id, ioc.value)}
                className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold border border-slate-300 transition-colors min-h-[38px] cursor-pointer"
              >
                {copiedId === ioc.id ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700">Gekopieerd</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Kopieer</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
