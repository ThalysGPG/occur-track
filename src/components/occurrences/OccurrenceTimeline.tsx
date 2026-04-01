import type { HistoryEntry } from "@/types/occurrence";
import { STATUS_LABELS, STATUS_COLORS } from "@/types/occurrence";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { ArrowRight, MessageSquare, User } from "lucide-react";

interface Props {
  history: HistoryEntry[];
}

export function OccurrenceTimeline({ history }: Props) {
  const sorted = [...history].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="space-y-0">
      {sorted.map((entry, i) => (
        <div key={entry.id} className="relative flex gap-4 pb-6 last:pb-0">
          {/* Line */}
          {i < sorted.length - 1 && (
            <div className="absolute left-[15px] top-8 bottom-0 w-px bg-border" />
          )}
          {/* Dot */}
          <div className={cn(
            "relative z-10 mt-1 h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0",
            entry.newStatus ? STATUS_COLORS[entry.newStatus] : "bg-muted"
          )}>
            {entry.newStatus ? (
              <span className="h-2 w-2 rounded-full bg-primary-foreground" />
            ) : (
              <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
            )}
          </div>
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-foreground flex items-center gap-1">
                <User className="h-3 w-3" />
                {entry.operator}
              </span>
              <span className="text-xs text-muted-foreground">
                {format(new Date(entry.timestamp), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              </span>
            </div>
            {entry.previousStatus && entry.newStatus && (
              <div className="flex items-center gap-1.5 mt-1 text-xs">
                <span className={cn("rounded-full px-2 py-0.5 text-primary-foreground", STATUS_COLORS[entry.previousStatus])}>
                  {STATUS_LABELS[entry.previousStatus]}
                </span>
                <ArrowRight className="h-3 w-3 text-muted-foreground" />
                <span className={cn("rounded-full px-2 py-0.5 text-primary-foreground", STATUS_COLORS[entry.newStatus])}>
                  {STATUS_LABELS[entry.newStatus]}
                </span>
              </div>
            )}
            {entry.newStatus && !entry.previousStatus && (
              <div className="mt-1 text-xs">
                <span className={cn("rounded-full px-2 py-0.5 text-primary-foreground", STATUS_COLORS[entry.newStatus])}>
                  {STATUS_LABELS[entry.newStatus]}
                </span>
              </div>
            )}
            <p className="text-sm text-muted-foreground mt-1">{entry.comment}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
