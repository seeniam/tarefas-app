import { ClipboardList } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex animate-fade-in flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
        <ClipboardList className="h-7 w-7 text-muted-foreground" />
      </div>
      <h3 className="mb-1 text-base font-semibold text-foreground">Nenhuma tarefa encontrada</h3>
      <p className="max-w-xs text-sm text-muted-foreground">
        Crie sua primeira tarefa ou ajuste os filtros para ver resultados.
      </p>
    </div>
  );
}
