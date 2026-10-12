import { createContext, useContext } from "react";
import type { StorageMode } from "../config";

export interface SessionUser {
  id: string;
  name: string;
}

export interface SessionContextValue {
  mode: StorageMode;
  user: SessionUser | null;
  isReady: boolean;
  signOut: () => Promise<void>;
}

export const SessionContext = createContext<SessionContextValue | null>(null);

export function useSession(): SessionContextValue {
  const session = useContext(SessionContext);
  if (!session) {
    throw new Error("useSession must be used inside SessionProvider");
  }
  return session;
}
