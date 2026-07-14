"use client";
import { useState } from "react";
import { Task } from "../../types/board";
import { taskSchema } from "../../lib/schemas/task";
import {
  OPTIONS_STATE,
  OPTIONS_URGENCY,
  OPTIONS_PRIORITY
} from "../../data/selectFormStates";
import { initialValuesForm } from "../../data/initialValuesForm";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export interface NewTaskFormProps {
  onAddTask: (task: Task) => void;
}

export default function NewTaskForm({ onAddTask }: NewTaskFormProps) {
  const [formValues, setformValues] = useState(initialValuesForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});

    const result = taskSchema.safeParse(formValues);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    let newTask = {
      id: crypto.randomUUID(),
      title: result.data.title,
      description: result.data.description || undefined,
      priority: result.data.priority,
      urgency: result.data.urgency,
      state: result.data.state,
      deadline: result.data.deadline || undefined
    };

    onAddTask(newTask);
    setformValues(initialValuesForm);
    setErrors({});
  };
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setformValues((prev) => ({ ...prev, [name]: value }));
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
            Titolo del Task*
          </label>
          <Input
            name="title"
            value={formValues.title}
            onChange={handleChange}
            placeholder="Titolo"
            className="border border-gray-300 rounded-md p-2 bg-white"
          />
          {errors.title && (
            <span className="text-red-600 text-sm">{errors.title}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">
            Importanza*
          </label>
          <select
            name="priority"
            value={formValues.priority}
            onChange={handleChange}
            className="border border-gray-300 rounded-md p-2 bg-white cursor-pointer"
          >
            <option value="" disabled hidden>
              Seleziona...
            </option>
            {OPTIONS_PRIORITY.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
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
            name="description"
            value={formValues.description}
            onChange={handleChange}
            placeholder="Descrizione"
            className="border border-gray-300 rounded-md p-2 bg-white"
          />
          {errors.description && (
            <span className="text-red-600 text-sm">{errors.description}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">
            Priorità*
          </label>
          <select
            name="urgency"
            value={formValues.urgency}
            onChange={handleChange}
            className="border border-gray-300 rounded-md p-2 bg-white cursor-pointer"
          >
            <option value="" disabled hidden>
              Seleziona...
            </option>
            {OPTIONS_URGENCY.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          {errors.urgency && (
            <span className="text-red-600 text-sm">{errors.urgency}</span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">
            Scadenza
          </label>
          <Input
            name="deadline"
            type="date"
            value={formValues.deadline}
            onChange={handleChange}
            className="border border-gray-300 rounded-md p-2 bg-white cursor-pointer"
          />
          {errors.deadline && (
            <span className="text-red-600 text-sm">{errors.deadline}</span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">Stato*</label>
          <select
            name="state"
            value={formValues.state}
            onChange={handleChange}
            className="border border-gray-300 rounded-md p-2 bg-white cursor-pointer"
          >
            <option value="" disabled hidden>
              Seleziona...
            </option>
            {OPTIONS_STATE.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          {errors.state && (
            <span className="text-red-600 text-sm">{errors.state}</span>
          )}
        </div>
      </div>

      <Button
        type="submit"
        variant="standard"
        size="compact"
        className="mt-5 w-full"
      >
        Aggiungi task
      </Button>
    </form>
  );
}
