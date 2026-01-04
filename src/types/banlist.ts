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

export type BanlistCard = {
  name: string;
  type: BanlistCardTypes;
};

export type BanlistSection = {
  title: string;
  cards: BanlistCard[];
};

export type BanlistData = {
  ocg: BanlistSection[];
  tcg: BanlistSection[];
};
