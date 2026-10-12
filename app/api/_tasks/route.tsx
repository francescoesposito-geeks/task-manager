// import { NextResponse } from "next/server";
// import { Task } from "../../../types/board";
// import { taskSchema } from "../../../lib/schemas/task";

// let fakeTasksDb: Task[] = [
//   {
//     id: "1",
//     title: "studiare css",
//     description: "tailwind ",
//     priority: "alta"
//   },
//   {
//     id: "2",
//     title: "Fare la spesa",
//     description: "Latte e mandorle",
//     priority: "bassa"
//   },
//   {
//     id: "3",
//     title: "sistemare casa",
//     description: "pulire balcone e camera",
//     priority: "media"
//   }
// ];

// export async function GET() {
//   await new Promise((r) => setTimeout(r, 100));
//   return NextResponse.json(fakeTasksDb);
// }

// export async function POST(request: Request) {
//   try {
//     const body = await request.json();

//     const result = taskSchema.safeParse(body);
//     if (!result.success) {
//       return NextResponse.json({ error: "Dati non validi" }, { status: 400 });
//     }

//     const nuovoTask: Task = {
//       id: crypto.randomUUID(),
//       ...result.data
//     };

//     fakeTasksDb.push(nuovoTask);
//     return NextResponse.json(nuovoTask, { status: 201 });
//   } catch (error) {
//     return NextResponse.json({ error: "Errore interno" }, { status: 500 });
//   }
// }

// export async function DELETE(request: Request) {
//   try {
//     const { id } = await request.json();

//     fakeTasksDb = fakeTasksDb.filter((task) => task.id !== id);

//     return NextResponse.json({ success: true });
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Impossibile eliminare il task" },
//       { status: 400 }
//     );
//   }
// }

// export async function PUT(request: Request) {
//   try {
//     const body = await request.json();

//     const result = taskSchema.safeParse(body);
//     if (!result.success || !body.id) {
//       return NextResponse.json(
//         { error: "Dati non validi o ID mancante" },
//         { status: 400 }
//       );
//     }

//     fakeTasksDb = fakeTasksDb.map((task) =>
//       task.id === body.id ? { id: body.id, ...result.data } : task
//     );

//     return NextResponse.json({ id: body.id, ...result.data });
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Impossibile aggiornare il task" },
//       { status: 500 }
//     );
//   }
// }
