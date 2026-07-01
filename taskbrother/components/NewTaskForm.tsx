"use client";
import { useState } from "react";
import { Column, Task } from "../types/board";
import FormBody, { TaskFormData } from "./FormBody";

export interface NewTaskFormProps {
  columns: Column[];
  onAddTask: (columnId: string, task: Task) => void;
}

export default function NewTaskForm({ columns, onAddTask }: NewTaskFormProps) {
  const [columnId, setColumnId] = useState("");
  const [columnError, setColumnError] = useState("");

  const handleFormSubmit = (taskData: TaskFormData) => {
    if (!columnId) {
      setColumnError("Seleziona una colonna obbligatoriamente");
      return false;
    }

    const nuovoTask: Task = {
      id: crypto.randomUUID(),
      title: taskData.title,
      description: taskData.description || undefined,
      priority: taskData.priority
    };

    onAddTask(columnId, nuovoTask);

    setColumnId("");
    setColumnError("");
    return true;
  };

  return (
    <FormBody
      onSubmit={handleFormSubmit}
      className="flex flex-col p-4  text-center gap-3 border border-gray-300 rounded-lg shadow bg-gray-50"
    >
      <div className="flex flex-col gap-1 text-left">
        <label
          htmlFor="columnSelect"
          className="text-sm font-semibold text-gray-700 px-1"
        >
          Colonna di destinazione
        </label>
        <select
          id="columnSelect"
          value={columnId}
          onChange={(e) => {
            setColumnId(e.target.value);
            setColumnError("");
          }}
          className="border border-gray-300 rounded-md p-2 cursor-pointer bg-white text-gray-900"
        >
          <option value="" disabled>
            Scegli colonna...
          </option>
          {columns.map((col) => (
            <option key={col.id} value={col.id}>
              {col.title}
            </option>
          ))}
        </select>
        {columnError && (
          <span className="text-red-600 text-sm">{columnError}</span>
        )}
      </div>

      <button
        type="submit"
        className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow cursor-pointer mt-2"
      >
        Aggiungi task
      </button>
    </FormBody>
  );
}
