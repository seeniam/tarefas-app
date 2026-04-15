"use client";

import { AlertTriangle } from "lucide-react";

type Props = {
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
};

export function DeleteConfirm({ onConfirm, onCancel, isLoading }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-sm animate-fade-in rounded-2xl border border-border bg-card p-6 text-center shadow-xl">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="h-6 w-6 text-destructive" />
        </div>
        <h3 className="mb-1 text-lg font-semibold text-foreground">Excluir tarefa?</h3>
        <p className="mb-5 text-sm text-muted-foreground">Esta acao nao pode ser desfeita.</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="h-10 flex-1 rounded-lg border border-border text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="h-10 flex-1 rounded-lg bg-destructive text-sm font-medium text-destructive-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isLoading ? "Excluindo..." : "Excluir"}
          </button>
        </div>
      </div>
    </div>
  );
}
