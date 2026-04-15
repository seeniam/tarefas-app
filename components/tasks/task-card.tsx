"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Clock, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Task } from "@/types/task";

type Props = {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
};

const priorityConfig = {
  alta: { label: "Alta", className: "bg-priority-high/10 text-priority-high" },
  media: { label: "Media", className: "bg-priority-medium/10 text-priority-medium" },
  baixa: { label: "Baixa", className: "bg-priority-low/10 text-priority-low" }
} as const;

const statusConfig = {
  pendente: { label: "Pendente", className: "bg-warning/10 text-warning" },
  em_andamento: { label: "Em andamento", className: "bg-primary/10 text-primary" },
  concluida: { label: "Concluida", className: "bg-success/10 text-success" }
} as const;

const categoryColors: Record<string, string> = {
  Reuniao: "bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300",
  Desenvolvimento: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300",
  Documentacao: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
  Pessoal: "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300",
  Planejamento: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300"
};

export function TaskCard({ task, onToggle, onEdit, onDelete }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const priority = priorityConfig[task.prioridade];
  const status = statusConfig[task.status];
  const categoryColor = task.categoria ? categoryColors[task.categoria] ?? "bg-secondary text-secondary-foreground" : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      className={`group relative rounded-xl border border-border bg-card p-3.5 transition-shadow hover:shadow-sm md:p-4 ${
        task.concluida ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={() => onToggle(task.id)}
          className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
            task.concluida ? "border-success bg-success" : "border-border hover:border-primary"
          }`}
        >
          {task.concluida ? <Check className="h-3 w-3 text-success-foreground" /> : null}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3
              className={`text-sm font-medium leading-snug ${
                task.concluida ? "text-muted-foreground line-through" : "text-foreground"
              }`}
            >
              {task.titulo}
            </h3>
            <div className="relative flex-shrink-0">
              <button
                type="button"
                onClick={() => setMenuOpen((current) => !current)}
                className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <MoreVertical className="h-4 w-4" />
              </button>
              {menuOpen ? (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 top-8 z-50 w-36 rounded-lg border border-border bg-card py-1 shadow-lg">
                    <button
                      type="button"
                      onClick={() => {
                        onEdit(task);
                        setMenuOpen(false);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onDelete(task.id);
                        setMenuOpen(false);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Excluir
                    </button>
                  </div>
                </>
              ) : null}
            </div>
          </div>

          {task.descricao ? <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{task.descricao}</p> : null}

          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {task.horarioInicio}
              {task.horarioFim ? ` - ${task.horarioFim}` : ""}
            </span>
            <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium ${priority.className}`}>{priority.label}</span>
            <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium ${status.className}`}>{status.label}</span>
            {task.categoria && categoryColor ? (
              <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium ${categoryColor}`}>{task.categoria}</span>
            ) : null}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
