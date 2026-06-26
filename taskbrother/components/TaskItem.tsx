"use client";
import { useState } from "react";

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: "bassa" | "media" | "alta";
}

export interface TaskItemProps {
  task: Task;
  onRemove: (id: string) => void;
  onUpdate: (updatedTask: Task) => void;
}

export default function TaskItem({ task, onRemove, onUpdate }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description);
  const [editPriority, setEditPriority] = useState(task.priority);

  const handleRemove = () => {
    onRemove(task.id);
  };

  const handleSave = () => {
    onUpdate({
      ...task,
      title: editTitle,
      description: editDescription,
      priority: editPriority
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditPriority(task.priority);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <li className="flex flex-col p-4 text-center gap-4 border border-grey-200 rounded-lg shadow-xl">
        <input
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="border border-gray-300 rounded-md p-2"
        />
        <textarea
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          className="border border-gray-300 rounded-md p-2"
        />
        <select
          value={editPriority}
          onChange={(e) =>
            setEditPriority(e.target.value as "bassa" | "media" | "alta")
          }
          className="border border-gray-300 rounded-md p-2 cursor-pointer"
        >
          <option value="bassa">Bassa</option>
          <option value="media">Media</option>
          <option value="alta">Alta</option>
        </select>
        <div className="flex gap-2 justify-center">
          <button
            onClick={handleSave}
            className="bg-[#49ba73] hover:bg-green-600 text-white py-1 px-3 rounded cursor-pointer"
          >
            Salva
          </button>
          <button
            onClick={handleCancel}
            className="bg-red-600 hover:bg-red-800 text-white py-1 px-3 rounded cursor-pointer"
          >
            Annulla
          </button>
        </div>
      </li>
    );
  }

  return (
    <li className="flex flex-col p-4 text-center justify-center gap-4 border border-grey-200 rounded-lg shadow-xl">
      <div className="flex justify-end gap-2">
        <button
          onClick={handleRemove}
          className="transition-transform duration-100 active:scale-95 flex items-center justify-center cursor-pointer w-6 h-6 bg-gray-600 hover:bg-gray-800 text-white rounded-full"
        >
          x
        </button>
      </div>
      <h3 className="border-b pb-2">{task.title}</h3>
      <p className="border-b pb-2 flex-wrap">{task.description}</p>
      <span>{task.priority}</span>
      <button
        onClick={() => setIsEditing(true)}
        className=" bg-white hover:bg-gray-100 text-gray-800 cursor-pointer font-semibold py-2 px-4 border border-gray-400 rounded shadow max-w-xl items-center"
      >
        modifica
      </button>
    </li>
  );
}
