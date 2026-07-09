"use client";
import { useState } from "react";
import { taskSchema } from "../lib/schemas/task";
import { Task } from "../types/board";

export interface TaskFormData {
  title: string;
  description?: string;
  priority: "importante" | "non-importante";
  urgency: "urgente" | "non-urgente";
}

interface TaskFormBodyProps {
  initialValues?: {
    title: string;
    description?: string;
    priority: "importante" | "non-importante" | "";
    urgency: "urgente" | "non-urgente" | "";
  };
  onSubmit: (data: TaskFormData) => boolean;
  children?: React.ReactNode;
  className?: string;
}

export default function FormUpdateTask({
  initialValues,
  onSubmit,
  children,
  className
}: TaskFormBodyProps) {
  const [title, setTitle] = useState(initialValues?.title || "");
  const [description, setDescription] = useState(
    initialValues?.description || ""
  );
  const [priority, setPriority] = useState<
    "importante" | "non-importante" | ""
  >(initialValues?.priority || "");
  const [urgency, setUrgency] = useState<"urgente" | "non-urgente" | "">(
    initialValues?.urgency || ""
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    const result = taskSchema.safeParse({
      title,
      description,
      priority,
      urgency
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    const success = onSubmit(result.data);
    if (success && !initialValues) {
      setTitle("");
      setDescription("");
      setPriority("");
      setUrgency("");
      setErrors({});
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className} noValidate>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col w-full gap-1 text-left">
          <label className="text-sm font-semibold text-gray-700 px-1">
            Titolo del Task
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titolo"
            className="border border-gray-300 rounded-md p-2 bg-white text-gray-900"
          />
          {errors.title && (
            <span className="text-red-600 text-sm">{errors.title}</span>
          )}
        </div>

        <div className="flex flex-col w-full gap-1 text-left">
          <label className="text-sm font-semibold text-gray-700 px-1">
            Descrizione
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descrizione"
            className="border border-gray-300 rounded-md p-2 bg-white text-gray-900"
          />
          {errors.description && (
            <span className="text-red-600 text-sm">{errors.description}</span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col w-full gap-1 text-left">
          <label className="text-sm font-semibold text-gray-700 px-1">
            Importanza
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Task["priority"])}
            className="border border-gray-300 rounded-md p-2 cursor-pointer bg-white text-gray-900"
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

        <div className="flex flex-col w-full gap-1 text-left">
          <label className="text-sm font-semibold text-gray-700 px-1">
            Urgenza
          </label>
          <select
            value={urgency}
            onChange={(e) => setUrgency(e.target.value as Task["urgency"])}
            className="border border-gray-300 rounded-md p-2 cursor-pointer bg-white text-gray-900"
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

        {children}
      </div>
    </form>
  );
}
