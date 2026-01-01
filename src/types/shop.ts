export type Shop = {
  name: string;
  logo: string;
  images: string[];
  address: string;
  googleMaps: string;
  openHours: string;
  tournamentSchedule: { day: string; time: string; event: string }[];
  accolades: string[];
  activePlayers: number;
  about: string;
};
