export const colors = {
  guide: {
    badge: "bg-violet-100 text-violet-700",
  },
  event: {
    badge: "bg-yellow-100 text-yellow-700",
  },
  shop: {
    badge: "bg-purple-100 text-purple-700",
  },
  player: {
    badge: "bg-green-100 text-green-700",
  },
  judge: {
    badge: "bg-blue-100 text-blue-700",
  },
  video: {
    badge: "bg-red-100 text-red-700",
  },
  default: {
    badge: "bg-gray-100 text-gray-700",
  },
};

function getColor(type: string, key: keyof (typeof colors)["default"]) {
  const colorType = type as keyof typeof colors;
  return colors[colorType]?.[key] ?? colors.default[key];
}

export const getTypeBadgeClass = (t: string) => getColor(t, "badge");
