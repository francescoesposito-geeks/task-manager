"use client";
import { useState } from "react";
import { Column, Task } from "../types/board";
import FormBody, { TaskFormData } from "./FormBody";

export interface TaskItemProps {
  task: Task;
  currentColumnId: string;
  allColumns: Column[];
  onRemove: (id: string) => void;
  onUpdate: (updatedTask: Task) => void;
  onMove: (toColumnId: string) => void;
}

export default function TaskItem({
  task,
  currentColumnId,
  allColumns,
  onRemove,
  onUpdate,
  onMove
}: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = (data: TaskFormData) => {
    onUpdate({
      ...task,
      title: data.title.trim(),
      description: data.description?.trim() || undefined,
      priority: data.priority
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
        <FormBody
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
        </FormBody>
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

      <h3 className="font-bold border-b border-gray-200 pb-2">{task.title}</h3>

      {task.description && (
        <p className="text-sm text-gray-600 border-b border-gray-200 pb-2">
          {task.description}
        </p>
      )}

      <span className="text-xs uppercase tracking-wide text-gray-500">
        {task.priority}
      </span>

      <select
        value={currentColumnId}
        onChange={(e) => onMove(e.target.value)}
        className="border border-gray-300 rounded-md p-1 text-sm cursor-pointer"
      >
        {allColumns.map((col) => (
          <option key={col.id} value={col.id}>
            {col.title}
          </option>
        ))}
      </select>

      <button
        onClick={() => setIsEditing(true)}
        className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-1 px-3 border border-gray-400 rounded shadow cursor-pointer text-sm"
      >
        modifica
      </button>
    </li>
  );
}
