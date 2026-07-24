import { Rarity } from '../types';

/**
 * Single source of truth for rarity styling.
 *
 * Previously the rarity → colour mapping was duplicated (and drifting) across
 * ListingCard, AutocompleteSearch and FilterSidebar. Everything now derives
 * from RARITY_CONFIG so the palette stays consistent.
 */

export const RARITIES: Rarity[] = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythic'];

export interface RarityConfig {
  /** Border colour classes, incl. hover state. */
  border: string;
  /** Hover box-shadow glow class. */
  shadow: string;
  /** Foreground text colour class. */
  text: string;
  /** Faint background tint class. */
  bg: string;
  /** Whether this rarity should pulse/glow (Legendary+). */
  glow: boolean;
}

const RARITY_CONFIG: Record<string, RarityConfig> = {
  common: {
    border: 'border-game-border hover:border-gray-600',
    shadow: 'hover:shadow-glow-common',
    text: 'text-rarity-common',
    bg: 'bg-game-border/30',
    glow: false,
  },
  uncommon: {
    border: 'border-rarity-uncommon hover:border-rarity-uncommon/70',
    shadow: 'hover:shadow-glow-uncommon',
    text: 'text-rarity-uncommon',
    bg: 'bg-rarity-uncommon/10',
    glow: false,
  },
  rare: {
    border: 'border-rarity-rare hover:border-rarity-rare/70',
    shadow: 'hover:shadow-glow-rare',
    text: 'text-rarity-rare',
    bg: 'bg-rarity-rare/10',
    glow: false,
  },
  epic: {
    border: 'border-rarity-epic hover:border-rarity-epic/70',
    shadow: 'hover:shadow-glow-epic',
    text: 'text-rarity-epic',
    bg: 'bg-rarity-epic/10',
    glow: false,
  },
  legendary: {
    border: 'border-rarity-legendary hover:border-rarity-legendary/70',
    shadow: 'hover:shadow-glow-legendary',
    text: 'text-rarity-legendary',
    bg: 'bg-rarity-legendary/10',
    glow: true,
  },
  mythic: {
    border: 'border-rarity-mythic hover:border-rarity-mythic/70',
    shadow: 'hover:shadow-glow-mythic',
    text: 'text-rarity-mythic',
    bg: 'bg-rarity-mythic/10',
    glow: true,
  },
};

/** Full styling config for a rarity. Falls back to Common for unknown values. */
export function getRarityConfig(rarity?: string): RarityConfig {
  return RARITY_CONFIG[(rarity ?? '').toLowerCase()] ?? RARITY_CONFIG.common;
}

/** Just the text colour class for a rarity (used by autocomplete rows). */
export function getRarityTextColor(rarity?: string): string {
  if (!rarity) return 'text-gray-400';
  return getRarityConfig(rarity).text;
}

/** Toggle-button styling for the rarity multi-select in the filter sidebar. */
export function getRarityBadgeStyle(rarity: Rarity, isChecked: boolean): string {
  if (!isChecked) return 'border-game-border bg-game-card/50 text-gray-400 hover:border-gray-600';
  const conf = getRarityConfig(rarity);
  return `${conf.border.split(' ')[0]} ${conf.bg} ${conf.text} font-bold`;
}
