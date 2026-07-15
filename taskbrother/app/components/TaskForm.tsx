"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskSchema, TaskFormData } from "../../lib/schemas/task";
import {
  OPTIONS_STATE,
  OPTIONS_URGENCY,
  OPTIONS_PRIORITY
} from "../../data/selectFormStates";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectItem
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import { cn } from "@/lib/utils";

interface TaskFormProps {
  initialValues?: Partial<TaskFormData>;
  onSubmit: (data: TaskFormData) => void;
  variant?: "full" | "compact";
  heading?: string;
  submitLabel?: string;
  children?: React.ReactNode;
}

export default function TaskForm({
  initialValues,
  onSubmit,
  variant = "full",
  heading,
  submitLabel = "Salva",
  children
}: TaskFormProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: undefined,
      urgency: undefined,
      state: undefined,
      deadline: "",
      ...initialValues
    }
  });

  const submitHandler = (data: TaskFormData) => {
    onSubmit(data);
    reset();
  };

  const isFull = variant === "full";

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      noValidate
      className={cn(
        isFull && "p-6 border-2 border-border rounded-lg shadow-xl bg-card"
      )}
    >
      {isFull && heading && (
        <h3 className="font-bold mb-4 text-lg">{heading}</h3>
      )}

      <div
        className={cn(
          "grid gap-x-6 gap-y-4",
          isFull ? "grid-cols-2" : "grid-cols-1"
        )}
      >
        <div className="flex flex-col gap-1">
          <label
            htmlFor="title"
            className="text-sm font-semibold text-foreground"
          >
            Titolo del Task
            <span aria-hidden="true"> *</span>
          </label>

          <Input
            id="title"
            placeholder="Titolo"
            {...register("title")}
            aria-describedby={errors.title ? "title-error" : undefined}
          />

          {errors.title && (
            <span id="title-error" className="text-destructive text-sm">
              {errors.title.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="priority"
            className="text-sm font-semibold text-foreground"
          >
            Importanza
            <span aria-hidden="true"> *</span>
          </label>
          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <Select
                items={OPTIONS_PRIORITY}
                value={field.value ?? ""}
                onValueChange={field.onChange}
              >
                <SelectTrigger
                  id="priority"
                  className="w-full"
                  aria-describedby={
                    errors.priority ? "priority-error" : undefined
                  }
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
            )}
          />
          {errors.priority && (
            <span id="priority-error" className="text-destructive text-sm">
              {errors.priority.message}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label
            htmlFor="description"
            className="text-sm font-semibold text-foreground"
          >
            Descrizione
          </label>
          <Textarea
            id="description"
            placeholder="Descrizione"
            {...register("description")}
          />
          {errors.description && (
            <span className="text-destructive text-sm">
              {errors.description.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="urgency"
            className="text-sm font-semibold text-foreground"
          >
            Urgenza
            <span aria-hidden="true"> *</span>
          </label>
          <Controller
            name="urgency"
            control={control}
            render={({ field }) => (
              <Select
                items={OPTIONS_URGENCY}
                value={field.value ?? ""}
                onValueChange={field.onChange}
              >
                <SelectTrigger
                  id="urgency"
                  className="w-full"
                  aria-describedby={
                    errors.urgency ? "urgency-error" : undefined
                  }
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
            )}
          />
          {errors.urgency && (
            <span id="urgency-error" className="text-destructive text-sm">
              {errors.urgency.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="deadline"
            className="text-sm font-semibold text-foreground"
          >
            Scadenza
          </label>
          <Input
            id="deadline"
            type="date"
            className="cursor-pointer"
            {...register("deadline")}
          />
          {errors.deadline && (
            <span className="text-destructive text-sm">
              {errors.deadline.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="state"
            className="text-sm font-semibold text-foreground"
          >
            Stato
            <span aria-hidden="true"> *</span>
          </label>
          <Controller
            name="state"
            control={control}
            render={({ field }) => (
              <Select
                items={OPTIONS_STATE}
                value={field.value ?? ""}
                onValueChange={field.onChange}
              >
                <SelectTrigger
                  id="state"
                  className="w-full"
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
            )}
          />
          {errors.state && (
            <span id="state-error" className="text-destructive text-sm">
              {errors.state.message}
            </span>
          )}
        </div>
      </div>

      {children ? (
        <div className={cn(isFull ? "mt-8" : "mt-4")}>{children}</div>
      ) : (
        <Button
          type="submit"
          variant="default"
          size="compact"
          className="mt-8 w-full cursor-pointer"
        >
          {isSubmitting ? "Caricamento..." : submitLabel}
        </Button>
      )}
    </form>
  );
}
