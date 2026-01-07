import { Column } from "@tanstack/react-table";

interface DataTableColumnSelectFilterProps<TData, TValue> {
  column: Column<TData, TValue>;
  placeholder?: string;
}

export function DataTableColumnSelectFilter<TData, TValue>({
  column,
  placeholder,
}: DataTableColumnSelectFilterProps<TData, TValue>) {
  // Only display filter if column.enableColumnFilter is true
  if (!column.columnDef.enableColumnFilter) {
    return null;
  }

  // Always convert unique values to strings for select options and sort them
  const uniqueValues = Array.from(
    column.getFacetedUniqueValues?.().keys() ?? []
  )
    .map(String)
    .sort((a, b) => a.localeCompare(b));

  // Ensure the value is a string (or empty string for undefined)
  const filterValue = column.getFilterValue();
  const value = typeof filterValue === "undefined" ? "" : String(filterValue);

  return (
    <select
      className="flex h-9 w-full sm:w-auto sm:max-w-[250px] items-center justify-between whitespace-nowrap rounded-sm border border-input bg-transparent px-3 py-2 text-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus-visible:ring-0 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
      value={value}
      onChange={(e) => column.setFilterValue(e.target.value || undefined)}
    >
      <option value="">{placeholder || `All`}</option>
      {uniqueValues.map((val) => (
        <option key={val} value={val}>
          {val}
        </option>
      ))}
    </select>
  );
}
