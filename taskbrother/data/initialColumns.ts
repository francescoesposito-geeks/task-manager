import { Column } from "../types/board";

export const initialColumns: Column[] = [
  { id: "urgente-importante", title: "Urgente & Importante", tasks: [] },
  {
    id: "urgente-non-importante",
    title: "Urgente & Non importante",
    tasks: []
  },
  {
    id: "importante-non-urgente",
    title: "Importante & Non urgente",
    tasks: []
  },

  {
    id: "non-urgente-non-importante",
    title: "Non urgente & Non importante",
    tasks: []
  }
];
