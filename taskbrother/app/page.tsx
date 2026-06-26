import TaskManager from "@/components/TaskManager";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 w-full flex-col justify-between py-16 px-4 md:px-8 bg-gray-200">
      <div className="w-full max-w-6xl mx-auto">
        <div className="flex justify-center mb-1 gap-6 items-center">
          <h1 className="font-bold text-4xl">TASK MANAGER</h1>
        </div>
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
