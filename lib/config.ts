// Where tasks and users are saved.
// "local" (default): profiles and tasks in the browser's localStorage, no setup needed.
// "supabase": real login with Supabase Auth and tasks in a Supabase database.
export type StorageMode = "local" | "supabase";

export const STORAGE_MODE: StorageMode =
  process.env.NEXT_PUBLIC_TASKS_STORAGE === "supabase" ? "supabase" : "local";
