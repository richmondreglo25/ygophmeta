/* eslint-disable @typescript-eslint/no-explicit-any */
import { Event } from "@/columns/events";
import { useEffect, useState } from "react";

/**
 * useJsonData - React hook to fetch and return data from a JSON file.
 * @param path - Path to the JSON file (relative to public/)
 * @returns { data, loading, error }
 */
export function useJsonData<T>(path: string) {
  const [data, setData] = useState<T>([] as T);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch(path)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
        return res.json();
      })
      .then((json) => setData(json))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [path]);

  return { data, loading, error };
}

type YearMonth = { year: number; month: number };
type YearMonthInput = YearMonth | Date | string;

function toYearMonth(input: YearMonthInput): YearMonth {
  if (typeof input === "string") {
    // Expecting "YYYY-MM"
    const [year, month] = input.split("-").map(Number);
    return { year, month };
  }
  if (input instanceof Date) {
    return { year: input.getFullYear(), month: input.getMonth() + 1 };
  }
  return input;
}

/**
 * useEventsByYearMonthRange - React hook to fetch events for a range of year and month.
 * Accepts {year, month}, Date, or "YYYY-MM" string for start/end.
 * @param start - { year: number, month: number } | Date | "YYYY-MM"
 * @param end - { year: number, month: number } | Date | "YYYY-MM"
 * @returns { data, loading, error }
 */
export function useEventsByYearMonthRange(
  start: YearMonthInput,
  end: YearMonthInput
) {
  const [data, setData] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        const s = toYearMonth(start);
        const e = toYearMonth(end);
        const files: string[] = [];
        for (let y = s.year; y <= e.year; y++) {
          const startM = y === s.year ? s.month : 1;
          const endM = y === e.year ? e.month : 12;
          for (let m = startM; m <= endM; m++) {
            files.push(
              `/data/events/${y}-${m.toString().padStart(2, "0")}.json`
            );
          }
        }
        const results = await Promise.all(
          files.map(async (path) => {
            const res = await fetch(path);
            if (res.ok) return res.json();
            return [];
          })
        );
        const flattenedData = results.flat();
        // Sort by date descending (newest first)
        const sortedData = flattenedData.sort(
          (a: Event, b: Event) =>
            new Date(b.when).getTime() - new Date(a.when).getTime()
        );
        if (isMounted) setData(sortedData);
      } catch (err: any) {
        if (isMounted) setError(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchAll();
    return () => {
      isMounted = false;
    };
  }, [start, end]);

  return { data, loading, error };
}
