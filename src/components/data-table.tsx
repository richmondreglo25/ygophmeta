"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
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
import { Card, CardContent } from "@/components/ui/card";
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
import { DataTableColumnSelectFilter } from "./ui/data-table-column-filter";
import { pluralize } from "@/utils/words";
import { useMediaQuery } from "react-responsive";

export type ColumnFilter = {
  column: string;
};

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchColumn?: string;
  onClick?: (row: TData) => void;
  compact?: boolean;
  pagination?: boolean;
  mobileGridCols?: 1 | 2;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchColumn,
  onClick,
  compact = false,
  pagination = true,
  mobileGridCols = 2,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );

  // Detect mobile viewport (sm: 640px and below)
  const isMobile = useMediaQuery({ maxWidth: 639 });
  const useMobileView = isMobile && !compact;

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: { pageSize: pagination ? 20 : data.length },
    },
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div>
      {/* Column-specific search input */}
      {searchColumn && (
        <div className="mb-4 flex gap-2">
          <Input
            placeholder={`Search ${searchColumn}...`}
            className="w-full sm:max-w-xs border border-gray-300 bg-white text-gray-700 rounded-sm focus:ring-1 focus:ring-gray-400 focus:border-gray-400 hover:border-gray-400"
            value={
              (table.getColumn(searchColumn)?.getFilterValue() as string) || ""
            }
            onChange={(event) =>
              table.getColumn(searchColumn)?.setFilterValue(event.target.value)
            }
          />
        </div>
      )}

      {/* Column dropdown filters row */}
      {(() => {
        const filterableColumns = table
          .getAllLeafColumns()
          .filter((column) => column.columnDef.enableColumnFilter);

        return filterableColumns.length > 0 ? (
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap mb-4">
            {filterableColumns.map((column) => (
              <DataTableColumnSelectFilter
                key={column.id}
                column={column}
                placeholder={`All ${pluralize(column.id, true)}`}
              />
            ))}
          </div>
        ) : null;
      })()}

      {/* Table */}
      <div
        id="data-table-wrapper"
        className={
          useMobileView ? "mobile-table" : "border rounded-sm overflow-hidden"
        }
      >
        <Table id="data-table" compact={compact}>
          <TableHeader className={useMobileView ? "hidden" : ""}>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  if (header.isPlaceholder)
                    return <TableHead key={header.id} />;
                  const enableSorting = header.column.columnDef.enableSorting;
                  const isSorted = header.column.getIsSorted();
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
                        style={{ minWidth: header.column.columnDef.minSize }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
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
                  } ${useMobileView ? "border-0" : ""}`}
                  onClick={() => onClick?.(row.original)}
                >
                  {useMobileView ? (
                    // Mobile card view - single cell spanning all columns.
                    <TableCell colSpan={columns.length} className="p-0">
                      <Card className="hover:shadow-md transition-shadow duration-200 border rounded-sm shadow-sm">
                        <CardContent className="p-4">
                          <div className="flex flex-col">
                            {row.getVisibleCells().map((cell, index) => {
                              // First column as title.
                              if (index === 0) {
                                return (
                                  <div
                                    key={cell.id}
                                    className="-mx-4 -mt-4 mb-3 px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-b"
                                  >
                                    <div className="text-sm font-medium text-blue-900 dark:text-blue-100">
                                      {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext(),
                                      )}
                                    </div>
                                  </div>
                                );
                              }

                              // Return null for now, we'll render columns 2+ separately
                              return null;
                            })}

                            {/* Grid layout for columns starting from index 1 */}
                            <div
                              className={
                                mobileGridCols === 2
                                  ? "grid grid-cols-1 xs:grid-cols-2 gap-2"
                                  : "grid grid-cols-1 gap-3"
                              }
                            >
                              {row
                                .getVisibleCells()
                                .slice(1)
                                .map((cell) => {
                                  const header = cell.column.columnDef.header;
                                  const headerText =
                                    typeof header === "string"
                                      ? header
                                      : String(cell.column.id);
                                  return (
                                    <div
                                      key={cell.id}
                                      className="flex flex-col gap-1.5"
                                    >
                                      <span className="text-[9px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        {headerText}
                                      </span>
                                      <div className="text-sm text-gray-900 dark:text-gray-100">
                                        {flexRender(
                                          cell.column.columnDef.cell,
                                          cell.getContext(),
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TableCell>
                  ) : (
                    // Desktop table view
                    row
                      .getVisibleCells()
                      .map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))
                  )}
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

      {/* Pagination Controls */}
      {pagination && (
        <div className="flex items-center justify-center sm:justify-between flex-wrap gap-2 py-4">
          <div className="items-center gap-2 hidden sm:flex">
            <span className="text-xs">Rows per page:</span>
            <select
              className="border rounded-sm px-2 py-1 text-xs bg-background"
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
              className="rounded-sm"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronFirst size={12} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-sm"
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
              className="rounded-sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight size={12} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-sm"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <ChevronLast size={12} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
