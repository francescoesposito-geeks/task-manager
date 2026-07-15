"use client";
import { useState } from "react";
import { Task } from "../../types/board";
import { TaskFormData } from "../../lib/schemas/task";
import { isDeadlineUrgent } from "../../utils/deadLine";
import { Button } from "../components/ui/button";
import { X } from "lucide-react";
import TaskForm from "./TaskForm";

export interface TaskItemProps {
  task: Task;
  currentColumnId: string;
  onRemove: (id: string) => void;
  onUpdate: (updatedTask: Task) => void;
  isEisenhower: boolean;
}

export default function TaskItem({
  task,
  currentColumnId,
  onRemove,
  onUpdate,
  isEisenhower
}: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const urgent = task.deadline ? isDeadlineUrgent(task.deadline) : false;

  const handleSave = (data: TaskFormData) => {
    onUpdate({
      ...task,
      title: data.title.trim(),
      description: data.description?.trim() || undefined,
      priority: data.priority,
      urgency: data.urgency,
      state: data.state,
      deadline: data.deadline || undefined
    });
    setIsEditing(false);

    return true;
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <li className="flex flex-col p-4 text-center gap-3 border border-border rounded-lg shadow bg-card list-none">
        <TaskForm
          key={task.id}
          variant="compact"
          initialValues={{
            title: task.title,
            description: task.description ?? "",
            priority: task.priority,
            urgency: task.urgency,
            state: task.state,
            deadline: task.deadline ?? ""
          }}
          onSubmit={handleSave}
        >
          <div className="flex gap-2 justify-center mt-4">
            <Button type="submit" variant="success" size="compact">
              Conferma
            </Button>
            <Button variant="destructive" size="compact" onClick={handleCancel}>
              Annulla
            </Button>
          </div>
        </TaskForm>
      </li>
    );
  }

  return (
    <li
      className={`flex flex-col p-4 max-h-fit text-center gap-3 rounded-lg shadow list-none border ${
        urgent ? "border-red-300 bg-red-50" : "border-gray-300 bg-white"
      }`}
      draggable="true"
      onDragStart={(e) => {
        e.dataTransfer.setData(
          "application/json",
          JSON.stringify({
            taskId: task.id,
            fromColumnId: currentColumnId
          })
        );
        e.dataTransfer.effectAllowed = "move";
      }}
    >
      <div className="flex justify-end">
        <Button
          variant="close"
          size="icon-close"
          onClick={() => onRemove(task.id)}
          aria-label="Elimina task"
        >
          <X className="size-3" />
        </Button>
      </div>

      <h3 className="font-bold border-b border-gray-200 pb-2 wrap-break-word">
        {task.title}
      </h3>

      {task.description && (
        <p className="text-sm text-gray-900 pb-4 wrap-break-word border-b border-gray-200">
          {task.description}
        </p>
      )}

      {isEisenhower ? (
        <h4 className="text-sm text-gray-800 uppercase rounded px-2 py-1 border-b border-gray-200 pb-2">
          {task.state}
        </h4>
      ) : (
        <div className="flex justify-center border-b border-gray-200 pb-4">
          <span className="text-sm text-gray-800 uppercase">
            {task.priority} & {task.urgency}
          </span>
        </div>
      )}
      {task.deadline && (
        <p className="text-sm text-gray-600 pb-2 wrap-break-word">
          <span className="font-bold">Deadline: </span>
          {new Date(task.deadline).toLocaleDateString("it-IT")}
        </p>
      )}
      <Button
        variant="standard"
        size="compact"
        onClick={() => setIsEditing(true)}
      >
        modifica
      </Button>
    </li>
  );
}
