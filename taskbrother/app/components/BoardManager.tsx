"use client";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { Column, Task } from "../../types/board";
import BoardTrello from "./BoardTrello";
import {
  initialColumnsEisenhower,
  initialColumnsTrello
} from "../../data/initialColumns";
import { useState } from "react";
import BoardEisenhower from "../components/BoardEisenhower";
import { getPriorityUrgency } from "../../utils/getColumnId";
import { Columns3, LayoutGrid } from "lucide-react";
import TaskForm from "./TaskForm";
import { ThemeSwitcher } from "./theme-switcher";

export default function BoardManager() {
  const [columnsTrello, setColumnsTrello, isLoadedTrello] = useLocalStorage<
    Column[]
  >("boardTrello", initialColumnsTrello);
  const [columnsEisenhower, setColumnsEisenhower, isLoadedEisenhower] =
    useLocalStorage<Column[]>("boardEisenhower", initialColumnsEisenhower);
  const [isEisenhower, setIsEisenhower] = useState(false);
  const [tasks, setTasks, isLoadedTasks] = useLocalStorage<Task[]>("tasks", []);
  const setColumns = isEisenhower ? setColumnsEisenhower : setColumnsTrello;

  const handleAddTask = (item: Task) => {
    setTasks((prev) => [...prev, item]);
  };

  const handleRemoveTask = (taskId: string) => {
    setTasks((prev) => prev.filter((item) => item.id !== taskId));
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks((prev) =>
      prev.map((item) => (item.id === updatedTask.id ? updatedTask : item))
    );
  };

  const handleMoveTask = (
    fromColumnId: string,
    toColumnId: string,
    taskId: string
  ) => {
    if (fromColumnId === toColumnId) return;

    setTasks((prev) => {
      const taskToMove = prev.find((task) => task.id === taskId);
      if (!taskToMove) return prev;

      let updatedTask: Task;

      if (isEisenhower) {
        const { priority, urgency } = getPriorityUrgency(toColumnId);
        updatedTask = { ...taskToMove, priority, urgency };
      } else {
        updatedTask = { ...taskToMove, state: toColumnId as Task["state"] };
      }

      return prev.map((item) => (item.id === taskId ? updatedTask : item));
    });
  };

  const handleMoveColumnLeft = (columnId: string) => {
    setColumns((prev) => {
      const index = prev.findIndex((col) => col.id === columnId);
      if (index <= 0) return prev;
      const newColumns = [...prev];
      const [movedColumn] = newColumns.splice(index, 1);
      newColumns.splice(index - 1, 0, movedColumn);
      return newColumns;
    });
  };

  const handleMoveColumnRight = (columnId: string) => {
    setColumns((prev) => {
      const index = prev.findIndex((col) => col.id === columnId);
      if (index === -1 || index >= prev.length - 1) return prev;
      const newColumns = [...prev];
      const [movedColumn] = newColumns.splice(index, 1);
      newColumns.splice(index + 1, 0, movedColumn);
      return newColumns;
    });
  };

  if (!isLoadedTrello || !isLoadedEisenhower || !isLoadedTasks) {
    return <div className="p-10 text-center text-gray-800">Caricamento...</div>;
  }

  return (
    <div className="flex flex-col items-center gap-20 p-1 mt-8 w-full max-w-7xl">
      <div className="flex justify-center mb-1 gap-8 items-start">
        <h1 className="font-bold text-4xl text-white">TASK MANAGER</h1>
        <button
          onClick={() => setIsEisenhower(!isEisenhower)}
          className="bg-white hover:bg-gray-300 text-gray-800 font-semibold p-1 cursor-pointer border border-gray-300 rounded-md shadow"
        >
          {isEisenhower ? <LayoutGrid /> : <Columns3 />}
        </button>
        <ThemeSwitcher />
      </div>
      <div className="flex flex-col flex-wrap gap-12 justify-center min-w-2/3">
        <div className="flex flex-col flex-wrap gap-12 justify-center min-w-2/3">
          <TaskForm
            variant="full"
            heading="Nuova Task"
            submitLabel="Aggiungi task"
            onSubmit={(data) => {
              handleAddTask({
                id: crypto.randomUUID(),
                ...data
              });
            }}
          />
        </div>
      </div>
      {isEisenhower ? (
        <BoardEisenhower
          tasks={tasks}
          columns={columnsEisenhower}
          onRemoveTask={handleRemoveTask}
          onUpdateTask={handleUpdateTask}
          onMoveTask={handleMoveTask}
          onMoveColumnLeft={handleMoveColumnLeft}
          onMoveColumnRight={handleMoveColumnRight}
          isEisenhower={isEisenhower}
        />
      ) : (
        <BoardTrello
          tasks={tasks}
          columns={columnsTrello}
          onRemoveTask={handleRemoveTask}
          onUpdateTask={handleUpdateTask}
          onMoveTask={handleMoveTask}
          onMoveColumnLeft={handleMoveColumnLeft}
          onMoveColumnRight={handleMoveColumnRight}
          isEisenhower={isEisenhower}
        />
      )}
    </div>
  );
}
