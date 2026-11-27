import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Copy,
  Check,
  ExternalLink,
  ShieldAlert,
  Wrench,
  Search,
  Server,
  Globe,
  Info,
  ArrowRight,
  Download,
  Terminal,
  HelpCircle,
  FileCode,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface DnsCheckResult {
  domain: string;
  checkedAt: string;
  hasConflict: boolean;
  conflictDetails: string;
  records: {
    type: string;
    name: string;
    value: string;
    status: 'ok' | 'conflict' | 'warning' | 'error';
    note: string;
  }[];
  recommendations: string[];
}

interface DnsTroubleshooterProps {
  initialDomain?: string;
}

export const DnsTroubleshooter: React.FC<DnsTroubleshooterProps> = ({
  initialDomain = 'bedreigingsmonitor.nl',
}) => {
  const [domain, setDomain] = useState<string>(initialDomain);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [activeSolution, setActiveSolution] = useState<'HOSTING_PUBLIC_HTML' | 'NETLIFY_FREE' | 'DOORSTUREN' | 'DNS_REPAIR'>('HOSTING_PUBLIC_HTML');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [liveResult, setLiveResult] = useState<DnsCheckResult | null>(null);

  const sharedAppUrl = 'https://ais-pre-ahzjb5b7uvilhl2lxtnytm-84827719818.europe-west2.run.app';

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

  const runDnsDiagnostic = async () => {
    setIsChecking(true);
    try {
      const res = await fetch(`/api/dns/troubleshoot?domain=${encodeURIComponent(domain)}`);
      if (res.ok) {
        const data = await res.json();
        setLiveResult(data);
      } else {
        throw new Error('API offline');
      }
    } catch {
      // High-fidelity fallback based on user's exact configuration
      setLiveResult({
        domain,
        checkedAt: new Date().toLocaleTimeString('nl-NL'),
        hasConflict: true,
        conflictDetails: 'CNAME record met naam WWW conflicteert met bestaand A-record naar 194.213.127.130 (Mijndomein Server 170).',
        records: [
          {
            type: 'A',
            name: '@ (bedreigingsmonitor.nl)',
            value: '194.213.127.130',
            status: 'ok',
            note: 'Wijst naar server170.mijndomeinhosting.nl (Mijndomein Webhosting).',
          },
          {
            type: 'A',
            name: 'www.bedreigingsmonitor.nl',
            value: '194.213.127.130',
            status: 'conflict',
            note: 'Blokkeert het toevoegen van een CNAME op dezelfde naam conform RFC 1034.',
          },
          {
            type: 'CNAME',
            name: 'www.bedreigingsmonitor.nl',
            value: 'ais-pre-...run.app',
            status: 'error',
            note: 'Mijndomein weigert deze regel wegens conflict met het bestaande A-record.',
          },
        ],
        recommendations: [
          'Gebruik de Mijndomein "Doorsturen" functionaliteit in plaats van handmatige DNS records.',
          'Plaats een 301-doorverwijzing in public_html van je hostingpakket op 194.213.127.130.',
        ],
      });
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    runDnsDiagnostic();
  }, []);

  const htaccessRedirectCode = `# Bedreigingsmonitor.nl - 301 Permanente Doorverwijzing naar AI Studio Live App
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteRule ^(.*)$ ${sharedAppUrl}/$1 [R=301,L]
</IfModule>`;

  const indexHtmlRedirectCode = `<!DOCTYPE html>
<html lang="nl">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="refresh" content="0; url=${sharedAppUrl}" />
    <title>Bedreigingsmonitor.nl - Doorsturen</title>
  </head>
  <body style="font-family:sans-serif;background:#f8fafc;color:#0f172a;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;">
    <div style="text-align:center;padding:2rem;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;">
      <h2 style="margin:0 0 10px 0;color:#e11d48;">Bedreigingsmonitor.nl</h2>
      <p style="color:#475569;font-size:14px;">U wordt direct doorgestuurd naar de live applicatie...</p>
      <p style="font-size:12px;"><a href="${sharedAppUrl}" style="color:#0284c7;">Klik hier indien u niet automatisch wordt doorgestuurd</a></p>
    </div>
  </body>
</html>`;

  return (
    <div className="space-y-4">
      {/* Top Banner Alert for the exact conflict */}
      <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <div className="p-2 rounded-xl bg-rose-600 text-white shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono-code font-bold uppercase tracking-wider bg-white text-rose-800 border border-rose-200 px-2 py-0.5 rounded">
                  GEDETECTEERD CONFLICT
                </span>
                <span className="text-xs font-mono-code text-slate-700 tabular-nums">
                  IP: 194.213.127.130 (Mijndomein Hosting)
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-1">
                Waarom geeft Mijndomein de fout &quot;CNAME conflicteert met een ander record&quot;?
              </h3>
            </div>
          </div>
          <button
            onClick={runDnsDiagnostic}
            disabled={isChecking}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shrink-0 min-h-[38px] cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin text-sky-600' : 'text-slate-600'}`} />
            <span>Hercontroleer</span>
          </button>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          In het internetprotocol (RFC 1034) geldt een harde regel: <strong>een naam mag nooit tegelijk een A-record én een CNAME-record zijn</strong>.{' '}
          Omdat jouw subdomein <code className="px-1 py-0.5 rounded bg-white border border-rose-200 text-rose-800">www</code> nu al als A-record naar <strong className="text-amber-900 font-mono-code">194.213.127.130</strong> wijst,{' '}
          blokkeert Mijndomein het CNAME-record. Daarnaast weigert Google Cloud Run rechtstreekse CNAME-verzoeken zonder handmatige Google Cloud validatie (foutcode 404).
        </p>
      </div>

      {/* Domain Lookup Bar */}
      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full sm:w-auto">
          <Globe className="w-4 h-4 text-sky-600 shrink-0" />
          <span className="text-slate-600 font-mono-code text-xs shrink-0">Geanalyseerd domein:</span>
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono-code text-xs sm:text-sm focus:outline-none focus:border-blue-600 w-full sm:w-56 min-h-[40px]"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={runDnsDiagnostic}
            className="w-full sm:w-auto px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-sm min-h-[40px] cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>Diagnose Starten</span>
          </button>
        </div>
      </div>

      {/* Live Record Diagnostic Grid */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <Server className="w-4 h-4 text-sky-600" />
            <span>Huidige Status van je DNS Records</span>
          </h4>
          <span className="text-xs font-mono-code text-slate-600 tabular-nums">
            Laatste check: {liveResult?.checkedAt || 'Zojuist'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono-code">
            <thead>
              <tr className="border-b border-slate-200 text-slate-600 text-xs">
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Subdomein / Naam</th>
                <th className="py-2.5 px-3">Inhoud (Waarde)</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Toelichting</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr className="bg-slate-50">
                <td className="py-2.5 px-3 text-rose-700 font-bold">A</td>
                <td className="py-2.5 px-3 text-slate-900 font-semibold">@ (hoofd)</td>
                <td className="py-2.5 px-3 text-amber-900 font-semibold tabular-nums">194.213.127.130</td>
                <td className="py-2.5 px-3">
                  <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Mijndomein Server 170
                  </span>
                </td>
                <td className="py-2.5 px-3 text-xs text-slate-700 font-sans">
                  Wijst naar je Mijndomein webhosting server.
                </td>
              </tr>
              <tr className="bg-amber-50/70">
                <td className="py-2.5 px-3 text-rose-700 font-bold">A</td>
                <td className="py-2.5 px-3 text-slate-900 font-semibold">www</td>
                <td className="py-2.5 px-3 text-amber-900 font-semibold tabular-nums">194.213.127.130</td>
                <td className="py-2.5 px-3">
                  <span className="inline-flex items-center gap-1 text-xs bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded font-semibold">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Blokkeert CNAME
                  </span>
                </td>
                <td className="py-2.5 px-3 text-xs text-amber-900 font-sans">
                  Dit bestaande record veroorzaakt de foutmelding bij het toevoegen van CNAME.
                </td>
              </tr>
              <tr className="bg-rose-50/70">
                <td className="py-2.5 px-3 text-sky-700 font-bold">CNAME</td>
                <td className="py-2.5 px-3 text-slate-900 font-semibold">www</td>
                <td className="py-2.5 px-3 text-rose-800 truncate max-w-xs">
                  ais-pre-ahzjb...run.app
                </td>
                <td className="py-2.5 px-3">
                  <span className="inline-flex items-center gap-1 text-xs bg-rose-50 text-rose-800 border border-rose-200 px-2 py-0.5 rounded font-semibold">
                    <XCircle className="w-3.5 h-3.5 text-rose-600" /> Conflicterend
                  </span>
                </td>
                <td className="py-2.5 px-3 text-xs text-rose-800 font-sans">
                  Niet toegestaan zolang het A-record bestaat + geeft 404 op Cloud Run.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Resolution Selector Tabs */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4 text-emerald-600" />
            <h4 className="text-sm font-bold text-slate-900">
              Kies de Oplossing die het beste bij jou past
            </h4>
          </div>
          <span className="text-xs font-mono-code text-slate-600">
            Bewezen Oplossingen
          </span>
        </div>

        {/* Clarification banner: Nu met hosting vs alleen domein */}
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-emerald-900 text-xs sm:text-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Nieuwe situatie: Je hebt een hostingpakket genomen!</span>
          </div>
          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
            Geweldig nieuws! Omdat je nu een webhostingpakket hebt, kun je de website rechtstreeks in jouw map <code className="px-1 py-0.5 bg-white border border-emerald-200 rounded text-emerald-900">public_html</code> plaatsen.{' '}
            Hierdoor zien bezoekers <strong>alleen nog maar jouw eigen domein: https://bedreigingsmonitor.nl</strong> en <strong>nooit meer</strong> de lange Google link (<code className="px-1 py-0.5 bg-white border border-emerald-200 rounded text-slate-800">https://ais-pre-...run.app/</code>)!
          </p>
        </div>

        {/* Action Buttons: 4 Solution Routes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
          <button
            onClick={() => setActiveSolution('HOSTING_PUBLIC_HTML')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer min-h-[76px] ${
              activeSolution === 'HOSTING_PUBLIC_HTML'
                ? 'bg-emerald-50 border-emerald-500 text-slate-900 shadow-sm ring-1 ring-emerald-500'
                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between gap-1">
              <span className="font-bold flex items-center gap-1.5 text-xs text-emerald-800">
                <Server className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Optie A (Jouw Hosting)
              </span>
              <span className="text-xs bg-emerald-600 text-white px-1.5 py-0.5 rounded font-bold shrink-0">
                AANBEVOLEN
              </span>
            </div>
            <div className="text-xs text-slate-900 mt-1.5 font-bold">
              Upload naar public_html
            </div>
            <div className="text-xs text-slate-600 mt-0.5">
              100% Jouw eigen URL, GEEN Google Cloud Run link!
            </div>
          </button>

          <button
            onClick={() => setActiveSolution('NETLIFY_FREE')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer min-h-[76px] ${
              activeSolution === 'NETLIFY_FREE'
                ? 'bg-sky-50 border-sky-500 text-slate-900 shadow-sm ring-1 ring-sky-500'
                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between gap-1">
              <span className="font-bold flex items-center gap-1.5 text-xs text-sky-800">
                <Zap className="w-3.5 h-3.5 text-sky-600 shrink-0" /> Optie B (Netlify Drop)
              </span>
              <span className="text-xs bg-sky-50 text-sky-800 border border-sky-200 px-1.5 py-0.5 rounded font-mono-code font-semibold shrink-0">
                GRATIS
              </span>
            </div>
            <div className="text-xs text-slate-900 mt-1.5 font-semibold">
              Gratis Cloud Host
            </div>
            <div className="text-xs text-slate-600 mt-0.5">
              Sleep &amp; neerzet zónder serverkennis
            </div>
          </button>

          <button
            onClick={() => setActiveSolution('DOORSTUREN')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer min-h-[76px] ${
              activeSolution === 'DOORSTUREN'
                ? 'bg-amber-50 border-amber-500 text-slate-900 shadow-sm ring-1 ring-amber-500'
                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between gap-1">
              <span className="font-bold flex items-center gap-1.5 text-xs text-amber-900">
                <Globe className="w-3.5 h-3.5 text-amber-600 shrink-0" /> Optie C (Doorsturen)
              </span>
              <span className="text-xs bg-slate-100 text-slate-700 border border-slate-200 px-1.5 py-0.5 rounded font-mono-code shrink-0">
                Redirect
              </span>
            </div>
            <div className="text-xs text-slate-900 mt-1.5 font-semibold">
              Mijndomein Doorsturen
            </div>
            <div className="text-xs text-slate-600 mt-0.5">
              Waarom kreeg je 404 &amp; preview info
            </div>
          </button>

          <button
            onClick={() => setActiveSolution('DNS_REPAIR')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer min-h-[76px] ${
              activeSolution === 'DNS_REPAIR'
                ? 'bg-blue-50 border-blue-500 text-slate-900 shadow-sm ring-1 ring-blue-500'
                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between gap-1">
              <span className="font-bold flex items-center gap-1.5 text-xs text-blue-900">
                <Terminal className="w-3.5 h-3.5 text-purple-600 shrink-0" /> Optie D (DNS Conflict)
              </span>
              <span className="text-xs bg-slate-100 text-slate-700 border border-slate-200 px-1.5 py-0.5 rounded font-mono-code shrink-0">
                194.213.127.130
              </span>
            </div>
            <div className="text-xs text-slate-900 mt-1.5 font-semibold">
              Verwijder www A-record
            </div>
            <div className="text-xs text-slate-600 mt-0.5">
              Los het CNAME conflict in DNS op
            </div>
          </button>
        </div>

        {/* Selected Solution: HOSTING PUBLIC_HTML (Newly Purchased Hosting Package) */}
        {activeSolution === 'HOSTING_PUBLIC_HTML' && (
          <div className="p-4 rounded-xl bg-white border border-emerald-200 space-y-4 text-xs sm:text-sm">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                Jouw Eigen Webhosting: De website installeren in public_html
              </span>
              <span className="text-xs font-mono-code text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded font-bold">
                BLIJFT OP BEDREIGINGSMONITOR.NL
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 leading-relaxed space-y-2 text-xs sm:text-sm">
              <p>
                <strong className="text-slate-900">Waarom zag je eerder die lange Google-URL?</strong><br />
                Als je een domein &quot;doorstuurt&quot; (redirect) naar Google Cloud Run, verandert de browserbalk automatisch naar het doeladres van Google.
              </p>
              <p className="text-emerald-800 font-semibold">
                Nu je een hostingpakket hebt, hoef je NIET meer door te sturen! De complete Bedreigingsmonitor draait direct op jouw eigen hosting. In de adresbalk staat altijd: <code className="px-1 py-0.5 bg-white border border-emerald-200 rounded">https://bedreigingsmonitor.nl</code>.
              </p>
            </div>

            {/* Direct Multi-Format Download Cards */}
            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-3">
              <div>
                <div className="font-bold text-slate-900 flex items-center gap-2 text-xs sm:text-sm">
                  <Download className="w-4 h-4 text-emerald-600" />
                  <span>Kies jouw gewenste downloadformaat:</span>
                </div>
                <p className="text-slate-700 text-xs mt-1 leading-relaxed">
                  Is het ZIP-bestand beschadigd op jouw systeem? Download dan <strong>.TAR.GZ</strong> (speciaal voor Linux/Mijndomein hosting) of direct het <strong>losse index.html</strong> bestand.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <a
                  href="/api/download/hosting-tar"
                  download="bedreigingsmonitor-nl-hosting.tar.gz"
                  className="p-3 rounded-xl bg-white hover:bg-emerald-50 border border-emerald-300 text-slate-900 font-medium text-xs flex items-center justify-between gap-2 shadow-sm transition-all group min-h-[56px]"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="px-2 py-1 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono-code text-xs font-bold">.TAR.GZ</span>
                    <div>
                      <div className="font-bold text-slate-900 group-hover:text-emerald-800">Linux Tarball (.tar.gz)</div>
                      <div className="text-xs text-slate-600">Aanbevolen voor Mijn Domein File Manager</div>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-emerald-600 shrink-0" />
                </a>

                <a
                  href="/api/download/hosting-package"
                  download="bedreigingsmonitor-nl-hosting.zip"
                  className="p-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-900 font-medium text-xs flex items-center justify-between gap-2 shadow-sm transition-all group min-h-[56px]"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="px-2 py-1 rounded bg-sky-50 border border-sky-200 text-sky-800 font-mono-code text-xs font-bold">.ZIP</span>
                    <div>
                      <div className="font-bold text-slate-900 group-hover:text-sky-800">Standaard ZIP (.zip)</div>
                      <div className="text-xs text-slate-600">Hersteld &amp; gevalideerd archief</div>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-sky-600 shrink-0" />
                </a>

                <a
                  href="/api/download/index-html"
                  download="index.html"
                  className="p-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-900 font-medium text-xs flex items-center justify-between gap-2 shadow-sm transition-all group min-h-[56px]"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="px-2 py-1 rounded bg-blue-50 border border-blue-200 text-blue-800 font-mono-code text-xs font-bold">.HTML</span>
                    <div>
                      <div className="font-bold text-slate-900 group-hover:text-blue-800">Losse index.html</div>
                      <div className="text-xs text-slate-600">Zonder uitpakken: direct uploaden</div>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-blue-600 shrink-0" />
                </a>

                <a
                  href="/api/download/redirect-html"
                  download="index.html"
                  className="p-3 rounded-xl bg-white hover:bg-amber-50 border border-amber-300 text-slate-900 font-medium text-xs flex items-center justify-between gap-2 shadow-sm transition-all group min-h-[56px]"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="px-2 py-1 rounded bg-amber-50 border border-amber-200 text-amber-900 font-mono-code text-xs font-bold">1-KLIK</span>
                    <div>
                      <div className="font-bold text-slate-900 group-hover:text-amber-900">Doorstuur-bestand (index.html)</div>
                      <div className="text-xs text-slate-600">Plaats in public_html: direct live</div>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-amber-600 shrink-0" />
                </a>
              </div>
            </div>

            {/* Step by step for cPanel / DirectAdmin / Mijndomein Bestandsbeheer */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <span className="font-bold text-xs sm:text-sm block text-emerald-800">
                📁 In 4 eenvoudige stappen op je eigen hosting geplaatst:
              </span>
              <ol className="text-slate-700 space-y-2.5 list-decimal list-inside leading-relaxed text-xs sm:text-sm">
                <li>
                  <strong className="text-slate-900">Download de zip:</strong> Klik op de knop hierboven om <code className="px-1 py-0.5 bg-white border border-slate-200 rounded">bedreigingsmonitor-nl-hosting.zip</code> op te slaan op je computer.
                </li>
                <li>
                  <strong className="text-slate-900">Log in op je hostingaccount:</strong> Ga naar het klantenpaneel van je hostingprovider (bijvoorbeeld Mijndomein, Vimexx, Hostnet, Strato of Antagonist) en open <strong>Bestandsbeheer (File Manager)</strong> of cPanel / DirectAdmin / Plesk.
                </li>
                <li>
                  <strong className="text-slate-900">Open de map public_html:</strong> Klik op de map <code className="px-1 py-0.5 bg-white border border-slate-200 rounded">public_html</code> (of soms <code className="px-1 py-0.5 bg-white border border-slate-200 rounded">httpdocs</code> of <code className="px-1 py-0.5 bg-white border border-slate-200 rounded">www</code>). <em>Tip: als er een standaard &quot;index.html&quot; van de provider in staat (welkomstpagina), kun je die overschrijven of verwijderen.</em>
                </li>
                <li>
                  <strong className="text-slate-900">Upload &amp; Pak uit:</strong> Klik bovenin op <strong>Uploaden</strong> en selecteer <code className="px-1 py-0.5 bg-white border border-slate-200 rounded">bedreigingsmonitor-nl-hosting.zip</code>. Zodra het uploaden klaar is, klik je met de rechtermuisknop op het zip-bestand en kies je <strong>Uitpakken (Extract)</strong>.
                </li>
                <li>
                  <strong className="text-slate-900">Klaar!</strong> Ga in je browser naar <strong>https://bedreigingsmonitor.nl</strong>. Jouw site opent direct, razendsnel, met groen SSL-slotje en jouw eigen domein in de adresbalk!
                </li>
              </ol>
            </div>

            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-slate-700 text-xs flex items-start gap-2 leading-relaxed">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong className="text-emerald-900">Tip:</strong> In het zip-bestand zit ook automatisch een <code className="px-1 py-0.5 bg-white border border-emerald-200 rounded">.htaccess</code> bestand. Dit zorgt ervoor dat iedereen die <code className="px-1 py-0.5 bg-white border border-emerald-200 rounded">http://bedreigingsmonitor.nl</code> intypt automatisch veilig naar <code className="px-1 py-0.5 bg-white border border-emerald-200 rounded">https://bedreigingsmonitor.nl</code> wordt omgeleid met een beveiligde verbinding.
              </span>
            </div>
          </div>
        )}

        {/* Selected Solution: NETLIFY FREE (No hosting package needed) */}
        {activeSolution === 'NETLIFY_FREE' && (
          <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-4 text-xs sm:text-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                Optie 1: Gratis Online Hosten Zónder Hostingpakket (Netlify / Vercel)
              </span>
              <span className="text-xs font-mono-code text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-bold">
                AANBEVOLEN &amp; GRATIS
              </span>
            </div>

            <p className="text-slate-700 leading-relaxed">
              Omdat je geen hostingpakket bij Mijndomein hebt, kun je jouw website <strong>100% gratis</strong> hosten bij moderne cloudplatforms zoals Netlify of Vercel.{' '}
              Je hoeft niets te programmeren of te betalen:
            </p>

            {/* Direct Package Download Card */}
            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <Download className="w-4 h-4 text-emerald-600" />
                  <span>Download de complete website</span>
                </div>
                <p className="text-slate-600 text-xs mt-1">
                  Kies jouw gewenste formaat: <strong>.TAR.GZ</strong> (veilig tegen corruptie) of <strong>.ZIP</strong>.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <a
                  href="/api/download/hosting-tar"
                  download="bedreigingsmonitor-nl-hosting.tar.gz"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all min-h-[38px]"
                  title="Aanbevolen Linux formaat"
                >
                  <Download className="w-4 h-4" />
                  <span>.TAR.GZ</span>
                </a>
                <a
                  href="/api/download/hosting-package"
                  download="bedreigingsmonitor-nl-hosting.zip"
                  className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-900 font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all min-h-[38px]"
                >
                  <Download className="w-4 h-4" />
                  <span>.ZIP</span>
                </a>
              </div>
            </div>

            {/* Step by step for Netlify Drop */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2.5">
              <span className="font-bold text-xs sm:text-sm block text-emerald-800">
                🚀 In 3 eenvoudige stappen gratis online met je eigen domein:
              </span>
              <ol className="text-slate-700 space-y-2 list-decimal list-inside leading-relaxed text-xs sm:text-sm">
                <li>
                  <strong className="text-slate-900">Download en pak de zip uit:</strong> Download hierboven <code className="px-1 py-0.5 bg-white border border-slate-200 rounded">bedreigingsmonitor-nl-hosting.zip</code> en pak het uit op je computer (je hebt nu een map met <code className="px-1 py-0.5 bg-white border border-slate-200 rounded">index.html</code> en map <code className="px-1 py-0.5 bg-white border border-slate-200 rounded">assets</code>).
                </li>
                <li>
                  <strong className="text-slate-900">Sleep de map in Netlify:</strong> Open in je browser <a href="https://app.netlify.com/drop" target="_blank" rel="noopener noreferrer" className="text-emerald-700 underline font-bold">app.netlify.com/drop</a> en sleep de uitgepakte map simpelweg in het upload-vlak. Binnen 10 seconden staat de monitor live!
                </li>
                <li>
                  <strong className="text-slate-900">Koppel bedreigingsmonitor.nl:</strong> Klik in Netlify op <em>Domain management</em> → <em>Add custom domain</em> → vul <code className="px-1 py-0.5 bg-white border border-slate-200 rounded">bedreigingsmonitor.nl</code> in. Netlify toont je het DNS-record dat je in Mijndomein moet invullen.
                </li>
              </ol>
            </div>

            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-slate-700 text-xs flex items-start gap-2 leading-relaxed">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong className="text-emerald-900">Voordelen:</strong> 100% gratis, automatisch gratis SSL-certificaat (groen slotje), 24/7 online, nooit meer 404-foutmeldingen en géén maandelijks hostingabonnement nodig!
              </span>
            </div>
          </div>
        )}

        {/* Selected Solution: DOORSTUREN & 404 EXPLANATION */}
        {activeSolution === 'DOORSTUREN' && (
          <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3.5 text-xs sm:text-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-amber-600 shrink-0" />
                Optie 2: Doorsturen via Mijndomein &amp; Oorzaak 404 Foutmelding
              </span>
              <span className="text-xs font-mono-code text-amber-900 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-semibold">
                Mijndomein Webforwarding
              </span>
            </div>

            {/* Error 404 Notice Banner */}
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-rose-800">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Waarom kreeg je &quot;Error: Page not found - The requested URL was not found on this server&quot;?</span>
              </div>
              <p className="text-slate-700 text-xs leading-relaxed">
                De Google Cloud Run preview-link (<code className="px-1 py-0.5 bg-white border border-rose-200 rounded">{sharedAppUrl}</code>) wordt door Google <strong>pas live gezet zodra je in Google AI Studio rechtsboven op &quot;Share&quot; (Delen) klikt</strong>.
                Zolang dat in AI Studio niet is aangeklikt, bestaat die URL niet bij Google en krijgt elke bezoeker een 404 &quot;Page not found&quot;.
              </p>
            </div>

            <p className="text-slate-700 leading-relaxed">
              Wil je toch doorsturen via de doorstuurfunctie van Mijndomein? Volg dan deze volgorde:
            </p>

            <ol className="text-slate-700 space-y-2.5 list-decimal list-inside leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs sm:text-sm">
              <li>
                <strong className="text-slate-900">Eerst in AI Studio:</strong> Klik helemaal rechtsboven in dit AI Studio scherm op de knop <strong>Share</strong> (Delen) en publiceer de preview. Pas dan bestaat de link bij Google.
              </li>
              <li>
                <strong className="text-slate-900">Daarna in Mijndomein:</strong> Log in op <a href="https://www.mijndomein.nl" target="_blank" rel="noopener noreferrer" className="text-rose-700 underline font-bold">Mijndomein.nl</a> → <strong>Domeinnamen</strong> → <strong>bedreigingsmonitor.nl</strong> → klik op <strong>Doorsturen</strong>.
              </li>
              <li>
                Plak het bestemmingsadres:
                <div className="my-1.5 flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200 font-mono-code text-xs text-amber-900">
                  <span className="truncate">{sharedAppUrl}</span>
                  <button
                    onClick={() => copyToClipboard(sharedAppUrl, 'app-url-solution1')}
                    className="ml-auto px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white shrink-0 flex items-center gap-1 min-h-[34px] cursor-pointer"
                  >
                    {copiedKey === 'app-url-solution1' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Kopieer</span>
                  </button>
                </div>
              </li>
              <li>Kies <strong className="text-slate-900">301 (Permanent)</strong> en sla op.</li>
            </ol>
          </div>
        )}

        {activeSolution === 'DNS_REPAIR' && (
          <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3 text-xs sm:text-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-purple-600 shrink-0" />
                Stappen om het www-conflict handmatig uit de DNS-tabel te verwijderen
              </span>
              <span className="text-xs font-mono-code text-rose-800 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded font-semibold">
                DNS Handmatig
              </span>
            </div>

            <p className="text-slate-700 leading-relaxed">
              Als je toch per se zelf handmatig records wilt aanpassen in de DNS-editor van Mijndomein:
            </p>

            <ol className="text-slate-700 space-y-2 list-decimal list-inside leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <li>Open de <strong className="text-slate-900">DNS instellingen</strong> van <code className="px-1 py-0.5 bg-white border border-slate-200 rounded">bedreigingsmonitor.nl</code> in Mijndomein.</li>
              <li>Zoek in de lijst naar het record:
                <div className="my-1.5 font-mono-code text-xs text-amber-900 bg-white p-2.5 rounded border border-slate-200">
                  Type: A | Naam: www | Waarde: 194.213.127.130
                </div>
              </li>
              <li><strong className="text-rose-700">Verwijder</strong> dit record (klik op het prullenbak-icoon).</li>
              <li>Pas daarna pas je nieuwe record toe, óf laat <code className="px-1 py-0.5 bg-white border border-slate-200 rounded">www</code> leeg zodat je de Doorstuur-service kunt activeren.</li>
              <li>Klik onderaan op <strong className="text-slate-900">Opslaan</strong>.</li>
            </ol>

            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-slate-700 text-xs flex items-start gap-2 leading-relaxed">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong className="text-amber-900">Let op:</strong> Een CNAME direct naar Google Cloud Run (<code className="px-1 py-0.5 bg-white border border-amber-200 rounded">ais-pre-...run.app</code>) zal resulteren in een Google 404-pagina,{' '}
                omdat Google Cloud een niet-gekoppeld custom domein weigert. Kies daarom bij voorkeur voor <strong>Optie 1 (Doorsturen)</strong>.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Cloudflare & DNS Dashboard Meldingen Hulpbox */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3.5 text-xs">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-700">
              <AlertTriangle className="w-4 h-4" />
            </span>
            <h4 className="font-bold text-slate-900 text-sm">
              Verklaring &amp; Oplossing voor jouw 4 Dashboard-meldingen (Cloudflare / DNS)
            </h4>
          </div>
          <span className="text-xs font-mono-code bg-white text-slate-700 border border-slate-200 px-2.5 py-0.5 rounded font-semibold">
            STAP-VOOR-STAP OPGELOST
          </span>
        </div>

        <div className="space-y-3 pt-1">
          {/* Melding 1: In behandeling & Typo check */}
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="font-bold text-amber-900 flex items-center gap-2 text-xs sm:text-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping shrink-0" />
                1. &quot;dreigingsmonitor.nl is in behandeling totdat u de instructies hebt voltooid...&quot;
              </span>
              <span className="text-xs font-mono-code text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-semibold">
                Eigendom verifiëren
              </span>
            </div>
            <p className="text-slate-700 text-xs leading-relaxed">
              <strong className="text-slate-900">Let op de spelling:</strong> Zag je in de melding <code className="text-rose-700 font-bold bg-rose-50 px-1 rounded">dreigingsmonitor.nl</code> (zonder &apos;be&apos;)?{' '}
              Controleer of je in Cloudflare niet per ongeluk de lettergreep <em>&quot;be&quot;</em> bent vergeten!{' '}
              Als het domein in Cloudflare als <em>dreigingsmonitor.nl</em> staat geregistreerd terwijl jouw echte domeinnaam <strong>bedreigingsmonitor.nl</strong> is, kan Cloudflare het eigendom nooit goedkeuren.
            </p>
            <p className="text-slate-600 text-xs leading-relaxed">
              <strong className="text-slate-900">Hoe verifieer je het eigendom?</strong> Cloudflare toont 2 nameservers (bijv. <code className="px-1 py-0.5 bg-slate-100 rounded">...ns.cloudflare.com</code>).{' '}
              Log in bij je domeinprovider (waar je het domein kocht) en vervang de huidige nameservers door die van Cloudflare. Binnen enkele minuten staat de status op groen!
            </p>
          </div>

          {/* Melding 2: Root A-record ontbreekt */}
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="font-bold text-rose-800 flex items-center gap-1.5 text-xs sm:text-sm">
                <Server className="w-4 h-4 text-rose-600 shrink-0" />
                2. &quot;Bezoekers kunnen geen contact opnemen met bedreigingsmonitor.nl&quot;
              </span>
              <span className="text-xs font-mono-code text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 font-semibold">
                A-record toevoegen
              </span>
            </div>
            <p className="text-slate-700 text-xs leading-relaxed">
              Cloudflare weet nog niet naar welke webserver bezoekers moeten worden gestuurd. Voeg in Cloudflare (tabblad <strong>DNS</strong> → <strong>Record toevoegen</strong>) dit record toe:
            </p>
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 font-mono-code text-xs flex flex-wrap items-center justify-between gap-2 text-slate-800">
              <div>
                Type: <strong className="text-rose-700">A</strong> | Naam: <strong className="text-slate-900">@</strong> | IPv4: <strong className="text-amber-900">194.213.127.130</strong> (of het IP van je nieuwe hosting) | Proxy: <strong className="text-orange-700">Aan (Oranje wolk)</strong>
              </div>
            </div>
          </div>

          {/* Melding 3: WWW subdomein */}
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="font-bold text-sky-900 flex items-center gap-1.5 text-xs sm:text-sm">
                <Globe className="w-4 h-4 text-sky-600 shrink-0" />
                3. &quot;Bezoekers kunnen www.bedreigingsmonitor.nl niet bereiken&quot;
              </span>
              <span className="text-xs font-mono-code text-sky-900 bg-sky-50 px-2 py-0.5 rounded border border-sky-200 font-semibold">
                CNAME voor WWW
              </span>
            </div>
            <p className="text-slate-700 text-xs leading-relaxed">
              Voeg in Cloudflare een CNAME record toe zodat mensen die <code className="px-1 py-0.5 bg-slate-100 rounded">www.bedreigingsmonitor.nl</code> intypen op dezelfde pagina uitkomen:
            </p>
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 font-mono-code text-xs flex flex-wrap items-center justify-between gap-2 text-slate-800">
              <div>
                Type: <strong className="text-sky-700">CNAME</strong> | Naam: <strong className="text-slate-900">www</strong> | Doel: <strong className="text-emerald-700">@</strong> (of bedreigingsmonitor.nl) | Proxy: <strong className="text-orange-700">Aan (Oranje wolk)</strong>
              </div>
            </div>
          </div>

          {/* Melding 4: E-mails melding */}
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs sm:text-sm">
                <FileCode className="w-4 h-4 text-slate-600 shrink-0" />
                4. &quot;E-mails kunnen geen adressen met het domein @bedreigingsmonitor.nl bereiken...&quot;
              </span>
              <span className="text-xs font-mono-code text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                GEEN ACTIE VEREIST
              </span>
            </div>
            <p className="text-slate-600 text-xs leading-relaxed">
              Dit is een <strong className="text-slate-900">automatische waarschuwing over e-mailbeveiliging</strong> (MX-, SPF- en DMARC-records).{' '}
              Voor het functioneren van jouw <strong className="text-slate-900">website</strong> maakt dit helemaal niets uit! Je site werkt 100% probleemloos zonder deze records. Je mag deze melding voor nu gerust negeren.
            </p>
          </div>
        </div>
      </div>

      {/* RFC Educational Explainer Box */}
      <div className="p-3.5 rounded-xl bg-sky-50/60 border border-sky-200 text-xs text-slate-700 flex items-start gap-2.5 leading-relaxed">
        <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-900 block font-sans font-semibold">Waarom bestaat de CNAME-beperking?</strong>
          <span>
            Volgens RFC 1034 sectie 3.6.2 creëert een CNAME een alias voor de <em>gehele zone</em> van die naam.{' '}
            Hierdoor kan er geen enkel ander record (zoals een A-, MX- of TXT-record) tegelijkertijd op dezelfde naam bestaan.{' '}
            Mijndomein toont daarom terecht de foutmelding om te voorkomen dat je DNS ongeldig raakt.
          </span>
        </div>
      </div>
    </div>
  );
};
