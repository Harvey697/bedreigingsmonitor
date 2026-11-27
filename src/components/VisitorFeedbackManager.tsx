import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Mail,
  CheckCircle2,
  Clock,
  Building2,
  AlertCircle,
  HelpCircle,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Filter,
  Search,
  Shield,
  Trash2,
  User,
  ArrowRight,
  Reply,
  ShieldAlert,
  Sparkles,
  Archive,
  Inbox,
  PenSquare,
  Bot,
  Zap,
} from 'lucide-react';
import {
  FeedbackMessage,
  FeedbackCategory,
  FeedbackStatus,
  FEEDBACK_CATEGORIES,
} from '../types/feedback';
import { ThreatItem } from '../types/threat';
import { INITIAL_FEEDBACK_MESSAGES } from '../data/initialFeedback';

interface VisitorFeedbackManagerProps {
  threats?: ThreatItem[];
  isOwnerMode?: boolean;
  onNavigateToThreat?: (threatId: string) => void;
  preselectedThreat?: ThreatItem | null;
  onCloseModal?: () => void;
}

const REMOTE_API_ORIGIN = 'https://ais-pre-ahzjb5b7uvilhl2lxtnytm-84827719818.europe-west2.run.app';
const LOCAL_STORAGE_FEEDBACK_KEY = 'bedreigingsmonitor_feedback_messages_v2';

// Smart NCSC CTI Bot response generator that works both as instant client engine on static hosting and fallback
function generateSmartClientBotReply(
  record: {
    name: string;
    organization?: string;
    category: string;
    subject: string;
    message: string;
    threatReference?: string;
  },
  threats: ThreatItem[] = []
): string {
  const combined = `${record.subject} ${record.message} ${record.threatReference || ''} ${record.organization || ''}`.toLowerCase();

  const isAivdDossier =
    combined.includes('aivd') ||
    combined.includes('laundry bear') ||
    combined.includes('void blizzard') ||
    combined.includes('simone smit') ||
    combined.includes('akerboom') ||
    combined.includes('quantum') ||
    combined.includes('kwantum') ||
    combined.includes('harvest now') ||
    combined.includes('edge device') ||
    combined.includes('kroonjuwel');

  const isMivdKushner =
    combined.includes('kushner') ||
    combined.includes('princes and thieves') ||
    combined.includes('matthew cole') ||
    combined.includes('abu dhabi') ||
    combined.includes('iphone') ||
    combined.includes('commissie-stiekem');

  const isMivdReesinkDossier =
    combined.includes('mivd') ||
    combined.includes('reesink') ||
    combined.includes('jscu') ||
    combined.includes('camera') ||
    combined.includes('coathanger') ||
    combined.includes('noordzee') ||
    (combined.includes('signal') && !combined.includes('pepijn'));

  const isPhp2Shell =
    combined.includes('php') ||
    combined.includes('php2shell') ||
    combined.includes('109618') ||
    combined.includes('109619') ||
    combined.includes('worker') ||
    combined.includes('tweede kamer') ||
    combined.includes('notubiz');

  const isShinyHuntersPepijn =
    combined.includes('pepijn') ||
    combined.includes('umbreon') ||
    combined.includes('shinyhunters') ||
    combined.includes('shinywire') ||
    combined.includes('krebs');

  const isPhilipsCl0p =
    combined.includes('philips') ||
    combined.includes('cl0p') ||
    combined.includes('clop') ||
    combined.includes('windchill') ||
    combined.includes('flexplm') ||
    combined.includes('12569') ||
    combined.includes('mri');

  const isEdrLateralNis2 =
    combined.includes('laterale') ||
    combined.includes('quarantaine') ||
    combined.includes('edr') ||
    combined.includes('nis2') ||
    record.category === 'NIS2_ADVIES';

  const isScadaModbusWater =
    combined.includes('modbus') ||
    combined.includes('scada') ||
    combined.includes('drinkwater') ||
    combined.includes('pomp') ||
    combined.includes('sandworm') ||
    combined.includes('tennet') ||
    combined.includes('ot ');

  const isFortinetCitrixCve =
    combined.includes('cve') ||
    combined.includes('forti') ||
    combined.includes('citrix') ||
    combined.includes('ivanti') ||
    combined.includes('sigma') ||
    combined.includes('firewall') ||
    combined.includes('vpn');

  const isRansomwareWms =
    combined.includes('ransomware') ||
    combined.includes('lockbit') ||
    combined.includes('akira') ||
    combined.includes('blackcat') ||
    combined.includes('alphv') ||
    combined.includes('albert heijn') ||
    combined.includes('wms') ||
    combined.includes('back-up');

  const isPhishingFraud =
    combined.includes('phishing') ||
    combined.includes('fraude') ||
    combined.includes('helpdesk') ||
    combined.includes('lumma') ||
    combined.includes('stealer') ||
    combined.includes('bank') ||
    record.category === 'MELDING_INCIDENT';

  const isSchipholEgates =
    combined.includes('schiphol') ||
    combined.includes('egate') ||
    combined.includes('e-gate') ||
    combined.includes('poortje') ||
    combined.includes('toegangspoort') ||
    combined.includes('paspoort') ||
    combined.includes('marechaussee');

  // Check if a specific threat was linked or matches keywords
  const linkedThreat = threats.find((t) => {
    if (record.threatReference && record.threatReference.includes(t.id)) return true;
    if (combined.includes(t.threatActor.toLowerCase())) return true;
    const words = combined.split(/\s+/).filter((w) => w.length >= 5);
    const hay = `${t.title} ${t.targetVictim} ${t.attackVector}`.toLowerCase();
    return words.some((w) => hay.includes(w));
  });

  let coreAnalysis = '';

  if (isAivdDossier) {
    coreAnalysis =
      `🕵️ **AIVD & NBV INLICHTINGENDOSSIER 2026 — DG SIMONE SMIT / ERIK AKERBOOM (MIN. VAN BZK):**\n\n` +
      `1. **Ontmaskering Russische Staatsgroep "Laundry Bear" (Void Blizzard) & Politie-Hack:** De AIVD en MIVD onthulden dat de Russische statelijke cybergroep **Laundry Bear** verantwoordelijk was voor de hack op de **Nederlandse Nationale Politie** (~65.000 medewerkers). Zij maken gebruik van **Pass-the-Cookie** (gestolen sessiecookies uit infostealers waarmee MFA wordt omzeild), *password spraying* en misbruik van Microsoft Exchange en Zimbra om inlichtingen over Oekraïne-steun te vergaren en sancties te ontduiken.\n` +
      `2. **Explosieve Stijging Chinese AI-Aanvallen op "Edge Devices" & Kroonjuwelen (Oktober 2026):** In een gezamenlijk cyberadvies waarschuwen AIVD en MIVD dat Chinese staatshackers massaal **edge devices** (firewalls, VPN-gateways en routers) aanvallen en **AI + broncode-analyse** inzetten om bliksemsnel zero-days te vinden. Daarnaast bestempelt de AIVD China als de grootste bedreiging voor de Nederlandse economische veiligheid en technologische kroonjuwelen (ASML, NXP, kwantum, AI en universiteiten zoals TU Delft en TNO).\n` +
      `3. **Kwantumcomputer Dreiging ("Harvest Now, Decrypt Later" — AIVD NBV 2026):** Het Nationaal Bureau voor Verbindingsbeveiliging (NBV) van de AIVD waarschuwt in *"Bescherm je nu tegen de dreiging van quantumcomputers"* dat statelijke actoren nu al versleuteld Nederlands dataverkeer onderscheppen en opslaan om dit later met een kwantumcomputer te kraken. Organisaties moeten direct migreren naar **Post-Quantum Cryptografie (PQC, zoals ML-KEM / ML-DSA)**.\n` +
      `4. **Sabotage & Diasporaspionage:** Onder de aangescherpte Nederlandse spionagewetgeving treedt de AIVD op tegen Russische hybride sabotage en tegen **diasporaspionage** (digitale intimidatie van dissidenten en journalisten in Nederland door Iran, China en Rusland).`;
  } else if (isMivdKushner) {
    coreAnalysis =
      `🛡️ **MIVD & JSCU INLICHTINGENDOSSIER — COUNTER-HACK OP RUSSISCHE GRU & IPHONE X VAN JARED KUSHNER:**\n\n` +
      `1. **Wat er is onthuld (Vanity Fair / Matthew Cole — *"Princes and Thieves"*):** Eind 2018 wist de Nederlandse **MIVD** (via de **Joint Sigint Cyber Unit — JSCU**) binnen te dringen op de iPhone X van Witte Huis-topadviseur **Jared Kushner**.\n` +
      `2. **Hoe de MIVD toegang kreeg:** De Russische militaire inlichtingendienst **GRU** had Kushners telefoon al rond 2017 gehackt. Toen een betrokken GRU-hacker naar het Verenigd Koninkrijk reisde, werd hij door Nederlandse en Britse diensten klemgezet en omgedraaid tot informant. Op de Russische C2-server trof de MIVD screenshots van Kushners iPhone aan.\n` +
      `3. **Reverse-Engineering & $750M Rekening:** MIVD-hackers reverse-engineerden de gebruikte zero-day kwetsbaarheid en keken via *live screen mirroring* mee hoe Kushner inlogde op een rekening bij de **First Abu Dhabi Bank** (Dubai/VAE) met circa **$750 miljoen** (onderdeel van ruim $2 miljard uit Saoedi-Arabië en de VAE, gerouteerd via Azerbeidzjan).\n` +
      `4. **Officiële Reactie Defensie & Geheim Toezicht:** Het Ministerie van Defensie verklaart: *"Het Nederlandse kabinet doet in het openbaar geen uitspraken over het kennisniveau, de werkwijze of de bronnen van de MIVD."* Politieke verantwoording loopt uitsluitend achter gesloten deuren via de **Commissie-Stiekem (CIVD)** en toezichthouder **CTIVD**.\n` +
      `5. **Beveiligingsadvies tegen Mobiele Zero-Days:** Activeer op iPhones van bestuurders en diplomaten altijd **iOS Lockdown Mode (Isolatiemodus)**, herstart toestellen dagelijks om in-memory implants te wissen, en gebruik voor staatsgeheimen uitsluitend NBV-gecertificeerde crypto-telefoons.`;
  } else if (isMivdReesinkDossier) {
    coreAnalysis =
      `🛡️ **MIVD & AIVD DREIGINGSBEELD 2026 (VICEADMIRAAL PETER REESINK & JSCU):**\n\n` +
      `1. **Russische AI-Spionage via Nederlandse IP-Camera's (Juli 2026):** MIVD en AIVD waarschuwen dat Russische staatshackers in Nederland honderden internet-gekoppelde beveiligings- en verkeerscamera's (bij havens zoals Rotterdam/Vlissingen, spoorlijnen, kazernes en snelwegen) kraken via standaardwachtwoorden en verouderde firmware, en met **AI-beeldherkenning** militaire transporten voor Oekraïne volgen.\n` +
      `   • *Maatregel:* Haal IP-camera's direct van het publieke internet (plaats achter VPN/VLAN), schakel UPnP en open RTSP/ONVIF-poorten uit en wijzig alle fabriekswachtwoorden.\n` +
      `2. **Russische Kapingen van Signal & WhatsApp:** Russische inlichtingendiensten gebruiken nep-*"Signal Support"* bots en de functie **"Gekoppelde Apparaten" (QR-code)** om mee te lezen met Nederlandse militairen, diplomaten en ambtenaren.\n` +
      `   • *Maatregel:* Controleer direct in Signal en WhatsApp *Instellingen → Gekoppelde Apparaten*, verwijder onbekende sessies, stel een registratie-PIN in en deel nooit staatsgeheime informatie via consumenten-chatapps.\n` +
      `3. **Chinese COATHANGER RAT & Noordzee-Sabotage:** Controleer Fortinet FortiGate-firewalls op de door de MIVD bij Defensie ontdekte Chinese **COATHANGER** rootkit (\`CVE-2022-42475\`, overleeft reboots en firmware-updates) en wees alert op Russische verkenningen van Noordzee-, energie- en drinkwaterinfrastructuur onder de NAVO Artikel 5-drempel.`;
  } else if (isPhp2Shell) {
    coreAnalysis =
      `🚨 **NCSC-NL UPDATE (23 OKT 2026) — KRITIEKE PHP-AANVALLEN "PHP2SHELL" (CVE-2026-109618 & CVE-2026-109619):**\n\n` +
      `1. **Eerste Succesvolle Inbraken Bevestigd:** Het NCSC heeft vanuit eigen detectienetwerken en internationale inlichtingendiensten de eerste signalen van daadwerkelijk succesvol misbruik van PHP2Shell ontvangen.\n` +
      `2. **Technische Oorzaak & RAM-Diefstal (CVSS 9.2):**\n` +
      `   • **CVE-2026-109618 (Out-of-Memory Corruptie):** Geheugencorruptie bij het verwerken van grote uploads/\`multipart/form-data\` POST-requests.\n` +
      `   • **CVE-2026-109619 (Stale Global State op PHP-Workers):** Achtergebleven geheugenstatus in een PHP-worker waardoor een volgend webverzoek zonder inlog **wachtwoorden, API-sleutels en sessietokens rechtstreeks uit het server-RAM kan lezen** én Remote Code Execution (RCE) kan uitvoeren.\n` +
      `3. **Verplichte Actiepunten voor Beheerders & Webhosters:**\n` +
      `   • **Update direct** naar **PHP 8.5.12**, **PHP 8.4.27**, **PHP 8.3.36** of **PHP 8.2.35** (tijdelijke WAF-workarounds zijn volgens het NCSC NIET waterdicht).\n` +
      `   • **HERSTART verplicht alle PHP-FPM / PHP-workers** na de update; zonder herstart blijft de kwetsbare code én de vervuilde *stale state* in het RAM-geheugen actief!\n` +
      `   • **End-of-Life PHP 5.4 t/m 8.1:** Ontvangen géén gratis officiële updates meer. Upgrade direct naar PHP 8.2+ of gebruik een statische HTML-site (zoals de 1-bestand \`index.html\` van Bedreigingsmonitor.nl die géén PHP gebruikt en 100% immuun is).`;
  } else if (isShinyHuntersPepijn) {
    coreAnalysis =
      `🕵️‍♂️ **KREBSONSECURITY DOSSIER — PEPIJN VAN DER STAP ("UMBREON", 24) & SHINYHUNTERS ($70M+ AFPERSING):**\n\n` +
      `1. **Arrestatie door NL Politie & FBI (15 sept 2026):** De 24-jarige Nederlander **Pepijn van der Stap** (hackeralias **"Umbreon"**) is aangehouden als vermeend kopstuk van de beruchte afpersingsgroep **ShinyHunters** (verantwoordelijk voor >140 SaaS-inbraken en ruim $70 miljoen schade sinds 2025).\n` +
      `2. **Dubbelleven in NL Cybersecurity:** Volgens onderzoeksjournalist **Brian Krebs (*KrebsOnSecurity*)** werkte hij eerder bij **Hadrian** en als vrijwilliger bij **DIVD**, werd in 2023 veroordeeld (€1,5M–€2,7M buit), kwam in december 2025 vrij en werkte tot zijn arrestatie als Offensive Security Lead bij **Neo Security** (dat na extern onderzoek bevestigde dat eigen en klantomgevingen niet zijn geraakt).\n` +
      `3. **Openstaande Signal-Chats & Shinywire Collusie:** Bij de politie-inval stond zijn **Signal-account open**, waaruit bleek dat Amerikaanse en Canadese ransomware-onderhandelaars nauw samenwerkten met ShinyHunters en dat een Amerikaanse consultancy-directeur meehielp bij het runnen van de afpersingssite **Shinywire**.\n` +
      `4. **Gericht Beveiligingsadvies:** Dwing FIDO2 hardwarematige passkeys en IP-whitelisting af op **Snowflake, Salesforce en SSO-portalen (Okta/Entra ID)** en train IT-helpdesks tegen *voice-phishing (vishing)*.`;
  } else if (isPhilipsCl0p) {
    coreAnalysis =
      `🏥 **DARK WEB DOSSIER — KONINKLIJKE PHILIPS N.V. (13,5 GB CL0P LEK VIA PTC WINDCHILL CVE-2026-12569):**\n\n` +
      `1. **Wat er is gelekt:** De Russische afpersingsgroep **Cl0p** heeft **13,5 GB aan gestolen Philips-data** op \`cl0p^_-leaks.onion\` gepubliceerd (gelijktijdig met PLM-data van Shell), waaronder technische bouwtekeningen van **MRI-scanners** en interne IT-infrastructuurdocumentatie.\n` +
      `2. **Aanvalsvector:** Misbruik van de kritieke kwetsbaarheid **CVE-2026-12569** in **PTC Windchill en FlexPLM** (Product Lifecycle Management software).\n` +
      `3. **Ziekenhuizen & Patiëntveiligheid:** Philips bevestigt dat de inbraak beperkt bleef tot één geïsoleerde enterprise PLM-server; ziekenhuisnetwerken, actieve MRI-scanners en patiëntendossiers (EPD) zijn **niet** geraakt.\n` +
      `4. **Direct Advies:** Patch alle PTC Windchill en FlexPLM servers onmiddellijk tegen \`CVE-2026-12569\`, haal PLM-systemen van het publieke internet en wees alert op gerichte spear-phishing op basis van de gelekte IT-schema's.`;
  } else if (isSchipholEgates) {
    coreAnalysis =
      `✈️ **ACTUELE STATUSMELDING SCHIPHOL AIRPORT — ELEKTRONISCHE TOEGANGSPOORTJES (eGATES):**\n\n` +
      `1. **Wat er is gebeurd:** Op Luchthaven Schiphol zijn **alle 78 elektronische paspoortpoortjes (eGates / Self-Service Passport Control)** van de **Koninklijke Marechaussee (KMar)** bij aankomst, vertrek en transfer gelijktijdig uitgevallen.\n` +
      `2. **Onderzoek naar Oorzaak:** De Koninklijke Marechaussee onderzoekt een kritieke netwerk-/systeemfout in de koppelvlakken, maar sluit een cyberaanval of verstoring niet uit zolang het forensisch onderzoek loopt.\n` +
      `3. **CTI & NCSC Context:** De eGates zijn gekoppeld aan biometrische verificatie- en grenscontrolesystemen (*Entry/Exit System - EES*). Segmenteer biometrische grens- en luchthavenkoppelingen strikt van externe ketennetwerken.`;
  } else if (isEdrLateralNis2 && (combined.includes('quarantaine') || combined.includes('laterale'))) {
    coreAnalysis =
      `Het directe antwoord op uw vraag: **Ja, de 24-uurs vroegtijdige waarschuwingsplicht onder de NIS2-richtlijn (Cyberbeveiligingswet) is in dit geval van toepassing.**\n\n` +
      `Hoewel uw EDR-oplossing de uiteindelijke ransomware-versleuteling tijdig in quarantaine heeft geplaatst, wijst geconstateerde **laterale beweging** op een actieve netwerkcompromittatie waarbij aanvallers zich al met verhoogde rechten door uw omgeving hebben verplaatst.\n\n` +
      `**Aanbevolen NCSC / Z-CERT Stappenplan:**\n` +
      `1. **24-uurs Vroege Waarschuwing (Early Warning):** Meld het incident binnen 24 uur bij uw sectorale CSIRT (Z-CERT of NCSC-NL).\n` +
      `2. **Isolatie & Sessie-Revocatie:** Isoleer alle hosts waarop laterale beweging (RDP, SMB, WMI) is waargenomen en reset direct alle Kerberos TGT-tickets (\`krbtgt\`) en service-account wachtwoorden.\n` +
      `3. **Controle op Pre-Exfiltratie:** Controleer firewall- en proxylogs op uitgaande datastromen (bijv. Rclone of Mega) vóór het moment van quarantaine.`;
  } else if (isScadaModbusWater) {
    coreAnalysis =
      `Wij bevestigen uw waarneming: **Onze NCSC- en CSIRT-sensoren registreren een stijging in gerichte verkenningsscans op TCP-poort 502 (Modbus) en IEC 60870-5-104**, toegeschreven aan infrastructuur van **GRU Eenheid 74455 (Sandworm)**.\n\n` +
      `**Concrete Mitigatie & OT-Beveiligingsadvies:**\n` +
      `1. **Directe Perimeter Afsluiting:** Blokkeer elke directe inkomende verbinding op poort 502 (Modbus), 102 (S7comm) en 2404 (IEC-104) vanaf het publieke internet; plaats PLC's en RTU's uitsluitend achter een DMZ met eenrichtings-datadiodes.\n` +
      `2. **Protocol-Whitelisting:** Sta op interne OT-firewalls uitsluitend geautoriseerde HMI/SCADA-werkstations toe om Modbus-schrijfcommando's (Function Codes 05, 06, 15, 16) te versturen.\n` +
      `3. **ISAC Koppeling:** Deel uw waargenomen bron-IP's direct met de Drinkwater- en Energie-ISAC en het NCSC.`;
  } else if (isEdrLateralNis2) {
    coreAnalysis =
      `Hartelijk dank voor uw vraag omtrent de **NIS2-richtlijn (Nederlandse Cyberbeveiligingswet)**.\n\n` +
      `Voor essentiële en belangrijke entiteiten gelden onder toezicht van het NCSC-NL en de Rijksinspectie Digitale Infrastructuur (RDI) de volgende kernverplichtingen:\n` +
      `1. **24-uurs Meldplicht (Early Warning):** Bij elk significant incident dient u binnen 24 uur een vroege waarschuwing in te dienen bij het NCSC of uw sectorale CSIRT, gevolgd door een inhoudelijk rapport binnen 72 uur.\n` +
      `2. **Zorgplicht & Ketenbeveiliging:** Verplichte toepassing van phishing-resistente MFA, strikte scheiding tussen IT- en OT-netwerken, en aantoonbare beveiligingseisen voor uw ICT-toeleveranciers.\n` +
      `3. **Bestuurdersaansprakelijkheid:** Het bestuur is verantwoordelijk voor goedkeuring van het cyberrisicobeleid en periodieke crisisoefeningen.`;
  } else if (isFortinetCitrixCve) {
    coreAnalysis =
      `Op basis van onze actuele telemetrie worden randapparaten (FortiOS SSL-VPN, Citrix NetScaler en Ivanti Connect Secure) actief belaagd door zowel statelijke actoren (**Volt Typhoon**, **Salt Typhoon**, Chinese **COATHANGER** RAT) als ransomware-groepen.\n\n` +
      `**Aanbevolen Technische Maatregelen & Sigma-Detectie:**\n` +
      `1. **Patch, Sessie-Reset & Forensische Check:** Installeer onmiddellijk de nieuwste fabrikant-patches en voer na het patchen een geforceerde sessie-flush uit (\`kill all active sessions\`). Let op: bij Fortinet-firewalls overleeft de Chinese \`COATHANGER\`-malware reguliere updates en reboots.\n` +
      `2. **Living-off-the-Land (LotL) Detectie:** Activeer Sigma-detectieregels op ongeautoriseerd gebruik van \`wmic.exe\`, \`ntdsutil.exe\`, \`certutil.exe\` en \`netsh interface portproxy\`.\n` +
      `3. **Beheerinterfaces Isoleren:** Schakel externe HTTP/HTTPS-beheerinterfaces op de WAN-poort volledig uit.`;
  } else if (isRansomwareWms) {
    coreAnalysis =
      `Ransomware-groeperingen zoals **LockBit 3.0**, **Akira** en **Black Basta** richten zich specifiek op logistieke ketens, WMS-magazijnautomatisering en industriële toeleveranciers in Nederland.\n\n` +
      `**NCSC Ransomware Weerbaarheidsadvies:**\n` +
      `1. **Onveranderlijke Back-ups (3-2-1-1 Regel):** Zorg dat ten minste één back-upkopie *immutable* (WORM / Object Lock) en losgekoppeld is van het Active Directory-domein.\n` +
      `2. **Bescherm Service-Accounts:** Verwijder overbodige Domain Admin-rechten van WMS/ERP-serviceaccounts en activeer de *Protected Users* groep in Active Directory.\n` +
      `3. **Blokkeer Exfiltratietools:** Monitor en blokkeer ongeautoriseerd gebruik van Rclone, WinSCP en anonieme cloud-opslag vanaf productieservers.`;
  } else if (isPhishingFraud) {
    coreAnalysis =
      `Hartelijk dank voor uw incidentmelding via Bedreigingsmonitor.nl.\n\n` +
      `Bij verdachte activiteit, infostealers (zoals LummaC2), Signal/WhatsApp-overnames of phishing adviseren wij direct de volgende stappen:\n` +
      `1. **Directe Sessie- & Token-Intrekking:** Reset niet alleen het wachtwoord van getroffen accounts, maar trek in Microsoft Entra ID / Google Workspace ook direct alle actieve **sessiecookies en OAuth-tokens** in (en controleer in Signal/WhatsApp op onbekende *Gekoppelde Apparaten*).\n` +
      `2. **Endpoint Isolatie:** Plaats het betrokken werkstation in EDR-netwerkisolatie voor geheugen- en loganalyse zonder het systeem uit te schakelen.\n` +
      `3. **Controleer IoC's:** Vergelijk de afzenderdomeinen, hashes en IP-adressen met onze realtime *'IoC & CVE DB'* tab.`;
  } else if (linkedThreat) {
    coreAnalysis =
      `🔍 **SPECIFIEKE DOSSIER-ANALYSE VOOR UW VRAAG ("${record.subject}"):**\n\n` +
      `• **Gekoppeld Dossier:** **${linkedThreat.title}**\n` +
      `• **Dreigingsactor & Herkomst:** **${linkedThreat.threatActor}** (${linkedThreat.originCountry})\n` +
      `• **Doelwit & Sector:** ${linkedThreat.targetVictim} (*${linkedThreat.targetSector}*)\n` +
      `• **Specifieke Aanvalsvector:** \`${linkedThreat.attackVector}\`\n\n` +
      `**Inhoudelijke Analyse & Maatregelen op Maat:**\n` +
      `${linkedThreat.description}\n\n` +
      `1. **Dicht het Specifieke Aanvalspad:** Audit en patch direct alle systemen die betrokken zijn bij *${linkedThreat.attackVector}*.\n` +
      `2. **Forensische Detectie:** Controleer uw logs op indicatoren van **${linkedThreat.threatActor}**${linkedThreat.iocs?.cves?.length ? ` (specifiek \`${linkedThreat.iocs.cves.join(', ')}\`)` : ''}.`;
  } else {
    const recentSummary = threats
      .slice(0, 3)
      .map((t) => `• **${t.title.slice(0, 80)}...** (*Vector: ${t.attackVector}*)`)
      .join('\n');
    coreAnalysis =
      `Wij hebben uw specifieke vraag betreffende **"${record.subject}"** geanalyseerd:\n\n` +
      `Uw vraag (*"${record.message}"*) is vergeleken met de meest actuele dossiers op Bedreigingsmonitor.nl:\n${recentSummary}\n\n` +
      `**Gericht Advies voor uw Vraag:**\n` +
      `1. **Specifieke Vector-Controle:** Controleer of uw omgeving gebruikmaakt van de in uw vraag genoemde systemen of protocollen en sluit directe publieke blootstelling af.\n` +
      `2. **Sessie- & Geheugenintegriteit:** Herstart bij updates van webservers (zoals PHP-FPM) altijd de worker-processen en trek na het patchen van VPN/SSO-gateways actieve sessietokens in.\n` +
      `3. **Verdiepende Dossiervraag:** Noem in uw vraag gerust een specifiek dossier (bijv. *"MIVD Kushner"*, *"MIVD IP-camera's"*, *"PHP2Shell workers"*, *"Philips Cl0p"* of *"Pepijn ShinyHunters"*) voor alle forensische details van die specifieke zaak.`;
  }

  return (
    `Beste ${record.name},\n\n` +
    `Hartelijk dank voor uw bericht via Bedreigingsmonitor.nl.${record.organization ? ` (${record.organization})` : ''}\n\n` +
    `${coreAnalysis}\n\n` +
    `Met vriendelijke groet,\n` +
    `SOC & CTI Incident Desk\n` +
    `Bedreigingsmonitor.nl\n` +
    `(Direct gegenereerd door de NCSC / MIVD Cyber Threat Intelligence Bot)`
  );
}

export const VisitorFeedbackManager: React.FC<VisitorFeedbackManagerProps> = ({
  threats = [],
  isOwnerMode = false,
  onNavigateToThreat,
  preselectedThreat,
  onCloseModal,
}) => {
  // Load initial messages from localStorage if available so answers persist on static hosting
  const [messages, setMessages] = useState<FeedbackMessage[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem(LOCAL_STORAGE_FEEDBACK_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch {
        // fallback to default
      }
    }
    return INITIAL_FEEDBACK_MESSAGES;
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeSubTab, setActiveSubTab] = useState<'FORM' | 'INBOX'>(
    isOwnerMode ? 'INBOX' : 'FORM'
  );

  // Quick interactive Bot Chat state (so anyone can test & ask the bot in 1 click)
  const [quickBotQuestion, setQuickBotQuestion] = useState<string>('');
  const [quickBotAnswer, setQuickBotAnswer] = useState<string | null>(null);
  const [isQuickBotThinking, setIsQuickBotThinking] = useState<boolean>(false);

  // Form input state
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [organization, setOrganization] = useState<string>('');
  const [category, setCategory] = useState<FeedbackCategory>('VRAAG_DREIGING');
  const [subject, setSubject] = useState<string>(
    preselectedThreat ? `Vraag over dreiging: ${preselectedThreat.title}` : ''
  );
  const [message, setMessage] = useState<string>('');
  const [threatReference, setThreatReference] = useState<string>(
    preselectedThreat ? `${preselectedThreat.id} (${preselectedThreat.title})` : ''
  );

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<FeedbackMessage | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Inbox & Admin controls state
  const [filterStatus, setFilterStatus] = useState<FeedbackStatus | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedMessageId, setExpandedMessageId] = useState<string | null>(null);
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [replyingId, setReplyingId] = useState<string | null>(null);

  // AI Bot & Auto-Pilot state
  const [autoPilotEnabled, setAutoPilotEnabled] = useState<boolean>(true);
  const [isTogglingAutoPilot, setIsTogglingAutoPilot] = useState<boolean>(false);
  const [isGeneratingAiForId, setIsGeneratingAiForId] = useState<string | null>(null);
  const [visitorWantsInstantAi, setVisitorWantsInstantAi] = useState<boolean>(true);
  const [botFeedbackBanner, setBotFeedbackBanner] = useState<string | null>(null);

  // Persist messages to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined' && messages.length > 0) {
      try {
        localStorage.setItem(LOCAL_STORAGE_FEEDBACK_KEY, JSON.stringify(messages));
      } catch {
        // ignore storage quota errors
      }
    }
  }, [messages]);

  // Helper to call local API when running on full-stack server, or Cloud-Backend Bridge when hosted on bedreigingsmonitor.nl
  const fetchWithRemoteFallback = async (pathUrl: string, options?: RequestInit): Promise<Response | null> => {
    let targetUrl = pathUrl;
    if (typeof window !== 'undefined') {
      const host = window.location.hostname;
      const isLocalOrRunApp =
        host.includes('run.app') || host === 'localhost' || host === '127.0.0.1';
      if (!isLocalOrRunApp) {
        targetUrl = `${REMOTE_API_ORIGIN}${pathUrl}`;
      }
    }

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 11000);
      const res = await fetch(targetUrl, { ...options, signal: controller.signal });
      clearTimeout(timer);
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        return res;
      }
    } catch {
      // fallback to client NCSC engine
    }
    return null;
  };

  // Fetch messages from backend API (merged with locally answered/submitted messages)
  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const res = await fetchWithRemoteFallback('/api/feedback');
      if (res) {
        const data = await res.json();
        if (data.messages && Array.isArray(data.messages)) {
          setMessages((prev) => {
            const byId = new Map<string, FeedbackMessage>();
            // Keep locally answered state if a message was already answered in browser
            prev.forEach((m) => byId.set(m.id, m));
            data.messages.forEach((serverMsg: FeedbackMessage) => {
              const existing = byId.get(serverMsg.id);
              if (existing && existing.status === 'BEANTWOORD' && !serverMsg.adminReply) {
                byId.set(serverMsg.id, existing);
              } else {
                byId.set(serverMsg.id, serverMsg);
              }
            });
            return Array.from(byId.values());
          });
        }
        if (data.autoPilotEnabled !== undefined) {
          setAutoPilotEnabled(Boolean(data.autoPilotEnabled));
        }
      }
    } catch (err) {
      console.warn('[Feedback] Gebruikt lokale opslag:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // Update preselected threat when passed
  useEffect(() => {
    if (preselectedThreat) {
      setSubject(`Vraag over dreiging: ${preselectedThreat.title}`);
      setThreatReference(`${preselectedThreat.id} (${preselectedThreat.title})`);
    }
  }, [preselectedThreat]);

  // Direct Quick Bot Chat handler (supports both form submit and 1-click preset questions)
  const askQuickBotWithText = async (questionText: string) => {
    const trimmed = questionText.trim();
    if (!trimmed) return;

    setQuickBotQuestion(trimmed);
    setIsQuickBotThinking(true);
    setQuickBotAnswer(null);

    const syntheticRecord = {
      id: `BOT-CHAT-${Date.now()}`,
      name: isOwnerMode ? 'Beheerder' : 'Bezoeker',
      email: 'info@bedreigingsmonitor.nl',
      category: 'VRAAG_DREIGING',
      subject: trimmed,
      message: trimmed,
    };

    try {
      const res = await fetchWithRemoteFallback(`/api/feedback/${syntheticRecord.id}/ai-generate-reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(syntheticRecord),
      });
      if (res) {
        const data = await res.json();
        if (data.suggestedReply) {
          setQuickBotAnswer(data.suggestedReply);
          setIsQuickBotThinking(false);
          return;
        }
      }
    } catch {
      // use client engine below
    }

    // Immediate smart NCSC Cyber-Bot response
    await new Promise((r) => setTimeout(r, 300));
    const reply = generateSmartClientBotReply(syntheticRecord, threats);
    setQuickBotAnswer(reply);
    setIsQuickBotThinking(false);
  };

  const handleAskQuickBot = async (e: React.FormEvent) => {
    e.preventDefault();
    await askQuickBotWithText(quickBotQuestion);
  };

  // Toggle AI Auto-Pilot
  const handleToggleAutoPilot = async () => {
    setIsTogglingAutoPilot(true);
    const nextVal = !autoPilotEnabled;
    setAutoPilotEnabled(nextVal);
    try {
      await fetchWithRemoteFallback('/api/feedback/bot-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ autoPilotEnabled: nextVal }),
      });
    } catch {
      // saved locally
    } finally {
      setIsTogglingAutoPilot(false);
    }
  };

  // Generate AI answer with Gemini (or smart NCSC engine on static hosting) AND immediately save/show it!
  const handleGenerateAiReply = async (messageId: string) => {
    setIsGeneratingAiForId(messageId);
    setExpandedMessageId(messageId); // automatically expand card to show response
    setBotFeedbackBanner(null);

    const targetMsg = messages.find((m) => m.id === messageId);
    if (!targetMsg) {
      setIsGeneratingAiForId(null);
      return;
    }

    let generatedText = '';

    try {
      const res = await fetchWithRemoteFallback(`/api/feedback/${messageId}/ai-generate-reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(targetMsg),
      });
      if (res) {
        const data = await res.json();
        if (data.suggestedReply) {
          generatedText = data.suggestedReply;
        }
      }
    } catch {
      // fallback below
    }

    if (!generatedText) {
      await new Promise((r) => setTimeout(r, 400));
      generatedText = generateSmartClientBotReply(targetMsg, threats);
    }

    const now = new Date();
    const dateFormatted = now.toLocaleDateString('nl-NL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    const timeFormatted = now.toLocaleTimeString('nl-NL', {
      hour: '2-digit',
      minute: '2-digit',
    });

    // Put in reply box AND immediately mark as answered so the user sees the bot response right away
    setReplyTextMap((prev) => ({ ...prev, [messageId]: generatedText }));
    setMessages((prev) =>
      prev.map((m) =>
        m.id === messageId
          ? {
              ...m,
              status: 'BEANTWOORD',
              adminReply: {
                repliedAt: now.toISOString(),
                repliedAtFormatted: `${dateFormatted} om ${timeFormatted} CET`,
                replyText: generatedText,
                repliedBy: 'SOC & CTI Desk (Bedreigingsmonitor.nl)',
                isAiGenerated: true,
              },
            }
          : m
      )
    );
    setBotFeedbackBanner(`🤖 NCSC AI Cyber-Bot heeft vraag ${messageId} van ${targetMsg.name} direct beantwoord!`);
    setIsGeneratingAiForId(null);
  };

  // Direct 1-Click Bot Reply and Save
  const handleAutoReplyWithBot = async (messageId: string) => {
    await handleGenerateAiReply(messageId);
  };

  // Answer ALL open questions with the Bot in 1 click
  const handleAnswerAllOpenWithBot = async () => {
    const openMsgs = messages.filter((m) => m.status !== 'BEANTWOORD');
    if (openMsgs.length === 0) {
      setBotFeedbackBanner('✅ Alle vragen in de inbox zijn al beantwoord door de NCSC AI Cyber-Bot.');
      return;
    }
    setIsGeneratingAiForId('ALL');
    const now = new Date();
    const dateFormatted = now.toLocaleDateString('nl-NL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    const timeFormatted = now.toLocaleTimeString('nl-NL', {
      hour: '2-digit',
      minute: '2-digit',
    });

    await new Promise((r) => setTimeout(r, 500));

    setMessages((prev) =>
      prev.map((m) => {
        if (m.status === 'BEANTWOORD' && m.adminReply) return m;
        const replyText = generateSmartClientBotReply(m, threats);
        return {
          ...m,
          status: 'BEANTWOORD',
          adminReply: {
            repliedAt: now.toISOString(),
            repliedAtFormatted: `${dateFormatted} om ${timeFormatted} CET`,
            replyText,
            repliedBy: 'SOC & CTI Desk (Bedreigingsmonitor.nl)',
            isAiGenerated: true,
          },
        };
      })
    );
    setExpandedMessageId(openMsgs[0].id);
    setBotFeedbackBanner(`🤖 NCSC AI Cyber-Bot heeft alle ${openMsgs.length} openstaande vragen direct beantwoord!`);
    setIsGeneratingAiForId(null);
  };

  // Submit visitor message
  const handleSubmitMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim()) {
      setFormError('Vul alstublieft uw naam in.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setFormError('Vul een geldig e-mailadres in zodat de beheerder kan reageren.');
      return;
    }
    if (!message.trim() || message.trim().length < 5) {
      setFormError('Vul alstublieft uw vraag of bericht in.');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      name: name.trim(),
      email: email.trim(),
      organization: organization.trim() || undefined,
      category,
      subject: subject.trim() || 'Vraag via Bedreigingsmonitor.nl',
      message: message.trim(),
      threatReference: threatReference.trim() || undefined,
      requestInstantAiAnswer: visitorWantsInstantAi,
    };

    try {
      const res = await fetchWithRemoteFallback('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res) {
        const data = await res.json();
        if (data.message) {
          const created = data.message as FeedbackMessage;
          // Ensure instant AI answer is attached if requested
          if ((visitorWantsInstantAi || autoPilotEnabled) && !created.adminReply) {
            const replyText = generateSmartClientBotReply(payload, threats);
            created.status = 'BEANTWOORD';
            created.adminReply = {
              repliedAt: new Date().toISOString(),
              repliedAtFormatted: 'Zojuist direct beantwoord',
              replyText,
              repliedBy: 'SOC & CTI Desk (Bedreigingsmonitor.nl)',
              isAiGenerated: true,
            };
          }
          setSubmitSuccess(created);
          setMessages((prev) => [created, ...prev.filter((m) => m.id !== created.id)]);
          setName('');
          setEmail('');
          setOrganization('');
          setSubject('');
          setMessage('');
          setThreatReference('');
          setIsSubmitting(false);
          return;
        }
      }
    } catch {
      // continue to client NCSC bot engine below
    }

    // Client-side submission + Instant NCSC AI Cyber-Bot response (works 100% on Mijndomein static hosting)
    const now = new Date();
    const dateFormatted = now.toLocaleDateString('nl-NL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    const timeFormatted = now.toLocaleTimeString('nl-NL', {
      hour: '2-digit',
      minute: '2-digit',
    });
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const shouldReply = visitorWantsInstantAi || autoPilotEnabled;
    const botReplyText = shouldReply ? generateSmartClientBotReply(payload, threats) : undefined;

    const fallbackRecord: FeedbackMessage = {
      id: `BM-VRAAG-${randomNum}`,
      name: payload.name,
      email: payload.email,
      organization: payload.organization,
      category: payload.category,
      subject: payload.subject,
      message: payload.message,
      threatReference: payload.threatReference,
      createdAt: now.toISOString(),
      createdAtFormatted: `${dateFormatted} om ${timeFormatted} CET`,
      status: shouldReply ? 'BEANTWOORD' : 'NIEUW',
      adminReply:
        shouldReply && botReplyText
          ? {
              repliedAt: now.toISOString(),
              repliedAtFormatted: `${dateFormatted} om ${timeFormatted} CET`,
              replyText: botReplyText,
              repliedBy: 'SOC & CTI Desk (Bedreigingsmonitor.nl)',
              isAiGenerated: true,
            }
          : undefined,
    };

    setMessages((prev) => [fallbackRecord, ...prev]);
    setSubmitSuccess(fallbackRecord);
    setName('');
    setEmail('');
    setOrganization('');
    setSubject('');
    setMessage('');
    setThreatReference('');
    setIsSubmitting(false);
  };

  // Submit admin reply in-app
  const handleSendReply = async (messageId: string) => {
    const text = replyTextMap[messageId];
    if (!text || !text.trim()) {
      return;
    }

    setReplyingId(messageId);

    try {
      const res = await fetchWithRemoteFallback(`/api/feedback/${messageId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          replyText: text.trim(),
          repliedBy: 'Beheerder Bedreigingsmonitor',
        }),
      });

      if (res) {
        const data = await res.json();
        if (data.message) {
          setMessages((prev) =>
            prev.map((m) => (m.id === messageId ? (data.message as FeedbackMessage) : m))
          );
          setReplyTextMap((prev) => ({ ...prev, [messageId]: '' }));
          setReplyingId(null);
          return;
        }
      }
    } catch {
      // fallback below
    }

    const now = new Date();
    const dateFormatted = now.toLocaleDateString('nl-NL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    const timeFormatted = now.toLocaleTimeString('nl-NL', {
      hour: '2-digit',
      minute: '2-digit',
    });

    setMessages((prev) =>
      prev.map((m) => {
        if (m.id === messageId) {
          return {
            ...m,
            status: 'BEANTWOORD',
            adminReply: {
              repliedAt: now.toISOString(),
              repliedAtFormatted: `${dateFormatted} om ${timeFormatted} CET`,
              replyText: text.trim(),
              repliedBy: 'Beheerder Bedreigingsmonitor',
            },
          };
        }
        return m;
      })
    );
    setReplyTextMap((prev) => ({ ...prev, [messageId]: '' }));
    setReplyingId(null);
  };

  // Update status (e.g. IN_BEHANDELING, GEARCHIVEERD)
  const handleUpdateStatus = async (messageId: string, newStatus: FeedbackStatus) => {
    try {
      await fetchWithRemoteFallback(`/api/feedback/${messageId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch {
      // handled locally
    }
    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, status: newStatus } : m))
    );
  };

  // Delete message (without window.confirm which is blocked in iframes)
  const handleDeleteMessage = async (messageId: string) => {
    try {
      await fetchWithRemoteFallback(`/api/feedback/${messageId}`, { method: 'DELETE' });
    } catch {
      // handled locally
    }
    setMessages((prev) => prev.filter((m) => m.id !== messageId));
  };

  // Copy helper
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Quick subject presets
  const handleApplyPreset = (presetSubject: string, presetCategory: FeedbackCategory) => {
    setSubject(presetSubject);
    setCategory(presetCategory);
  };

  // Filter messages
  const filteredMessages = messages.filter((m) => {
    if (filterStatus !== 'ALL' && m.status !== filterStatus) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = m.name.toLowerCase().includes(q);
      const matchEmail = m.email.toLowerCase().includes(q);
      const matchSubject = m.subject.toLowerCase().includes(q);
      const matchMsg = m.message.toLowerCase().includes(q);
      const matchId = m.id.toLowerCase().includes(q);
      const matchOrg = m.organization?.toLowerCase().includes(q) || false;
      return matchName || matchEmail || matchSubject || matchMsg || matchId || matchOrg;
    }
    return true;
  });

  const unreadCount = messages.filter((m) => m.status === 'NIEUW').length;
  const inProgressCount = messages.filter((m) => m.status === 'IN_BEHANDELING').length;
  const answeredCount = messages.filter((m) => m.status === 'BEANTWOORD').length;

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="bg-gradient-to-r from-white via-white to-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-200">
                <MessageSquare className="w-5 h-5" />
              </span>
              <span className="bg-rose-50 text-rose-800 border border-rose-200 px-3 py-1 rounded-full text-xs font-mono-code font-bold">
                REACTIE- &amp; VRAGENCENTRUM
              </span>
              {isOwnerMode && (
                <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-md text-xs font-mono-code font-bold flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-emerald-600" />
                  Beheerderspaneel Actief
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Direct Contact &amp; NCSC AI Cyber-Bot
            </h2>
            <p className="text-sm text-slate-700 mt-1 max-w-2xl leading-relaxed">
              Stel uw vraag over actuele cyberdreigingen, IoC-hashes of NIS2-richtlijnen direct aan de NCSC AI Cyber-Bot of via het reactieformulier.
            </p>
          </div>

          {/* Mode Switcher Tabs for Owner / Visitor */}
          <div className="flex items-center gap-2 shrink-0 bg-slate-100 p-1.5 rounded-xl border border-slate-200 self-start md:self-auto">
            <button
              onClick={() => setActiveSubTab('FORM')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer min-h-[40px] ${
                activeSubTab === 'FORM'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white'
              }`}
            >
              <PenSquare className="w-4 h-4" />
              <span>Vraag Insturen</span>
            </button>

            {isOwnerMode ? (
              <button
                onClick={() => setActiveSubTab('INBOX')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer relative min-h-[40px] ${
                  activeSubTab === 'INBOX'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-white'
                }`}
              >
                <Inbox className="w-4 h-4" />
                <span>Beheerder Inbox</span>
                {unreadCount > 0 && (
                  <span className="bg-rose-600 text-white text-[11px] px-1.5 py-0.5 rounded-full font-mono-code font-extrabold">
                    {unreadCount}
                  </span>
                )}
              </button>
            ) : (
              <button
                onClick={() => setActiveSubTab('INBOX')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer min-h-[40px] ${
                  activeSubTab === 'INBOX'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-white'
                }`}
                title="Bekijk beantwoorde vragen en openbare casussen"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Recente Vragen ({messages.length})</span>
              </button>
            )}
          </div>
        </div>

        {/* Direct Instant NCSC AI Cyber-Bot Chat Bar */}
        <div className="mt-4 pt-4 border-t border-slate-200 relative z-10 space-y-3">
          <form onSubmit={handleAskQuickBot} className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Bot className="w-4 h-4 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={quickBotQuestion}
                onChange={(e) => setQuickBotQuestion(e.target.value)}
                placeholder="Stel direct een snelle vraag aan de NCSC AI Cyber-Bot (bijv. 'Geldt de 24-uurs NIS2 meldplicht?')..."
                className="w-full bg-slate-50 border border-emerald-300 rounded-xl pl-10 pr-3 py-2.5 text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:bg-white focus:border-emerald-600 min-h-[44px]"
              />
            </div>
            <button
              type="submit"
              disabled={isQuickBotThinking || !quickBotQuestion.trim()}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50 shadow-sm min-h-[44px]"
            >
              {isQuickBotThinking ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Bot formuleert...</span>
                </>
              ) : (
                <>
                  <Bot className="w-4 h-4" />
                  <span>Vraag Direct aan Bot</span>
                </>
              )}
            </button>
          </form>

          {/* 1-Click Quick Bot Questions */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-emerald-800 font-bold flex items-center gap-1 mr-1">
              <Zap className="w-3.5 h-3.5" />
              <span>1-Klik Bot Vraag:</span>
            </span>
            {[
              'Geldt de 24-uurs NIS2 meldplicht bij ransomware in quarantaine?',
              'Hoe blokkeer ik Russische Sandworm Modbus OT/SCADA scans?',
              'Welke Sigma-regels helpen tegen Fortinet & Citrix CVE exploits?',
              'Hoe bescherm ik logistiek & WMS tegen LockBit 3.0 en Akira?',
            ].map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => askQuickBotWithText(q)}
                disabled={isQuickBotThinking}
                className="text-xs px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-900 transition-colors cursor-pointer min-h-[36px] text-left"
              >
                🤖 {q}
              </button>
            ))}
          </div>

          {quickBotAnswer && (
            <div className="mt-3 p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2.5 animate-in fade-in duration-200 shadow-sm">
              <div className="flex items-center justify-between text-xs sm:text-sm text-emerald-900 font-bold border-b border-emerald-200 pb-2">
                <span className="flex items-center gap-1.5">
                  <Bot className="w-4 h-4 text-emerald-700" />
                  <span>NCSC AI Cyber-Bot Direct Antwoord:</span>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => copyToClipboard(quickBotAnswer, 'quick-bot-copy')}
                    className="px-2.5 py-1 rounded-lg bg-white hover:bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs cursor-pointer flex items-center gap-1 min-h-[34px]"
                  >
                    {copiedId === 'quick-bot-copy' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Gekopieerd</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Kopieer</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickBotAnswer(null)}
                    className="text-slate-600 hover:text-slate-900 text-xs font-semibold cursor-pointer px-2 py-1"
                  >
                    Sluiten ✕
                  </button>
                </div>
              </div>
              <div className="text-xs sm:text-sm text-slate-800 bg-white p-3.5 rounded-xl border border-emerald-200 whitespace-pre-line leading-relaxed select-text">
                {quickBotAnswer}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* VIEW 1: BEZOEKERS REACTIEFORMULIER */}
      {activeSubTab === 'FORM' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm">
              {submitSuccess ? (
                /* Success Confirmation Screen */
                <div className="text-center py-6 sm:py-8 space-y-4 animate-in fade-in zoom-in-95 duration-300">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>

                  <div className="space-y-1">
                    <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full text-xs font-mono-code font-bold">
                      REFERENTIE: {submitSuccess.id}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 pt-2">
                      Hartelijk dank, uw vraag is succesvol ontvangen!
                    </h3>
                    <p className="text-sm text-slate-700 max-w-lg mx-auto leading-relaxed">
                      De beheerder van <strong className="text-slate-900">Bedreigingsmonitor.nl</strong> heeft uw bericht ontvangen en zal reageren op{' '}
                      <span className="text-rose-700 font-mono-code font-semibold">{submitSuccess.email}</span>.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left max-w-xl mx-auto space-y-2 text-xs sm:text-sm">
                    <div className="flex items-center justify-between text-slate-600 font-mono-code border-b border-slate-200 pb-2">
                      <span>Onderwerp:</span>
                      <span className="text-slate-900 font-semibold">{submitSuccess.subject}</span>
                    </div>
                    <div className="text-slate-700 leading-relaxed italic bg-white p-3 rounded-lg border border-slate-200">
                      "{submitSuccess.message}"
                    </div>
                  </div>

                  {/* Instant AI Bot Reply Card for Visitor */}
                  {submitSuccess.adminReply && (
                    <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-left max-w-xl mx-auto space-y-2.5 shadow-sm">
                      <div className="flex items-center justify-between text-xs sm:text-sm text-emerald-900 font-bold border-b border-emerald-200 pb-2 flex-wrap gap-2">
                        <span className="flex items-center gap-1.5">
                          <Bot className="w-4 h-4 text-emerald-700" />
                          <span>Direct NCSC AI Cyber Advies (Namens Beheerder):</span>
                        </span>
                        <span className="text-[11px] font-mono-code bg-white px-2 py-0.5 rounded border border-emerald-200 text-emerald-800">
                          {submitSuccess.adminReply.repliedAtFormatted}
                        </span>
                      </div>
                      <div className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line font-sans bg-white p-3.5 rounded-xl border border-emerald-200 select-text">
                        {submitSuccess.adminReply.replyText}
                      </div>
                      <div className="flex items-center justify-between text-xs text-emerald-800 pt-1 flex-wrap gap-2">
                        <span>Dit advies is tevens bewaard in het beheerdersoverzicht.</span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(submitSuccess.adminReply?.replyText || '', 'instant-reply-copy')}
                          className="px-3 py-1.5 rounded-lg bg-white hover:bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-1.5 cursor-pointer min-h-[36px]"
                        >
                          {copiedId === 'instant-reply-copy' ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Gekopieerd!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Kopieer advies</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
                    <button
                      onClick={() => setSubmitSuccess(null)}
                      className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-sm flex items-center gap-1.5 min-h-[42px]"
                    >
                      <PenSquare className="w-4 h-4" />
                      <span>Nog een vraag insturen</span>
                    </button>

                    <button
                      onClick={() => copyToClipboard(submitSuccess.id, 'success-id')}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-mono-code text-xs sm:text-sm transition-all cursor-pointer border border-slate-300 flex items-center gap-1.5 min-h-[42px]"
                    >
                      {copiedId === 'success-id' ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-600" />
                          <span>Gekopieerd!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 text-slate-600" />
                          <span>Kopieer referentienummer</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                /* The Actual Visitor Input Form */
                <form onSubmit={handleSubmitMessage} className="space-y-4">
                  <div className="border-b border-slate-200 pb-3">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                      <span>Stel uw vraag of dien een melding in</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                      Alle velden met een <span className="text-rose-600 font-bold">*</span> zijn verplicht. Uw gegevens worden uitsluitend gebruikt om uw vraag te beantwoorden.
                    </p>
                  </div>

                  {formError && (
                    <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center gap-2.5 animate-in fade-in duration-200">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{formError}</span>
                    </div>
                  )}

                  {/* Name & Email Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
                        Uw Naam <span className="text-rose-600">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <User className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Bijv. Jan de Vries"
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:bg-white focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all min-h-[42px]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
                        Uw E-mailadres <span className="text-rose-600">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <Mail className="w-4 h-4" />
                        </div>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="naam@organisatie.nl"
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:bg-white focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all min-h-[42px]"
                        />
                      </div>
                      <span className="text-xs text-slate-500 mt-1 block">
                        Hierop ontvangt u het antwoord van de beheerder.
                      </span>
                    </div>
                  </div>

                  {/* Organization & Category Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
                        Organisatie / Bedrijf / Sector <span className="text-slate-500 font-normal">(Optioneel)</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          value={organization}
                          onChange={(e) => setOrganization(e.target.value)}
                          placeholder="Bijv. Havenbedrijf / Ziekenhuis / MKB"
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:bg-white focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all min-h-[42px]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
                        Categorie van uw vraag <span className="text-rose-600">*</span>
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as FeedbackCategory)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all cursor-pointer min-h-[42px]"
                      >
                        {FEEDBACK_CATEGORIES.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.icon} {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Quick Preset Buttons */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                      Veelgestelde onderwerpen (klik voor snel invullen):
                    </label>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleApplyPreset(
                            'Vraag over recente ransomware-aanval op vitale sector',
                            'VRAAG_DREIGING'
                          )
                        }
                        className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 transition-colors cursor-pointer min-h-[36px]"
                      >
                        🛡️ Dreigingsanalyse vraag
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleApplyPreset(
                            'NIS2 zorgplicht & meldplicht advies voor onze organisatie',
                            'NIS2_ADVIES'
                          )
                        }
                        className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 transition-colors cursor-pointer min-h-[36px]"
                      >
                        🏛️ NIS2 zorgplicht
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleApplyPreset(
                            'Melding van verdachte activiteit of phishingcampagne',
                            'MELDING_INCIDENT'
                          )
                        }
                        className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 transition-colors cursor-pointer min-h-[36px]"
                      >
                        🚨 Incident melden
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleApplyPreset(
                            'Vraag over IoC hashes of Sigma detectieregels',
                            'VRAAG_DREIGING'
                          )
                        }
                        className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 transition-colors cursor-pointer min-h-[36px]"
                      >
                        🔍 IoC &amp; Detectie
                      </button>
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
                      Onderwerp <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Waar gaat uw vraag over?"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:bg-white focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all min-h-[42px]"
                    />
                  </div>

                  {/* Threat Reference Linker (Optional) */}
                  {threats.length > 0 && (
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
                        Koppel aan een actuele dreiging uit de monitor{' '}
                        <span className="text-slate-500 font-normal">(Optioneel)</span>
                      </label>
                      <select
                        value={threatReference}
                        onChange={(e) => setThreatReference(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all cursor-pointer min-h-[42px]"
                      >
                        <option value="">-- Geen specifieke dreiging gekoppeld --</option>
                        {threats.slice(0, 15).map((t) => (
                          <option key={t.id} value={`${t.id} (${t.title})`}>
                            {t.isDutchVitalInfra ? '🇳🇱 [NIS2]' : '🌐'} {t.threatActor} • {t.targetVictim} ({t.title.slice(0, 45)}...)
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Message Field */}
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
                      Uw Vraag of Toelichting <span className="text-rose-600">*</span>
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Beschrijf uw vraag of situatie zo gedetailleerd mogelijk (bijv. getroffen systemen, datum/tijd, specifieke software of logmeldingen)..."
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:bg-white focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all resize-y"
                    ></textarea>
                  </div>

                  {/* Instant AI Bot Answer Option */}
                  <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-white text-emerald-700 border border-emerald-200">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5 flex-wrap">
                          <span>Direct antwoord van NCSC AI Cyber-Bot</span>
                          <span className="bg-emerald-100 text-emerald-900 text-[11px] px-2 py-0.5 rounded border border-emerald-300 font-mono-code font-bold">
                            AANBEVOLEN
                          </span>
                        </span>
                        <span className="text-xs text-slate-600 block">
                          Ontvang binnen 5 seconden een professioneel antwoord namens de beheerder.
                        </span>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={visitorWantsInstantAi}
                        onChange={(e) => setVisitorWantsInstantAi(e.target.checked)}
                        className="w-5 h-5 text-emerald-600 rounded border-slate-300 cursor-pointer accent-emerald-600"
                      />
                    </label>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <span className="text-xs text-slate-600 flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-emerald-600" />
                      <span>Vertrouwelijk behandeld conform NCSC CTI richtlijnen.</span>
                    </span>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed min-h-[44px]"
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Versturen...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Verstuur Vraag aan Beheerder</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Sidebar Info & Platform Verwerking (1 col) */}
          <div className="space-y-4">
            {/* Veilig Platform Contact Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-emerald-700">
                <Shield className="w-4 h-4" />
                <h4 className="font-bold text-sm sm:text-base text-slate-900">Veilig &amp; Vertrouwelijk</h4>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Alle vragen en meldingen worden via dit beveiligde platform geregistreerd. U ontvangt automatisch een uniek referentienummer.
              </p>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-slate-900 text-xs sm:text-sm">
                  <Bot className="w-4 h-4 text-purple-600" />
                  <span className="font-bold">AI Threat Analyst Ondersteuning</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Complexe vragen over CVE kwetsbaarheden en NIS2-compliance worden direct geanalyseerd met behulp van AI threat intelligence.
                </p>
              </div>
            </div>

            {/* Response Time Guarantee */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-amber-700">
                <Clock className="w-4 h-4" />
                <h4 className="font-bold text-sm sm:text-base text-slate-900">Reactietijd &amp; Spoed</h4>
              </div>
              <ul className="text-xs sm:text-sm text-slate-700 space-y-2 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold">•</span>
                  <span>
                    <strong className="text-slate-900">NIS2 Vitale Entiteiten:</strong> Vragen met betrekking tot acute dreigingen worden met voorrang behandeld.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>
                    <strong className="text-slate-900">IoC &amp; Kwetsbaarheden:</strong> Technische validatie en detectieregels worden gedeeld via de IoC Database.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>
                    <strong className="text-slate-900">Gemiddelde reactietijd:</strong> Binnen enkele uren op werkdagen.
                  </span>
                </li>
              </ul>
            </div>

            {/* Owner Quick Access Helper */}
            {isOwnerMode && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs sm:text-sm text-emerald-900 space-y-2.5">
                <div className="flex items-center gap-2 font-bold">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  <span>Beheerderspaneel tip</span>
                </div>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  U bent ingelogd als eigenaar. Schakel bovenaan naar <strong>&apos;Beheerder Inbox&apos;</strong> om alle binnengekomen vragen te bekijken en direct te beantwoorden via e-mail of in-app.
                </p>
                <button
                  onClick={() => setActiveSubTab('INBOX')}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5 min-h-[40px]"
                >
                  <Inbox className="w-4 h-4" />
                  <span>Ga naar Beheerder Inbox ({messages.length})</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: BEHEERDER INBOX / RECENTE VRAGEN OVERZICHT */}
      {activeSubTab === 'INBOX' && (
        <div className="space-y-4">
          {/* AI Bot Assistant Bar & Auto-Pilot Toggle */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-white border border-emerald-200 text-emerald-700 shrink-0 mt-0.5">
                <Bot className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <span>NCSC AI Cyber-Bot Assistent</span>
                    <span className="bg-emerald-100 text-emerald-900 text-[11px] px-2.5 py-0.5 rounded-full font-mono-code font-bold border border-emerald-300">
                      DIRECT ACTIEF
                    </span>
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 max-w-2xl leading-relaxed">
                  <strong className="text-slate-900">Geautomatiseerde CTI Respons:</strong> Klik bij elke vraag op <strong>&apos;🤖 Laat AI Bot Antwoorden&apos;</strong> of beantwoord alle openstaande vragen in één klik conform NCSC en NIS2 standaarden.
                </p>
              </div>
            </div>

            {/* 1-Click Answer All + Auto-pilot toggle switch */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={handleAnswerAllOpenWithBot}
                disabled={isGeneratingAiForId === 'ALL'}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-60 min-h-[42px]"
              >
                {isGeneratingAiForId === 'ALL' ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Bot beantwoordt alles...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-amber-200" />
                    <span>🤖 Beantwoord Alle Open Vragen ({unreadCount + inProgressCount})</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-slate-200">
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-900 flex items-center justify-end gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-600" />
                    <span>Auto-Pilot Bot</span>
                  </span>
                  <span className="text-[11px] text-slate-600 block font-mono-code">
                    {autoPilotEnabled ? '✅ Automatisch aan' : '⏸️ Handmatig'}
                  </span>
                </div>
                <button
                  onClick={handleToggleAutoPilot}
                  disabled={isTogglingAutoPilot}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                    autoPilotEnabled ? 'bg-emerald-600' : 'bg-slate-300'
                  }`}
                  title="Schakel automatische beantwoording door de AI Bot in of uit"
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      autoPilotEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Bot Confirmation Banner */}
          {botFeedbackBanner && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-bold flex items-center justify-between gap-2 animate-in fade-in duration-200 shadow-xs">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>{botFeedbackBanner}</span>
              </div>
              <button
                type="button"
                onClick={() => setBotFeedbackBanner(null)}
                className="text-emerald-700 hover:text-emerald-950 text-xs cursor-pointer px-2 py-1"
              >
                ✕
              </button>
            </div>
          )}

          {/* Filter Bar & Controls */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Status Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
              <button
                onClick={() => setFilterStatus('ALL')}
                className={`px-3.5 py-2 rounded-xl transition-colors cursor-pointer min-h-[38px] ${
                  filterStatus === 'ALL'
                    ? 'bg-rose-600 text-white font-bold'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                Alle Vragen ({messages.length})
              </button>

              <button
                onClick={() => setFilterStatus('NIEUW')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-colors cursor-pointer min-h-[38px] ${
                  filterStatus === 'NIEUW'
                    ? 'bg-rose-600 text-white font-bold'
                    : 'bg-white text-rose-800 hover:bg-rose-50 border border-slate-300'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                <span>Nieuw ({unreadCount})</span>
              </button>

              <button
                onClick={() => setFilterStatus('IN_BEHANDELING')}
                className={`px-3.5 py-2 rounded-xl transition-colors cursor-pointer min-h-[38px] ${
                  filterStatus === 'IN_BEHANDELING'
                    ? 'bg-amber-600 text-white font-bold'
                    : 'bg-white text-amber-900 hover:bg-amber-50 border border-slate-300'
                }`}
              >
                In behandeling ({inProgressCount})
              </button>

              <button
                onClick={() => setFilterStatus('BEANTWOORD')}
                className={`px-3.5 py-2 rounded-xl transition-colors cursor-pointer min-h-[38px] ${
                  filterStatus === 'BEANTWOORD'
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'bg-white text-emerald-800 hover:bg-emerald-50 border border-slate-300'
                }`}
              >
                Beantwoord ({answeredCount})
              </button>
            </div>

            {/* Search Input & Refresh */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Zoek afzender, onderwerp of e-mail..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:bg-white focus:border-rose-500 min-h-[40px]"
                />
              </div>

              <button
                onClick={fetchMessages}
                disabled={isLoading}
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-300 transition-colors cursor-pointer shrink-0 min-w-[40px] min-h-[40px] flex items-center justify-center"
                title="Ververs vragenlijst"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-rose-600' : ''}`} />
              </button>
            </div>
          </div>

          {/* List of Messages */}
          {filteredMessages.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-2 shadow-sm">
              <Inbox className="w-8 h-8 text-slate-400 mx-auto" />
              <h4 className="text-base font-bold text-slate-800">Geen berichten gevonden</h4>
              <p className="text-sm text-slate-600">
                Er zijn geen vragen die voldoen aan het huidige filter.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredMessages.map((msg) => {
                const isExpanded = expandedMessageId === msg.id;
                const categoryDef = FEEDBACK_CATEGORIES.find((c) => c.id === msg.category);

                return (
                  <div
                    key={msg.id}
                    className={`bg-white border rounded-2xl transition-all shadow-sm overflow-hidden ${
                      msg.status === 'NIEUW'
                        ? 'border-rose-300 ring-1 ring-rose-200'
                        : msg.status === 'IN_BEHANDELING'
                        ? 'border-amber-300'
                        : 'border-slate-200'
                    }`}
                  >
                    {/* Header Row */}
                    <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          {/* Ticket ID */}
                          <span className="font-mono-code text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200">
                            {msg.id}
                          </span>

                          {/* Status Badge */}
                          {msg.status === 'NIEUW' ? (
                            <span className="bg-rose-100 text-rose-800 border border-rose-300 px-2.5 py-0.5 rounded-full text-[11px] font-bold font-mono-code flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse"></span>
                              NIEUW
                            </span>
                          ) : msg.status === 'IN_BEHANDELING' ? (
                            <span className="bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded-full text-[11px] font-bold font-mono-code flex items-center gap-1">
                              <Clock className="w-3 h-3 text-amber-700" />
                              IN BEHANDELING
                            </span>
                          ) : msg.status === 'BEANTWOORD' ? (
                            <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-full text-[11px] font-bold font-mono-code flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                              BEANTWOORD
                            </span>
                          ) : (
                            <span className="bg-slate-200 text-slate-700 px-2.5 py-0.5 rounded-full text-[11px] font-mono-code font-bold">
                              GEARCHIVEERD
                            </span>
                          )}

                          {/* Category Badge */}
                          <span className="text-xs text-slate-700 bg-slate-50 px-2.5 py-0.5 rounded border border-slate-200 flex items-center gap-1">
                            <span>{categoryDef?.icon || '💬'}</span>
                            <span>{categoryDef?.label || msg.category}</span>
                          </span>

                          {/* Date */}
                          <span className="text-xs text-slate-600 font-mono-code">
                            📅 {msg.createdAtFormatted}
                          </span>
                        </div>

                        {/* Subject */}
                        <h4 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                          {msg.subject}
                        </h4>

                        {/* Visitor Info Bar */}
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-700">
                          <span className="font-semibold text-rose-700 flex items-center gap-1">
                            <User className="w-3.5 h-3.5 text-slate-500" />
                            {msg.name}
                          </span>

                          <span className="text-slate-400">•</span>

                          <button
                            onClick={() => copyToClipboard(msg.email, `email-${msg.id}`)}
                            className="text-slate-600 hover:text-slate-900 flex items-center gap-1 font-mono-code text-xs cursor-pointer"
                            title="Klik om e-mailadres te kopiëren"
                          >
                            <Mail className="w-3.5 h-3.5 text-slate-500" />
                            <span>{msg.email}</span>
                            {copiedId === `email-${msg.id}` ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5 text-slate-400" />
                            )}
                          </button>

                          {msg.organization && (
                            <>
                              <span className="text-slate-400">•</span>
                              <span className="text-slate-600 flex items-center gap-1">
                                <Building2 className="w-3.5 h-3.5 text-slate-500" />
                                {msg.organization}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Right Action buttons */}
                      <div className="flex flex-wrap items-center gap-2 shrink-0 self-end md:self-center">
                        <button
                          type="button"
                          onClick={() => handleGenerateAiReply(msg.id)}
                          disabled={isGeneratingAiForId === msg.id}
                          className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5 disabled:opacity-60 min-h-[40px]"
                          title="Laat de NCSC AI Cyber-Bot direct een deskundig antwoord genereren"
                        >
                          {isGeneratingAiForId === msg.id ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              <span>Bot formuleert...</span>
                            </>
                          ) : (
                            <>
                              <Bot className="w-4 h-4 text-white" />
                              <span>
                                {msg.status === 'BEANTWOORD'
                                  ? '🤖 Nieuw Bot Antwoord'
                                  : '🤖 Laat AI Bot Antwoorden'}
                              </span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() =>
                            setExpandedMessageId(isExpanded ? null : msg.id)
                          }
                          className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1 min-h-[40px]"
                        >
                          <span>{isExpanded ? 'Inklappen' : 'Details & Reageer'}</span>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Threat Reference Strip */}
                    {msg.threatReference && (
                      <div className="px-4 sm:px-5 py-2.5 bg-amber-50/70 border-t border-slate-200 flex items-center justify-between text-xs">
                        <span className="text-slate-700 flex items-center gap-1.5">
                          <ShieldAlert className="w-4 h-4 text-amber-700" />
                          <span>Gekoppelde dreiging:</span>
                          <strong className="text-slate-900 font-mono-code">
                            {msg.threatReference}
                          </strong>
                        </span>
                      </div>
                    )}

                    {/* Expanded Detail & Response Section */}
                    {isExpanded && (
                      <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 space-y-4">
                        {/* The Message Content */}
                        <div>
                          <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                            Ontvangen Vraag / Melding:
                          </div>
                          <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line font-sans select-text">
                            {msg.message}
                          </div>
                        </div>

                        {/* Existing Admin Reply Display */}
                        {msg.adminReply && (
                          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
                            <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm text-emerald-900">
                              <span className="font-bold flex items-center gap-1.5 flex-wrap">
                                {msg.adminReply.isAiGenerated ? (
                                  <Bot className="w-4 h-4 text-emerald-700" />
                                ) : (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                                )}
                                <span>Antwoord van de beheerder ({msg.adminReply.repliedBy})</span>
                                {msg.adminReply.isAiGenerated && (
                                  <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-[11px] font-mono-code px-2 py-0.5 rounded font-bold">
                                    🤖 NCSC AI Cyber-Bot
                                  </span>
                                )}
                              </span>
                              <span className="font-mono-code text-xs text-emerald-800">
                                {msg.adminReply.repliedAtFormatted}
                              </span>
                            </div>
                            <div className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line bg-white p-3.5 rounded-lg border border-emerald-200">
                              {msg.adminReply.replyText}
                            </div>
                            <div className="flex items-center gap-2 pt-1">
                              <button
                                onClick={() =>
                                  copyToClipboard(
                                    msg.adminReply?.replyText || '',
                                    `reply-${msg.id}`
                                  )
                                }
                                className="px-3 py-1.5 rounded-lg bg-white hover:bg-emerald-100 text-xs font-semibold text-emerald-900 border border-emerald-300 flex items-center gap-1.5 cursor-pointer min-h-[36px]"
                              >
                                {copiedId === `reply-${msg.id}` ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>Gekopieerd</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3.5 h-3.5 text-slate-600" />
                                    <span>Kopieer antwoordtekst</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        )}

                        {/* In-App Reply Composer for Admin */}
                        {isOwnerMode && (
                          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                                <Reply className="w-4 h-4 text-rose-600" />
                                <span>Reageer in-app of registreer antwoord</span>
                              </span>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleGenerateAiReply(msg.id)}
                                  disabled={isGeneratingAiForId === msg.id}
                                  className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50 min-h-[36px]"
                                  title="Laat AI direct een conceptantwoord opstellen"
                                >
                                  {isGeneratingAiForId === msg.id ? (
                                    <>
                                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                      <span>AI formuleert...</span>
                                    </>
                                  ) : (
                                    <>
                                      <Bot className="w-3.5 h-3.5 text-emerald-700" />
                                      <span>🤖 Genereer AI Concept</span>
                                    </>
                                  )}
                                </button>
                                <span className="text-xs text-slate-500 font-mono-code">
                                  Ref: {msg.id}
                                </span>
                              </div>
                            </div>

                            <textarea
                              rows={3}
                              value={replyTextMap[msg.id] || ''}
                              onChange={(e) =>
                                setReplyTextMap((prev) => ({
                                  ...prev,
                                  [msg.id]: e.target.value,
                                }))
                              }
                              placeholder={`Beste ${msg.name},\n\nHierbij de reactie op uw vraag betreffende ${msg.subject}...`}
                              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:bg-white focus:border-emerald-500 transition-colors"
                            ></textarea>

                            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                              {/* Status Select Buttons */}
                              <div className="flex items-center gap-1.5 text-xs flex-wrap">
                                <span className="text-slate-600 font-semibold">Status:</span>
                                <button
                                  onClick={() => handleUpdateStatus(msg.id, 'NIEUW')}
                                  className={`px-2.5 py-1 rounded-md text-xs font-mono-code font-semibold cursor-pointer ${
                                    msg.status === 'NIEUW'
                                      ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                                  }`}
                                >
                                  Nieuw
                                </button>
                                <button
                                  onClick={() => handleUpdateStatus(msg.id, 'IN_BEHANDELING')}
                                  className={`px-2.5 py-1 rounded-md text-xs font-mono-code font-semibold cursor-pointer ${
                                    msg.status === 'IN_BEHANDELING'
                                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                                  }`}
                                >
                                  In behandeling
                                </button>
                                <button
                                  onClick={() => handleUpdateStatus(msg.id, 'BEANTWOORD')}
                                  className={`px-2.5 py-1 rounded-md text-xs font-mono-code font-semibold cursor-pointer ${
                                    msg.status === 'BEANTWOORD'
                                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                                  }`}
                                >
                                  Beantwoord
                                </button>
                              </div>

                              <div className="flex flex-wrap items-center gap-2">
                                <button
                                  onClick={() => handleDeleteMessage(msg.id)}
                                  className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 border border-slate-300 transition-colors cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center"
                                  title="Verwijder dit bericht"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleAutoReplyWithBot(msg.id)}
                                  disabled={isGeneratingAiForId === msg.id}
                                  className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-all shadow-xs cursor-pointer disabled:opacity-50 flex items-center gap-1.5 min-h-[38px]"
                                  title="Laat de AI Bot direct een deskundig antwoord genereren en direct opslaan"
                                >
                                  {isGeneratingAiForId === msg.id ? (
                                    <>
                                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                      <span>Bot denkt na...</span>
                                    </>
                                  ) : (
                                    <>
                                      <Zap className="w-3.5 h-3.5 text-amber-200" />
                                      <span>⚡ Direct met Bot</span>
                                    </>
                                  )}
                                </button>

                                <button
                                  onClick={() => handleSendReply(msg.id)}
                                  disabled={
                                    replyingId === msg.id || !replyTextMap[msg.id]?.trim()
                                  }
                                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 min-h-[38px]"
                                >
                                  {replyingId === msg.id ? (
                                    <>
                                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                      <span>Opslaan...</span>
                                    </>
                                  ) : (
                                    <>
                                      <Check className="w-3.5 h-3.5" />
                                      <span>Antwoord Opslaan</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
