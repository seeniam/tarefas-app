"use client";

import { useCallback, useMemo, useState } from "react";
import { format } from "date-fns";
import { AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { AppHeader } from "@/components/layout/app-header";
import { DailySummary } from "@/components/dashboard/daily-summary";
import { DeleteConfirm } from "@/components/tasks/delete-confirm";
import { EmptyState } from "@/components/tasks/empty-state";
import { TaskCard } from "@/components/tasks/task-card";
import { TaskFiltersBar } from "@/components/tasks/task-filters-bar";
import { TaskForm } from "@/components/tasks/task-form";
import { TaskListSkeleton } from "@/components/tasks/task-list-skeleton";
import {
  useCreateTask,
  useDeleteTask,
  useSyncTasks,
  useTasks,
  useToggleTask,
  useUpdateTask
} from "@/features/tasks/hooks/use-tasks";
import { Task, TaskCreateInput, TaskFilters } from "@/types/task";

export function DashboardScreen() {
  const today = format(new Date(), "yyyy-MM-dd");
  const [filters, setFilters] = useState<TaskFilters>({ data: today });
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const tasksQuery = useTasks(filters);
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const toggleTask = useToggleTask();
  const syncTasks = useSyncTasks();

  const tasks = useMemo(() => tasksQuery.data?.tasks ?? [], [tasksQuery.data?.tasks]);
  const categories = useMemo(() => {
    const values = new Set(tasks.map((task) => task.categoria).filter(Boolean) as string[]);
    return Array.from(values).sort();
  }, [tasks]);

  const handleCreate = useCallback(
    async (data: TaskCreateInput) => {
      await createTask.mutateAsync(data, {
        onSuccess: () => {
          setShowForm(false);
          toast.success("Tarefa criada!");
        },
        onError: (error) => toast.error(error.message)
      });
    },
    [createTask]
  );

  const handleUpdate = useCallback(
    async (data: TaskCreateInput) => {
      if (!editingTask) {
        return;
      }

      await updateTask.mutateAsync(
        { id: editingTask.id, input: data },
        {
          onSuccess: () => {
            setEditingTask(null);
            toast.success("Tarefa atualizada!");
          },
          onError: (error) => toast.error(error.message)
        }
      );
    },
    [editingTask, updateTask]
  );

  const handleDelete = useCallback(async () => {
    if (!deletingId) {
      return;
    }

    await deleteTask.mutateAsync(deletingId, {
      onSuccess: () => {
        setDeletingId(null);
        toast.success("Tarefa excluida");
      },
      onError: (error) => toast.error(error.message)
    });
  }, [deleteTask, deletingId]);

  const handleToggle = useCallback(
    async (id: string) => {
      const task = tasks.find((entry) => entry.id === id);
      if (!task) {
        return;
      }

      await toggleTask.mutateAsync(
        { id, concluida: !task.concluida },
        {
          onSuccess: (response) => {
            toast.success(response.data.concluida ? "Tarefa concluida! ✓" : "Tarefa reaberta");
          },
          onError: (error) => toast.error(error.message)
        }
      );
    },
    [tasks, toggleTask]
  );

  const handleSync = useCallback(async () => {
    await syncTasks.mutateAsync(undefined, {
      onSuccess: () => toast.success("Dados sincronizados"),
      onError: (error) => toast.error(error.message)
    });
    await tasksQuery.refetch();
  }, [syncTasks, tasksQuery]);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader onNewTask={() => setShowForm(true)} onSync={handleSync} isSyncing={syncTasks.isPending || tasksQuery.isRefetching} />

      <main className="container mx-auto max-w-2xl space-y-5 py-4 md:space-y-6 md:py-6">
        <DailySummary tasks={tasks} />

        <TaskFiltersBar filters={filters} onChange={setFilters} categories={categories} />

        {tasksQuery.isLoading ? <TaskListSkeleton /> : null}

        {!tasksQuery.isLoading && tasks.length === 0 ? <EmptyState /> : null}

        {!tasksQuery.isLoading && tasks.length > 0 ? (
          <div className="space-y-2.5">
            <AnimatePresence mode="popLayout">
              {tasks.map((task) => (
                <TaskCard key={task.id} task={task} onToggle={handleToggle} onEdit={setEditingTask} onDelete={setDeletingId} />
              ))}
            </AnimatePresence>
          </div>
        ) : null}

        {tasksQuery.isError ? (
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
            Falha ao carregar tarefas: {tasksQuery.error.message}
          </div>
        ) : null}
      </main>

      {showForm ? (
        <TaskForm onSubmit={handleCreate} onClose={() => setShowForm(false)} isLoading={createTask.isPending} />
      ) : null}

      {editingTask ? (
        <TaskForm task={editingTask} onSubmit={handleUpdate} onClose={() => setEditingTask(null)} isLoading={updateTask.isPending} />
      ) : null}

      {deletingId ? (
        <DeleteConfirm onConfirm={handleDelete} onCancel={() => setDeletingId(null)} isLoading={deleteTask.isPending} />
      ) : null}
    </div>
  );
}
