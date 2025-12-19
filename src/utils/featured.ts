export const typeColors = {
  shop: {
    badge: "bg-blue-100 text-blue-700",
    description: "text-blue-700",
    link: "text-blue-600",
  },
  event: {
    badge: "bg-green-100 text-green-700",
    description: "text-green-700",
    link: "text-green-600",
  },
  video: {
    badge: "bg-red-100 text-red-700",
    description: "text-red-700",
    link: "text-red-600",
  },
  player: {
    badge: "bg-yellow-100 text-yellow-700",
    description: "text-yellow-700",
    link: "text-yellow-600",
  },
  judge: {
    badge: "bg-purple-100 text-purple-700",
    description: "text-purple-700",
    link: "text-purple-600",
  },
  default: {
    badge: "bg-gray-100 text-gray-700",
    description: "text-gray-700",
    link: "text-blue-600",
  },
};

function getColor(type: string, key: keyof (typeof typeColors)["default"]) {
  const colorType = type as keyof typeof typeColors;
  return typeColors[colorType]?.[key] ?? typeColors.default[key];
}

export const getTypeBadgeClass = (t: string) => getColor(t, "badge");
export const getDescriptionClass = (t: string) => getColor(t, "description");
export const getLinkClass = (t: string) => getColor(t, "link");
