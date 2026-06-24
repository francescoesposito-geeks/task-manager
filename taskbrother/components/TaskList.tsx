import { Task } from "./TaskItem";
import TaskItem from "./TaskItem";

export interface TaskListProps {
  tasks: Task[];
}

export default function TaskList({ tasks }: TaskListProps) {
  return (
    <ul className="flex flex-col gap-2">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </ul>
  );
}
