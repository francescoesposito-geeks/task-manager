export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: "bassa" | "media" | "alta";
}

export interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

export const priorityWeight: Record<Task["priority"], number> = {
  alta: 3,
  media: 2,
  bassa: 1
};
