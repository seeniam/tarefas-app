import { z } from "zod";
import { TASK_PRIORITIES, TASK_STATUSES, Task, TaskFilters } from "@/types/task";

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
const timeRegex = /^\d{2}:\d{2}$/;

const optionalTrimmedString = z
  .string()
  .trim()
  .transform((value) => value || undefined)
  .optional();

export const taskPrioritySchema = z.enum(TASK_PRIORITIES);
export const taskStatusSchema = z.enum(TASK_STATUSES);

const taskInputShape = {
  titulo: z.string().trim().min(3, "Informe um titulo com pelo menos 3 caracteres."),
  descricao: optionalTrimmedString,
  data: z.string().regex(dateRegex, "Data deve estar em YYYY-MM-DD."),
  horarioInicio: z.string().regex(timeRegex, "Horario inicial invalido."),
  horarioFim: optionalTrimmedString.refine((value) => !value || timeRegex.test(value), "Horario final invalido."),
  prioridade: taskPrioritySchema,
  status: taskStatusSchema,
  categoria: optionalTrimmedString,
  observacoes: optionalTrimmedString
} satisfies z.ZodRawShape;

const taskBaseInputSchema = z.object(taskInputShape);

export const taskCreateInputSchema = taskBaseInputSchema.superRefine((value, ctx) => {
  if (value.horarioFim && value.horarioFim < value.horarioInicio) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["horarioFim"],
      message: "Horario final deve ser igual ou posterior ao inicial."
    });
  }
});

export const taskUpdateInputSchema = taskBaseInputSchema.partial().refine(
  (value) => Object.values(value).some((entry) => entry !== undefined),
  { message: "Informe ao menos um campo para atualizar." }
);

export const taskFiltersSchema = z
  .object({
    data: z.string().regex(dateRegex).optional().or(z.literal("")),
    prioridade: taskPrioritySchema.optional().or(z.literal("")),
    status: taskStatusSchema.optional().or(z.literal("")),
    categoria: z.string().trim().optional().or(z.literal("")),
    query: z.string().trim().optional().or(z.literal("")),
    busca: z.string().trim().optional().or(z.literal(""))
  })
  .transform((value) => ({
    data: value.data || undefined,
    prioridade: value.prioridade || undefined,
    status: value.status || undefined,
    categoria: value.categoria || undefined,
    query: value.query || value.busca || undefined,
    busca: value.busca || value.query || undefined
  }));

export const taskToggleSchema = z.object({
  concluida: z.boolean().optional().default(true)
});

function parseBoolean(value: string | undefined) {
  const normalized = (value ?? "").trim().toLowerCase();
  return ["true", "1", "sim", "yes", "y"].includes(normalized);
}

function sanitizePriority(value?: string) {
  const normalized = (value ?? "").trim().toLowerCase();
  return TASK_PRIORITIES.includes(normalized as (typeof TASK_PRIORITIES)[number])
    ? (normalized as (typeof TASK_PRIORITIES)[number])
    : "media";
}

function sanitizeStatus(value?: string, concluded = false) {
  const normalized = (value ?? "").trim().toLowerCase();

  if (concluded) {
    return "concluida";
  }

  return TASK_STATUSES.includes(normalized as (typeof TASK_STATUSES)[number])
    ? (normalized as (typeof TASK_STATUSES)[number])
    : "pendente";
}

export const sheetTaskRowSchema = z.array(z.string().optional()).transform((row): Task => {
  const now = new Date().toISOString();
  const concluida = parseBoolean(row[10]);

  return {
    id: row[0]?.trim() || crypto.randomUUID(),
    titulo: row[1]?.trim() || "Tarefa sem titulo",
    descricao: row[2]?.trim() || undefined,
    data: dateRegex.test(row[3] ?? "") ? (row[3] as string) : now.slice(0, 10),
    horarioInicio: timeRegex.test(row[4] ?? "") ? (row[4] as string) : "09:00",
    horarioFim: timeRegex.test(row[5] ?? "") ? (row[5] as string) : undefined,
    prioridade: sanitizePriority(row[6]),
    status: sanitizeStatus(row[7], concluida),
    categoria: row[8]?.trim() || undefined,
    observacoes: row[9]?.trim() || undefined,
    concluida,
    criadoEm: row[11]?.trim() || now,
    atualizadoEm: row[12]?.trim() || now
  };
});
