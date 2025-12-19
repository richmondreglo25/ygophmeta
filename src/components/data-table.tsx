"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import React from "react";
import {
  ChevronDownIcon,
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDownIcon,
  ChevronUpIcon,
} from "lucide-react";
import { Input } from "./ui/input";

export type ColumnFilter = {
  column: string;
};

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchColumn?: string; // Column key to apply search filter.
  onClick?: (row: TData) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchColumn,
  onClick,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: { pageSize: 20 },
    },
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div>
      {searchColumn && (
        <div className="mb-4 flex gap-2">
          <Input
            placeholder={`Search ${searchColumn}...`}
            className="w-full sm:max-w-xs rounded-none"
            value={
              (table.getColumn(searchColumn)?.getFilterValue() as string) || ""
            }
            onChange={(event) =>
              table.getColumn(searchColumn)?.setFilterValue(event.target.value)
            }
          />
        </div>
      )}
      <div className="overflow-hidden border">
        <Table id="data-table">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  if (header.isPlaceholder)
                    return <TableHead key={header.id} />;
                  const enableSorting = header.column.columnDef.enableSorting;
                  const isSorted = header.column.getIsSorted();
                  const minWidthClass = header.column.columnDef.minSize
                    ? `w-[${header.column.columnDef.minSize}px]`
                    : "";
                  return (
                    <TableHead
                      key={header.id}
                      onClick={
                        enableSorting
                          ? header.column.getToggleSortingHandler()
                          : undefined
                      }
                      className={
                        header.column.getCanSort()
                          ? "cursor-pointer select-none"
                          : ""
                      }
                    >
                      <span
                        className={`flex justify-start items-center gap-1`}
                        style={
                          minWidthClass
                            ? { minWidth: header.column.columnDef.minSize }
                            : {}
                        }
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        <div className={`${enableSorting ? "" : "hidden"}`}>
                          {isSorted === false && (
                            <ChevronsUpDownIcon size={12} />
                          )}
                          {isSorted === "asc" && <ChevronUpIcon size={12} />}
                          {isSorted === "desc" && <ChevronDownIcon size={12} />}
                        </div>
                      </span>
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={`${
                    onClick ? "cursor-pointer hover:bg-muted/50" : ""
                  }`}
                  onClick={() => onClick?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No Results
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-center sm:justify-between flex-wrap gap-2 py-4">
        <div className="items-center gap-2 hidden sm:flex">
          <span className="text-xs">Rows per page:</span>
          <select
            className="border px-2 py-1 text-xs bg-background"
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
          >
            {[10, 20, 50, 100].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-none"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronFirst size={12} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-none"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft size={12} />
          </Button>
          <span className="px-2 text-xs whitespace-nowrap">
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="rounded-none"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight size={12} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-none"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronLast size={12} />
          </Button>
        </div>
      </div>
    </div>
  );
}
