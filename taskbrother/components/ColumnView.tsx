"use client";
import { useState } from "react";
import { Column, Task, priorityWeight } from "../types/board";
import TaskItem from "./TaskItem";

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
  onMoveColumnRight
}: ColumnViewProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(column.title);

  const sortedTasks = [...column.tasks].sort(
    (a, b) => priorityWeight[b.priority] - priorityWeight[a.priority]
  );

  const handleSaveTitle = () => {
    const trimmed = titleDraft.trim();
    if (trimmed) onRenameColumn(column.id, trimmed);
    else setTitleDraft(column.title);
    setIsEditingTitle(false);
  };

  return (
    <div className="flex flex-col w-72 shrink-0 bg-gray-50 rounded-lg p-4 max-h-[80vh]">
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

        <button
          onClick={() => onMoveColumnLeft(column.id)}
          className="text-gray-400 hover:text-gray-800 p-1 font-bold text-sm cursor-pointer"
          title="Shift to left"
        >
          ◀
        </button>
        <button
          onClick={() => onMoveColumnRight(column.id)}
          className="text-gray-400 hover:text-gray-800 p-1 font-bold text-sm cursor-pointer"
          title="<<shift to right"
        >
          ▶
        </button>

        <button
          onClick={() => onDeleteColumn(column.id)}
          className="text-gray-500 hover:text-red-600 cursor-pointer text-sm shrink-0"
        >
          elimina
        </button>
      </div>

      <ul className="flex flex-col gap-4 overflow-y-auto flex-1">
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
    </div>
  );
}
