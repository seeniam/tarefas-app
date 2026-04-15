import { Task } from "@/types/task";

export function DailySummary({ tasks }: { tasks: Task[] }) {
  const total = tasks.length;
  const concluidas = tasks.filter((task) => task.concluida).length;
  const pendentes = total - concluidas;
  const progresso = total > 0 ? Math.round((concluidas / total) * 100) : 0;

  const stats = [
    { label: "Total", value: total, color: "bg-primary/10 text-primary" },
    { label: "Concluidas", value: concluidas, color: "bg-success/10 text-success" },
    { label: "Pendentes", value: pendentes, color: "bg-warning/10 text-warning" }
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2 md:gap-3">
        {stats.map((stat) => (
          <div key={stat.label} className={`rounded-xl p-3 md:p-4 ${stat.color}`}>
            <p className="text-2xl font-bold md:text-3xl">{stat.value}</p>
            <p className="text-xs font-medium opacity-80 md:text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-muted-foreground">Progresso do dia</span>
          <span className="font-semibold text-foreground">{progresso}%</span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${progresso}%` }}
          />
        </div>
      </div>
    </div>
  );
}
