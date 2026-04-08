import React, { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { EventFormat } from "@/enums/event-format";
import { OrdinalType } from "@/enums/ordinal-type";
import { Plus, Trash2, X, Loader2 } from "lucide-react";
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
import { Event, EventDeck, EventWinner } from "@/types/event";
import { AlertModal } from "./alert-modal";

type Props = {
  event: Event;
  onClose: () => void;
  onSuccess?: () => void;
};

export function EditEventFormDrawer({ event, onClose, onSuccess }: Props) {
  const [form, setForm] = useState<Event>(event);
  const [winners, setWinners] = useState<EventWinner[]>(event.winners || []);
  const [decks, setDecks] = useState<EventDeck[]>(event.decks || []);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalVariant, setModalVariant] = useState<"success" | "error">(
    "success",
  );
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    setForm(event);
    setWinners(event.winners || []);
    setDecks(event.decks || []);
  }, [event]);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
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
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    const { name, value } = e.target;
    setWinners((prev) =>
      prev.map((winner, i) =>
        i === idx ? { ...winner, [name]: value } : winner,
      ),
    );
  }

  function handleDeckChange(
    idx: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    const { name, value } = e.target;
    setDecks((prev) =>
      prev.map((deck, i) =>
        i === idx
          ? {
              ...deck,
              [name]: name === "count" ? Math.max(1, Number(value)) : value,
            }
          : deck,
      ),
    );
  }

  function handleAddWinner() {
    setWinners((prev) => [
      ...prev,
      {
        name: "",
        position: prev.length + 1,
        deck: "",
        deckImagePath: `${prev.length + 1}.webp`,
      } as EventWinner,
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      // In development mode, allow editing
      if (!isDevelopment()) {
        setModalVariant("error");
        setModalMessage("Editing is only available in development mode");
        setShowModal(true);
        setSaving(false);
        return;
      }

      // Parse the date and format it
      const formattedDate =
        form.when && form.when !== ""
          ? format(new Date(form.when), "MMM dd yyyy")
          : event.when;

      const updatedEvent: Event = {
        ...form,
        when: formattedDate,
        winners: winners.map((winner, idx) => ({
          ...winner,
          position: idx + 1,
          deckImagePath: winner.deckImagePath || `${idx + 1}.webp`,
        })),
        decks: decks.filter((deck) => deck.name.trim()),
      };

      const response = await fetch("/api/edit-event", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          originalEventId: event.id,
          originalWhen: event.when,
          eventData: updatedEvent,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update event");
      }

      setSuccess(true);
      setModalVariant("success");
      setModalMessage("Event updated successfully");
      setShowModal(true);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to update event";
      setModalVariant("error");
      setModalMessage(errorMsg);
      setShowModal(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Drawer open dismissible={false} onClose={onClose} direction="right">
      <DrawerContent className="rounded-sm fixed top-0 right-0 left-auto mt-0 w-full sm:max-w-lg">
        <div className="flex flex-col gap-2 w-full h-full">
          <DrawerTitle
            className={`flex justify-between items-center p-4 text-sm font-medium border-b`}
          >
            <span>Edit Event</span>
            <X
              size={18}
              className={`cursor-pointer ${
                saving || success
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:opacity-70"
              }`}
              onClick={() => {
                if (!saving && !success) {
                  onClose();
                }
              }}
            />
          </DrawerTitle>
          <div className="flex flex-col items-center flex-1 gap-4 overflow-auto p-4">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-5 w-full"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                }
              }}
            >
              <fieldset
                disabled={saving || success}
                className="flex flex-col gap-5"
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
                  <Input
                    name="host"
                    placeholder="Host"
                    value={form.host}
                    onChange={handleChange}
                    className="w-full text-gray-700 rounded-sm"
                    maxLength={80}
                    required
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm font-medium">
                  When
                  <Input
                    name="when"
                    type="date"
                    value={
                      form.when ? format(new Date(form.when), "yyyy-MM-dd") : ""
                    }
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
                  Ordinal Type
                  <Select
                    name="ordinalType"
                    value={form.ordinalType || OrdinalType.SIMPLE}
                    onValueChange={(value) =>
                      setForm((prev) => ({
                        ...prev,
                        ordinalType: value as OrdinalType,
                      }))
                    }
                    required
                  >
                    <SelectTrigger className="w-full text-gray-700 rounded-sm shadow-none">
                      <SelectValue placeholder="Select ordinal type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(OrdinalType).map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </label>
                <label className="flex flex-col gap-1 text-sm font-medium">
                  Rounds
                  <Input
                    name="rounds"
                    type="number"
                    placeholder="Rounds"
                    value={form.rounds || 3}
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
                          <Input
                            name="name"
                            placeholder="Name"
                            value={winner.name}
                            onChange={(e) => handleWinnerChange(idx, e)}
                            className="text-gray-700 bg-white rounded-sm"
                            maxLength={80}
                            required
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
                        className="w-[65px] text-center text-gray-700 rounded-sm"
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
                    value={form.notes || ""}
                    onChange={handleChange}
                    className="w-full text-sm font-normal text-gray-700 rounded-sm shadow-none max-h-[150px]"
                    maxLength={200}
                  />
                </label>
              </fieldset>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button
                  type="button"
                  variant="cancel"
                  onClick={onClose}
                  disabled={saving || success}
                  className="rounded-sm"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="submit"
                  disabled={saving || success}
                  className="rounded-sm flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>Save</>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </DrawerContent>
      <AlertModal
        open={showModal}
        onClose={() => {
          setShowModal(false);
          if (modalVariant === "success") {
            onSuccess?.();
            onClose();
          }
        }}
        variant={modalVariant}
        title={modalVariant === "success" ? "Success!" : "Error"}
        description={modalMessage}
      />
    </Drawer>
  );
}
