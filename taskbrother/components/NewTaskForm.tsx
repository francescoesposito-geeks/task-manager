"use client";
import { useState } from "react";
import { Task } from "../types/board";
import { taskSchema } from "../lib/schemas/task";
import { getColumnIdFromTask } from "../utils/getColumnId";

export interface NewTaskFormProps {
  onAddTask: (columnId: string, task: Task) => void;
}

export default function NewTaskForm({ onAddTask }: NewTaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<
    "importante" | "non-importante" | ""
  >("");
  const [urgency, setUrgency] = useState<"urgente" | "non-urgente" | "">("");
  const [state, setState] = useState<
    "to-do" | "doing" | "testing" | "done" | ""
  >("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = taskSchema.safeParse({
      title,
      description,
      priority,
      urgency,
      state
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    const columnId = getColumnIdFromTask(
      result.data.priority,
      result.data.urgency
    );

    onAddTask(columnId, {
      id: crypto.randomUUID(),
      title: result.data.title,
      description: result.data.description || undefined,
      priority: result.data.priority,
      urgency: result.data.urgency,
      state: result.data.state
    });

    setTitle("");
    setDescription("");
    setPriority("");
    setUrgency("");
    setState("");
    setErrors({});
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 border-2 border-gray-300 rounded-lg shadow-xl bg-gray-50"
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
            Importanza
          </label>
          <select
            value={priority}
            onChange={(e) =>
              setPriority(e.target.value as "importante" | "non-importante")
            }
            className="border border-gray-300 rounded-md p-2 bg-white cursor-pointer"
          >
            <option value="" disabled hidden>
              Seleziona...
            </option>
            <option value="importante">Importante</option>
            <option value="non-importante">Non importante</option>
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
            Priorità
          </label>
          <select
            value={urgency}
            onChange={(e) =>
              setUrgency(e.target.value as "urgente" | "non-urgente")
            }
            className="border border-gray-300 rounded-md p-2 bg-white cursor-pointer"
          >
            <option value="" disabled hidden>
              Seleziona...
            </option>
            <option value="urgente">Urgente</option>
            <option value="non-urgente">Non urgente</option>
          </select>
          {errors.urgency && (
            <span className="text-red-600 text-sm">{errors.urgency}</span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">Stato</label>
          <select
            value={state}
            onChange={(e) =>
              setState(e.target.value as "to-do" | "doing" | "testing" | "done")
            }
            className="border border-gray-300 rounded-md p-2 bg-white cursor-pointer"
          >
            <option value="" disabled hidden>
              Seleziona...
            </option>
            <option value="to-do">To do</option>
            <option value="doing">Doing</option>
            <option value="testing">Testing</option>
            <option value="done">Done</option>
          </select>
          {errors.state && (
            <span className="text-red-600 text-sm">{errors.state}</span>
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
