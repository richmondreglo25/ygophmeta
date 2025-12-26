/**
 * Utility to generate a color palette for graphs.
 * Returns an array of hex color strings, cycling if count exceeds palette length.
 * If startColor is provided, generates incremental colors from that color.
 */
function hexToRgb(hex: string): [number, number, number] {
  hex = hex.replace(/^#/, "");
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((x) => x + x)
      .join("");
  }
  const num = parseInt(hex, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
}

function incrementColor(
  [r, g, b]: [number, number, number],
  step: number
): [number, number, number] {
  // Simple increment: rotate hue by step, clamp values
  return [
    Math.min(255, (r + step * 17) % 256),
    Math.min(255, (g + step * 31) % 256),
    Math.min(255, (b + step * 23) % 256),
  ];
}

export function getGraphColors(count: number, startColor?: string): string[] {
  const PALETTE = [
    "#60a5fa",
    "#fbbf24",
    "#34d399",
    "#f87171",
    "#a78bfa",
    "#f472b6",
    "#facc15",
    "#38bdf8",
    "#4ade80",
    "#fca5a5",
    "#6366f1",
    "#22d3ee",
    "#eab308",
    "#ef4444",
    "#10b981",
    "#a3e635",
    "#f43f5e",
    "#818cf8",
    "#fde68a",
    "#c084fc",
  ];

  if (!startColor) {
    return Array.from({ length: count }, (_, i) => PALETTE[i % PALETTE.length]);
  }

  // Generate incremental colors from startColor
  const baseRgb = hexToRgb(startColor);
  return Array.from({ length: count }, (_, i) => {
    const rgb = incrementColor(baseRgb, i);
    return rgbToHex(rgb[0], rgb[1], rgb[2]);
  });
}
