"use client";

import { useMemo } from "react";
import type { Event } from "@/types/event";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Crown, Slash } from "lucide-react";
import { getImagePath } from "@/utils/enviroment";
import { Player } from "@/types/player";
import { getBadgeClass } from "@/utils/featured";

/**
 * WinnerCardProps defines the props for the WinnerCard component.
 */
type WinnerCardProps = {
  winner: WinnerDisplay;
};

/**
 * WinnerDisplay defines the structure for displaying a winner.
 */
type WinnerDisplay = {
  name: string;
  deck: string;
  event: string;
  host: string;
  date: string;
  format: string;
  official: boolean;
  playerImage?: string;
  deckImage?: string;
};

/**
 * RecentWinnersProps defines the props for the RecentWinners component.
 */
type RecentWinnersProps = {
  events: Event[];
  players: Player[];
};

/**
 * WinnerCard displays a single winner's information.
 * @param winner WinnerDisplay object.
 * @returns JSX.Element.
 */
function WinnerCard({ winner }: WinnerCardProps) {
  return (
    <div className="flex flex-col justify-start items-start gap-3 text-sm font-semibold border rounded-sm p-4">
      {/* Position, Name, Deck. */}
      <div className="flex flex-row gap-2 items-center">
        <Crown size={14} className="text-yellow-500" />
        <span>{winner.name}</span>
        <Slash size={10} />
        <span>{winner.deck}</span>
      </div>

      {/* Player Image. */}
      {winner.playerImage ? (
        <div className="flex flex-col items-center justify-center bg-gradient-to-b from-[#E3E8F0] to-[#F3F5F8] h-full w-full p-5 rounded-sm">
          <Avatar className="flex justify-center items-center">
            <AvatarImage
              src={winner.playerImage}
              alt={winner.name}
              loading="lazy"
              className="object-cover rounded-full h-[100px] w-[100px] border-4 border-white shadow-lg"
            />
            <AvatarFallback className="flex justify-center items-center text-xs font-normal italic h-full w-full p-5">
              Unable to load player image.
            </AvatarFallback>
          </Avatar>
        </div>
      ) : (
        <div className="flex justify-center items-center text-xs font-normal italic h-full w-full p-5 border rounded-sm">
          Player profile not found.
        </div>
      )}

      {/* Deck image. */}
      {winner.deckImage && (
        <Avatar className="text-sm rounded-sm flex-1 object-contain border h-full w-full">
          <AvatarImage
            src={winner.deckImage}
            alt={winner.deck}
            loading="lazy"
            className="flex justify-center items-center h-full w-full object-contain"
          />
          <AvatarFallback className="flex justify-center items-center text-xs font-normal italic h-full w-full p-5">
            Unable to load deck image.
          </AvatarFallback>
        </Avatar>
      )}

      {/* Event and meta info. */}
      <div className="flex flex-col gap-1 w-full">
        <div className="flex flex-row justify-between gap-5">
          <span>{winner.host}</span>
          <div className="flex flex-row gap-2 items-center">
            <span
              className={`text-xs capitalize px-2 py-0.5 rounded-sm ${getBadgeClass(
                "guide"
              )}`}
            >
              {winner.format}
            </span>
            <span
              className={`text-xs capitalize px-2 py-0.5 rounded-sm ${getBadgeClass(
                winner.official ? "official" : "unofficial"
              )}`}
            >
              {winner.official ? "Official" : "Unofficial"}
            </span>
          </div>
        </div>
        <div className="flex flex-row justify-between gap-5">
          <span>{winner.event}</span>
          <span className="text-xs text-muted-foreground">
            ({new Date(winner.date).toLocaleDateString()})
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * RecentWinners displays winners from the last 2 weeks, 2 per row.
 * @param props RecentWinnersProps.
 * @returns JSX.Element.
 */
export function RecentWinners({ events, players }: RecentWinnersProps) {
  // Get winners from last 2 weeks.
  const winners = useMemo<WinnerDisplay[]>(() => {
    const now = new Date();
    const from = new Date(now);
    from.setDate(now.getDate() - 10);

    // Collect winners.
    const result: WinnerDisplay[] = [];

    // Iterate through events and collect winners.
    events.forEach((event) => {
      const eventDate = event.when ? new Date(event.when) : null;
      if (!eventDate || eventDate < from) return;
      (event.winners || [])
        .filter((w) => w.position === 1)
        .forEach((winner, idx) => {
          // Find player image.
          const player = players.find(
            (p) => p.name.toLowerCase() === winner.name.toLowerCase()
          );
          const playerImage =
            player?.imagePath && player.imagePath.trim() !== ""
              ? getImagePath(player.imagePath)
              : undefined;

          // Find deck image (if available).
          let deckImage: string | undefined = undefined;
          if (winner.deck && winner.deck.trim() !== "") {
            const deckImagePath = winner.deckImagePath || `${idx + 1}.webp`;
            deckImage = `/images/events/${event.id}/${deckImagePath}`;
          }

          // Add to result.
          result.push({
            name: winner.name,
            deck: winner.deck || "?",
            event: event.title,
            host: event.host,
            date: event.when,
            format: event.format,
            official: !!event.official,
            playerImage,
            deckImage,
          });
        });
    });
    // Sort by date descending.
    return result.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [events, players]);

  if (winners.length === 0) {
    return (
      <div className="text-muted-foreground text-sm">
        No recent winners in the last 2 weeks.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {winners.map((winner, idx) => (
          <WinnerCard key={idx} winner={winner} />
        ))}
      </div>
    </div>
  );
}
