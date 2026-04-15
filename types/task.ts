export const TASK_PRIORITIES = ["baixa", "media", "alta"] as const;
export const TASK_STATUSES = ["pendente", "em_andamento", "concluida"] as const;

export type TaskPriority = (typeof TASK_PRIORITIES)[number];
export type TaskStatus = (typeof TASK_STATUSES)[number];

export type Task = {
  id: string;
  titulo: string;
  descricao?: string;
  data: string;
  horarioInicio: string;
  horarioFim?: string;
  prioridade: TaskPriority;
  status: TaskStatus;
  categoria?: string;
  observacoes?: string;
  concluida: boolean;
  criadoEm: string;
  atualizadoEm: string;
};

export type TaskFilters = {
  data?: string;
  prioridade?: TaskPriority;
  status?: TaskStatus;
  categoria?: string;
  query?: string;
  busca?: string;
};

export type TaskSummary = {
  total: number;
  concluidas: number;
  pendentes: number;
  progresso: number;
};

export type TaskCollectionResponse = {
  tasks: Task[];
  summary: TaskSummary;
};

export type TaskSyncResponse = {
  syncedAt: string;
  total: number;
};

export type TaskCreateInput = {
  titulo: string;
  descricao?: string;
  data: string;
  horarioInicio: string;
  horarioFim?: string;
  prioridade: TaskPriority;
  status: TaskStatus;
  categoria?: string;
  observacoes?: string;
};

export type TaskUpdateInput = Partial<TaskCreateInput>;
