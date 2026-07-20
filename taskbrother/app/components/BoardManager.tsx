"use client";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { Column, Task } from "../../types/board";
import BoardTrello from "./BoardTrello";
import {
  initialColumnsEisenhower,
  initialColumnsTrello
} from "../../data/initialColumns";
import BoardEisenhower from "../components/BoardEisenhower";
import { getPriorityUrgency } from "../../utils/getColumnId";
import TaskForm from "./TaskForm";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { ViewSwitcher } from "./ViewSwitcher";
import BoardCalendar from "./BoardCalendar";

export default function BoardManager() {
  const [columnsTrello, setColumnsTrello, isLoadedTrello] = useLocalStorage<
    Column[]
  >("boardTrello", initialColumnsTrello);
  const [columnsEisenhower, setColumnsEisenhower, isLoadedEisenhower] =
    useLocalStorage<Column[]>("boardEisenhower", initialColumnsEisenhower);
  const [tasks, setTasks, isLoadedTasks] = useLocalStorage<Task[]>("tasks", []);
  const [view, setView, isLoadedView] = useLocalStorage<
    "trello" | "eisenhower" | "calendar"
  >("view", "trello");

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

      if (view === "eisenhower") {
        const { priority, urgency } = getPriorityUrgency(toColumnId);
        updatedTask = { ...taskToMove, priority, urgency };
      } else {
        updatedTask = { ...taskToMove, state: toColumnId as Task["state"] };
      }

      return prev.map((item) => (item.id === taskId ? updatedTask : item));
    });
  };

  const handleMoveColumnLeft = (columnId: string) => {
    const setColumns =
      view === "eisenhower" ? setColumnsEisenhower : setColumnsTrello;
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
    const setColumns =
      view === "eisenhower" ? setColumnsEisenhower : setColumnsTrello;
    setColumns((prev) => {
      const index = prev.findIndex((col) => col.id === columnId);
      if (index === -1 || index >= prev.length - 1) return prev;
      const newColumns = [...prev];
      const [movedColumn] = newColumns.splice(index, 1);
      newColumns.splice(index + 1, 0, movedColumn);
      return newColumns;
    });
  };

  if (
    !isLoadedTrello ||
    !isLoadedEisenhower ||
    !isLoadedTasks ||
    !isLoadedView
  ) {
    return <div className="p-10 text-center text-gray-800">Caricamento...</div>;
  }

  return (
    <div className="flex flex-col items-center gap-20 p-1 mt-8 w-full max-w-7xl">
      <div className="flex justify-center mb-1 gap-8 items-start">
        <h1 className="font-bold text-4xl text-white">TASK MANAGER</h1>
        <ViewSwitcher view={view} onViewChange={setView} />
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
      {view === "eisenhower" && (
        <BoardEisenhower
          tasks={tasks}
          columns={columnsEisenhower}
          onRemoveTask={handleRemoveTask}
          onUpdateTask={handleUpdateTask}
          onMoveTask={handleMoveTask}
          onMoveColumnLeft={handleMoveColumnLeft}
          onMoveColumnRight={handleMoveColumnRight}
          isEisenhower={true}
        />
      )}
      {view === "trello" && (
        <BoardTrello
          tasks={tasks}
          columns={columnsTrello}
          onRemoveTask={handleRemoveTask}
          onUpdateTask={handleUpdateTask}
          onMoveTask={handleMoveTask}
          onMoveColumnLeft={handleMoveColumnLeft}
          onMoveColumnRight={handleMoveColumnRight}
          isEisenhower={false}
        />
      )}
      {view === "calendar" && (
        <BoardCalendar
          tasks={tasks}
          onUpdateTask={handleUpdateTask}
          onRemoveTask={handleRemoveTask}
        />
      )}
    </div>
  );
}
