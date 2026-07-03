"use client";
import { useState } from "react";
import { Column, Task } from "../types/board";
import { taskSchema } from "../lib/schemas/task";

export interface NewTaskFormProps {
  columns: Column[];
  onAddTask: (columnId: string, task: Task) => void;
}

export default function NewTaskForm({ columns, onAddTask }: NewTaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"bassa" | "media" | "alta" | "">("");
  const [columnId, setColumnId] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = taskSchema.safeParse({ title, description, priority });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    if (!columnId) {
      setErrors((prev) => ({ ...prev, columnId: "Seleziona una colonna" }));
      return;
    }

    onAddTask(columnId, {
      id: crypto.randomUUID(),
      title: result.data.title,
      description: result.data.description || undefined,
      priority: result.data.priority
    });

    setTitle("");
    setDescription("");
    setPriority("");
    setColumnId("");
    setErrors({});
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 border border-gray-300 rounded-lg shadow-xl bg-gray-50"
      noValidate
    >
      <h3 className="font-bold mb-4 text-lg">Nuova Task</h3>
      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">
            Titolo del Task
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titolo"
            className="border border-gray-300 rounded-md p-2 bg-white"
          />
          {errors.title && (
            <span className="text-red-600 text-sm">{errors.title}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">
            Livello di Priorità
          </label>
          <select
            value={priority}
            onChange={(e) =>
              setPriority(e.target.value as "bassa" | "media" | "alta")
            }
            className="border border-gray-300 rounded-md p-2 bg-white cursor-pointer"
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

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">
            Descrizione
          </label>
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

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">
            Stato della Task
          </label>
          <select
            value={columnId}
            onChange={(e) => setColumnId(e.target.value)}
            className="border border-gray-300 rounded-md p-2 bg-white cursor-pointer"
          >
            <option value="" disabled>
              Seleziona...
            </option>
            {columns.map((col) => (
              <option key={col.id} value={col.id}>
                {col.title}
              </option>
            ))}
          </select>
          {errors.columnId && (
            <span className="text-red-600 text-sm">{errors.columnId}</span>
          )}
        </div>
      </div>

      <button
        type="submit"
        className="mt-5 w-full bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow cursor-pointer"
      >
        Aggiungi task
      </button>
    </form>
  );
}
