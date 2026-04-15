import { TaskRepository } from "@/repositories/task-repository";
import { Task, TaskFilters } from "@/types/task";

export class FallbackTaskRepository implements TaskRepository {
  constructor(
    private readonly primary: TaskRepository,
    private readonly fallback: TaskRepository
  ) {}

  async listTasks(filters?: TaskFilters) {
    return this.run(() => this.primary.listTasks(filters), () => this.fallback.listTasks(filters));
  }

  async getTaskById(id: string) {
    return this.run(() => this.primary.getTaskById(id), () => this.fallback.getTaskById(id));
  }

  async createTask(task: Task) {
    return this.run(() => this.primary.createTask(task), () => this.fallback.createTask(task));
  }

  async updateTask(id: string, updates: Partial<Task>) {
    return this.run(() => this.primary.updateTask(id, updates), () => this.fallback.updateTask(id, updates));
  }

  async deleteTask(id: string) {
    return this.run(() => this.primary.deleteTask(id), () => this.fallback.deleteTask(id));
  }

  async toggleTaskCompletion(id: string, concluida: boolean) {
    return this.run(
      () => this.primary.toggleTaskCompletion(id, concluida),
      () => this.fallback.toggleTaskCompletion(id, concluida)
    );
  }

  private async run<T>(primaryAction: () => Promise<T>, fallbackAction: () => Promise<T>) {
    try {
      return await primaryAction();
    } catch {
      return fallbackAction();
    }
  }
}
