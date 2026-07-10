"use client";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { Column, Task } from "../types/board";
import NewTaskForm from "./NewTaskForm";

import Board from "./Board";
import { initialColumns } from "../data/initialColumns";
import { useState } from "react";
import BoardEisenhower from "../components/BoardEisenhower";
import { getColumnIdFromTask } from "../utils/getColumnId";

export default function BoardManager() {
  const [columns, setColumns, isLoaded] = useLocalStorage<Column[]>(
    "board",
    initialColumns
  );
  const [isEisenhower, setIsEisenhower] = useState(false);

  const handleAddTask = (_columnId: string, task: Task) => {
    const columnId = getColumnIdFromTask(task.priority, task.urgency);
    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId ? { ...col, tasks: [...col.tasks, task] } : col
      )
    );
  };

  const handleRemoveTask = (columnId: string, taskId: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId
          ? { ...col, tasks: col.tasks.filter((t) => t.id !== taskId) }
          : col
      )
    );
  };

  const handleUpdateTask = (columnId: string, updatedTask: Task) => {
    const newColumnId = getColumnIdFromTask(
      updatedTask.priority,
      updatedTask.urgency
    );

    if (columnId === newColumnId) {
      setColumns((prev) =>
        prev.map((col) =>
          col.id === columnId
            ? {
                ...col,
                tasks: col.tasks.map((task) =>
                  task.id === updatedTask.id ? updatedTask : task
                )
              }
            : col
        )
      );
    } else {
      setColumns((prev) =>
        prev.map((col) => {
          if (col.id === columnId) {
            return {
              ...col,
              tasks: col.tasks.filter((task) => task.id !== updatedTask.id)
            };
          }
          if (col.id === newColumnId) {
            return { ...col, tasks: [...col.tasks, updatedTask] };
          }
          return col;
        })
      );
    }
  };

  const handleMoveTask = (
    fromColumnId: string,
    toColumnId: string,
    taskId: string
  ) => {
    if (fromColumnId === toColumnId) return;

    setColumns((prev) => {
      const sourceColumn = prev.find((col) => col.id === fromColumnId);
      const taskToMove = sourceColumn?.tasks.find((t) => t.id === taskId);
      if (!taskToMove) return prev;

      return prev.map((col) => {
        if (col.id === fromColumnId) {
          return { ...col, tasks: col.tasks.filter((t) => t.id !== taskId) };
        }
        if (col.id === toColumnId) {
          return { ...col, tasks: [...col.tasks, taskToMove] };
        }
        return col;
      });
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

  if (!isLoaded) {
    return <div className="p-10 text-center text-gray-800">Caricamento...</div>;
  }

  return (
    <div className="flex flex-col items-center gap-12 p-1 mt-8">
      <div className="flex flex-col flex-wrap gap-12 justify-center max-w-7xl">
        <NewTaskForm onAddTask={handleAddTask} />
        <button
          onClick={() => setIsEisenhower(!isEisenhower)}
          className="bg-white hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 min-w-72 cursor-pointer border border-gray-300 rounded-md shadow mb-6"
        >
          Cambia interfaccia
        </button>
      </div>
      {isEisenhower ? (
        <BoardEisenhower
          columns={columns}
          onRemoveTask={handleRemoveTask}
          onUpdateTask={handleUpdateTask}
          onMoveTask={handleMoveTask}
          onMoveColumnLeft={handleMoveColumnLeft}
          onMoveColumnRight={handleMoveColumnRight}
          onAddTask={handleAddTask}
          isEisenhower={isEisenhower}
        />
      ) : (
        <Board
          columns={columns}
          onRemoveTask={handleRemoveTask}
          onUpdateTask={handleUpdateTask}
          onMoveTask={handleMoveTask}
          onMoveColumnLeft={handleMoveColumnLeft}
          onMoveColumnRight={handleMoveColumnRight}
          onAddTask={handleAddTask}
        />
      )}
    </div>
  );
}
