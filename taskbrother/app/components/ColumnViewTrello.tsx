"use client";
import { useState } from "react";
import { Column, Task } from "../../types/board";
import TaskItem from "./TaskItem";
import { Button } from "./ui/button";

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
  const handleDragLeave = (e: React.DragEvent) => {
    if (
      e.relatedTarget instanceof Node &&
      e.currentTarget.contains(e.relatedTarget)
    ) {
      return;
    }
    setIsDragOver(false);
  };
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
      className={`flex flex-col min-w-72 md:max-w-80 min-h-90 shrink-0 rounded-lg p-4 bg-secondary transition-all duration-200 shadow-xl ${
        isDragOver ? "border border-blue-400" : "border border-black/10"
      }`}
    >
      <div className="flex justify-between items-center mb-4 gap-2 border-b pb-2 border-primary/20">
        <h2 className="text-primary font-bold">{column.title}</h2>

        <div className="flex items-center content-center gap-1">
          <span className="text-primary text-sm font-bold px-2 py-0.5">
            {tasksList.length}
          </span>

          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => onMoveColumnLeft(column.id)}
            aria-label="Sposta colonna a sinistra"
          >
            ◀
          </Button>

          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => onMoveColumnRight(column.id)}
            aria-label="Sposta colonna a destra"
          >
            ▶
          </Button>
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
