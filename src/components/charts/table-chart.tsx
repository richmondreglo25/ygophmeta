"use client";

import { EventDeck } from "@/columns/events";

/**
 * Calculate deck percentage.
 * @param count number of decks.
 * @param total total number of decks.
 * @returns Percentage string.
 */
function getDeckPercentage(count: number, total: number): string {
  if (total === 0) return "—";
  return ((count / total) * 100).toFixed(1) + "%";
}

type TableChartProps = {
  decks: EventDeck[];
};

export function TableChart({ decks }: TableChartProps) {
  // Calculate total number of decks.
  const total = decks.reduce(
    (acc: number, deck: EventDeck) => acc + deck.count,
    0
  );

  // Sort decks by count descending, then by name ascending.
  const sortedDecks = [...decks].sort((a, b) =>
    b.count !== a.count ? b.count - a.count : a.name.localeCompare(b.name)
  );

  return (
    <div
      id="data-table-wrapper"
      className="border rounded-sm overflow-auto max-h-[35vh]"
    >
      <table id="data-table" className="w-full caption-bottom text-sm">
        <thead>
          <tr className="border-b transition-colors hover:bg-muted/50">
            <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground cursor-pointer select-none">
              Deck
            </th>
            <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground cursor-pointer select-none">
              Count
            </th>
            <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground cursor-pointer select-none">
              Percentage
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedDecks.map((deck: EventDeck, index: number) => (
            <tr
              key={index}
              className="text-sm border-b last:border-b-0 hover:bg-gray-50 transition"
            >
              <td>
                <span className="whitespace-nowrap">{deck.name}</span>
              </td>
              <td>{deck.count}</td>
              <td>{getDeckPercentage(deck.count, total)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
