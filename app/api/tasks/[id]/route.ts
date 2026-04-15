import { NextRequest, NextResponse } from "next/server";
import { taskUpdateInputSchema } from "@/schemas/task";
import { getTaskService } from "@/services/tasks/get-task-service";

type Params = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const payload = taskUpdateInputSchema.parse(await request.json());
    const service = getTaskService();
    const task = await service.updateTask(id, payload);

    return NextResponse.json({ data: task });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Falha ao atualizar tarefa." },
      { status: 400 }
    );
  }
}

export async function DELETE(_: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const service = getTaskService();
    await service.deleteTask(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Falha ao excluir tarefa." },
      { status: 400 }
    );
  }
}
