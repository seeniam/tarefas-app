import { TaskCollectionResponse, TaskCreateInput, TaskFilters, TaskSyncResponse, TaskUpdateInput } from "@/types/task";

async function parseResponse<T>(response: Response): Promise<T> {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error ?? "Erro inesperado.");
  }

  return data as T;
}

export async function fetchTasks(filters: TaskFilters): Promise<TaskCollectionResponse> {
  const searchParams = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      searchParams.set(key, String(value));
    }
  });

  const response = await fetch(`/api/tasks?${searchParams.toString()}`, {
    cache: "no-store"
  });

  return parseResponse<TaskCollectionResponse>(response);
}

export async function createTask(input: TaskCreateInput) {
  const response = await fetch("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input)
  });

  return parseResponse<{ data: TaskCollectionResponse["tasks"][number] }>(response);
}

export async function updateTask(id: string, input: TaskUpdateInput) {
  const response = await fetch(`/api/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input)
  });

  return parseResponse<{ data: TaskCollectionResponse["tasks"][number] }>(response);
}

export async function deleteTask(id: string) {
  const response = await fetch(`/api/tasks/${id}`, {
    method: "DELETE"
  });

  return parseResponse<{ success: boolean }>(response);
}

export async function toggleTaskCompletion(id: string, concluida: boolean) {
  const response = await fetch(`/api/tasks/${id}/toggle`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ concluida })
  });

  return parseResponse<{ data: TaskCollectionResponse["tasks"][number] }>(response);
}

export async function syncTasks() {
  const response = await fetch("/api/tasks/sync", {
    method: "POST"
  });

  return parseResponse<TaskSyncResponse>(response);
}
