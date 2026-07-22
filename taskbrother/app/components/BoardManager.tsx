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
import { useState, useEffect } from "react";
import {
  createTask,
  deleteTask,
  fetchTasks,
  updateTask
} from "../../lib/db/task";
import { Button } from "./ui/button";
import Modal from "./Modal";

export default function BoardManager() {
  const [columnsTrello, setColumnsTrello, isLoadedTrello] = useLocalStorage<
    Column[]
  >("boardTrello", initialColumnsTrello);
  const [columnsEisenhower, setColumnsEisenhower, isLoadedEisenhower] =
    useLocalStorage<Column[]>("boardEisenhower", initialColumnsEisenhower);
  const [view, setView, isLoadedView] = useLocalStorage<
    "trello" | "eisenhower" | "calendar"
  >("view", "trello");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpenModal, setIsOpenModal] = useState(false);

  useEffect(() => {
    fetchTasks()
      .then((data) => {
        setTasks(data);
        setIsLoading(false);
      })
      .catch(() => {
        setError("Impossibile caricare le task. Riprova.");
        setIsLoading(false);
      });
  }, []);

  const handleAddTask = async (task: Omit<Task, "id">) => {
    const newTask = await createTask(task);
    if (newTask) {
      setTasks((prev) => [...prev, newTask]);
    } else {
      setError("Impossibile aggiungere la task. Riprova.");
    }
  };

  const handleRemoveTask = async (taskId: string) => {
    const success = await deleteTask(taskId);
    if (success) {
      setTasks((prev) => prev.filter((item) => item.id !== taskId));
    }
  };

  const handleUpdateTask = async (updatedTask: Task) => {
    const result = await updateTask(updatedTask);
    if (result) {
      setTasks((prev) =>
        prev.map((item) => (item.id === updatedTask.id ? result : item))
      );
    }
  };

  const handleMoveTask = async (
    fromColumnId: string,
    toColumnId: string,
    taskId: string
  ) => {
    if (fromColumnId === toColumnId) return;
    const taskToMove = tasks.find((task) => task.id === taskId);
    if (!taskToMove) return;
    let updatedTask: Task;
    if (view === "eisenhower") {
      const { priority, urgency } = getPriorityUrgency(toColumnId);
      updatedTask = { ...taskToMove, priority, urgency };
    } else {
      updatedTask = { ...taskToMove, state: toColumnId as Task["state"] };
    }
    setTasks((prev) =>
      prev.map((item) => (item.id === taskId ? updatedTask : item))
    );
    await updateTask(updatedTask);
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

  const handleCloseModal = () => {
    setIsOpenModal(false);
  };

  if (!isLoadedTrello || !isLoadedEisenhower || !isLoadedView || isLoading) {
    return (
      <div className="p-10 text-center text-foreground">Caricamento...</div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-14 p-1 mt-22 w-full max-w-7xl">
      <div className="flex justify-center mb-1 gap-8 items-center">
        <h1 className="font-bold text-4xl text-primary">TASK MANAGER</h1>
        <ViewSwitcher view={view} onViewChange={setView} />
        <ThemeSwitcher />
      </div>
      {error && (
        <div className="w-full bg-destructive/10 border border-destructive text-destructive px-4 py-2 rounded-lg text-sm text-center">
          {error}
        </div>
      )}

      <div className="flex flex-col flex-wrap gap-12 justify-center min-w-2/3 content-center">
        <Button
          variant="secondary"
          size="xs"
          className="min-w-2/4 py-4 border border-black/20 shadow-2xl"
          onClick={() => setIsOpenModal(true)}
        >
          + inserisci Task
        </Button>
        {isOpenModal && (
          <Modal onClose={handleCloseModal}>
            <TaskForm
              variant="full"
              heading="Nuova Task"
              submitLabel="Aggiungi task"
              onSubmit={handleAddTask}
              onCloseModal={handleCloseModal}
            />
          </Modal>
        )}
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
