"use client";
import { useState, useRef } from "react";
import { Column, Task, priorityWeight } from "../types/board";
import TaskItem from "./TaskItem";
import FormBody, { TaskFormData } from "./FormBody";

export interface ColumnViewProps {
  column: Column;
  allColumns: Column[];
  onRemoveTask: (columnId: string, taskId: string) => void;
  onUpdateTask: (columnId: string, task: Task) => void;
  onMoveTask: (
    fromColumnId: string,
    toColumnId: string,
    taskId: string
  ) => void;
  onRenameColumn: (columnId: string, newTitle: string) => void;
  onDeleteColumn: (columnId: string) => void;
  onMoveColumnLeft: (columnId: string) => void;
  onMoveColumnRight: (columnId: string) => void;
  onAddTask: (columnId: string, task: Task) => void;
}

export default function ColumnView({
  column,
  allColumns,
  onRemoveTask,
  onUpdateTask,
  onMoveTask,
  onRenameColumn,
  onDeleteColumn,
  onMoveColumnLeft,
  onMoveColumnRight,
  onAddTask
}: ColumnViewProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(column.title);
  const [isDragOver, setIsDragOver] = useState(false);

  const dialogRef = useRef<HTMLDialogElement>(null);

  const sortedTasks = [...column.tasks].sort(
    (a, b) => priorityWeight[b.priority] - priorityWeight[a.priority]
  );

  const handleSaveTitle = () => {
    const trimmed = titleDraft.trim();
    if (trimmed) onRenameColumn(column.id, trimmed);
    else setTitleDraft(column.title);
    setIsEditingTitle(false);
  };

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
      priority: taskData.priority
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
      className={`flex flex-col w-72 shrink-0 rounded-lg p-4 max-h-[80vh] transition-all duration-200 ${
        isDragOver
          ? "bg-gray-200 border-2 border-dashed border-blue-400"
          : "bg-gray-50 border-2 border-transparent"
      }`}
    >
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4 gap-2">
        {isEditingTitle ? (
          <input
            autoFocus
            value={titleDraft}
            onChange={(e) => setTitleDraft(e.target.value)}
            onBlur={handleSaveTitle}
            onKeyDown={(e) => e.key === "Enter" && handleSaveTitle()}
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
        <div className="flex gap-1">
          <button
            onClick={() => onMoveColumnLeft(column.id)}
            className="text-gray-400 hover:text-gray-800 text-sm font-bold"
          >
            ◀
          </button>
          <button
            onClick={() => onMoveColumnRight(column.id)}
            className="text-gray-400 hover:text-gray-800 text-sm font-bold"
          >
            ▶
          </button>
          <button
            onClick={() => onDeleteColumn(column.id)}
            className="text-gray-500 hover:text-red-600 text-sm shrink-0"
          >
            elimina
          </button>
        </div>
      </div>

      {/* LISTA TASK */}
      <ul className="flex flex-col gap-4 overflow-y-auto flex-1 mb-4">
        {sortedTasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            currentColumnId={column.id}
            allColumns={allColumns}
            onRemove={(taskId) => onRemoveTask(column.id, taskId)}
            onUpdate={(updatedTask) => onUpdateTask(column.id, updatedTask)}
            onMove={(toColumnId) => onMoveTask(column.id, toColumnId, task.id)}
          />
        ))}
      </ul>

      {/* BOTTONE IN FONDO ALLA COLONNA */}
      <button
        onClick={openModal}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow cursor-pointer transition-colors text-sm mt-auto"
      >
        + Aggiungi task
      </button>

      {/* STRUTTURA DELLA MODALE NATIVA */}
      <dialog
        ref={dialogRef}
        className="rounded-lg p-6 shadow-2xl backdrop:bg-black/50 backdrop:backdrop-blur-sm w-96 border border-gray-200"
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

        <FormBody onSubmit={handleFormSubmit} className="flex flex-col gap-4">
          <div className="flex gap-2 justify-end mt-4">
            <button
              type="button"
              onClick={closeModal}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md text-sm font-semibold cursor-pointer"
            >
              Annulla
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-semibold cursor-pointer"
            >
              Conferma
            </button>
          </div>
        </FormBody>
      </dialog>
    </div>
  );
}
