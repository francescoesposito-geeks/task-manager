"use client";
import { useState } from "react";
import { Task } from "./TaskItem";
import { taskSchema } from "../lib/schemas/task";
import { z } from "zod";

export interface TaskFormProps {
  onAddTask: (newTask: Task) => void;
}

export default function TaskForm({
  onAddTask
}: TaskFormProps): React.JSX.Element {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"bassa" | "media" | "alta" | "">("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = taskSchema.safeParse({ title, description, priority });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        fieldErrors[field] = issue.message;
      });

      setErrors(fieldErrors);
      return;
    }

    const nuovoTask: Task = {
      id: crypto.randomUUID(),
      ...result.data
    };

    onAddTask(nuovoTask);

    setTitle("");
    setDescription("");
    setPriority("");
    setErrors({});
  };

  return (
    <div className="flex flex-col items-center mb-16 mt-8  w-full">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 items-center border border-gray-700  rounded-3xl p-8 w-100 shadow-xl bg-gray-100"
        noValidate
      >
        <div className="flex flex-col w-full">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titolo"
            className="border border-gray-300 rounded-md p-2 bg-white"
          />
          {errors.title && (
            <span className="text-red-600 text-sm">{errors.title}</span>
          )}
        </div>

        <div className="flex flex-col w-full">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descrizione"
            className="border border-gray-300 rounded-md p-2 bg-white"
          />
          {errors.description && (
            <span className="text-red-600 text-sm">{errors.description}</span>
          )}
        </div>
        <div className="flex flex-col w-full">
          <select
            value={priority}
            onChange={(e) =>
              setPriority(e.target.value as "bassa" | "media" | "alta" | "")
            }
            className="border border-gray-300 rounded-md p-2 cursor-pointer bg-white"
          >
            <option value="" disabled hidden>
              Seleziona...
            </option>

            <option value="bassa">Bassa</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
          </select>
          {errors.priority && (
            <span className="text-red-600 text-sm">{errors.priority}</span>
          )}
        </div>

        <button
          className="bg-white hover:bg-gray-100 text-gray-800 cursor-pointer font-semibold py-2 px-4 border border-gray-400 rounded-3xl shadow w-42 items-center transition-transform duration-100 active:scale-95"
          type="submit"
        >
          Aggiungi Task
        </button>
      </form>
    </div>
  );
}
