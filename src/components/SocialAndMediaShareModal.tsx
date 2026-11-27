import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  ExternalLink,
  Mail,
  Send,
  MessageSquare,
  Globe,
  Radio,
  Newspaper,
  Tv,
  Cpu,
  Search,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';
import { ThreatItem } from '../types/threat';

export interface SocialAndMediaShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  threat?: ThreatItem | null;
  customTitle?: string;
  customDescription?: string;
}

interface MediaContact {
  name: string;
  category: 'KRANT' | 'OMROEP' | 'TECH_MEDIA';
  emails: string[];
  primaryEmail: string;
  website: string;
  description: string;
}

export const DUTCH_MEDIA_CONTACTS: MediaContact[] = [
  // LANDELIJKE KRANTEN & DAGBLADEN
  {
    name: 'De Telegraaf',
    category: 'KRANT',
    primaryEmail: 'binnenland@telegraaf.nl',
    emails: ['binnenland@telegraaf.nl', 'digitaal@telegraaf.nl', 'nieuwsdienst@telegraaf.nl'],
    website: 'https://www.telegraaf.nl',
    description: 'Grootste dagblad van NL; binnenland- en digitaalredactie voor acute dreigingen.',
  },
  {
    name: 'AD (Algemeen Dagblad)',
    category: 'KRANT',
    primaryEmail: 'redactie@ad.nl',
    emails: ['redactie@ad.nl', 'digitaal@ad.nl', 'tiplijn@ad.nl'],
    website: 'https://www.ad.nl',
    description: 'Landelijke redactie en tech-verslaggevers met regionaal netwerk.',
  },
  {
    name: 'NRC',
    category: 'KRANT',
    primaryEmail: 'redactie@nrc.nl',
    emails: ['redactie@nrc.nl', 'tech@nrc.nl', 'economie@nrc.nl'],
    website: 'https://www.nrc.nl',
    description: 'Kwaliteitsdagblad met diepgravende cyberveiligheid- en economieredactie.',
  },
  {
    name: 'de Volkskrant',
    category: 'KRANT',
    primaryEmail: 'redactie@volkskrant.nl',
    emails: ['redactie@volkskrant.nl', 'economie@volkskrant.nl'],
    website: 'https://www.volkskrant.nl',
    description: 'Landelijke onderzoeksredactie voor nationale veiligheid en vitale infrastructuur.',
  },
  {
    name: 'Het Financieele Dagblad (FD)',
    category: 'KRANT',
    primaryEmail: 'redactie@fd.nl',
    emails: ['redactie@fd.nl', 'tech@fd.nl'],
    website: 'https://www.fd.nl',
    description: 'Financieel-economisch dagblad; focus op beursgenoteerde bedrijven & vitale ketens.',
  },
  {
    name: 'Trouw',
    category: 'KRANT',
    primaryEmail: 'redactie@trouw.nl',
    emails: ['redactie@trouw.nl'],
    website: 'https://www.trouw.nl',
    description: 'Landelijke nieuwsredactie met focus op maatschappelijke impact en overheid.',
  },
  {
    name: 'Het Parool',
    category: 'KRANT',
    primaryEmail: 'redactie@parool.nl',
    emails: ['redactie@parool.nl'],
    website: 'https://www.parool.nl',
    description: 'Amsterdams en nationaal dagblad; focus op datacenter-hub Amsterdam en AMS-IX.',
  },
  {
    name: 'Reformatorisch Dagblad (RD)',
    category: 'KRANT',
    primaryEmail: 'redactie@rd.nl',
    emails: ['redactie@rd.nl'],
    website: 'https://www.rd.nl',
    description: 'Landelijk dagblad met binnenland- en economieredactie.',
  },
  {
    name: 'Nederlands Dagblad (ND)',
    category: 'KRANT',
    primaryEmail: 'redactie@nd.nl',
    emails: ['redactie@nd.nl'],
    website: 'https://www.nd.nl',
    description: 'Christelijk-betrokken landelijk dagblad voor politiek en maatschappij.',
  },

  // OMROEPEN & NIEUWSAGENTSCHAPPEN
  {
    name: 'NOS Nieuws & Tech',
    category: 'OMROEP',
    primaryEmail: 'redactie@nos.nl',
    emails: ['redactie@nos.nl', 'nosnieuws@nos.nl', 'tips@nos.nl'],
    website: 'https://nos.nl',
    description: 'Publieke omroep en nationale calamiteitenzender met gespecialiseerde techredactie.',
  },
  {
    name: 'RTL Nieuws & RTL Tech',
    category: 'OMROEP',
    primaryEmail: 'redactie@rtlnieuws.nl',
    emails: ['redactie@rtlnieuws.nl', 'economie@rtlnieuws.nl'],
    website: 'https://www.rtlnieuws.nl',
    description: 'Commerciële marktleider met onderzoeksjournalisten op cybersecurity.',
  },
  {
    name: 'ANP (Algemeen Nederlands Persbureau)',
    category: 'OMROEP',
    primaryEmail: 'redactie@anp.nl',
    emails: ['redactie@anp.nl'],
    website: 'https://www.anp.nl',
    description: 'Centraal persbureau dat alle Nederlandse redacties simultaan voedt.',
  },
  {
    name: 'NU.nl (Tech & Algemeen)',
    category: 'OMROEP',
    primaryEmail: 'redactie@nu.nl',
    emails: ['redactie@nu.nl', 'tech@nu.nl'],
    website: 'https://www.nu.nl',
    description: 'Grootste online nieuwssite van Nederland met 24/7 techdesk.',
  },
  {
    name: 'BNR Nieuwsradio',
    category: 'OMROEP',
    primaryEmail: 'redactie@bnr.nl',
    emails: ['redactie@bnr.nl', 'digitaal@bnr.nl'],
    website: 'https://www.bnr.nl',
    description: 'Nieuwsradio met dagelijkse BNR Digitaal uitzendingen over cybersecurity.',
  },
  {
    name: 'EenVandaag (AVROTROS)',
    category: 'OMROEP',
    primaryEmail: 'eenvandaag@avrotros.nl',
    emails: ['eenvandaag@avrotros.nl'],
    website: 'https://eenvandaag.avrotros.nl',
    description: 'Actualiteitenrubriek NPO 1 met opiniepanel en diepgravende reportages.',
  },
  {
    name: 'Nieuwsuur (NOS/NTR)',
    category: 'OMROEP',
    primaryEmail: 'nieuwsuur@nos.nl',
    emails: ['nieuwsuur@nos.nl'],
    website: 'https://nos.nl/nieuwsuur',
    description: 'Verdiepende avonduitzending met focus op nationale defensie en spionage.',
  },

  // TECH & CYBER GESPECIALISEERDE MEDIA
  {
    name: 'Tweakers',
    category: 'TECH_MEDIA',
    primaryEmail: 'nieuws@tweakers.net',
    emails: ['nieuws@tweakers.net'],
    website: 'https://tweakers.net',
    description: 'Grootste tech- en IT-nieuwssite van de Benelux met actieve securitydesk.',
  },
  {
    name: 'Security.NL',
    category: 'TECH_MEDIA',
    primaryEmail: 'redactie@security.nl',
    emails: ['redactie@security.nl'],
    website: 'https://www.security.nl',
    description: 'Nederlands platform uitsluitend gewijd aan informatiebeveiliging en privacy.',
  },
  {
    name: 'AG Connect',
    category: 'TECH_MEDIA',
    primaryEmail: 'redactie@agconnect.nl',
    emails: ['redactie@agconnect.nl'],
    website: 'https://www.agconnect.nl',
    description: 'Vakmedium voor IT-professionals, C-level directie en overheids-ICT.',
  },
  {
    name: 'Computable',
    category: 'TECH_MEDIA',
    primaryEmail: 'redactie@computable.nl',
    emails: ['redactie@computable.nl'],
    website: 'https://www.computable.nl',
    description: 'B2B ICT-platform voor marktontwikkelingen, leveranciers en wetgeving.',
  },
  {
    name: 'Emerce',
    category: 'TECH_MEDIA',
    primaryEmail: 'redactie@emerce.nl',
    emails: ['redactie@emerce.nl'],
    website: 'https://www.emerce.nl',
    description: 'Medium over digitale transformatie, e-commerce en internetveiligheid.',
  },
];

export const SocialAndMediaShareModal: React.FC<SocialAndMediaShareModalProps> = ({
  isOpen,
  onClose,
  threat,
  customTitle,
  customDescription,
}) => {
  const [activeTab, setActiveTab] = useState<'SOCIALS' | 'MEDIA_EMAILS'>('SOCIALS');
  const [mediaCategoryFilter, setMediaCategoryFilter] = useState<'ALL' | 'KRANT' | 'OMROEP' | 'TECH_MEDIA'>('ALL');
  const [mediaSearchQuery, setMediaSearchQuery] = useState<string>('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://ncsc-monitor.nl';

  // Format share texts
  const shareTitle = threat ? threat.title : customTitle || 'Cyber Threat Intelligence Monitor Nederland';
  const shareTarget = threat ? `${threat.targetVictim} (${threat.targetLocation})` : 'Vitale Infrastructuur';
  const shareActor = threat ? `${threat.threatActor} [${threat.originCountry}]` : 'Geavanceerde Dreigingsactoren';
  const shareSeverity = threat ? threat.severity : 'KRITIEK';

  // LinkedIn text
  const linkedinText = threat
    ? `🚨 CTI ALERT: ${threat.title}\n\nDoelwit: ${threat.targetVictim}\nActor: ${threat.threatActor} (${threat.originCountry})\nErnst: ${threat.severity}\n\nDetails: ${threat.description}\n\nBron: Nationale Bedreigingsmonitor Nederland\n#cybersecurity #NCSC #infosec #vitaleinfrastructuur #threatintel #nederland`
    : `🚨 NATIONAAL VEILIGHEIDSBEELD: ${shareTitle}\n\n${customDescription || 'Actuele dreigingsanalyse vitale infrastructuur Nederland.'}\n\n#cybersecurity #NCSC #vitaleinfra #threatintel #nederland`;

  // X (Twitter) text
  const xText = threat
    ? `🚨 NL CTI ALERT: ${threat.title.slice(0, 80)}...\n\n🎯 Doel: ${threat.targetVictim}\n⚠️ Ernst: ${threat.severity}\n👤 Actor: ${threat.threatActor}\n\nVolg realtime: ${currentUrl}\n#cybersecurity #NCSC`
    : `🚨 NL Cyber Threat Monitor: ${shareTitle.slice(0, 90)}...\n\nVolg realtime updates: ${currentUrl}\n#cybersecurity #NCSC`;

  // Telegram text
  const telegramText = threat
    ? `🚨 *CYBER THREAT ALERT (NCSC MONITOR)*\n\n*Titel:* ${threat.title}\n*Ernst:* ${threat.severity}\n*Doelwit:* ${threat.targetVictim} (${threat.targetLocation})\n*Actor:* ${threat.threatActor} [${threat.originCountry}]\n\n*Omschrijving:*\n${threat.description}\n\n🔗 ${currentUrl}`
    : `🚨 *NATIONAAL CTI BEELD NEDERLAND*\n\n${shareTitle}\n\n${customDescription || ''}\n\n🔗 ${currentUrl}`;

  // WhatsApp text
  const whatsappText = threat
    ? `*CTI ALERT NL:* ${threat.title}\nErnst: ${threat.severity}\nDoel: ${threat.targetVictim}\nActor: ${threat.threatActor}\n\nInfo: ${currentUrl}`
    : `*NCSC Bedreigingsmonitor NL:* ${shareTitle}\n\nInfo: ${currentUrl}`;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Filtered media contacts
  const filteredMedia = DUTCH_MEDIA_CONTACTS.filter((m) => {
    const matchesCategory = mediaCategoryFilter === 'ALL' || m.category === mediaCategoryFilter;
    const matchesSearch =
      mediaSearchQuery === '' ||
      m.name.toLowerCase().includes(mediaSearchQuery.toLowerCase()) ||
      m.primaryEmail.toLowerCase().includes(mediaSearchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(mediaSearchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const allFilteredEmails = Array.from(new Set(filteredMedia.flatMap((m) => m.emails))).join('; ');

  const handleOpenEmailClient = (toEmail?: string) => {
    const targetEmails = toEmail || allFilteredEmails;
    const subject = encodeURIComponent(`[CTI PERSBULLETIN] ${shareTitle}`);
    const body = encodeURIComponent(
      `Geachte redactie,\n\nHierbij een cybersecurity incident- en dreigingsbulletin afkomstig van de Nederlandse Bedreigingsmonitor:\n\n` +
        `ONDERWERP: ${shareTitle}\n` +
        `ERNST: ${shareSeverity}\n` +
        `DOELWIT: ${shareTarget}\n` +
        `DREIGINGSACTOR: ${shareActor}\n\n` +
        `OMSCHRIJVING:\n${threat ? threat.description : customDescription || ''}\n\n` +
        `Aanvullende forensische gegevens en IoCs zijn te raadplegen via:\n${currentUrl}\n\n` +
        `Met vriendelijke groet,\nCyber Threat Intelligence Desk Nederland`
    );
    window.location.href = `mailto:${targetEmails}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 shrink-0">
              <Share2 className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex flex-wrap items-center gap-2">
                <span>Social Media & Media Redacties</span>
                <span className="text-xs font-mono-code font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                  VERSPREIDING
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5 leading-relaxed">
                Deel direct op LinkedIn, X, Telegram of verstuur naar Nederlandse kranten en omroepen.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Sluiten"
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Context Banner */}
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2 text-xs sm:text-sm">
          <div className="flex items-center gap-2 truncate pr-2">
            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="text-slate-600 font-medium shrink-0">Onderwerp:</span>
            <span className="font-semibold text-slate-900 truncate">{shareTitle}</span>
          </div>
          {threat && (
            <span className="shrink-0 text-xs font-bold px-2.5 py-0.5 rounded-md bg-rose-50 text-rose-800 border border-rose-200">
              {threat.severity}
            </span>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto border-b border-slate-200 bg-white px-3 sm:px-4 pt-2 gap-1 scrollbar-none">
          <button
            onClick={() => setActiveTab('SOCIALS')}
            className={`flex items-center gap-2 px-3.5 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap min-h-[40px] cursor-pointer ${
              activeTab === 'SOCIALS'
                ? 'border-blue-600 text-blue-700 bg-blue-50/40'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Globe className="w-4 h-4 shrink-0" />
            <span>Social Media Integraties (LinkedIn, X, Telegram)</span>
          </button>
          <button
            onClick={() => setActiveTab('MEDIA_EMAILS')}
            className={`flex items-center gap-2 px-3.5 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap min-h-[40px] cursor-pointer ${
              activeTab === 'MEDIA_EMAILS'
                ? 'border-blue-600 text-blue-700 bg-blue-50/40'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Newspaper className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Kranten & Omroepen Redactieadressen ({DUTCH_MEDIA_CONTACTS.length})</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 bg-white">
          {activeTab === 'SOCIALS' ? (
            <div className="space-y-4">
              {/* LinkedIn Section */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-[#0A66C2] flex items-center justify-center text-white font-bold text-xs shrink-0">
                      in
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-slate-900">
                      LinkedIn (Directie & Security Professionals)
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => copyToClipboard(linkedinText, 'linkedin')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-300 transition-colors min-h-[36px] cursor-pointer"
                    >
                      {copiedKey === 'linkedin' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Gekopieerd!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-500" />
                          <span>Kopieer Tekst</span>
                        </>
                      )}
                    </button>
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0A66C2] hover:bg-[#004182] text-white text-xs font-bold transition-all shadow-sm min-h-[36px]"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Deel op LinkedIn</span>
                    </a>
                  </div>
                </div>
                <div className="bg-white p-3.5 rounded-lg border border-slate-200 text-xs sm:text-sm text-slate-800 font-mono-code whitespace-pre-line line-clamp-3 leading-relaxed">
                  {linkedinText}
                </div>
              </div>

              {/* X (Twitter) Section */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-slate-900 flex items-center justify-center text-white font-bold text-xs shrink-0">
                      𝕏
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-slate-900">
                      X / Twitter (Snelle waarschuwing & OSINT)
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => copyToClipboard(xText, 'x')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-300 transition-colors min-h-[36px] cursor-pointer"
                    >
                      {copiedKey === 'x' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Gekopieerd!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-500" />
                          <span>Kopieer Tweet</span>
                        </>
                      )}
                    </button>
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(xText)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm min-h-[36px]"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Post op 𝕏</span>
                    </a>
                  </div>
                </div>
                <div className="bg-white p-3.5 rounded-lg border border-slate-200 text-xs sm:text-sm text-slate-800 font-mono-code whitespace-pre-line leading-relaxed">
                  {xText}
                </div>
              </div>

              {/* Telegram & WhatsApp Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Telegram */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#229ED9] flex items-center justify-center text-white text-xs shrink-0">
                        ✈
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-slate-900">Telegram Kanaal</span>
                    </div>
                    <a
                      href={`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(telegramText)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#229ED9] hover:bg-[#1a85b8] text-white text-xs font-bold min-h-[36px]"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Telegram</span>
                    </a>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Stuur direct naar IT-beveiliging en CERT Telegram groepen.
                  </p>
                </div>

                {/* WhatsApp */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#16a34a] flex items-center justify-center text-white text-xs shrink-0">
                        💬
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-slate-900">WhatsApp Broadcast</span>
                    </div>
                    <a
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappText)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold min-h-[36px]"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Verzend snel naar crisisoverleg of directie WhatsApp-groep.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* MEDIA REDACTIE & KRANTEN ADRESSEN TAB */
            <div className="space-y-3.5">
              {/* Action and Filter Header */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={mediaSearchQuery}
                    onChange={(e) => setMediaSearchQuery(e.target.value)}
                    placeholder="Zoek krant of omroep (bijv. Telegraaf, NOS, FD, Tweakers)..."
                    className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:border-blue-600 min-h-[40px]"
                  />
                </div>

                {/* Categories */}
                <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                  {[
                    { id: 'ALL', label: 'Alles' },
                    { id: 'KRANT', label: 'Kranten' },
                    { id: 'OMROEP', label: 'Omroepen' },
                    { id: 'TECH_MEDIA', label: 'Tech Media' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setMediaCategoryFilter(cat.id as any)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all min-h-[36px] cursor-pointer border ${
                        mediaCategoryFilter === cat.id
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bulk actions bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-blue-50 border border-blue-200">
                <span className="text-xs sm:text-sm text-blue-900">
                  <strong>{filteredMedia.length}</strong> redacties geselecteerd
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => copyToClipboard(allFilteredEmails, 'all-emails')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-300 transition-colors cursor-pointer min-h-[36px]"
                  >
                    {copiedKey === 'all-emails' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Mailadressen gekopieerd!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                        <span>Kopieer alle adressen (BCC)</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleOpenEmailClient()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all cursor-pointer shadow-sm min-h-[36px]"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Open in Mailprogramma</span>
                  </button>
                </div>
              </div>

              {/* Media List */}
              <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                {filteredMedia.map((media) => {
                  const categoryBadge =
                    media.category === 'KRANT'
                      ? { label: 'Krant', color: 'bg-amber-50 text-amber-900 border-amber-200' }
                      : media.category === 'OMROEP'
                      ? { label: 'Omroep', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' }
                      : { label: 'Tech Media', color: 'bg-purple-50 text-purple-900 border-purple-200' };

                  return (
                    <div
                      key={media.name}
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                    >
                      <div className="space-y-1.5 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-xs sm:text-sm text-slate-900">{media.name}</span>
                          <span
                            className={`text-xs font-mono-code font-semibold px-2 py-0.5 rounded border ${categoryBadge.color}`}
                          >
                            {categoryBadge.label}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{media.description}</p>
                        <div className="flex flex-wrap gap-1.5 pt-0.5">
                          {media.emails.map((email) => (
                            <span
                              key={email}
                              className="font-mono-code text-xs text-sky-900 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded"
                            >
                              {email}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <button
                          onClick={() => copyToClipboard(media.emails.join('; '), media.name)}
                          className="p-2 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center cursor-pointer"
                          title="Kopieer e-mailadressen"
                        >
                          {copiedKey === media.name ? (
                            <Check className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Copy className="w-4 h-4 text-slate-500" />
                          )}
                        </button>
                        <button
                          onClick={() => handleOpenEmailClient(media.primaryEmail)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-semibold border border-blue-200 transition-colors min-h-[36px] cursor-pointer"
                          title="Stel direct e-mail op"
                        >
                          <Mail className="w-3.5 h-3.5 text-blue-700" />
                          <span>Mail</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs text-slate-600">
            NCSC Bedreigingsmonitor • Geïntegreerde Socials & Mediadienst
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold transition-colors min-h-[38px] cursor-pointer"
          >
            Sluiten
          </button>
        </div>
      </div>
    </div>
  );
};
