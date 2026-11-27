import {
  CrimeCaseStudy,
  CrimeChainSimulation,
  CrimeDomainId,
  CrimeDomainInfo,
  CrimeNexusLink,
} from '../types/threat';

export const CRIME_DOMAINS: CrimeDomainInfo[] = [
  {
    id: 'DRUGSHANDEL',
    name: 'Drugshandel & Narcotica-Logistiek',
    subtitle: 'Container-infiltraties, synthetische labs & kartel-logistiek',
    color: '#059669', // emerald-600
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-400',
    textColor: 'text-emerald-800',
    icon: 'Pill',
    estimatedVolumeNL: '€ 16 - 20 Miljard / jaar (Europol / WODC)',
    keyActors: [
      'Zuid-Amerikaanse Cocaïnekartels',
      'Mocro Maffia & Haven-Uithalersyndicaten',
      'Brabantse Synthetische Drugsproducenten (MDMA/Speed)',
      'Maritieme Corruptienetwerken (Rotterdam/Antwerpen)',
    ],
    primaryTactics: [
      'Infiltratie van havensoftware (Portbase, TOS, rederijen)',
      'Omkoping en bedreiging van haven- en douanemedewerkers',
      'Stealth postverzending via PostNL / DHL drop-boxes',
      'Hawala & ondergronds bankieren via cash-to-crypto swaps',
    ],
    description:
      'Nederland fungeert als het voornaamste logistieke knooppunt van Europa voor cocaïne-invoer (via Haven Rotterdam) en de productie van synthetische drugs. Moderne drugskartels opereren niet langer puur fysiek: ze huren gespecialiseerde cybercriminelen in voor logistieke spionage en manipulatie van containercodes.',
  },
  {
    id: 'DARKNETMARKTEN',
    name: 'Darknetmarkten & Underground Fora',
    subtitle: 'Tor/I2P escrow-handelsplaatsen, vendor bonds & PGP shops',
    color: '#7c3aed', // purple-600
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-400',
    textColor: 'text-purple-800',
    icon: 'Layers',
    estimatedVolumeNL: '€ 850 Miljoen / jaar in crypto (Chainalysis / NCSC)',
    keyActors: [
      'Archetyp, Bohemia & Nemesis Market Vendors',
      'Exploit.in, XSS.is & BreachForums Brokers',
      'Russian Market & 2Easy Log-verkopers',
      'Bulletproof Hosting Operators (Offshore Bunkers)',
    ],
    primaryTactics: [
      'Multi-sig Monero (XMR) & Bitcoin escrow-betalingen',
      'Geautomatiseerde afrekening van gestolen sessiecookies & paspoorten',
      'Verkoop van ransomware-affiliate kits en zero-days',
      'Vacuümverpakte postverzending met valse afzender-identiteiten',
    ],
    description:
      'Darknetmarkten vormen de e-commerce motor van het illegale ecosysteem. Hier worden fysieke verdovende middelen (cocaïne, MDMA, ketamine) zij aan zij verhandeld met gestolen inloggegevens, bankpasdumps, phishing-frameworks en netwerktoegang tot vitale bedrijven.',
  },
  {
    id: 'FRAUDE',
    name: 'Financiële Fraude & Bank Helpdesk Fraude',
    subtitle: 'Geldezels, CEO-fraude, phishing kits & identiteitsdiefstal',
    color: '#d97706', // amber-600
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-400',
    textColor: 'text-amber-800',
    icon: 'CreditCard',
    estimatedVolumeNL: '€ 1.2 Miljard geregistreerde schade (Betaalvereniging NL / Politie)',
    keyActors: [
      'Bank Helpdesk Oplichtersbendes',
      'Telegram Geldezel-ronselaars (Money Mule Recruiter)',
      'CEO-Fraude / BEC Syndicaten (West-Afrika & Oost-Europa)',
      'Phishing-as-a-Service (PaaS) Ontwikkelaars',
    ],
    primaryTactics: [
      'Nummerherkenning-spoofing (bellend namens Rabo/ING/ABN)',
      'Gekloonde browser cookies om 2FA/MFA geruisloos te omzeilen',
      'Telegram-kanalen voor ronseling van kwetsbare jongeren als geldezel',
      'Stroman BV’s en spookrekeningen voor snelle SEPA-witwasrondes',
    ],
    description:
      'Financiële fraude is de snelstgroeiende vorm van vermogenscriminaliteit in Nederland. Fraudeurs maken intensief gebruik van data die door cybercriminelen met infostealers is geoogst en op darknetfora is aangekocht om slachtoffers met griezelige precisie op te lichten.',
  },
  {
    id: 'CYBERCRIME',
    name: 'Cybercriminaliteit & Ransomware',
    subtitle: 'RaaS kartels, Initial Access Brokers (IAB), botnets & C2',
    color: '#e11d48', // rose-600
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-400',
    textColor: 'text-rose-800',
    icon: 'Terminal',
    estimatedVolumeNL: '€ 2.8 Miljard afpersing & herstelkosten (NCSC / CBS)',
    keyActors: [
      'LockBit, Akira, BlackCat/ALPHV & Qilin RaaS Cartels',
      'Initial Access Brokers (IABs - verkopen VPN/RDP logins)',
      'Infostealer Ontwikkelaars (LummaC2, RedLine, Stealc)',
      'State-Sponsored Hybrids (Rusland / Noord-Korea crypto-diefstal)',
    ],
    primaryTactics: [
      'Double & Triple Extortion (encryptie + datadiefstal + DDoS)',
      'Exploitation van publiek gerichte gateways (Citrix, Fortinet, Ivanti)',
      'Supply chain manipulatie van software-leveranciers',
      'Crypto laundering via Tornado Cash, mixers en OTC-brokers',
    ],
    description:
      'Cybercrime fungeert als de hoogtechnologische dienstverlener van de onderwereld. Van het aanleveren van toegang tot terminals in de Rotterdamse haven tot het genereren van gigantische crypto-opbrengsten die vervolgens via traditionele criminele netwerken worden gewit.',
  },
];

export const CRIME_NEXUS_LINKS: CrimeNexusLink[] = [
  {
    id: 'nexus-pepijn-shinyhunters-krebs',
    sourceDomain: 'CYBERCRIME',
    targetDomain: 'FRAUDE',
    title: 'White-Hat/Black-Hat Dubbelrol & Corrupte Ransomware-Onderhandelaars (Casus Pepijn van der Stap / ShinyHunters)',
    shortSummary:
      'KrebsOnSecurity onthult hoe de Nederlandse hacker Pepijn van der Stap ("Umbreon", 24) een dubbelleven leidde binnen de NL cybersecurity en via openstaande Signal-chats een complot tussen ShinyHunters en Amerikaanse ransomware-onderhandelaars blootlegde.',
    mechanisms: [
      'Dubbelleven ("White Hat" overdag, "Black Hat" \'s nachts): Pepijn van der Stap werkte als software engineer bij Hadrian (Amsterdam), vrijwilliger bij het DIVD en na zijn vrijlating (dec 2025) als Offensive Security Lead bij Neo Security, terwijl hij onder het alias "Umbreon" bedrijven afperste.',
      'Vishing & Cloud/SaaS Exfiltratie: ShinyHunters brak sinds 2025 in bij meer dan 140 organisaties (en FBIJobs.gov) via voice-phishing en gestolen SSO/Snowflake/Salesforce-tokens, goed voor meer dan $70 miljoen aan losgeld.',
      'Openstaande Signal-Chats bij Politie-Inval (15 sept 2026): Toen de Nederlandse politie en FBI Van der Stap arresteerden, stond zijn Signal-account open. De chats onthulden dat ransomware-onderhandelaars in de VS en Canada vooraf wisten van hacks en dat een Amerikaanse consultancy-directeur meehielp bij het runnen van de ShinyHunters-afpersingssite Shinywire.',
    ],
    realWorldExample:
      'KrebsOnSecurity (september/oktober 2026): Identificatie en arrestatie van de 24-jarige Nederlander Pepijn van der Stap ("Umbreon") door de Nederlandse politie en FBI na zijn eerdere veroordeling in 2023 (€1,5M–€2,7M buit), gevolgd door de ontmaskering van de Shinywire-collusie en de arrestatie van mede-kopstuk "Rey" in Jordanië.',
    dutchImpact:
      'Grote schokgolf binnen de Nederlandse cybersecuritysector (DIVD, Hadrian, Neo Security) over insider-risico\'s van veroordeelde ex-hackers en corruptie bij internationale incident-response onderhandelaars.',
    severity: 'KRITIEK',
    tags: [
      'Pepijn van der Stap ("Umbreon")',
      'ShinyHunters & Shinywire',
      'KrebsOnSecurity Dossier',
      'Corrupte Onderhandelaars (Signal)',
    ],
    technicalVectors: [
      'Voice Phishing (Vishing) op IT-helpdesks & Okta/SSO MFA-bypass',
      'Bulk SaaS Data Exfiltratie (Snowflake / Salesforce / Cloud API\'s)',
      'Shinywire (.onion) Pay-or-Leak Extortion & Signal Collusie',
    ],
    policeOperationRef: 'Nationale Politie (THTC) & FBI Operatie ShinyHunters (Arrestatie 15 sept 2026)',
  },
  {
    id: 'nexus-link-1',
    sourceDomain: 'CYBERCRIME',
    targetDomain: 'DRUGSHANDEL',
    title: 'Haven Infiltratie & Container PIN-Diefstal',
    shortSummary:
      'Cybercrime-toegangsmakelaars (IABs) breken in bij terminals en Portbase om "uitrijcodes" van cocaïnecontainers te stelen voor drugskartels.',
    mechanisms: [
      'Compromittering van VPN-gateways en kantoor-IT van rederijen (MSC, Maersk) en overslagterminals (Maasvlakte)',
      'Exfiltratie van douane-vrijgavedocumenten en container-pincodes (Portbase havencommunicatiesysteem)',
      'Plaatsing van hardware keyloggers en mini-routers in havenkantoren door omgekochte uithalers',
      'Geautomatiseerde monitoring van track & trace data om douanescans te ontwijken',
    ],
    realWorldExample:
      'Team High Tech Crime van de Landelijke Politie ontdekte een hackersgroep die in opdracht van een Nederlands-Colombiaans drugskartel meer dan 18 maanden lang terminalsystemen in de Rotterdamse haven afluisterde. Met gestolen pincodes reden handlangers tientallen containers met duizenden kilo’s cocaïne ongehinderd langs de slagbomen voordat de douane inspectie kon uitvoeren.',
    dutchImpact: 'Cruciaal gevaar voor Haven Rotterdam en de integriteit van de Europese logistieke keten.',
    severity: 'KRITIEK',
    tags: ['Haven Rotterdam', 'Portbase', 'Uithalers', 'PIN Diefstal', 'Container Smuggle'],
    technicalVectors: ['CVE-2023-4966 (Citrix Bleed)', 'Fortinet SSL-VPN', 'Keylogger implants', 'Portbase API abuse'],
    policeOperationRef: 'Onderzoek Maritiem THTC / Politie Eenheid Rotterdam',
  },
  {
    id: 'nexus-link-2',
    sourceDomain: 'CYBERCRIME',
    targetDomain: 'DRUGSHANDEL',
    title: 'Crypto Witwas-Rotatie & Ondergrondse Cash-Swaps',
    shortSummary:
      'Ransomware-bendes ruilen illegale crypto direct voor fysiek drugsgeld via ondergrondse OTC-brokers in Nederland en Dubai.',
    mechanisms: [
      'Ransomware-buit (Bitcoin/Monero) is digitaal traceerbaar en moeilijk via Nederlandse banken om te zetten in cash',
      'Drugskartels beschikken over honderden miljoenen euro’s aan contant geld in loodsen in Brabant en Randstad, maar moeten leveranciers in Zuid-Amerika in crypto betalen',
      'Ondergrondse crypto-brokers brengen beide werelden samen: cash wordt fysiek overgedragen in ruil voor anonieme Monero-transacties',
      'Mixerdiensten (Tornado Cash, Sinbad) en cross-chain bridges maskeren de herkomst',
    ],
    realWorldExample:
      'De FIOD en NCSC hebben vastgesteld dat ransomware-opbrengsten van Nederlandse bedrijven (zoals transporteurs en retail) via illegale crypto-wisselkantoren werden omgewisseld tegen contante stapels eurobiljetten afkomstig uit de cocaïnehandel.',
    dutchImpact: 'Jaarlijks honderden miljoenen euro’s aan crimineel vermogen dat vloeit tussen cyberafpersing en straatcriminaliteit.',
    severity: 'KRITIEK',
    tags: ['Witwassen', 'Crypto OTC', 'Monero Swaps', 'Geld Loodsen', 'Hawala'],
    technicalVectors: ['Tornado Cash', 'Sinbad Mixer', 'Cross-chain DEX swaps', 'Telegram escrow OTC desks'],
    policeOperationRef: 'Operatie 22Barents / FIOD Crypto Taskforce',
  },
  {
    id: 'nexus-link-3',
    sourceDomain: 'CYBERCRIME',
    targetDomain: 'FRAUDE',
    title: 'Infostealer-Logs naar Bank Helpdesk Fraude & CEO-Oplichting',
    shortSummary:
      'Infostealer malware (LummaC2, Stealc) steelt browsercookies van Nederlanders; fraudeurs gebruiken die om 2FA te omzeilen en bankrekeningen leeg te roven.',
    mechanisms: [
      'Besmetting van pc’s via nep-advertenties op Google (malvertising) of gekraakte software',
      'Infostealer plundert alle opgeslagen wachtwoorden, bank-inlogtokens en browser-fingerprints',
      'Geautomatiseerde upload naar darknet logs-markten (voorheen Genesis Market, nu Russian Market)',
      'Fraudeurs laden deze "sessie-fingerprint" in anti-detect browsers (zoals Dolphin Anty) en loggen direct in bij banken zonder 2FA-prompt',
    ],
    realWorldExample:
      'Tijdens Operatie Cookie Monster namen de FBI en Nederlandse Politie Genesis Market offline. Op deze markt stonden miljoenen gestolen digitale identiteiten van Nederlandse slachtoffers te koop voor enkele dollars. Deze accounts werden direct ingezet voor bank helpdesk oplichting en het plunderen van spaarrekeningen.',
    dutchImpact: 'Tienduizenden Nederlandse slachtoffers van gerichte bankpas- en spaargeldfraude per jaar.',
    severity: 'KRITIEK',
    tags: ['Infostealers', 'LummaC2', 'Genesis Market', 'Bankfraude', '2FA Bypass'],
    technicalVectors: ['Session Cookie Hijacking', 'Canvas Fingerprint Spoofing', 'Dolphin Anty', 'RedLine Stealer'],
    policeOperationRef: 'Operatie Cookie Monster (Politie THTC / FBI / Europol)',
  },
  {
    id: 'nexus-link-4',
    sourceDomain: 'FRAUDE',
    targetDomain: 'DRUGSHANDEL',
    title: 'Geldezel-Netwerken & Gedeelde Cash-Out Infrastructuur',
    shortSummary:
      'Hetzelfde netwerk van jongeren (geldezels) wordt tegelijk ingezet om bankfraude slachtoffers te beroven én drugsgelden contant af te tappen.',
    mechanisms: [
      'Criminele ronselaars benaderen middelbare scholieren en studenten via Telegram en Instagram',
      'Jongeren geven hun bankpas en pincode af in ruil voor de belofte van "snelle commissie"',
      'Geldezel-rekeningen ontvangen achtereenvolgens phishing-buit, bank helpdesk betalingen én overboekingen van drugspanden',
      'Snelle contante geldopnames bij pinautomaten (Geldmaat) door "cash runners" met gezichtsbedekking',
    ],
    realWorldExample:
      'De Politie Midden-Nederland ontdekte een criminele groepering die zowel WhatsApp-fraude en bank helpdesk oplichting aanstuurde als fungeerde als witwasmachine voor een lokale cocaïnelijn in Utrecht. Dezelfde 40 geldezels werden voor beide doeleinden misbruikt.',
    dutchImpact: 'Grote maatschappelijke ontwrichting onder jongeren (BKR-noteringen, strafblad, schulden) en enorme schade voor banken.',
    severity: 'HOOG',
    tags: ['Geldezels', 'Money Mules', 'Telegram Ronseling', 'Geldmaat Pinnen', 'Jeugdcriminaliteit'],
    technicalVectors: ['SEPA Instant Payments', 'Geldmaat cashouts', 'Telegram recruitment bots', 'SIM-spoofing'],
    policeOperationRef: 'Onderzoek MuleFlow / Landelijke Eenheid',
  },
  {
    id: 'nexus-link-5',
    sourceDomain: 'DARKNETMARKTEN',
    targetDomain: 'DRUGSHANDEL',
    title: 'Darknet Retail van Synthetische Drugs & Precursoren',
    shortSummary:
      'Nederlandse drugslaboratoria gebruiken darknet-marktplaatsen als wereldwijde distributiehub met stealth postverzending.',
    mechanisms: [
      'Brabantse en Limburgse laboratoria produceren MDMA, amfetamine en 2C-B op industriële schaal',
      'Darknet-markten (Archetyp, Incognito, Bohemia) fungeren als digitale etalage met vendor ratings en escrow',
      'Professionele verzendploegen verpakken drugs in vacuüm gesealde folie met geurneutraliserende koolstoffilters',
      'Verzending via reguliere PostNL- en DHL-brievenbussen onder valse bedrijfsnamen naar Duitsland, VK, VS en Australië',
    ],
    realWorldExample:
      'Tijdens Operatie Hansa Market beheerde de Nederlandse politie in het geheim 27 dagen lang de darknetmarkt nadat de servers in Litouwen waren overgenomen. De politie zag live hoe Nederlandse vendors dagelijks honderden kilo’s verdovende middelen via PostNL postbussen verstuurden naar kopers over de hele wereld.',
    dutchImpact: 'Nederland blijft mondiaal koploper in darknet-postorderexport van synthetische drugs.',
    severity: 'KRITIEK',
    tags: ['Hansa Market', 'PostNL Drops', 'MDMA Export', 'Stealth Shipping', 'Vendor Escrow'],
    technicalVectors: ['Tor Onion V3', 'PGP Encrypted Addresses', 'Monero Stealth Addresses', 'Vacuum Sealing'],
    policeOperationRef: 'Operatie Hansa / Politie THTC & Landelijk Parket',
  },
  {
    id: 'nexus-link-6',
    sourceDomain: 'DARKNETMARKTEN',
    targetDomain: 'CYBERCRIME',
    title: 'Bulletproof Hosting & Gedeelde Ondergrondse Infrastructuur',
    shortSummary:
      'Ransomware commandoservers en darknet drugssites draaien op dezelfde offshore "bulletproof" datacenters die politiebevelen weigeren.',
    mechanisms: [
      'Exploitatie van bulletproof hosters (vaak gevestigd in voormalige militaire bunkers of onbereikbare jurisdicties)',
      'Hosters bieden bescherming tegen DDoS-aanvallen en negeren abuse-meldingen van westerse autoriteiten',
      'Zowel C2-servers van ransomware-bendes (LockBit, BlackCat) als illegale handelsfora huren IP-ranges bij dezelfde tussenpersonen',
      'Betaling geschiedt uitsluitend in ongetraceerde Monero of contant via koeriers',
    ],
    realWorldExample:
      'De ontmanteling van de "Cyberbunker" in Duitsland en latere acties in Nederland toonden aan dat dezelfde servers zowel darknet-drugssites (zoals Wall Street Market en Cannabis Road) als command & control infrastructuren voor botnets en ransomware hostten.',
    dutchImpact: 'Directe bedreiging voor de effectiviteit van gerechtelijke bevelen en snelle incident response.',
    severity: 'HOOG',
    tags: ['Bulletproof Hosting', 'Cyberbunker', 'C2 Servers', 'Abuse Evasion', 'Offshore Datacenters'],
    technicalVectors: ['BGP Anycast bulletproof routing', 'Fast-flux DNS', 'Tor Hidden Services', 'Offshore VPS'],
    policeOperationRef: 'Operatie Cyberbunker / Europol EC3',
  },
  {
    id: 'nexus-link-7',
    sourceDomain: 'FRAUDE',
    targetDomain: 'CYBERCRIME',
    title: 'Phishing-as-a-Service (PaaS) & Reverse Proxy Exploitatie',
    shortSummary:
      'Geavanceerde cybercriminelen ontwikkelen kant-en-klare phishing-tools (Evilginx) die door laagopgeleide fraudeurs worden gehuurd voor massale diefstal.',
    mechanisms: [
      'Gespecialiseerde malware-ontwikkelaars bouwen phishing reverse-proxy kits die exacte kopieën tonen van iDEAL, DigiD en banken',
      'Deze kits onderscheppen live de 2FA-codes en sessiecookies in real-time en sturen die door naar de aanvaller via Telegram webhooks',
      'De ontwikkelaar rekent een abonnementsprijs van €200 tot €500 per maand (Phishing-as-a-Service model)',
      'Lokale fraudeurs kopen de tool en voeren massale SMS- en WhatsApp-campagnes uit gericht op Nederlandse burgers',
    ],
    realWorldExample:
      'Met de ontmanteling van platforms zoals LabHost en Fraunhofer-kits bleek dat tienduizenden Nederlandse phishing-aanvallen op DigiD en banken werden aangedreven door slechts een handvol centrale ontwikkelaars op het darknet.',
    dutchImpact: 'Verlaging van de drempel: criminelen zonder IT-kennis kunnen met één klik geavanceerde bankaanvallen lanceren.',
    severity: 'HOOG',
    tags: ['Phishing-as-a-Service', 'Evilginx', 'DigiD Phishing', 'iDEAL Spoofing', 'Telegram Bots'],
    technicalVectors: ['Reverse Proxy MITM', 'Session Hijacking', 'Telegram API Webhooks', 'Dynamic DNS spoofing'],
    policeOperationRef: 'Operatie LabHost (Europol / Landelijke Politie)',
  },
  {
    id: 'nexus-link-8',
    sourceDomain: 'FRAUDE',
    targetDomain: 'DRUGSHANDEL',
    title: 'SIM-Swapping & Dual-Use Encrypted Telecom (Sky ECC Erfenis)',
    shortSummary:
      'Corrupte telecomcontacten en SIM-swappers bedienen zowel fraudeurs (crypto-whales beroven) als drugshandelaren (geheime PGP-telefoons).',
    mechanisms: [
      'Corruptie binnen telecomwinkels of social engineering van helpdesks om telefoonnummers over te zetten op nieuwe SIM-kaarten',
      'In fraude: overname van mobiele nummers om SMS-2FA van cryptobeurzen en banken te onderscheppen',
      'In drugshandel: levering van "schone" buitenlandse anonieme eSIMs en aangepaste cryptotelefoons (opvolgers van Sky ECC, EncroChat en Anom)',
      'Ondergrondse technici beheren private Matrix- en SimpleX-servers voor beide criminele groepen',
    ],
    realWorldExample:
      'De operaties rond EncroChat en Sky ECC toonden aan dat dezelfde technische tussenpersonen die geharde telefoons verkochten aan cocaïnehandelaren in Rotterdam en Amsterdam, ook diensten leverden aan hackers en fraudeurs voor het onderscheppen van verificatiecodes.',
    dutchImpact: 'Ondermijning van de telecomsector en grootschalige vermogensdiefstal bij vermogende particulieren en ondernemers.',
    severity: 'HOOG',
    tags: ['SIM Swapping', 'Sky ECC', 'EncroChat', 'Crypto Telefoons', 'Telecom Corruptie'],
    technicalVectors: ['SS7 exploitatie', 'eSIM cloning', 'Hardened Android forks', 'Private Matrix/Signal nodes'],
    policeOperationRef: 'Operatie Lemont (EncroChat) & Operatie Argus (Sky ECC)',
  },
];

export const CRIME_CASE_STUDIES: CrimeCaseStudy[] = [
  {
    id: 'case-hansa',
    title: 'Operatie Hansa Market',
    subtitle: 'Hoe de Nederlandse Politie een wereldwijde darknet drugsmarkt heimelijk overnam',
    dateOrYear: '2017 - Politie Team High Tech Crime',
    involvedAgencies: ['Politie Team High Tech Crime (THTC)', 'Landelijk Parket', 'Europol', 'FBI / DEA'],
    domainsCovered: ['DARKNETMARKTEN', 'DRUGSHANDEL', 'CYBERCRIME'],
    summary:
      'Na het lokaliseren van de Hansa Market servers in Litouwen nam de Nederlandse politie de volledige marktplaats heimelijk over. Gedurende 27 dagen liet de politie de markt draaien. De broncode werd aangepast om PGP-versleutelde adressen en foto’s van postpakketten ongecodeerd te loggen. Toen de FBI tegelijkertijd AlphaBay offline haalde, vluchtten tienduizenden kopers en verkopers naar Hansa – rechtstreeks in de armen van de Nederlandse politie.',
    keyFinding:
      'Ruim 27.000 transacties werden live onderschept. Het onderzoek toonde onomstotelijk aan dat Nederlandse verkopers verantwoordelijk waren voor meer dan 40% van alle synthetische drugsexport op het darknet en dat cybercriminelen dezelfde escrow-mechanismen gebruikten om ransomware-tools te verkopen.',
    tacticalLessons: [
      'Darknet-anonimiteit valt direct weg zodra politie controle krijgt over de centrale server en broncode aanpast',
      'Ondergrondse markten fungeren als hybride hubs: verdovende middelen en cyberwapens delen dezelfde betalings- en reputatie-infrastructuur',
      'Stealth postverzending via Nederlandse brievenbussen vereist nauwe samenwerking met PostNL inspecteurs',
    ],
    status: 'AFGEROND_VONNIS',
  },
  {
    id: 'case-genesis',
    title: 'Operatie Cookie Monster (Genesis Market)',
    subtitle: 'Ontmanteling van de grootste darknet-supermarkt voor gestolen digitale identiteiten',
    dateOrYear: 'April 2023 - Wereldwijde politie-inval',
    involvedAgencies: ['Nederlandse Politie (THTC)', 'FBI', 'Europol', '17 Landelijke Politiediensten'],
    domainsCovered: ['CYBERCRIME', 'FRAUDE', 'DARKNETMARKTEN'],
    summary:
      'Genesis Market was de grootste illegale marktplaats voor "bots": complete pakketten met gestolen inloggegevens, browser-cookies en digitale vingerafdrukken van besmette computers. Kopers konden met een speciale Genesis-browser direct inloggen bij banken, webwinkels en cryptodiensten alsof ze het slachtoffer zelf waren. De Nederlandse politie speelde een leidende rol bij de inbeslagname.',
    keyFinding:
      'Op het platform stonden meer dan 1.5 miljoen computers te koop, waaronder tienduizenden Nederlandse burgers en honderden medewerkers van vitale bedrijven. De markt vormde de ontbrekende schakel tussen infostealer-malware (cybercrime) en bank helpdesk oplichting (fraude).',
    tacticalLessons: [
      'Wachtwoorden alleen bieden geen bescherming meer: sessie-cookies omzeilen tweefactorauthenticatie (2FA) zonder alarmbellen bij de bank',
      'Politie ontwikkelde de "Check je hack" tool waarmee meer dan 5 miljoen Nederlanders konden controleren of hun profiel te koop stond',
      'De drempel voor geavanceerde fraude was verlaagd tot een webshop-ervaring van enkele euro’s per slachtoffer',
    ],
    status: 'AFGEROND_VONNIS',
  },
  {
    id: 'case-portbase',
    title: 'Haven Rotterdam Container-Hacks',
    subtitle: 'Gerichte cyberintrusies bij rederijen en expediteurs door drugssmokkelaars',
    dateOrYear: '2020 - Heden (Doorlopende focus)',
    involvedAgencies: ['Politie Eenheid Rotterdam', 'Team High Tech Crime', 'Zeehavenpolitie', 'Douane Nederland'],
    domainsCovered: ['CYBERCRIME', 'DRUGSHANDEL'],
    summary:
      'Criminelen die voorheen havenmedewerkers omkochten voor containercodes, schakelden over op hoogtechnologische spionage. Door gerichte phishingmails naar expediteurs en het plaatsen van fysieke keyloggers en mini-routers op kantoorcomputers van terminals, kregen ze toegang tot havensoftware zoals Portbase. Hiermee konden ze exacte containernummers, douane-inspectieorders en pincodes voor vrijgave real-time volgen.',
    keyFinding:
      'Een handvol hackers slaagde erin om maandenlang ongezien containercodes te stelen. Uithalers reden met nagemaakte vrachtwagens de terminals op en haalden containers met duizenden kilo’s cocaïne weg voordat de douane een scan kon inplannen.',
    tacticalLessons: [
      'Fysieke havenbeveiliging is zinloos als de digitale toegang tot containersystemen niet zwaar beveiligd is met hardwarematige MFA',
      'Haven Rotterdam heeft het "Vertrouwensketen" project versneld om containerpincodes te vervangen door beveiligde digitale sleutels gekoppeld aan de chauffeur',
      'Cybercriminaliteit is een onmisbaar gereedschap geworden voor de traditionele georganiseerde misdaad (ondermijning)',
    ],
    status: 'ACTIEF_MONITORING',
  },
  {
    id: 'case-skyecc',
    title: 'Operatie Sky ECC & EncroChat',
    subtitle: 'Hoe het kraken van cryptotelefoons de synergie tussen onderwereld en cybercrime bewees',
    dateOrYear: '2020 - 2021',
    involvedAgencies: ['Landelijke Eenheid Politie', 'Franse Gendarmerie', 'Belgische Federale Politie', 'Europol'],
    domainsCovered: ['DRUGSHANDEL', 'CYBERCRIME', 'FRAUDE'],
    summary:
      'Europese politiediensten slaagden erin de versleutelde communicatienetwerken EncroChat en Sky ECC te infiltreren en te ontcijferen. Maandenlang lazen rechercheurs live mee met honderden miljoenen berichten tussen internationale drugskartels, moordcommando’s, witwassers en hackers.',
    keyFinding:
      'Uit de chats bleek dat drugssyndicaten intensief cyber-experts inhuurden voor counter-surveillance (het scannen van politieradiogolven en nummerborden), het opsporen van concurrenten via gehackte systemen en het omzetten van contante winsten naar Bitcoin via illegale crypto-makelaars.',
    tacticalLessons: [
      'Georganiseerde misdaad beschikt over enorme budgetten om gespecialiseerde IT-infrastructuur en zero-day exploits in te kopen',
      'De grens tussen "straatcriminelen" en "cybercriminelen" bestaat in de praktijk niet meer: ze vormen een geïntegreerd kartel-ecosysteem',
      'Rechtszaken toonden aan dat crypto-witwassen een cruciale voorwaarde is voor de continuïteit van de drugshandel',
    ],
    status: 'AFGEROND_VONNIS',
  },
  {
    id: 'case-endgame',
    title: 'Operatie Endgame',
    subtitle: 'Gecoördineerde internationale slag tegen botnets en ransomware-transportbanden',
    dateOrYear: 'Mei 2024 - Heden',
    involvedAgencies: ['Nederlandse Politie (THTC)', 'BKA Duitsland', 'FBI', 'Franse Politie', 'Europol'],
    domainsCovered: ['CYBERCRIME', 'DARKNETMARKTEN', 'FRAUDE'],
    summary:
      'Operatie Endgame was de grootste internationale operatie ooit tegen malware-droppers en botnets (waaronder IcedID, SystemBC, Smokeloader, Pikabot en Bumblebee). Deze malware-families vormden de digitale transportband waarmee ransomware-bendes (zoals LockBit en Black Basta) toegang kregen tot netwerken en waarmee massaal inloggegevens voor fraude werden gestolen.',
    keyFinding:
      'Nederlandse servers en IP-reeksen speelden een sleutelrol in de C2-infrastructuur. SystemBC fungeerde specifiek als een geanonimiseerde Tor-proxy waarmee cybercriminelen buit en afpersingsgelden doorsluisden naar darknetmarkten en witwasdesks.',
    tacticalLessons: [
      'Het uitschakelen van "infostealers en droppers" pakt gelijktijdig ransomware-aanvallen én grootschalige bankfraude bij de wortel aan',
      'Internationale publiek-private samenwerking met cybersecurity-bedrijven en hostingproviders is vereist om infrastructuur definitief plat te leggen',
    ],
    status: 'INTERNATIONALE_OPERATIE',
  },
];

export const CRIME_CHAIN_SIMULATIONS: CrimeChainSimulation[] = [
  {
    id: 'chain-haven-coke',
    title: 'Keten A: Van Phishingmail naar 600kg Cocaïne in de Haven',
    threatScenario: 'Hoe een digitale inbraak bij een scheepvaartbedrijf leidt tot fysieke drugssmokkel langs de douane.',
    estimatedFinancialDamage: '€ 36.000.000 straatwaarde cocaïne + reputatieschade haven',
    steps: [
      {
        stepNumber: 1,
        domain: 'CYBERCRIME',
        title: 'Spear-phishing & Inbraak bij Expediteur',
        description:
          'Een Initial Access Broker (IAB) stuurt gerichte phishingmails met een malware-bijlage (LummaC2) naar logistiek medewerkers van een expediteur in Rotterdam. De VPN-inloggegevens en sessiecookies worden gestolen.',
        technicalDetails: 'Phishing payload: macro-loze OneNote dropper die CVE-2023-38831 misbruikt. VPN-toegang zonder hardware MFA.',
        evidenceArtifact: 'Gestolen domein-account: logistiek_planner@havenexpediteur-rtm.nl',
      },
      {
        stepNumber: 2,
        domain: 'DARKNETMARKTEN',
        title: 'Veiling van Logistieke Toegang op Exploit.in',
        description:
          'De IAB plaatst de gehackte logistieke accounts te koop op een Russisch darknetforum. Biedingen starten op 1.5 Monero. Een Nederlandse tussenpersoon die voor een drugskartel werkt koopt de toegang.',
        technicalDetails: 'Monero escrow transactie op Exploit.in; overdracht van sessiecookies en RDP-credentials.',
        evidenceArtifact: 'Listing: "[ACCESS] Dutch Freight Forwarder Portbase Integrated - 1.5 XMR"',
      },
      {
        stepNumber: 3,
        domain: 'DRUGSHANDEL',
        title: 'Portbase Monitoring & Pincode Diefstal',
        description:
          'De hacker logt in op het Portbase-systeem namens de expediteur. Hij zoekt gericht op specifieke containernummers afkomstig uit Santos (Brazilië) met ananas en bananen als deklading. De unieke commerciële uitrijcode (PIN) wordt gekopieerd.',
        technicalDetails: 'Geautoriseerde API-aanroep binnen Portbase; export van containervrijgavecertificaat naar gecodeerd Telegram-kanaal.',
        evidenceArtifact: 'Container MSKU7829104 - Vrijgavepincode: 948102 (Status: Groen / Geen Fysieke Scan)',
      },
      {
        stepNumber: 4,
        domain: 'DRUGSHANDEL',
        title: 'Fysieke Uithaling op Maasvlakte Terminal',
        description:
          'Een corrupte vrachtwagenchauffeur met de gestolen pincode rijdt de Maasvlakte terminal op. De slagboom scant de pincode en geeft de container met 600 kg cocaïne vrij. De vrachtwagen verlaat het haventerrein zonder inspectie.',
        technicalDetails: 'Misbruik van legitieme automatische terminalpoort; match tussen pincode en kenteken.',
        evidenceArtifact: 'Geldige uitrij-logging terminalgate 4 om 03:14 uur \'s nachts.',
      },
      {
        stepNumber: 5,
        domain: 'FRAUDE',
        title: 'Witwassen van de Winst via Stroman BV\'s & Crypto',
        description:
          'De opbrengst van de drugszending (€18M groothandel) wordt via ondergrondse bankiers gewit met valse facturen in stroman-bouwbedrijven en omgezet naar crypto om nieuwe zendingen in Zuid-Amerika te financieren.',
        technicalDetails: 'Trade-Based Money Laundering (TBML) gecombineerd met overboekingen naar crypto-exchanges in belastingparadijzen.',
        evidenceArtifact: 'Spookfacturen voor "levering van bouwmaterialen" tussen 4 lege Nederlandse BV\'s.',
      },
    ],
  },
  {
    id: 'chain-ransomware-cash',
    title: 'Keten B: Van Ransomware Gijzeling naar Contante Drugscash',
    threatScenario: 'Hoe een ziekenhuis of transportbedrijf losgeld betaalt en hoe die crypto eindigt bij straatdealers en kartels.',
    estimatedFinancialDamage: '€ 4.500.000 losgeldbetaling + € 12.000.000 bedrijfsschade',
    steps: [
      {
        stepNumber: 1,
        domain: 'CYBERCRIME',
        title: 'Netwerkinfiltratie & Dubbele Afpersing',
        description:
          'Een ransomware-affiliate (LockBit 3.0) dringt binnen via een ongepatchte Fortinet-firewall. Alle servers worden geëncripteerd en 800 GB gevoelige klantdata wordt geëxfiltreerd naar een bulletproof server.',
        technicalDetails: 'CVE-2024-21762 exploit, PsExec laterale verplaatsing, exfiltratie via Rclone naar Mega/Wasabi.',
        evidenceArtifact: 'Ransom note: RESTORE-MY-FILES.txt met eis van 75 Bitcoin (~€4.500.000).',
      },
      {
        stepNumber: 2,
        domain: 'DARKNETMARKTEN',
        title: 'Onderhandeling op Tor Leksite & Crypto Betaling',
        description:
          'Het slachtoffer onderhandelt via de Tor-website van de ransomware-groep. Onder druk van publicatie betaalt de verzekeraar 75 Bitcoin naar een uniek walletadres.',
        technicalDetails: 'Tor Onion v3 chatinterface met geautomatiseerde Bitcoin-adres generator en countdown-timer.',
        evidenceArtifact: 'Blockchain TXID: 7a9f8b...e12d4 (75.00000000 BTC bevestigd in block 865104).',
      },
      {
        stepNumber: 3,
        domain: 'CYBERCRIME',
        title: 'Peeling Chains & Monero Mixer Obfuscatie',
        description:
          'De cybercriminelen breken de 75 Bitcoin op via peeling chains en wisselen het via cross-chain swaps om naar Monero (XMR) en sturen het door Tornado Cash mixers om elk spoor naar de hack uit te wissen.',
        technicalDetails: 'Hop door 12 tussenliggende unhosted wallets, swap via non-KYC exchanges naar Monero stealth addresses.',
        evidenceArtifact: 'Geen herleidbare trace meer op publieke blockchains.',
      },
      {
        stepNumber: 4,
        domain: 'DRUGSHANDEL',
        title: 'Ondergrondse Swap tegen Drugscash in Randstad',
        description:
          'De cybercriminelen spreken af met een broker die verbonden is aan een Zuid-Amerikaans drugskartel. Het kartel heeft dringend schone crypto nodig voor leveranciers, terwijl de hackers cash in Europa willen. Ze ruilen 75 Monero tegen fysieke tassen met eurobiljetten in een industrieterrein bij Rotterdam.',
        technicalDetails: 'Hawala-bankieren principe: Token-overdracht op Monero blockchain tegen fysieke telling van 50- en 100-eurobiljetten.',
        evidenceArtifact: '€3.800.000 aan contanten in sporttassen (afslag van 15% provisie voor de broker).',
      },
      {
        stepNumber: 5,
        domain: 'FRAUDE',
        title: 'Verspreiding via Geldezels & Consumptieve Uitgaven',
        description:
          'Het contante geld wordt door lokale handlangers gebruikt voor de aankoop van goud, luxe auto\'s op buitenlandse kentekens en gefaseerd gestort via geldezel-rekeningen.',
        technicalDetails: 'Smurfing-methode: dagelijks net onder de €3.000 meldgrens storten bij verschillende Geldmaat automaten.',
        evidenceArtifact: '28 verschillende bankpassen van studenten gebruikt in 5 dagen tijd.',
      },
    ],
  },
  {
    id: 'chain-infostealer-bankfraude',
    title: 'Keten C: De Infostealer-tot-Bank Helpdesk Roof',
    threatScenario: 'Hoe een besmetting met malware op een privélaptop leidt tot een geplunderde spaarrekening via een nepbankier.',
    estimatedFinancialDamage: '€ 85.000 per slachtoffer / honderden gedupeerden per maand',
    steps: [
      {
        stepNumber: 1,
        domain: 'CYBERCRIME',
        title: 'Malvertising & Infostealer Besmetting',
        description:
          'Een Nederlandse consument zoekt via Google naar een belastingformulier of pdf-converter en klikt op een gesponsorde advertentie die malware verspreidt. LummaC2 installeert zich geruisloos.',
        technicalDetails: 'Google Ads malvertising redirect naar fake website; payload bypasses Windows Defender via AMSI-tampering.',
        evidenceArtifact: 'LummaC2 C2-communicatie naar 185.196.8.120/api/gate.php',
      },
      {
        stepNumber: 2,
        domain: 'DARKNETMARKTEN',
        title: 'Geautomatiseerde Verkoop op Russian Market',
        description:
          'Binnen 10 minuten worden alle browser-inloggegevens, cookies en auto-fill data geüpload en op darknet platform Russian Market te koop gezet voor $12. Een fraudeur koopt het pakket.',
        technicalDetails: 'Archiefbestand met cookies.sqlite, Web Data (inclusief NAW, BSN, geboortedatum) en opgeslagen wachtwoorden.',
        evidenceArtifact: 'Russian Market Bot #849201 (Locatie: Utrecht, NL / Provider: Ziggo / Bank: ING)',
      },
      {
        stepNumber: 3,
        domain: 'FRAUDE',
        title: 'Gekloonde Sessie & Gegevensverificatie',
        description:
          'De fraudeur laadt het cookiebestand in een anti-detect browser. Hij logt in op Mijn ING en ziet precies het banksaldo (€85.000 spaargeld), de rekeningnummers van de kinderen en de recente overboekingen.',
        technicalDetails: 'Anti-detect browser Dolphin Anty emuleert exact het besturingssysteem, resolutie en IP-subnet van het slachtoffer.',
        evidenceArtifact: 'Geen 2FA-verzoek getriggerd door de bank omdat de sessiecookie geldig was.',
      },
      {
        stepNumber: 4,
        domain: 'FRAUDE',
        title: 'Gespoofde Telefoonoproep namens "Bank Security"',
        description:
          'De fraudeur belt het slachtoffer met een gespoofd telefoonnummer dat op het scherm verschijnt als het echte nummer van de bank. Hij noemt details van recente betalingen om direct vertrouwen te winnen.',
        technicalDetails: 'SIP VoIP provider met willekeurige CLI (Calling Line Identification) manipulatie.',
        evidenceArtifact: 'Slachtoffer ziet "+31 20 228 8888" (officiële bank helpdesk) op smartphone display.',
      },
      {
        stepNumber: 5,
        domain: 'FRAUDE',
        title: 'Overboeking naar "Kluisrekening" & Geldezel Cashout',
        description:
          'Het slachtoffer wordt overtuigd dat er een hack gaande is en maakt het spaargeld over naar een zogenaamde veilige "kluisrekening". Deze rekening is in werkelijkheid van een geronselde geldezel, waarna het geld direct wordt omgezet in cryptocurrency.',
        technicalDetails: 'Instant SEPA overboeking naar rekening van een 19-jarige student; direct doorgestort naar Bitvavo / Bybit.',
        evidenceArtifact: 'Transactie: €85.000 omgezet in Bitcoin binnen 4 minuten na binnenkomst.',
      },
    ],
  },
];
