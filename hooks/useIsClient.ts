import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

// false during server rendering, true in the browser
export function useIsClient(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}
