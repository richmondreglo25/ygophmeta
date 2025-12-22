/* eslint-disable @typescript-eslint/no-explicit-any */
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import fs from "fs";
import path from "path";
import {
  Calendar,
  ChartArea,
  Medal,
  NotebookText,
  ScrollText,
  Slash,
} from "lucide-react";
import { EventDeck, EventWinner } from "@/columns/events";
import { getImagePath } from "@/utils/enviroment";

export async function generateStaticParams() {
  const eventsDir = path.join(process.cwd(), "public/data/events");
  const files = fs
    .readdirSync(eventsDir)
    .filter((file) => file.endsWith(".json"));

  const allEvents: any[] = [];
  const seenIds = new Set<string>();

  files.forEach((file) => {
    const filePath = path.join(eventsDir, file);
    const content = fs.readFileSync(filePath, "utf8");
    const events = JSON.parse(content);

    events.forEach((event: any) => {
      if (!seenIds.has(event.id)) {
        seenIds.add(event.id);
        allEvents.push(event);
      }
    });
  });

  return allEvents.map((event) => ({
    id: event.id,
  }));
}

async function getEvent(id: string) {
  const eventsDir = path.join(process.cwd(), "public/data/events");
  const files = fs
    .readdirSync(eventsDir)
    .filter((file) => file.endsWith(".json"));

  for (const file of files) {
    const filePath = path.join(eventsDir, file);
    const content = fs.readFileSync(filePath, "utf8");
    const events = JSON.parse(content);

    const event = events.find((e: any) => e.id === id);
    if (event) return event;
  }

  return null;
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getEvent(id);

  if (!event) {
    notFound();
  }

  const details = [
    { label: "Host", value: event.host },
    { label: "When", value: event.when },
    { label: "Where", value: event.where },
    event.decks &&
      event.decks.length > 0 && {
        label: "Participants",
        value: event.decks.reduce(
          (acc: number, deck: { count: number }) => acc + deck.count,
          0
        ),
      },
    event.format && { label: "Format", value: event.format },
    event.rounds && { label: "Rounds", value: event.rounds },
  ].filter(Boolean);

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex justify-between gap-1.5">
        <h1 className="flex flex-row items-center gap-2 font-semibold py-5 ">
          <Calendar size={12} />
          <span>{event.title}</span>
        </h1>
        <Link
          href="/events"
          className="flex items-center hover:underline font-medium text-sm"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </Link>
      </div>
      {/* Content */}
      <div className="flex flex-col gap-6">
        {/* Event Images */}
        {event.images && event.images.length > 0 && (
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-1 gap-3">
              {event.images.map((imagePath: string, index: number) => (
                <Image
                  key={index}
                  src={getImagePath(imagePath)}
                  alt={`Event Image ${index + 1}`}
                  loading="lazy"
                  width={300}
                  height={200}
                  className="text-sm rounded flex-1 object-cover border h-full w-full max-h-[40vh]"
                />
              ))}
            </div>
          </div>
        )}

        {/* Event Details */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-1 text-xs font-normal italic">
            <ScrollText size={10} />
            <span>Event details</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {details.map((item) => (
              <Card
                key={item.label}
                className="flex flex-col p-0 rounded-none border-[1px] shadow-none"
              >
                <CardHeader className="p-3 pb-1">
                  <CardTitle className="text-md flex justify-between items-center gap-2">
                    <div className="flex items-center gap-2">{item.label}</div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm p-3 pt-0 flex-1">
                  {item.value}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Notes */}
        {event.notes && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-1 text-xs font-normal italic">
              <NotebookText size={10} />
              <span>Notes</span>
            </div>
            {event.notes && <span className="text-sm">{event.notes}</span>}
          </div>
        )}

        {/* Winners */}
        {event.winners && event.winners.length > 0 && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-1 text-xs font-normal italic">
              <Medal size={10} />
              <span>Winners</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {event.winners.map((winner: EventWinner, index: number) => {
                const badgeColor =
                  index === 0
                    ? "bg-yellow-400 text-white border-yellow-400"
                    : index === 1
                    ? "bg-gray-300 text-gray-900 border-gray-300"
                    : index === 2
                    ? "bg-amber-700 text-white border-amber-700"
                    : "bg-gray-200 text-gray-600 border-gray-300";
                return (
                  <div
                    key={index}
                    className="flex flex-col justify-start items-start gap-3 text-sm font-semibold"
                  >
                    <div className="flex flex-row gap-2 items-center">
                      <span
                        className={`text-xs px-3 py-0.5 border font-semibold ${badgeColor}`}
                      >
                        {getOrdinal(winner.position)}
                      </span>
                      <span>{winner.name}</span>
                      <Slash size={10} />
                      <span>{winner.deck}</span>
                    </div>
                    {winner.deckImagePath && (
                      <Image
                        src={getImagePath(winner.deckImagePath)}
                        alt={winner.deck}
                        loading="lazy"
                        width={100}
                        height={100}
                        className="text-sm rounded flex-1 object-cover border h-full w-full"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Decks Summary */}
        {event.decks && event.decks.length > 0 && (
          <DecksSummaryTable decks={event.decks} />
        )}
      </div>
    </div>
  );
}
/**
 * Get ordinal suffix for a number.
 * @param n - The number to get the ordinal for.
 * @returns The number with its ordinal suffix.
 */
function getOrdinal(n: number): string {
  const j = n % 10;
  const k = n % 100;
  if (j == 1 && k != 11) return n + "st";
  if (j == 2 && k != 12) return n + "nd";
  if (j == 3 && k != 13) return n + "rd";
  return n + "th";
}

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

/**
 * Decks Summary Table Component.
 * @param decks - Array of EventDeck objects.
 * @returns JSX Element displaying the decks summary table.
 */
function DecksSummaryTable({ decks }: { decks: EventDeck[] }) {
  // Calculate total count
  const total = decks.reduce(
    (acc: number, deck: EventDeck) => acc + deck.count,
    0
  );
  // Sort decks by count descending
  const sortedDecks = [...decks].sort((a, b) => b.count - a.count);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-1 text-xs font-normal italic">
        <ChartArea size={10} />
        <span>Decks Summary</span>
      </div>
      <div id="data-table-wrapper" className="overflow-auto border">
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
    </div>
  );
}
