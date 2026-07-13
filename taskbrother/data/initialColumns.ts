import { Column } from "../types/board";

export const initialColumnsEisenhower: Column[] = [
  { id: "urgente-importante", title: "Urgente & Importante" },
  {
    id: "urgente-non-importante",
    title: "Urgente & Non importante"
  },
  {
    id: "importante-non-urgente",
    title: "Importante & Non urgente"
  },

  {
    id: "non-urgente-non-importante",
    title: "Non urgente & Non importante"
  }
];

export const initialColumnsTrello: Column[] = [
  { id: "to-do", title: "To do" },
  { id: "blocked", title: "Blocked" },
  {
    id: "doing",
    title: "Doing"
  },
  {
    id: "testing",
    title: "Testing"
  },

  {
    id: "done",
    title: "Done"
  }
];
