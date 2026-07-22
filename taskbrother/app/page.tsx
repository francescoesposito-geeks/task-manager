"use client";

import { useState } from "react";
import AuthForm from "./components/AuthForm";

export default function Home() {
  const [sessio, setSession] = useState(null);
  return (
    <main className="flex flex-1 w-full flex-col justify-between py-16 px-4 md:px-8">
      <AuthForm />
    </main>
  );
}
