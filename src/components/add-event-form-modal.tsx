import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { EventFormat } from "@/enums/event-format";
import { EventDeck, EventWinner } from "@/columns/events";
import { Plus, Trash2 } from "lucide-react";

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
        i === idx
          ? { ...winner, [name]: name === "position" ? Number(value) : value }
          : winner
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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const winners = winnerFields.map((winner, idx) => ({
      name: winner.name,
      position: idx + 1,
      deck: winner.deck,
      deckImagePath: "",
    }));
    const decks = deckFields
      .filter((deck) => deck.name.trim())
      .map((deck) => ({
        name: deck.name,
        count: deck.count,
      }));
    setForm((prev) => ({
      ...prev,
      winners,
      decks,
    }));
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-none shadow-lg p-6 px-8 w-full max-w-lg">
        <h2 className="text-md font-semibold mb-4">Add New Event</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full border bg-white text-gray-700 rounded-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 hover:border-blue-400 px-3 py-4 transition placeholder:text-sm placeholder:text-gray-400 outline-none"
          />
          <Input
            name="host"
            placeholder="Host"
            value={form.host}
            onChange={handleChange}
            required
            className="w-full border bg-white text-gray-700 rounded-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 hover:border-blue-400 px-3 py-4 transition placeholder:text-sm placeholder:text-gray-400 outline-none"
          />
          <Input
            name="when"
            type="date"
            value={form.when}
            onChange={handleChange}
            required
            className="w-full border bg-white text-gray-700 rounded-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 hover:border-blue-400 px-3 py-4 transition placeholder:text-sm placeholder:text-gray-400 outline-none"
          />
          <Input
            name="where"
            placeholder="Where"
            value={form.where}
            onChange={handleChange}
            required
            className="w-full border bg-white text-gray-700 rounded-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 hover:border-blue-400 px-3 py-4 transition placeholder:text-sm placeholder:text-gray-400 outline-none"
          />
          <select
            name="format"
            value={form.format}
            onChange={handleChange}
            required
            className="w-full border bg-white text-gray-700 rounded-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 hover:border-blue-400 px-3 py-4 transition text-sm placeholder:text-sm placeholder:text-gray-400 outline-none"
          >
            <option value="">Select Format</option>
            {Object.values(EventFormat).map((fmt) => (
              <option key={fmt} value={fmt}>
                {fmt}
              </option>
            ))}
          </select>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="official"
              checked={form.official}
              onChange={handleChange}
            />
            Official
          </label>
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
          {/* Event Winners Section */}
          <div>
            <div className="font-semibold mb-2 text-sm">Event Winners</div>
            {winnerFields.map((winner, idx) => (
              <div
                key={idx}
                className="border border-gray-200 bg-gray-50 p-4 mb-3 flex flex-col gap-3 rounded"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-sm">Winner #{idx + 1}</span>
                  <Button
                    type="button"
                    variant="destructive"
                    className="flex items-center justify-center text-xs h-[30px] w-[30px]"
                    onClick={() => handleRemoveWinner(idx)}
                    disabled={
                      winnerFields.length === 1 ||
                      idx !== winnerFields.length - 1
                    }
                  >
                    <Trash2 size={15} />
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
            <Button
              type="button"
              variant="secondary"
              className="text-sm rounded-none"
              onClick={handleAddWinner}
            >
              <Plus size={14} />
              Add Winner
            </Button>
          </div>
          {/* Event Decks Section */}
          <div>
            <div className="font-semibold mb-2 text-sm">
              Event Decks (Tally)
            </div>
            {deckFields.map((deck, idx) => (
              <div key={idx} className="flex items-center gap-2 mb-2">
                <Input
                  name="name"
                  placeholder="Deck Name"
                  value={deck.name}
                  onChange={(e) => handleDeckChange(idx, e)}
                  className="border bg-white text-gray-700 rounded-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 hover:border-blue-400 px-2 py-2 transition placeholder:text-sm placeholder:text-gray-400 outline-none flex-1"
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
                  variant="destructive"
                  className="flex items-center justify-center text-xs h-[35px] w-[35px]"
                  onClick={() => handleRemoveDeck(idx)}
                  disabled={
                    deckFields.length === 1 || idx !== deckFields.length - 1
                  }
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="secondary"
              className="text-sm rounded-none"
              onClick={handleAddDeck}
            >
              <Plus size={14} />
              Add Deck
            </Button>
          </div>
          <textarea
            name="notes"
            placeholder="Notes"
            value={form.notes}
            onChange={handleChange}
            className="w-full border bg-white text-gray-700 outline-none rounded-none focus:ring-blue-400 focus:border-blue-400 hover:border-blue-400 px-3 py-4 transition placeholder:text-sm placeholder:text-gray-400"
          />
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              className="rounded-none"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit" className="rounded-none">
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
