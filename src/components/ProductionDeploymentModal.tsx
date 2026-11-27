import React, { useState } from 'react';
import {
  Globe,
  Server,
  Radio,
  ShieldCheck,
  Cpu,
  Copy,
  Check,
  ExternalLink,
  X,
  Terminal,
  Zap,
  Lock,
  RefreshCw,
  Bell,
  Code2,
  Database,
  ArrowRight,
  Layers,
  Download,
  Wrench,
  AlertTriangle,
  Eye,
  EyeOff,
  Share2,
} from 'lucide-react';
import { DnsTroubleshooter } from './DnsTroubleshooter';

interface ProductionDeploymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  showHeaderButton?: boolean;
  onToggleHeaderButton?: (show: boolean) => void;
  isOwnerMode?: boolean;
  onToggleOwnerMode?: () => void;
}

type TabKey =
  | 'PROVIDER_WIZARD'
  | 'DNS_TROUBLESHOOTER'
  | 'DOMEIN_DNS'
  | 'HOSTING_DEPLOY'
  | 'REALTIME_ENGINES'
  | 'PUSH_SERVICE';

type DutchProvider = 'TRANSIP' | 'MIJNDOMEIN' | 'HOSTNET' | 'CPANEL_CLOUD86' | 'STRATO';

export const ProductionDeploymentModal: React.FC<ProductionDeploymentModalProps> = ({
  isOpen,
  onClose,
  showHeaderButton = false,
  onToggleHeaderButton,
  isOwnerMode = false,
  onToggleOwnerMode,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('DNS_TROUBLESHOOTER');
  const [selectedProvider, setSelectedProvider] = useState<DutchProvider>('MIJNDOMEIN');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const downloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-5 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-xl sm:rounded-2xl max-w-4xl w-full p-4 sm:p-7 shadow-2xl relative overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 shrink-0">
              <Globe className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono-code font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded">
                  PRODUCTIE HANDLEIDING
                </span>
                <span className="text-xs font-mono-code text-slate-600">
                  bedreigingsmonitor.nl
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 mt-1">
                Online Zetten &amp; DNS Troubleshooter
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Sluiten"
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Visitor Privacy / Admin Mode Banner */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 my-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start sm:items-center gap-2.5">
            <div className={`p-2 rounded-lg shrink-0 border ${showHeaderButton ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
              {showHeaderButton ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-slate-900">Zichtbaarheid Setup-knop:</span>
                <span className={`text-xs font-mono-code font-bold px-2 py-0.5 rounded border ${showHeaderButton ? 'bg-amber-50 text-amber-900 border-amber-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200'}`}>
                  {showHeaderButton ? 'KNOP ZICHTBAAR IN HEADER' : 'VERBORGEN VOOR BEZOEKERS (AANBEVOLEN)'}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                {showHeaderButton
                  ? 'De "Online Zetten" knop staat nu aan in de bovenbalk. Bezoekers kunnen dit ook zien.'
                  : 'Bezoekers zien een strak publiek dashboard zonder setup-knoppen. Jij als beheerder opent dit scherm via de link onderin de footer of sneltoets Ctrl+Shift+D.'}
              </p>
            </div>
          </div>
          {onToggleHeaderButton && (
            <button
              onClick={() => onToggleHeaderButton(!showHeaderButton)}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold shrink-0 transition-all border cursor-pointer min-h-[38px] ${
                showHeaderButton
                  ? 'bg-rose-50 hover:bg-rose-100 text-rose-800 border-rose-200'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
              }`}
            >
              {showHeaderButton ? 'Verberg knop voor bezoekers' : 'Toon knop in navigatie'}
            </button>
          )}
        </div>

        {/* Socials & Media Privacy Banner */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 my-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start sm:items-center gap-2.5">
            <div className={`p-2 rounded-lg shrink-0 border ${isOwnerMode ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-slate-900">Deel op Socials (LinkedIn, X, WhatsApp, Redacties):</span>
                <span className="text-xs font-mono-code font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                  🔒 VERBORGEN VOOR BEZOEKERS • ALLEEN VOOR JOU
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                {isOwnerMode
                  ? 'Eigenaarsmodus is ACTIEF op dit apparaat: jij ziet de "Deel op Socials"-knoppen overal. Externe bezoekers op je domein zien ze NIET.'
                  : 'Bezoekersmodus is ACTIEF: alle "Deel op Socials"-knoppen zijn nu verborgen om te zien wat gewone bezoekers ervaren.'}
              </p>
            </div>
          </div>
          {onToggleOwnerMode && (
            <button
              onClick={onToggleOwnerMode}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold shrink-0 transition-all border cursor-pointer min-h-[38px] ${
                isOwnerMode
                  ? 'bg-blue-50 hover:bg-blue-100 text-blue-800 border-blue-200'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
              }`}
            >
              {isOwnerMode ? 'Test Weergave als Bezoeker' : 'Activeer Eigenaarsmodus (Voor Mij)'}
            </button>
          )}
        </div>

        {/* Tabs Bar */}
        <div className="flex items-center space-x-1.5 overflow-x-auto py-2.5 sm:py-3 border-b border-slate-200 scrollbar-none text-xs font-semibold overscroll-x-contain touch-pan-x">
          <button
            onClick={() => setActiveTab('DNS_TROUBLESHOOTER')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl whitespace-nowrap transition-colors min-h-[38px] cursor-pointer border ${
              activeTab === 'DNS_TROUBLESHOOTER'
                ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                : 'text-rose-800 bg-rose-50 hover:bg-rose-100 border-rose-200'
            }`}
          >
            <Wrench className="w-3.5 h-3.5 shrink-0" />
            <span>DNS Troubleshooter (194.213.127.130)</span>
          </button>

          <button
            onClick={() => setActiveTab('PROVIDER_WIZARD')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl whitespace-nowrap transition-colors min-h-[38px] cursor-pointer border ${
              activeTab === 'PROVIDER_WIZARD'
                ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                : 'text-slate-700 bg-slate-50 border-slate-200 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>🇳🇱 Gids per Provider</span>
          </button>

          <button
            onClick={() => setActiveTab('DOMEIN_DNS')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl whitespace-nowrap transition-colors min-h-[38px] cursor-pointer border ${
              activeTab === 'DOMEIN_DNS'
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                : 'text-slate-700 bg-slate-50 border-slate-200 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Globe className="w-3.5 h-3.5 shrink-0" />
            <span>DNS Records</span>
          </button>

          <button
            onClick={() => setActiveTab('HOSTING_DEPLOY')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl whitespace-nowrap transition-colors min-h-[38px] cursor-pointer border ${
              activeTab === 'HOSTING_DEPLOY'
                ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                : 'text-slate-700 bg-slate-50 border-slate-200 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Server className="w-3.5 h-3.5 shrink-0" />
            <span>Hosting &amp; VPS</span>
          </button>

          <button
            onClick={() => setActiveTab('REALTIME_ENGINES')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl whitespace-nowrap transition-colors min-h-[38px] cursor-pointer border ${
              activeTab === 'REALTIME_ENGINES'
                ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                : 'text-slate-700 bg-slate-50 border-slate-200 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Radio className="w-3.5 h-3.5 shrink-0" />
            <span>24/7 Realtime CTI</span>
          </button>

          <button
            onClick={() => setActiveTab('PUSH_SERVICE')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl whitespace-nowrap transition-colors min-h-[38px] cursor-pointer border ${
              activeTab === 'PUSH_SERVICE'
                ? 'bg-purple-700 text-white border-purple-700 shadow-sm'
                : 'text-slate-700 bg-slate-50 border-slate-200 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Bell className="w-3.5 h-3.5 shrink-0" />
            <span>Web Push &amp; Alerting</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-5 pr-1">
          {/* TAB: DNS TROUBLESHOOTER (NEW) */}
          {activeTab === 'DNS_TROUBLESHOOTER' && (
            <DnsTroubleshooter initialDomain="bedreigingsmonitor.nl" />
          )}

          {/* TAB 0: PROVIDER WIZARD */}
          {activeTab === 'PROVIDER_WIZARD' && (
            <div className="space-y-4">
              {/* Intro Banner */}
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-rose-600 text-white">
                      <Zap className="w-4 h-4" />
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">
                      Snel Online Gaan met bedreigingsmonitor.nl
                    </h3>
                  </div>
                  <span className="text-xs font-mono-code bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded font-bold">
                    KLAAR IN 3-5 MINUTEN
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  Je hebt het domein <strong>bedreigingsmonitor.nl</strong> al. Kies hieronder bij welke provider je domein staat voor de exacte stappen om de website live te zetten:
                </p>
              </div>

              {/* Provider Selection Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-semibold">
                {[
                  { id: 'MIJNDOMEIN', name: 'Mijndomein', sub: 'Mijn Account' },
                  { id: 'TRANSIP', name: 'TransIP', sub: 'Controlepaneel' },
                  { id: 'HOSTNET', name: 'Hostnet', sub: 'Mijn Hostnet' },
                  { id: 'CPANEL_CLOUD86', name: 'Cloud86 / Vimexx', sub: 'cPanel / DirectAdmin' },
                  { id: 'STRATO', name: 'Strato', sub: 'Klantenpaneel' },
                ].map((prov) => (
                  <button
                    key={prov.id}
                    onClick={() => setSelectedProvider(prov.id as DutchProvider)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer min-h-[56px] ${
                      selectedProvider === prov.id
                        ? 'bg-rose-50 border-rose-500 text-slate-900 shadow-sm ring-1 ring-rose-500'
                        : 'bg-white border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-bold text-xs">{prov.name}</div>
                    <div className="text-xs text-slate-600 font-normal mt-0.5">{prov.sub}</div>
                  </button>
                ))}
              </div>

              {/* Special Alert for Mijndomein users */}
              {selectedProvider === 'MIJNDOMEIN' && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-2.5 text-xs">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-rose-900 font-bold block text-xs sm:text-sm">
                        Foutmelding &quot;CNAME conflicteert met een ander record&quot; of A-record op 194.213.127.130?
                      </span>
                      <span className="text-slate-700 text-xs mt-0.5 block">
                        Dit ontstaat omdat subdomein <code className="px-1 py-0.5 bg-white border border-rose-200 rounded">www</code> al naar Mijndomein Hosting wijst. Gebruik onze interactieve troubleshooter!
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('DNS_TROUBLESHOOTER')}
                    className="px-3.5 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs whitespace-nowrap flex items-center justify-center gap-1.5 shadow-sm transition-colors shrink-0 min-h-[38px] cursor-pointer"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>Open DNS Troubleshooter</span>
                  </button>
                </div>
              )}

              {/* Step-by-Step for Selected Provider */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-rose-600" />
                    Handleiding voor {selectedProvider === 'TRANSIP' ? 'TransIP' : selectedProvider === 'MIJNDOMEIN' ? 'Mijndomein' : selectedProvider === 'HOSTNET' ? 'Hostnet' : selectedProvider === 'CPANEL_CLOUD86' ? 'Cloud86 / Vimexx / Antagonist' : 'Strato'}
                  </h4>
                  <span className="text-xs font-mono-code text-slate-600">Domein: bedreigingsmonitor.nl</span>
                </div>

                {/* Twee Smaken: Met Hosting vs. Zonder Hosting */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* OPTIE 1: Snelste Route (Doorsturen / DNS) */}
                  <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-bold text-rose-800 flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-rose-600" /> ROUTE A: DE SNELSTE (DOORSTUREN)
                      </span>
                      <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-bold">
                        AANBEVOLEN
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      Zonder DNS-conflicten en zónder bestanden te hoeven uploaden:
                    </p>
                    <ol className="text-xs sm:text-sm text-slate-700 space-y-1.5 list-decimal list-inside leading-relaxed">
                      {selectedProvider === 'MIJNDOMEIN' && (
                        <>
                          <li>Log in op <strong className="text-slate-900">Mijn Account</strong> bij Mijndomein.</li>
                          <li>Ga naar <strong className="text-slate-900">Domeinnamen</strong> → klik op <strong className="text-slate-900">bedreigingsmonitor.nl</strong>.</li>
                          <li>Kies <strong className="text-slate-900">Doorsturen</strong> (of <em>Domein doorsturen</em>).</li>
                          <li>Vul in: <code className="px-1 py-0.5 bg-slate-100 rounded text-xs break-all">https://ais-pre-ahzjb5b7uvilhl2lxtnytm-84827719818.europe-west2.run.app</code>.</li>
                          <li>Kies voor <strong className="text-slate-900">301 (Permanent)</strong> en vink aan dat <code className="px-1 py-0.5 bg-slate-100 rounded">www</code> ook meegaat.</li>
                          <li>Klik op <strong className="text-slate-900">Opslaan</strong>. Geen CNAME conflict meer!</li>
                        </>
                      )}
                      {selectedProvider === 'TRANSIP' && (
                        <>
                          <li>Log in op <strong className="text-slate-900">TransIP Controlepaneel</strong>.</li>
                          <li>Klik op <strong className="text-slate-900">Domein &amp; Hosting</strong> → kies <strong className="text-slate-900">bedreigingsmonitor.nl</strong>.</li>
                          <li>Scroll naar <strong className="text-slate-900">Geavanceerd domeinbeheer</strong> (of <strong>Doorsturen</strong>).</li>
                          <li>Stel een 301 redirect in naar je live applicatie URL.</li>
                        </>
                      )}
                      {selectedProvider === 'HOSTNET' && (
                        <>
                          <li>Log in op <strong className="text-slate-900">Mijn Hostnet</strong>.</li>
                          <li>Ga naar <strong className="text-slate-900">Diensten</strong> → klik op <strong className="text-slate-900">bedreigingsmonitor.nl</strong>.</li>
                          <li>Kies <strong className="text-slate-900">Doorsturen</strong> en voer de applicatie-URL in.</li>
                        </>
                      )}
                      {selectedProvider === 'CPANEL_CLOUD86' && (
                        <>
                          <li>Log in op je <strong className="text-slate-900">Klantenpaneel (Cloud86 of Vimexx)</strong>.</li>
                          <li>Klik op <strong className="text-slate-900">Domeinen</strong> → <strong>Doorsturen / Redirects</strong>.</li>
                          <li>Voeg de 301 redirect in voor <code className="px-1 py-0.5 bg-slate-100 rounded">bedreigingsmonitor.nl</code>.</li>
                        </>
                      )}
                      {selectedProvider === 'STRATO' && (
                        <>
                          <li>Log in op het <strong className="text-slate-900">Strato Klantenpaneel</strong>.</li>
                          <li>Kies <strong className="text-slate-900">Domeinen</strong> → <strong>Domeinbeheer</strong>.</li>
                          <li>Kies <strong className="text-slate-900">Omleiding / Redirect</strong> en vul de URL in.</li>
                        </>
                      )}
                    </ol>
                  </div>

                  {/* OPTIE 2: Webhostingpakket met Bestandsbeheer / FTP */}
                  <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                        <Server className="w-4 h-4 text-emerald-600 shrink-0" /> ROUTE B: JE EIGEN WEBHOSTINGPAKKET (100% Jouw Domein)
                      </span>
                      <span className="text-xs bg-white text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-mono-code font-bold">
                        GEEN CLOUD RUN LINK • BLIJFT OP BEDREIGINGSMONITOR.NL
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      Nu je een hostingpakket hebt, kun je de complete Bedreigingsmonitor rechtstreeks op jouw server zetten.{' '}
                      Bezoekers blijven op <strong>https://bedreigingsmonitor.nl</strong> en zien nooit de Google URL!
                    </p>

                    {/* Download Package Multi-Format Card */}
                    <div className="p-3.5 rounded-xl bg-white border border-emerald-200 space-y-3">
                      <div>
                        <div className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
                          <Download className="w-4 h-4 text-emerald-600" />
                          <span>Kies jouw gewenste downloadformaat:</span>
                        </div>
                        <div className="text-xs text-slate-600 mt-1 leading-relaxed">
                          Als een ZIP-bestand beschadigd raakt op jouw systeem, kun je nu kiezen voor <strong>TAR.GZ</strong> (speciaal voor Mijn Domein / Linux servers) of direct het <strong>losse index.html bestand</strong> downloaden zonder dat je iets hoeft uit te pakken.
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                        {/* Format 1: TAR.GZ */}
                        <a
                          href="/api/download/hosting-tar"
                          download="bedreigingsmonitor-nl-hosting.tar.gz"
                          className="p-3 rounded-xl bg-emerald-50/60 hover:bg-emerald-50 border border-emerald-300 text-slate-900 font-medium text-xs flex items-center justify-between gap-2 shadow-sm transition-all group min-h-[56px]"
                        >
                          <div className="flex items-center gap-2">
                            <span className="px-1.5 py-1 rounded bg-white border border-emerald-200 text-emerald-800 font-mono-code text-xs font-bold">.TAR.GZ</span>
                            <div>
                              <div className="font-bold text-slate-900 group-hover:text-emerald-800">Linux Tarball (.tar.gz)</div>
                              <div className="text-xs text-slate-600">Ideaal voor Mijn Domein File Manager</div>
                            </div>
                          </div>
                          <Download className="w-4 h-4 text-emerald-600 shrink-0" />
                        </a>

                        {/* Format 2: ZIP */}
                        <a
                          href="/api/download/hosting-package"
                          download="bedreigingsmonitor-nl-hosting.zip"
                          className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-900 font-medium text-xs flex items-center justify-between gap-2 shadow-sm transition-all group min-h-[56px]"
                        >
                          <div className="flex items-center gap-2">
                            <span className="px-1.5 py-1 rounded bg-white border border-sky-200 text-sky-800 font-mono-code text-xs font-bold">.ZIP</span>
                            <div>
                              <div className="font-bold text-slate-900 group-hover:text-sky-800">Standaard ZIP (.zip)</div>
                              <div className="text-xs text-slate-600">Hersteld &amp; gevalideerd archief</div>
                            </div>
                          </div>
                          <Download className="w-4 h-4 text-sky-600 shrink-0" />
                        </a>

                        {/* Format 3: Standalone index.html */}
                        <a
                          href="/api/download/index-html"
                          download="index.html"
                          className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-900 font-medium text-xs flex items-center justify-between gap-2 shadow-sm transition-all group min-h-[56px]"
                        >
                          <div className="flex items-center gap-2">
                            <span className="px-1.5 py-1 rounded bg-white border border-blue-200 text-blue-800 font-mono-code text-xs font-bold">.HTML</span>
                            <div>
                              <div className="font-bold text-slate-900 group-hover:text-blue-800">Losse index.html</div>
                              <div className="text-xs text-slate-600">Zonder ZIP: direct uploaden</div>
                            </div>
                          </div>
                          <Download className="w-4 h-4 text-blue-600 shrink-0" />
                        </a>

                        {/* Format 4: Drop-in Redirect HTML */}
                        <a
                          href="/api/download/redirect-html"
                          download="index.html"
                          className="p-3 rounded-xl bg-amber-50/70 hover:bg-amber-50 border border-amber-300 text-slate-900 font-medium text-xs flex items-center justify-between gap-2 shadow-sm transition-all group min-h-[56px]"
                        >
                          <div className="flex items-center gap-2">
                            <span className="px-1.5 py-1 rounded bg-white border border-amber-200 text-amber-900 font-mono-code text-xs font-bold">1-KLIK</span>
                            <div>
                              <div className="font-bold text-slate-900 group-hover:text-amber-900">Doorstuur-bestand (index.html)</div>
                              <div className="text-xs text-slate-600">Plaats in public_html: direct live</div>
                            </div>
                          </div>
                          <Download className="w-4 h-4 text-amber-600 shrink-0" />
                        </a>
                      </div>
                    </div>

                    <ol className="text-xs sm:text-sm text-slate-700 space-y-2 list-decimal list-inside leading-relaxed bg-white p-3.5 rounded-xl border border-slate-200">
                      <li><strong className="text-slate-900">Kies een bestand:</strong> Download hierboven de <strong>.tar.gz</strong> (of het losse <strong>index.html</strong> bestand).</li>
                      <li><strong className="text-slate-900">Open Bestandsbeheer:</strong> Log in bij Mijn Domein → ga naar je hostingpakket → open <strong>Bestandsbeheer</strong> (File Manager).</li>
                      <li><strong className="text-slate-900">Map public_html:</strong> Open de map <code className="px-1 py-0.5 bg-slate-100 rounded">public_html</code>.</li>
                      <li><strong className="text-slate-900">Uploaden:</strong> Upload het bestand. Als je de <code className="px-1 py-0.5 bg-slate-100 rounded">.tar.gz</code> hebt geüpload, klik je met de rechtermuisknop op <strong>Uitpakken</strong> (Extract).</li>
                      <li><strong className="text-slate-900">Klaar!</strong> Bezoek <code className="px-1 py-0.5 bg-slate-100 rounded">https://bedreigingsmonitor.nl</code>. De monitor draait nu direct!</li>
                    </ol>
                  </div>
                </div>

                {/* htaccess copy helper */}
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-xs font-mono-code text-slate-800 font-bold flex items-center gap-1.5">
                      <Code2 className="w-4 h-4 text-sky-600" /> Optioneel: .htaccess voor HTTPS &amp; Schone URL&apos;s
                    </span>
                    <button
                      onClick={() =>
                        downloadFile(
                          '.htaccess',
                          `# Bedreigingsmonitor.nl - Apache Webhosting Configuratie
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # Forceer HTTPS (automatisch groen slotje)
  RewriteCond %{HTTPS} off
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

  # Single Page Application routering
  RewriteRule ^index\\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
`
                        )
                      }
                      className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 flex items-center gap-1.5 font-bold transition-colors min-h-[36px] cursor-pointer"
                      title="Download los .htaccess bestand (zit al in de zip)"
                    >
                      <Download className="w-3.5 h-3.5 text-sky-600" /> Download losse .htaccess
                    </button>
                  </div>
                  <pre className="bg-slate-50 p-3 rounded-lg border border-slate-200 font-mono-code text-xs text-slate-800 overflow-x-auto">{`<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteCond %{HTTPS} off
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
  RewriteRule ^index\\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>`}</pre>
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: DOMEIN & DNS INSTELLINGEN */}
          {activeTab === 'DOMEIN_DNS' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-blue-600" />
                    Officiële DNS Records voor bedreigingsmonitor.nl
                  </h3>
                  <button
                    onClick={() => setActiveTab('DNS_TROUBLESHOOTER')}
                    className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm min-h-[36px] cursor-pointer"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>Los Conflict op</span>
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  Hieronder vind je de referentie-instellingen voor de DNS-zone. Let op: voeg geen CNAME voor <code className="px-1 py-0.5 bg-white border border-slate-200 rounded">www</code> toe als er al een A-record voor <code className="px-1 py-0.5 bg-white border border-slate-200 rounded">www</code> aanwezig is!
                </p>
              </div>

              {/* DNS Table */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3 overflow-x-auto">
                <table className="w-full text-left text-xs font-mono-code">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-600">
                      <th className="py-2.5 px-3">Type</th>
                      <th className="py-2.5 px-3">Naam</th>
                      <th className="py-2.5 px-3">Waarde / Inhoud</th>
                      <th className="py-2.5 px-3">TTL</th>
                      <th className="py-2.5 px-3 text-right">Kopieer</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-800">
                    <tr>
                      <td className="py-2.5 px-3 text-rose-700 font-bold">A</td>
                      <td className="py-2.5 px-3 font-semibold">@</td>
                      <td className="py-2.5 px-3 text-slate-800 tabular-nums">194.213.127.130 (Mijndomein Server 170)</td>
                      <td className="py-2.5 px-3 text-slate-600 tabular-nums">3600</td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => copyToClipboard('194.213.127.130', 'dns-a')}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 inline-flex items-center justify-center min-w-[34px] min-h-[34px] cursor-pointer"
                          aria-label="Kopieer IP adres"
                        >
                          {copiedKey === 'dns-a' ? <Check className="w-4 h-4 text-emerald-600 inline" /> : <Copy className="w-4 h-4 inline" />}
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 text-sky-700 font-bold">Doorsturen</td>
                      <td className="py-2.5 px-3 font-semibold">*</td>
                      <td className="py-2.5 px-3 text-slate-800 truncate max-w-xs">https://ais-pre-ahzjb5b7uvilhl2lxtnytm-84827719818.europe-west2.run.app</td>
                      <td className="py-2.5 px-3 text-slate-600 tabular-nums">301</td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => copyToClipboard('https://ais-pre-ahzjb5b7uvilhl2lxtnytm-84827719818.europe-west2.run.app', 'dns-fwd')}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 inline-flex items-center justify-center min-w-[34px] min-h-[34px] cursor-pointer"
                          aria-label="Kopieer URL"
                        >
                          {copiedKey === 'dns-fwd' ? <Check className="w-4 h-4 text-emerald-600 inline" /> : <Copy className="w-4 h-4 inline" />}
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Cloudflare tip */}
              <div className="p-4 rounded-xl bg-orange-50 border border-orange-200 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm space-y-1">
                  <strong className="text-slate-900 font-bold block">Aanrader: Koppel Cloudflare DNS (Gratis)</strong>
                  <p className="text-slate-700 leading-relaxed">
                    Als je je domein nameservers omzet naar Cloudflare, krijg je automatisch gratis <strong>DDoS-bescherming</strong>, automatische <strong>SSL (HTTPS)</strong> en Web Application Firewall (WAF). Hierdoor is <em>bedreigingsmonitor.nl</em> zelf beschermd tegen vergeldings-DDoS aanvallen van pro-Kremlin hackersgroepen zoals NoName057(16).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: HOSTING & CLOUD DEPLOY */}
          {activeTab === 'HOSTING_DEPLOY' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Method 1: Google Cloud Run (Huidige Stack) */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-mono-code font-bold text-rose-700 flex items-center gap-1.5">
                      <Cpu className="w-4 h-4" /> METHODE A: GOOGLE CLOUD RUN
                    </span>
                    <span className="text-xs bg-rose-50 text-rose-800 border border-rose-200 px-2 py-0.5 rounded font-bold">
                      AANBEVOLEN
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    Deze app draait momenteel al op <strong>Google Cloud Run</strong> in Europa (europe-west2).
                  </p>
                  <ol className="text-xs sm:text-sm text-slate-700 space-y-1.5 list-decimal list-inside leading-relaxed">
                    <li>Ga naar de <strong className="text-slate-900">Google Cloud Console → Cloud Run</strong>.</li>
                    <li>Selecteer de service van Bedreigingsmonitor.nl.</li>
                    <li>Klik op <strong className="text-slate-900">Custom Domains</strong> → <strong>Add Mapping</strong>.</li>
                    <li>Vul <code className="px-1 py-0.5 bg-white border border-slate-200 rounded">bedreigingsmonitor.nl</code> in. Google geeft je direct de exacte CNAME- en A-records om in te voeren.</li>
                    <li>Google verzorgt automatisch een gratis beheerd SSL-certificaat!</li>
                  </ol>
                </div>

                {/* Method 2: VPS met Docker / Node.js & Nginx */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-mono-code font-bold text-amber-800 flex items-center gap-1.5">
                      <Terminal className="w-4 h-4" /> METHODE B: EIGEN VPS (TRANSIP / HETZNER)
                    </span>
                    <span className="text-xs bg-white text-slate-700 border border-slate-200 px-2 py-0.5 rounded font-mono-code font-semibold">
                      VOLLEDIGE CONTROLE
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    Draai de app op een eigen Linux VPS (Ubuntu 24.04 LTS) met Node 22 en PM2:
                  </p>
                  <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs font-mono-code text-slate-800 space-y-1 overflow-x-auto">
                    <div>git clone &lt;jouw-repo&gt; &amp;&amp; cd app</div>
                    <div>npm install &amp;&amp; npm run build</div>
                    <div>pm2 start server.ts --name &quot;bedreigingsmonitor&quot;</div>
                    <div>certbot --nginx -d bedreigingsmonitor.nl</div>
                  </div>
                </div>
              </div>

              {/* Docker container guide */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-sky-600" />
                  Eén-commando Dockerfile voor Productie
                </h4>
                <p className="text-xs sm:text-sm text-slate-700">
                  De app kan als lichte Docker container verpakt worden en gedeployed worden op elke Docker host:
                </p>
                <div className="bg-white p-3 rounded-lg border border-slate-200 font-mono-code text-xs text-sky-900 overflow-x-auto">
                  docker build -t bedreigingsmonitor . &amp;&amp; docker run -d -p 3000:3000 --name soc-monitor bedreigingsmonitor
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: 24/7 REALTIME ENGINES */}
          {activeTab === 'REALTIME_ENGINES' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                  <Radio className="w-4 h-4 text-sky-600" />
                  Hoe zorg je dat alle cyberaanvallen 24/7 realtime binnenkomen?
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  In een professionele SOC-omgeving haalt de backend data op uit live cyber-inlichtingenbronnen en pusht deze zonder vertraging naar bezoekers:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Source 1 */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="font-bold text-slate-900 flex items-center gap-2 text-xs sm:text-sm">
                    <span className="w-6 h-6 rounded bg-rose-50 text-rose-700 border border-rose-200 flex items-center justify-center font-bold shrink-0">1</span>
                    Dark Web .onion Leak Scrapers
                  </div>
                  <p className="text-slate-700 text-xs leading-relaxed">
                    Een achtergrondworker in <code className="px-1 py-0.5 bg-white border border-slate-200 rounded">server.ts</code> draait met een lokale Tor SOCKS5 proxy (<code className="px-1 py-0.5 bg-white border border-slate-200 rounded">127.0.0.1:9050</code>) en pollt elke 3 minuten openbare Tor-lekblogs (LockBit, Akira, Black Basta, Qilin) voor nieuwe slachtoffers in de .NL zone.
                  </p>
                </div>

                {/* Source 2 */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="font-bold text-slate-900 flex items-center gap-2 text-xs sm:text-sm">
                    <span className="w-6 h-6 rounded bg-amber-50 text-amber-800 border border-amber-200 flex items-center justify-center font-bold shrink-0">2</span>
                    NCSC-NL &amp; CSIRT Telemetrie Feeds
                  </div>
                  <p className="text-slate-700 text-xs leading-relaxed">
                    Koppel de officiële <strong>NCSC-NL RSS / Advisories API</strong> en <strong>CIRCL MISP / OpenCTI</strong> instanties om gevalideerde beveiligingsadviezen en vitale infrastructuur indicatoren (IoCs) direct in de database op te slaan.
                  </p>
                </div>

                {/* Source 3 */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="font-bold text-slate-900 flex items-center gap-2 text-xs sm:text-sm">
                    <span className="w-6 h-6 rounded bg-purple-50 text-purple-800 border border-purple-200 flex items-center justify-center font-bold shrink-0">3</span>
                    Telegram OSINT &amp; Hacktivist Listener
                  </div>
                  <p className="text-slate-700 text-xs leading-relaxed">
                    Gebruik een Telegram client worker (via TDLib / Telethon) die pro-Kremlin kanalen (NoName057, CyberArmyofRussia) monitort op doelwitten in Nederland (zoals Albert Heijn, DigiD, Schiphol).
                  </p>
                </div>

                {/* Source 4 */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="font-bold text-slate-900 flex items-center gap-2 text-xs sm:text-sm">
                    <span className="w-6 h-6 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center font-bold shrink-0">4</span>
                    WebSockets &amp; Server-Sent Events (SSE)
                  </div>
                  <p className="text-slate-700 text-xs leading-relaxed">
                    Zodra de backend een nieuw incident detecteert, stuurt <code className="px-1 py-0.5 bg-white border border-slate-200 rounded">server.ts</code> via WebSockets direct een broadcast naar alle actieve bezoekers. Pagina&apos;s hoeven nooit te herladen!
                  </p>
                </div>
              </div>

              {/* Code snippet example */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-mono-code text-slate-700 block font-bold">
                  VOORBEELD SERVER CRON INGESTION IN SERVER.TS:
                </span>
                <pre className="bg-white p-3 rounded-lg border border-slate-200 font-mono-code text-xs text-slate-800 overflow-x-auto">
                  {`// server.ts achtergrond job (elke 60 sec)
setInterval(async () => {
  const newThreats = await fetchLiveThreatFeeds();
  if (newThreats.length > 0) {
    broadcastToAllClients(newThreats); // Realtime WebSocket Push
    triggerTier1PushNotification(newThreats[0]);
  }
}, 60000);`}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 4: PUSH & SERVICE WORKER */}
          {activeTab === 'PUSH_SERVICE' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                  <Bell className="w-4 h-4 text-purple-600" />
                  Pushmeldingen op Achtergrond (Web Push Protocol)
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  Om te zorgen dat journalisten, CISO&apos;s en beveiligingsteams pushberichten op hun telefoon of Mac/PC ontvangen <em>zelfs als de website gesloten is</em>:
                </p>
              </div>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <strong className="text-slate-900 block font-bold">1. VAPID Keys Genereren</strong>
                  <p className="text-slate-700 leading-relaxed">
                    Genereer een publieke en private VAPID-sleutelset op je server met de <code className="px-1 py-0.5 bg-white border border-slate-200 rounded">web-push</code> package:
                  </p>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200 font-mono-code text-xs text-purple-800">
                    npx web-push generate-vapid-keys
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <strong className="text-slate-900 block font-bold">2. Service Worker Registratie</strong>
                  <p className="text-slate-700 leading-relaxed">
                    De browser van de bezoeker registreert een service worker die luistert naar inkomende pushberichten van Google Cloud Messaging / Apple Push Notification Service.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <strong className="text-slate-900 block font-bold">3. Noodalarm voor Tier 1 NL Vitale Dreigingen</strong>
                  <p className="text-slate-700 leading-relaxed">
                    Bij incidenten zoals de Albert Heijn supply chain aanval of TenneT energienetwerk verstoring wordt automatisch het Tier 1 akoestische alarmsignaal afgespeeld en een prioriteitsbericht afgeleverd.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="text-slate-700 flex items-center gap-1.5 font-mono-code">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Klaar voor productie op <strong>bedreigingsmonitor.nl</strong></span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => copyToClipboard('https://bedreigingsmonitor.nl', 'url')}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 font-semibold transition-colors flex items-center gap-1.5 min-h-[38px] cursor-pointer"
            >
              {copiedKey === 'url' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
              <span>Kopieer Domeinnaam</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold transition-colors min-h-[38px] cursor-pointer"
            >
              Sluiten
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
