import { TaskRepository } from "@/repositories/task-repository";
import { Task, TaskCreateInput, TaskFilters, TaskSummary, TaskUpdateInput } from "@/types/task";

export class TaskService {
  constructor(private readonly repository: TaskRepository) {}

  async listTasks(filters?: TaskFilters) {
    const tasks = await this.repository.listTasks(filters);

    return {
      tasks,
      summary: this.buildSummary(tasks)
    };
  }

  async syncTasks() {
    return this.listTasks();
  }

  async createTask(input: TaskCreateInput) {
    const now = new Date().toISOString();

    const task: Task = {
      id: crypto.randomUUID(),
      titulo: input.titulo,
      descricao: input.descricao,
      data: input.data,
      horarioInicio: input.horarioInicio,
      horarioFim: input.horarioFim,
      prioridade: input.prioridade,
      status: input.status,
      categoria: input.categoria,
      observacoes: input.observacoes,
      concluida: input.status === "concluida",
      criadoEm: now,
      atualizadoEm: now
    };

    return this.repository.createTask(task);
  }

  async updateTask(id: string, input: TaskUpdateInput) {
    const current = await this.repository.getTaskById(id);

    if (!current) {
      throw new Error("Tarefa nao encontrada.");
    }

    return this.repository.updateTask(id, {
      ...input,
      concluida: input.status ? input.status === "concluida" : current.concluida,
      atualizadoEm: new Date().toISOString()
    });
  }

  async deleteTask(id: string) {
    await this.repository.deleteTask(id);
  }

  async toggleTaskCompletion(id: string, concluida: boolean) {
    return this.repository.toggleTaskCompletion(id, concluida);
  }

  private buildSummary(tasks: Task[]): TaskSummary {
    const total = tasks.length;
    const concluidas = tasks.filter((task) => task.concluida).length;
    const pendentes = total - concluidas;
    const progresso = total === 0 ? 0 : Math.round((concluidas / total) * 100);

    return {
      total,
      concluidas,
      pendentes,
      progresso
    };
  }
}
