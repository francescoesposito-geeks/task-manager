"use client";
import { Column, Task } from "../../types/board";
import ColumnViewTrello from "./ColumnViewTrello";

export interface BoardTrelloProps {
  columns: Column[];
  onRemoveTask: (taskId: string) => void;
  onUpdateTask: (task: Task) => void;
  onMoveTask: (
    fromColumnId: string,
    toColumnId: string,
    taskId: string
  ) => void;
  onMoveColumnLeft: (columnId: string) => void;
  onMoveColumnRight: (columnId: string) => void;
  tasks: Task[];
  isEisenhower: boolean;
}

export default function BoardTrello({
  columns,
  onRemoveTask,
  onUpdateTask,
  onMoveTask,
  onMoveColumnLeft,
  onMoveColumnRight,
  tasks,
  isEisenhower
}: BoardTrelloProps) {
  return (
    <div className="flex overflow-x-auto gap-6 items-start w-full">
      {columns.map((column) => (
        <ColumnViewTrello
          tasksList={tasks.filter((item) => item.state === column.id)}
          key={column.id}
          column={column}
          onRemoveTask={onRemoveTask}
          onUpdateTask={onUpdateTask}
          onMoveTask={onMoveTask}
          onMoveColumnLeft={onMoveColumnLeft}
          onMoveColumnRight={onMoveColumnRight}
          isEisenhower={isEisenhower}
        />
      ))}
    </div>
  );
}
