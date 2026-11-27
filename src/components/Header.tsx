import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Radio,
  FileText,
  MessageSquare,
  RefreshCw,
} from 'lucide-react';
import { NotificationSettings } from '../types/threat';

interface HeaderProps {
  settings: NotificationSettings;
  onUpdateSettings: (newSettings: NotificationSettings) => void;
  onOpenNotificationModal: () => void;
  onTestNotification: () => void;
  onOpenPdfModal?: () => void;
  activeThreatsCount: number;
  dutchVitalCount: number;
  isOwnerMode?: boolean;
  onToggleOwnerMode?: () => void;
  onOpenFeedbackModal?: () => void;
  unreadFeedbackCount?: number;
  lastLiveSyncTime?: string;
  isSyncingLiveFeeds?: boolean;
  onSyncLiveFeeds?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeThreatsCount,
  dutchVitalCount,
  isOwnerMode = false,
  onOpenPdfModal,
  onOpenFeedbackModal,
  unreadFeedbackCount = 0,
  lastLiveSyncTime,
  isSyncingLiveFeeds = false,
  onSyncLiveFeeds,
}) => {
  const [timeStr, setTimeStr] = useState<string>('');
  const [dateStr, setDateStr] = useState<string>('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('nl-NL', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
      setDateStr(
        now.toLocaleDateString('nl-NL', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 sm:gap-3">
          {/* Brand identity & compact mobile summary */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center shrink-0 shadow-sm">
                <ShieldAlert className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-extrabold text-lg sm:text-2xl text-slate-900 tracking-tight truncate">
                    Bedreigingsmonitor<span className="text-emerald-600">.nl</span>
                  </h1>
                  <span className="hidden sm:inline-flex bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md text-xs font-bold uppercase tracking-wide font-mono-code">
                    WEERBAARHEID &amp; ADVIES
                  </span>
                </div>
              </div>
            </div>

            {/* Compact stats on mobile */}
            <div className="flex sm:hidden items-center gap-1.5 text-xs font-mono-code shrink-0">
              <span
                className="bg-rose-50 border border-rose-200 rounded-lg px-2 py-1 text-rose-800 font-bold"
                title="Actieve Dreigingen"
              >
                {activeThreatsCount}
              </span>
              <span
                className="bg-amber-50 border border-amber-200 rounded-lg px-2 py-1 text-amber-900 font-bold"
                title="NL Vitale Infra"
              >
                🇳🇱 {dutchVitalCount}
              </span>
            </div>
          </div>

          {/* Quick actions & live status */}
          <div className="flex items-center flex-wrap gap-2 lg:justify-end">
            {/* Live clock */}
            <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 sm:py-1.5 text-xs font-mono-code shrink-0">
              <span className="text-slate-700 hidden sm:inline">{dateStr}</span>
              <span className="text-slate-300 hidden sm:inline">·</span>
              <span className="text-emerald-700 flex items-center gap-1.5 font-bold">
                <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                <span>{timeStr || '--:--'} CET</span>
              </span>
            </div>

            {/* Prominente Live Sync knop (min 40-44px hoog op mobiel) */}
            {onSyncLiveFeeds && (
              <button
                type="button"
                onClick={onSyncLiveFeeds}
                disabled={isSyncingLiveFeeds}
                className="flex items-center justify-center gap-1.5 min-h-[40px] sm:min-h-[36px] px-3.5 py-2 sm:py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:bg-emerald-400 text-xs sm:text-sm font-mono-code text-white font-bold transition-colors shadow-sm shrink-0 cursor-pointer"
                title="Direct live feeds synchroniseren (Security.NL, NCSC-NL, DIVD, CISA)"
              >
                <RefreshCw className={`w-4 h-4 text-white ${isSyncingLiveFeeds ? 'animate-spin' : ''}`} />
                <span>
                  {isSyncingLiveFeeds
                    ? 'Syncing...'
                    : `Live Sync${lastLiveSyncTime ? ` · ${lastLiveSyncTime}` : ''}`}
                </span>
              </button>
            )}

            {/* Desktop stats */}
            <div className="hidden sm:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs shrink-0">
              <span className="text-slate-600 font-medium">Actieve Dreigingen:</span>
              <span className="font-mono-code font-extrabold text-rose-700 text-sm">{activeThreatsCount}</span>
            </div>

            <div className="hidden sm:flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-1.5 text-xs shrink-0">
              <span className="text-amber-900 font-medium">🇳🇱 Vitale Infra:</span>
              <span className="font-mono-code font-extrabold text-amber-800 text-sm">{dutchVitalCount}</span>
            </div>

            {/* PDF Report button */}
            {onOpenPdfModal && (
              <button
                type="button"
                onClick={onOpenPdfModal}
                className="flex items-center justify-center gap-1.5 min-h-[40px] sm:min-h-[36px] px-3 py-2 sm:py-1.5 rounded-xl bg-white border border-slate-300 hover:border-rose-400 hover:bg-rose-50 text-slate-800 font-semibold text-xs sm:text-sm transition-colors shadow-xs shrink-0 cursor-pointer"
                title="Exporteer actueel CTI directierapport en dashboard overzicht als PDF"
              >
                <FileText className="w-4 h-4 text-rose-600" />
                <span>PDF Rapport</span>
              </button>
            )}

            {/* Vragen & Reactieformulier knop */}
            {onOpenFeedbackModal && (
              <button
                type="button"
                onClick={onOpenFeedbackModal}
                className={`flex items-center justify-center gap-1.5 min-h-[40px] sm:min-h-[36px] px-3 py-2 sm:py-1.5 rounded-xl border font-semibold text-xs sm:text-sm transition-colors shadow-xs shrink-0 cursor-pointer relative ${
                  unreadFeedbackCount > 0 && isOwnerMode
                    ? 'bg-rose-50 border-rose-300 text-rose-900 hover:bg-rose-100'
                    : 'bg-white border-slate-300 hover:border-amber-400 hover:bg-amber-50 text-slate-800'
                }`}
                title={
                  isOwnerMode
                    ? `Beheerder Vragen Inbox: ${unreadFeedbackCount} onbeantwoorde vraag/vragen`
                    : 'Heeft u een vraag of melding? Stel een vraag aan de beheerder'
                }
              >
                <MessageSquare
                  className={`w-4 h-4 ${
                    unreadFeedbackCount > 0 && isOwnerMode ? 'text-rose-600 animate-bounce' : 'text-amber-600'
                  }`}
                />
                <span>{isOwnerMode ? 'Vragen Inbox' : 'Stel een Vraag'}</span>
                {unreadFeedbackCount > 0 && isOwnerMode && (
                  <span className="bg-rose-600 text-white text-xs font-mono-code font-bold px-1.5 py-0.5 rounded-full">
                    {unreadFeedbackCount}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
