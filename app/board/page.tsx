import { redirect } from "next/navigation";

// the board is now on the home page: old /board links still work
export default function BoardPage() {
  redirect("/");
}
