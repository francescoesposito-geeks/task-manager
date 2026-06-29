"use client";
import { Task } from "./TaskItem";
import TaskFormBody, { TaskFormData } from "./TaskFormBody";

export interface TaskFormProps {
  onAddTask: (newTask: Task) => void;
}

export default function TaskForm({
  onAddTask
}: TaskFormProps): React.JSX.Element {
  const handleAddTask = (formData: TaskFormData) => {
    const nuovoTask: Task = {
      id: crypto.randomUUID(),
      ...formData
    };
    onAddTask(nuovoTask);
  };

  return (
    <div className="flex flex-col items-center mb-16 mt-8 w-full">
      <TaskFormBody
        onSubmit={handleAddTask}
        className="flex flex-col gap-4 items-center border border-gray-700 rounded-3xl p-8 w-100 shadow-xl bg-gray-100"
      >
        <button
          className="bg-white hover:bg-gray-100 text-gray-800 cursor-pointer font-semibold py-2 px-4 border border-gray-400 rounded-3xl shadow w-42 items-center transition-transform duration-100 active:scale-95 mt-2"
          type="submit"
        >
          Aggiungi Task
        </button>
      </TaskFormBody>
    </div>
  );
}
