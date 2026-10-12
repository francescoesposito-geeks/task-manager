"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, ProfileData } from "../../lib/schemas/auth";
import {
  ACTIVE_PROFILE_KEY,
  NO_PROFILES,
  PROFILES_KEY,
  LocalProfile
} from "../../lib/session/localProfiles";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

// Local mode has no passwords: profiles only keep separate boards
// on this browser. Real login is available in Supabase mode.
export default function ProfilePicker() {
  const [profiles, setProfiles] = useLocalStorage<LocalProfile[]>(
    PROFILES_KEY,
    NO_PROFILES
  );
  const [, setActiveId] = useLocalStorage<string | null>(
    ACTIVE_PROFILE_KEY,
    null
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ProfileData>({ resolver: zodResolver(profileSchema) });

  const onCreate = (data: ProfileData) => {
    const profile: LocalProfile = { id: crypto.randomUUID(), name: data.name };
    setProfiles((previous) => [...previous, profile]);
    setActiveId(profile.id);
    reset();
  };

  return (
    <div className="w-full max-w-sm mx-auto p-6 border mt-24 rounded-lg bg-card text-card-foreground shadow flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Chi sta usando la board?</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Ogni profilo ha le sue task. I dati restano salvati in questo browser.
        </p>
      </div>

      {profiles.length > 0 && (
        <ul className="flex flex-col gap-2">
          {profiles.map((profile) => (
            <li key={profile.id}>
              <Button
                variant="outline"
                size="lg"
                className="w-full justify-start"
                onClick={() => setActiveId(profile.id)}
              >
                {profile.name}
              </Button>
            </li>
          ))}
        </ul>
      )}

      <form
        onSubmit={handleSubmit(onCreate)}
        noValidate
        className="flex flex-col gap-2"
      >
        <label htmlFor="profile-name" className="text-sm font-medium">
          {profiles.length > 0
            ? "Oppure crea un nuovo profilo"
            : "Crea il tuo profilo"}
        </label>
        <div className="flex gap-2">
          <Input
            id="profile-name"
            placeholder="es. Ciro"
            autoComplete="off"
            aria-invalid={errors.name ? true : undefined}
            {...register("name")}
          />
          <Button type="submit" size="lg">
            Crea
          </Button>
        </div>
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
      </form>
    </div>
  );
}
