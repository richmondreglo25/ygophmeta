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
