/**
 * Banlist card types.
 * Based on Yu-Gi-Oh! card classifications.
 */
export enum BanlistCardTypes {
  NormalMonster = "Normal Monster",
  EffectMonster = "Effect Monster",
  FusionMonster = "Fusion Monster",
  RitualMonster = "Ritual Monster",
  SynchroMonster = "Synchro Monster",
  XYZMonster = "XYZ Monster",
  PendulumMonster = "Pendulum Monster",
  LinkMonster = "Link Monster",
  Spell = "Spell Card",
  Trap = "Trap Card",
}

/**
 * Banlist format types.
 * "ocg" - Official Card Game (Japan)
 * "ae" - Asian English
 * "tcg" - Trading Card Game (International)
 */
export type BanlistFormat = "ocg" | "ae" | "tcg";

/**
 * Banlist card structure.
 */
export type BanlistCard = {
  name: string;
  type: BanlistCardTypes;
};

/**
 * Banlist section structure.
 */
export type BanlistSection = {
  title: string;
  cards: BanlistCard[];
};

/**
 * Banlist data structure.
 * An array of banlist formats, each containing sections of banned/restricted cards.
 */
export type Banlist = {
  format: BanlistFormat;
  effectiveFrom: string;
  list: BanlistSection[];
}[];
