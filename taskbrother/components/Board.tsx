"use client";
import { Column, Task } from "../types/board";
import ColumnView from "./ColumnView";

export interface BoardProps {
  columns: Column[];
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

export default function Board({
  columns,
  onRemoveTask,
  onUpdateTask,
  onMoveTask,
  onRenameColumn,
  onDeleteColumn,
  onMoveColumnLeft,
  onMoveColumnRight,
  onAddTask
}: BoardProps) {
  return (
    <div className="flex overflow-x-auto gap-6 items-start w-full">
      {columns.map((column) => (
        <ColumnView
          key={column.id}
          column={column}
          allColumns={columns}
          onRemoveTask={onRemoveTask}
          onUpdateTask={onUpdateTask}
          onMoveTask={onMoveTask}
          onRenameColumn={onRenameColumn}
          onDeleteColumn={onDeleteColumn}
          onMoveColumnLeft={onMoveColumnLeft}
          onMoveColumnRight={onMoveColumnRight}
          onAddTask={onAddTask}
        />
      ))}
    </div>
  );
}
