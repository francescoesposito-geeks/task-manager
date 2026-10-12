// import { Task } from "../../types/board";

// export async function fetchTasks(): Promise<Task[]> {
//   const res = await fetch("/api/tasks", { method: "GET" });
//   if (!res.ok) throw new Error("Errore nel caricamento");
//   return res.json();
// }

// export async function addTask(nuovoTask: Task): Promise<Task> {
//   const res = await fetch("/api/tasks", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(nuovoTask)
//   });
//   if (!res.ok) throw new Error("Errore nel salvataggio");
//   return res.json();
// }

// export async function deleteTask(id: string): Promise<{ id: string }> {
//   const res = await fetch("/api/tasks", {
//     method: "DELETE",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ id })
//   });
//   if (!res.ok) throw new Error("Errore durante l'eliminazione");
//   return res.json();
// }

// export async function updateTask(updatedTask: Task): Promise<Task> {
//   const res = await fetch("/api/tasks", {
//     method: "PUT",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(updatedTask)
//   });
//   if (!res.ok) throw new Error("Errore durante la modifica");
//   return res.json();
// }
