import {
  CalendarDays,
  ChartArea,
  House,
  Library,
  Store,
  UserRound,
} from "lucide-react";

type IconXParam = {
  type: string;
  height: number;
  width: number;
};

export function IconX(param: IconXParam) {
  switch (param.type) {
    case "home":
      return <House height={param.height} width={param.width} />;
    case "calendar":
      return <CalendarDays height={param.height} width={param.width} />;
    case "chart":
      return <ChartArea height={param.height} width={param.width} />;
    case "cart":
      return <Store height={param.height} width={param.width} />;
    case "users":
      return <UserRound height={param.height} width={param.width} />;
    case "info":
      return <Library height={param.height} width={param.width} />;
    default:
      return <House height={param.height} width={param.width} />;
  }
}
