import { useCallback, useMemo, useSyncExternalStore } from "react";

// fired when this tab changes localStorage, so every hook using the same key updates
const LOCAL_CHANGE_EVENT = "local-storage-change";

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(LOCAL_CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(LOCAL_CHANGE_EVENT, onChange);
  };
}

function readRaw(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function parse<T>(raw: string | null, fallback: T): T {
  if (raw === null) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

// Returns [value, setValue, isLoaded]. On the server there is no localStorage:
// isLoaded is false until the component runs in the browser.
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (next: T | ((previous: T) => T)) => void, boolean] {
  const raw = useSyncExternalStore<string | null | undefined>(
    subscribe,
    () => readRaw(key),
    () => undefined
  );

  const isLoaded = raw !== undefined;
  const value = useMemo(
    () => parse(raw ?? null, initialValue),
    [raw, initialValue]
  );

  const setValue = useCallback(
    (next: T | ((previous: T) => T)) => {
      const previous = parse(readRaw(key), initialValue);
      const resolved =
        typeof next === "function"
          ? (next as (previous: T) => T)(previous)
          : next;
      try {
        localStorage.setItem(key, JSON.stringify(resolved));
      } catch (error) {
        console.error("Errore scrittura localStorage:", error);
      }
      window.dispatchEvent(new Event(LOCAL_CHANGE_EVENT));
    },
    [key, initialValue]
  );

  return [value, setValue, isLoaded];
}
