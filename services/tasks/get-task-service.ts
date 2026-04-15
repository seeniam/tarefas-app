import { hasGoogleSheetsEnv } from "@/lib/env";
import { FallbackTaskRepository } from "@/repositories/fallback-task-repository";
import { GoogleSheetsTaskRepository } from "@/repositories/google-sheets-task-repository";
import { MockTaskRepository } from "@/repositories/mock-task-repository";
import { GoogleSheetsClient } from "@/services/google-sheets/google-sheets-client";
import { TaskService } from "@/services/tasks/task-service";

let taskService: TaskService | null = null;

export function getTaskService() {
  if (!taskService) {
    const fallbackRepository = new MockTaskRepository();

    if (!hasGoogleSheetsEnv()) {
      taskService = new TaskService(fallbackRepository);
      return taskService;
    }

    taskService = new TaskService(
      new FallbackTaskRepository(new GoogleSheetsTaskRepository(new GoogleSheetsClient()), fallbackRepository)
    );
  }

  return taskService;
}
