import { NextRequest, NextResponse } from "next/server";
import { taskCreateInputSchema, taskFiltersSchema } from "@/schemas/task";
import { getTaskService } from "@/services/tasks/get-task-service";

export async function GET(request: NextRequest) {
  try {
    const filters = taskFiltersSchema.parse(Object.fromEntries(request.nextUrl.searchParams.entries()));
    const service = getTaskService();
    const result = await service.listTasks(filters);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Falha ao listar tarefas." },
      { status: 400 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = taskCreateInputSchema.parse(await request.json());
    const service = getTaskService();
    const task = await service.createTask(payload);

    return NextResponse.json({ data: task }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Falha ao criar tarefa." },
      { status: 400 }
    );
  }
}
