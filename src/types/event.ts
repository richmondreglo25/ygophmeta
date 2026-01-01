export type EventDesc = {
  name: string;
  desc: number | string;
};

export type EventWinner = {
  name: string;
  position: number;
  deck: string;
  deckImagePath: string;
};

export type EventDeck = {
  name: string;
  count: number;
};

export type Event = {
  id: string;
  title: string;
  host: string;
  when: string;
  where: string;
  format: string;
  official: boolean;
  rounds?: number;
  images?: string[];
  winners: EventWinner[];
  decks: EventDeck[];
  notes?: string;
};
