import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import fs from "fs";
import path from "path";
import {
  Calendar,
  ChartArea,
  ChevronRight,
  Medal,
  NotebookText,
  ScrollText,
  Slash,
} from "lucide-react";
import { Event, EventDeck, EventWinner } from "@/types/event";
import { getEventImagePath, getImagePath } from "@/utils/enviroment";
import { IconX } from "@/components/IconX";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { ChartPie } from "@/components/charts/pie-chart";
import { getGraphColors } from "@/utils/colors";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TableChart } from "@/components/charts/table-chart";
import playersData from "@/../public/data/players.json"; // Import players.json
import { Player } from "@/types/player";

export async function generateStaticParams() {
  const eventsDir = path.join(process.cwd(), "public/data/events");
  const files = fs
    .readdirSync(eventsDir)
    .filter((file) => file.endsWith(".json"));

  const allEvents: Event[] = [];
  const seenIds = new Set<string>();

  files.forEach((file) => {
    const filePath = path.join(eventsDir, file);
    const content = fs.readFileSync(filePath, "utf8");
    const events = JSON.parse(content);

    events.forEach((event: Event) => {
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

    const event = events.find((e: Event) => e.id === id);
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

  // Create a lookup by player name (case-insensitive)
  const playersByName = Object.fromEntries(
    (playersData as Player[]).map((p) => [p.name.toLowerCase(), p])
  );

  const details = [
    { label: "Host", value: event.host, icon: "host" },
    { label: "When", value: event.when, icon: "when" },
    { label: "Where", value: event.where, icon: "where" },
    event.decks &&
      event.decks.length > 0 && {
        label: "Participants",
        value: event.decks.reduce(
          (acc: number, deck: { count: number }) => acc + deck.count,
          0
        ),
        icon: "players",
      },
    {
      label: "Format",
      value: `${event.format} ${
        event.official ? "(Official)" : "(Unofficial)"
      }`,
      icon: "settings",
    },
    event.rounds && { label: "Rounds", value: event.rounds, icon: "rounds" },
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
          className="flex items-center text-blue-600 hover:underline font-medium text-sm "
        >
          <span>Back</span>
          <ChevronRight size={14} />
        </Link>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-6">
        {/* Event Images */}
        {event.images && event.images.length > 0 && (
          <div className="flex flex-col gap-3">
            {event.images.map((imagePath: string, index: number) => (
              <Avatar
                key={index}
                className="text-sm rounded border w-full max-h-[40vh] overflow-hidden flex items-center justify-center bg-white"
              >
                <AvatarImage
                  src={getEventImagePath(event.id, imagePath)}
                  alt={`Event Image ${index + 1}`}
                  loading="lazy"
                  className="object-cover w-full h-full block"
                  style={{
                    maxHeight: "40vh",
                    minHeight: 200,
                    objectFit: "cover",
                    width: "100%",
                  }}
                />
                <AvatarFallback className="flex justify-center items-center text-xs font-normal italic h-full w-full p-5">
                  Unable to load image
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
        )}

        {/* Event Details */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-1 text-xs font-normal italic">
            <ScrollText size={10} />
            <span>Event details</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {details.map((item) => (
              <Card
                key={item.label}
                className="flex flex-col p-0 rounded-sm border-[1px] shadow-none"
              >
                <CardHeader className="p-3 pb-1">
                  <CardTitle className="text-sm flex justify-between items-center gap-2">
                    <div className="flex items-center gap-1">
                      <IconX type={item.icon} size={11} />
                      <span>{item.label}</span>
                    </div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 gap-y-5">
              {event.winners.map((winner: EventWinner, index: number) => {
                const badgeColor =
                  index === 0
                    ? "bg-yellow-400 text-white border-yellow-400"
                    : index === 1
                    ? "bg-gray-300 text-gray-900 border-gray-300"
                    : index === 2
                    ? "bg-amber-700 text-white border-amber-700"
                    : "bg-gray-200 text-gray-600 border-gray-300";

                // Find player by name (case-insensitive)
                const player =
                  playersByName[winner.name?.toLowerCase?.() || ""];

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
                    {player && (
                      <div className="flex flex-col items-center justify-center bg-gradient-to-b from-[#E3E8F0] to-[#F3F5F8] h-full w-full p-5 rounded-sm">
                        <Avatar
                          key={player.name}
                          className="flex justify-center items-center"
                        >
                          <AvatarImage
                            src={getImagePath(player.imagePath)}
                            alt={player.name}
                            loading="lazy"
                            className="object-cover rounded-full h-[150px] w-[150px] border-4 border-white shadow-lg"
                          />
                          <AvatarFallback className="flex justify-center items-center text-xs font-normal italic h-full w-full p-5">
                            Unable to load player image
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    )}
                    {!player && (
                      <div className="flex justify-center items-center text-xs font-normal italic h-full w-full p-5 border rounded-sm">
                        Player profile not found
                      </div>
                    )}
                    {winner.deckImagePath && (
                      <Avatar className="text-sm rounded flex-1 object-contain border h-full w-full">
                        <AvatarImage
                          src={getEventImagePath(
                            event.id,
                            winner.deckImagePath
                          )}
                          alt={winner.deck}
                          loading="lazy"
                          className="flex justify-center items-center h-full w-full object-contain"
                        />
                        <AvatarFallback className="flex justify-center items-center text-xs font-normal italic h-full w-full p-5">
                          Unable to load deck image
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Decks Summary */}
        {event.decks && event.decks.length > 0 && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-1 text-xs font-normal italic">
              <ChartArea size={10} />
              <span>Decks Summary</span>
            </div>
            <DeckSummaryPieChart decks={event.decks} />
            <Accordion
              type="single"
              collapsible
              defaultValue="decks-summary-table"
            >
              <AccordionItem value="decks-summary-table">
                <AccordionTrigger>Decks Summary Table</AccordionTrigger>
                <AccordionContent>
                  <TableChart decks={event.decks} />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
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
 * Deck Summary Pie Chart Component.
 * @param decks - Array of EventDeck objects.
 * @returns JSX Element displaying the deck summary pie chart.
 */
function DeckSummaryPieChart({ decks }: { decks: EventDeck[] }) {
  // Sort decks by count descending
  const sortedDecks = [...decks].sort((a, b) =>
    b.count !== a.count ? b.count - a.count : a.name.localeCompare(b.name)
  );

  // Generate pie chart data from decks, label as "<Deck name> (count)"
  const pieData = sortedDecks.map((deck) => ({
    name: deck.name,
    value: deck.count,
  }));

  // Generate config with color cycling.
  const COLORS = getGraphColors(pieData.length, "#2563eb");

  const pieConfig = pieData.reduce((acc, item, idx) => {
    acc[item.name] = {
      color: COLORS[idx % COLORS.length],
      label: `${item.name} (${item.value})`,
    };
    return acc;
  }, {} as Record<string, { color: string; label: string }>);

  return (
    <ChartPie
      data={pieData}
      config={pieConfig}
      dataKey="value"
      nameKey="name"
      title={`Deck Distribution (Total: ${decks.reduce(
        (acc, deck) => acc + deck.count,
        0
      )})`}
      description="Distribution of decks used by participants."
      maxItems={10}
    />
  );
}
