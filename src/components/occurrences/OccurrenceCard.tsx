import type { Occurrence } from "@/types/occurrence";
import { TYPE_LABELS } from "@/types/occurrence";
import { StatusBadge, SeverityBadge } from "./StatusBadge";
import { Card } from "@/components/ui/card";
import { Calendar, Clock, MapPin, User } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Props {
  occurrence: Occurrence;
  onClick: () => void;
}

export function OccurrenceCard({ occurrence, onClick }: Props) {
  const updatedDate = new Date(occurrence.updatedAt);
  const isOverdue = occurrence.deadline && new Date(occurrence.deadline) < new Date() && !["concluida", "cancelada"].includes(occurrence.status);

  return (
    <Card
      onClick={onClick}
      className="cursor-pointer border border-border bg-card p-4 transition-all hover:shadow-md hover:border-primary/30 group"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-xs font-mono text-muted-foreground">{occurrence.id}</span>
        <StatusBadge status={occurrence.status} />
      </div>

      <h3 className="text-sm font-semibold text-card-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
        {occurrence.title}
      </h3>

      <div className="flex flex-wrap gap-1.5 mb-3">
        <SeverityBadge severity={occurrence.severity} />
        <span className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
          {TYPE_LABELS[occurrence.type]}
        </span>
      </div>

      <div className="space-y-1 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <MapPin className="h-3 w-3" />
          <span className="truncate">{occurrence.branch}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <User className="h-3 w-3" />
          <span>{occurrence.responsible}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3 w-3" />
            <span>{format(new Date(occurrence.createdAt), "dd/MM/yy", { locale: ptBR })}</span>
          </div>
          {isOverdue && (
            <span className="text-destructive font-medium flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Atrasada
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
