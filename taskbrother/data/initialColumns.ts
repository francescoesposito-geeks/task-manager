import { Column } from "../types/board";

export const initialColumns: Column[] = [
  { id: "backlog", title: "Backlog", tasks: [] },
  { id: "todo", title: "To Do", tasks: [] },
  { id: "in-progress", title: "In Progress", tasks: [] },
  { id: "to-review", title: "To Review", tasks: [] },
  { id: "done", title: "Done", tasks: [] }
];
