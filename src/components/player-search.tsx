import { useState, useMemo, useRef, useEffect, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { useJsonData } from "@/app/data/api";
import { getJsonPath } from "@/utils/enviroment";
import { Player } from "@/columns/players";

type PlayerQuickSearchProps = {
  name?: string;
  placeholder?: string;
  minCharCount?: number; // Minimum characters to start search.
  onValueChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  maxLength?: number;
  required?: boolean;
};

/**
 * Player Quick Search Component.
 * @param props PlayerQuickSearchProps.
 * @returns JSX.Element.
 */
export function PlayerQuickSearch({
  name,
  placeholder,
  minCharCount = 1,
  onValueChange,
  className,
  maxLength = 80,
  required,
}: PlayerQuickSearchProps) {
  const { data: players, loading } = useJsonData<Player[]>(
    getJsonPath("players.json")
  );

  const [value, setValue] = useState("");
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter players based on query.
  const filtered = useMemo(() => {
    if (!query) return [];
    if (query.length < minCharCount) return [];
    return players.filter(
      (p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.ign.toLowerCase().includes(query.toLowerCase())
    );
  }, [players, query, minCharCount]);

  // Handle player selection from dropdown.
  // Returns a synthetic event to match the input's onChange signature.
  function onPlayerSelect(player: Player) {
    setValue(player.name);
    setQuery("");
    setShowDropdown(false);

    const syntheticEvent = {
      target: { name, value: player.name },
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
          {filtered.map((player) => (
            <div
              key={player.name + player.ign}
              className="flex flex-row items-center gap-2 cursor-pointer hover:bg-accent p-2"
              onClick={() => onPlayerSelect(player)}
            >
              <span className="text-xs font-medium">{player.name}</span>
              {player.ign && (
                <span className="text-xs text-muted-foreground">
                  ({player.ign})
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PlayerQuickSearch;
