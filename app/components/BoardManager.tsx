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
import { useState } from "react";
import { useTasks } from "../../hooks/useTasks";
import { SessionUser, useSession } from "../../lib/session/SessionContext";
import { Button } from "./ui/button";
import { STORAGE_KEYS } from "../../lib/storageKeys";
import Modal from "./Modal";

interface BoardManagerProps {
  user: SessionUser;
}

function errorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export default function BoardManager({ user }: BoardManagerProps) {
  const { mode, signOut } = useSession();
  const [columnsTrello, setColumnsTrello, isLoadedTrello] = useLocalStorage<
    Column[]
  >(STORAGE_KEYS.columnsTrello, initialColumnsTrello);
  const [columnsEisenhower, setColumnsEisenhower, isLoadedEisenhower] =
    useLocalStorage<Column[]>(
      STORAGE_KEYS.columnsEisenhower,
      initialColumnsEisenhower
    );
  const [view, setView, isLoadedView] = useLocalStorage<
    "trello" | "eisenhower" | "calendar"
  >(STORAGE_KEYS.view, "trello");
  const { tasks, isLoading, loadError, createTask, updateTask, deleteTask } =
    useTasks(user.id);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isOpenModal, setIsOpenModal] = useState(false);

  const handleAddTask = async (task: Omit<Task, "id">) => {
    setActionError(null);
    try {
      await createTask(task);
    } catch (error) {
      setActionError(errorMessage(error, "Impossibile aggiungere la task."));
    }
  };

  const handleRemoveTask = async (taskId: string) => {
    setActionError(null);
    try {
      await deleteTask(taskId);
    } catch (error) {
      setActionError(errorMessage(error, "Impossibile eliminare la task."));
    }
  };

  const handleUpdateTask = async (updatedTask: Task) => {
    setActionError(null);
    try {
      await updateTask(updatedTask);
    } catch (error) {
      setActionError(errorMessage(error, "Impossibile salvare la modifica."));
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
    // the board updates at once and goes back if saving fails
    await handleUpdateTask(updatedTask);
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
      <p className="p-10 text-center text-muted-foreground" role="status">
        Caricamento delle task...
      </p>
    );
  }

  const error = loadError
    ? errorMessage(loadError, "Impossibile caricare le task. Riprova.")
    : actionError;

  return (
    <div className="flex flex-col items-center gap-14 p-1 mt-22 w-full max-w-7xl">
      <header className="flex flex-wrap justify-center mb-1 gap-x-8 gap-y-4 items-center">
        <h1 className="font-bold text-4xl text-primary">Task Manager</h1>
        <div className="flex items-center gap-2">
          <ViewSwitcher view={view} onViewChange={setView} />
          <ThemeSwitcher />
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">
            {mode === "local" ? "Profilo:" : "Accesso come"}{" "}
            <strong className="text-foreground inline-block max-w-40 truncate align-bottom">
              {user.name}
            </strong>
          </span>
          <Button variant="outline" size="sm" onClick={() => signOut()}>
            {mode === "local" ? "Cambia profilo" : "Esci"}
          </Button>
        </div>
      </header>
      {error && (
        <div
          className="w-full bg-destructive/10 border border-destructive text-destructive px-4 py-2 rounded-lg text-sm text-center"
          role="alert"
        >
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
          + Nuova task
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
