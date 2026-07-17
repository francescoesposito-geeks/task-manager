"use client";

import { Calendar, dateFnsLocalizer, View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, parseISO } from "date-fns";
import { it } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Task } from "../../types/board";
import { useState } from "react";
import { Button } from "./ui/button";
import { X } from "lucide-react";

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

  const events: CalendarEvent[] = tasks
    .filter((t) => t.deadline !== undefined && t.deadline !== "")
    .map((t) => {
      const date = parseISO(t.deadline!);
      return {
        id: t.id,
        title: t.title,
        start: date,
        end: date,
        allDay: true,
        resource: t
      };
    });

  const eventPropGetter = (event: CalendarEvent) => ({
    style: {
      backgroundColor: event.resource.state === "done" ? "green" : "blue"
    }
  });

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedTask(event.resource);
  };

  return (
    <div className="w-full bg-card p-4 rounded-lg shadow-xl">
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
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setSelectedTask(null)}
        >
          <div
            className="bg-card rounded-lg shadow-xl p-6 max-w-sm w-full mx-4 flex flex-col gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end">
              <Button
                variant="close"
                size="icon-close"
                onClick={() => {
                  onRemoveTask(selectedTask.id);
                  setSelectedTask(null);
                }}
                aria-label="Elimina task"
              >
                <X className="size-3" />
              </Button>
            </div>
            <h2 className="text-primary font-bold text-lg border-b border-primary/20 pb-2">
              {selectedTask.title}
            </h2>
            {selectedTask.description && (
              <p className="text-sm text-primary/80">
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
            {selectedTask.deadline && (
              <p className="text-sm text-primary">
                <span className="font-bold">Deadline: </span>
                {new Date(selectedTask.deadline).toLocaleDateString("it-IT", {
                  timeZone: "UTC"
                })}
              </p>
            )}
            <Button
              type="submit"
              variant="default"
              size="compact"
              className="mt-8 w-full"
              onClick={() => setSelectedTask(null)}
            >
              Chiudi
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
