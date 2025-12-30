import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { EventFormat } from "@/enums/event-format";
import { EventDeck, EventWinner } from "@/columns/events";
import { Heart, Megaphone, Plus, Trash2, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { v4 as uuidv4 } from "uuid";
import { format } from "date-fns";
import { getOrdinal } from "@/utils/ordinal";
import { isDevelopment } from "@/utils/enviroment";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import PlayerQuickSearch from "./player-search";
import HostQuickSearch from "./ui/host-search";

type Props = {
  onClose: () => void;
};

export function AddEventFormDrawer({ onClose }: Props) {
  const [form, setForm] = useState({
    title: "",
    host: "",
    when: "",
    where: "",
    format: EventFormat.OCG,
    official: false,
    rounds: 3,
    winners: [] as EventWinner[],
    decks: [] as EventDeck[],
    notes: "",
  });

  // Initial empty winner and deck entries.
  const _winners = [{ name: "", position: 1, deck: "", deckImagePath: "" }];
  const _decks = [{ name: "", count: 1 }];

  // State for winners and decks.
  const [eventId, setEventId] = useState<string>(uuidv4());
  const [winners, setWinners] = useState<EventWinner[]>(_winners);
  const [decks, setDecks] = useState<EventDeck[]>(_decks);
  const [copied, setCopied] = useState(false);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    const { name, value, type } = e.target;
    const checked =
      e.target instanceof HTMLInputElement ? e.target.checked : false;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleWinnerChange(
    idx: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const { name, value } = e.target;
    setWinners((prev) =>
      prev.map((winner, i) =>
        i === idx ? { ...winner, [name]: value } : winner
      )
    );
  }

  function handleDeckChange(
    idx: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const { name, value } = e.target;
    setDecks((prev) =>
      prev.map((deck, i) =>
        i === idx
          ? {
              ...deck,
              [name]: name === "count" ? Math.max(1, Number(value)) : value,
            }
          : deck
      )
    );
  }

  function handleAddWinner() {
    setWinners((prev) => [
      ...prev,
      { name: "", deck: "" } as Partial<EventWinner> as EventWinner,
    ]);
  }

  function handleRemoveWinner(idx: number) {
    setWinners((prev) => prev.filter((_, i) => i !== idx));
  }

  function handleAddDeck() {
    setDecks((prev) => [...prev, { name: "", count: 1 }]);
  }

  function handleRemoveDeck(idx: number) {
    setDecks((prev) => prev.filter((_, i) => i !== idx));
  }

  // Helper to generate the JSON object with required formatting.
  function getEventJson() {
    const formattedDate =
      form.when && form.when !== ""
        ? format(new Date(form.when), "MMM dd yyyy")
        : "";

    return {
      id: eventId,
      title: form.title,
      host: form.host,
      when: formattedDate,
      where: form.where,
      format: form.format,
      official: form.official,
      rounds: form.rounds,
      images: [], // or handle as needed.
      winners: winners.map((winner, idx) => ({
        name: winner.name,
        position: idx + 1,
        deck: winner.deck,
        deckImagePath: `${idx + 1}.webp`,
      })),
      decks: decks
        .filter((deck) => deck.name.trim())
        .map((deck) => ({
          name: deck.name,
          count: deck.count,
        })),
      notes: form.notes,
    };
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const jsonData = JSON.stringify(getEventJson(), null, 2);

    const subject = encodeURIComponent("Event Listing Request: ygophmeta");
    const body = encodeURIComponent(
      `I consent to my data being used and displayed publicly on ygophmeta.\n\nEvent Data:\n${jsonData}`
    );
    const mailto = `mailto:richmondreglo25@gmail.com?subject=${subject}&body=${body}`;
    window.open(mailto, "_blank");
  }

  return (
    <Drawer open dismissible={false} onClose={onClose} direction="right">
      <DrawerContent className="rounded-sm fixed top-0 right-0 left-auto mt-0 w-full sm:max-w-lg">
        <div className="flex flex-col gap-2 w-full h-full">
          <DrawerTitle
            className={`flex justify-between items-center p-4 text-sm font-medium border-b`}
          >
            <div className="flex items-center gap-2">
              {/* <IconX type="players" size={18} /> */}
              Submit Event
            </div>
            <X size={18} className="cursor-pointer" onClick={onClose} />
          </DrawerTitle>
          <div className="flex flex-col items-center flex-1 gap-4 overflow-auto p-4 ">
            <Alert variant="info">
              <AlertTitle className="font-semibold flex items-center gap-2">
                <Megaphone size={14} />
                <span>Notice</span>
              </AlertTitle>
              <AlertDescription className="text-sm pt-2">
                By submitting this form, you permit this site to use and display
                your submitted data publicly.
              </AlertDescription>
            </Alert>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-5 w-full"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  // Prevent form submit on Enter keydown.
                  e.preventDefault();
                }
              }}
            >
              <label className="flex flex-col gap-1 text-sm font-medium">
                Title
                <Input
                  name="title"
                  placeholder="Title"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full text-gray-700 rounded-sm"
                  maxLength={80}
                  required
                />
              </label>
              <label className="flex flex-col gap-1 text-sm font-medium">
                Host
                <HostQuickSearch
                  name="host"
                  placeholder="Host"
                  minCharCount={3}
                  onValueChange={(e) => handleChange(e)}
                  className="text-gray-700 bg-white rounded-sm"
                  maxLength={80}
                  required={true}
                />
              </label>
              <label className="flex flex-col gap-1 text-sm font-medium">
                When
                <Input
                  name="when"
                  type="date"
                  value={form.when}
                  onChange={handleChange}
                  className="w-full text-gray-700 rounded-sm"
                  required
                />
              </label>
              <label className="flex flex-col gap-1 text-sm font-medium">
                Where
                <Input
                  name="where"
                  placeholder="Where"
                  value={form.where}
                  onChange={handleChange}
                  className="w-full text-gray-700 rounded-sm"
                  maxLength={80}
                  required
                />
              </label>
              <label className="flex flex-col gap-1 text-sm font-medium">
                Format
                <Select
                  name="format"
                  value={form.format}
                  onValueChange={(value) =>
                    setForm((prev) => ({
                      ...prev,
                      format: value as EventFormat,
                    }))
                  }
                  required
                >
                  <SelectTrigger className="w-full text-gray-700 rounded-sm shadow-none">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(EventFormat).map((fmt) => (
                      <SelectItem key={fmt} value={fmt}>
                        {fmt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </label>
              <label className="flex items-center gap-2 text-sm font-medium">
                <Checkbox
                  name="official"
                  checked={form.official}
                  onCheckedChange={(checked) =>
                    setForm((prev) => ({
                      ...prev,
                      official: !!checked,
                    }))
                  }
                />
                Official
              </label>
              <label className="flex flex-col gap-1 text-sm font-medium">
                Rounds
                <Input
                  name="rounds"
                  type="number"
                  placeholder="Rounds"
                  value={form.rounds}
                  min={1}
                  max={99}
                  onChange={handleChange}
                  className="w-full text-gray-700 rounded-sm"
                  required
                />
              </label>

              {/* Event Winners Section */}
              <div>
                <div className="font-semibold mb-2 text-sm">Winners</div>
                <div className="flex flex-col gap-3">
                  {winners.map((winner, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col gap-2 bg-gray-50 p-4 border border-gray-200 rounded-sm"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-sm">
                          {getOrdinal(idx + 1)} Place
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          className="flex items-center justify-center text-xs rounded-full"
                          onClick={() => handleRemoveWinner(idx)}
                          disabled={winners.length === 1}
                        >
                          <Trash2 size={10} className="text-red-600" />
                        </Button>
                      </div>
                      <div className="flex flex-col gap-2">
                        <PlayerQuickSearch
                          name="name"
                          placeholder="Name"
                          minCharCount={3}
                          onValueChange={(e) => handleWinnerChange(idx, e)}
                          className="text-gray-700 bg-white rounded-sm"
                          maxLength={80}
                          required={true}
                        />
                        <Input
                          name="deck"
                          placeholder="Deck"
                          value={winner.deck}
                          onChange={(e) => handleWinnerChange(idx, e)}
                          className="text-gray-700 bg-white rounded-sm"
                          maxLength={80}
                          required
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end mt-2">
                  <Button
                    type="button"
                    variant="submit"
                    className="text-xs flex gap-0.5 p-2 py-0 h-[32px] rounded-sm"
                    onClick={handleAddWinner}
                  >
                    <Plus size={14} />
                    <span>Add Winner</span>
                  </Button>
                </div>
              </div>

              {/* Event Decks Section */}
              <div>
                <div className="font-semibold mb-2 text-sm">
                  Decks Summary / Tally
                </div>
                {decks.map((deck, idx) => (
                  <div key={idx} className="flex items-center gap-2 mb-2">
                    <Input
                      name="name"
                      placeholder="Deck Name"
                      value={deck.name}
                      onChange={(e) => handleDeckChange(idx, e)}
                      className="flex-1 text-gray-700 rounded-sm"
                      maxLength={80}
                    />
                    <Input
                      name="count"
                      type="number"
                      min={1}
                      max={99}
                      placeholder="Count"
                      value={deck.count}
                      onChange={(e) => handleDeckChange(idx, e)}
                      className="w-[65px] text-center text-gray-700 rounded-sm "
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      className="flex items-center justify-center text-xs rounded-full"
                      onClick={() => handleRemoveDeck(idx)}
                      disabled={decks.length === 1}
                    >
                      <Trash2 size={16} className="text-red-600" />
                    </Button>
                  </div>
                ))}
                <div className="flex justify-end mt-2">
                  <Button
                    type="button"
                    variant="submit"
                    className="text-xs flex gap-0.5 p-2 py-0 h-[32px] rounded-sm"
                    onClick={handleAddDeck}
                  >
                    <Plus size={14} />
                    <span>Add Deck</span>
                  </Button>
                </div>
              </div>
              <label className="flex flex-col gap-1 text-sm font-medium">
                Notes
                <Textarea
                  name="notes"
                  placeholder="Notes"
                  value={form.notes}
                  onChange={handleChange}
                  className="w-full text-sm font-normal text-gray-700 rounded-sm shadow-none max-h-[150px]"
                  maxLength={200}
                />
              </label>
              {/* Image Upload Info Alert */}
              <Alert variant="info">
                <AlertTitle className="font-semibold flex items-center gap-2">
                  <Megaphone size={14} />
                  <span>Optional Image Upload</span>
                </AlertTitle>
                <AlertDescription className="text-sm pt-2">
                  You may upload an image as the event banner or for the event
                  winner.
                  <br />
                  For best display on the website and phone, use a{" "}
                  <b>16:9 aspect ratio</b> and <b>.webp</b> format.
                  <br />
                  <span className="italic">
                    This helps the site load images faster and look better on
                    all devices.
                  </span>
                </AlertDescription>
              </Alert>
              {/* Decklist Image Notice */}
              <Alert variant="info">
                <AlertTitle className="font-semibold flex items-center gap-2">
                  <Heart size={14} />
                  <span>Thank you for your contribution!</span>
                </AlertTitle>
                <AlertDescription className="text-sm pt-2">
                  We will reach out to players regarding their decklist images
                  if needed.
                </AlertDescription>
              </Alert>
              {/* Submit Email Danger Alert */}
              <Alert variant="warning">
                <AlertTitle className="font-semibold">
                  Important: Email Submission Required
                </AlertTitle>
                <AlertDescription className="text-sm pt-2 select-text">
                  Clicking <b>Submit</b> will open your email client to send
                  your event data.
                  <br />
                  <span className="font-semibold">
                    If this does not work, you can manually email your event
                    data to:
                  </span>
                  <div className="mt-2">
                    <b>Email:</b> richmondreglo25@gmail.com
                    <br />
                    <b>Subject:</b> Event Listing Request: ygophmeta
                  </div>
                  <div className="mt-2">
                    Please include your consent and the event JSON data shown
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
                          const json = JSON.stringify(getEventJson(), null, 2);
                          navigator.clipboard.writeText(json);
                          setCopied(true);
                          setTimeout(() => {
                            // In development, generate a new UUID each time for testing.
                            if (isDevelopment()) {
                              setEventId(uuidv4());
                            }

                            setCopied(false);
                          }, 1500);
                        }}
                      >
                        {copied ? "Copied!" : "Copy"}
                      </Button>
                      <div className="bg-gray-100 border border-gray-300 text-xs font-mono p-4 whitespace-pre-wrap rounded-sm">
                        {JSON.stringify(getEventJson(), null, 2)}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="cancel"
                  className="rounded-sm"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button variant="submit" type="submit" className="rounded-sm">
                  Submit
                </Button>
              </div>
            </form>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
