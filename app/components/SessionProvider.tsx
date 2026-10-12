"use client";

import { useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { STORAGE_MODE } from "../../lib/config";
import {
  getSupabase,
  isSupabaseConfigured
} from "../../lib/supabase/client";
import {
  SessionContext,
  SessionContextValue,
  SessionUser
} from "../../lib/session/SessionContext";
import {
  ACTIVE_PROFILE_KEY,
  NO_PROFILES,
  PROFILES_KEY,
  LocalProfile
} from "../../lib/session/localProfiles";
import { useLocalStorage } from "../../hooks/useLocalStorage";

// local mode: the "user" is the profile chosen in ProfilePicker
function LocalSessionProvider({ children }: { children: React.ReactNode }) {
  const [profiles, , profilesLoaded] = useLocalStorage<LocalProfile[]>(
    PROFILES_KEY,
    NO_PROFILES
  );
  const [activeId, setActiveId, activeLoaded] = useLocalStorage<string | null>(
    ACTIVE_PROFILE_KEY,
    null
  );

  const value = useMemo<SessionContextValue>(
    () => ({
      mode: "local",
      user: profiles.find((profile) => profile.id === activeId) ?? null,
      isReady: profilesLoaded && activeLoaded,
      signOut: async () => setActiveId(null)
    }),
    [profiles, activeId, profilesLoaded, activeLoaded, setActiveId]
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

function toSessionUser(session: Session | null): SessionUser | null {
  if (!session) return null;
  const name = session.user.user_metadata?.name as string | undefined;
  return { id: session.user.id, name: name || session.user.email || "Utente" };
}

// supabase mode: the user comes from Supabase Auth
function SupabaseSessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const supabase = getSupabase();

    supabase.auth.getSession().then(({ data }) => {
      setUser(toSessionUser(data.session));
      setIsReady(true);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(toSessionUser(session));
      setIsReady(true);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  const value = useMemo<SessionContextValue>(
    () => ({
      mode: "supabase",
      user,
      isReady,
      signOut: async () => {
        await getSupabase().auth.signOut();
      }
    }),
    [user, isReady]
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

// shown when Supabase mode is on but the keys are missing in .env.local
function SupabaseNotConfigured() {
  return (
    <main className="w-full max-w-lg mx-auto mt-24 px-4">
      <div
        className="p-6 border border-destructive rounded-lg bg-card flex flex-col gap-3"
        role="alert"
      >
        <h1 className="text-xl font-bold">Supabase non è configurato</h1>
        <p className="text-sm">
          In <code>.env.local</code> c&apos;è{" "}
          <code>NEXT_PUBLIC_TASKS_STORAGE=supabase</code>, ma mancano{" "}
          <code>NEXT_PUBLIC_SUPABASE_URL</code> e{" "}
          <code>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code>.
        </p>
        <p className="text-sm text-muted-foreground">
          Aggiungi le chiavi (vedi <code>.env.example</code> e il README) e
          riavvia <code>npm run dev</code>, oppure torna alla modalità locale
          con <code>NEXT_PUBLIC_TASKS_STORAGE=local</code>.
        </p>
      </div>
    </main>
  );
}

export default function SessionProvider({
  children
}: {
  children: React.ReactNode;
}) {
  if (STORAGE_MODE === "supabase" && !isSupabaseConfigured()) {
    return <SupabaseNotConfigured />;
  }
  return STORAGE_MODE === "supabase" ? (
    <SupabaseSessionProvider>{children}</SupabaseSessionProvider>
  ) : (
    <LocalSessionProvider>{children}</LocalSessionProvider>
  );
}
