import { Gender } from "@/enums/gender";

export type Player = {
  name: string;
  ign: string;
  imagePath: string;
  gender: Gender;
  city: string;
  team: string;
  deck: string[];
  others: string;
};
