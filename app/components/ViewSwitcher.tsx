"use client";

import { Columns3, LayoutGrid, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface ViewSwitcherProps {
  view: "trello" | "eisenhower" | "calendar";
  onViewChange: (view: "trello" | "eisenhower" | "calendar") => void;
}

export function ViewSwitcher({ view, onViewChange }: ViewSwitcherProps) {
  const getActiveIcon = () => {
    switch (view) {
      case "trello":
        return <LayoutGrid className="h-5 w-5" />;
      case "eisenhower":
        return <Columns3 className="h-5 w-5" />;
      case "calendar":
        return <CalendarDays className="h-5 w-5" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" size="icon">
            {getActiveIcon()}
            <span className="sr-only">Change view</span>
          </Button>
        }
      ></DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onViewChange("trello")}>
          Trello
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onViewChange("eisenhower")}>
          Eisenhower
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onViewChange("calendar")}>
          Calendar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
