import { useState, useMemo, useRef, useEffect, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { useJsonData } from "@/app/data/api";
import { getJsonPath } from "@/utils/enviroment";
import { Shop } from "@/types/shop";

type HostQuickSearchProps = {
  name?: string;
  placeholder?: string;
  minCharCount?: number;
  onValueChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  maxLength?: number;
  required?: boolean;
};

/**
 * Host Quick Search Component.
 * @param props HostQuickSearchProps.
 * @returns JSX.Element.
 */
export function HostQuickSearch({
  name,
  placeholder,
  minCharCount = 1,
  onValueChange,
  className,
  maxLength = 80,
  required,
}: HostQuickSearchProps) {
  const { data: shops, loading } = useJsonData<Shop[]>(
    getJsonPath("shops.json")
  );

  const [value, setValue] = useState("");
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    if (!query) return [];
    if (query.length < minCharCount) return [];
    return shops.filter((s) =>
      s.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [shops, query, minCharCount]);

  // Handle host selection from dropdown.
  // Returns a synthetic event to match the input's onChange signature.
  function onHostSelect(shop: Shop) {
    setValue(shop.name);
    setQuery("");
    setShowDropdown(false);

    const syntheticEvent = {
      target: { name, value: shop.name },
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

  // Close dropdown on outside click.
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
          {filtered.map((shop) => (
            <div
              key={shop.name}
              className="flex flex-row items-center gap-2 cursor-pointer hover:bg-accent p-2"
              onClick={() => onHostSelect(shop)}
            >
              <span className="text-xs font-medium">{shop.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HostQuickSearch;
