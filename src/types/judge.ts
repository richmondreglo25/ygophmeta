import { Gender } from "@/enums/gender";

export type Judge = {
  name: string;
  ign: string;
  imagePath: string;
  gender: Gender;
  city: string;
  team: string;
  deck: string[];
  others: string;
};
