import { Task, TaskFilters } from "@/types/task";

export interface TaskRepository {
  listTasks(filters?: TaskFilters): Promise<Task[]>;
  getTaskById(id: string): Promise<Task | null>;
  createTask(task: Task): Promise<Task>;
  updateTask(id: string, updates: Partial<Task>): Promise<Task>;
  deleteTask(id: string): Promise<void>;
  toggleTaskCompletion(id: string, concluida: boolean): Promise<Task>;
}
