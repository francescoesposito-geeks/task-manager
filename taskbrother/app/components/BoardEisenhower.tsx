"use client";
import { Column, Task } from "../../types/board";
import { getColumnIdFromTask } from "../../utils/getColumnId";
import ColumnViewEisenhower from "./ColumnViewEisenhower";

export interface BoardEisenhowerProps {
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
  isEisenhower: boolean;
  tasks: Task[];
}

export default function BoardEisenhower({
  columns,
  onRemoveTask,
  onUpdateTask,
  onMoveTask,
  onMoveColumnLeft,
  onMoveColumnRight,
  isEisenhower,
  tasks
}: BoardEisenhowerProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
      {columns.map((column) => (
        <ColumnViewEisenhower
          tasksList={tasks.filter(
            (item) =>
              getColumnIdFromTask(item.priority, item.urgency) === column.id
          )}
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
