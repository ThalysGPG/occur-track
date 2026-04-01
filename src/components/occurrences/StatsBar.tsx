import { useMemo } from "react";
import type { Occurrence } from "@/types/occurrence";

interface Props {
  occurrences: Occurrence[];
}

export function StatsBar({ occurrences }: Props) {
  const stats = useMemo(() => {
    const now = new Date();
    const abertas = occurrences.filter(o => !["concluida", "cancelada"].includes(o.status)).length;
    const andamento = occurrences.filter(o => o.status === "em_andamento").length;
    const concluidas = occurrences.filter(o => o.status === "concluida").length;
    const atrasadas = occurrences.filter(o =>
      o.deadline && new Date(o.deadline) < now && !["concluida", "cancelada"].includes(o.status)
    ).length;
    return [
      { label: "Abertas", value: abertas, color: "bg-status-nova" },
      { label: "Em Andamento", value: andamento, color: "bg-status-andamento" },
      { label: "Concluídas", value: concluidas, color: "bg-status-concluida" },
      { label: "Atrasadas", value: atrasadas, color: "bg-destructive" },
    ];
  }, [occurrences]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((s) => (
        <div key={s.label} className="bg-card rounded-lg border border-border p-4 flex items-center gap-3">
          <div className={`h-10 w-1 rounded-full ${s.color}`} />
          <div>
            <p className="text-2xl font-bold text-card-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
