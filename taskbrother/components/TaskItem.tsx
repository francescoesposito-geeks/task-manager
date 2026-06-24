export interface Task {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
}

export interface TaskItemProps {
  task: Task;
}

export default function TaskItem({ task }: TaskItemProps) {
  return (
    <li>
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <span>{task.priority}</span>
    </li>
  );
}
