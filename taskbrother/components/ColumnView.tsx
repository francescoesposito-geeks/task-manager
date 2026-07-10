"use client";
import { useState, useRef } from "react";
import { Column, Task } from "../types/board";
import TaskItem from "./TaskItem";
import { TaskFormData } from "./FormUpdateTask";

export interface ColumnViewProps {
  column: Column;
  allColumns: Column[];
  isEisenhower?: boolean;
  onRemoveTask: (columnId: string, taskId: string) => void;
  onUpdateTask: (columnId: string, task: Task) => void;
  onMoveTask: (
    fromColumnId: string,
    toColumnId: string,
    taskId: string
  ) => void;
  onMoveColumnLeft: (columnId: string) => void;
  onMoveColumnRight: (columnId: string) => void;
  onAddTask: (columnId: string, task: Task) => void;
}

export default function ColumnView({
  column,
  onRemoveTask,
  onUpdateTask,
  onMoveTask,
  onMoveColumnLeft,
  onMoveColumnRight,
  onAddTask,
  isEisenhower
}: ColumnViewProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(column.title);
  const [isDragOver, setIsDragOver] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<
    "importante" | "non-importante" | ""
  >("");
  const [urgency, setUrgency] = useState<"urgente" | "non-urgente" | "">("");
  const [state, setState] = useState<
    "to-do" | "doing" | "testing" | "done" | ""
  >("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const dialogRef = useRef<HTMLDialogElement>(null);

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDragEnter = () => setIsDragOver(true);
  const handleDragLeave = () => setIsDragOver(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    try {
      const rawData = e.dataTransfer.getData("application/json");
      if (!rawData) return;
      const { taskId, fromColumnId } = JSON.parse(rawData);
      onMoveTask(fromColumnId, column.id, taskId);
    } catch (error) {
      console.error(error);
    }
  };

  const openModal = () => {
    dialogRef.current?.showModal();
  };

  const closeModal = () => {
    dialogRef.current?.close();
  };

  const handleFormSubmit = (taskData: TaskFormData) => {
    const nuovoTask: Task = {
      id: crypto.randomUUID(),
      title: taskData.title,
      description: taskData.description || undefined,
      priority: taskData.priority,
      urgency: taskData.urgency,
      state: taskData.state
    };

    onAddTask(column.id, nuovoTask);
    closeModal();
    return true;
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col max-w-72 md:max-w-80 shrink-0 rounded-lg p-4 max-h-[80vh] transition-all duration-200 shadow-xl ${
        isDragOver
          ? "bg-gray-200 border border-blue-400"
          : "bg-gray-50 border border-transparent"
      }`}
    >
      <div className="flex justify-between items-center mb-4 gap-2">
        {isEditingTitle ? (
          <input
            autoFocus
            value={titleDraft}
            onChange={(e) => setTitleDraft(e.target.value)}
            className="border border-gray-300 rounded-md p-1 font-bold w-full"
          />
        ) : (
          <h2
            className="font-bold cursor-pointer"
            onClick={() => setIsEditingTitle(true)}
          >
            {column.title}
          </h2>
        )}
        <div className="flex items-center content-center gap-1">
          <button
            onClick={() => onMoveColumnLeft(column.id)}
            className="text-gray-400 hover:text-gray-800 text-sm font-bold cursor-pointer"
          >
            ◀
          </button>
          <button
            onClick={() => onMoveColumnRight(column.id)}
            className="text-gray-400 hover:text-gray-800 text-sm font-bold cursor-pointer"
          >
            ▶
          </button>
        </div>
      </div>

      <ul className="flex flex-col gap-4 overflow-y-auto flex-1 mb-4">
        {column.tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            currentColumnId={column.id}
            onRemove={(taskId) => onRemoveTask(column.id, taskId)}
            onUpdate={(updatedTask) => onUpdateTask(column.id, updatedTask)}
          />
        ))}
      </ul>

      <button
        onClick={openModal}
        className="w-full bg-gray-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow cursor-pointer transition-colors text-sm mt-auto"
      >
        + Aggiungi task
      </button>

      <dialog
        ref={dialogRef}
        className="m-auto rounded-lg p-6 shadow-2xl backdrop:bg-black/50 backdrop:backdrop-blur-sm w-96 border border-gray-200"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">
            Nuovo Task in "{column.title}"
          </h3>
          <button
            onClick={closeModal}
            className="text-gray-400 hover:text-gray-600 font-bold text-lg cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="flex gap-2 justify-center mt-4">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-semibold cursor-pointer"
          >
            Conferma
          </button>
          <button
            type="button"
            onClick={closeModal}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md text-sm font-semibold cursor-pointer"
          >
            Annulla
          </button>
        </div>
      </dialog>
    </div>
  );
}
