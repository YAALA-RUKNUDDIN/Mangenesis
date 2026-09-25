/**
 * MANGENESIS Design Tokens
 * Strict enterprise mining intelligence color palette, typography, spacing, and elevation.
 */

export const TOKENS = {
  colors: {
    // Foundation: Deep charcoal / near-black
    bg: {
      base: '#07090E',
      surface: '#0D111A',
      card: '#121824',
      cardElevated: '#172030',
      overlay: 'rgba(7, 9, 14, 0.85)',
      input: '#0F1522',
    },
    // Engineering borders
    border: {
      subtle: '#1C2536',
      default: '#243046',
      strong: '#334462',
      focus: '#0EA5E9',
    },
    // Text / Foreground
    text: {
      primary: '#F8FAFC',
      secondary: '#94A3B8',
      muted: '#64748B',
      inverse: '#07090E',
    },
    // Primary mineral accent: Amber / Gold (Manganese & economic ore)
    mineral: {
      DEFAULT: '#F59E0B',
      hover: '#D97706',
      subtle: 'rgba(245, 158, 11, 0.12)',
      border: 'rgba(245, 158, 11, 0.3)',
      text: '#FBBF24',
    },
    // Intelligence accent: Controlled blue / cyan (Satellite & AI signals)
    intelligence: {
      DEFAULT: '#0EA5E9',
      hover: '#0284C7',
      subtle: 'rgba(14, 165, 233, 0.12)',
      border: 'rgba(14, 165, 233, 0.3)',
      text: '#38BDF8',
    },
    // Status colors: Only for functional state (healthy, warning, critical)
    status: {
      healthy: '#10B981',
      healthyBg: 'rgba(16, 185, 129, 0.12)',
      healthyBorder: 'rgba(16, 185, 129, 0.25)',
      warning: '#F59E0B',
      warningBg: 'rgba(245, 158, 11, 0.12)',
      warningBorder: 'rgba(245, 158, 11, 0.25)',
      critical: '#EF4444',
      criticalBg: 'rgba(239, 68, 68, 0.12)',
      criticalBorder: 'rgba(239, 68, 68, 0.25)',
      neutral: '#64748B',
      neutralBg: 'rgba(100, 116, 139, 0.12)',
      neutralBorder: 'rgba(100, 116, 139, 0.25)',
    },
    // UNFC 1997/2009 Classification Colors
    unfc: {
      measured: '#10B981',   // UNFC 111 (High confidence)
      indicated: '#F59E0B',  // UNFC 122 (Moderate confidence)
      inferred: '#64748B',   // UNFC 333 (Low confidence)
      exploration: '#8B5CF6',// Exploration target
    },
  },
  spacing: {
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    8: '32px',
    10: '40px',
    12: '48px',
    16: '64px',
    20: '80px',
    24: '96px',
  },
  radius: {
    control: '8px',
    card: '12px',
    surface: '16px',
    full: '9999px',
  },
};
