import React, { useState, useEffect } from 'react';
import {
  Bell,
  BellRing,
  X,
  ShieldAlert,
  Volume2,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { NotificationSettings, ThreatSeverity } from '../types/threat';
import {
  getPushPermissionState,
  isPushSupported,
  requestPushPermission,
  playAlertSound,
} from '../utils/notifications';

interface PushNotificationManagerProps {
  isOpen: boolean;
  onClose: () => void;
  settings: NotificationSettings;
  onUpdateSettings: (newSettings: NotificationSettings) => void;
  onTriggerTestPush: () => void;
}

export const PushNotificationManager: React.FC<PushNotificationManagerProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onTriggerTestPush,
}) => {
  const [permissionState, setPermissionState] = useState<NotificationPermission>('default');
  const [supported, setSupported] = useState<boolean>(true);
  const [justTested, setJustTested] = useState<boolean>(false);

  useEffect(() => {
    setSupported(isPushSupported());
    setPermissionState(getPushPermissionState());
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRequestPermission = async () => {
    const res = await requestPushPermission();
    setPermissionState(res);
    if (res === 'granted') {
      onUpdateSettings({ ...settings, pushEnabled: true });
      playAlertSound('HOOG');
    } else {
      onUpdateSettings({ ...settings, pushEnabled: false });
    }
  };

  const handleTest = () => {
    onTriggerTestPush();
    setJustTested(true);
    setTimeout(() => setJustTested(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 rounded-xl sm:rounded-2xl max-w-lg w-full p-4 sm:p-6 shadow-2xl relative overflow-hidden max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start sm:items-center justify-between gap-2 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 shrink-0">
              <BellRing className="w-5 h-5 animate-pulse" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">Pushberichten & Dreigingsalarm</h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Ontvang directe waarschuwingen bij nieuwe ransomware en darkweb dreigingen
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

        {/* Master 1-Click Disable / Enable Banner */}
        <div className="mt-4 p-4 rounded-xl border bg-slate-50 border-slate-200 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs sm:text-sm font-bold text-slate-900 flex flex-wrap items-center gap-2">
                <span>Status Pushberichten & Pop-up Meldingen</span>
                {settings.pushEnabled || settings.liveSimulationActive || settings.soundEnabled ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Actief
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 bg-white border border-slate-300 px-2 py-0.5 rounded-md">
                    🔕 Uitgeschakeld (Stil)
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Schakel hier in één klik alle pushberichten, pop-up meldingen rechtsonder én geluidssignalen volledig uit of aan.
              </p>
            </div>

            {settings.pushEnabled || settings.liveSimulationActive || settings.soundEnabled ? (
              <button
                type="button"
                onClick={() =>
                  onUpdateSettings({
                    ...settings,
                    pushEnabled: false,
                    liveSimulationActive: false,
                    soundEnabled: false,
                  })
                }
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors shadow-sm shrink-0 cursor-pointer min-h-[40px]"
              >
                🔕 Alles Direct Uitzetten
              </button>
            ) : (
              <button
                type="button"
                onClick={async () => {
                  const res = await requestPushPermission();
                  setPermissionState(res);
                  onUpdateSettings({
                    ...settings,
                    pushEnabled: res === 'granted',
                    liveSimulationActive: true,
                    soundEnabled: true,
                  });
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-sm shrink-0 cursor-pointer min-h-[40px]"
              >
                🔔 Meldingen Inschakelen
              </button>
            )}
          </div>

          <div className="pt-2.5 border-t border-slate-200 flex items-center justify-between gap-2 text-xs flex-wrap">
            <span className="text-slate-600">
              Browser toestemming:{' '}
              <strong className="text-slate-900">
                {permissionState === 'granted'
                  ? 'Toegestaan in browser'
                  : permissionState === 'denied'
                  ? 'Geblokkeerd in browser'
                  : 'Standaard (Uit)'}
              </strong>
            </span>
            {permissionState !== 'granted' ? (
              <button
                type="button"
                onClick={handleRequestPermission}
                className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-800 font-semibold text-xs border border-slate-300 transition-colors cursor-pointer min-h-[36px]"
              >
                Browser Push Toestaan
              </button>
            ) : (
              <button
                type="button"
                onClick={handleTest}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-800 font-semibold text-xs transition-colors border border-slate-300 cursor-pointer min-h-[36px]"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>{justTested ? 'Verzonden!' : 'Verstuur Test'}</span>
              </button>
            )}
          </div>
          {permissionState === 'denied' && (
            <p className="mt-1 text-xs text-rose-700 font-medium">
              Notificaties zijn geblokkeerd in uw browserinstellingen. Klik op het slotje links in uw adresbalk om dit aan te passen.
            </p>
          )}
        </div>

        {/* Filter rules & focus settings */}
        <div className="mt-5 space-y-4">
          <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
            Geopolitieke & Doelwit Filters
          </h3>

          <div className="space-y-2.5">
            {/* Rusland focus */}
            <label className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={settings.notifyOnRussia}
                onChange={(e) => onUpdateSettings({ ...settings, notifyOnRussia: e.target.checked })}
                className="mt-1 rounded border-slate-300 text-rose-600 focus:ring-rose-500 w-4 h-4"
              />
              <div className="text-xs sm:text-sm">
                <div className="font-semibold text-slate-900 flex flex-wrap items-center gap-1.5">
                  <span>🇷🇺 Dreigingen uit Rusland</span>
                  <span className="text-xs bg-rose-50 text-rose-800 px-2 py-0.5 rounded border border-rose-200 font-medium">
                    GRU / Sandworm / LockBit / Basta
                  </span>
                </div>
                <div className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Directe waarschuwing bij ransomware en wipers van Russische oorsprong gericht op Europa.
                </div>
              </div>
            </label>

            {/* China focus */}
            <label className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={settings.notifyOnChina}
                onChange={(e) => onUpdateSettings({ ...settings, notifyOnChina: e.target.checked })}
                className="mt-1 rounded border-slate-300 text-amber-600 focus:ring-amber-500 w-4 h-4"
              />
              <div className="text-xs sm:text-sm">
                <div className="font-semibold text-slate-900 flex flex-wrap items-center gap-1.5">
                  <span>🇨🇳 Dreigingen uit China</span>
                  <span className="text-xs bg-amber-50 text-amber-900 px-2 py-0.5 rounded border border-amber-200 font-medium">
                    Volt Typhoon / Salt Typhoon / MSS
                  </span>
                </div>
                <div className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Waarschuwing bij pre-positioning op kritieke OT/SCADA en telecom backbones.
                </div>
              </div>
            </label>

            {/* Noord-Korea focus */}
            <label className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={settings.notifyOnNorthKorea}
                onChange={(e) => onUpdateSettings({ ...settings, notifyOnNorthKorea: e.target.checked })}
                className="mt-1 rounded border-slate-300 text-rose-600 focus:ring-rose-500 w-4 h-4"
              />
              <div className="text-xs sm:text-sm">
                <div className="font-semibold text-slate-900 flex flex-wrap items-center gap-1.5">
                  <span>🇰🇵 Dreigingen uit Noord-Korea</span>
                  <span className="text-xs bg-rose-50 text-rose-800 px-2 py-0.5 rounded border border-rose-200 font-medium">
                    Lazarus Group / Kimsuky / RGB Eenheid 121
                  </span>
                </div>
                <div className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Crypto/fintech-heists, supply-chain inbraken en spionage op defensie- en maritieme technologie.
                </div>
              </div>
            </label>

            {/* Iran focus */}
            <label className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={settings.notifyOnIran}
                onChange={(e) => onUpdateSettings({ ...settings, notifyOnIran: e.target.checked })}
                className="mt-1 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
              />
              <div className="text-xs sm:text-sm">
                <div className="font-semibold text-slate-900 flex flex-wrap items-center gap-1.5">
                  <span>🇮🇷 Dreigingen uit Iran</span>
                  <span className="text-xs bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200 font-medium">
                    Charming Kitten / MuddyWater / IRGC & MOIS
                  </span>
                </div>
                <div className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Sabotage- en spionagecampagnes gericht op energiehavens, petrochemie en diplomatiek verkeer.
                </div>
              </div>
            </label>

            {/* Dark Web leak blogs focus */}
            <label className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={settings.notifyOnDarkweb}
                onChange={(e) => onUpdateSettings({ ...settings, notifyOnDarkweb: e.target.checked })}
                className="mt-1 rounded border-slate-300 text-purple-600 focus:ring-purple-500 w-4 h-4"
              />
              <div className="text-xs sm:text-sm">
                <div className="font-semibold text-slate-900 flex flex-wrap items-center gap-1.5">
                  <span>🏴‍☠️ Dark Web .Onion Lek-sites & Veilingen</span>
                  <span className="text-xs bg-purple-50 text-purple-800 px-2 py-0.5 rounded border border-purple-200 font-medium">
                    Tor Leaks / Afteltimers
                  </span>
                </div>
                <div className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Melding zodra een nieuw slachtoffer of losgeldafteltimer wordt gepubliceerd op het darkweb.
                </div>
              </div>
            </label>

            {/* Only Dutch vital infra */}
            <label className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-50 border border-amber-200 hover:border-amber-300 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={settings.vitalInfraOnly}
                onChange={(e) => onUpdateSettings({ ...settings, vitalInfraOnly: e.target.checked })}
                className="mt-1 rounded border-amber-300 text-amber-600 focus:ring-amber-500 w-4 h-4"
              />
              <div className="text-xs sm:text-sm">
                <div className="font-semibold text-amber-900 flex items-center gap-1.5">
                  <span>🇳🇱 Filter: Alleen Nederlandse Vitale Infrastructuur</span>
                </div>
                <div className="text-xs text-slate-700 mt-1 leading-relaxed">
                  Beperk meldingen uitsluitend tot Haven Rotterdam, TenneT, Rijkswaterstaat, Telecom, Zorg en Overheid.
                </div>
              </div>
            </label>
          </div>

          {/* Sound & Min Severity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-xs font-semibold text-slate-900 mb-2 flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-emerald-600" /> Audio Alarm
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={settings.soundEnabled}
                  onChange={(e) => onUpdateSettings({ ...settings, soundEnabled: e.target.checked })}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                Cyber chimes afspelen
              </label>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-xs font-semibold text-slate-900 mb-2">Minimale Ernst</div>
              <select
                value={settings.minSeverity}
                onChange={(e) => onUpdateSettings({ ...settings, minSeverity: e.target.value as ThreatSeverity })}
                className="w-full bg-white border border-slate-300 rounded-lg text-xs sm:text-sm py-2 px-2.5 text-slate-900 focus:outline-none focus:border-rose-600 min-h-[40px]"
              >
                <option value="KRITIEK">Alleen KRITIEK</option>
                <option value="HOOG">HOOG & KRITIEK</option>
                <option value="VERHOOGD">VERHOOGD en hoger</option>
                <option value="MATIG">Alle niveaus</option>
              </select>
            </div>
          </div>

          {/* Realtime background simulation */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
            <div>
              <div className="text-xs sm:text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                </span>
                Realtime Simulatie Ticker
              </div>
              <div className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                Simuleert continu live binnenkomende dreigingen om het pushmechanisme te demonstreren.
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={settings.liveSimulationActive}
                onChange={(e) => onUpdateSettings({ ...settings, liveSimulationActive: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-10 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>
        </div>

        {/* Footer actions */}
        <div className="mt-5 sm:mt-6 pt-3 sm:pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <button
            onClick={handleTest}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 text-xs sm:text-sm text-amber-800 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl px-3.5 py-2 transition-colors font-semibold cursor-pointer min-h-[40px]"
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Test Notificatie Nu</span>
          </button>
          <button
            onClick={onClose}
            className="w-full sm:w-auto flex items-center justify-center px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm transition-colors min-h-[40px] cursor-pointer"
          >
            Instellingen Opslaan
          </button>
        </div>
      </div>
    </div>
  );
};
