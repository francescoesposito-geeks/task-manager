// "use client";

// import { useQuery } from "@tanstack/react-query";
// import { Task } from "../components/TaskItem";

// export default function UseQueryTasks() {
//   const { data, isLoading, isError, error } = useQuery<Task[]>({
//     queryKey: ["tasks"],
//     queryFn: async () => {
//       const res = await fetch("/api/tasks");
//       if (!res.ok) throw new Error(`Errore HTTP: ${res.status}`);
//       return res.json();
//     }
//   });

//   if (isLoading) return <p>Caricamento...</p>;
//   if (isError) return <p>Errore: {error.message}</p>;
//   if (!data) return null;

//   return (
//     <ul>
//       {data.map((item) => (
//         <li key={item.id}>
//           <p> {item.title}</p>
//           {item.description && <p>{item.description}</p>}
//           <p>{item.priority}</p>
//         </li>
//       ))}
//     </ul>
//   );
// }
