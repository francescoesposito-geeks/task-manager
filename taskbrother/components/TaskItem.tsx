"use client";
import { taskSchema } from "../lib/schemas/task";
import { useState } from "react";
import TaskFormBody from "./TaskFormBody";

export interface Task {
  id: string;
  title: string;
  description?: string;
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

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleRemove = () => {
    onRemove(task.id);
  };

  const handleSave = () => {
    const result = taskSchema.safeParse({
      title: editTitle,
      description: editDescription,
      priority: editPriority
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    onUpdate({
      ...task,
      title: editTitle.trim(),
      description: editDescription?.trim(),
      priority: editPriority
    });

    setErrors({});
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
      <li className="flex flex-col p-4 text-center gap-4 border border-gray-800 rounded-lg shadow-xl bg-gray-100">
        <TaskFormBody
          initialValues={{
            title: task.title,
            description: task.description,
            priority: task.priority
          }}
          onSubmit={(updatedData) => {
            onUpdate({
              ...task,
              ...updatedData
            });
            setIsEditing(false);
          }}
          className="flex flex-col gap-4"
        >
          <div className="flex gap-2 justify-center mt-2">
            <button
              type="submit"
              className="bg-[#49ba73] hover:bg-green-600 text-white py-1 px-3 rounded cursor-pointer"
            >
              Salva
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="bg-red-600 hover:bg-red-800 text-white py-1 px-3 rounded cursor-pointer"
            >
              Annulla
            </button>
          </div>
        </TaskFormBody>
      </li>
    );
  }

  return (
    <li className="flex flex-col p-4 text-center justify-center min-w-0 gap-4 border rounded-lg shadow-xl bg-gray-100">
      <div className="flex justify-end gap-2">
        <button
          onClick={handleRemove}
          className="transition-transform duration-100 active:scale-95 flex items-center justify-center cursor-pointer w-6 h-6 bg-gray-600 hover:bg-gray-800 text-white rounded-full"
        >
          x
        </button>
      </div>
      <h3 className="border-b border-gray-300 border-opacity-50 pb-2 wrap-break-word">
        {task.title}
      </h3>
      <p className="border-b border-gray-300 border-opacity-50 pb-2 wrap-break-word">
        {task.description}
      </p>
      <span>{task.priority}</span>
      <button
        onClick={() => setIsEditing(true)}
        className=" bg-white hover:bg-gray-200 text-gray-800 cursor-pointer font-semibold py-2 px-4 border border-gray-400 rounded shadow max-w-xl items-center"
      >
        modifica
      </button>
    </li>
  );
}
