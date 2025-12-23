import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
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

type Props = {
  onClose: () => void;
};

export function AddEventFormModal({ onClose }: Props) {
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

  const [winnerFields, setWinnerFields] = useState<EventWinner[]>([
    { name: "", position: 1, deck: "", deckImagePath: "" },
  ]);
  const [deckFields, setDeckFields] = useState<EventDeck[]>([
    { name: "", count: 1 },
  ]);
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
    setWinnerFields((prev) =>
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
    setDeckFields((prev) =>
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
    setWinnerFields((prev) => [
      ...prev,
      { name: "", deck: "" } as Partial<EventWinner> as EventWinner,
    ]);
  }

  function handleRemoveWinner(idx: number) {
    setWinnerFields((prev) => prev.filter((_, i) => i !== idx));
  }

  function handleAddDeck() {
    setDeckFields((prev) => [...prev, { name: "", count: 1 }]);
  }

  function handleRemoveDeck(idx: number) {
    setDeckFields((prev) => prev.filter((_, i) => i !== idx));
  }

  // Helper to generate the JSON object with required formatting.
  function getEventJson() {
    const eventId = uuidv4();
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
      images: [], // or handle as needed
      winners: winnerFields.map((winner, idx) => ({
        name: winner.name,
        position: idx + 1,
        deck: winner.deck,
        deckImagePath: `${idx + 1}.webp`,
      })),
      decks: deckFields
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
    <Drawer open onClose={onClose}>
      <DrawerContent className="rounded-none fixed top-0 right-0 left-auto mt-0 w-full sm:max-w-lg">
        <div className="flex flex-col gap-2 w-full h-full">
          <DrawerTitle
            className={`flex justify-between items-center p-4 text-sm font-medium border-b`}
          >
            <div className="flex items-center gap-2">
              {/* <IconX type="players" size={18} /> */}
              Submit Event
            </div>
            <DrawerClose>
              <X size={18} />
            </DrawerClose>
          </DrawerTitle>
          <div className="p-4 flex flex-col items-center flex-1 overflow-auto">
            <Alert className="mb-4 w-full border-blue-300 bg-blue-50 text-blue-900 rounded-none">
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
            >
              <label className="flex flex-col gap-1 text-sm font-medium">
                Title
                <Input
                  name="title"
                  placeholder="Title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className="w-full border bg-white text-gray-700 rounded-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 hover:border-blue-400 px-3 py-4 transition placeholder:text-sm placeholder:text-gray-400 outline-none"
                  maxLength={80}
                />
              </label>
              <label className="flex flex-col gap-1 text-sm font-medium">
                Host
                <Input
                  name="host"
                  placeholder="Host"
                  value={form.host}
                  onChange={handleChange}
                  required
                  className="w-full border bg-white text-gray-700 rounded-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 hover:border-blue-400 px-3 py-4 transition placeholder:text-sm placeholder:text-gray-400 outline-none"
                  maxLength={80}
                />
              </label>
              <label className="flex flex-col gap-1 text-sm font-medium">
                When
                <Input
                  name="when"
                  type="date"
                  value={form.when}
                  onChange={handleChange}
                  required
                  className="w-full border bg-white text-gray-700 rounded-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 hover:border-blue-400 px-3 py-4 transition placeholder:text-sm placeholder:text-gray-400 outline-none"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm font-medium">
                Where
                <Input
                  name="where"
                  placeholder="Where"
                  value={form.where}
                  onChange={handleChange}
                  required
                  className="w-full border bg-white text-gray-700 rounded-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 hover:border-blue-400 px-3 py-4 transition placeholder:text-sm placeholder:text-gray-400 outline-none"
                  maxLength={80}
                />
              </label>
              <label className="flex flex-col gap-1 text-sm font-medium">
                Format
                <select
                  name="format"
                  value={form.format}
                  onChange={handleChange}
                  required
                  className="w-full border bg-white text-gray-700 rounded-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 hover:border-blue-400 px-3 py-2 transition text-sm placeholder:text-sm placeholder:text-gray-400 outline-none"
                >
                  {Object.values(EventFormat).map((fmt) => (
                    <option key={fmt} value={fmt}>
                      {fmt}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex items-center gap-2 text-sm font-medium">
                <input
                  type="checkbox"
                  name="official"
                  checked={form.official}
                  onChange={handleChange}
                />
                Official
              </label>
              <label className="flex flex-col gap-1 text-sm font-medium">
                Rounds
                <Input
                  name="rounds"
                  type="number"
                  min={1}
                  placeholder="Rounds"
                  value={form.rounds}
                  onChange={handleChange}
                  required
                  className="w-full border bg-white text-gray-700 rounded-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 hover:border-blue-400 px-3 py-4 transition placeholder:text-sm placeholder:text-gray-400 outline-none"
                />
              </label>
              {/* Event Winners Section */}
              <div>
                <div className="font-semibold mb-2 text-sm">Winners</div>
                <div className="flex flex-col gap-3">
                  {winnerFields.map((winner, idx) => (
                    <div
                      key={idx}
                      className="border border-gray-200 bg-gray-50 p-4 flex flex-col gap-3"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-sm">
                          Winner #{idx + 1}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          className="flex items-center justify-center text-xs rounded-full"
                          onClick={() => handleRemoveWinner(idx)}
                          disabled={winnerFields.length === 1}
                        >
                          <Trash2 size={10} className="text-red-600" />
                        </Button>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Input
                          name="name"
                          placeholder="Name"
                          value={winner.name}
                          onChange={(e) => handleWinnerChange(idx, e)}
                          className="border bg-white text-gray-700 rounded-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 hover:border-blue-400 px-2 py-3 transition placeholder:text-sm placeholder:text-gray-400 outline-none"
                        />
                        <Input
                          name="deck"
                          placeholder="Deck"
                          value={winner.deck}
                          onChange={(e) => handleWinnerChange(idx, e)}
                          className="border bg-white text-gray-700 rounded-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 hover:border-blue-400 px-2 py-3 transition placeholder:text-sm placeholder:text-gray-400 outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end mt-2">
                  <Button
                    type="button"
                    variant="submit"
                    className="text-xs flex gap-0.5 p-2 py-0 h-[32px] rounded-none"
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
                {deckFields.map((deck, idx) => (
                  <div key={idx} className="flex items-center gap-2 mb-2">
                    <Input
                      name="name"
                      placeholder="Deck Name"
                      value={deck.name}
                      onChange={(e) => handleDeckChange(idx, e)}
                      className="border bg-white text-gray-700 rounded-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 hover:border-blue-400 px-2 py-2 transition placeholder:text-sm placeholder:text-gray-400 outline-none flex-1"
                      maxLength={80}
                    />
                    <Input
                      name="count"
                      type="number"
                      min={1}
                      placeholder="Count"
                      value={deck.count}
                      onChange={(e) => handleDeckChange(idx, e)}
                      className="border bg-white text-gray-700 rounded-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 hover:border-blue-400 px-1 py-2 transition placeholder:text-sm placeholder:text-gray-400 outline-none w-[60px] text-center"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      className="flex items-center justify-center text-xs rounded-full"
                      onClick={() => handleRemoveDeck(idx)}
                      disabled={deckFields.length === 1}
                    >
                      <Trash2 size={16} className="text-red-600" />
                    </Button>
                  </div>
                ))}
                <div className="flex justify-end mt-2">
                  <Button
                    type="button"
                    variant="submit"
                    className="text-xs flex gap-0.5 p-2 py-0 h-[32px] rounded-none"
                    onClick={handleAddDeck}
                  >
                    <Plus size={14} />
                    <span>Add Deck</span>
                  </Button>
                </div>
              </div>
              <label className="flex flex-col gap-1 text-sm font-medium">
                Notes
                <textarea
                  name="notes"
                  placeholder="Notes"
                  value={form.notes}
                  onChange={handleChange}
                  className="w-full border bg-white text-gray-700 outline-none rounded-none focus:ring-blue-400 focus:border-blue-400 hover:border-blue-400 px-3 py-4 transition placeholder:text-sm placeholder:text-gray-400"
                  maxLength={200}
                />
              </label>
              {/* Image Upload Info Alert */}
              <Alert className="w-full border-blue-300 bg-blue-50 text-blue-900 rounded-none">
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
              <Alert className="w-full border-blue-300 bg-blue-50 text-blue-900 rounded-none">
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
              <Alert
                className="w-full border-red-400 bg-red-50 text-red-900 rounded-none"
                variant="destructive"
              >
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
                  <AccordionTrigger className="text-sm font-medium px-0 py-2 rounded-none">
                    Show JSON Preview
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="relative">
                      <Button
                        type="button"
                        size="xs"
                        variant="secondary"
                        className="absolute top-2 right-2 z-10 rounded-none"
                        onClick={() => {
                          const json = JSON.stringify(getEventJson(), null, 2);
                          navigator.clipboard.writeText(json);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 1500);
                        }}
                      >
                        {copied ? "Copied!" : "Copy"}
                      </Button>
                      <div className="bg-gray-100 border border-gray-300 text-xs font-mono p-4 whitespace-pre-wrap rounded-none">
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
                  className="rounded-none"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button variant="submit" type="submit" className="rounded-none">
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
