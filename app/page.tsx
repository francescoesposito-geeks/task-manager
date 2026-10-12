"use client";

import { useSession } from "../lib/session/SessionContext";
import AuthForm from "./components/AuthForm";
import BoardManager from "./components/BoardManager";
import ProfilePicker from "./components/ProfilePicker";

export default function Home() {
  const { mode, user, isReady } = useSession();

  if (!isReady) {
    return (
      <p className="p-10 text-center text-muted-foreground" role="status">
        Caricamento...
      </p>
    );
  }

  if (!user) {
    return (
      <main className="flex flex-1 w-full flex-col px-4 md:px-8 pb-16">
        {mode === "supabase" ? <AuthForm /> : <ProfilePicker />}
      </main>
    );
  }

  return (
    <main className="w-full max-w-7xl mx-auto px-4 md:px-8">
      <BoardManager user={user} />
    </main>
  );
}
