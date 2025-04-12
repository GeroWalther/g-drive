"use client";

import { Button } from "~/components/ui/button";

interface ViewSwitcherProps {
  view: "grid" | "list";
  onChange: (view: "grid" | "list") => void;
}

export function ViewSwitcher({ view, onChange }: ViewSwitcherProps) {
  return (
    <div className="flex overflow-hidden rounded-lg border">
      <Button
        variant={view === "grid" ? "default" : "outline"}
        size="icon"
        onClick={() => onChange("grid")}
        className="h-8 w-8 rounded-none"
      >
        <GridIcon className="h-4 w-4" />
      </Button>
      <Button
        variant={view === "list" ? "default" : "outline"}
        size="icon"
        onClick={() => onChange("list")}
        className="h-8 w-8 rounded-none"
      >
        <ListIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}

function GridIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="7" height="7" x="3" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="14" rx="1" />
      <rect width="7" height="7" x="3" y="14" rx="1" />
    </svg>
  );
}

function ListIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="8" x2="21" y1="6" y2="6" />
      <line x1="8" x2="21" y1="12" y2="12" />
      <line x1="8" x2="21" y1="18" y2="18" />
      <line x1="3" x2="3" y1="6" y2="6" />
      <line x1="3" x2="3" y1="12" y2="12" />
      <line x1="3" x2="3" y1="18" y2="18" />
    </svg>
  );
}
