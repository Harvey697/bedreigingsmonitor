import React, { useState } from 'react';
import {
  ShieldCheck,
  Sparkles,
  Building2,
  GraduationCap,
  CheckCircle2,
  ExternalLink,
  Lightbulb,
  HeartHandshake,
  Award,
  Lock,
  Users,
  Cpu,
  ArrowUpRight,
  Compass,
} from 'lucide-react';

interface DutchCyberCenter {
  id: 'HSD_DEN_HAAG' | 'BHOC_BRABANT' | 'CVD_APELDOORN';
  name: string;
  shortName: string;
  cityAndRegion: string;
  badgeText: string;
  accentColor: 'emerald' | 'cyan' | 'teal';
  websiteUrl: string;
  secondaryUrl?: string;
  secondaryUrlLabel?: string;
  tertiaryUrl?: string;
  tertiaryUrlLabel?: string;
  foundedOrLaunch: string;
  scaleMetric: string;
  missionSummary: string;
  keyPartners: string[];
  coreThemes: {
    title: string;
    detail: string;
  }[];
  practicalBenefitForVisitor: string[];
  positiveImpactQuote: string;
}

const DUTCH_CYBER_CENTERS: DutchCyberCenter[] = [
  {
    id: 'HSD_DEN_HAAG',
    name: 'Security Delta (HSD) — Den Haag',
    shortName: 'Security Delta (HSD)',
    cityAndRegion: 'Den Haag (HSD Campus, Binckhorst) • Nationaal Veiligheidscluster',
    badgeText: '275+ PARTNERS • NATIONAAL CLUSTER',
    accentColor: 'emerald',
    websiteUrl: 'https://securitydelta.nl',
    secondaryUrl: 'https://www.securitytalent.nl',
    secondaryUrlLabel: 'SecurityTalent.nl',
    foundedOrLaunch: 'Opgericht in 2013 • Kernpartner Nationaal House of Cyber Den Haag',
    scaleMetric: '275+ bedrijven, kennisinstellingen & overheden',
    missionSummary:
      'The Hague Security Delta (HSD) is het grootste veiligheidscluster van Nederland. Vanuit de HSD Campus in Den Haag werken meer dan 275 publiek-private partners (startups, multinationals, universiteiten, NCSC, TNO, Politie en ministeries) dagelijks samen om Nederland digitaal weerbaarder, veiliger en innovatiever te maken.',
    keyPartners: [
      'NCSC-NL & Ministerie van J&V',
      'TNO & Nationale Politie',
      'Gemeente Den Haag',
      'Universiteit Leiden & TU Delft',
      'Haagse Hogeschool',
      'Industrieel Platform Cyber Security (IPCS)',
      '275+ Cyberbedrijven & Scale-ups',
    ],
    coreThemes: [
      {
        title: 'Cybersecurity & Organisatie-Weerbaarheid',
        detail:
          'Praktische programma’s en Cyber Resilience Centers die mkb- en vitale organisaties helpen om risico’s vooraf te keren en NIS2-compliant te worden.',
      },
      {
        title: 'OT-Security & Vitale Infrastructuur (IPCS)',
        detail:
          'Via het Industrieel Platform Cyber Security (IPCS) bundelt HSD kennis om industriële controlesystemen (SCADA/ICS) in water, energie en logistiek optimaal te beschermen.',
      },
      {
        title: 'Secure by Design & AI-Verdediging',
        detail:
          'Stimuleert dat veiligheid vanaf de allereerste ontwerpfase in software en hardware wordt ingebouwd, ondersteund door slimme AI-dreigingsdetectie.',
      },
      {
        title: 'Human Capital & SecurityTalent.nl',
        detail:
          'Bestrijdt het tekort aan cyber-experts via omscholingstrajecten, mbo/hbo/wo-samenwerking en het landelijke platform SecurityTalent.nl.',
      },
    ],
    practicalBenefitForVisitor: [
      'Gratis whitepapers, NIS2-stappenplannen en OT-beveiligingsrichtlijnen downloaden via securitydelta.nl.',
      'Toegang tot innovatie- en subsidieprogramma’s voor mkb en publieke organisaties.',
      'Vind cyber-opleidingen, stages en vacatures via het HSD-initiatief SecurityTalent.nl.',
    ],
    positiveImpactQuote:
      'HSD bewijst dat publiek-private samenwerking werkt: door kennis niet achter gesloten deuren te houden maar actief te delen, stijgt de digitale weerbaarheid van heel Nederland.',
  },
  {
    id: 'BHOC_BRABANT',
    name: 'Brabant House of Cyber (BHoC) — Eindhoven & Tilburg',
    shortName: 'Brabant House of Cyber',
    cityAndRegion: 'Noord-Brabant (Brainport Eindhoven & MindLabs Tilburg)',
    badgeText: '€ 14,5 MILJOEN COALITIE • HIGH-TECH & DEFENSIE',
    accentColor: 'cyan',
    websiteUrl: 'https://www.mind-labs.eu/nieuws/brabant-house-of-cyber/',
    secondaryUrl: 'https://cwbrainport.nl/',
    secondaryUrlLabel: 'CWB Brainport',
    tertiaryUrl: 'https://www.bom.nl/en/articles/brabant-investeert-ruim-14-miljoen-euro-in-cyberveiligheid',
    tertiaryUrlLabel: 'BOM Dossier',
    foundedOrLaunch: 'Officiële kick-off januari 2026 (€ 14,5 miljoen gezamenlijke investering)',
    scaleMetric: 'High-Tech Maakindustrie, Kennisinstellingen & Defensie',
    missionSummary:
      'Het Brabant House of Cyber (BHoC) is de krachtige publiek-private cybercoalitie in Noord-Brabant. Met een startinvestering van bijna €14,5 miljoen beschermen de Provincie Noord-Brabant, BOM, TNO, universiteiten, hogescholen, Defensie (o.a. Koninklijke Luchtmacht) en high-tech koplopers de slimme maakindustrie en vitale toeleveringsketens.',
    keyPartners: [
      'Provincie Noord-Brabant & BOM',
      'TNO & TU Eindhoven (TU/e)',
      'Tilburg University, JADS & MindLabs',
      'Avans, Fontys, Summa & KW1C',
      'Cyber Weerbaarheidscentrum Brainport (CWB)',
      'ASML, NXP, VDL, Philips, NTS & ESET',
      'Ministerie van Defensie / Luchtmacht',
    ],
    coreThemes: [
      {
        title: 'Ketenweerbaarheid High-Tech Maakindustrie',
        detail:
          'Versterkt honderden mkb-toeleveranciers in de Brainport-regio zodat de gehele productieketen rond o.a. ASML, NXP, VDL en Defensie veilig blijft tegen spionage en ransomware.',
      },
      {
        title: 'Product Security Innovation (TNO & Eindhoven)',
        detail:
          'Onderzoeksprogramma vanuit Eindhoven om slimme machines, chips en medische technologie vanaf het ontwerp ("Secure by Design") ondoordringbaar te maken.',
      },
      {
        title: 'MindLabs Tilburg & Cyber Talent Tafels',
        detail:
          'Vanuit MindLabs in Tilburg ontwikkelen mbo-, hbo- en wo-instellingen samen met het bedrijfsleven praktijkgerichte cyber-curricula en fieldlabs.',
      },
      {
        title: 'Civiel-Militaire Samenwerking met Defensie',
        detail:
          'Slaat de brug tussen de Brabantse defensie- en luchtvaartketen (zoals Woensdrecht/Eindhoven) en regionale techbedrijven voor gedeelde dreigingsintelligentie.',
      },
    ],
    practicalBenefitForVisitor: [
      'Maak- en techbedrijven kunnen zich aansluiten bij het Cyber Weerbaarheidscentrum Brainport (CWB) voor vroegtijdige waarschuwingen.',
      'Toegang tot TNO Product Security workshops en keten-weerbaarheidstests voor mkb-toeleveranciers.',
      'Directe aansluiting op talent- en innovatietafels in MindLabs Tilburg en op de High Tech Campus Eindhoven.',
    ],
    positiveImpactQuote:
      'In Brabant beschermen grootbedrijven zoals ASML, VDL en NXP actief hun mkb-ketenpartners: niemand staat er alleen voor in de digitale verdediging.',
  },
  {
    id: 'CVD_APELDOORN',
    name: 'Centrum voor Veiligheid en Digitalisering (CVD) — Apeldoorn',
    shortName: 'CVD Apeldoorn',
    cityAndRegion: 'Apeldoorn (Wapenrustlaan / Spoorzone) • Oost-Nederland & Landelijk',
    badgeText: 'MBO • HBO • WO • POLITIE & DEFENSIE',
    accentColor: 'teal',
    websiteUrl: 'https://www.cvdnederland.nl',
    secondaryUrl: 'https://www.apeldoorn-it.nl',
    secondaryUrlLabel: 'Apeldoorn IT',
    foundedOrLaunch: 'Opgericht door vaste convenantpartners aan de Wapenrustlaan Apeldoorn',
    scaleMetric: 'Doorlopende kenniskolom MBO – HBO – WO & Praktijk',
    missionSummary:
      'Het Centrum voor Veiligheid en Digitalisering (CVD) in Apeldoorn is hét Nederlandse kennis- en innovatiecentrum waar onderwijs (van mbo en hbo tot universiteit en promovendi), veiligheidsdiensten en bedrijfsleven fysiek samenwerken aan mensgerichte cyberweerbaarheid, digitale opsporing en veilige vitale data.',
    keyPartners: [
      'Universiteit Twente (UT) & Hogeschool Saxion',
      'Politieacademie & NIPV',
      'Aventus (MBO) & Gemeente Apeldoorn',
      'Defensie (Landmacht & Kon. Marechaussee)',
      'Belastingdienst & Kadaster',
      'Centraal Beheer / Achmea & Apeldoorn IT',
    ],
    coreThemes: [
      {
        title: 'Expertisenetwerk Cyberweerbaarheid NL (SPRONG & CLIC-it)',
        detail:
          'Leidt grote landelijke NWO-onderzoeksprogramma’s (zoals SPRONG o.l.v. lector Remco Spithoven en CLIC-it o.l.v. Universiteit Twente) gericht op gedragsverandering en menselijke weerbaarheid.',
      },
      {
        title: 'Informatiegestuurd Werken & Actionable Intelligence',
        detail:
          'Combineert academische data-wetenschap met de praktijk van de Politieacademie, NIPV en Koninklijke Marechaussee voor effectieve digitale opsporing en crisisbeheersing.',
      },
      {
        title: 'Kritische Data & Vitale Overheidsinfrastructuur',
        detail:
          'Samenwerking met o.a. Belastingdienst, Kadaster, Achmea en Defensie om grootschalige publieke databestanden en vitale processen veilig te houden.',
      },
      {
        title: 'Learning Communities & Strategische Traineeships',
        detail:
          'Mbo-, hbo- en wo-studenten werken samen met docent-onderzoekers en professionals in één gebouw aan echte veiligheidsvraagstukken van bedrijven en gemeenten.',
      },
    ],
    practicalBenefitForVisitor: [
      'Leg uw praktijkvraagstuk over cyberweerbaarheid of veilig digitaal gedrag neer bij een CVD Learning Community.',
      'Maak gebruik van de openbare onderzoeksresultaten over waarom mensen op phishing klikken én hoe positieve cultuur dit voorkomt.',
      'Volg executive opleidingen, mbo/hbo-keuzedelen of strategische traineeships in Apeldoorn.',
    ],
    positiveImpactQuote:
      'Het CVD in Apeldoorn laat zien dat technologie pas echt veilig is als we ook investeren in de mens: door mbo, hbo, universiteit, politie en bedrijfsleven te verbinden, groeit een nieuwe generatie digitale beschermers.',
  },
];

interface PracticalTipItem {
  id: string;
  title: string;
  category: 'THUIS_BURGER' | 'MKB_MAAKINDUSTRIE' | 'IT_EN_NIS2';
  timeRequired: string;
  impactBadge: string;
  adviceText: string;
  actionStep: string;
  endorsedBy: string;
}

const PRACTICAL_CYBER_TIPS: PracticalTipItem[] = [
  // VOOR THUIS, BURGERS & ZZP
  {
    id: 'tip-passkeys-mfa',
    title: 'Zet tweestapsverificatie (2FA) of Passkeys aan op e-mail, DigiD & bankzaken',
    category: 'THUIS_BURGER',
    timeRequired: '5 minuten',
    impactBadge: 'Houdt 99% van account-overnames tegen',
    adviceText:
      'Zelfs als een wachtwoord ooit uitlekt bij een webshop, kunnen aanvallers niet inloggen als u een extra bevestiging via een authenticator-app of Passkey gebruikt.',
    actionStep:
      'Begin bij uw belangrijkste e-mailaccount (Gmail, Outlook, Proton): dit is de "hoofdsleutel" tot al uw andere accounts.',
    endorsedBy: 'NCSC-NL & CVD Apeldoorn',
  },
  {
    id: 'tip-wachtwoordmanager',
    title: 'Gebruik een wachtwoordmanager met unieke wachtwoorden (min. 14 tekens)',
    category: 'THUIS_BURGER',
    timeRequired: '10 minuten',
    impactBadge: 'Voorkomt kettingreactie bij datalekken',
    adviceText:
      'U hoeft nog maar één sterk hoofdwachtwoord (bijv. een wachtzin van 4 willekeurige woorden) te onthouden; uw wachtwoordkluis regelt de rest veilig voor elke site.',
    actionStep:
      'Gebruik een betrouwbare wachtwoordkluis (zoals Bitwarden, 1Password of Apple/Google Wachtwoorden) en vervang hergebruikte wachtwoorden.',
    endorsedBy: 'Consumentenbond & Veilig Internetten',
  },
  {
    id: 'tip-auto-updates',
    title: 'Schakel automatische updates in op telefoon, laptop en thuisrouter',
    category: 'THUIS_BURGER',
    timeRequired: '2 minuten',
    impactBadge: 'Dicht bekende lekken automatisch',
    adviceText:
      'Beveiligingsupdates repareren digitale achterdeurtjes nog voordat criminelen er misbruik van kunnen maken. Stel ze zo in dat ze ’s nachts automatisch installeren.',
    actionStep:
      'Controleer vandaag of uw smartphone, browser (Chrome/Edge/Safari) en wifi-router op automatisch bijwerken staan.',
    endorsedBy: 'Digital Trust Center & NCSC-NL',
  },
  {
    id: 'tip-bankhelpdesk-check',
    title: 'Spreek een vast familie-codewoord af en hang op bij telefonische spoedverzoeken',
    category: 'THUIS_BURGER',
    timeRequired: '3 minuten',
    impactBadge: 'Beschermt tegen AI-stemcloning & helpdeskfraude',
    adviceText:
      'Een bank, de politie of een helpdesk zal u nooit vragen om geld over teboeken naar een "kluisrekening" of om meekijksoftware (AnyDesk/TeamViewer) te installeren.',
    actionStep:
      'Twijfelt u aan een telefoontje of WhatsApp-bericht? Hang direct op en bel zelf het officiële nummer terug.',
    endorsedBy: 'Politieacademie & CVD Apeldoorn',
  },

  // VOOR MKB & MAAKINDUSTRIE
  {
    id: 'tip-mkb-321-backup',
    title: 'Hanteer de 3-2-1 Back-up Regel met één onwijzigbare (Immutable) kopie',
    category: 'MKB_MAAKINDUSTRIE',
    timeRequired: '30 minuten check',
    impactBadge: 'Maakt uw bedrijf immuun voor losgeld-afpersing',
    adviceText:
      'Met een losgekoppelde of onwijzigbare (immutable) back-up kunt u bij een incident altijd binnen enkele uren uw administratie en productie herstellen zonder losgeld te betalen.',
    actionStep:
      'Vraag uw IT-leverancier vandaag: "Zijn onze back-ups beveiligd tegen meekopiëren/wissen (immutable), en wanneer hebben we het terugzetten voor het laatst getest?"',
    endorsedBy: 'Security Delta (HSD) & Digital Trust Center',
  },
  {
    id: 'tip-mkb-fido2-mfa',
    title: 'Stel Phishing-Resistente MFA (FIDO2 / Authenticator met nummermatching) in voor al het personeel',
    category: 'MKB_MAAKINDUSTRIE',
    timeRequired: '15 minuten per team',
    impactBadge: 'Blokkeert EvilProxy & Microsoft 365 phishing',
    adviceText:
      'Moderne MFA met nummermatching of hardware-sleutels (YubiKey / Passkeys) voorkomt dat medewerkers via een valse inlogpagina hun sessie-token weggeven.',
    actionStep:
      'Schakel in Microsoft Entra ID / Google Workspace "Phishing-resistant MFA" in en blokkeer verouderde SMS-verificatie.',
    endorsedBy: 'Brabant House of Cyber & CWB Brainport',
  },
  {
    id: 'tip-mkb-koelsystemen-ot',
    title: 'NCSC-NL Spoedadvies (2 nov): Hang koelsystemen en klimaatregeling nooit direct aan internet en wijzig "12345"',
    category: 'MKB_MAAKINDUSTRIE',
    timeRequired: '10 minuten met uw installateur',
    impactBadge: 'Voorkomt voedselbederf, sabotage en winkelsluiting',
    adviceText:
      'Op 2 november 2026 werden koelsystemen van 17 Nederlandse bedrijven en tientallen supermarkten op "ontdooien" (70°C) gezet omdat Danfoss-controllers via een 4G-modem met standaardwachtwoord "12345" aan het internet hingen.',
    actionStep:
      'Vraag uw koel- of gebouwinstallateur direct om publieke 4G-toegang te sluiten (alleen via VPN/allowlist) en het supervisor-wachtwoord ("12345") te vervangen.',
    endorsedBy: 'NCSC-NL (Advies 2 nov 2026) & IPCS / HSD Den Haag',
  },
  {
    id: 'tip-mkb-netwerksegmentatie',
    title: 'Scheid uw kantoornetwerk, gasten-wifi en productiemachines (OT/IoT)',
    category: 'MKB_MAAKINDUSTRIE',
    timeRequired: 'Project met IT-partner',
    impactBadge: 'Voorkomt verspreiding binnen uw bedrijfspand',
    adviceText:
      'Als een laptop op kantoor of een slim apparaat (zoals een printer of beveiligingscamera) besmet raakt, blijven uw CNC-machines, magazijn en administratie volledig buiten schot.',
    actionStep:
      'Plaats slimme apparaten, camera’s en fabrieksapparatuur in een apart VLAN los van uw kantoor-pc’s.',
    endorsedBy: 'Brabant House of Cyber & IPCS (HSD Den Haag)',
  },
  {
    id: 'tip-mkb-keten-aansluiting',
    title: 'Sluit u gratis of laagdrempelig aan bij een regionaal Cyber Weerbaarheidscentrum',
    category: 'MKB_MAAKINDUSTRIE',
    timeRequired: '10 minuten aanmelding',
    impactBadge: 'Ontvang vroege waarschuwingen op maat voor uw sector',
    adviceText:
      'Samen sta je vele malen sterker dan alleen. Via het Digital Trust Center (DTC), CWB Brainport, Security Delta (HSD) of CVD Apeldoorn deelt u kennis met vakgenoten.',
    actionStep:
      'Meld uw zakelijke IP-bereik en domeinnaam gratis aan bij de Cyberveilig Check en het Digital Trust Center.',
    endorsedBy: 'HSD Den Haag • BHoC Brabant • CVD Apeldoorn',
  },

  // VOOR IT-BEHEERDERS & NIS2 VITALE ORGANISATIES
  {
    id: 'tip-nis2-edge-patching',
    title: 'Beperk blootgestelde VPN/Edge-managementinterfaces en patch KEV-lekken binnen 24-48 uur',
    category: 'IT_EN_NIS2',
    timeRequired: 'Continue hygiëne',
    impactBadge: 'Sluit de #1 binnenkomstroute van APT’s en ransomware af',
    adviceText:
      'Bijna 70% van de grote inbraken begint via een van internet bereikbare beheerpagina op een firewall, VPN of loadbalancer. Zet beheerpoorten uitsluitend achter een Zero-Trust bastion of IP-allowlist.',
    actionStep:
      'Controleer uw externe aanvalsoppervlak wekelijks (bijv. via Shodan/Shadowserver/DIVD meldingen) en sluit onnodige managementpoorten.',
    endorsedBy: 'NCSC-NL, AIVD & MIVD',
  },
  {
    id: 'tip-nis2-laps-tiering',
    title: 'Pas Active Directory Tiering, LAPS en Just-In-Time (JIT) Admin rechten toe',
    category: 'IT_EN_NIS2',
    timeRequired: 'Architectuur-check',
    impactBadge: 'Stopt laterale beweging (Lateral Movement) direct',
    adviceText:
      'Door beheerders niet met een Domain Admin-account op reguliere werkstations te laten inloggen, kan een infostealer of phishingmail nooit in één keer het hele domein overnemen.',
    actionStep:
      'Activeer Windows LAPS op alle werkstations en gebruik aparte, geïsoleerde admin-accounts (Privileged Access Workstations).',
    endorsedBy: 'NCSC-NL & Security Delta (HSD)',
  },
  {
    id: 'tip-nis2-positieve-cultuur',
    title: 'Bouw een positieve "Blame-Free" meld-cultuur in plaats van straffen bij een foute klik',
    category: 'IT_EN_NIS2',
    timeRequired: 'Team-afspraak',
    impactBadge: 'Verkort detectietijd van dagen naar 5 minuten',
    adviceText:
      'Uit onderzoek van het CVD Apeldoorn blijkt: organisaties waar medewerkers een verdachte klik direct durven te melden zonder angst voor verwijten, stoppen 90% van de incidenten voordat er schade ontstaat.',
    actionStep:
      'Beloon medewerkers die een verdachte mail of vergissing direct melden bij de IT-servicedesk met een compliment.',
    endorsedBy: 'Centrum voor Veiligheid en Digitalisering (CVD) Apeldoorn',
  },
  {
    id: 'tip-nis2-crisis-oefening',
    title: 'Oefen elk halfjaar een kort, positief Tabletop Incident-Scenario van 45 minuten',
    category: 'IT_EN_NIS2',
    timeRequired: '45 minuten per halfjaar',
    impactBadge: 'Geeft rust, overzicht en snelheid tijdens een echt incident',
    adviceText:
      'Door samen met directie, communicatie en IT één keer droog te oefenen ("Wat doen we als onze primaire leverancier een storing heeft?"), weet iedereen rustig zijn rol.',
    actionStep:
      'Bewaar een geprinte contactkaart met belangrijke telefoonnummers (IT-partner, CSIRT, verzekeraar, NCSC) zodat deze ook zonder pc beschikbaar is.',
    endorsedBy: 'HSD Den Haag, BHoC Brabant & CVD Apeldoorn',
  },
];

const POSITIVE_CYBER_WINS_NL = [
  {
    id: 'win-politie-europol-castlerat-gootloader-checkjehack-14nov',
    badge: '🚔 POLITIE & EUROPOL TAKEDOWN (12–13 NOV)',
    title: 'Politie & Europol halen 120 CastleRAT & Gootloader malware-servers offline + 893.000 slachtoffer-wachtwoorden op Checkjehack.nl',
    description:
      'Tijdens een grote internationale politieoperatie op 12–13 november 2026 zijn 120 malware-servers (waaronder 6 servers in Nederland) en 39 criminele domeinen van de infostealer- en ClickFix-netwerken CastleRAT en Gootloader uit de lucht gehaald. Honderden besmette websites zijn opgeschoond en 893.000 unieke gestolen wachtwoorden zijn direct toegevoegd aan Politie Checkjehack.nl en Have I Been Pwned zodat Nederlanders zichzelf snel kunnen beschermen.',
    source: 'Security.NL, Politie.nl (Checkjehack.nl) & Europol (posting/961420 & 961514 — 12–13 nov 2026)',
  },
  {
    id: 'win-kamermotie-dns-phishing-filter-afm-11nov',
    badge: '🛡️ TWEEDE KAMER & AFM ACTIE (10–11 NOV)',
    title: 'Kamermotie bepleit landelijk standaard DNS-phishingfilter voor alle internetters + AFM verplicht banken tot hogere AI-cyberweerbaarheid',
    description:
      'Op 10–11 november 2026 heeft de Tweede Kamer een motie ingediend om samen met alle Nederlandse internetproviders een standaard DNS-gebaseerd phishingfilter (Anti Phishing Shield / APS) in te schakelen voor heel Nederland. Tegelijkertijd maakt de Autoriteit Financiële Markten (AFM) in Trendzicht 2027 cyberweerbaarheid en bescherming tegen AI-aanvallen en leveranciersrisico’s topprioriteit voor de hele financiële sector.',
    source: 'Security.NL, Tweede Kamer der Staten-Generaal (posting/961030) & AFM Trendzicht 2027 (10–11 nov 2026)',
  },
  {
    id: 'win-ncsc-scanplatform-politie-9nov',
    badge: '🛡️ NCSC SCANPLATFORM & POLITIE-ACTIE (9 NOV)',
    title: 'Kabinet laat NCSC eigen Nationaal Kwetsbaarheden-Scanplatform bouwen + Politie ontmaskert gebruikers van combolijst-fora',
    description:
      'Als onderdeel van het nieuwe Actieprogramma Toekomstbestendige Digitale Weerbaarheid (7–9 november 2026) ontwikkelt het NCSC een eigen nationaal scanplatform om kwetsbaarheden bij Nederlandse organisaties proactief te vinden vóórdat aanvallers toeslaan. Tegelijkertijd waarschuwt de Nationale Politie dat gebruikers op illegale combolijst- en helpdeskfraude-fora direct zichtbaar zijn voor opsporing.',
    source: 'Security.NL, Tweede Kamer (2026D56214) & Politie.nl (7–9 nov 2026)',
  },
  {
    id: 'win-csbn-2026-ai-ceo-arrests-6nov',
    badge: '⚖️ ARRESTATIES & CSBN 2026 (6 NOV)',
    title: 'Drietal achter $129M Deepfake "AI-Directeur" fraude gearresteerd + NCTV & NCSC lanceren CSBN 2026 actieagenda',
    description:
      'Op 6 november 2026 zijn drie verdachten aangeklaagd en aangehouden die met real-time AI-stem- en videodeepfakes van directeuren $129 miljoen buitmaakten. Tegelijkertijd bundelen NCSC-NL, NCTV en de regionale kenniscentra (HSD, BHoC en CVD) de krachten naar aanleiding van het Cybersecuritybeeld Nederland (CSBN) 2026 om het mkb en vitale sectoren sneller op basisniveau te brengen.',
    source: 'Security.NL, NCSC-NL / NCTV (CSBN 2026) & US DOJ (6 nov 2026)',
  },
  {
    id: 'win-google-xcpe-botnet-takedown',
    badge: '🌐 BOTNET ONTMANTELD (2 NOV)',
    title: 'Google & Japanse autoriteiten schakelen "XCPE"-botnet van 1,3 miljoen besmette Android tv-boxes uit',
    description:
      'Meer dan 1,3 miljoen Android tv-boxes (met een vooraf geïnstalleerde fabrieks-backdoor die werd misbruikt als crimineel proxynetwerk) zijn op 2 november 2026 in één klap bevrijd doordat Google Threat Intelligence en de Japanse autoriteiten de achterliggende botnet-infrastructuur hebben ontmanteld.',
    source: 'Security.NL & Google Cloud Threat Intelligence (2 nov 2026)',
  },
  {
    id: 'win-slm-cloud-firefox-privacy',
    badge: '🛡️ RIJKSOVERHEID PRIVACYSTAP (29 OKT)',
    title: 'Rijksoverheid SLM Cloud kiest voor digitale autonomie: Firefox Enterprise, Brave & Vivaldi scoren beter dan Edge',
    description:
      'Uit nieuw DPIA-onderzoek van Privacy Company in opdracht van SLM Cloud (Rijksoverheid) blijkt dat alternatieve browsers zoals Mozilla Firefox Enterprise, Brave en Vivaldi beduidend minder persoonsgegevens verzamelen dan Microsoft Edge. SLM Cloud adviseert nu Firefox Enterprise als privacyvriendelijk rijksbreed alternatief.',
    source: 'Security.NL & Open.overheid.nl (SLM Cloud — 29 okt 2026)',
  },
  {
    id: 'win-politie-bulletproof-limburg',
    badge: '🚔 POLITIE TAKEDOWN (#SECURITYNL)',
    title: 'Politie neemt in Limburg tientallen servers van malafide hostingbedrijf ("Virtualine") in beslag',
    description:
      'Team Cybercrime van de politie Midden-Nederland heeft samen met de FBI en de Duitse politie tientallen fysieke servers (en honderden virtuele servers) van bulletproof hoster Virtualine offline gehaald. Bovendien heeft de politie de gegevens van ruim 3.000 criminele klanten in handen gekregen voor directe vervolgacties.',
    source: 'Security.NL (#securitynl) & Politie.nl (28 okt 2026)',
  },
  {
    id: 'win-divd-ncsc',
    badge: '🇳🇱 PROACTIEVE BESCHERMING',
    title: 'Duizenden Nederlandse servers dit jaar tijdig gepatcht vóórdat aanvallers konden toeslaan',
    description:
      'Dankzij de nauwe samenwerking tussen NCSC-NL, het Digital Trust Center (DTC) en vrijwilligers van het Dutch Institute for Vulnerability Disclosure (DIVD) ontvangen Nederlandse organisaties direct een waarschuwing zodra een nieuw lek wordt ontdekt. Daardoor worden de meeste kwetsbaarheden gedicht nog vóórdat er schade ontstaat.',
    source: 'NCSC-NL & DIVD CSIRT Jaarbeeld',
  },
  {
    id: 'win-coalities',
    badge: '🤝 €14,5M+ NIEUWE INVESTERINGEN',
    title: 'Historische bundeling van krachten in Den Haag (HSD), Brabant (BHoC) en Apeldoorn (CVD)',
    description:
      'Nederland loopt in Europa voorop met regionale en nationale cyber-ecosystemen. Waar bedrijven vroeger in stilte hun eigen beveiliging moesten uitzoeken, delen ASML, NXP, Achmea, TNO, universiteiten, politie en Defensie nu actief hun kennis en tools met het mkb.',
    source: 'Security Delta (HSD) • Brabant House of Cyber • CVD Apeldoorn',
  },
  {
    id: 'win-mfa-backups',
    badge: '📈 WEERBAARHEID GROEIT STERK',
    title: 'Meer dan 84% van de vitale en NIS2-organisaties heeft nu sterke MFA en herstelbare back-ups',
    description:
      'Uit recente weerbaarheidsmetingen blijkt dat Nederlandse organisaties hun basisbeveiliging (Multi-Factor Authenticatie, gescheiden back-ups en versneld patchen) fors hebben versterkt. Zelfs wanneer een aanval plaatsvindt, blijft de schade steeds vaker beperkt tot minimale downtime.',
    source: 'Nationaal Cyberweerbaarheidsonderzoek NL',
  },
];

interface DutchCyberResilienceHubProps {
  compactOnHome?: boolean;
  onOpenFullResilienceTab?: () => void;
}

export const DutchCyberResilienceHub: React.FC<DutchCyberResilienceHubProps> = ({
  compactOnHome = false,
  onOpenFullResilienceTab,
}) => {
  const [selectedTipCategory, setSelectedTipCategory] = useState<
    'ALL' | 'THUIS_BURGER' | 'MKB_MAAKINDUSTRIE' | 'IT_EN_NIS2'
  >('ALL');
  const [selectedCenterId, setSelectedCenterId] = useState<
    'ALL' | 'HSD_DEN_HAAG' | 'BHOC_BRABANT' | 'CVD_APELDOORN'
  >('ALL');
  const [checkedTips, setCheckedTips] = useState<string[]>([
    'tip-passkeys-mfa',
    'tip-auto-updates',
    'tip-mkb-321-backup',
  ]);

  const toggleCheckTip = (id: string) => {
    setCheckedTips((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredTips = PRACTICAL_CYBER_TIPS.filter((tip) =>
    selectedTipCategory === 'ALL' ? true : tip.category === selectedTipCategory
  );

  const visibleCenters = DUTCH_CYBER_CENTERS.filter((c) =>
    selectedCenterId === 'ALL' ? true : c.id === selectedCenterId
  );

  const progressPercentage = Math.round(
    (checkedTips.length / PRACTICAL_CYBER_TIPS.length) * 100
  );

  return (
    <div className="bg-white border border-emerald-200 rounded-2xl p-4 sm:p-6 shadow-sm space-y-6">
      {/* Positieve Hero Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white text-xs font-mono-code font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>POSITIEVE CYBERWEERBAARHEID &amp; ADVIES NL</span>
            </span>
            <span className="px-2.5 py-1 rounded-full bg-teal-50 text-teal-900 border border-teal-200 text-xs font-mono-code font-semibold">
              HSD Den Haag · Brabant House of Cyber · CVD Apeldoorn
            </span>
          </div>

          <h2 className="text-lg sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
            <span>
              Samen Digitaal Sterk: Nederlandse Kenniscentra &amp; Praktische Tips
            </span>
          </h2>

          <p className="text-sm sm:text-[15px] text-slate-700 max-w-4xl leading-relaxed">
            Cybersecurity gaat niet alleen over dreigingen, maar vooral over{' '}
            <strong className="text-emerald-800">wat u zelf kunt doen om veilig te blijven</strong> en hoe Nederland vooroploopt in digitale samenwerking. Ontdek hieronder de drie toonaangevende Nederlandse cyber-innovatiecentra in{' '}
            <strong className="text-slate-900">Den Haag (Security Delta / HSD)</strong>,{' '}
            <strong className="text-slate-900">Brabant (House of Cyber Eindhoven/Tilburg)</strong> en{' '}
            <strong className="text-slate-900">Apeldoorn (Centrum voor Veiligheid en Digitalisering)</strong>.
          </p>
        </div>

        {/* Positieve Weerbaarheidsmeter */}
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 shrink-0 lg:w-72 space-y-2.5">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="font-bold text-emerald-900 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-700" />
              <span>Weerbaarheid-Checklist</span>
            </span>
            <span className="font-mono-code font-bold text-white bg-emerald-600 px-2.5 py-0.5 rounded-md text-xs">
              {progressPercentage}% Sterk
            </span>
          </div>
          <div className="w-full h-2.5 bg-emerald-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            {checkedTips.length} van de {PRACTICAL_CYBER_TIPS.length} beschermingsstappen afgevinkt. Elke stap maakt verschil!
          </p>
        </div>
      </div>

      {/* DEEL 1: Onderzoek naar de 3 Nederlandse Cyber-Innovatie & Weerbaarheidscentra */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-600" />
              <span>
                De 3 Nederlandse Cyber-Innovatie &amp; Weerbaarheidscentra
              </span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Waar overheid, wetenschap, onderwijs (MBO/HBO/WO), Defensie en bedrijfsleven samen bouwen aan een veilig digitaal Nederland:
            </p>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { id: 'ALL', label: 'Alle 3 Centra' },
              { id: 'HSD_DEN_HAAG', label: '🏛️ Security Delta Den Haag' },
              { id: 'BHOC_BRABANT', label: '🔬 Brabant House of Cyber' },
              { id: 'CVD_APELDOORN', label: '🎓 CVD Apeldoorn' },
            ].map((btn) => (
              <button
                key={btn.id}
                type="button"
                onClick={() => setSelectedCenterId(btn.id as any)}
                className={`min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  selectedCenterId === btn.id
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3 Kolommen met de Kenniscentra */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {visibleCenters.map((center) => {
            const borderClass =
              center.accentColor === 'emerald'
                ? 'border-emerald-200 hover:border-emerald-300'
                : center.accentColor === 'cyan'
                ? 'border-sky-200 hover:border-sky-300'
                : 'border-teal-200 hover:border-teal-300';

            const badgeClass =
              center.accentColor === 'emerald'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : center.accentColor === 'cyan'
                ? 'bg-sky-50 text-sky-800 border-sky-200'
                : 'bg-teal-50 text-teal-800 border-teal-200';

            return (
              <div
                key={center.id}
                className={`bg-slate-50/70 border ${borderClass} rounded-2xl p-4 sm:p-5 flex flex-col justify-between gap-4 shadow-2xs transition-all`}
              >
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span
                        className={`text-xs font-mono-code font-bold px-2.5 py-0.5 rounded-md border ${badgeClass}`}
                      >
                        {center.badgeText}
                      </span>
                      <span className="text-xs font-mono-code text-slate-600">
                        {center.scaleMetric}
                      </span>
                    </div>

                    <h4 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug pt-1">
                      {center.name}
                    </h4>

                    <div className="text-xs sm:text-sm text-emerald-700 font-semibold flex items-center gap-1.5">
                      <Compass className="w-4 h-4 shrink-0" />
                      <span>{center.cityAndRegion}</span>
                    </div>
                  </div>

                  <p className="text-sm text-slate-700 leading-relaxed">
                    {center.missionSummary}
                  </p>

                  <div className="space-y-2 pt-1">
                    <div className="text-xs font-mono-code font-bold text-emerald-800 uppercase tracking-wider">
                      Speerpunten &amp; Onderzoeksprogramma’s:
                    </div>
                    <div className="space-y-2">
                      {center.coreThemes
                        .slice(0, compactOnHome ? 3 : 4)
                        .map((theme, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm"
                          >
                            <div className="font-bold text-slate-900 flex items-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                              <span>{theme.title}</span>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                              {theme.detail}
                            </p>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="text-xs font-mono-code font-bold text-slate-600 uppercase">
                      Samenwerkende Partners:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {center.keyPartners.map((partner) => (
                        <span
                          key={partner}
                          className="text-xs bg-white text-slate-800 px-2.5 py-1 rounded-md border border-slate-200 font-medium"
                        >
                          {partner}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1.5">
                    <div className="text-xs sm:text-sm font-bold text-emerald-900 flex items-center gap-1.5">
                      <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Wat u hier direct aan heeft (Advies &amp; Hulp):</span>
                    </div>
                    <ul className="space-y-1 text-xs sm:text-sm text-slate-800 list-disc list-inside leading-relaxed">
                      {center.practicalBenefitForVisitor.map((benefit, bIdx) => (
                        <li key={bIdx}>{benefit}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 space-y-3">
                  <p className="text-xs sm:text-sm italic text-slate-700 bg-white p-3 rounded-xl border border-slate-200 leading-relaxed">
                    “{center.positiveImpactQuote}”
                  </p>

                  <div className="flex items-center gap-2 flex-wrap">
                    <a
                      href={center.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 min-h-[42px] px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                    >
                      <span>Bezoek {center.shortName}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    {center.secondaryUrl && (
                      <a
                        href={center.secondaryUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="min-h-[42px] px-3 py-2 rounded-xl bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs sm:text-sm font-bold flex items-center gap-1 transition-colors"
                      >
                        <span>{center.secondaryUrlLabel}</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    )}

                    {center.tertiaryUrl && (
                      <a
                        href={center.tertiaryUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="min-h-[42px] px-3 py-2 rounded-xl bg-white hover:bg-sky-50 text-sky-800 border border-sky-200 text-xs sm:text-sm font-bold flex items-center gap-1 transition-colors"
                      >
                        <span>{center.tertiaryUrlLabel}</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DEEL 2: Positief Cybernieuws & Vooruitgang in Nederland */}
      <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-emerald-100 text-emerald-700 border border-emerald-200">
              <HeartHandshake className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                Positieve Ontwikkelingen: Wat gaat er goed in onze digitale verdediging?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                Naast dreigingsmeldingen boekt Nederland elke dag tastbare successen in preventie en samenwerking:
              </p>
            </div>
          </div>
          <span className="text-xs font-mono-code font-bold bg-white text-emerald-800 px-3 py-1 rounded-lg border border-emerald-200">
            🌱 CONSTRUCTIEF &amp; WEERBAAR NL
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {POSITIVE_CYBER_WINS_NL.map((win) => (
            <div
              key={win.id}
              className="p-4 rounded-xl bg-white border border-slate-200 flex flex-col justify-between gap-3 shadow-2xs"
            >
              <div className="space-y-2">
                <span className="inline-block text-xs font-mono-code font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                  {win.badge}
                </span>
                <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                  {win.title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {win.description}
                </p>
              </div>
              <div className="pt-2.5 border-t border-slate-100 text-xs font-mono-code text-emerald-700 font-semibold">
                Bron: {win.source}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DEEL 3: Praktische Tips, Advies & Interactieve Zelf-Checklist */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-600" />
              <span>
                Praktische Tips &amp; Handelingsadvies (Vink af wat u al toepast!)
              </span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Samengesteld op basis van de best practices van NCSC-NL, Digital Trust Center, Security Delta Den Haag, Brabant House of Cyber en CVD Apeldoorn:
            </p>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { id: 'ALL', label: 'Alle Tips (12)' },
              { id: 'THUIS_BURGER', label: '🏠 Thuis, Burgers & ZZP' },
              { id: 'MKB_MAAKINDUSTRIE', label: '🏢 MKB & Maakindustrie' },
              { id: 'IT_EN_NIS2', label: '🛡️ IT-Teams & NIS2' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedTipCategory(tab.id as any)}
                className={`min-h-[38px] px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
                  selectedTipCategory === tab.id
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid met Praktische Tips */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTips
            .slice(0, compactOnHome && selectedTipCategory === 'ALL' ? 6 : filteredTips.length)
            .map((tip) => {
              const isChecked = checkedTips.includes(tip.id);
              return (
                <div
                  key={tip.id}
                  onClick={() => toggleCheckTip(tip.id)}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 shadow-2xs ${
                    isChecked
                      ? 'bg-emerald-50/70 border-emerald-400 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="text-xs font-mono-code font-bold px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {tip.impactBadge}
                      </span>
                      <span className="text-xs font-mono-code text-slate-600">
                        ⏱️ {tip.timeRequired}
                      </span>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="mt-1 w-5 h-5 accent-emerald-600 rounded cursor-pointer shrink-0"
                      />
                      <h4 className="text-sm sm:text-base font-bold leading-snug text-slate-900">
                        {tip.title}
                      </h4>
                    </div>

                    <p className="text-sm text-slate-700 leading-relaxed">
                      {tip.adviceText}
                    </p>

                    <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs sm:text-sm text-slate-800 leading-relaxed">
                      <strong className="text-emerald-800 block mb-0.5">
                        💡 Concrete Stap voor Vandaag:
                      </strong>
                      {tip.actionStep}
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-slate-200 flex items-center justify-between gap-2 text-xs font-mono-code">
                    <span className="text-slate-600 truncate">
                      Advies: <strong className="text-slate-900">{tip.endorsedBy}</strong>
                    </span>
                    <span
                      className={`font-bold shrink-0 ${
                        isChecked ? 'text-emerald-700' : 'text-sky-700'
                      }`}
                    >
                      {isChecked ? '✓ Toegepast!' : '+ Vink af'}
                    </span>
                  </div>
                </div>
              );
            })}
        </div>

        {compactOnHome && onOpenFullResilienceTab && (
          <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200">
            <span className="text-sm text-slate-700">
              Wilt u alle 12 praktische adviezen voor Thuis, MKB en NIS2 én de volledige onderzoeksdossiers van HSD Den Haag, Brabant House of Cyber en CVD Apeldoorn bekijken?
            </span>
            <button
              type="button"
              onClick={onOpenFullResilienceTab}
              className="min-h-[44px] px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center gap-2 shadow-xs transition-colors shrink-0 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Open Volledig Weerbaarheid Portaal</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
