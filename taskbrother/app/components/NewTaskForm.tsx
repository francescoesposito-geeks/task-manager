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
import {
  SelectContent,
  Select,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectItem
} from "./ui/select";
import { Textarea } from "./ui/textarea";

export interface NewTaskFormProps {
  onAddTask: (task: Task) => void;
}

export default function NewTaskForm({ onAddTask }: NewTaskFormProps) {
  const [formValues, setFormValues] = useState(initialValuesForm);
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

    const newTask = {
      id: crypto.randomUUID(),
      ...result.data,
      description:
        result.data.description !== "" ? result.data.description : undefined,

      deadline: result.data.deadline !== "" ? result.data.deadline : undefined
    };

    onAddTask(newTask);
    setFormValues(initialValuesForm);
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string) => (value: string | null) => {
    setFormValues((prev) => ({ ...prev, [name]: value ?? "" }));
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
          <label
            htmlFor="title"
            className="text-sm font-semibold text-gray-700"
          >
            Titolo del Task
            <span aria-hidden="true"> *</span>
          </label>
          <Input
            name="title"
            value={formValues.title}
            onChange={handleChange}
            placeholder="Titolo"
            aria-describedby={errors.title ? "title-error" : undefined}
            className="border border-gray-300 rounded-md p-2 bg-white"
          />
          {errors.title && (
            <span id="title-error" className="text-red-600 text-sm">
              {errors.title}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="priority"
            className="text-sm font-semibold text-gray-700"
          >
            Importanza
            <span aria-hidden="true"> *</span>
          </label>

          <Select
            items={OPTIONS_PRIORITY}
            value={formValues.priority}
            onValueChange={handleSelectChange("priority")}
          >
            <SelectTrigger
              id="priority"
              aria-describedby={errors.priority ? "priority-error" : undefined}
              className="w-full bg-white border border-gray-300"
            >
              <SelectValue placeholder="Seleziona.." />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {OPTIONS_PRIORITY.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.priority && (
            <span id="priority-error" className="text-red-600 text-sm">
              {errors.priority}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="description"
            className="text-sm font-semibold text-gray-700"
          >
            Descrizione
          </label>
          <Textarea
            name="description"
            id="description"
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
          <label
            htmlFor="urgency"
            className="text-sm font-semibold text-gray-700"
          >
            Priorità
            <span aria-hidden="true"> *</span>
          </label>
          <Select
            items={OPTIONS_URGENCY}
            value={formValues.urgency}
            onValueChange={handleSelectChange("urgency")}
          >
            <SelectTrigger
              id="urgency"
              className="w-full bg-white border border-gray-300"
              aria-describedby={errors.urgency ? "urgency-error" : undefined}
            >
              <SelectValue placeholder="Seleziona.." />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {OPTIONS_URGENCY.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.urgency && (
            <span id="urgency-error" className="text-red-600 text-sm">
              {errors.urgency}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label
            htmlFor="deadline"
            className="text-sm font-semibold text-gray-700"
          >
            Scadenza
          </label>
          <Input
            name="deadline"
            type="date"
            id="deadline"
            value={formValues.deadline}
            onChange={handleChange}
            aria-describedby={errors.deadline ? "deadline-error" : undefined}
            className="border border-gray-300 rounded-md p-2 bg-white cursor-pointer"
          />
          {errors.deadline && (
            <span id="deadline-error" className="text-red-600 text-sm">
              {errors.deadline}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label
            htmlFor="state"
            className="text-sm font-semibold text-gray-700"
          >
            Stato
            <span aria-hidden="true"> *</span>
          </label>

          <Select
            items={OPTIONS_STATE}
            value={formValues.state}
            onValueChange={handleSelectChange("state")}
          >
            <SelectTrigger
              id="state"
              className="w-full bg-white border border-gray-300"
              aria-describedby={errors.state ? "state-error" : undefined}
            >
              <SelectValue placeholder="Seleziona.." />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {OPTIONS_STATE.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.state && (
            <span id="state-error" className="text-red-600 text-sm">
              {errors.state}
            </span>
          )}
        </div>
      </div>

      <Button
        type="submit"
        variant="standard"
        size="compact"
        className="mt-8 w-full"
      >
        Aggiungi task
      </Button>
    </form>
  );
}
