export type FeedbackCategory =
  | 'VRAAG_DREIGING'       // Vraag over specifieke dreiging, actor of IoC
  | 'MELDING_INCIDENT'     // Melding verdachte activiteit, darkweb lek of phishing
  | 'NIS2_ADVIES'          // Vraag over NIS2 richtlijn, zorgplicht of vitale ketens
  | 'FEEDBACK_PLATFORM'    // Suggestie, vraag over het platform of domein
  | 'OVERIG';              // Algemene vraag

export type FeedbackStatus = 'NIEUW' | 'IN_BEHANDELING' | 'BEANTWOORD' | 'GEARCHIVEERD';

export interface AdminReply {
  repliedAt: string;
  repliedAtFormatted: string;
  replyText: string;
  repliedBy: string; // e.g. "Beheerder Bedreigingsmonitor"
  isAiGenerated?: boolean;
}

export interface FeedbackMessage {
  id: string; // e.g. "BM-VRAAG-8492"
  name: string;
  email: string;
  organization?: string;
  category: FeedbackCategory;
  subject: string;
  message: string;
  threatReference?: string; // Optionele id of titel van gerelateerde dreiging
  createdAt: string; // ISO string
  createdAtFormatted: string;
  status: FeedbackStatus;
  adminReply?: AdminReply;
  adminNotes?: string;
}

export const FEEDBACK_CATEGORIES: { id: FeedbackCategory; label: string; icon: string; description: string }[] = [
  {
    id: 'VRAAG_DREIGING',
    label: 'Vraag over Dreiging of IoC',
    icon: '🛡️',
    description: 'Vragen over ransomware-aanvallen, APT-groepen, CVE kwetsbaarheden of IoC hashes.',
  },
  {
    id: 'MELDING_INCIDENT',
    label: 'Melding Incident / Verdachte Activiteit',
    icon: '🚨',
    description: 'Direct melden van een ontdekt lek, phishingcampagne of verdachte darkweb vermelding.',
  },
  {
    id: 'NIS2_ADVIES',
    label: 'NIS2 & Vitale Infrastructuur',
    icon: '🏛️',
    description: 'Vragen over NIS2 zorgplicht, meldplicht en ketenbeveiliging voor Nederlandse organisaties.',
  },
  {
    id: 'FEEDBACK_PLATFORM',
    label: 'Platform / Domein Feedback',
    icon: '💡',
    description: 'Suggesties voor datafeeds, functies of koppelingen op bedreigingsmonitor.nl.',
  },
  {
    id: 'OVERIG',
    label: 'Algemene Vraag',
    icon: '💬',
    description: 'Overige vragen voor de analist of beheerder.',
  },
];
