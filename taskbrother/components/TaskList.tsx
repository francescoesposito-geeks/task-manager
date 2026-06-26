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
    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-18 p-6 w-full">
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
