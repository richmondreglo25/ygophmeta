import clsx from "clsx";
import { BanlistCardTypes } from "@/types/banlist";

const typeBadgeClassMap: Record<string, string> = {
  [BanlistCardTypes.NormalMonster]:
    "bg-yellow-200 text-yellow-900 border border-yellow-400",
  [BanlistCardTypes.EffectMonster]:
    "bg-orange-200 text-orange-900 border border-orange-400",
  [BanlistCardTypes.FusionMonster]:
    "bg-purple-200 text-purple-900 border border-purple-400",
  [BanlistCardTypes.RitualMonster]:
    "bg-blue-200 text-blue-900 border border-blue-400",
  [BanlistCardTypes.SynchroMonster]:
    "bg-gray-200 text-gray-900 border border-gray-400",
  [BanlistCardTypes.XYZMonster]: "bg-black text-white border border-gray-700",
  [BanlistCardTypes.LinkMonster]:
    "bg-blue-900 text-white border border-blue-700",
  [BanlistCardTypes.PendulumMonster]:
    "bg-green-200 text-green-900 border border-green-400",
  [BanlistCardTypes.Spell]:
    "bg-green-300 text-green-900 border border-green-500",
  [BanlistCardTypes.Trap]: "bg-pink-200 text-pink-900 border border-pink-400",
};

export function getBadgeClass(type: string): string {
  return clsx(
    "inline-block px-2 rounded text-xs font-semibold",
    typeBadgeClassMap[type] || "bg-gray-300 text-black"
  );
}
