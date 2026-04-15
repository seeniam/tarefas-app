import { NextResponse } from "next/server";
import { getTaskService } from "@/services/tasks/get-task-service";

export async function POST() {
  try {
    const service = getTaskService();
    const result = await service.syncTasks();

    return NextResponse.json({
      syncedAt: new Date().toISOString(),
      total: result.tasks.length
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Falha ao sincronizar." },
      { status: 400 }
    );
  }
}
