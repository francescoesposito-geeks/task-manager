"use client";
import { Column, Task } from "../types/board";
import ColumnView from "./ColumnView";

export interface BoardEisenhowerProps {
  columns: Column[];
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
  isEisenhower: boolean;
}

export default function BoardEisenhower({
  columns,
  onRemoveTask,
  onUpdateTask,
  onMoveTask,
  onMoveColumnLeft,
  onMoveColumnRight,
  onAddTask,
  isEisenhower
}: BoardEisenhowerProps) {
  return (
    <div className="grid grid-cols-2 gap-4 w-full">
      {columns.map((column) => (
        <ColumnView
          key={column.id}
          column={column}
          allColumns={columns}
          onRemoveTask={onRemoveTask}
          onUpdateTask={onUpdateTask}
          onMoveTask={onMoveTask}
          onMoveColumnLeft={onMoveColumnLeft}
          onMoveColumnRight={onMoveColumnRight}
          onAddTask={onAddTask}
          isEisenhower={isEisenhower}
        />
      ))}
    </div>
  );
}
