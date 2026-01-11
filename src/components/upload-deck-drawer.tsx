"use client";

import React, { useState, useMemo } from "react";
import { X, Megaphone } from "lucide-react";
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
import { getImagePath, isDevelopment } from "@/utils/enviroment";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import Image from "next/image";

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

  // State for copy feedback.
  const [copied, setCopied] = useState(false);

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

  // Get winner object by position.
  const winnerObj = winners.find((w) => String(w.position) === selectedWinner);

  // Helper to generate the deck submission JSON.
  function getDeckJson() {
    return {
      eventId: selectedEventId,
      eventTitle: selectedEvent?.title,
      host: selectedHost,
      winner: winnerObj
        ? { name: winnerObj.name, position: winnerObj.position }
        : undefined,
      fileName: file?.name,
    };
  }

  // Handle form submission.
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setUploading(true);

    const deckJson = getDeckJson();

    if (isDevelopment()) {
      const formData = new FormData();
      formData.append("eventId", selectedEventId);
      formData.append("winnerPosition", selectedWinner); // Use position instead of name.
      if (file) formData.append("deckImage", file);

      await fetch("/api/upload-deck", { method: "POST", body: formData });

      setTimeout(() => {
        setUploading(false);
      }, 1000);
    } else {
      // Open email client with JSON in body.
      const subject = encodeURIComponent(
        `Deck Submission: ${selectedEvent?.title || selectedEventId}`
      );
      const body = encodeURIComponent(
        `I consent to my deck data being used and displayed publicly on ygophmeta.\n\nDeck Submission Data:\n${JSON.stringify(
          deckJson,
          null,
          2
        )}`
      );
      const mailto = `mailto:richmondreglo25@gmail.com?subject=${subject}&body=${body}`;
      window.open(mailto, "_blank");
      setUploading(false);
    }
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
                By submitting this form, you permit this site to use and display
                your submitted data publicly.
              </AlertDescription>
            </Alert>
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
                        {event.title} - {event.when}
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
                        {winner.position} - {winner.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </label>
              {/* Deck Image input. */}
              {isDevelopment() && (
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
              )}
              {/* Sample images wrapped in Accordion and made full width */}
              <Accordion type="single" collapsible className="w-full mt-2">
                <AccordionItem value="sample-images">
                  <AccordionTrigger className="text-sm font-medium px-0 py-2 rounded-sm">
                    Sample Deck Images
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-2 gap-4 w-full">
                      <Image
                        src={getImagePath("events/demo/1.webp")}
                        alt="Sample Deck 1"
                        width={512}
                        height={512}
                        className="object-cover border rounded-sm w-full h-auto"
                      />
                      <Image
                        src={getImagePath("events/demo/2.webp")}
                        alt="Sample Deck 2"
                        width={512}
                        height={512}
                        className="object-cover border rounded-sm w-full h-auto"
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              {/* Deck Image Notice */}
              <Alert variant="info">
                <AlertTitle className="font-semibold flex items-center gap-2">
                  <Megaphone size={14} />
                  <span>Deck Image Upload</span>
                </AlertTitle>
                <AlertDescription className="text-sm pt-1">
                  Please upload the deck image and details for the winner.
                  <br />
                  For best display, use a <b>1:1 aspect ratio</b>.
                </AlertDescription>
              </Alert>
              {/* Submit Email Danger Alert */}
              <Alert variant="warning">
                <AlertTitle className="font-semibold">
                  Important: Email Submission Required
                </AlertTitle>
                <AlertDescription className="text-sm pt-2 select-text">
                  Clicking <b>Submit</b> will open your email client to send
                  your deck data.
                  <br />
                  <span className="font-semibold">
                    If this does not work, you can manually email your deck
                    details to:
                  </span>
                  <div className="mt-2">
                    <b>Email:</b> richmondreglo25@gmail.com
                    <br />
                    <b>Subject:</b> Deck Upload Request: ygophmeta
                  </div>
                  <div className="mt-2">
                    Please include your consent and the deck JSON data shown
                    below.
                  </div>
                </AlertDescription>
              </Alert>
              {/* Sample JSON Preview */}
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="json-preview">
                  <AccordionTrigger className="text-sm font-medium px-0 py-2 rounded-sm">
                    Show JSON Preview
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="relative">
                      <Button
                        type="button"
                        size="xs"
                        variant="secondary"
                        className="absolute top-2 right-2 z-10 rounded-sm"
                        onClick={() => {
                          const json = JSON.stringify(getDeckJson(), null, 2);
                          navigator.clipboard.writeText(json);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 1500);
                        }}
                      >
                        {copied ? "Copied!" : "Copy"}
                      </Button>
                      <div className="bg-gray-100 border border-gray-300 text-xs font-mono p-4 whitespace-pre-wrap rounded-sm">
                        {JSON.stringify(getDeckJson(), null, 2)}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
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
                  {uploading ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
