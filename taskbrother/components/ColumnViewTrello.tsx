"use client";
import { useState } from "react";
import { Column, Task } from "../types/board";
import TaskItem from "./TaskItem";

export interface ColumnViewTrelloProps {
  column: Column;
  isEisenhower: boolean;
  onRemoveTask: (taskId: string) => void;
  onUpdateTask: (task: Task) => void;
  onMoveTask: (
    fromColumnId: string,
    toColumnId: string,
    taskId: string
  ) => void;
  onMoveColumnLeft: (columnId: string) => void;
  onMoveColumnRight: (columnId: string) => void;
  tasksList: Task[];
}

export default function ColumnViewTrello({
  tasksList,
  column,
  onRemoveTask,
  onUpdateTask,
  onMoveTask,
  onMoveColumnLeft,
  onMoveColumnRight,
  isEisenhower
}: ColumnViewTrelloProps) {
  const [isDragOver, setIsDragOver] = useState(false);

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

  return (
    <div
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col min-w-72 md:max-w-80 min-h-96 shrink-0 rounded-lg p-4 bg-gray-100 transition-all duration-200 shadow-xl ${
        isDragOver
          ? "bg-gray-200 border border-blue-400"
          : "bg-gray-50 border border-transparent"
      }`}
    >
      <div className="flex justify-between items-center mb-4 gap-2">
        <h2 className="font-bold cursor-pointer">{column.title}</h2>

        <div className="flex items-center content-center gap-3">
          <span className=" text-black text-sm font-bold px-2 py-0.5">
            {tasksList.length}
          </span>
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
        {tasksList.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            currentColumnId={column.id}
            onRemove={(taskId) => onRemoveTask(taskId)}
            onUpdate={(updatedTask) => onUpdateTask(updatedTask)}
            isEisenhower={isEisenhower ?? false}
          />
        ))}
      </ul>
    </div>
  );
}
