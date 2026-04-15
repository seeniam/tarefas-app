import { sheetTaskRowSchema } from "@/schemas/task";
import { TaskRepository } from "@/repositories/task-repository";
import { GoogleSheetsClient } from "@/services/google-sheets/google-sheets-client";
import { Task, TaskFilters } from "@/types/task";

const HEADERS = [
  "id",
  "titulo",
  "descricao",
  "data",
  "horario_inicio",
  "horario_fim",
  "prioridade",
  "status",
  "categoria",
  "observacoes",
  "concluida",
  "criado_em",
  "atualizado_em"
] as const;

export class GoogleSheetsTaskRepository implements TaskRepository {
  constructor(private readonly sheetsClient: GoogleSheetsClient) {}

  async listTasks(filters?: TaskFilters) {
    const rows = await this.sheetsClient.getDataRows(HEADERS);
    const tasks = rows.map((row) => sheetTaskRowSchema.parse(row));

    return tasks
      .filter((task) => this.matchesFilters(task, filters))
      .sort((left, right) => `${left.data}${left.horarioInicio}`.localeCompare(`${right.data}${right.horarioInicio}`));
  }

  async getTaskById(id: string) {
    const rows = await this.sheetsClient.getDataRows(HEADERS);
    const row = rows.find((entry) => entry[0] === id);
    return row ? sheetTaskRowSchema.parse(row) : null;
  }

  async createTask(task: Task) {
    await this.sheetsClient.appendRow(this.mapTaskToRow(task));
    return task;
  }

  async updateTask(id: string, updates: Partial<Task>) {
    const match = await this.sheetsClient.findRowById(id, HEADERS);

    if (!match) {
      throw new Error("Tarefa nao encontrada na planilha.");
    }

    const current = sheetTaskRowSchema.parse(match.row);
    const nextTask = { ...current, ...updates, id: current.id };

    await this.sheetsClient.updateRow(match.rowNumber, this.mapTaskToRow(nextTask));
    return nextTask;
  }

  async deleteTask(id: string) {
    const match = await this.sheetsClient.findRowById(id, HEADERS);

    if (!match) {
      throw new Error("Tarefa nao encontrada na planilha.");
    }

    await this.sheetsClient.deleteRow(match.rowNumber);
  }

  async toggleTaskCompletion(id: string, concluida: boolean) {
    const match = await this.sheetsClient.findRowById(id, HEADERS);

    if (!match) {
      throw new Error("Tarefa nao encontrada na planilha.");
    }

    const current = sheetTaskRowSchema.parse(match.row);
    const nextTask: Task = {
      ...current,
      concluida,
      status: concluida ? "concluida" : current.status === "concluida" ? "pendente" : current.status,
      atualizadoEm: new Date().toISOString()
    };

    await this.sheetsClient.updateRow(match.rowNumber, this.mapTaskToRow(nextTask));
    return nextTask;
  }

  private mapTaskToRow(task: Task) {
    return [
      task.id,
      task.titulo,
      task.descricao ?? "",
      task.data,
      task.horarioInicio,
      task.horarioFim ?? "",
      task.prioridade,
      task.status,
      task.categoria ?? "",
      task.observacoes ?? "",
      String(task.concluida),
      task.criadoEm,
      task.atualizadoEm
    ];
  }

  private matchesFilters(task: Task, filters?: TaskFilters) {
    if (!filters) {
      return true;
    }

    const query = (filters.query ?? filters.busca)?.toLowerCase();
    const haystack = `${task.titulo} ${task.descricao ?? ""} ${task.categoria ?? ""}`.toLowerCase();

    return (
      (!filters.data || task.data === filters.data) &&
      (!filters.prioridade || task.prioridade === filters.prioridade) &&
      (!filters.status || task.status === filters.status) &&
      (!filters.categoria || task.categoria === filters.categoria) &&
      (!query || haystack.includes(query))
    );
  }
}
