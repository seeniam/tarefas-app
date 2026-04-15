import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { TaskPriority, TaskStatus } from "@/types/task";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDisplayDate(value: string) {
  return new Date(`${value}T12:00:00`).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short"
  });
}

export function formatStatusLabel(status: TaskStatus) {
  const labels: Record<TaskStatus, string> = {
    pendente: "Pendente",
    em_andamento: "Em andamento",
    concluida: "Concluida"
  };

  return labels[status];
}

export function getPriorityClasses(priority: TaskPriority) {
  const classes: Record<TaskPriority, string> = {
    baixa: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    media: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
    alta: "bg-rose-500/10 text-rose-700 dark:text-rose-300"
  };

  return classes[priority];
}

export function getCategoryColorClass(category: string) {
  const palette = [
    "bg-sky-500/10 text-sky-700 dark:text-sky-300",
    "bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-300",
    "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300",
    "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300",
    "bg-teal-500/10 text-teal-700 dark:text-teal-300"
  ];

  const hash = category.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return palette[hash % palette.length];
}
