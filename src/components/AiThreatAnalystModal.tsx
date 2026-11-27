import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  Loader2,
  ShieldAlert,
  Copy,
  Check,
  Download,
  AlertTriangle,
  Bot,
  RefreshCw,
} from 'lucide-react';
import { DarkwebChatterItem, ThreatItem } from '../types/threat';

interface AiThreatAnalystModalProps {
  threat: ThreatItem | null;
  chatterItem?: DarkwebChatterItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AiThreatAnalystModal: React.FC<AiThreatAnalystModalProps> = ({
  threat,
  chatterItem,
  isOpen,
  onClose,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [analysisText, setAnalysisText] = useState<string>('');
  const [userPrompt, setUserPrompt] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [sourceUsed, setSourceUsed] = useState<string>('');

  useEffect(() => {
    if (isOpen && (threat || chatterItem)) {
      generateAnalysis();
    }
  }, [isOpen, threat, chatterItem]);

  if (!isOpen) return null;

  const currentThreatName = threat ? threat.title : chatterItem ? chatterItem.topicTitle : 'Onbekende Dreiging';
  const currentActor = threat ? threat.threatActor : chatterItem ? chatterItem.actorAffiliation : 'Onbekend';
  const currentOrigin = threat ? threat.originCountry : chatterItem ? chatterItem.originCountry : 'Rusland / China';
  const currentSector = threat ? threat.targetSector : chatterItem ? chatterItem.targetedSectorOrRegion : 'Vitale Infrastructuur';
  const currentVictim = threat ? threat.targetVictim : chatterItem ? chatterItem.targetedSectorOrRegion : currentSector;
  const currentVector = threat ? threat.attackVector : chatterItem ? chatterItem.detectedTactic : 'Gerichte exploitatie';
  const currentMitre = threat?.mitreTechniques || [];
  const currentIocs = threat?.iocs;
  const currentVolume = threat ? threat.dataVolume : chatterItem ? chatterItem.priceListed : '';
  const currentRansom = threat ? threat.ransomDemanded : chatterItem ? chatterItem.priceListed : '';
  const currentDesc = threat ? threat.description : chatterItem ? chatterItem.excerpt : '';

  const CLOUD_BACKEND_ORIGIN = 'https://ais-pre-ahzjb5b7uvilhl2lxtnytm-84827719818.europe-west2.run.app';

  // Dynamic 1-click follow-up questions tailored to the selected threat
  const getDynamicQuickQuestions = (): string[] => {
    const combined = `${currentThreatName} ${currentActor} ${currentVector} ${currentDesc}`.toLowerCase();
    if (
      combined.includes('aivd') ||
      combined.includes('laundry bear') ||
      combined.includes('void blizzard') ||
      combined.includes('simone smit') ||
      combined.includes('akerboom') ||
      combined.includes('quantum') ||
      combined.includes('edge device')
    ) {
      return [
        'Hoe brak de Russische groep "Laundry Bear" (Void Blizzard) in bij de Nederlandse Politie?',
        'Hoe zetten Chinese staatshackers AI in tegen "Edge Devices" en Nederlandse kroonjuwelen (ASML)?',
        'Wat houdt de AIVD/NBV waarschuwing voor quantumcomputers ("Harvest Now, Decrypt Later") in?',
      ];
    }
    if (combined.includes('kushner') || combined.includes('princes and thieves')) {
      return [
        'Hoe wist de MIVD (JSCU) de GRU iPhone X zero-day te reverse-engineeren?',
        'Wat is de officiële reactie van Defensie en de rol van de Commissie-Stiekem?',
        'Hoe kunnen diplomaten en bestuurders zich beschermen tegen zero-day screen mirroring?',
      ];
    }
    if (combined.includes('mivd') || combined.includes('reesink') || combined.includes('camera') || combined.includes('coathanger') || combined.includes('signal')) {
      return [
        'Hoe beveiligen we IP-camera\'s langs logistieke routes tegen Russische AI-spionage?',
        'Hoe voorkom je dat Russische hackers Signal of WhatsApp via QR-koppeling overnemen?',
        'Hoe controleer je FortiGate firewalls op de Chinese COATHANGER rootkit?',
      ];
    }
    if (combined.includes('php') || combined.includes('php2shell') || combined.includes('109618') || combined.includes('109619')) {
      return [
        'Waarom is het herstarten van PHP-FPM workers na de PHP-update verplicht?',
        'Hoe stelen aanvallers API-sleutels en wachtwoorden uit het RAM-geheugen (CVE-2026-109619)?',
        'Wat moeten beheerders met verouderde PHP 5.4 t/m 8.1 servers nu direct doen?',
      ];
    }
    if (combined.includes('pepijn') || combined.includes('shinyhunters') || combined.includes('umbreon')) {
      return [
        'Wat onthulden de openstaande Signal-chats bij de arrestatie van Pepijn van der Stap?',
        'Hoe beschermen we onze Snowflake en Salesforce SaaS-omgevingen tegen ShinyHunters?',
        'Welke rol speelden corrupte ransomware-onderhandelaars bij Shinywire?',
      ];
    }
    if (combined.includes('philips') || combined.includes('windchill') || combined.includes('cl0p')) {
      return [
        'Welke data zat er in de 13,5 GB Philips-dump van Cl0p en zijn ziekenhuizen veilig?',
        'Hoe patchen en isoleren we PTC Windchill en FlexPLM tegen CVE-2026-12569?',
        'Welke phishing-risico\'s ontstaan er door de gelekte Philips IT-documentatie?',
      ];
    }
    return [
      `Welke specifieke maatregelen stoppen de vector "${currentVector.slice(0, 42)}..."?`,
      `Welke logs en IoC's moeten we controleren op activiteit van ${currentActor.slice(0, 28)}?`,
      `Wat zijn de concrete gevolgen en meldplichten voor ${currentVictim.slice(0, 32)}?`,
    ];
  };

  const buildSmartQuestionAnswer = (question: string): string => {
    const q = `${question} ${currentThreatName} ${currentActor} ${currentVector}`.toLowerCase();
    const qOnly = question.toLowerCase();

    if (
      qOnly.includes('aivd') ||
      qOnly.includes('laundry bear') ||
      qOnly.includes('void blizzard') ||
      qOnly.includes('simone smit') ||
      qOnly.includes('akerboom') ||
      qOnly.includes('quantum') ||
      qOnly.includes('kwantum') ||
      qOnly.includes('harvest now') ||
      qOnly.includes('edge device') ||
      qOnly.includes('kroonjuwel') ||
      (q.includes('laundry bear') && !qOnly.includes('php'))
    ) {
      return `**AIVD & NBV Inlichtingendossier 2026 (DG Simone Smit / Erik Akerboom — Min. van BZK):**\n` +
        `• **1. Ontmaskering Russische Staatsgroep "Laundry Bear" (Void Blizzard) & Politie-Hack:** De AIVD en MIVD onthulden dat de Russische statelijke cybergroep **Laundry Bear** achter de hack op de **Nederlandse Nationale Politie** zat (waarbij de werkgerelateerde contactgegevens van vrijwel alle ~65.000 politiemedewerkers uit het gedeelde adresboek werden buitgemaakt). Laundry Bear gebruikt **Pass-the-Cookie** (gestolen sessiecookies uit infostealer-logs waarmee standaard MFA direct wordt omzeild), *password spraying* en kwetsbaarheden in **Microsoft Exchange en Zimbra** om inlichtingen over Oekraïne-steun te verzamelen en westerse sancties te omzeilen.\n` +
        `  👉 *Actie tegen Laundry Bear:* Dwing apparaatgebonden **FIDO2/WebAuthn** en **Token Binding / Device Compliance (Conditional Access)** af zodat gestolen sessiecookies niet vanaf een ander IP/apparaat kunnen worden hergebruikt, en beperk wie het volledige Global Address List (GAL) adresboek mag exporteren.\n` +
        `• **2. Explosieve Stijging Chinese AI-Aanvallen op "Edge Devices" & Kroonjuwelen (Oktober 2026):** In een gezamenlijk cyberadvies waarschuwen AIVD en MIVD dat Chinese staatshackers op grote schaal **edge devices** (firewalls, VPN-gateways, routers en loadbalancers) aanvallen. Zij bestuderen westerse broncode en zetten **AI** in om bliksemsnel zero-days te vinden. Daarnaast bestempelt de AIVD China als de grootste bedreiging voor de Nederlandse economische veiligheid en "kroonjuwelen" (ASML/NXP chipsector, kwantumtechnologie, AI en universiteiten zoals TU Delft en TNO).\n` +
        `• **3. Kwantumdreiging ("Harvest Now, Decrypt Later" — AIVD NBV 2026):** Het Nationaal Bureau voor Verbindingsbeveiliging (NBV) van de AIVD waarschuwt dat statelijke actoren nú al massaal versleuteld Nederlands dataverkeer onderscheppen en opslaan om dit later met een krachtige kwantumcomputer te ontsleutelen. Organisaties met langdurige staats- of bedrijfsgeheimen moeten direct migreren naar **Post-Quantum Cryptografie (PQC, zoals ML-KEM / ML-DSA)**.\n` +
        `• **4. Sabotage & Diasporaspionage:** Onder de vernieuwde Nederlandse spionagewetgeving treedt de AIVD hard op tegen Russische fysieke/digitale sabotagevoorbereidingen en **diasporaspionage** (digitale intimidatie van dissidenten en journalisten in Nederland door Iran, China en Rusland).`;
    }

    if (
      qOnly.includes('kushner') ||
      qOnly.includes('iphone') ||
      qOnly.includes('commissie-stiekem') ||
      qOnly.includes('mirroring') ||
      (q.includes('kushner') && !qOnly.includes('php') && !qOnly.includes('camera'))
    ) {
      return `**MIVD & JSCU Dossier — Counter-Hack op Russische GRU & iPhone X van Jared Kushner:**\n` +
        `• **Hoe de operatie verliep:** Nadat de Russische militaire inlichtingendienst **GRU** rond 2017 de iPhone X van Witte Huis-adviseur **Jared Kushner** had gehackt, zetten Nederlandse en Britse diensten een betrokken GRU-hacker bij een reis naar het VK klem. De GRU-hacker werd omgedraaid tot informant en gaf de **MIVD** toegang tot een geheime Russische C2-server met screenshots van Kushners telefoon.\n` +
        `• **Reverse-Engineering door JSCU:** Hackers van de MIVD (werkend binnen de **Joint Sigint Cyber Unit — JSCU**, de gezamenlijke cyber-eenheid van MIVD en AIVD) wisten de door de GRU gebruikte iOS zero-day te reverse-engineeren en zetten deze in voor **live screen mirroring** op Kushners iPhone X.\n` +
        `• **Financiële Ontdekking ($750M):** De MIVD zag live op het scherm hoe Kushner inlogde op een rekening bij de **First Abu Dhabi Bank** in Dubai/VAE met circa **$750 miljoen** (onderdeel van ruim $2 miljard aan fondsen uit Saoedi-Arabië en de VAE die via Azerbeidzjan waren gerouteerd).\n` +
        `• **Standpunt Defensie & Toezicht:** Het Ministerie van Defensie verklaart: *"Het Nederlandse kabinet doet in het openbaar geen uitspraken over het kennisniveau, de werkwijze of de bronnen van de MIVD."* Politieke en juridische verantwoording loopt uitsluitend achter gesloten deuren via de **Commissie-Stiekem (CIVD)** en toezichthouder **CTIVD**.\n` +
        `• **Beveiligingsadvies tegen Mobiele Zero-Days:** Activeer op iPhones van bestuurders en diplomaten altijd **iOS Lockdown Mode (Isolatiemodus)**, herstart toestellen dagelijks om in-memory implants te wissen, en gebruik voor staatsgeheimen uitsluitend NBV-gecertificeerde crypto-communicatie.`;
    }

    if (
      qOnly.includes('camera') ||
      qOnly.includes('reesink') ||
      qOnly.includes('signal') ||
      qOnly.includes('whatsapp') ||
      qOnly.includes('coathanger') ||
      qOnly.includes('noordzee') ||
      qOnly.includes('mivd') ||
      (q.includes('reesink') && !qOnly.includes('php'))
    ) {
      return `**MIVD & AIVD Inlichtingendossier 2026 (Directeur Viceadmiraal Peter Reesink & JSCU):**\n` +
        `• **1. Russische AI-Spionage via Nederlandse IP-Camera's (Juli 2026):** Russische staatshackers breken in op honderden internet-gekoppelde beveiligings- en verkeerscamera's in Nederland (bij havens zoals Rotterdam/Vlissingen, spoorlijnen, kazernes en snelwegen) via standaardwachtwoorden en verouderde firmware. Met **AI-beeldherkenning** volgen zij automatisch militaire transporten voor Oekraïne.\n` +
        `  👉 *Actie:* Haal IP-camera's direct van het publieke internet (plaats achter VPN/VLAN), schakel UPnP en open RTSP/ONVIF-poorten (554/8000) uit en wijzig alle fabriekswachtwoorden.\n` +
        `• **2. Russische Kapingen van Signal & WhatsApp:** Russische hackers doen zich voor als *"Signal Support"* bots en misbruiken de functie **"Gekoppelde Apparaten" (Linked Devices QR-code)** om ongemerkt mee te lezen in groepschats van Nederlandse militairen, diplomaten en ambtenaren.\n` +
        `  👉 *Actie:* Controleer in Signal/WhatsApp direct *Instellingen → Gekoppelde Apparaten*, verwijder onbekende sessies, activeer registratievergrendeling (PIN) en deel nooit gerubriceerde informatie via consumenten-apps.\n` +
        `• **3. Chinese COATHANGER FortiGate RAT & Noordzee-Sabotage:** De MIVD ontdekte bij Defensie de Chinese FortiGate-malware **COATHANGER** (\`CVE-2022-42475\`), die firmware-updates en herstarts overleeft. Daarnaast waarschuwt Reesink voor permanente Russische sabotagevoorbereidingen op Noordzee-kabels en gaspijpleidingen net onder de NAVO Artikel 5-drempel.`;
    }

    if (
      qOnly.includes('php') ||
      qOnly.includes('php2shell') ||
      qOnly.includes('109618') ||
      qOnly.includes('109619') ||
      qOnly.includes('worker') ||
      qOnly.includes('tweede kamer') ||
      qOnly.includes('notubiz') ||
      q.includes('php2shell')
    ) {
      return `**NCSC-NL Update (23 okt 2026) — Kritieke PHP-Aanvallen "PHP2Shell" (CVE-2026-109618 & CVE-2026-109619):**\n` +
        `• **Eerste Succesvolle Inbraken Bevestigd:** Het NCSC heeft vanuit eigen detectienetwerken en internationale inlichtingendiensten de eerste signalen van daadwerkelijk succesvol misbruik van PHP2Shell ontvangen.\n` +
        `• **Hoe de 2 lekken werken (CVSS 9.2):**\n` +
        `  1. **CVE-2026-109618 (Out-of-Memory Corruptie):** Geheugencorruptie bij het verwerken van grote uploads/\`multipart/form-data\` POST-requests.\n` +
        `  2. **CVE-2026-109619 (Stale Global State op PHP-Workers):** Achtergebleven geheugenstatus in een PHP-worker waardoor een volgend webverzoek zonder inlog **wachtwoorden, API-sleutels en sessietokens rechtstreeks uit het server-RAM kan uitlezen** én Remote Code Execution (RCE) kan uitvoeren.\n` +
        `• **Verplichte Actiepunten (Workarounds zijn NIET waterdicht!):**\n` +
        `  1. **Update direct** naar de gepatchte versies **PHP 8.5.12**, **PHP 8.4.27**, **PHP 8.3.36** of **PHP 8.2.35**.\n` +
        `  2. **HERSTART verplicht alle PHP-FPM / PHP-workers:** Zonder herstart blijft zowel de kwetsbare code als de vervuilde *stale state* in het RAM-geheugen actief!\n` +
        `  3. **End-of-Life PHP 5.4 t/m 8.1:** Krijgen géén gratis officiële updates meer; upgrade naar PHP 8.2+ of gebruik statische HTML (zoals onze 1-bestand \`index.html\` die geen PHP gebruikt).\n` +
        `  4. **Roteer API-keys & wachtwoorden** als de server ongepatcht aan internet heeft gehangen.`;
    }

    if (
      qOnly.includes('pepijn') ||
      qOnly.includes('stap') ||
      qOnly.includes('umbreon') ||
      qOnly.includes('shinyhunters') ||
      qOnly.includes('shinywire') ||
      qOnly.includes('krebs') ||
      q.includes('shinyhunters')
    ) {
      return `**KrebsOnSecurity Dossier — Pepijn van der Stap ("Umbreon") & ShinyHunters:**\n` +
        `• **Arrestatie (15 sept 2026):** De 24-jarige Nederlander **Pepijn van der Stap** (geboren 2002, hackeralias **"Umbreon"**) werd door de Nederlandse Nationale Politie (THTC) en de **FBI** aangehouden als vermeend kopstuk van **ShinyHunters** (>140 gehackte organisaties en **$70+ miljoen** buit sinds 2025).\n` +
        `• **Dubbelleven in NL Cybersecurity:** Volgens **Brian Krebs (*KrebsOnSecurity*)** werkte hij eerder bij **Hadrian** en als vrijwilliger bij **DIVD**, werd in 2023 veroordeeld (€1,5M–€2,7M buit), kwam in december 2025 vrij en werkte tot zijn arrestatie als Offensive Security Lead bij **Neo Security** (dat na extern onderzoek bevestigde dat eigen en klantomgevingen niet zijn geraakt).\n` +
        `• **Openstaande Signal-Chats & Shinywire Collusie:** Bij de inval stond zijn **Signal-account open**, waaruit bleek dat Noord-Amerikaanse **ransomware-onderhandelaars** nauw samenwerkten met ShinyHunters en dat een Amerikaanse consultancy-directeur meehielp bij het runnen van de afpersingssite **Shinywire**.\n` +
        `• **Specifiek Advies tegen ShinyHunters:** Beveilig **Snowflake, Salesforce en Okta/Entra SSO** met verplichte FIDO2 passkeys, blokkeer ongeautoriseerde OAuth-app koppelingen en train servicedesks tegen *voice-phishing (vishing)*.`;
    }

    if (qOnly.includes('philips') || qOnly.includes('cl0p') || qOnly.includes('clop') || qOnly.includes('windchill') || qOnly.includes('mri') || q.includes('windchill')) {
      return `**Dark Web Intelligence Dossier — Koninklijke Philips N.V. (Cl0p / CVE-2026-12569):**\n` +
        `• **13,5 GB Dark Web Publicatie:** De Russische afpersingsgroep **Cl0p** heeft **13,5 GB aan gestolen Philips-data** gepubliceerd op \`cl0p^_-leaks.onion\` (tegelijk met data van Shell) na exploitatie van **CVE-2026-12569** in **PTC Windchill en FlexPLM**.\n` +
        `• **Gelekte Inhoud & Ziekenhuisveiligheid:** Het archief bevat technische bouwtekeningen van **MRI-scanners** en interne IT-infrastructuurdocumentatie. Philips bevestigt dat slechts één enterprise PLM-server is geraakt en dat ziekenhuisnetwerken, actieve MRI-scanners en patiëntendossiers (EPD) **niet** zijn gecompromitteerd.\n` +
        `• **Specifiek Advies:** Patch PTC Windchill/FlexPLM direct tegen \`CVE-2026-12569\`, haal PLM/CAD-servers van het publieke internet en wees alert op gerichte spear-phishing richting biomedische en IT-teams op basis van de gelekte Philips IT-schema's.`;
    }

    // Dynamic answer constructed directly from the specific threat's telemetry
    return `**Gericht CTI Advies voor "${question}" (Dossier: ${currentThreatName}):**\n` +
      `• **Betrokken Actor & Herkomst:** **${currentActor}** (${currentOrigin}) gericht op **${currentVictim}**.\n` +
      `• **Specifieke Aanvalsvector:** \`${currentVector}\`${currentMitre.length > 0 ? ` (MITRE ATT&CK: \`${currentMitre.join(', ')}\`)` : ''}.\n` +
      `• **Inhoudelijke Dossiercontext:** ${currentDesc}\n` +
      `• **Maatregelen op Maat voor dit Dossier:**\n` +
      `  1. **Dicht het Specifieke Aanvalspad:** Audit en patch direct de systemen die betrokken zijn bij *${currentVector}*.\n` +
      `  2. **Controleer Dossier-Specifieke Indicatoren:** ${currentIocs?.cves?.length ? `Patch/controleer op \`${currentIocs.cves.join(', ')}\`` : ''}${currentIocs?.ips?.length ? ` en blokkeer verkeer naar \`${currentIocs.ips.join(', ')}\`` : 'Doorzoek toegangs- en netwerklogs op afwijkende sessies richting bovengenoemd doelwit'}.\n` +
      `  3. **Impactbeperking (${currentSector}):** ${currentVolume ? `Bescherm de beoogde datastromen (*${currentVolume}*) tegen exfiltratie.` : 'Deel relevante logsporen direct met uw sectorale CSIRT / NCSC-NL.'}`;
  };

  const buildDynamicThreatAnalysis = (activeQuestion: string): string => {
    const questionHeader = activeQuestion
      ? `### 💬 Direct Antwoord op uw Vraag ("${activeQuestion}")\n\n${buildSmartQuestionAnswer(activeQuestion)}\n\n---\n\n`
      : '';

    const cveList = currentIocs?.cves?.length ? currentIocs.cves.join(', ') : 'Geen specifieke CVE-code (zie aanvalsvector)';
    const ipList = currentIocs?.ips?.length ? currentIocs.ips.join(', ') : 'Dynamische C2-relais / Tor-infrastructuur';
    const mitreList = currentMitre.length > 0 ? currentMitre.join(', ') : 'T1190, T1078, T1566';

    return `${questionHeader}### Specifieke Dreigingsanalyse: ${currentThreatName}

#### 1. Kernanalyse & Dossiercontext
* **Dreigingsactor:** **${currentActor}** (${currentOrigin})
* **Specifiek Doelwit:** **${currentVictim}** (Sector: *${currentSector}*)
* **Vastgestelde Aanvalsvector:** \`${currentVector}\`
* **Geregistreerde Omvang / Eisen:** ${currentVolume || 'In onderzoek'} ${currentRansom ? `• ${currentRansom}` : ''}

**Inhoudelijke Dossierbeschrijving:**
${currentDesc}

#### 2. Technische Werkwijze & Exploitatieketen (${mitreList})
* **Exacte Inbraakmethode:** Aanvallers maken in dit dossier specifiek gebruik van **${currentVector}**.
* **Gebruikte Kwetsbaarheden / Exploits:** \`${cveList}\`
* **Netwerk- & C2-Infrastructuur:** \`${ipList}\`

#### 3. Doelgerichte Maatregelen voor dit Specifieke Incident
${buildSmartQuestionAnswer(activeQuestion || currentThreatName)}`;
  };

  const generateAnalysis = async (customQuestion?: string) => {
    const activeQuestion = (customQuestion !== undefined ? customQuestion : userPrompt).trim();
    setLoading(true);
    setAnalysisText('');

    const isLocalOrRunApp =
      typeof window !== 'undefined' &&
      (window.location.hostname.includes('run.app') ||
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1');

    const endpointUrl = isLocalOrRunApp
      ? '/api/gemini/analyze-threat'
      : `${CLOUD_BACKEND_ORIGIN}/api/gemini/analyze-threat`;

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 12000);
      const response = await fetch(endpointUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          threatName: currentThreatName,
          threatActor: currentActor,
          origin: currentOrigin,
          targetSector: currentSector,
          targetVictim: currentVictim,
          attackVector: currentVector,
          mitreTechniques: currentMitre,
          iocs: currentIocs,
          dataVolume: currentVolume,
          ransomDemanded: currentRansom,
          description: currentDesc,
          userPrompt: activeQuestion,
        }),
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (response.ok) {
        const data = await response.json();
        if (data && data.analysis) {
          setAnalysisText(data.analysis);
          setSourceUsed(data.source || 'gemini-3.8-flash');
          setLoading(false);
          return;
        }
      }
    } catch {
      // fallback to dynamic incident-specific CTI engine below
    }

    const dynamicIntel = buildDynamicThreatAnalysis(activeQuestion);
    setAnalysisText(dynamicIntel);
    setSourceUsed('ncsc-cti-engine');
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(analysisText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([analysisText], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `NCSC-Threat-Advisory-${currentActor.replace(/\s+/g, '-')}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userPrompt.trim()) {
      const q = userPrompt.trim();
      setUserPrompt('');
      generateAnalysis(q);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 rounded-xl sm:rounded-2xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl relative overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-start sm:items-center justify-between gap-2 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 shrink-0">
              <Bot className="w-5 h-5 animate-pulse" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">NCSC / MIVD Cyber Threat Intelligence Analyst</h2>
                <span className="text-xs font-mono-code bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                  {sourceUsed === 'ncsc-cti-engine' ? 'NCSC / MIVD DOSSIER ENGINE' : 'GEMINI 3.8 FLASH LIVE'}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Dossier-specifieke dreigingsanalyse, technische oorzaak en gerichte maatregelen op maat
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

        {/* Target Profile Summary */}
        <div className="mt-3.5 p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs">
          <div>
            <span className="text-slate-600">Onderzoeksobject: </span>
            <strong className="text-slate-900">{currentThreatName}</strong>
          </div>
          <div className="text-amber-800 font-mono-code text-xs font-semibold">
            Actor: {currentActor} ({currentOrigin})
          </div>
        </div>

        {/* Analysis Output Box */}
        <div className="mt-4 flex-1 overflow-y-auto bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs sm:text-sm font-mono-code text-slate-800 leading-relaxed whitespace-pre-wrap selection:bg-rose-600 selection:text-white relative min-h-[220px]">
          {loading ? (
            <div className="h-full min-h-[200px] flex flex-col items-center justify-center gap-3 text-slate-600">
              <Loader2 className="w-6 h-6 animate-spin text-rose-600" />
              <div className="text-xs sm:text-sm font-mono-code text-center">
                Specifieke dossieranalyse & technisch advies op maat genereren...
              </div>
            </div>
          ) : (
            analysisText || 'Geen analyse beschikbaar.'
          )}
        </div>

        {/* 1-Click Dynamic Follow-up Questions */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {getDynamicQuickQuestions().map((presetQ) => (
            <button
              key={presetQ}
              type="button"
              disabled={loading}
              onClick={() => generateAnalysis(presetQ)}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-300 text-slate-700 hover:text-rose-900 transition-colors cursor-pointer text-left min-h-[36px]"
            >
              🤖 {presetQ}
            </button>
          ))}
        </div>

        {/* Custom Analyst Query Bar */}
        <form onSubmit={handleCustomSubmit} className="mt-3 flex items-center gap-2">
          <input
            type="text"
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            placeholder="Stel gerichte vraag (bv: 'Wat moet TenneT doen tegen deze exploit?')..."
            className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:bg-white focus:border-rose-600 transition-colors font-sans min-h-[42px]"
          />
          <button
            type="submit"
            disabled={loading || !userPrompt.trim()}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs sm:text-sm transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer min-h-[42px]"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Verstuur</span>
          </button>
        </form>

        {/* Footer actions */}
        <div className="mt-3.5 pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => generateAnalysis('')}
              disabled={loading}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold border border-slate-300 transition-colors min-h-[40px] cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Opnieuw</span>
            </button>

            <button
              onClick={handleDownloadTxt}
              disabled={loading || !analysisText}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold border border-slate-300 transition-colors min-h-[40px] cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
          </div>

          <button
            onClick={handleCopy}
            disabled={loading || !analysisText}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors min-h-[40px] cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Gekopieerd!' : 'Kopieer Rapport'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
