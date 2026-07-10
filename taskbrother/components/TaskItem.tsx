"use client";
import { useState } from "react";
import { Task } from "../types/board";
import FormUpdateTask, { TaskFormData } from "./FormUpdateTask";

export interface TaskItemProps {
  task: Task;
  currentColumnId: string;
  onRemove: (id: string) => void;
  onUpdate: (updatedTask: Task) => void;
}

export default function TaskItem({
  task,
  currentColumnId,
  onRemove,
  onUpdate
}: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = (data: TaskFormData) => {
    onUpdate({
      ...task,
      title: data.title.trim(),
      description: data.description?.trim() || undefined,
      priority: data.priority,
      urgency: data.urgency,
      state: data.state
    });
    setIsEditing(false);

    return true;
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <li className="flex flex-col p-4  text-center gap-3 border border-gray-300 rounded-lg shadow bg-white list-none">
        <FormUpdateTask
          initialValues={task}
          onSubmit={handleSave}
          className="flex flex-col gap-4"
        >
          <div className="flex gap-2  justify-center">
            <button
              type="submit"
              className="bg-[#49ba73] hover:bg-green-600 text-white py-1 px-3 rounded cursor-pointer text-sm"
            >
              Salva
            </button>
            <button
              onClick={handleCancel}
              className="bg-red-600 hover:bg-red-800 text-white py-1 px-3 rounded cursor-pointer text-sm"
            >
              Annulla
            </button>
          </div>
        </FormUpdateTask>
      </li>
    );
  }

  return (
    <li
      className="flex flex-col p-4 text-center gap-3 border border-gray-300 rounded-lg shadow bg-white list-none"
      draggable="true"
      onDragStart={(e) => {
        e.dataTransfer.setData(
          "application/json",
          JSON.stringify({
            taskId: task.id,
            fromColumnId: currentColumnId
          })
        );
        e.dataTransfer.effectAllowed = "move";
      }}
    >
      <div className="flex justify-end">
        <button
          onClick={() => onRemove(task.id)}
          className="flex items-center justify-center cursor-pointer w-6 h-6 bg-gray-600 hover:bg-gray-800 text-white rounded-full text-sm"
        >
          x
        </button>
      </div>

      <h3 className="font-bold border-b border-gray-200 pb-2 wrap-break-word">
        {task.title}
      </h3>

      {task.description && (
        <p className="text-sm text-gray-600 pb-4 wrap-break-word border-b border-gray-200">
          {task.description}
        </p>
      )}
      <h4 className="text-sm text-gray-600">{task.state}</h4>

      <button
        onClick={() => setIsEditing(true)}
        className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-1 px-3 border border-gray-400 rounded shadow cursor-pointer text-sm"
      >
        modifica
      </button>
    </li>
  );
}
