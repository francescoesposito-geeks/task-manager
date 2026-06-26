"use client";
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
  const [priority, setPriority] = useState<"bassa" | "media" | "alta">("media");

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
    setPriority("media");
  };
  return (
    <div className=" flex flex-col items-center mb-16 ">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 items-center border border-gray-700 rounded-md p-8 w-64 shadow-xl"
      >
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titolo"
          required
          className="border border-gray-300 rounded-md p-2"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descrizione"
          className="border border-gray-300 rounded-md p-2"
        />
        <select
          value={priority}
          onChange={(e) =>
            setPriority(e.target.value as "bassa" | "media" | "alta")
          }
          className="border border-gray-300 rounded-md p-2 cursor-pointer"
        >
          <option value="bassa">Bassa</option>
          <option value="media">Media</option>
          <option value="alta">Alta</option>
        </select>
        <button
          className=" bg-white hover:bg-gray-100 text-gray-800 cursor-pointer font-semibold py-2 px-4 border border-gray-400 rounded shadow w-42 items-center transition-transform duration-100 active:scale-95"
          type="submit"
        >
          Aggiungi Task
        </button>
      </form>
    </div>
  );
}
