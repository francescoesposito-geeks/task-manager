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

export const initialColumns: Column[] = [
  { id: "backlog", title: "Backlog", tasks: [] },
  { id: "todo", title: "To Do", tasks: [] },
  { id: "in-progress", title: "In Progress", tasks: [] },
  { id: "to-review", title: "To Review", tasks: [] },
  { id: "done", title: "Done", tasks: [] }
];

export const priorityWeight: Record<Task["priority"], number> = {
  alta: 3,
  media: 2,
  bassa: 1
};
