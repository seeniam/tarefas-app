"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTask, deleteTask, fetchTasks, syncTasks, toggleTaskCompletion, updateTask } from "@/features/tasks/api/task-client";
import { TaskCreateInput, TaskFilters, TaskUpdateInput } from "@/types/task";

const tasksKey = (filters: TaskFilters) => ["tasks", filters] as const;

export function useTasks(filters: TaskFilters) {
  return useQuery({
    queryKey: tasksKey(filters),
    queryFn: () => fetchTasks(filters)
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: TaskCreateInput) => createTask(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tasks"] });
    }
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: TaskUpdateInput }) => updateTask(id, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tasks"] });
    }
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tasks"] });
    }
  });
}

export function useToggleTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, concluida }: { id: string; concluida: boolean }) => toggleTaskCompletion(id, concluida),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tasks"] });
    }
  });
}

export function useSyncTasks() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => syncTasks(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tasks"] });
    }
  });
}
