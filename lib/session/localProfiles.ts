import { STORAGE_KEYS } from "../storageKeys";

export interface LocalProfile {
  id: string;
  name: string;
}

export const PROFILES_KEY = STORAGE_KEYS.profiles;
export const ACTIVE_PROFILE_KEY = STORAGE_KEYS.activeProfile;
export const NO_PROFILES: LocalProfile[] = [];
