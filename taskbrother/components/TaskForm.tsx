import { useState } from "react";
import { Task } from "./TaskItem";

export interface TaskFormProps {
  onAddTask: (newTask: Task) => void;
}

export default function TaskForm({
  onAddTask
}: TaskFormProps): React.JSX.Element {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const nuovoTask: Task = {
      id: crypto.randomUUID(),
      title,
      description,
      priority
    };

    onAddTask(nuovoTask);

    setTitle("");
    setDescription("");
    setPriority("medium");
  };
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Titolo"
        required
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Descrizione"
      />
      <select
        value={priority}
        onChange={(e) =>
          setPriority(e.target.value as "low" | "medium" | "high")
        }
      >
        <option value="low">Bassa</option>
        <option value="medium">Media</option>
        <option value="high">Alta</option>
      </select>
      <button type="submit">Aggiungi Task</button>
    </form>
  );
}
