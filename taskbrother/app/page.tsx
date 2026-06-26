import TaskManager from "@/components/TaskManager";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 w-full  flex-col items-center justify-between py-16 px-8 bg-white">
      <div>
        <Link
          href="/good-boy"
          className="inline-block transition-transform duration-500 ease-in-out hover:translate-x-300 bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
        >
          prova a cliccare
        </Link>
        <TaskManager />
      </div>
    </main>
  );
}
