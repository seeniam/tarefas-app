import { NextRequest, NextResponse } from "next/server";
import { taskToggleSchema } from "@/schemas/task";
import { getTaskService } from "@/services/tasks/get-task-service";

type Params = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const payload = taskToggleSchema.parse(await request.json().catch(() => ({})));
    const service = getTaskService();
    const task = await service.toggleTaskCompletion(id, payload.concluida);

    return NextResponse.json({ data: task });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Falha ao alternar conclusao." },
      { status: 400 }
    );
  }
}
