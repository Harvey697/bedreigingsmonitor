import React, { useState } from 'react';
import {
  Bell,
  BellRing,
  Volume2,
  VolumeX,
  ShieldCheck,
  AlertTriangle,
  Play,
  CheckCircle2,
  Radio,
  Sliders,
  Sparkles,
  Info,
} from 'lucide-react';
import { NotificationSettings, NotificationTier } from '../types/threat';
import { playTierSound, requestPushPermission, getPushPermissionState } from '../utils/notifications';

interface TieredNotificationConfigProps {
  settings: NotificationSettings;
  onUpdateSettings: (newSettings: NotificationSettings) => void;
  onTriggerTestTierPush: (tier: NotificationTier) => void;
}

export const TieredNotificationConfig: React.FC<TieredNotificationConfigProps> = ({
  settings,
  onUpdateSettings,
  onTriggerTestTierPush,
}) => {
  const [testingTier, setTestingTier] = useState<NotificationTier | null>(null);

  const handleTestTier = (tier: NotificationTier) => {
    setTestingTier(tier);
    playTierSound(tier);
    onTriggerTestTierPush(tier);
    setTimeout(() => setTestingTier(null), 2500);
  };

  const permissionState = getPushPermissionState();

  const handleEnablePush = async () => {
    const res = await requestPushPermission();
    if (res === 'granted') {
      onUpdateSettings({ ...settings, pushEnabled: true });
      playTierSound('TIER_1_NL_VITAAL');
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 shrink-0">
            <BellRing className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
              Getrapt Push-Notificatiesysteem (Tier 1 • Tier 2 • Tier 3)
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Gedifferentieerde akoestische alarmen en waarschuwingen met meervoudige bronverificatie
            </p>
          </div>
        </div>

        {permissionState !== 'granted' && (
          <button
            onClick={handleEnablePush}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm transition-colors shadow-sm min-h-[40px] cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            <span>Activeer Browser Notificaties</span>
          </button>
        )}
      </div>

      {/* The 3 Tiers Grid */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Tier 1 Card */}
        <div className="p-4 rounded-2xl border bg-rose-50/50 border-rose-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="px-2.5 py-0.5 rounded-md text-xs font-mono-code font-extrabold bg-rose-100 text-rose-800 border border-rose-300">
                🔴 TIER 1 ALARM
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableTier1}
                  onChange={(e) => onUpdateSettings({ ...settings, enableTier1: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-600"></div>
              </label>
            </div>

            <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
              Nederlandse Vitale Infrastructuur
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 mt-1 leading-relaxed">
              Acute, hoog-risico cyberaanvallen en ransomware gericht op Haven Rotterdam, TenneT, dijken, water en zorg.
            </p>

            <div className="mt-3 p-2.5 rounded-xl bg-white border border-rose-200 text-xs font-mono-code text-rose-800 font-semibold">
              🔊 Geluid: Urgente Cyber Sirene Klaxon
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-rose-200/80 flex items-center justify-between gap-2">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.tier1Sound}
                onChange={(e) => onUpdateSettings({ ...settings, tier1Sound: e.target.checked })}
                className="w-4 h-4 rounded border-slate-300 text-rose-600 accent-rose-600"
              />
              Sirene actief
            </label>

            <button
              onClick={() => handleTestTier('TIER_1_NL_VITAAL')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors min-h-[38px] cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{testingTier === 'TIER_1_NL_VITAAL' ? 'Alarm Gaat!' : 'Test Tier 1'}</span>
            </button>
          </div>
        </div>

        {/* Tier 2 Card */}
        <div className="p-4 rounded-2xl border bg-amber-50/50 border-amber-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="px-2.5 py-0.5 rounded-md text-xs font-mono-code font-bold bg-amber-100 text-amber-900 border border-amber-300">
                🟠 TIER 2 WAARSCHUWING
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableTier2}
                  onChange={(e) => onUpdateSettings({ ...settings, enableTier2: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
              </label>
            </div>

            <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
              Grootschalige Europese Ransomware
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 mt-1 leading-relaxed">
              Significante ransomware-aanvallen verspreid over Europese landen (Duitsland, Frankrijk, Verenigd Koninkrijk, Baltics).
            </p>

            <div className="mt-3 p-2.5 rounded-xl bg-white border border-amber-200 text-xs font-mono-code text-amber-900 font-semibold">
              🔊 Geluid: Tactische Dubbele Reverb Chime
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-amber-200/80 flex items-center justify-between gap-2">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.tier2Sound}
                onChange={(e) => onUpdateSettings({ ...settings, tier2Sound: e.target.checked })}
                className="w-4 h-4 rounded border-slate-300 text-amber-600 accent-amber-600"
              />
              Beltoon actief
            </label>

            <button
              onClick={() => handleTestTier('TIER_2_EUROPA')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors min-h-[38px] cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{testingTier === 'TIER_2_EUROPA' ? 'Alarm Gaat!' : 'Test Tier 2'}</span>
            </button>
          </div>
        </div>

        {/* Tier 3 Card */}
        <div className="p-4 rounded-2xl border bg-sky-50/50 border-sky-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="px-2.5 py-0.5 rounded-md text-xs font-mono-code font-bold bg-sky-100 text-sky-900 border border-sky-300">
                🟡 TIER 3 DISCUSSIE
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableTier3}
                  onChange={(e) => onUpdateSettings({ ...settings, enableTier3: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-sky-600"></div>
              </label>
            </div>

            <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
              Dark Web Discussies &amp; Rusland/China Chatter
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 mt-1 leading-relaxed">
              Ondergrondse forums (Exploit.in, XSS), initiële toegangsmakelaars en opkomende aanvalstechnieken.
            </p>

            <div className="mt-3 p-2.5 rounded-xl bg-white border border-sky-200 text-xs font-mono-code text-sky-900 font-semibold">
              🔊 Geluid: Sub-Surface Sonar Blip
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-sky-200/80 flex items-center justify-between gap-2">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.tier3Sound}
                onChange={(e) => onUpdateSettings({ ...settings, tier3Sound: e.target.checked })}
                className="w-4 h-4 rounded border-slate-300 text-sky-600 accent-sky-600"
              />
              Puls actief
            </label>

            <button
              onClick={() => handleTestTier('TIER_3_DARKWEB_CHATTER')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-sky-700 hover:bg-sky-800 text-white text-xs font-bold transition-colors min-h-[38px] cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{testingTier === 'TIER_3_DARKWEB_CHATTER' ? 'Puls Klinkt!' : 'Test Tier 3'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Multi-Source Verification Bar */}
      <div className="mt-4 p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-white border border-emerald-200 text-emerald-700 mt-0.5 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 flex items-center gap-2 flex-wrap">
              <span>Meervoudige Bronverificatie Filter</span>
              <span className="text-[11px] font-mono-code bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded border border-emerald-300">
                AANBEVOLEN
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 mt-1 leading-relaxed">
              Stuur uitsluitend pushberichten door wanneer minimaal 2 onafhankelijke bronnen (NCSC-NL, MIVD, Tor Crawler, CERT-EU) de dreiging hebben bevestigd. Voorkomt valse alarmen en geruchten.
            </p>
          </div>
        </div>

        <label className="relative inline-flex items-center cursor-pointer shrink-0 self-end sm:self-center">
          <input
            type="checkbox"
            checked={settings.requireMultiSourceVerification}
            onChange={(e) => onUpdateSettings({ ...settings, requireMultiSourceVerification: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
        </label>
      </div>
    </div>
  );
};
