"use client";
import { useState } from "react";
import { Column, Task } from "../../types/board";
import TaskItem from "./TaskItem";

export interface ColumnViewEisenhowerProps {
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

export default function ColumnViewEisenhower({
  column,
  onRemoveTask,
  onUpdateTask,
  onMoveTask,
  onMoveColumnLeft,
  onMoveColumnRight,
  tasksList,
  isEisenhower
}: ColumnViewEisenhowerProps) {
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
      className={`flex flex-col shrink-0 rounded-lg p-4 bg-secondary transition-all duration-200 shadow-xl ${
        isDragOver ? "border border-blue-400" : "border border-transparent"
      }`}
    >
      <div className="flex justify-between items-center mb-4 gap-2 border-b pb-2 border-primary/20">
        <h2 className="text-primary font-bold">{column.title}</h2>

        <div className="flex items-center content-center gap-3">
          <span className="text-primary text-sm font-bold px-2 py-0.5">
            {tasksList.length}
          </span>
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
        </div>
      </div>

      <ul className="overflow-y-auto flex-1 mb-4 min-h-72 grid grid-cols-1 lg:grid-cols-2 gap-4 w-full bg-secondary rounded-lg">
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
