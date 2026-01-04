import { useState, useMemo, useRef, useEffect, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { useJsonData } from "@/app/data/api";
import { getJsonPath } from "@/utils/enviroment";
import { Deck } from "@/types/deck"; // Deck type is Shop

type DeckQuickSearchProps = {
  name?: string;
  placeholder?: string;
  minCharCount?: number;
  onValueChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  maxLength?: number;
  required?: boolean;
};

/**
 * Deck Quick Search Component.
 * @param props DeckQuickSearchProps.
 * @returns JSX.Element.
 */
export function DeckQuickSearch({
  name,
  placeholder,
  minCharCount = 1,
  onValueChange,
  className,
  maxLength = 80,
  required,
}: DeckQuickSearchProps) {
  const { data: decks, loading } = useJsonData<Deck[]>(
    getJsonPath("decks.json")
  );

  const [value, setValue] = useState("");
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter decks based on query.
  const filtered = useMemo(() => {
    if (!query) return [];
    if (query.length < minCharCount) return [];
    return decks.filter(
      (d) => d.name && d.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [decks, query, minCharCount]);

  // Handle deck selection from dropdown.
  function onDeckSelect(deck: Deck) {
    setValue(deck.name);
    setQuery("");
    setShowDropdown(false);

    const syntheticEvent = {
      target: { name, value: deck.name },
    } as React.ChangeEvent<HTMLInputElement>;
    onValueChange?.(syntheticEvent);
  }

  // Handle input change.
  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
    setQuery(e.target.value);
    setShowDropdown(true);
    onValueChange?.(e);
  }

  // Hide dropdown when clicking outside.
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full relative">
      <div className="flex gap-2">
        <Input
          ref={inputRef}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          onFocus={() => query && setShowDropdown(true)}
          className={className}
          disabled={loading}
          autoComplete="off"
          maxLength={maxLength}
          required={required}
        />
      </div>
      {showDropdown && filtered.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute left-0 right-0 z-10 border rounded-sm bg-background mt-1 divide-y shadow-lg"
          style={{ maxHeight: "240px", overflowY: "auto" }}
        >
          {filtered.map((deck) => (
            <div
              key={deck.name}
              className="flex flex-row items-center gap-2 cursor-pointer hover:bg-accent p-2"
              onClick={() => onDeckSelect(deck)}
            >
              <span className="text-xs font-medium">{deck.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DeckQuickSearch;
