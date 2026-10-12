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
    // phone: one column under the other; tablet: columns side by side with
    // horizontal scroll; large screens: all five columns fit in the page
    <div className="flex flex-col gap-6 w-full pb-16 md:flex-row md:items-start md:overflow-x-auto xl:grid xl:grid-cols-5 xl:overflow-visible">
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
