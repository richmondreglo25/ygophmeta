import {
  CalendarDays,
  ChartArea,
  Cog,
  Gavel,
  House,
  Library,
  Logs,
  MapPin,
  Network,
  Store,
  UserRound,
  UsersRound,
} from "lucide-react";

type IconXParam = {
  type: string;
  size: number;
};

export function IconX(param: IconXParam) {
  switch (param.type) {
    case "home":
      return <House size={param.size} width={param.size} />;
    case "calendar":
      return <CalendarDays size={param.size} />;
    case "chart":
      return <ChartArea size={param.size} />;
    case "shops":
      return <Store size={param.size} />;
    case "community":
      return <UsersRound size={param.size} />;
    case "players":
      return <UserRound size={param.size} />;
    case "judges":
      return <Gavel size={param.size} />;
    case "info":
      return <Library size={param.size} />;
    case "host":
      return <Network size={param.size} />;
    case "when":
      return <CalendarDays size={param.size} />;
    case "where":
      return <MapPin size={param.size} />;
    case "settings":
      return <Cog size={param.size} />;
    case "rounds":
      return <Logs size={param.size} />;
    default:
      return <House size={param.size} />;
  }
}
