export function getDaysUntilDeadline(deadline: string): number {
  const oggi = new Date();
  oggi.setHours(0, 0, 0, 0);
  const scadenza = new Date(deadline);
  scadenza.setHours(0, 0, 0, 0);
  return Math.ceil(
    (scadenza.getTime() - oggi.getTime()) / (1000 * 60 * 60 * 24)
  );
}

export function isDeadlineUrgent(deadline: string): boolean {
  return getDaysUntilDeadline(deadline) <= 1;
}
