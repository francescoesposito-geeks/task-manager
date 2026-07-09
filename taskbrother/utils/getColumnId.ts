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
