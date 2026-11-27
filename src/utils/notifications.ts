import { NotificationSettings, NotificationTier, ThreatItem, ThreatSeverity } from '../types/threat';

// Default notification settings with tiered support
export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  pushEnabled: false,
  soundEnabled: false,
  enableTier1: true,
  enableTier2: true,
  enableTier3: true,
  tier1Sound: true,
  tier2Sound: true,
  tier3Sound: true,
  notifyOnRussia: true,
  notifyOnChina: true,
  notifyOnNorthKorea: true,
  notifyOnIran: true,
  notifyOnDarkweb: true,
  vitalInfraOnly: false,
  minSeverity: 'HOOG',
  requireMultiSourceVerification: false,
  liveSimulationActive: false,
};

const SETTINGS_KEY = 'threatwatch_nl_notification_settings_v3_disabled';

export function getStoredSettings(): NotificationSettings {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('threatwatch_nl_notification_settings');
      localStorage.removeItem('threatwatch_nl_notification_settings_v2');
    }
  } catch {
    // ignore
  }
  return {
    ...DEFAULT_NOTIFICATION_SETTINGS,
    pushEnabled: false,
    soundEnabled: false,
    liveSimulationActive: false,
  };
}

export function saveStoredSettings(_settings: NotificationSettings): void {
  // Push notification popups are permanently disabled
}

// Web Audio API Synthesizer - Cyber Alert Sounds per Tier
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Play distinct acoustic cues for each notification tier:
 * - Tier 1: Acute Klaxon Siren (Dutch Vital Infrastructure under attack)
 * - Tier 2: Double Electronic Warble (European-wide ransomware impact)
 * - Tier 3: Digital Sonar Pulse (Dark web chatter / emerging Russian or Chinese discussions)
 */
export function playTierSound(tier: NotificationTier): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    if (tier === 'TIER_1_NL_VITAAL') {
      // Urgent Emergency Dual-Tone Klaxon Siren
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'square';

      // Pulse 1
      osc1.frequency.setValueAtTime(950, now);
      osc1.frequency.exponentialRampToValueAtTime(440, now + 0.18);
      osc1.frequency.setValueAtTime(950, now + 0.22);
      osc1.frequency.exponentialRampToValueAtTime(320, now + 0.45);

      osc2.frequency.setValueAtTime(980, now);
      osc2.frequency.exponentialRampToValueAtTime(490, now + 0.18);
      osc2.frequency.setValueAtTime(980, now + 0.22);
      osc2.frequency.exponentialRampToValueAtTime(360, now + 0.45);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.5);
      osc2.stop(now + 0.5);
    } else if (tier === 'TIER_2_EUROPA') {
      // Tactical European Double Alert Ping
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'triangle';
      osc2.type = 'sine';

      osc1.frequency.setValueAtTime(587.33, now); // D5
      osc1.frequency.setValueAtTime(880, now + 0.1); // A5
      osc1.frequency.setValueAtTime(1174.66, now + 0.2); // D6

      osc2.frequency.setValueAtTime(659.25, now);
      osc2.frequency.setValueAtTime(987.77, now + 0.1);

      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.35);
      osc2.stop(now + 0.35);
    } else {
      // Tier 3: Subtle Sub-Surface Darkweb Sonar Ping
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(650, now);
      osc.frequency.exponentialRampToValueAtTime(1318.51, now + 0.14); // E6 ping

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.005, now + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.22);
    }
  } catch (err) {
    console.warn('Kon audio alarm niet afspelen:', err);
  }
}

export function playAlertSound(severity: ThreatSeverity = 'KRITIEK'): void {
  if (severity === 'KRITIEK') {
    playTierSound('TIER_1_NL_VITAAL');
  } else if (severity === 'HOOG') {
    playTierSound('TIER_2_EUROPA');
  } else {
    playTierSound('TIER_3_DARKWEB_CHATTER');
  }
}

/**
 * Request browser push notification permission
 */
export async function requestPushPermission(): Promise<NotificationPermission> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied';
  }

  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (err) {
    console.error('Fout bij aanvragen push-permissie:', err);
    return 'denied';
  }
}

export function isPushSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function getPushPermissionState(): NotificationPermission {
  if (!isPushSupported()) return 'denied';
  return Notification.permission;
}

export function sendTieredThreatPushNotification(_threat: ThreatItem, _settings?: NotificationSettings): boolean {
  // Push notification popups removed per user request
  return false;
}

