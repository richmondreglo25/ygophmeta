"use client";

import React, { useState, useMemo } from "react";
import { X, Megaphone, Heart } from "lucide-react";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Loading } from "./loading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useEventsByYearMonthRange } from "@/app/data/api";

// Drawer props.
type Props = {
  onClose: () => void;
};

export function UploadDeckDrawer({ onClose }: Props) {
  // Calculate date range for last 12 months.
  const now = useMemo(() => new Date(), []);
  const start = useMemo(() => {
    const d = new Date(now);
    d.setMonth(d.getMonth() - 11);
    return { year: d.getFullYear(), month: d.getMonth() + 1 };
  }, [now]);
  const end = useMemo(
    () => ({
      year: now.getFullYear(),
      month: now.getMonth() + 1,
    }),
    [now]
  );

  // Fetch events in date range.
  const { data: events = [], loading } = useEventsByYearMonthRange(start, end);

  // Compute unique hosts from events.
  const hosts = useMemo(() => {
    const set = new Set<string>();
    events.forEach((e) => e.host && set.add(e.host));
    return Array.from(set).sort();
  }, [events]);

  // State for selects and file.
  const [selectedHost, setSelectedHost] = useState("");
  const [selectedEventId, setSelectedEventId] = useState("");
  const [selectedWinner, setSelectedWinner] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Filter events by selected host.
  const filteredEvents = useMemo(
    () => events.filter((e) => e.host === selectedHost),
    [events, selectedHost]
  );

  // Find selected event.
  const selectedEvent = useMemo(
    () => filteredEvents.find((e) => e.id === selectedEventId),
    [filteredEvents, selectedEventId]
  );

  // Winner list for selected event.
  const winners = useMemo(() => selectedEvent?.winners ?? [], [selectedEvent]);

  // Handle form submission.
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setUploading(true);
    setSuccess(false);

    const formData = new FormData();
    formData.append("eventId", selectedEventId);
    formData.append("winnerPosition", selectedWinner); // Use position instead of name.
    if (file) formData.append("deckImage", file);

    await fetch("/api/upload-deck", { method: "POST", body: formData });

    setTimeout(() => {
      setUploading(false);
      setSuccess(true);
    }, 1200);
  }

  // Show loading indicator if events are loading.
  if (loading) {
    return <Loading />;
  }

  return (
    <Drawer open dismissible={false} onClose={onClose} direction="right">
      <DrawerContent className="rounded-sm fixed top-0 right-0 left-auto mt-0 w-full sm:max-w-lg">
        <div className="flex flex-col gap-2 w-full h-full">
          {/* Drawer header. */}
          <DrawerTitle className="flex justify-between items-center p-4 text-sm font-medium border-b">
            <div className="flex items-center gap-2">
              <span>Submit Deck</span>
            </div>
            <X size={18} className="cursor-pointer" onClick={onClose} />
          </DrawerTitle>
          <div className="flex flex-col items-center flex-1 gap-4 overflow-auto p-4 ">
            {/* Info alert. */}
            <Alert variant="info">
              <AlertTitle className="font-semibold flex items-center gap-2">
                <Megaphone size={14} />
                <span>Notice</span>
              </AlertTitle>
              <AlertDescription className="text-sm pt-1">
                Please upload the deck image and details for the winner.
                <br />
                For best display, use a <b>1:1 aspect ratio</b> and <b>.webp</b>{" "}
                format.
              </AlertDescription>
            </Alert>
            {/* Upload form. */}
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-5 w-full"
            >
              {/* Host select. */}
              <label className="flex flex-col gap-1 text-sm font-medium">
                Host
                <Select
                  value={selectedHost}
                  onValueChange={(v) => {
                    setSelectedHost(v);
                    setSelectedEventId("");
                    setSelectedWinner("");
                  }}
                  required
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Host" />
                  </SelectTrigger>
                  <SelectContent>
                    {hosts.map((host) => (
                      <SelectItem key={host} value={host}>
                        {host}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </label>
              {/* Event select. */}
              <label className="flex flex-col gap-1 text-sm font-medium">
                Event
                <Select
                  value={selectedEventId}
                  onValueChange={(v) => {
                    setSelectedEventId(v);
                    setSelectedWinner("");
                  }}
                  required
                  disabled={!selectedHost}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Event" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredEvents.map((event) => (
                      <SelectItem key={event.id} value={event.id}>
                        {event.title} - {event.when} - {event.id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </label>
              {/* Winner select. */}
              <label className="flex flex-col gap-1 text-sm font-medium">
                Winner
                <Select
                  value={selectedWinner}
                  onValueChange={setSelectedWinner}
                  required
                  disabled={!selectedEventId}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Winner" />
                  </SelectTrigger>
                  <SelectContent>
                    {winners.map((winner) => (
                      <SelectItem
                        key={winner.position}
                        value={String(winner.position)}
                      >
                        {winner.position} - {winner.name} - {winner.deck}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </label>
              {/* Deck Image input. */}
              <label className="flex flex-col gap-1 text-sm font-medium">
                Deck Image
                <Input
                  type="file"
                  name="deckImage"
                  accept="image/*"
                  className="w-full text-xs"
                  required
                  disabled={!selectedWinner}
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </label>
              {/* Form actions. */}
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="cancel"
                  className="rounded-sm"
                  onClick={onClose}
                  disabled={uploading}
                >
                  Cancel
                </Button>
                <Button
                  variant="submit"
                  type="submit"
                  className="rounded-sm"
                  disabled={uploading || !selectedWinner || !file}
                >
                  {uploading ? "Uploading..." : "Upload"}
                </Button>
              </div>
              {/* Success alert. */}
              {success && (
                <Alert variant="success">
                  <AlertTitle className="font-semibold flex items-center gap-2">
                    <Heart size={14} />
                    <span>Deck uploaded successfully!</span>
                  </AlertTitle>
                  <AlertDescription className="text-sm pt-1">
                    Thank you for your contribution!
                  </AlertDescription>
                </Alert>
              )}
            </form>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
