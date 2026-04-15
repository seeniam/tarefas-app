import { TaskRepository } from "@/repositories/task-repository";
import { Task, TaskFilters } from "@/types/task";

const today = new Date().toISOString().slice(0, 10);
const now = () => new Date().toISOString();

let nextId = 7;

let mockTasks: Task[] = [
  {
    id: "1",
    titulo: "Standup diario",
    descricao: "Reuniao rapida com o time",
    data: today,
    horarioInicio: "09:00",
    horarioFim: "09:15",
    prioridade: "alta",
    status: "concluida",
    categoria: "Reuniao",
    concluida: true,
    criadoEm: now(),
    atualizadoEm: now()
  },
  {
    id: "2",
    titulo: "Revisar pull requests",
    descricao: "Revisar PRs pendentes no repositorio",
    data: today,
    horarioInicio: "09:30",
    horarioFim: "10:30",
    prioridade: "alta",
    status: "em_andamento",
    categoria: "Desenvolvimento",
    concluida: false,
    criadoEm: now(),
    atualizadoEm: now()
  },
  {
    id: "3",
    titulo: "Documentar API",
    descricao: "Escrever documentacao dos endpoints",
    data: today,
    horarioInicio: "11:00",
    horarioFim: "12:00",
    prioridade: "media",
    status: "pendente",
    categoria: "Documentacao",
    concluida: false,
    criadoEm: now(),
    atualizadoEm: now()
  },
  {
    id: "4",
    titulo: "Almoco",
    data: today,
    horarioInicio: "12:00",
    horarioFim: "13:00",
    prioridade: "baixa",
    status: "pendente",
    categoria: "Pessoal",
    concluida: false,
    criadoEm: now(),
    atualizadoEm: now()
  },
  {
    id: "5",
    titulo: "Implementar tela de settings",
    descricao: "Criar componentes de configuracao do app",
    data: today,
    horarioInicio: "14:00",
    horarioFim: "16:00",
    prioridade: "media",
    status: "pendente",
    categoria: "Desenvolvimento",
    concluida: false,
    criadoEm: now(),
    atualizadoEm: now()
  },
  {
    id: "6",
    titulo: "Planejar sprint da proxima semana",
    data: today,
    horarioInicio: "16:30",
    horarioFim: "17:30",
    prioridade: "alta",
    status: "pendente",
    categoria: "Planejamento",
    concluida: false,
    criadoEm: now(),
    atualizadoEm: now()
  }
];

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

export class MockTaskRepository implements TaskRepository {
  async listTasks(filters?: TaskFilters) {
    await delay();
    return mockTasks
      .filter((task) => matchesFilters(task, filters))
      .sort((left, right) => left.horarioInicio.localeCompare(right.horarioInicio));
  }

  async getTaskById(id: string) {
    await delay(100);
    return mockTasks.find((task) => task.id === id) ?? null;
  }

  async createTask(task: Task) {
    await delay();
    const nextTask = {
      ...task,
      id: String(nextId++)
    };

    mockTasks.push(nextTask);
    return nextTask;
  }

  async updateTask(id: string, updates: Partial<Task>) {
    await delay();
    const index = mockTasks.findIndex((task) => task.id === id);

    if (index === -1) {
      throw new Error("Tarefa nao encontrada.");
    }

    mockTasks[index] = {
      ...mockTasks[index],
      ...updates,
      atualizadoEm: now()
    };

    return mockTasks[index];
  }

  async deleteTask(id: string) {
    await delay();
    mockTasks = mockTasks.filter((task) => task.id !== id);
  }

  async toggleTaskCompletion(id: string, concluida: boolean) {
    await delay();
    const index = mockTasks.findIndex((task) => task.id === id);

    if (index === -1) {
      throw new Error("Tarefa nao encontrada.");
    }

    mockTasks[index] = {
      ...mockTasks[index],
      concluida,
      status: concluida ? "concluida" : "pendente",
      atualizadoEm: now()
    };

    return mockTasks[index];
  }
}

function matchesFilters(task: Task, filters?: TaskFilters) {
  if (!filters) {
    return true;
  }

  const search = (filters.query ?? filters.busca)?.toLowerCase();
  const haystack = `${task.titulo} ${task.descricao ?? ""} ${task.categoria ?? ""}`.toLowerCase();

  return (
    (!filters.data || task.data === filters.data) &&
    (!filters.prioridade || task.prioridade === filters.prioridade) &&
    (!filters.status || task.status === filters.status) &&
    (!filters.categoria || task.categoria === filters.categoria) &&
    (!search || haystack.includes(search))
  );
}
