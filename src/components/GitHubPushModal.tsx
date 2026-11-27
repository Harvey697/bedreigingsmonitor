import React, { useState } from 'react';
import {
  X,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  KeyRound,
  GitBranch,
  Download,
  FileJson,
  FileCode2,
  ShieldCheck,
  Loader2,
  Eye,
  EyeOff,
} from 'lucide-react';

interface GitHubPushModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownloadVercelJson: () => void;
  onDownloadSingleHtml: () => void;
}

interface PushResult {
  commitSha: string;
  commitUrl: string;
  repoUrl: string;
  filesCount: number;
  branch: string;
}

export const GitHubPushModal: React.FC<GitHubPushModalProps> = ({
  isOpen,
  onClose,
  onDownloadVercelJson,
  onDownloadSingleHtml,
}) => {
  const [repoInput, setRepoInput] = useState('Harvey697/bedreigingsmonitor');
  const [branch, setBranch] = useState('main');
  const [token, setToken] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [commitMessage, setCommitMessage] = useState(
    'Update Bedreigingsmonitor.nl: licht mobiel thema, NL-feeds en Vercel build-fix'
  );
  const [isPushing, setIsPushing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [pushResult, setPushResult] = useState<PushResult | null>(null);

  if (!isOpen) return null;

  const handlePush = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setPushResult(null);

    const cleanedRepo = repoInput
      .trim()
      .replace(/^https?:\/\/github\.com\//i, '')
      .replace(/\.git$/i, '')
      .replace(/^\/+|\/+$/g, '');

    const parts = cleanedRepo.split('/');
    if (parts.length !== 2 || !parts[0] || !parts[1]) {
      setErrorMsg('Vul een geldige repository in als eigenaar/naam (bijv. Harvey697/bedreigingsmonitor).');
      return;
    }

    if (!token.trim()) {
      setErrorMsg('Plak eerst je GitHub Personal Access Token om rechtstreeks zonder ZIP te kunnen uploaden.');
      return;
    }

    setIsPushing(true);
    try {
      const res = await fetch('/api/github/push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({
          owner: parts[0],
          repo: parts[1],
          branch: branch.trim() || 'main',
          token: token.trim(),
          commitMessage: commitMessage.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'Uploaden naar GitHub is mislukt. Controleer je token en rechten.');
        return;
      }

      setPushResult({
        commitSha: data.commitSha,
        commitUrl: data.commitUrl,
        repoUrl: data.repoUrl,
        filesCount: data.filesCount,
        branch: data.branch,
      });
      setToken('');
    } catch {
      setErrorMsg('Netwerkfout bij verbinden met de server. Probeer het opnieuw.');
    } finally {
      setIsPushing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-5 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-xl sm:rounded-2xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-3.5 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 shrink-0">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono-code font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                  ZONDER ZIP
                </span>
                <span className="text-xs font-mono-code text-slate-600">
                  GitHub &amp; Vercel Direct
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 mt-1">
                Direct naar GitHub Uploaden (of Los Bestand Kiezen)
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Sluiten"
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1 text-sm">
          {/* Why GitHub rejects ZIP */}
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-xs sm:text-sm text-amber-950">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Waarom GitHub geen .zip pakt:</strong> Via <em>Upload files</em> op GitHub.com wordt een{' '}
              <code className="px-1 py-0.5 bg-white border border-amber-200 rounded">.zip</code>-bestand niet automatisch uitgepakt. Gebruik hieronder de{' '}
              <strong>directe 1-klik GitHub push</strong> (alle losse bronbestanden in één keer), óf download een los bestand dat GitHub wél direct accepteert.
            </p>
          </div>

          {/* Option 1: Direct Push Form */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3.5">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-sky-600" />
                Optie 1: Alle bronbestanden direct naar GitHub pushen
              </h3>
              <span className="text-xs font-mono-code font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                AANBEVOLEN · VERWIJDERT BUN.LOCK
              </span>
            </div>

            {pushResult ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-3">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm sm:text-base">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Gelukt! {pushResult.filesCount} bestanden direct naar GitHub gepusht.</span>
                </div>
                <p className="text-xs sm:text-sm text-emerald-950 leading-relaxed">
                  De volledige schone broncode (inclusief gefixte <code className="px-1 bg-white rounded border border-emerald-200">vercel.json</code>, zonder <code className="px-1 bg-white rounded border border-emerald-200">bun.lock</code>) staat nu op branch <strong>{pushResult.branch}</strong>. Vercel start nu automatisch een nieuwe build!
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <a
                    href={pushResult.commitUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[40px] px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm inline-flex items-center gap-1.5 shadow-xs"
                  >
                    <span>Bekijk Commit ({pushResult.commitSha.slice(0, 7)})</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <a
                    href={pushResult.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[40px] px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-semibold text-xs sm:text-sm inline-flex items-center gap-1.5"
                  >
                    <span>Open Repository</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handlePush} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      GitHub Repository (eigenaar/naam)
                    </label>
                    <input
                      type="text"
                      value={repoInput}
                      onChange={(e) => setRepoInput(e.target.value)}
                      placeholder="Harvey697/bedreigingsmonitor"
                      className="w-full min-h-[40px] px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono-code text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Branch
                    </label>
                    <input
                      type="text"
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      placeholder="main"
                      className="w-full min-h-[40px] px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono-code text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-sky-600" />
                      GitHub Personal Access Token (PAT)
                    </label>
                    <div className="flex items-center gap-3 flex-wrap">
                      <a
                        href="https://github.com/settings/tokens/new?scopes=repo&description=Bedreigingsmonitor"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-emerald-700 hover:text-emerald-900 underline font-bold inline-flex items-center gap-1"
                      >
                        <span>Snelle Token (repo vooraf aangevinkt)</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <a
                        href="https://github.com/settings/personal-access-tokens/new"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-sky-700 hover:text-sky-900 underline font-semibold inline-flex items-center gap-1"
                      >
                        <span>Fine-grained token</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                  <div className="relative">
                    <input
                      type={showToken ? 'text' : 'password'}
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      placeholder="github_pat_... of ghp_..."
                      autoComplete="off"
                      className="w-full min-h-[40px] pl-3 pr-10 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono-code text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowToken((prev) => !prev)}
                      aria-label={showToken ? 'Verberg token' : 'Toon token'}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-500 hover:text-slate-900 cursor-pointer"
                    >
                      {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="mt-1.5 flex items-start gap-1.5 text-xs text-slate-600">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Makkelijkst:</strong> Klik op <em>Snelle Token</em> (daar staat <strong>repo</strong> al aangevinkt) en klik onderaan direct op <strong>Generate token</strong>. Of kies bij <em>Fine-grained</em> onder <strong>Repository permissions → + Add permissions → Contents (Inhoud)</strong> voor <strong>Read and write (Lezen en schrijven)</strong>. Je token wordt nooit opgeslagen.
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Commit-bericht
                  </label>
                  <input
                    type="text"
                    value={commitMessage}
                    onChange={(e) => setCommitMessage(e.target.value)}
                    className="w-full min-h-[40px] px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                {errorMsg && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-medium flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isPushing}
                  className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-60 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                >
                  {isPushing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Bezig met uploaden naar GitHub (zonder ZIP)...</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-4 h-4" />
                      <span>Upload alle bestanden direct naar GitHub</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Option 2: Single Files GitHub Accepts Directly */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                Optie 2: Losse bestanden die GitHub wél direct accepteert
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5 leading-relaxed">
                Wil je liever handmatig 1 los bestand slepen naar{' '}
                <code className="px-1 bg-slate-100 rounded">github.com/Harvey697/bedreigingsmonitor</code> via{' '}
                <strong>Add file → Upload files</strong>? Kies dan een van deze bestanden:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Single file 1: vercel.json */}
              <button
                type="button"
                onClick={onDownloadVercelJson}
                className="p-3.5 rounded-xl bg-sky-50/70 hover:bg-sky-50 border border-sky-200 text-left flex items-start justify-between gap-2.5 transition-colors cursor-pointer min-h-[72px]"
              >
                <div className="flex items-start gap-2.5">
                  <div className="p-2 rounded-lg bg-white border border-sky-200 text-sky-700 shrink-0">
                    <FileJson className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-xs sm:text-sm">
                      Download vercel.json
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5 leading-snug">
                      1 los bestand voor je bestaande repo: lost direct de{' '}
                      <code className="text-rose-700 font-semibold">api/**/*.ts</code> &amp;{' '}
                      <code className="text-rose-700 font-semibold">vite</code> fouten op (ook bij losse index.html).
                    </p>
                  </div>
                </div>
                <Download className="w-4 h-4 text-sky-600 shrink-0 mt-1" />
              </button>

              {/* Single file 2: index.html */}
              <button
                type="button"
                onClick={onDownloadSingleHtml}
                className="p-3.5 rounded-xl bg-emerald-50/70 hover:bg-emerald-50 border border-emerald-200 text-left flex items-start justify-between gap-2.5 transition-colors cursor-pointer min-h-[72px]"
              >
                <div className="flex items-start gap-2.5">
                  <div className="p-2 rounded-lg bg-white border border-emerald-200 text-emerald-700 shrink-0">
                    <FileCode2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-xs sm:text-sm">
                      Download index.html (1 bestand)
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5 leading-snug">
                      Complete losse webpagina-versie (geen ZIP). Geschikt voor Mijndomein of een statische repo zonder package.json.
                    </p>
                  </div>
                </div>
                <Download className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2 flex-wrap">
          <span className="text-xs text-slate-600">
            Tip: Optie 1 vervangt alles netjes zonder mappenfouten of <code className="px-1 bg-slate-100 rounded">bun.lock</code>.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[40px] px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 text-sm font-bold transition-colors cursor-pointer"
          >
            Sluiten
          </button>
        </div>
      </div>
    </div>
  );
};
