export function getColumnIdFromTask(
  priority: "importante" | "non-importante",
  urgency: "urgente" | "non-urgente"
): string {
  if (priority === "importante" && urgency === "urgente")
    return "urgente-importante";
  if (priority === "importante" && urgency === "non-urgente")
    return "importante-non-urgente";
  if (priority === "non-importante" && urgency === "urgente")
    return "urgente-non-importante";
  return "non-urgente-non-importante";
}

export function getPriorityUrgency(columnId: string): {
  priority: "importante" | "non-importante";
  urgency: "urgente" | "non-urgente";
} {
  switch (columnId) {
    case "urgente-importante":
      return { priority: "importante", urgency: "urgente" };
    case "importante-non-urgente":
      return { priority: "importante", urgency: "non-urgente" };
    case "urgente-non-importante":
      return { priority: "non-importante", urgency: "urgente" };
    case "non-urgente-non-importante":
      return { priority: "non-importante", urgency: "non-urgente" };
    default:
      return { priority: "non-importante", urgency: "non-urgente" };
  }
}
