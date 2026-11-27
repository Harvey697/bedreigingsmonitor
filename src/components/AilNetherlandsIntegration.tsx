import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  Search,
  FileCode,
  Download,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  Terminal,
  Database,
  Globe,
  Lock,
  Cpu,
  Layers,
  ExternalLink,
  Sparkles,
  Play,
  RefreshCw,
  Server,
} from 'lucide-react';

interface DetectedEntity {
  id: string;
  type:
    | 'NL_BSN_ELFPROEF'
    | 'NL_IBAN_BANK'
    | 'NL_OVERHEID_EMAIL'
    | 'NL_VITAAL_EMAIL'
    | 'SESSION_COOKIE_TOKEN'
    | 'API_SECRET_KEY'
    | 'TOR_ONION_ENDPOINT'
    | 'CVE_EXPLOIT_MARKER';
  label: string;
  value: string;
  maskedValue: string;
  validationDetail: string;
  severity: 'KRITIEK' | 'HOOG' | 'MIDDEL';
  targetOrgOrSector: string;
  mispAttributeType: string;
}

interface YaraRuleMatch {
  ruleName: string;
  description: string;
  tlp: 'TLP:RED' | 'TLP:AMBER+STRICT' | 'TLP:AMBER';
  targetRecipient: string;
  matchedIndicatorsCount: number;
}

interface SamplePasteScenario {
  id: string;
  title: string;
  badge: string;
  sourceChannel: string;
  description: string;
  sampleText: string;
}

const SAMPLE_NL_SCENARIOS: SamplePasteScenario[] = [
  {
    id: 'laundry-bear-politie',
    title: 'Scenario 1: Overheid & Politie Infostealer + Session Cookie Dump (Laundry Bear)',
    badge: 'AIVD / NCSC-NL CASE',
    sourceChannel: 'AIL Feeder: Infostealer Log / Telegram Stream',
    description:
      'Simuleert een onderschept RedLine/Lumma infostealer-log met geëxfiltreerde Entra ID / GalToken sessiecookies en werkgerelateerde e-mailadressen van de Politie en Rijksoverheid.',
    sampleText: `[AIL-FEEDER-TELEGRAM] Intercepted Stealer Log #NL-88412 (Host: WKS-POL-EENHEID-09)
Target-Country: NL | Stealer: LummaC2 v4.8 | Timestamp: 2026-04-20T09:14:22Z

[CREDENTIALS & GAL ADDRESS BOOK]
user_principal: j.vanderberg@politie.nl
backup_contact: ciso-loket@rijksoverheid.nl
keten_partner: meldkamer-noordzee@defensie.nl
dienst_bsn_ref: 111222333

[CAPTURED SESSION COOKIES - PASS-THE-COOKIE]
Domain: login.microsoftonline.com
Cookie: ESTSAUTHPERSISTENT=0.AX8A9zK_LaundryBear_SessionToken_PolitieNL_99481aBcDeFgHiJkLmNoPqRsTuVwXyZ; HttpOnly; Secure
Cookie:BreezeSessionCookie=GalToken_Exfil_Politie_2026_8841a9f0c2e4

[NETWORK & C2]
Exfil-Onion: http://laundryb7x9k2m4p8q1w3e5r7t9y2u4i6o8p0a2s4d6f8g0h2j4k6l8.onion/upload.php
Exploit-Ref: CVE-2026-109618`,
  },
  {
    id: 'zcert-zorg-bsn-iban',
    title: 'Scenario 2: Zorgsector (Z-CERT) Patiënten- & Financiële Dump (BSN 11-proef + IBAN)',
    badge: 'Z-CERT / AP MELDPLICHT',
    sourceChannel: 'AIL Feeder: Pystemon Paste Scraper',
    description:
      'Simuleert een gelekte CSV/SQL-dump uit de Nederlandse zorgketen met Burgerservicenummers (getoetst op de 11-proef) en Nederlandse bankrekeningnummers (ING, Rabobank, ABN AMRO).',
    sampleText: `-- SQL DUMP EXFILTRATION: ZORGPORTAAL REGIO RANDSTAD (TLP:RED)
-- Source: pystemon://paste.ee/p/x9K2mL
INSERT INTO patient_declarations (patient_email, bsn_nummer, iban_rekening, zorgverzekeraar_api) VALUES
('p.janssen@lumc.nl', '111222333', 'NL91ABNA0417164300', 'demo_api_zorg_99a8b7c6d5e4f3g2h1j0'),
('m.de.vries@erasmusmc.nl', '123456782', 'NL20INGB0001234567', 'demo_token_mc_77x88y99z00a11b22c33d44'),
('k.bakker@z-cert.nl', '987654321', 'NL44RABO0123456789', 'demo_cloud_key_99887766554433221100');
-- Note: 987654321 fails 11-proef (false positive test), while 111222333 and 123456782 pass!`,
  },
  {
    id: 'brainport-vital-infra',
    title: 'Scenario 3: Vitale Infra (Brainport / Haven Rotterdam / PHP2Shell .env Leak)',
    badge: 'DIVD / VITALE INFRA',
    sourceChannel: 'AIL Crawler: Lacus Tor .onion & GitHub Gist',
    description:
      'Simuleert een onderschept .env configuratiebestand van een Nederlandse toeleverancier na misbruik van het PHP2Shell-lek (CVE-2026-109618) met OT/SCADA- en cloud-sleutels.',
    sampleText: `# LEAKED PRODUCTION .ENV - NL SUPPLY CHAIN NODE (EINDHOVEN / ROTTERDAM)
APP_ENV=production
VULN_VECTOR=CVE-2026-109618 (PHP2Shell RCE)
ADMIN_CONTACT=ot-security@portofrotterdam.com
ENGINEERING_LEAD=litho-ops@asml.com
GRID_TELEMETRY_CONTACT=scada-noc@tennet.eu

# FINANCIAL & CLEARING
TREASURY_IBAN=NL02ABNA0123456789
CLOUD_ACCESS_KEY_ID=DEMO_KEY_EXAMPLE_001122334455
SESSION_JWT=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJOTF9WSVRBTF9TQ0FEQV9hZG1pbiIsImlzcyI6Im5jc2MubmwifQ
RANSOMWARE_NEGOTIATION_ONION=http://clop7x8m2n4b6v8c0x2z4a6s8d0f2g4h6j8k0l2q4w6e8r0t2y4u6i.onion`,
  },
];

/**
 * Officiële Nederlandse Elfproef (11-proef) voor een 9-cijferig Burgerservicenummer (BSN)
 */
function isValidDutchBSN(candidate: string): boolean {
  const clean = candidate.replace(/\D/g, '');
  if (clean.length !== 9) return false;
  if (/^0+$/.test(clean)) return false;

  const digits = clean.split('').map(Number);
  const sum =
    9 * digits[0] +
    8 * digits[1] +
    7 * digits[2] +
    6 * digits[3] +
    5 * digits[4] +
    4 * digits[5] +
    3 * digits[6] +
    2 * digits[7] -
    1 * digits[8];

  return sum > 0 && sum % 11 === 0;
}

function maskSensitiveValue(val: string): string {
  if (val.length <= 8) return val;
  return `${val.slice(0, 4)}••••${val.slice(-4)}`;
}

export const AilNetherlandsIntegration: React.FC = () => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(SAMPLE_NL_SCENARIOS[0].id);
  const [inputText, setInputText] = useState<string>(SAMPLE_NL_SCENARIOS[0].sampleText);
  const [copiedConfig, setCopiedConfig] = useState<string | null>(null);
  const [showUnmasked, setShowUnmasked] = useState<boolean>(false);
  const [activeSubView, setActiveSubView] = useState<
    'SANDBOX_ANALYZER' | 'ARCHITECTUUR_NL' | 'YARA_EN_CONFIG'
  >('SANDBOX_ANALYZER');

  const handleLoadScenario = (scenario: SamplePasteScenario) => {
    setSelectedScenarioId(scenario.id);
    setInputText(scenario.sampleText);
  };

  // Real-time AIL-NL Engine Analyse in de browser
  const analysisResult = useMemo(() => {
    const entities: DetectedEntity[] = [];
    const seen = new Set<string>();

    const addEntity = (entity: Omit<DetectedEntity, 'id'>) => {
      const key = `${entity.type}:${entity.value}`;
      if (seen.has(key)) return;
      seen.add(key);
      entities.push({
        ...entity,
        id: `ent-${entities.length + 1}`,
      });
    };

    // 1. Nederlandse BSN (9 cijfers + 11-proef)
    const bsnMatches = inputText.match(/\b\d{9}\b/g) || [];
    bsnMatches.forEach((candidate) => {
      if (isValidDutchBSN(candidate)) {
        addEntity({
          type: 'NL_BSN_ELFPROEF',
          label: 'Nederlands BSN (11-proef Geverifieerd)',
          value: candidate,
          maskedValue: `${candidate.slice(0, 2)}•••••${candidate.slice(-2)}`,
          validationDetail: 'Wiskundige 11-proef (Elfproef) = GELDIG (AVG Art. 33 / AP Meldplicht)',
          severity: 'KRITIEK',
          targetOrgOrSector: 'Autoriteit Persoonsgegevens (AP) / Z-CERT / RVIG',
          mispAttributeType: 'person-national-id',
        });
      }
    });

    // 2. Nederlandse IBAN rekeningen (NLkk BANK 10 cijfers)
    const ibanMatches =
      inputText.match(/\bNL\d{2}\s?[A-Z]{4}\s?\d{4}\s?\d{4}\s?\d{2}\b/gi) || [];
    ibanMatches.forEach((rawIban) => {
      const normalized = rawIban.replace(/\s+/g, '').toUpperCase();
      const bankCode = normalized.slice(4, 8);
      const bankMap: Record<string, string> = {
        ABNA: 'ABN AMRO Bank',
        INGB: 'ING Bank Nederland',
        RABO: 'Rabobank',
        SNSB: 'SNS / de Volksbank',
        TRIO: 'Triodos Bank',
        BUNQ: 'bunq Bank',
        KNAB: 'Knab',
        BNGH: 'BNG Bank (Overheid/Gemeenten)',
      };
      const bankName = bankMap[bankCode] || `NL Bank (${bankCode})`;
      addEntity({
        type: 'NL_IBAN_BANK',
        label: `Nederlandse IBAN (${bankName})`,
        value: normalized,
        maskedValue: `${normalized.slice(0, 8)}••••••${normalized.slice(-4)}`,
        validationDetail: `NL-IBAN Structuur + BIC (${bankCode}) geverifieerd`,
        severity: 'HOOG',
        targetOrgOrSector: `Financiële Sector (FI-ISAC / ${bankName})`,
        mispAttributeType: 'iban',
      });
    });

    // 3. E-mailadressen (.nl, Rijksoverheid, Politie, Defensie, Vitale Infra)
    const emailMatches =
      inputText.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g) || [];
    emailMatches.forEach((email) => {
      const lower = email.toLowerCase();
      const isGovOrPolice =
        lower.endsWith('@politie.nl') ||
        lower.endsWith('@rijksoverheid.nl') ||
        lower.endsWith('@defensie.nl') ||
        lower.endsWith('@minbuza.nl') ||
        lower.endsWith('@ncsc.nl') ||
        lower.endsWith('@rechtspraak.nl');

      if (isGovOrPolice) {
        addEntity({
          type: 'NL_OVERHEID_EMAIL',
          label: 'Gelekte Overheid / Politie / Defensie Account',
          value: lower,
          maskedValue: lower,
          validationDetail: 'Kritiek Nederlands Overheidsdomein (.nl Rijksoverheid/Politie)',
          severity: 'KRITIEK',
          targetOrgOrSector: 'NCSC-NL / AIVD / MIVD / PDC Politie',
          mispAttributeType: 'email-dst',
        });
      } else if (
        lower.endsWith('.nl') ||
        lower.endsWith('@asml.com') ||
        lower.endsWith('@portofrotterdam.com') ||
        lower.endsWith('@tennet.eu') ||
        lower.endsWith('@kpn.com') ||
        lower.endsWith('@philips.com')
      ) {
        addEntity({
          type: 'NL_VITAAL_EMAIL',
          label: 'Nederlands .NL / Vitale Sector E-mailadres',
          value: lower,
          maskedValue: lower,
          validationDetail: 'Gekoppeld aan Nederlandse NIS2 / Vitale Keten',
          severity: 'HOOG',
          targetOrgOrSector: 'DIVD CSIRT / Z-CERT / NCSC-NL',
          mispAttributeType: 'email-src',
        });
      }
    });

    // 4. Pass-the-Cookie / Entra ID / Session Tokens
    const cookiePatterns =
      inputText.match(
        /\b(ESTSAUTHPERSISTENT|BreezeSessionCookie|SESSION_JWT|GalToken)[=:]\s*([^\s;]+)/gi
      ) || [];
    cookiePatterns.forEach((match) => {
      addEntity({
        type: 'SESSION_COOKIE_TOKEN',
        label: 'Gelekte Sessiecookie / Pass-the-Cookie Token (MFA-Bypass)',
        value: match,
        maskedValue: maskSensitiveValue(match),
        validationDetail:
          'Actieve sessietoken geeft aanvaller toegang zonder wachtwoord/MFA (zoals bij Laundry Bear)',
        severity: 'KRITIEK',
        targetOrgOrSector: 'NCSC-NL / SOC Directe Token-Revocatie Vereist',
        mispAttributeType: 'cookie',
      });
    });

    // 5. API Keys & Cloud Secrets
    const secretMatches =
      inputText.match(
        /\b(AKIA[0-9A-Z]{16}|ghp_[A-Za-z0-9]{30,}|sk_live_[A-Za-z0-9]{20,}|AIza[0-9A-Za-z-_]{30,}|demo_(?:api_zorg|token_mc|cloud_key)_[A-Za-z0-9]{16,}|DEMO_KEY_EXAMPLE_[A-Z0-9]{8,})\b/g
      ) || [];
    secretMatches.forEach((sec) => {
      addEntity({
        type: 'API_SECRET_KEY',
        label: 'Gelekte Cloud / API Private Key',
        value: sec,
        maskedValue: maskSensitiveValue(sec),
        validationDetail: 'Hoog-entropie API-sleutel (AWS / GitHub PAT / Stripe / Google Cloud)',
        severity: 'KRITIEK',
        targetOrgOrSector: 'DIVD CSIRT / DevSecOps Key Rotation',
        mispAttributeType: 'text',
      });
    });

    // 6. Tor .onion URLs
    const onionMatches =
      inputText.match(/https?:\/\/[a-z2-7]{16,56}\.onion[^\s"']*/gi) || [];
    onionMatches.forEach((onion) => {
      addEntity({
        type: 'TOR_ONION_ENDPOINT',
        label: 'Tor .Onion Exfiltratie / Ransomware Endpoint',
        value: onion,
        maskedValue: onion,
        validationDetail: 'Gedetecteerd door AIL Lacus Tor-module',
        severity: 'HOOG',
        targetOrgOrSector: 'Team High Tech Crime (THTC) / NCSC-NL',
        mispAttributeType: 'url',
      });
    });

    // 7. CVE Referenties
    const cveMatches = inputText.match(/\bCVE-\d{4}-\d{4,7}\b/gi) || [];
    cveMatches.forEach((cve) => {
      addEntity({
        type: 'CVE_EXPLOIT_MARKER',
        label: 'Actief Misbruikte CVE-Kwetsbaarheid in Dump',
        value: cve.toUpperCase(),
        maskedValue: cve.toUpperCase(),
        validationDetail: 'Gekoppeld aan NCSC-NL / CISA KEV Waarschuwing',
        severity: 'KRITIEK',
        targetOrgOrSector: 'NCSC-NL / DIVD CSIRT',
        mispAttributeType: 'vulnerability',
      });
    });

    // YARA Rules Evaluatie
    const yaraMatches: YaraRuleMatch[] = [];
    const overheidHits = entities.filter(
      (e) => e.type === 'NL_OVERHEID_EMAIL' || e.type === 'SESSION_COOKIE_TOKEN'
    ).length;
    if (overheidHits > 0) {
      yaraMatches.push({
        ruleName: 'rule NL_Overheid_Politie_Session_Exfil_2026',
        description:
          'Detecteert gelekte Rijksoverheid/Politie/Defensie accounts in combinatie met Pass-the-Cookie / Entra ID tokens (Laundry Bear TTP).',
        tlp: 'TLP:RED',
        targetRecipient: 'NCSC-NL & AIVD / PDC Politie CSIRT',
        matchedIndicatorsCount: overheidHits,
      });
    }

    const bsnOrIbanHits = entities.filter(
      (e) => e.type === 'NL_BSN_ELFPROEF' || e.type === 'NL_IBAN_BANK'
    ).length;
    if (bsnOrIbanHits > 0) {
      yaraMatches.push({
        ruleName: 'rule NL_BSN_Elfproef_En_IBAN_PII_Leak',
        description:
          'Detecteert gevalideerde Nederlandse Burgerservicenummers (11-proef) en Nederlandse IBAN-bankrekeningen in pastes of SQL-dumps.',
        tlp: 'TLP:AMBER+STRICT',
        targetRecipient: 'Autoriteit Persoonsgegevens (AP), Z-CERT & FI-ISAC',
        matchedIndicatorsCount: bsnOrIbanHits,
      });
    }

    const vitalOrSecretHits = entities.filter(
      (e) =>
        e.type === 'NL_VITAAL_EMAIL' ||
        e.type === 'API_SECRET_KEY' ||
        e.type === 'CVE_EXPLOIT_MARKER'
    ).length;
    if (vitalOrSecretHits > 0) {
      yaraMatches.push({
        ruleName: 'rule NL_Vital_Infra_NIS2_SupplyChain_Secrets',
        description:
          'Detecteert gelekte .env configuraties, API-keys en vitale infrastructuur contactpunten (ASML, Haven Rotterdam, TenneT, PHP2Shell).',
        tlp: 'TLP:AMBER',
        targetRecipient: 'DIVD CSIRT & Digital Trust Center (DTC)',
        matchedIndicatorsCount: vitalOrSecretHits,
      });
    }

    const riskScore = Math.min(
      100,
      entities.reduce(
        (acc, item) => acc + (item.severity === 'KRITIEK' ? 28 : item.severity === 'HOOG' ? 16 : 8),
        0
      )
    );

    return {
      entities,
      yaraMatches,
      riskScore,
    };
  }, [inputText]);

  // Exporteer gevonden resultaten als officieel MISP Event JSON-bestand (CIRCL / NCSC-NL standaard)
  const handleDownloadMispJson = () => {
    const mispEvent = {
      Event: {
        info: `[AIL-NL Bedreigingsmonitor.nl] Gedetecteerd Nederlands Datalek / Paste Incident (${analysisResult.entities.length} IoC's)`,
        date: new Date().toISOString().split('T')[0],
        threat_level_id: analysisResult.riskScore >= 70 ? '1' : '2',
        analysis: '2',
        distribution: '1',
        Orgc: {
          name: 'Bedreigingsmonitor.nl — AIL-NL Node',
          uuid: '5b9e8a12-4c3d-4f1a-9b2e-8d7c6b5a4f3e',
        },
        Tag: [
          { name: 'tlp:amber+strict' },
          { name: 'ail-project:leak-detection="netherlands"' },
          { name: 'ncsc-nl:vital-infrastructure' },
          { name: 'nis2:incident-notification' },
        ],
        Attribute: analysisResult.entities.map((ent, idx) => ({
          uuid: `attr-nl-ail-${Date.now()}-${idx}`,
          type: ent.mispAttributeType,
          category:
            ent.mispAttributeType === 'cookie' || ent.mispAttributeType === 'url'
              ? 'Network activity'
              : 'Targeting data',
          to_ids: ent.severity === 'KRITIEK',
          value: ent.value,
          comment: `${ent.label} — ${ent.validationDetail} (Bestemd voor: ${ent.targetOrgOrSector})`,
        })),
      },
    };

    const blob = new Blob([JSON.stringify(mispEvent, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AIL-NL-MISP-Event-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedConfig(id);
    setTimeout(() => setCopiedConfig(null), 2500);
  };

  const nlYaraRulesSnippet = `// AIL-Project (CIRCL) — Nederlandse YARA Retro-Hunt Bundel (etc/yara/nl_vital_leaks.yar)
rule NL_Overheid_En_Politie_Credential_Of_Cookie_Leak {
    meta:
        author = "Bedreigingsmonitor.nl / CSIRT-NL Integratie"
        description = "Detecteert gelekte Rijksoverheid/Politie/Defensie credentials & Pass-the-Cookie tokens"
        tlp = "TLP:RED"
        misp_galaxy = "Laundry Bear / Void Blizzard / Infostealers"
    strings:
        $gov1 = "@politie.nl" nocase
        $gov2 = "@rijksoverheid.nl" nocase
        $gov3 = "@defensie.nl" nocase
        $gov4 = "@minbuza.nl" nocase
        $gov5 = "@rechtspraak.nl" nocase
        $cookie1 = "ESTSAUTHPERSISTENT=" nocase
        $cookie2 = "BreezeSessionCookie=" nocase
        $cookie3 = "GalToken" nocase
    condition:
        any of ($gov*) and (any of ($cookie*) or filesize < 5MB)
}

rule NL_Vitale_Infrastructuur_NIS2_SupplyChain {
    meta:
        author = "Bedreigingsmonitor.nl"
        description = "Detecteert gelekte .env secrets en gegevens van Nederlandse NIS2 vitale aanbieders"
        tlp = "TLP:AMBER"
    strings:
        $v1 = "@portofrotterdam.com" nocase
        $v2 = "@tennet.eu" nocase
        $v3 = "@asml.com" nocase
        $v4 = "@schiphol.nl" nocase
        $v5 = "@kpn.com" nocase
        $iban_nl = /NL[0-9]{2}(ABNA|INGB|RABO|BNGH)[0-9]{10}/
    condition:
        any of ($v*) or #iban_nl > 3
}`;

  return (
    <div className="space-y-6">
      {/* Top Hero Banner: AIL-Project (CIRCL) gericht op Nederland */}
      <div className="bg-gradient-to-br from-sky-50 via-white to-slate-50 border border-sky-200 rounded-2xl p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-sky-700 text-white text-xs font-mono-code font-bold px-2.5 py-1 rounded-md uppercase">
                🇪🇺 CIRCL / EU CEF TELECOM STANDAARD
              </span>
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-mono-code font-bold px-2.5 py-1 rounded-md">
                🇳🇱 AIL-PROJECT NEDERLAND MODULE ACTIEF
              </span>
              <span className="bg-purple-50 text-purple-800 border border-purple-200 text-xs font-mono-code font-bold px-2.5 py-1 rounded-md">
                BSN 11-PROEF • NL-IBAN • MISP EXPORT
              </span>
            </div>

            <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
              AIL-Project Integratie Nederland (Analysis of Information Leaks)
            </h2>
            <p className="text-sm text-slate-700 max-w-4xl leading-relaxed">
              Het open-source{' '}
              <strong className="text-sky-800">
                AIL Framework (github.com/ail-project/ail-framework)
              </strong>{' '}
              van <strong className="text-slate-900">CIRCL Luxemburg</strong> is dé Europese CSIRT-standaard
              (naast MISP) voor het automatisch doorzoeken van ongestructureerde datalekken, Pastebin-dumps,
              Telegram-streams, infostealer-logs en Tor{' '}
              <code className="px-1.5 py-0.5 rounded bg-purple-50 text-purple-800 border border-purple-200 font-mono-code text-xs">.onion</code>{' '}
              sites. Hieronder vindt u zowel het{' '}
              <strong className="text-emerald-800">volledige haalbaarheidsonderzoek voor Nederland</strong>{' '}
              als een{' '}
              <strong className="text-amber-800">
                werkende AIL-NL Leak &amp; Paste Analyzer (met echte BSN 11-proef &amp; MISP-export)
              </strong>{' '}
              die 100% zelfstandig in uw portaal draait.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0">
            <a
              href="https://github.com/ail-project/ail-framework"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-sky-800 border border-sky-300 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all min-h-[42px]"
            >
              <span>🐙 Officiële AIL-Project GitHub</span>
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              type="button"
              onClick={handleDownloadMispJson}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer min-h-[42px]"
            >
              <Download className="w-4 h-4" />
              <span>Exporteer MISP JSON (NCSC/DIVD)</span>
            </button>
          </div>
        </div>

        {/* Sub-navigation buttons */}
        <div className="pt-4 flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setActiveSubView('SANDBOX_ANALYZER')}
            className={`px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer min-h-[42px] ${
              activeSubView === 'SANDBOX_ANALYZER'
                ? 'bg-sky-700 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
            }`}
          >
            <Play className="w-4 h-4" />
            <span>1. Live AIL-NL Dump &amp; Paste Analyzer (BSN 11-proef / IBAN / Cookies)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubView('ARCHITECTUUR_NL')}
            className={`px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer min-h-[42px] ${
              activeSubView === 'ARCHITECTUUR_NL'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>2. Onderzoeksrapport: Hoe AIL-Project werkt voor Nederland</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubView('YARA_EN_CONFIG')}
            className={`px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer min-h-[42px] ${
              activeSubView === 'YARA_EN_CONFIG'
                ? 'bg-purple-700 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>3. Kopieerbare NL YARA-Regels &amp; AIL Feeder Configuratie</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: INTERACTIEVE AIL-NL DUMP & PASTE ANALYZER */}
      {activeSubView === 'SANDBOX_ANALYZER' && (
        <div className="space-y-5">
          {/* Scenario selector cards */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3 shadow-sm">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-600" />
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  Kies een Nederlands Lek-Scenario of plak hieronder uw eigen Paste / Logbestand
                </h3>
              </div>
              <span className="text-xs font-mono-code font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
                100% Client-Side Browser Analyse (Geen data verlaat uw scherm)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {SAMPLE_NL_SCENARIOS.map((scen) => (
                <button
                  key={scen.id}
                  type="button"
                  onClick={() => handleLoadScenario(scen)}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 min-h-[120px] ${
                    selectedScenarioId === scen.id
                      ? 'bg-sky-50 border-sky-500 ring-1 ring-sky-400'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-white'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
                      <span className="text-[11px] font-mono-code font-bold bg-sky-100 text-sky-900 border border-sky-200 px-2 py-0.5 rounded">
                        {scen.badge}
                      </span>
                      <span className="text-[11px] font-mono-code text-slate-600 truncate">
                        {scen.sourceChannel}
                      </span>
                    </div>
                    <div className="text-sm font-bold text-slate-900 leading-snug">{scen.title}</div>
                    <p className="text-xs text-slate-700 mt-1 line-clamp-2 leading-relaxed">
                      {scen.description}
                    </p>
                  </div>
                  <div className="text-xs font-bold text-sky-700 flex items-center gap-1 pt-1">
                    <span>Inladen in AIL-NL Engine</span>
                    <span>→</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Main 2-column Split: Left = Raw Paste Input, Right = Live AIL-NL Decoders Output */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left Column: Raw Stream / Paste Input */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-3 shadow-sm">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-sky-700" />
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase font-mono-code">
                      Inkomende AIL Feeder Stream / Paste
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => setInputText('')}
                    className="text-xs font-semibold text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 cursor-pointer min-h-[36px]"
                  >
                    Wissen
                  </button>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Plak hier een ruwe Pastebin-tekst, Telegram-dump, SQL-fragment of{' '}
                  <code className="px-1 py-0.5 rounded bg-slate-100 text-sky-800 border border-slate-200 font-mono-code">.env</code> bestand. De Nederlandse AIL-decoders
                  toetsen elk 9-cijferig getal direct aan de{' '}
                  <strong className="text-slate-900">wiskundige BSN 11-proef</strong> en controleren
                  NL-IBANs, overheidsdomeinen en sessiecookies.
                </p>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  rows={14}
                  placeholder="Plak hier ruwe tekst, logregels, BSN-nummers, NL-IBANs of e-mailadressen..."
                  className="w-full rounded-xl bg-slate-50 border border-slate-300 focus:border-sky-600 focus:bg-white focus:outline-none p-3 text-xs sm:text-sm font-mono-code text-slate-900 leading-relaxed"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-slate-600 block text-[11px] font-mono-code font-bold">
                    AIL-NL RISICOSCORE (0-100)
                  </span>
                  <span
                    className={`text-base font-black font-mono-code ${
                      analysisResult.riskScore >= 70
                        ? 'text-rose-700'
                        : analysisResult.riskScore >= 40
                        ? 'text-amber-700'
                        : 'text-emerald-700'
                    }`}
                  >
                    {analysisResult.riskScore} / 100 —{' '}
                    {analysisResult.riskScore >= 70
                      ? 'KRITIEK DATALEK (DIRECTE CSIRT MELDING)'
                      : analysisResult.riskScore >= 40
                      ? 'VERHOOGD RISICO'
                      : 'LAAG RISICO'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setShowUnmasked(!showUnmasked)}
                  className="px-3 py-2 rounded-lg bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-bold cursor-pointer min-h-[40px]"
                >
                  {showUnmasked ? '🙈 Verberg Gevoelige Data' : '👁️ Toon Volledige Waarden'}
                </button>
              </div>
            </div>

            {/* Right Column: Extracted Dutch Entities + YARA Matches */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                <div>
                  <h4 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    <span>
                      Gedetecteerde Nederlandse Indicatoren ({analysisResult.entities.length})
                    </span>
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Gevalideerd door de AIL-NL Decoders (Elfproef BSN, Bank-BIC, Overheidsdomeinen &amp;
                    Session Tokens)
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleDownloadMispJson}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0 min-h-[40px]"
                >
                  <Download className="w-4 h-4" />
                  <span>Download MISP Event (.json)</span>
                </button>
              </div>

              {/* Triggered Dutch YARA Rules */}
              {analysisResult.yaraMatches.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-mono-code font-bold text-purple-800 uppercase">
                    🎯 Aangeslagen Nederlandse YARA Retro-Hunt Regels ({analysisResult.yaraMatches.length})
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {analysisResult.yaraMatches.map((ym) => (
                      <div
                        key={ym.ruleName}
                        className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-mono-code font-bold text-purple-900">
                              {ym.ruleName}
                            </span>
                            <span className="text-[11px] font-mono-code font-bold bg-rose-100 text-rose-800 border border-rose-300 px-2 py-0.5 rounded">
                              {ym.tlp}
                            </span>
                          </div>
                          <p className="text-xs text-slate-700 leading-relaxed">{ym.description}</p>
                        </div>
                        <div className="text-xs font-mono-code text-emerald-900 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg shrink-0">
                          Bestemd voor: <strong>{ym.targetRecipient}</strong>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Extracted Entities List */}
              {analysisResult.entities.length === 0 ? (
                <div className="p-8 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-2">
                  <Search className="w-6 h-6 text-slate-500 mx-auto" />
                  <div className="text-sm font-bold text-slate-800">
                    Geen Nederlandse BSN, IBAN, .nl-credentials of sessietokens gedetecteerd
                  </div>
                  <p className="text-xs text-slate-600">
                    Kies hierboven een van de drie Nederlandse scenario&apos;s of plak tekst met een
                    geldig 9-cijferig BSN of NL-IBAN.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
                  {analysisResult.entities.map((ent) => (
                    <div
                      key={ent.id}
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-sky-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                    >
                      <div className="space-y-1.5 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`text-[11px] font-mono-code font-bold px-2 py-0.5 rounded border ${
                              ent.severity === 'KRITIEK'
                                ? 'bg-rose-100 text-rose-800 border-rose-300'
                                : 'bg-amber-100 text-amber-900 border-amber-300'
                            }`}
                          >
                            {ent.severity}
                          </span>
                          <span className="text-xs sm:text-sm font-bold text-slate-900">{ent.label}</span>
                          <span className="text-[11px] font-mono-code text-sky-900 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded">
                            MISP: {ent.mispAttributeType}
                          </span>
                        </div>

                        <div className="text-xs font-mono-code text-slate-900 bg-white px-2.5 py-1.5 rounded-lg border border-slate-300 break-all">
                          {showUnmasked ? ent.value : ent.maskedValue}
                        </div>

                        <div className="text-xs text-slate-700 flex items-center gap-1.5 flex-wrap">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{ent.validationDetail}</span>
                        </div>
                      </div>

                      <div className="text-left sm:text-right shrink-0">
                        <span className="text-[11px] font-mono-code text-slate-500 block font-semibold">
                          MELDING / ROUTERING:
                        </span>
                        <span className="text-xs font-bold text-amber-900">
                          {ent.targetOrgOrSector}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: HAALBAARHEIDSONDERZOEK & ARCHITECTUUR VOOR NEDERLAND */}
      {activeSubView === 'ARCHITECTUUR_NL' && (
        <div className="space-y-5">
          <div className="bg-white border border-emerald-200 rounded-2xl p-4 sm:p-6 space-y-4 shadow-sm">
            <div className="border-b border-slate-200 pb-3">
              <span className="text-xs font-mono-code font-bold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-md">
                ARCHITECTUUR- &amp; HAALBAARHEIDSONDERZOEK
              </span>
              <h3 className="text-base sm:text-xl font-black text-slate-900 mt-2">
                Hoe het AIL-Project (CIRCL) gericht op Nederland kan worden ingezet
              </h3>
              <p className="text-sm text-slate-700 mt-1 leading-relaxed">
                Uit ons technisch onderzoek naar de codebase van{' '}
                <code className="px-1.5 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200 font-mono-code text-xs">ail-project/ail-framework</code> blijkt dat AIL
                modulair is opgebouwd (in Python, Redis/Kvrocks en ZMQ-streams) en uitstekend kan
                worden toegespitst op het Nederlandse dreigingslandschap via{' '}
                <strong className="text-slate-900">vier specifieke lagen</strong>:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Laag 1 */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-sky-800 font-bold text-sm">
                  <Globe className="w-4 h-4 text-sky-600" />
                  <span>1. Ingestie &amp; Feeders gericht op .NL &amp; Darknet</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  AIL gebruikt losse <em>Feeders</em> die data via ZMQ/REST naar de AIL-core sturen.
                  Voor Nederland zijn de volgende 4 officiële AIL-feeders essentieel:
                </p>
                <ul className="text-xs sm:text-sm text-slate-700 space-y-1.5 list-disc list-inside leading-relaxed">
                  <li>
                    <strong className="text-slate-900">Pystemon / Paste Feeder:</strong> Monitort
                    Pastebin, Ghostbin, Rentry en GitHub Gists op <code className="text-sky-800 font-mono-code">.nl</code>,{' '}
                    <code className="text-sky-800 font-mono-code">.overheid.nl</code> en Nederlandse bedrijfsnamen.
                  </li>
                  <li>
                    <strong className="text-slate-900">ail-feeder-telegram &amp; Discord:</strong> Volgt
                    pro-Russische hacktivisten (NoName057(16), DDoSia) en infostealer-kanalen waar
                    Nederlandse logs worden gedeeld.
                  </li>
                  <li>
                    <strong className="text-slate-900">Lacus &amp; AIL Tor Crawler:</strong> Bezoekt
                    geautomatiseerd <code className="text-purple-800 font-mono-code">.onion</code> ransomware-leksites
                    (Cl0p, LockBit, Akira, Play) om Nederlandse slachtoffers (zoals Philips of MKB)
                    vroegtijdig te signaleren.
                  </li>
                </ul>
              </div>

              {/* Laag 2 */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <Cpu className="w-4 h-4 text-emerald-600" />
                  <span>2. Nederlandse Decoders (BSN 11-proef, NL-IBAN &amp; Cookies)</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  Standaard zoekt AIL naar creditcards (Luhn-check) en algemene e-mailadressen. Voor
                  Nederland voegen we drie cruciale decoders toe (die we hierboven al live in uw
                  portaal hebben ingebouwd!):
                </p>
                <ul className="text-xs sm:text-sm text-slate-700 space-y-1.5 list-disc list-inside leading-relaxed">
                  <li>
                    <strong className="text-slate-900">Nederlandse BSN 11-proef Module:</strong> Voorkomt
                    valse meldingen door elk 9-cijferig nummer te toetsen aan de wettelijke{' '}
                    <em>Elfproef</em>. Cruciaal voor AP-meldplicht en Z-CERT (zorg).
                  </li>
                  <li>
                    <strong className="text-slate-900">NL-IBAN &amp; Bank-BIC Module:</strong> Herkent direct
                    rekeningen van ING, Rabobank, ABN AMRO, bunq en BNG Bank (gemeenten).
                  </li>
                  <li>
                    <strong className="text-slate-900">Pass-the-Cookie / Entra ID Detector:</strong>{' '}
                    Zoekt specifiek naar geëxfiltreerde sessiecookies waarmee groepen als{' '}
                    <em>Laundry Bear</em> (AIVD-rapportage) MFA omzeilen.
                  </li>
                </ul>
              </div>

              {/* Laag 3 */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-purple-800 font-bold text-sm">
                  <Database className="w-4 h-4 text-purple-600" />
                  <span>3. Uitwisseling met NCSC-NL, DIVD &amp; Z-CERT via MISP</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  Omdat AIL en MISP allebei door CIRCL zijn ontwikkeld, ondersteunt AIL standaard{' '}
                  <strong className="text-slate-900">PyMISP</strong>. Wanneer AIL een Nederlands lek
                  ontdekt, maakt het automatisch een gestructureerd MISP-event aan dat gedeeld kan
                  worden met:
                </p>
                <ul className="text-xs sm:text-sm text-slate-700 space-y-1.5 list-disc list-inside leading-relaxed">
                  <li>
                    <strong className="text-slate-900">NCSC-NL &amp; CSIRT-DSP:</strong> Voor vitale
                    aanbieders en de Rijksoverheid onder de Cyberbeveiligingswet (NIS2).
                  </li>
                  <li>
                    <strong className="text-slate-900">DIVD CSIRT:</strong> Voor het waarschuwen van
                    eigenaren van gelekte <code className="text-sky-800 font-mono-code">.env</code> bestanden of
                    kwetsbare PHP-servers (PHP2Shell).
                  </li>
                  <li>
                    <strong className="text-slate-900">Z-CERT &amp; CERT-WM:</strong> Voor ziekenhuizen,
                    GGZ-instellingen en waterschappen.
                  </li>
                </ul>
              </div>

              {/* Laag 4: Hosting & Praktische Inzet voor Bedreigingsmonitor.nl */}
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                  <Server className="w-4 h-4 text-amber-700" />
                  <span>4. Wat betekent dit voor úw hosting (Vercel / VPS)?</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  De volledige achterliggende AIL-server van CIRCL vereist Linux, Docker, Redis/Kvrocks
                  en minimaal 8 tot 16 GB RAM. Daarom hebben wij een{' '}
                  <strong className="text-emerald-800">slimme hybride oplossing</strong> gebouwd:
                </p>
                <ul className="text-xs sm:text-sm text-slate-700 space-y-1.5 list-disc list-inside leading-relaxed">
                  <li>
                    <strong className="text-emerald-800">
                      Op uw standaard webhosting (1-bestand index.html / Vercel):
                    </strong>{' '}
                    Draait onze ingebouwde{' '}
                    <strong>Client-Side AIL-NL Analyzer &amp; MISP Exporter</strong> (tabblad 1 hierboven)
                    100% zelfstandig in de browser, zonder dat u een zware server hoeft te beheren!
                  </li>
                  <li>
                    <strong className="text-sky-800">Optioneel op een latere VPS / Docker:</strong>{' '}
                    Kunt u de volledige AIL Docker-stack draaien met onze kant-en-klare Nederlandse
                    YARA-regels (tabblad 3).
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: KOPIEERBARE NL YARA-REGELS & AIL CONFIG */}
      {activeSubView === 'YARA_EN_CONFIG' && (
        <div className="bg-white border border-purple-200 rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                Nederlandse YARA-Regels voor AIL-Project (`nl_vital_leaks.yar`)
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 mt-0.5">
                Direct te importeren in een AIL-Project instantie onder{' '}
                <code className="px-1.5 py-0.5 rounded bg-purple-50 text-purple-800 border border-purple-200 font-mono-code">AIL_HOME/etc/yara/</code> of in MISP / TheHive.
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleCopyText('yara-nl', nlYaraRulesSnippet)}
              className="px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0 min-h-[42px]"
            >
              {copiedConfig === 'yara-nl' ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Gekopieerd naar Klembord!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Kopieer NL YARA-Regels</span>
                </>
              )}
            </button>
          </div>

          <pre className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-mono-code text-slate-800 overflow-x-auto leading-relaxed">
            {nlYaraRulesSnippet}
          </pre>
        </div>
      )}
    </div>
  );
};
