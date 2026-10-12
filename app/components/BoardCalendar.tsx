"use client";

import { Calendar, dateFnsLocalizer, View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, parseISO } from "date-fns";
import { it } from "date-fns/locale";
import { Task } from "../../types/board";
import { useState } from "react";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import TaskForm from "./TaskForm";
import Modal from "./Modal";

const locales = { it };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date: Date) => startOfWeek(date, { weekStartsOn: 1 }),
  getDay,
  locales
});

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  resource: Task;
}

export interface BoardCalendarProps {
  tasks: Task[];
  onUpdateTask: (task: Task) => void;
  onRemoveTask: (taskId: string) => void;
}

export default function BoardCalendar({
  tasks,
  onUpdateTask,
  onRemoveTask
}: BoardCalendarProps) {
  const [currentView, setCurrentView] = useState<View>("month");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isEditing, setIsEditing] = useState(false);

  const events: CalendarEvent[] = tasks.map((task) => ({
    id: task.id,
    title: task.title,
    start: parseISO(task.endDate),
    end: parseISO(task.endDate),
    allDay: true,
    resource: task
  }));

  const eventPropGetter = (event: CalendarEvent) => {
    const isDone = event.resource.state === "done";

    return {
      style: {
        backgroundColor: isDone ? "var(--muted)" : "var(--primary)",
        color: isDone ? "var(--muted-foreground)" : "var(--primary-foreground)",
        borderRadius: "6px"
      }
    };
  };

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedTask(event.resource);
    setIsEditing(false);
  };

  const handleClose = () => {
    setSelectedTask(null);
    setIsEditing(false);
  };

  return (
    <div className="w-full bg-card border-2 p-4 rounded-lg shadow-xl mb-16">
      <div className="h-175">
        <Calendar<CalendarEvent>
          localizer={localizer}
          events={events}
          date={currentDate}
          onNavigate={setCurrentDate}
          culture="it"
          view={currentView}
          onView={setCurrentView}
          eventPropGetter={eventPropGetter}
          onSelectEvent={handleSelectEvent}
          messages={{
            next: "Next ->",
            previous: "<- Prec",
            today: "Oggi",
            month: "Mese",
            week: "Settimana",
            day: "Giorno",
            agenda: "Agenda",
            noEventsInRange: "Nessuna task con scadenza in questo periodo",
            showMore: (total) => `+${total} altre`
          }}
        />
      </div>

      {selectedTask && (
        <Modal onClose={handleClose}>
          {isEditing ? (
            <TaskForm
              key={selectedTask.id}
              variant="compact"
              initialValues={{
                title: selectedTask.title,
                description: selectedTask.description ?? "",
                priority: selectedTask.priority,
                urgency: selectedTask.urgency,
                state: selectedTask.state,
                startDate: selectedTask.startDate,
                endDate: selectedTask.endDate
              }}
              onSubmit={(data) => {
                onUpdateTask({ ...selectedTask, ...data });
                handleClose();
              }}
            >
              <div className="flex gap-2 justify-center mt-4">
                <Button type="submit" variant="success" size="compact">
                  Salva
                </Button>
                <Button
                  variant="destructive"
                  size="compact"
                  onClick={() => setIsEditing(false)}
                >
                  Annulla
                </Button>
              </div>
            </TaskForm>
          ) : (
            <>
              <h2 className=" flex justify-between text-primary font-bold text-lg border-b border-primary/20 pb-2 wrap-anywhere overflow-hidden">
                {selectedTask.title}
                <Button
                  variant="close"
                  size="icon-close"
                  onClick={handleClose}
                  aria-label="Chiudi"
                >
                  <X className="size-3" />
                </Button>
              </h2>
              {selectedTask.description && (
                <p className="text-sm text-primary/80 wrap-anywhere overflow-hidden">
                  {selectedTask.description}
                </p>
              )}
              <div className="flex gap-2 flex-wrap text-xs">
                <span className="bg-secondary px-2 py-1 rounded">
                  {selectedTask.state}
                </span>
                <span className="bg-secondary px-2 py-1 rounded">
                  {selectedTask.priority}
                </span>
                <span className="bg-secondary px-2 py-1 rounded">
                  {selectedTask.urgency}
                </span>
              </div>
              {selectedTask.startDate && (
                <p className="text-sm text-primary">
                  <span className="font-bold">Inizio: </span>
                  {new Date(selectedTask.startDate).toLocaleDateString(
                    "it-IT",
                    { timeZone: "UTC" }
                  )}
                </p>
              )}
              {selectedTask.endDate && (
                <p className="text-sm text-primary">
                  <span className="font-bold">Fine: </span>
                  {new Date(selectedTask.endDate).toLocaleDateString("it-IT", {
                    timeZone: "UTC"
                  })}
                </p>
              )}
              <div className="flex gap-2 justify-center mt-4">
                <Button
                  variant="default"
                  size="compact"
                  onClick={() => setIsEditing(true)}
                >
                  Modifica
                </Button>
                <Button
                  variant="destructive"
                  size="compact"
                  onClick={() => {
                    onRemoveTask(selectedTask.id);
                    handleClose();
                  }}
                >
                  Elimina
                </Button>
              </div>
            </>
          )}
        </Modal>
      )}
    </div>
  );
}
