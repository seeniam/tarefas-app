"use client";

import { CheckCircle2, Plus, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ThemeToggle } from "@/components/theme/theme-toggle";

type Props = {
  onNewTask: () => void;
  onSync: () => void;
  isSyncing?: boolean;
};

export function AppHeader({ onNewTask, onSync, isSyncing }: Props) {
  const today = new Date();

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="container flex h-14 items-center justify-between md:h-16">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <CheckCircle2 className="h-4.5 w-4.5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-base font-semibold leading-tight text-foreground">Tarefas</h1>
            <p className="hidden text-xs text-muted-foreground sm:block">
              {format(today, "EEEE, d 'de' MMMM", { locale: ptBR })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={onSync}
            disabled={isSyncing}
            className="inline-flex h-9 items-center justify-center rounded-lg border border-border px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-50"
          >
            <RefreshCw className={`mr-1.5 h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Sincronizar</span>
          </button>
          <button
            type="button"
            onClick={onNewTask}
            className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-3.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Plus className="mr-1 h-4 w-4" />
            Nova tarefa
          </button>
        </div>
      </div>
    </header>
  );
}
