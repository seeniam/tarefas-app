"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { TaskFilters, TaskPriority, TaskStatus } from "@/types/task";

type Props = {
  filters: TaskFilters;
  onChange: (filters: TaskFilters) => void;
  categories: string[];
};

const prioridades: { value: TaskPriority; label: string }[] = [
  { value: "alta", label: "Alta" },
  { value: "media", label: "Media" },
  { value: "baixa", label: "Baixa" }
];

const statuses: { value: TaskStatus; label: string }[] = [
  { value: "pendente", label: "Pendente" },
  { value: "em_andamento", label: "Em andamento" },
  { value: "concluida", label: "Concluida" }
];

export function TaskFiltersBar({ filters, onChange, categories }: Props) {
  const [showFilters, setShowFilters] = useState(false);
  const hasFilters = filters.prioridade || filters.status || filters.categoria;

  function setFilter(key: keyof TaskFilters, value: string | undefined) {
    onChange({ ...filters, [key]: value || undefined });
  }

  function clearAll() {
    onChange({ data: filters.data, busca: undefined, query: undefined });
  }

  return (
    <div className="space-y-2.5">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={filters.busca ?? filters.query ?? ""}
            onChange={(event) => {
              const value = event.target.value || undefined;
              onChange({ ...filters, busca: value, query: value });
            }}
            placeholder="Buscar tarefas..."
            className="h-10 w-full rounded-lg border border-input bg-card pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground transition-shadow focus:ring-2 focus:ring-ring/20"
          />
        </div>
        <button
          type="button"
          onClick={() => setShowFilters((current) => !current)}
          className={`flex h-10 items-center gap-1.5 rounded-lg border px-3 text-sm font-medium transition-colors ${
            showFilters || hasFilters
              ? "border-primary bg-primary/5 text-primary"
              : "border-input text-muted-foreground hover:bg-accent hover:text-foreground"
          }`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span className="hidden sm:inline">Filtros</span>
        </button>
      </div>

      {showFilters ? (
        <div className="flex flex-wrap gap-2 animate-fade-in">
          <select
            value={filters.prioridade ?? ""}
            onChange={(event) => setFilter("prioridade", event.target.value)}
            className="h-9 rounded-lg border border-input bg-card px-3 text-sm text-foreground focus:ring-2 focus:ring-ring/20"
          >
            <option value="">Prioridade</option>
            {prioridades.map((priority) => (
              <option key={priority.value} value={priority.value}>
                {priority.label}
              </option>
            ))}
          </select>

          <select
            value={filters.status ?? ""}
            onChange={(event) => setFilter("status", event.target.value)}
            className="h-9 rounded-lg border border-input bg-card px-3 text-sm text-foreground focus:ring-2 focus:ring-ring/20"
          >
            <option value="">Status</option>
            {statuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>

          {categories.length > 0 ? (
            <select
              value={filters.categoria ?? ""}
              onChange={(event) => setFilter("categoria", event.target.value)}
              className="h-9 rounded-lg border border-input bg-card px-3 text-sm text-foreground focus:ring-2 focus:ring-ring/20"
            >
              <option value="">Categoria</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          ) : null}

          {hasFilters ? (
            <button
              type="button"
              onClick={clearAll}
              className="flex h-9 items-center gap-1 rounded-lg px-3 text-sm text-destructive transition-colors hover:bg-destructive/10"
            >
              <X className="h-3.5 w-3.5" />
              Limpar
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
