interface Option {
  value: string;
  label: string;
}

export const OPTIONS_STATE: Option[] = [
  { value: "to-do", label: "To do" },
  { value: "blocked", label: "Blocked" },
  { value: "doing", label: "Doing" },
  { value: "testing", label: "Testing" },
  { value: "done", label: "Done" }
];

export const OPTIONS_URGENCY: Option[] = [
  { value: "urgente", label: "Urgente" },
  { value: "non-urgente", label: "Non urgente" }
];

export const OPTIONS_PRIORITY: Option[] = [
  { value: "importante", label: "Importante" },
  { value: "non-importante", label: "Non importante" }
];
