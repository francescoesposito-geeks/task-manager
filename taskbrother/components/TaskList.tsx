"use client";
import { Task } from "./TaskItem";
import TaskItem from "./TaskItem";

export interface TaskListProps {
  tasks: Task[];
  onRemoveTask: (id: string) => void;
  onUpdateTask: (updatedTask: Task) => void;
}

export default function TaskList({
  tasks,
  onRemoveTask,
  onUpdateTask
}: TaskListProps) {
  return (
    <ul className="grid grid-cols-1 max-w-lg md:grid-cols-2 md:max-w-4xl lg:grid-cols-3 lg:max-w-full gap-18 p-2 w-full mx-auto">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onRemove={onRemoveTask}
          onUpdate={onUpdateTask}
        />
      ))}
    </ul>
  );
}
