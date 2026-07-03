"use client";
import { useState } from "react";
import { columnSchema } from "../lib/schemas/column";

export interface NewColumnFormProps {
  onAddColumn: (title: string) => void;
}

export default function NewColumnForm({ onAddColumn }: NewColumnFormProps) {
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = columnSchema.safeParse({ title });

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    onAddColumn(result.data.title);
    setTitle("");
    setError("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 border border-gray-300 rounded-md p-6 w-72 self-start bg-gray-50 shadow-2xl"
      noValidate
    >
      <h3 className="font-bold text-lg">Nuova Colonna</h3>

      <div className="flex flex-col">
        <label
          htmlFor="columnName"
          className=" text-sm font-medium text-gray-900"
        >
          Column Name
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nome colonna"
          className="border border-gray-300 rounded-md p-2"
        />
        {error && <span className="text-red-600 text-sm">{error}</span>}
      </div>

      <button
        type="submit"
        className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow cursor-pointer"
      >
        Aggiungi colonna
      </button>
    </form>
  );
}
