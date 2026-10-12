"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterData } from "../../lib/schemas/auth";
import { getSupabase } from "../../lib/supabase/client";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

// Real login with Supabase Auth: the password is checked by Supabase,
// it is never saved or logged by this app.
export default function AuthForm() {
  const [isRegister, setIsRegister] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema)
  });

  const handleTabSwitch = (toRegister: boolean) => {
    setIsRegister(toRegister);
    setServerError(null);
    setInfo(null);
    reset();
  };

  const onSubmit = async ({ name, email, password }: RegisterData) => {
    setServerError(null);
    setInfo(null);
    const auth = getSupabase().auth;

    if (isRegister) {
      const { data, error } = await auth.signUp({
        email,
        password,
        options: { data: { name } }
      });
      if (error) {
        setServerError(error.message);
      } else if (!data.session) {
        // email confirmation is enabled in the Supabase project
        setInfo(
          "Ti abbiamo inviato un'email: conferma l'indirizzo e poi accedi."
        );
      }
      return;
    }

    const { error } = await auth.signInWithPassword({ email, password });
    if (error) {
      setServerError("Email o password non corretti.");
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto p-6 border mt-24 rounded-lg bg-card text-card-foreground shadow">
      <div className="flex border-b mb-6" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={!isRegister}
          onClick={() => handleTabSwitch(false)}
          className={`flex-1 pb-2 font-semibold text-sm border-b-2 ${
            !isRegister
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground"
          }`}
        >
          Accedi
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={isRegister}
          onClick={() => handleTabSwitch(true)}
          className={`flex-1 pb-2 font-semibold text-sm border-b-2 ${
            isRegister
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground"
          }`}
        >
          Registrati
        </button>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-4"
      >
        {isRegister && (
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="text-sm font-medium">
              Nome
            </label>
            <Input id="name" placeholder="nome" {...register("name")} />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>
        )}

        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="nome@esempio.it"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <Input
            id="password"
            type="password"
            autoComplete={isRegister ? "new-password" : "current-password"}
            placeholder="••••••••"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-xs text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        {serverError && (
          <p className="text-sm text-destructive" role="alert">
            {serverError}
          </p>
        )}
        {info && (
          <p className="text-sm text-primary" role="status">
            {info}
          </p>
        )}

        <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
          {isRegister ? "Registrati" : "Accedi"}
        </Button>
      </form>
    </div>
  );
}
