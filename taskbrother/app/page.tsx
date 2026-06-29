import TaskManager from "@/components/TaskManager";

export default function Home() {
  return (
    <main className="flex flex-1 w-full flex-col justify-between py-16 px-4 md:px-8 bg-gray-200">
      <div className="w-full max-w-6xl mx-auto">
        <div className="flex justify-center mb-1 gap-6 items-center">
          <h1 className="font-bold text-4xl">TASK MANAGER</h1>
        </div>

        <TaskManager />
      </div>
    </main>
  );
}
