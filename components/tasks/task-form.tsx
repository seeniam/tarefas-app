"use client";

import { format } from "date-fns";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { taskCreateInputSchema } from "@/schemas/task";
import { Task, TaskCreateInput } from "@/types/task";

type Props = {
  task?: Task | null;
  onSubmit: (values: TaskCreateInput) => void;
  onClose: () => void;
  isLoading?: boolean;
};

const categorias = ["Reuniao", "Desenvolvimento", "Documentacao", "Pessoal", "Planejamento", "Estudo", "Saude"];

export function TaskForm({ task, onSubmit, onClose, isLoading }: Props) {
  const form = useForm<TaskCreateInput>({
    resolver: zodResolver(taskCreateInputSchema),
    defaultValues: task
      ? {
          titulo: task.titulo,
          descricao: task.descricao ?? "",
          data: task.data,
          horarioInicio: task.horarioInicio,
          horarioFim: task.horarioFim ?? "",
          prioridade: task.prioridade,
          status: task.status,
          categoria: task.categoria ?? "",
          observacoes: task.observacoes ?? ""
        }
      : {
          titulo: "",
          descricao: "",
          data: format(new Date(), "yyyy-MM-dd"),
          horarioInicio: "",
          horarioFim: "",
          prioridade: "media",
          status: "pendente",
          categoria: "",
          observacoes: ""
        }
  });

  useEffect(() => {
    form.reset(
      task
        ? {
            titulo: task.titulo,
            descricao: task.descricao ?? "",
            data: task.data,
            horarioInicio: task.horarioInicio,
            horarioFim: task.horarioFim ?? "",
            prioridade: task.prioridade,
            status: task.status,
            categoria: task.categoria ?? "",
            observacoes: task.observacoes ?? ""
          }
        : {
            titulo: "",
            descricao: "",
            data: format(new Date(), "yyyy-MM-dd"),
            horarioInicio: "",
            horarioFim: "",
            prioridade: "media",
            status: "pendente",
            categoria: "",
            observacoes: ""
          }
    );
  }, [form, task]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative max-h-[90vh] w-full overflow-y-auto rounded-t-2xl border border-border bg-card shadow-xl sm:max-w-lg sm:rounded-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-2xl border-b border-border bg-card p-4">
          <h2 className="text-lg font-semibold text-foreground">{task ? "Editar tarefa" : "Nova tarefa"}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Titulo *</label>
            <input {...form.register("titulo")} className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:ring-2 focus:ring-ring/20" />
            {form.formState.errors.titulo ? <p className="mt-1 text-xs text-destructive">{form.formState.errors.titulo.message}</p> : null}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Descricao</label>
            <textarea {...form.register("descricao")} rows={2} className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-ring/20" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Data *</label>
              <input type="date" {...form.register("data")} className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:ring-2 focus:ring-ring/20" />
              {form.formState.errors.data ? <p className="mt-1 text-xs text-destructive">{form.formState.errors.data.message}</p> : null}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Hora inicio *</label>
              <input type="time" {...form.register("horarioInicio")} className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:ring-2 focus:ring-ring/20" />
              {form.formState.errors.horarioInicio ? <p className="mt-1 text-xs text-destructive">{form.formState.errors.horarioInicio.message}</p> : null}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Hora fim</label>
            <input type="time" {...form.register("horarioFim")} className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:ring-2 focus:ring-ring/20" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Prioridade</label>
              <select {...form.register("prioridade")} className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:ring-2 focus:ring-ring/20">
                <option value="baixa">Baixa</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Status</label>
              <select {...form.register("status")} className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:ring-2 focus:ring-ring/20">
                <option value="pendente">Pendente</option>
                <option value="em_andamento">Em andamento</option>
                <option value="concluida">Concluida</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Categoria</label>
            <select {...form.register("categoria")} className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:ring-2 focus:ring-ring/20">
              <option value="">Sem categoria</option>
              {categorias.map((categoria) => (
                <option key={categoria} value={categoria}>
                  {categoria}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Observacoes</label>
            <textarea {...form.register("observacoes")} rows={2} className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-ring/20" />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="h-11 flex-1 rounded-lg border border-border text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="h-11 flex-1 rounded-lg bg-primary text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {isLoading ? "Salvando..." : task ? "Salvar" : "Criar tarefa"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
