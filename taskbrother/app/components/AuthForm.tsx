"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const registerSchema = z.object({
  name: z.string().optional(),
  age: z
    .number("inserisci un numero")
    .int("L'età deve essere un numero intero")
    .optional(),
  email: z.email("Email non valida"),
  password: z.string().min(8, "La password deve avere almeno 8 caratteri")
});

type RegisterData = z.infer<typeof registerSchema>;

export default function AuthForm() {
  const [isRegister, setIsRegister] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema)
  });

  const handleTabSwitch = (toRegister: boolean) => {
    setIsRegister(toRegister);
    reset();
  };

  const onSubmit = (data: RegisterData) => {
    console.log(data);
  };

  return (
    <div className="w-full max-w-sm mx-auto p-6 border mt-32 rounded-lg bg-card text-card-foreground shadow">
      <div className="flex border-b mb-6">
        <button
          type="button"
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

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {isRegister && (
          <>
            <div className="flex flex-col gap-1">
              <label htmlFor="name" className="text-sm font-medium">
                Nome
              </label>
              <Input id="name" placeholder="nome" {...register("name")} />
              {errors.name && (
                <p className="text-xs text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="age" className="text-sm font-medium">
                Età
              </label>
              <Input
                id="age"
                type="number"
                placeholder="anni"
                {...register("age")}
              />
              {errors.age && (
                <p className="text-xs text-destructive">{errors.age.message}</p>
              )}
            </div>
          </>
        )}

        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="email@gmail.it"
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
            placeholder="••••••••"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-xs text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full mt-2">
          {isRegister ? "Registrati" : "Accedi"}
        </Button>
      </form>
    </div>
  );
}
